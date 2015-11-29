import {
  OPTIONS_LOAD_START,
  OPTIONS_LOAD_SUCCESS,
  OPTIONS_LOAD_FAILURE,
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
    case OPTIONS_LOAD_SUCCESS:
      // TODO: 他の reducer を通過させる
      return {
        ...state,
        ...action.data
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
