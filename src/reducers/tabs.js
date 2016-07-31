import {
  TABS_UPDATE_TABS_PER_WINDOW_BY,
  TABS_UPDATE_TABS_PER_WINDOW
} from '../constants/ActionTypes';
import OptionsConfig from '../constants/Options';

const MIN_TABS_PER_WINDOW = 1;
const MAX_TABS_PER_WINDOW = 10000;

const initialState = {
  tabsPerWindow: 10
};

const clipInRange = (n, min, max) => {
  if (n < min) {
    return min;
  }

  if (n > max) {
    return max;
  }

  return n;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TABS_UPDATE_TABS_PER_WINDOW_BY:
      return {
        ...state,
        tabsPerWindow: clipInRange(
          state.tabsPerWindow + action.value,
          MIN_TABS_PER_WINDOW,
          MAX_TABS_PER_WINDOW
        )
      };
    case TABS_UPDATE_TABS_PER_WINDOW:
      return {
        ...state,
        tabsPerWindow: clipInRange(
          action.value,
          MIN_TABS_PER_WINDOW,
          MAX_TABS_PER_WINDOW
        )
      };
    default:
      return state;
  }
};
