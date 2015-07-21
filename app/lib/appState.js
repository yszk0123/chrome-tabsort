'use strict';
import React from 'react/addons';
const {update: updateHelper} = React.addons;

class AppState {
  constructor() {
    this.state = {
      storage: {
        tabsPerWindow: 10,
        rules: [],
      },
      saved: false
    };
  }

  update(command) {
    this.state = updateHelper(this.state, command);
  }
}

export default new AppState();
