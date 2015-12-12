import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import Rule from '../components/Rule';
import * as ItemTypes from '../constants/ItemTypes';
import { createRule } from '../utils/Rule';

const ruleTarget = {
  canDrop(props, monitor) {
    const { id } = monitor.getItem();

    return !!id;
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
      onToggleDisableAt,
      onToggleIsolateAt,
      onRemoveAt
    } = this.props;

    return connectDropTarget(
      <div>
        <label>Rules</label>
        <ul>
          {items.map((item) => {
            const { id } = item;

            return (
              <Rule
                key={id}
                {...item}
                onModifyRegExpAt={(text) => onModifyRegExpAt(id, text)}
                onToggleDisableAt={() => onToggleDisableAt(id)}
                onToggleIsolateAt={() => onToggleIsolateAt(id)}
                onRemoveAt={() => onRemoveAt(id)}
              />
            );
          })}
        </ul>
        <div>
          <input type="button" value="Add Rule" onClick={() => onAdd(createRule(groupId))} />
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
  onRemoveAt: PropTypes.func.isRequired,
  onMoveToGroupById: PropTypes.func.isRequired
};

export default DropTarget(ItemTypes.RULE, ruleTarget, collect)(RuleGroup);
