import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from '../reducers';

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true
  }));
}

export default () => {
  return compose(
    applyMiddleware(...middleware)
  )(createStore)(reducer, {});
};
