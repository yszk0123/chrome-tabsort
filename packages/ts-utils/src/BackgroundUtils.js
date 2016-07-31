import _ from 'lodash';
import { condition, validateId } from './CommonUtils';
import divideTabs from './divideTabs';
import {
  createWindow,
  getAllWindows,
  getCurrentWindow,
  getTab,
  moveTabs,
  queryAgainstTabs,
  setBadgeBackgroundColor,
  setBadgeText,
  updateWindow,
} from './ChromeExtensionsAPIWrapper';

const SET_BADGE_DEBOUNCE = 200;

const moveTabsToNewWindowById = (tabIds, windowRect) => {
  if (!tabIds.length || !tabIds.every(validateId)) {
    return Promise.resolve();
  }

  const [firstTabId, ...restTabIds] = tabIds;

  return createWindow({
    tabId: firstTabId,
    left: windowRect.left,
    top: windowRect.top,
    width: windowRect.width,
    height: windowRect.height,
  })
    .then(({ id: windowId }) => {
      if (!restTabIds.length) {
        return Promise.resolve();
      }

      return moveTabs(tabIds, { windowId, index: -1 });
    });
};

export const divideIntoWindows = (windows, tabsPerWindow, rulesById, oneWindow = false) => {
  let dividedWindows = null;

  try {
    dividedWindows = divideTabs({
      rulesById,
      windows,
      capacity: tabsPerWindow,
    });
  } catch (error) {
    return Promise.reject(error);
  }

  if (oneWindow && dividedWindows.length === 1) {
    return Promise.resolve();
  }

  return queryAgainstTabs({ active: true, currentWindow: true })
    .then((activeTabs) => {
      if (!activeTabs.length) {
        return Promise.resolve();
      }

      const currentTabId = activeTabs[0].id;

      const promises = dividedWindows
        .map((wnd) => {
          const tabIds = wnd.tabs.map((tab) => tab.id);
          return moveTabsToNewWindowById(tabIds, wnd);
        });

      return Promise.all(promises)
        .then(() => getTab(currentTabId))
        .then(({ windowId }) => updateWindow(windowId, { focused: true }));
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
      .then((wnds) => wnds.reduce((sum, wnd) => sum + wnd.tabs.length, 0));
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
    });
};

export const debouncedSetBadge = _.debounce(setBadge, SET_BADGE_DEBOUNCE);
