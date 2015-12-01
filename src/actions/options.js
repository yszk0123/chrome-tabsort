import {
  CHROME_OPTIONS_UPDATE_STATE,
  OPTIONS_LOAD_START_WITH_STATE,
  OPTIONS_LOAD_START,
  OPTIONS_LOAD_SUCCESS,
  OPTIONS_LOAD_FAILURE,
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SAVE_FAILURE,
  OPTIONS_UPDATE_STATE
} from '../constants/Actions'
import OptionsConfig from '../constants/Options'
import * as storage from '../utils/simpleStorage'

export const load = () => (dispatch) => {
  dispatch({ type: OPTIONS_LOAD_START })

  const state = storage.get(OptionsConfig.storageKey)

  if (!state) {
    return dispatch({ type: OPTIONS_LOAD_FAILURE })
  }

  dispatch({ type: OPTIONS_LOAD_SUCCESS, state })
  dispatch({ type: OPTIONS_UPDATE_STATE, state })
}

export const loadWithState = (state) => (dispatch) => {
  dispatch({ type: OPTIONS_LOAD_START_WITH_STATE, state })
  dispatch({ type: OPTIONS_LOAD_SUCCESS, state })
  dispatch({ type: OPTIONS_UPDATE_STATE, state })
}

export const save = () => (dispatch, getState) => {
  dispatch({ type: OPTIONS_SAVE_START })

  const state = getState()

  storage.set(OptionsConfig.storageKey, state)

  const message = {
    type: CHROME_OPTIONS_UPDATE_STATE,
    state
  }

  chrome.runtime.sendMessage(message, (response) => {
    if (!response || response.error) {
      dispatch({ type: OPTIONS_SAVE_FAILURE, error: response.error })
      return
    }

    setTimeout(() => {
      dispatch({ type: OPTIONS_SAVE_SUCCESS })
    }, OptionsConfig.timeout)
  })
}
