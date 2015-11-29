import {
  SEARCH_LOAD_ITEMS,
  SEARCH_UPDATE_OFFSET_BY,
  SEARCH_UPDATE_TEXT,
  SEARCH_FILTER_ITEMS_BY_TEXT
} from '../constants/Actions'
import createReducer from '../../common/createReducer'

const initialState = {
  items: [],
  itemsIndex: null,
  source: '',
  offset: 0,
  candidates: []
}

const rules = createReducer(initialState, {
  [SEARCH_LOAD_ITEMS]: (state, action) => {
    return {
      ...state,
      source: action.source,
      items: action.items,
      itemsIndex: action.itemsIndex
    }
  },
  [SEARCH_UPDATE_TEXT]: (state, action) => {
    return {
      ...state,
      text: action.text
    }
  }
})

export default rules
