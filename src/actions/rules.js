import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_SELECT_PREVIOUS,
  RULES_SELECT_NEXT,
  RULES_SELECT,
  RULES_MODIFY_AT,
  RULES_TOGGLE_DISABLE_AT,
  RULES_TOGGLE_ISOLATE_AT,
  RULES_ADD,
  RULES_REMOVE_AT
} from '../constants/Actions'

export const moveToPrevious = () => {
  return {
    type: RULES_MOVE_TO_PREVIOUS
  }
}

export const moveToNext = () => {
  return {
    type: RULES_MOVE_TO_NEXT
  }
}

export const selectPrevious = () => {
  return {
    type: RULES_SELECT_PREVIOUS
  }
}

export const selectNext = () => {
  return {
    type: RULES_SELECT_NEXT
  }
}

export const select = () => {
  return {
    type: RULES_SELECT
  }
}

export const modifyAt = (index, text) => {
  return {
    type: RULES_MODIFY_AT,
    text,
    index
  }
}

export const toggleDisableAt = (index) => {
  return {
    type: RULES_TOGGLE_DISABLE_AT,
    index
  }
}

export const toggleIsolateAt = (index) => {
  return {
    type: RULES_TOGGLE_ISOLATE_AT,
    index
  }
}

export const addRule = () => {
  return {
    type: RULES_ADD
  }
}

export const removeRuleAt = (index) => {
  return {
    type: RULES_REMOVE_AT,
    index
  }
}