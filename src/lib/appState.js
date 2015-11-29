'use strict';
import React from 'react/addons';
const { update: updateHelper } = React.addons;

export class AppState {
  constructor(defaultGroupProps) {
    this._state = {
      defaultGroupProps: fixGroupProps(defaultGroupProps),
      groupPropsList: [].map(fixGroupProps),
    };
  }

  getState() {
    return this._state;
  }

  _update(command) {
    this._state = updateHelper(this._state, command);
  }
}

export default new AppState();
