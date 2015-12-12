import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import Rule from '../components/Rule';
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
    isOverCurrent: monitor.isOver({ shallow: true })
  };
};

class RuleGroup extends Component {
  render() {
    const {
      connectDropTarget,
      items,
      onAdd,
      onModifyRegExpAt,
      onToggleDisableAt,
      onToggleIsolateAt,
      onMoveToPreviousAt,
      onMoveToNextAt,
      onRemoveAt
    } = this.props;

    return connectDropTarget(
      <div>
        <label>Rules</label>
        <ul>
          {items.map((item, i) => {
            return (
              <Rule
                key={i}
                {...item}
                onModifyRegExpAt={(text) => onModifyRegExpAt(i, text)}
                onToggleDisableAt={() => onToggleDisableAt(i)}
                onToggleIsolateAt={() => onToggleIsolateAt(i)}
                onMoveToPreviousAt={() => onMoveToPreviousAt(i)}
                onMoveToNextAt={() => onMoveToNextAt(i)}
                onRemoveAt={() => onRemoveAt(i)}
              />
            );
          })}
        </ul>
        <div>
        <input type="button" value="Add Rule" onClick={onAdd} />
        </div>
      </div>
    );
  }
}

RuleGroup.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOverCurrent: PropTypes.bool.isRequired,

  items: PropTypes.arrayOf(PropTypes.object).isRequired,

  onAdd: PropTypes.func.isRequired,
  onModifyRegExpAt: PropTypes.func.isRequired,
  onToggleDisableAt: PropTypes.func.isRequired,
  onToggleIsolateAt: PropTypes.func.isRequired,
  onMoveToPreviousAt: PropTypes.func.isRequired,
  onMoveToNextAt: PropTypes.func.isRequired,
  onRemoveAt: PropTypes.func.isRequired
};

export default DropTarget(ItemTypes.RULE, ruleTarget, collect)(RuleGroup);