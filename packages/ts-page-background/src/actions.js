import {
  debouncedSetBadge,
  divideIntoWindows
} from '../utils/BackgroundUtils';
import {
  getAllWindows,
  getCurrentWindow,
  moveTabs
} from '../utils/ChromeExtensionsAPIWrapper';

// ウィンドウ内のタブをソート
// 現状では、タブが新規作成された場合のみで
// 別ウィンドウから持ってきた時などは無視している
export const executeDivideTabsInOneWindow = () => (dispatch, getState) => {
  const {
    tabs: { tabsPerWindow },
    rules: { itemsById }
  } = getState();

  return getCurrentWindow({ populate: true })
    .then((wnd) => {
      if (wnd.tabs.length <= tabsPerWindow) {
        return;
      }

      divideIntoWindows([wnd], tabsPerWindow, itemsById, true);
    });
};

export const sortTabsInWindow = (newTabId, status, newTabUrl) => (dispatch, getState) => {
  if (status !== 'complete' || newTabUrl === 'chrome://newtab/') {
    return;
  }

  return getCurrentWindow({ populate: true })
    .then((wnd) => {
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

export const executeDivideTabsInAllWindows = () => (dispatch, getState) => {
  const {
    tabs: { tabsPerWindow },
    rules: { itemsById }
  } = getState();

  return getAllWindows({ populate: true })
    .then((windows) => {
      divideIntoWindows(windows, tabsPerWindow, itemsById);
    });
};

export const setBadge = () => (dispatch) => {
  return debouncedSetBadge();
};
