import {
  OPTIONS_LOAD_START,
  OPTIONS_LOAD_SUCCESS,
  OPTIONS_LOAD_FAILURE,
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SAVE_FAILURE,
  OPTIONS_UPDATE
} from '../constants/Actions'
import OptionsConfig from '../constants/Options'
import * as storage from '../utils/simpleStorage'

export const load = () => (dispatch) => {
  dispatch({ type: OPTIONS_LOAD_START })

  const data = storage.get(OptionsConfig.storageKey)

  if (!data) {
    return dispatch({ type: OPTIONS_LOAD_FAILURE, data })
  }

  dispatch({ type: OPTIONS_LOAD_SUCCESS, data })
}

export const save = () => (dispatch, getState) => {
  dispatch({ type: OPTIONS_SAVE_START })

  storage.set(OptionsConfig.storageKey, getState())

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
