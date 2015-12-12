import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_MODIFY_REGEXP_BY_ID,
  RULES_TOGGLE_DISABLE_BY_ID,
  RULES_TOGGLE_ISOLATE_BY_ID,
  RULES_ADD,
  RULES_REMOVE_BY_ID
} from '../constants/Actions';

export const moveToPrevious = (index) => {
  return {
    type: RULES_MOVE_TO_PREVIOUS,
    index
  };
};

export const moveToNext = (index) => {
  return {
    type: RULES_MOVE_TO_NEXT,
    index
  };
};

export const modifyRegExpAt = (id, text) => {
  return {
    type: RULES_MODIFY_REGEXP_BY_ID,
    id,
    text
  };
};

export const toggleDisableAt = (id) => {
  return {
    type: RULES_TOGGLE_DISABLE_BY_ID,
    id
  };
};

export const toggleIsolateAt = (id) => {
  return {
    type: RULES_TOGGLE_ISOLATE_BY_ID,
    id
  };
};

export const add = (value) => {
  return {
    type: RULES_ADD,
    value
  };
};

export const removeAt = (id) => {
  return {
    type: RULES_REMOVE_BY_ID,
    id
  };
};
