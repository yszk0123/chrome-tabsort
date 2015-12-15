import _ from 'lodash';

import { validateId } from '../utils/Utils';
import divide from '../utils/divide';
import {
  createWindow,
  getAllWindows,
  getCurrentWindow,
  getTab,
  moveTabs,
  queryAgainstTabs,
  setBadgeBackgroundColor,
  setBadgeText,
  updateWindow
} from '../utils/ChromeAPIWrapper';
import OptionsConfig from '../constants/Options';

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

export const divideTabsIntoWindows = (list, tabsPerWindow, rulesById, oneWindow = false) => {
  let groups = null;

  try {
    groups = divide({
      rulesById,
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
          const tabIds = group.map(({ id }) => id);
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

export const debouncedSetBadge = _.debounce(setBadge, OptionsConfig.setBadgeDebounce);

export const getTabsNeedToBeSorted = (windows) => {
  return windows
    .filter((wnd) => wnd.type === 'normal')
    .reduce((list, wnd) => {
      return list.concat(wnd.tabs.map(({ id, url }) => ({ id, url })));
    }, []);
};
