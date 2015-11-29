import update from 'react-addons-update'

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
} from '../constants/Actions'
import { createRule } from '../utils/Rule'

const initialState = {
  items: [],
}

const swapInArrayIfPossible = (array, i, j) => {
  if (i >= j || i < 0 || j >= array.length) {
    return array
  }

  return [
    ...array.slice(0, i),
    array[j],
    ...array.slice(i + 1, j),
    array[i],
    ...array.slice(j + 1)
  ]
}

const wrapInRange = (n, start, end) => {
  if (n < start) {
    return n + (end - start)
  }

  if (n >= end) {
    return n - (end - start)
  }

  return n
}

const not = (x) => !x

export default (state = initialState, action) => {
  const { index: i } = action
  const { items } = state

  switch (action.type) {
    case RULES_MOVE_TO_PREVIOUS:
      return {
        ...state,
        items: swapInArrayIfPossible(items, i - 1, i)
      }
    case RULES_MOVE_TO_NEXT:
      return {
        ...state,
        items: swapInArrayIfPossible(items, i, i + 1)
      }
    case RULES_SELECT_PREVIOUS:
      return {
        ...state,
        selectedIndex: wrapInRange(i - 1, 0, items.length)
      }
    case RULES_SELECT_NEXT:
      return {
        ...state,
        selectedIndex: wrapInRange(i + 1, 0, items.length)
      }
    case RULES_SELECT:
      return {
        ...state,
        selectedIndex: i
      }
    case RULES_MODIFY_REGEXP_AT:
      return update(state, {
        items: { [action.index]: { regexp: { $set: action.text } } }
      })
    case RULES_TOGGLE_DISABLE_AT:
      return update(state, {
        items: { [action.index]: { disable: { $apply: not } } }
      })
    case RULES_TOGGLE_ISOLATE_AT:
      return update(state, {
        items: { [action.index]: { isolate: { $apply: not } } }
      })
    case RULES_ADD:
      return {
        ...state,
        items: [...items, createRule()]
      }
    case RULES_REMOVE_AT:
      return {
        ...state,
        items: [
          ...items.slice(0, action.index),
          ...items.slice(action.index + 1)
        ]
      }
    default:
      return state
  }
}
