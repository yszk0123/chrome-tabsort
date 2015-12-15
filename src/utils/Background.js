import _ from 'lodash';

import { validateId } from '../utils/Utils';
import * as optionsActions from '../actions/Options';
import configureStore from '../store/configureStore';
import OptionsConfig from '../constants/Options';
import divide from '../utils/divide';
import { getTabsNeedToBeSorted } from '../utils/BackgroundUtils';
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
import {
  CHROME_OPTIONS_UPDATE_STATE
} from '../constants/Actions';

const store = configureStore();
let state = store.getState();
store.subscribe(() => state = store.getState());
store.dispatch(optionsActions.load());

const onMessageReceived = (request, sender, sendResponse) => {
  if (request.type === CHROME_OPTIONS_UPDATE_STATE) {
    store.dispatch(optionsActions.loadWithState(request.state));
    sendResponse({ error: null });
  }
};

// ------------------------------------------------------------------------------
// 補助関数
// ------------------------------------------------------------------------------

const moveTabsToNewWindowById = (tabIds) => {
  if (!tabIds.length || !tabIds.every(validateId)) {
    return Promise.resolve();
  }

  const [firstTabId, ...restTabIds] = tabIds;

  return createWindow({ tabId: firstTabId })
    .then(({ id: windowId }) => {
      if (!restTabIds.length) {
        return;
      }

      return moveTabs(tabIds, { windowId, index: -1 });
    });
};

const divideIntoWindows = (list, tabsPerWindow, oneWindow = false) => {
  let groups = null;

  try {
    groups = divide({
      rulesById: state.rules.itemsById,
      items: list,
      capacity: tabsPerWindow
    });
  }
  catch (err) {
    // TODO: Better error handling
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

      const currentTabId = activeTabs[0].id;

      const promises = groups
        .map((group) => {
          const tabIds = group.map(({ id }) => id)
          return moveTabsToNewWindowById(tabIds);
        });

      return Promise.all(promises)
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
const getTabCount = (opts) => {
  // デフォルトは全ウィンドウのタブ数
  opts = opts || { multi: true };

  if (opts.single) {
    return getCurrentWindow({ populate: true })
      .then((wnd) => wnd.tabs.length);
  }

  if (opts.multi || opts.all) {
    return getAllWindows({ populate: true })
      .then((wnds) => wnds.reduce((sum, wnd) => sum + wnd.tabs.length, 0))
  }

  if (opts.both) {
    return Promise
      .all(
        getTabCount({ single: true }),
        getTabCount({ multi: true })
      )
      .then((current, all) => [current, all]);
  }

  return Promise.reject(new Error('Invalid options'));
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
  return getTabCount({ multi: true })
    .then((count) => {
      const color = condition(
        count < 10, [24, 24, 240, 255],
        count < 20, [24, 240, 240, 255],
        count < 30, [24, 240, 24, 255],
        count < 40, [240, 240, 24, 255],
        [240, 24, 24, 255]
      );
      setBadgeText({ text: String(count) });
      setBadgeBackgroundColor({ color });
    })
    // TODO: Better error handling
    .catch((error) => console.error(error));
};

const debouncedSetBadge = _.debounce(setBadge, OptionsConfig.setBadgeDebounce);

// ------------------------------------------------------------------------------
// 各種イベントハンドラ
// ------------------------------------------------------------------------------

// ウィンドウにタブが追加された時にウィンドウ内のタブをソート
// 今は、タブが新規作成された場合のみで
// 別ウィンドウから持ってきた時などは無視している
const onTabsCreated = () => {
  getCurrentWindow({ populate: true }).then(({ tabs }) => {
    const { tabsPerWindow } = state.tabs;

    if (tabs.length <= tabsPerWindow) {
      return;
    }

    divideIntoWindows(tabs, tabsPerWindow, true);
  });

  debouncedSetBadge();
};

// タブ更新時にソート
const onTabsUpdated = (newTabId, { status }, { url: newTabUrl }) => {
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
};

// ブラウザ右上のボタンクリックで全ウィンドウのタブをソート
const onBrowserActionClicked = () => {
  getAllWindows({ populate: true }).then((windows) => {
    divideIntoWindows(getTabsNeedToBeSorted(windows), state.tabs.tabsPerWindow);
  });
};

const onTabsRemoved = debouncedSetBadge;

// Event handlers
registerMessageReceived(onMessageReceived);
registerTabsCreated(onTabsCreated);
registerTabsUpdated(onTabsUpdated);
registerBrowserActionClicked(onBrowserActionClicked);
registerTabsRemoved(onTabsRemoved);
