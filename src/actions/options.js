import {
  CHROME_OPTIONS_UPDATE_STATE,
  OPTIONS_LOAD_START_WITH_STATE,
  OPTIONS_LOAD_START,
  OPTIONS_LOAD_SUCCESS,
  OPTIONS_LOAD_FAILURE,
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SAVE_FAILURE,
  OPTIONS_UPDATE_STATE,
  OPTIONS_SERIALIZE,
  OPTIONS_DESERIALIZE_FAILURE,
  OPTIONS_UPDATE_SERIALIZED_STATE
} from '../constants/Actions'
import OptionsConfig from '../constants/Options'
import * as storage from '../utils/storage'

export const load = () => (dispatch) => {
  dispatch({ type: OPTIONS_LOAD_START })

  storage.get(OptionsConfig.storageKey)
    .then((state) => {
      dispatch({ type: OPTIONS_LOAD_SUCCESS, state })
      dispatch({ type: OPTIONS_UPDATE_STATE, state })
    })
    .catch((error) => {
      dispatch({ type: OPTIONS_LOAD_FAILURE, error })
    })
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
    .then(() => {
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
    })
    .catch((error) => {
      dispatch({ type: OPTIONS_SAVE_FAILURE, error })
    })
}

export const serialize = () => (dispatch, getState) => {
  dispatch({
    type: OPTIONS_SERIALIZE,
    value: JSON.stringify(getState())
  })
}

export const deserialize = (value) => {
  let result

  try {
    result = JSON.parse(value)
  }
  catch (err) {
    return {
      type: OPTIONS_DESERIALIZE_FAILURE
    }
  }

  return loadWithState(result)
}

export const updateSerializedState = (value) => {
  return {
    type: OPTIONS_UPDATE_SERIALIZED_STATE,
    value
  }
}
