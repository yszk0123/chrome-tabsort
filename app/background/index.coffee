{error, moveToTail, notify, Storage, validateId} = require './helpers'
{divideNode} = require './divider'

activeTabId = null
storage = new Storage
  tabsPerWindow: type: 'number', default: 10
  rules: type: 'array', default: []

# ------------------------------------------------------------------------------
# 補助関数
# ------------------------------------------------------------------------------

getActiveWindow = (groups, currentTabId) ->
  for tabGroup in groups
    for tab in tabGroup
      if currentTabId is tab.id
        return tabGroup
  null

divide = (list, tabsPerWindow, oneWindow=false) ->
  try
    groups = divideNode list, tabsPerWindow, storage.get('rules')
  catch err
    console.log 'error: invalid json string. please access options.html and correct rules option'
    console.log err
    return
  return if oneWindow and groups.length is 1
  
  # タブの移動でアクティブなタブが変わるのを防ぐ
  # TODO: 実装する
  #if activeTabId?
  #  active = getActiveWindow groups, activeTabId
  #  moveToTail groups, active if active?

  for tabGroup in groups
    tabIds = (tab.id for tab in tabGroup)
    if tabIds.length and tabIds.every(validateId)
      do (tabIds) ->
        chrome.windows.create {tabId: tabIds.shift()}, (wnd) ->
          chrome.tabs.move tabIds, windowId: wnd.id, index: -1 if tabIds.length
    null

# オプション (デフォルトはmulti)
#   single: カレントウィンドウのタブ数
#   multi:  全ウィンドウのタブ数
#   all:    multiと同様
#   both:   カレントウィンドウ+カレントウィンドウのタブ数
#           戻り値は次のような配列として返される
#           [<カレントウィンドウのタブ数>, <全ウィンドウのタブ数>]
getTabCount = (opts, cb) ->
  return if typeof(cb) != 'function'

  # デフォルトは全ウィンドウのタブ数
  opts = {multi: true} unless opts
  
  if opts.single
    chrome.windows.getCurrent {populate: true}, (wnd) ->
      cb null, wnd.tabs.length
  else if opts.multi or opts.all
    chrome.windows.getAll {populate: true}, (wnds) ->
      count = 0
      count += wnd.tabs.length for wnd in wnds
      cb null, count
  else if opts.both
    getTabCount {single: true}, (err1, current) ->
      getTabCount {multi: true}, (err2, all) ->
        cb (err1 or err2), [current, all]
  else
    cb 'invalid options'

setBadge = ->
  getTabCount {multi: true}, (err, count) ->
    return if err
    color = switch
      when count < 10 then [ 24,  24, 240, 255]
      when count < 20 then [ 24, 240, 240, 255]
      when count < 30 then [ 24, 240,  24, 255]
      when count < 40 then [240, 240,  24, 255]
      else [240, 24, 24, 255]
    chrome.browserAction.setBadgeText text: ''+count
    chrome.browserAction.setBadgeBackgroundColor color: color

# ------------------------------------------------------------------------------
# 各種イベントハンドラ
# ------------------------------------------------------------------------------

# ウィンドウにタブが追加された時にウィンドウ内のタブをソート
# 今は、タブが新規作成された場合のみで
# 別ウィンドウから持ってきた時などは無視している
chrome.tabs.onCreated.addListener (tab) ->
  chrome.windows.getCurrent {populate: true}, (wnd) ->
    tabsPerWindow = storage.get('tabsPerWindow')
    if wnd.tabs.length > tabsPerWindow
      divide wnd.tabs, tabsPerWindow, true
  setBadge()

chrome.tabs.onRemoved.addListener (tab) ->
  setBadge()

#
chrome.tabs.onActivated.addListener (activeInfo) ->
  activeTabId = activeInfo.tabId

# タブ更新時にソート
chrome.tabs.onUpdated.addListener (tabId, changeInfo, targetTab) ->
  return if changeInfo.status != 'complete' or targetTab.url is 'chrome://newtab/'
  chrome.windows.getCurrent {populate: true}, (wnd) ->
    newTab = id: tabId, url: targetTab.url
    for tab, i in wnd.tabs
      if newTab.url <= tab.url
        if i < wnd.tabs.length and tab.id isnt newTab.id
          chrome.tabs.move newTab.id, index: i
        return

# ブラウザ右上のボタンクリックで全ウィンドウのタブをソート
chrome.browserAction.onClicked.addListener (tab) ->
  chrome.windows.getAll {populate: true}, (windows) ->
    list = []
    for wnd in windows when wnd.type is 'normal'
      for tab in wnd.tabs
        list.push id: tab.id, url: tab.url
    tabsPerWindow = storage.get('tabsPerWindow')
    divide list, tabsPerWindow
