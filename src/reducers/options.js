import {
  OPTIONS_LOAD_START,
  OPTIONS_LOAD_SUCCESS,
  OPTIONS_LOAD_FAILURE,
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SAVE_FAILURE,
  OPTIONS_SERIALIZE,
  OPTIONS_DESERIALIZE_FAILURE,
  OPTIONS_UPDATE_SERIALIZED_STATE
} from '../constants/Actions'

const initialState = {
  saving: false
}

export default (state = initialState, action) => {
  switch (action.type) {
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
    case OPTIONS_SERIALIZE:
      return {
        ...state,
        serializedState: action.value
      }
    case OPTIONS_UPDATE_SERIALIZED_STATE:
      return {
        ...state,
        serializedState: action.value
      }
    default:
      return state
  }
}
