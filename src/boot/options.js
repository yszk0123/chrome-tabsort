import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Options from '../background/containers/Options';
import store from '../common/store';
import * as optionsActions from '../common/actions/Options';

store.dispatch(optionsActions.load());

document.addEventListener('DOMContentLoaded', () => {
  render((
    <Provider store={store}>
      <Options />
    </Provider>
  ), document.getElementById('root'));
});
