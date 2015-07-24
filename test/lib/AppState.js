'use strict';
import test from 'tape';
import {AppState} from '../../app/lib/appState';

test('AppState', (assert) => {
  assert.test('#update()', (assert) => {
    const appState = new AppState();
    const initialState = appState.getState();

    assert.equal(appState.getState(), initialState);
    assert.deepEqual(appState.getState(), initialState);

    const additionalValue = {};
    appState.update({ additionalKey: { $set: additionalValue } });
    assert.notEqual(appState.getState(), initialState);
    assert.equal(appState.getState().additionalKey, additionalValue);

    assert.end();
  });

  assert.end();
});
