import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import createErrorLogger from '../middlewares/createErrorLogger';
import reducer from '../reducers';

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  // applyMiddleware() で登録される middleware は
  // 引数の右側 (配列の後ろ) から順に呼び出される
  // createErrorLogger は thunk の戻り値として返された Promise も捕捉したいので
  // thunk より前に挿入する必要がある
  middleware.unshift(createErrorLogger());

  middleware.push(createLogger({
    collapsed: true
  }));
}

export default () => {
  return compose(
    applyMiddleware(...middleware)
  )(createStore)(reducer, {});
};
