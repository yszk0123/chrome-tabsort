import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Options from './containers/Options'
import store from './store'

render((
  <Provider store={store}>
    <Options />
  </Provider>
), document.getElementById('root'))
