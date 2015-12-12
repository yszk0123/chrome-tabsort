import { find, debounce } from 'lodash';

import { validateId } from '../utils/utils';
import * as optionsActions from '../actions/options';
import store from '../store';
import { executeTabSort } from '../utils/WindowUtils';
import OptionsConfig from '../constants/Options';
import Divider from '../utils/Divider';
import {
  CHROME_OPTIONS_UPDATE_STATE
} from '../constants/Actions';
import { getTabsNeedToBeSorted } from '../utils/backgroundUtils';
import {
  createWindow,
  getAllWindows,
  getCurrentWindow,
  getTab,
  moveTabs,
  queryAgainstTabs,
  registerBrowserActionClicked,
  registerMessageReceived,
  registerTabsCreated,
  registerTabsRemoved,
  registerTabsUpdated,
  setBadgeBackgroundColor,
  setBadgeText,
  updateWindow
} from '../utils/ChromeAPIWrapper';

let state = store.getState();
store.subscribe(() => state = store.getState());
store.dispatch(optionsActions.load());

registerMessageReceived((request, sender, sendResponse) => {
  if (request.type === CHROME_OPTIONS_UPDATE_STATE) {
    store.dispatch(optionsActions.loadWithState(request.state));
    sendResponse({ error: null });
  }
});

// ------------------------------------------------------------------------------
// 補助関数
// ------------------------------------------------------------------------------

const getActiveWindow = (groups, currentTabId) => {
  return find(groups, (tabGroup) => {
    return tabGroup.some(({ id }) => id === currentTabId);
  });
};

const divide = (list, tabsPerWindow, oneWindow = false) => {
  let groups;

  try {
    const divider = new Divider(state.rules.items);
    groups = divider.divide(list, tabsPerWindow);
  }
  catch (err) {
    console.log('Error: Maybe rules are invalid. Please open options page and correct rules');
    console.log(err);
    return Promise.reject(err);
  }
  if (oneWindow && groups.length === 1) {
    return Promise.resolve();
  }

  return queryAgainstTabs({ active: true, currentWindow: true })
    .then((activeTabs) => {
      if (!activeTabs.length) {
        return Promise.resolve();
      }
      const { id: currentTabId } = activeTabs[0];

      return Promise
        .all(groups.map((tabGroup) => {
          const tabIds = tabGroup.map(({ id }) => id);
          if (!tabIds.length || !tabIds.every(validateId)) {
            return Promise.resolve();
          }

          return createWindow({ tabId: tabIds.shift() })
            .then(({ id: windowId }) => {
              if (!tabIds.length) {
                return Promise.resolve();
              }

              return moveTabs(tabIds, { windowId, index: -1 });
            });
        }))
        .then(() => getTab(currentTabId))
        .then(({ windowId }) => {
          return updateWindow(windowId, { focused: true });
        });
    });
};

// オプション (デフォルトはmulti)
//   single: カレントウィンドウのタブ数
//   multi:  全ウィンドウのタブ数
//   all:    multiと同様
//   both:   カレントウィンドウ+カレントウィンドウのタブ数
//           戻り値は次のような配列として返される
//           [<カレントウィンドウのタブ数>, <全ウィンドウのタブ数>]
const getTabCount = (opts, callback) => {
  if (typeof (callback) !== 'function') {
    return;
  }

  // デフォルトは全ウィンドウのタブ数
  if (!opts) {
    opts = { multi: true };
  }

  if (opts.single) {
    return getCurrentWindow({ populate: true }).then((wnd) => {
      callback(null, wnd.tabs.length);
    });
  }

  if (opts.multi || opts.all) {
    return getAllWindows({ populate: true }).then((wnds) => {
      const count = wnds.reduce((sum, wnd) => sum + wnd.tabs.length, 0);
      callback(null, count);
    });
  }

  if (opts.both) {
    return getTabCount({ single: true }, (err1, current) => {
      getTabCount({ multi: true }, (err2, all) => {
        callback(err1 || err2, [current, all]);
      });
    });
  }

  callback(new Error('Invalid options'));
};

const condition = (...args) => {
  const last = args.length - (args.length % 2);

  for (let i = 0; i < last; i += 2) {
    if (args[i]) {
      return args[i + 1];
    }
  }

  return args[last];
};

const setBadge = () => {
  return getTabCount({ multi: true }, (err, count) => {
    if (err) {
      return;
    }

    const color = condition(
      count < 10, [24, 24, 240, 255],
      count < 20, [24, 240, 240, 255],
      count < 30, [24, 240, 24, 255],
      count < 40, [240, 240, 24, 255],
      [240, 24, 24, 255]
    );
    setBadgeText({ text: String(count) });
    setBadgeBackgroundColor({ color });
  });
};

const debouncedSetBadge = debounce(setBadge, OptionsConfig.setBadgeDebounce);

// ------------------------------------------------------------------------------
// 各種イベントハンドラ
// ------------------------------------------------------------------------------

// ウィンドウにタブが追加された時にウィンドウ内のタブをソート
// 今は、タブが新規作成された場合のみで
// 別ウィンドウから持ってきた時などは無視している
registerTabsCreated(() => {
  getCurrentWindow({ populate: true }).then(({ tabs }) => {
    const { tabsPerWindow } = state.tabs;

    if (tabs.length <= tabsPerWindow) {
      return;
    }

    divide(tabs, tabsPerWindow, true);
  });

  debouncedSetBadge();
});

registerTabsRemoved(debouncedSetBadge);

// タブ更新時にソート
registerTabsUpdated((newTabId, { status }, { url: newTabUrl }) => {
  if (status !== 'complete' || newTabUrl === 'chrome://newtab/') {
    return;
  }

  getCurrentWindow({ populate: true }).then((wnd) => {
    wnd.tabs.some(({ id, url }, index) => {
      if (newTabUrl > url) {
        return false;
      }

      if (newTabId === id) {
        return true;
      }

      moveTabs(newTabId, { index });
      return true;
    });
  });
});

// ブラウザ右上のボタンクリックで全ウィンドウのタブをソート
registerBrowserActionClicked(() => {
  getAllWindows({ populate: true }).then((windows) => {
    divide(getTabsNeedToBeSorted(windows), state.tabs.tabsPerWindow);
  });
});
