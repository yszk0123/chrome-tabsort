import {
  TABS_UPDATE_TABS_PER_WINDOW_BY,
  TABS_UPDATE_TABS_PER_WINDOW
} from '../constants/Actions';

export const updateTabsPerWindowBy = (value) => {
  return {
    type: TABS_UPDATE_TABS_PER_WINDOW_BY,
    value
  };
};

export const updateTabsPerWindow = (value) => {
  return {
    type: TABS_UPDATE_TABS_PER_WINDOW,
    value
  };
};
