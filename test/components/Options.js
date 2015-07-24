'use strict';
import React from 'react';
import test from 'tape';
import Options from '../../app/components/Options';

test('Options', (assert) => {
  assert.test('', (assert) => {
    const options = <Options key2="value2" />;
    assert.equal(options.props.key2, 'value2');
    assert.end();
  });

  assert.end();
});
