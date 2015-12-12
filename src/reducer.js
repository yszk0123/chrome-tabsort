import { combineReducers } from 'redux';

import options from './reducers/options';
import rules from './reducers/rules';
import tabs from './reducers/tabs';
import {
  OPTIONS_UPDATE_STATE
} from './constants/Actions';

const reducer = combineReducers({
  options,
  rules,
  tabs
});

export default (state, action) => {
  if (action.type === OPTIONS_UPDATE_STATE) {
    return action.state;
  }

  return reducer(state, action);
};
