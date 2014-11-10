{arrayGroupBy, flatten} = require '../common/helpers'

DOMAIN = /// ^ [^:]+:/+([^/]+) ///

exports.Divider =
class Divider
  constructor: (rulesArray) ->
    @updateRules rulesArray ? null

  canDivide: -> !!@rules

  updateRules: (rulesArray) ->
    return @rules = null unless rulesArray

    rulesArray ?= []
    rules = {}
    for rule, i in rulesArray when not rule.disable
      rules['_rule_' + i] =
        regexp:  new RegExp(rule.regexp)
        isolate: rule.isolate
    @rules = rules

  # ルールに合致する場合はルール名を
  # そうでなければドメイン名をグループ名とみなして返す
  # ドメイン名も取得できない場合は空文字''を返す
  getGroupName: (url) ->
    return ruleName for ruleName, rule of @rules when rule.regexp?.test url
    if match = DOMAIN.exec url then match[1] else ''

  groupByName: (_input) ->
    input = for item in _input
      id: item.id
      url: item.url
      name: @getGroupName item.url

    newGroups = []
    for item in input
      newGroup = null
      for group in newGroups
        if item.name is group.name
          newGroup = group
          break
      if newGroup
        newGroup.push item
      else
        newGroup = [item]
        newGroup.name = item.name
        newGroup.isolate = !!@rules[item.name]?.isolate
        newGroups.push newGroup
    newGroups

  pack: (_groups, capacity) ->
    newGroups = []

    # isolateオプションが付いているグループは
    # capacityによらず強制的に別個のグループに分ける
    [groups, isolatedGroups] = arrayGroupBy _groups,
      ((group) -> if group.isolate then 1 else 0), 2

    while groups.length
      newGroup = groups.pop()
      count = newGroup.length
      if groups.length
        for i in [groups.length-1..0]
          group = groups[i]
          len = group.length
          if count + len <= capacity
            newGroup = newGroup.concat group
            groups.splice i, 1
            count += len
      newGroups.push newGroup

    isolatedGroups.concat newGroups

  # ここで言うgroupはchromeのウィンドウ、itemはchromeのタブに相当する
  #
  # 分割手順は次のようになる
  #  1. それぞれの要素にグループ名をつける(デフォルトではドメイン名)
  #  2. グループ名でグループ分けしてグループの配列を作る
  #     => [ [<グループ名1を持つ要素>, ...],
  #          [<グループ名2を持つ要素>, ...],
  #          ...]
  #  3. グループの配列をグループの要素数が多い順にソートする
  #  4. 要素の多いグループから順にcapacityを超えないように新しいグループの配列へと詰め込んでいく
  #     要素の多いグループを詰め込めるか試す
  #     capacityを超えるなら次に要素の少ないグループが詰め込めるか試す
  # rules:
  #   グループ名の生成ルール
  #   グループは正規表現による一致か、グループ名(文字列)のリストを指定できる
  #   例
  #   [ /\bdoc/, /game/, /^chrome|extensions/, ['http://docs.angularjs.org/', 'backbonejs.org'] ]
  divide: (input, size) ->
    throw new Error 'cannot divide' unless @canDivide()

    groups = @groupByName(input).sort((a, b) -> b.length - a.length)
    @pack groups, size
      .map (div) ->
        flatten(div).sort((a,b) -> a.url > b.url)
