import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import RuleGroup from '../components/RuleGroup';
import * as ItemTypes from '../constants/ItemTypes';

const ruleTarget = {
  canDrop(props, monitor) {
    const { regexp } = monitor.getItem();

    return !!regexp;
  },

  drop(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }

    const { regexp } = monitor.getItem();

    return {
      moved: true
    };
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

class RuleList extends Component {
  render() {
    const {
      connectDropTarget,
      isOver,
      ...restProps
    } = this.props;

    return connectDropTarget(
      <div>
        <label>Rules</label>
        <ul>
          <li>
            <RuleGroup
              {...restProps}
            />
          </li>
        </ul>
        <div>
        </div>
      </div>
    );
  }
}

RuleList.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
};

export default DropTarget(ItemTypes.RULE, ruleTarget, collect)(RuleList);
