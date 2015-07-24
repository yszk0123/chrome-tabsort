'use strict';
import React from 'react/addons';
const {update: updateHelper} = React.addons;

export class AppState {
  constructor() {
    this._state = {
      storage: {
        tabsPerWindow: 10,
        rules: [],
      },
      saved: false
    };
  }

  update(command) {
    this._state = updateHelper(this._state, command);
  }

  getState() {
    return this._state;
  }
}

export default new AppState();
