import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import Rule from '../components/Rule';
import EmptyRule from '../components/EmptyRule';
import * as ItemTypes from '../constants/ItemTypes';
import { createRule } from '../utils/Rule';

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
    props.onMoveToGroupById(id, props.id);

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
      id: groupId,
      items,
      onAdd,
      onModifyRegExpAt,
      onRemoveAt
    } = this.props;

    return connectDropTarget(
      <div className="RuleGroup">
        <label className="RuleGroupLabel">Window</label>
        <div>
          {items.map((item) => {
            const { id } = item;

            return (
              <Rule
                key={id}
                {...item}
                onModifyRegExpAt={(text) => onModifyRegExpAt(id, text)}
                onRemoveAt={() => onRemoveAt(id)}
              />
            );
          })}
          <EmptyRule onAdd={() => onAdd(createRule(groupId))} />
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
  onRemoveAt: PropTypes.func.isRequired,
  onMoveToGroupById: PropTypes.func.isRequired
};

export default DropTarget(ItemTypes.RULE, ruleTarget, collect)(RuleGroup);
