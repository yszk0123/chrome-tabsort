import { combineReducers } from 'redux';

import options from './reducers/options';
import rules from './reducers/rules';
import tabs from './reducers/tabs';
import {
  OPTIONS_UPDATE_STATE,
  OPTIONS_LOAD_SUCCESS
} from './constants/Actions';

const reducer = combineReducers({
  options,
  rules,
  tabs
});

export default (state, action) => {
  // if (action.type === OPTIONS_UPDATE_STATE || action.type === OPTIONS_LOAD_SUCCESS) {
  //   return state;
  // }

  if (action.type === OPTIONS_UPDATE_STATE) {
    return action.state;
  }

  return reducer(state, action);
};
