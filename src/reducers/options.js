import {
  OPTIONS_LOAD,
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SAVE_FAILURE,
  OPTIONS_UPDATE
} from '../constants/Actions'

const initialState = {
  saving: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case OPTIONS_LOAD:
      return {
        ...state,
        saving: true
      }
    case OPTIONS_SAVE_START:
      return {
        ...state,
        saving: true
      }
    case OPTIONS_SAVE_SUCCESS:
      return {
        ...state,
        saving: false
      }
    case OPTIONS_UPDATE:
      return {
        ...state,
        ...action.value
      }
    default:
      return state
  }
}
