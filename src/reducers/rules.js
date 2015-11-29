import {
  RULES_MOVE_TO_PREVIOUS,
  RULES_MOVE_TO_NEXT,
  RULES_SELECT_PREVIOUS,
  RULES_SELECT_NEXT,
  RULES_SELECT
} from '../constants/Actions'

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
    default:
      return state
  }
}
