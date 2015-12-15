import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_MODIFY_REGEXP_BY_ID,
  RULES_TOGGLE_DISABLE_BY_ID,
  RULES_TOGGLE_ISOLATE_BY_ID,
  RULES_MOVE_TO_GROUP_BY_ID,
  RULES_ADD,
  RULES_REMOVE_BY_ID
} from '../constants/ActionTypes';

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

export const moveToGroupById = (ruleId, groupId) => {
  return {
    type: RULES_MOVE_TO_GROUP_BY_ID,
    id: ruleId,
    groupId
  };
};

export const modifyRegExpById = (id, text) => {
  return {
    type: RULES_MODIFY_REGEXP_BY_ID,
    id,
    text
  };
};

export const toggleDisableById = (id) => {
  return {
    type: RULES_TOGGLE_DISABLE_BY_ID,
    id
  };
};

export const toggleIsolateById = (id) => {
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

export const removeById = (id) => {
  return {
    type: RULES_REMOVE_BY_ID,
    id
  };
};
