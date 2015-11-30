import { find } from 'lodash'

import { validateId } from '../utils/utils'
import optionsActions from '../actions/options'
import store from '../store'
import { executeTabSort } from '../utils/WindowUtils'
import {
  CHROME_OPTIONS_UPDATE_STATE
} from '../constants/Actions'

// let activeTabId = null

let state
store.subscribe((nextState) => state = nextState)
optionsActions.load()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === CHROME_OPTIONS_UPDATE_STATE) {
    store.dispatch(optionsActions.updateState(request.state))
    sendResponse({ error: null })
  }
})

// ------------------------------------------------------------------------------
// 補助関数
// ------------------------------------------------------------------------------

const getActiveWindow = (groups, currentTabId) => {
  return find(groups, (tabGroup) => tabGroup.some((tab) => tab.id === currentTabId))
}

const divide = (list, tabsPerWindow, oneWindow = false) => {
  let groups

  try {
    divider.updateRules(state.rules)
    groups = divider.divide(list, tabsPerWindow)
  }
  catch (err) {
    console.log('error: maybe rules are invalid. please access options.html and correct rules')
    console.log(err)
    return
  }
  if (oneWindow && groups.length === 1) {
    return
  }
  
  // タブの移動でアクティブなタブが変わるのを防ぐ
  // TODO: 実装する
  // if activeTabId?
  //  active = getActiveWindow groups, activeTabId
  //  moveToTail groups, active if active?

  groups.forEach((tabGroup) => {
    const tabIds = tabGroup.map((tab) => tab.id)
    if (tabIds.length && tabIds.every(validateId)) {
      chrome.windows.create({ tabId: tabIds.shift() }, (wnd) => {
        if (tabIds.length) {
          chrome.tabs.move(tabIds, { windowId: wnd.id, index: -1 })
        }
      })
    }
  })
}

// オプション (デフォルトはmulti)
//   single: カレントウィンドウのタブ数
//   multi:  全ウィンドウのタブ数
//   all:    multiと同様
//   both:   カレントウィンドウ+カレントウィンドウのタブ数
//           戻り値は次のような配列として返される
//           [<カレントウィンドウのタブ数>, <全ウィンドウのタブ数>]
const getTabCount = (opts, cb) => {
  if (typeof(cb) !== 'function') {
    return
  }

  // デフォルトは全ウィンドウのタブ数
  if (!opts) {
    opts = { multi: true }
  }

  if (opts.single) {
    chrome.windows.getCurrent({ populate: true }, (wnd) => {
      cb(null, wnd.tabs.length)
    })
  }
  else if (opts.multi || opts.all) {
    chrome.windows.getAll({ populate: true }, (wnds) => {
      const count = wnds.reduce((sum, wnd) => sum + wnd.tabs.length, 0)
      cb(null, count)
    })
  }
  else if (opts.both) {
    getTabCount({ single: true }, (err1, current) => {
      getTabCount({ multi: true }, (err2, all) => {
        cb(err1 || err2, [current, all])
      })
    })
  }
  else {
    cb('invalid options')
  }
}

const condition = (...args) => {
  const last = args.length - (args.length % 2)
  for (let i = 0; i < last; i += 2) {
    if (args[i]) {
      return args[i + 1]
    }
  }
  return args[last]
}

const setBadge = () =>
  getTabCount({ multi: true }, (err, count) => {
    if (err) {
      return
    }
    const color = condition(
      count < 10, [ 24,  24, 240, 255],
      count < 20, [ 24, 240, 240, 255],
      count < 30, [ 24, 240,  24, 255],
      count < 40, [240, 240,  24, 255],
      [240, 24, 24, 255]
    )
    chrome.browserAction.setBadgeText({ text: String(count) })
    chrome.browserAction.setBadgeBackgroundColor({ color: color })
  })

// ------------------------------------------------------------------------------
// 各種イベントハンドラ
// ------------------------------------------------------------------------------

// ウィンドウにタブが追加された時にウィンドウ内のタブをソート
// 今は、タブが新規作成された場合のみで
// 別ウィンドウから持ってきた時などは無視している
chrome.tabs.onCreated.addListener((tab) => {
  chrome.windows.getCurrent({ populate: true }, (wnd) => {
    const tabsPerWindow = state.tabsPerWindow
    if (wnd.tabs.length > tabsPerWindow) {
      divide(wnd.tabs, tabsPerWindow, true)
    }
  })
  setBadge()
})

chrome.tabs.onRemoved.addListener((tab) => setBadge())

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   activeTabId = activeInfo.tabId
// })

// タブ更新時にソート
chrome.tabs.onUpdated.addListener((tabId, changeInfo, targetTab) => {
  if (changeInfo.status !== 'complete' || targetTab.url === 'chrome://newtab/') {
    return
  }
  chrome.windows.getCurrent({ populate: true }, (wnd) => {
    const newTab = { id: tabId, url: targetTab.url }
    wnd.tabs.forEach((tab, i) => {
      if (newTab.url <= tab.url && i < wnd.tabs.length && tab.id !== newTab.id) {
        chrome.tabs.move(newTab.id, { index: i })
      }
    })
  })
})

// ブラウザ右上のボタンクリックで全ウィンドウのタブをソート
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.windows.getAll({ populate: true }, (windows) => {
    let list = []
    windows.forEach((wnd) => {
      if (wnd.type === 'normal') {
        wnd.tabs.forEach((tab) => {
          list.push({ id: tab.id, url: tab.url })
        })
      }
    })
    const tabsPerWindow = state.tabsPerWindow
    divide(list, tabsPerWindow)
  })
})
