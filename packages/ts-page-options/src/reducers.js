import {
  OPTIONS_SAVE_START,
  OPTIONS_SAVE_SUCCESS,
  OPTIONS_SERIALIZE,
  OPTIONS_UPDATE_SERIALIZED_STATE
} from './constants';

const initialState = {
  saving: false
};

function optionsReducer(state = initialState, action) {
  switch (action.type) {
    case OPTIONS_SAVE_START:
      return {
        ...state,
        saving: true
      };
    case OPTIONS_SAVE_SUCCESS:
      return {
        ...state,
        saving: false
      };
    case OPTIONS_SERIALIZE:
      return {
        ...state,
        serializedState: action.value
      };
    case OPTIONS_UPDATE_SERIALIZED_STATE:
      return {
        ...state,
        serializedState: action.value
      };
    default:
      return state;
  }
}

export default {
  options: optionsReducer
};
