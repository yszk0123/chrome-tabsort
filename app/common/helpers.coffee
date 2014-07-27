exports.identity =
identity = (a) -> a

exports.noop =
noop = ->

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

exports.flatten =
flatten = (src) ->
  dest = []
  dest = dest.concat a for a in src
  dest

exports.arrayGroupBy =
arrayGroupBy = (items, getIndex) ->
  dest = []
  for item in items
    i = getIndex item
    (dest[i] ?= []).push item
  dest

exports.pull =
pull = (src, target) ->
  for i in [src.length-1..0] by -1
    if src[i] is target
      src.splice i, 1
  src
