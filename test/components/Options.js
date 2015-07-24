'use strict';
import test from 'tape';
import Options from '../../app/components/Options';
import createShallowElement from '../helpers/createShallowElement';

test('Options', (assert) => {
  assert.test('', (assert) => {
    createShallowElement('Hello');
    assert.end();
  });

  assert.end();
});
