'use strict';
import React from 'react/addons';
import test from 'tape';
import Options from '../../app/components/Options';
const {TestUtils} = React.addons;

test('Options', (assert) => {
  assert.test('', (assert) => {
    const options = <Options key2="value2" />;
    assert.equal(options.props.key2, 'value2');

    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(element);
    const output = shallowRenderer.getRenderOutput();
    assert.equal(output.type, 'div');
    assert.deepEqual(output.children, [
      <span></span>,
      <AAAAA />
    ]);

    const myComponent = TestUtils.renderIntoDocument(<MyComponent />);
    assert.equal(myComponent().textContent, 'Hello');

    assert.end();
  });

  assert.end();
});
