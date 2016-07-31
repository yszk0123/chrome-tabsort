import {
  TABS_UPDATE_TABS_PER_WINDOW_BY,
  TABS_UPDATE_TABS_PER_WINDOW
} from '../constants';

export const updateTabsPerWindowBy = (value) => {
  type: TABS_UPDATE_TABS_PER_WINDOW_BY,
  value
});

export const updateTabsPerWindow = (value) => ({
  type: TABS_UPDATE_TABS_PER_WINDOW,
  value
});
