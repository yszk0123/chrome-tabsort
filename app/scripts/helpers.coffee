# 共通設定の取得/設定手段を提供
exports.config =
config =
  get: (key) ->
    localStorage.getItem key
  set: (key, value) ->
    localStorage.setItem key, value

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
