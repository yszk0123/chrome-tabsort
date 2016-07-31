import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import * as actions from './actions';
import Options from '../containers/Options';
import configureStore from '../store/configureStore';

export default bootstrap({ store }) {
  store.dispatch(actions.load());

  document.addEventListener('DOMContentLoaded', () => {
    render((
      <Provider store={store}>
        <Options />
      </Provider>
    ), document.getElementById('root'));
  });
}
