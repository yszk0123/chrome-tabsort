import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Options from '../containers/Options';
import store from '../store';
import * as optionsActions from '../actions/options';

store.dispatch(optionsActions.load());

document.addEventListener('DOMContentLoaded', () => {
  render((
    <Provider store={store}>
      <Options />
    </Provider>
  ), document.getElementById('root'));
});
