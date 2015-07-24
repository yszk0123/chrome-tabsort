// ref: [Unit testing React components without a DOM – simonsmith.io – Portfolio and blog of a London based front-end web developer](http://simonsmith.io/unit-testing-react-components-without-a-dom/)
'use strict';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;

export default function createShallowElement(component, props, ...children) {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(React.createElement(component, props, children.length > 1 ? children : children[0]));
  return shallowRenderer.getRenderOutput();
}
