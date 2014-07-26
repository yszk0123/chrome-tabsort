exports.identity =
identity = (a) -> a

exports.noop =
noop = ->

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
      obj = @cache[key] = { value: typeInfo.defaultValue, modified: false }
      return obj.value
    # Note:
    #   obj.modifiedをobj.valueより先に設定してはいけない
    #   getItem()は同期的なので, ここでエラーが発生すると
    #   値を取得できていないのにobj.modifiedはfalseと言う困ったことが起こる
    obj.value = typeInfo.parse localStorage.getItem key
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

# 通知出力用
exports.notify =
notify = console.log.bind(console)

# エラー出力用
exports.error =
error = console.log.bind(console)

# 有効なIDかどうか確かめる
exports.validateId =
validateId = (id) ->
  Number.isFinite(id)
#validateIds = (ids) ->
#  return false for id in ids when not Number.isFinite(id)
#  true

# 該当要素を配列の最後尾に移動する
exports.moveToTail =
moveToTail = (arr, target) ->
  index = arr.indexOf(target)
  arr.push arr.splice(index, 1)[0] if index isnt -1
