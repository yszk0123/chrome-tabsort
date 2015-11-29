'use strict'
import React from 'react/addons'
import OptionsConfig from '../configs/Options'
const { update: updateHelper } = React.addons

export class OptionsStore {
  constructor() {
    this._state = {
      saved: false
    }
  }

  getState() {
    return this._state
  }

  save() {
    this._update({
      saved: { $set: true }
    })

    setTimeout(() => {
      this._update({
        saved: { $set: false }
      })
    }, OptionsConfig.timeout)
  }

  _update(command) {
    this._state = updateHelper(this._state, command)
  }
}

export default new ViewState()
