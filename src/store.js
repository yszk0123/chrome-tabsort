import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from './reducer';

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true
  }));
}

export default compose(
  applyMiddleware(...middleware)
)(createStore)(reducer, {});
