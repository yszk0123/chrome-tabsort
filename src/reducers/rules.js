import { compose } from 'redux';

import { setIn, updateIn, pushIn, removeIn } from '../utils/Mutation';
import { createRule } from '../utils/Rule';
import { validateRegExp } from '../utils/utils';
import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_SELECT_PREVIOUS,
  RULES_SELECT_NEXT,
  RULES_SELECT,
  RULES_MODIFY_REGEXP_AT,
  RULES_TOGGLE_DISABLE_AT,
  RULES_TOGGLE_ISOLATE_AT,
  RULES_ADD,
  RULES_REMOVE_AT
} from '../constants/Actions';

const initialState = {
  items: []
};

const swapInArrayIfPossible = (array, i, j) => {
  if (i >= j || i < 0 || j >= array.length) {
    return array;
  }

  return [
    ...array.slice(0, i),
    array[j],
    ...array.slice(i + 1, j),
    array[i],
    ...array.slice(j + 1)
  ];
};

const wrapInRange = (n, start, end) => {
  if (n < start) {
    return n + (end - start);
  }

  if (n >= end) {
    return n - (end - start);
  }

  return n;
};

const not = (x) => !x;

export default (state = initialState, action) => {
  const { index: i } = action;
  const { items } = state;

  switch (action.type) {
    case RULES_MOVE_TO_PREVIOUS: {
      return setIn(['items'], swapInArrayIfPossible(items, i - 1, i), state);
    }
    case RULES_MOVE_TO_NEXT: {
      return setIn(['items'], swapInArrayIfPossible(items, i, i + 1), state);
    }
    case RULES_SELECT: {
      return setIn(['selectedIndex'], i, state);
    }
    case RULES_MODIFY_REGEXP_AT: {
      return compose(
        setIn(['items', action.index, 'regexp'], action.text),
        setIn(['items', action.index, 'valid'], validateRegExp(action.text))
      )(state);
    }
    case RULES_TOGGLE_DISABLE_AT: {
      return updateIn(['items', action.index, 'disable'], not, state);
    }
    case RULES_TOGGLE_ISOLATE_AT: {
      return updateIn(['items', action.index, 'isolate'], not, state);
    }
    case RULES_ADD: {
      return pushIn(['items'], [createRule()], state);
    }
    case RULES_REMOVE_AT: {
      return removeIn(['items'], action.index, state);
    }
    default: {
      return state;
    }
  }
};
