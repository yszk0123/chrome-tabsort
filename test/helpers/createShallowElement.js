// ref: [Unit testing React components without a DOM – simonsmith.io – Portfolio and blog of a London based front-end web developer](http://simonsmith.io/unit-testing-react-components-without-a-dom/)
'use strict';
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;

export default function createShallowElement(element) {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(element);
  return shallowRenderer.getRenderOutput();
}
