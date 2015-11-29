import {
  TABS_UPDATE_TABS_PER_WINDOW_BY
} from '../constants/Actions'

export const udpateTabsPerWindowBy = (value) => {
  return {
    type: OPTIONS_UPDATE_TABS_PER_WINDOW_BY,
    value
  }
}
