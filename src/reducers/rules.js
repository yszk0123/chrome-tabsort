import { compose } from 'redux';

import { setIn, updateIn, pushIn, removeIn, omitIn } from '../utils/Mutation';
import { validateRegExp } from '../utils/utils';
import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_MOVE_TO_GROUP_BY_ID,
  RULES_MODIFY_REGEXP_BY_ID,
  RULES_TOGGLE_DISABLE_BY_ID,
  RULES_TOGGLE_ISOLATE_BY_ID,
  RULES_ADD,
  RULES_REMOVE_BY_ID
} from '../constants/Actions';

const initialState = {
  itemIds: [],
  itemsById: {}
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

const not = (x) => !x;

export default (state = initialState, action) => {
  const { index: i } = action;

  switch (action.type) {
    case RULES_MOVE_TO_PREVIOUS: {
      return setIn(['itemIds'], swapInArrayIfPossible(state.itemIds, i - 1, i), state);
    }
    case RULES_MOVE_TO_NEXT: {
      return setIn(['itemIds'], swapInArrayIfPossible(state.itemIds, i, i + 1), state);
    }
    case RULES_MOVE_TO_GROUP_BY_ID: {
      return setIn(['itemsById', action.id, 'groupId'], action.groupId, state);
    }
    case RULES_MODIFY_REGEXP_BY_ID: {
      return compose(
        setIn(['itemsById', action.id, 'matchingText'], action.text),
        setIn(['itemsById', action.id, 'valid'], validateRegExp(action.text))
      )(state);
    }
    case RULES_TOGGLE_DISABLE_BY_ID: {
      return updateIn(['itemsById', action.id, 'disable'], not, state);
    }
    case RULES_TOGGLE_ISOLATE_BY_ID: {
      return updateIn(['itemsById', action.id, 'isolate'], not, state);
    }
    case RULES_ADD: {
      return compose(
        pushIn(['itemIds'], [action.value.id]),
        setIn(['itemsById', action.value.id], action.value)
      )(state);
    }
    case RULES_REMOVE_BY_ID: {
      const index = state.itemIds.findIndex((id) => id === action.id);
      if (index < 0) {
        return state;
      }

      return compose(
        removeIn(['itemIds'], index),
        omitIn(['itemsById'], action.id)
      )(state);
    }
    default: {
      return state;
    }
  }
};
