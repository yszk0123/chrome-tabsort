import { combineReducers } from 'redux'

import options from './reducers/options'
import rules from './reducers/rules'
import tabs from './reducers/tabs'

const rest = combineReducers({
  rules,
  tabs
})

export default (state, action) => {
  return {
    ...options(state, action),
    ...rest(state, action)
  }
}
