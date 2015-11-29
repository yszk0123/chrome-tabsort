import {
  TABS_UPDATE_TABS_PER_WINDOW_BY,
  TABS_UPDATE_TABS_PER_WINDOW
} from '../constants/Actions'
import OptionsConfig from '../constants/Options'

const initialState = {
  tabsPerWindow: 10
}

const clipInRange = (n, min, max) => {
  if (n < min) {
    return min
  }

  if (n > max) {
    return max
  }

  return n
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TABS_UPDATE_TABS_PER_WINDOW_BY:
      return {
        ...state,
        tabsPerWindow: clipInRange(
          state.tabsPerWindow + action.value,
          OptionsConfig.minTabsPerWindow,
          OptionsConfig.maxTabsPerWindow
        )
      }
    case TABS_UPDATE_TABS_PER_WINDOW:
      return {
        ...state,
        tabsPerWindow: clipInRange(
          action.value,
          OptionsConfig.minTabsPerWindow,
          OptionsConfig.maxTabsPerWindow
        )
      }
    default:
      return state
  }
}
