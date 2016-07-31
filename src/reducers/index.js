import assign from 'object-assign';
import { combineReducers } from 'redux';
import * as Background from 'ts-page-background';
import * as Options from 'ts-page-options';
import * as Rules from 'ts-containers-rules';
import { OPTIONS_UPDATE_STATE } from 'ts-page-options';

const reducer = combineReducers(assign(
  Options.reducers,
  Rules.reducers,
  Background.reducers
));

export default (state, action) => {
  if (action.type === OPTIONS_UPDATE_STATE) {
    state = action.state;
  }

  return reducer(state, action);
};
