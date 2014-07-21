
# 共通設定の取得/設定手段を提供
config =
  get: (key) ->
    localStorage.getItem key
  set: (key, value) ->
    localStorage.setItem key, value

# 通知出力用
notify = console.log.bind(console)

# エラー出力用
error = console.log.bind(console)

# 有効なIDかどうか確かめる
validateId = (id) ->
  Number.isFinite(id)
#validateIds = (ids) ->
#  return false for id in ids when not Number.isFinite(id)
#  true

# 該当要素を配列の最後尾に移動する
moveToTail = (arr, target) ->
  index = arr.indexOf(target)
  arr.push arr.splice(index, 1)[0] if index isnt -1

# export
TabSort.Helpers = {config, notify, error, validateId, moveToTail}
