import update from 'react-addons-update';

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
    this._state = update(this._state, command);
  }
}

export default new AppState();
