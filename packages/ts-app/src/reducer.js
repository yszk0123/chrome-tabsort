import assign from 'object-assign';
import { combineReducers } from 'redux';
import * as Background from 'ts-page-background';
import * as Options from 'ts-page-options';
import * as Rules from 'ts-containers-rules';

const { OPTIONS_UPDATE_STATE } = Options;

const reducer = combineReducers(assign(
  Options.reducers,
  Rules.reducers,
  Background.reducers
));

export default (state, action) => {
  let nextState = state;
  if (action.type === OPTIONS_UPDATE_STATE) {
    nextState = action.state;
  }

  return reducer(nextState, action);
};
