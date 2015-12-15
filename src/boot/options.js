import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Options from '../containers/Options';
import configureStore from '../store/configureStore';
import * as optionsActions from '../actions/Options';

const store = configureStore();
store.dispatch(optionsActions.load());

document.addEventListener('DOMContentLoaded', () => {
  render((
    <Provider store={store}>
      <Options />
    </Provider>
  ), document.getElementById('root'));
});
