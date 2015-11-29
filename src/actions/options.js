import {
  OPTIONS_LOAD,
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SAVE_FAILURE,
  OPTIONS_UPDATE
} from '../constants/Actions'
import OptionsConfig from '../constants/Options'

export const load = () => {
  return {
    type: OPTIONS_LOAD
  }
}

export const save = () => (dispatch) => {
  dispatch({ type: OPTIONS_SAVE_START })

  setTimeout(() => {
    dispatch({ type: OPTIONS_SAVE_SUCCESS })
  }, OptionsConfig.timeout)
}

export const update = (value) => {
  return {
    type: OPTIONS_UPDATE,
    value
  }
}
