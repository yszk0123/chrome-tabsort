{identity} = require './helpers'

# 共通設定の取得/設定手段を提供
# schemaに渡せる形式は次の通り
#   { <key>: <type> }
#   または
#   { <key>: { type: <type>, default: <defaultValue> } }
exports.Storage =
class Storage
  converterMap:
    number: [Number, String]
    string: [identity, identity]
    object: [JSON.parse, JSON.stringify]
    array: [JSON.parse, JSON.stringify]

  constructor: (schema) ->
    @typeInfoMap = {}
    @cache = {}
    for key in Object.keys(schema)
      value = schema[key]
      if typeof(value) is 'string'
        type = value
        defaultValue = null
      else
        type = value.type
        defaultValue = value.default ? null
      type = type.toLowerCase()
      throw new Error "schema type '#{type}' is unavailable" unless @converterMap.hasOwnProperty(type)
      [parse, stringify] = @converterMap[type]
      @typeInfoMap[key] = {parse, stringify, defaultValue}

  get: (key) ->
    throw new Error "'#{key}' is not registered" unless @typeInfoMap.hasOwnProperty(key)
    typeInfo = @typeInfoMap[key]

    if @cache.hasOwnProperty(key)
      obj = @cache[key]
      return obj.value unless obj.modified
    else
      obj = @cache[key] = {}
    # Note:
    #   obj.modifiedをobj.valueより先に設定してはいけない
    #   getItem()は同期的なので, ここでエラーが発生すると
    #   値を取得できていないのにobj.modifiedはfalseと言う困ったことが起こる
    value = localStorage.getItem(key)
    obj.value = if value? then typeInfo.parse(value) else typeInfo.defaultValue
    obj.modified = false
    obj.value

  set: (key, value) ->
    throw new Error "'#{key}' is not registered" unless @typeInfoMap.hasOwnProperty(key)
    typeInfo = @typeInfoMap[key]

    obj = @cache[key] ?= {}
    localStorage.setItem key, typeInfo.stringify(value)
    obj.value = value
    obj.modified = true
    obj.value

exports.storage = new Storage
  tabsPerWindow: type: 'number', default: 10
  rules: type: 'array', default: []
