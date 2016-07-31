import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_MODIFY_REGEXP_BY_ID,
  RULES_TOGGLE_DISABLE_BY_ID,
  RULES_TOGGLE_ISOLATE_BY_ID,
  RULES_MOVE_TO_GROUP_BY_ID,
  RULES_ADD,
  RULES_REMOVE_BY_ID,
} from './constants';

export const moveToPrevious = (index) => ({
  type: RULES_MOVE_TO_PREVIOUS,
  index,
});

export const moveToNext = (index) => ({
  type: RULES_MOVE_TO_NEXT,
  index,
});

export const moveToGroupById = (ruleId, groupId) => ({
  type: RULES_MOVE_TO_GROUP_BY_ID,
  id: ruleId,
  groupId,
});

export const modifyRegExpById = (id, text) => ({
  type: RULES_MODIFY_REGEXP_BY_ID,
  id,
  text,
});

export const toggleDisableById = (id) => ({
  type: RULES_TOGGLE_DISABLE_BY_ID,
  id,
});

export const toggleIsolateById = (id) => ({
  type: RULES_TOGGLE_ISOLATE_BY_ID,
  id,
});

export const add = (value) => ({
  type: RULES_ADD,
  value,
});

export const removeById = (id) => ({
  type: RULES_REMOVE_BY_ID,
  id,
});
