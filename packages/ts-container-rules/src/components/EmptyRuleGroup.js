import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { generateUniqueId } from 'ts-utils';
import { DND_ITEM_TYPE_RULE } from '../constants';
import { createRule } from '../utils';

const ruleTarget = {
  canDrop(props, monitor) {
    const { id } = monitor.getItem();

    return Boolean(id);
  },

  drop(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }

    const { id } = monitor.getItem();
    props.onMoveToGroupById(id, generateUniqueId());

    return {
      moved: true,
    };
  },
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOverCurrent: monitor.isOver({ shallow: true }),
  };
};

class EmptyRuleGroup extends Component {
  render() {
    const {
      connectDropTarget,
      onAdd,
    } = this.props;

    return connectDropTarget(
      <div className="RuleGroup EmptyRuleGroup" onClick={() => onAdd(createRule())}>
        Add Rule
      </div>
    );
  }
}

EmptyRuleGroup.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOverCurrent: PropTypes.bool.isRequired,

  onAdd: PropTypes.func.isRequired,
  onMoveToGroupById: PropTypes.func.isRequired,
};

export default DropTarget(DND_ITEM_TYPE_RULE, ruleTarget, collect)(EmptyRuleGroup);
