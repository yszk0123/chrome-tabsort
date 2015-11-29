import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_SELECT_PREVIOUS,
  RULES_SELECT_NEXT,
  RULES_SELECT
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
