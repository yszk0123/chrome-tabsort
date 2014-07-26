
DOMAIN = /// ^ [^:]+:/+([^/]+) ///

# ルールに合致する場合はルール名を
# そうでなければドメイン名をグループ名とみなして返す
# ドメイン名も取得できない場合は空文字''を返す
getGroupName = (url, rules) ->
  return ruleName for ruleName, rule of rules when rule.regexp?.test url
  if match = DOMAIN.exec url then match[1] else ''

wrap = (input, rules) ->
  for item in input
    id:   item.id
    url:  item.url
    name: getGroupName item.url, rules

groupByName = (input, rules) ->
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
      newGroup.name    = item.name
      newGroup.isolate = !!rules[item.name]?.isolate
      newGroups.push newGroup
  newGroups

pack = (groups, capacity) ->
  newGroups = []
  isolatedGroups = []

  # isolateオプションが付いているグループは
  # capacityによらず強制的に別個のグループに分ける
  for i in [groups.length-1..0]
    group = groups[i]
    if group.isolate
      isolatedGroups.push group
      groups.splice i, 1
      
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
  
  newGroups.concat isolatedGroups

flatten = (out) ->
  b = []
  b = b.concat a for a in out
  b

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
divideNode = (input, size, rulesArray) ->
  rulesArray = rulesArray ? []
  rules = {}
  for rule, i in rulesArray
    rules['_rule_' + i] =
      regexp:  new RegExp(rule.regexp)
      isolate: rule.isolate
  groups = wrap input, rules
  groups = groupByName groups, rules
  groups = groups.sort (a, b) -> b.length - a.length
  groups = pack groups, size
  groups = (flatten(div).sort((a,b) -> a.url > b.url) for div in groups)

#module.exports =
TabSort.Divider = {divideNode}
