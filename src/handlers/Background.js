import * as optionsActions from '../actions/Options';
import configureStore from '../store/configureStore';
import {
  getTabsNeedToBeSorted,
  debouncedSetBadge,
  divideIntoWindows
} from '../utils/BackgroundUtils';
import {
  getAllWindows,
  getCurrentWindow,
  moveTabs
} from '../utils/ChromeAPIWrapper';
import { CHROME_OPTIONS_UPDATE_STATE } from '../constants/Actions';

const store = configureStore();
let state = store.getState();
store.subscribe(() => state = store.getState());
store.dispatch(optionsActions.load());

export const onMessageReceived = (request, sender, sendResponse) => {
  if (request.type === CHROME_OPTIONS_UPDATE_STATE) {
    store.dispatch(optionsActions.loadWithState(request.state));
    sendResponse({ error: null });
  }
};

// ------------------------------------------------------------------------------
// 各種イベントハンドラ
// ------------------------------------------------------------------------------

// ウィンドウにタブが追加された時にウィンドウ内のタブをソート
// 今は、タブが新規作成された場合のみで
// 別ウィンドウから持ってきた時などは無視している
export const onTabsCreated = () => {
  getCurrentWindow({ populate: true }).then(({ tabs }) => {
    const { tabsPerWindow } = state.tabs;

    if (tabs.length <= tabsPerWindow) {
      return;
    }

    divideIntoWindows(tabs, tabsPerWindow, state.rules.itemsById, true);
  });

  debouncedSetBadge();
};

// タブ更新時にソート
export const onTabsUpdated = (newTabId, { status }, { url: newTabUrl }) => {
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
export const onBrowserActionClicked = () => {
  getAllWindows({ populate: true }).then((windows) => {
    divideIntoWindows(getTabsNeedToBeSorted(windows), state.tabs.tabsPerWindow, state.rules.itemsById);
  });
};

export const onTabsRemoved = debouncedSetBadge;
