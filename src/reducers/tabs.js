import {
  TABS_UPDATE_TABS_PER_WINDOW_BY
} from '../constants/Actions'

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
          OptionsConfig.MinTabsPerWindow,
          OptionsConfig.MaxTabsPerWindow
        )
      }
    default:
      return state
  }
}
