'use strict';
import test from 'tape';
import { AppState } from '../../src/lib/appState';

test('AppState', (assert) => {
  assert.test('#update()', (assert) => {
    const appState = new AppState();
    const initialState = appState.getState();

    assert.equal(appState.getState(), initialState);
    assert.deepEqual(appState.getState(), initialState);

    const additionalValue = {};
    appState._update({ additionalKey: { $set: additionalValue } });
    assert.notEqual(appState.getState(), initialState);
    assert.equal(appState.getState().additionalKey, additionalValue);

    assert.end();
  });

  assert.end();
});
