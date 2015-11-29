import { combineReducers } from 'redux'

import rules from './reducers/rules'
import tabs from './reducers/tabs'

export default combineReducers({
  rules,
  tabs
})
