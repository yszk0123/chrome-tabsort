import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import RuleGroup from '../components/RuleGroup';
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
  constructor(props) {
    super(props);

    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd() {
    this.props.onAdd(createRule());
  }

  render() {
    const {
      connectDropTarget,
      isOver,
      groupIds,
      groupsById,
      ...restProps
    } = this.props;

    return connectDropTarget(
      <div>
        <label>Rules</label>
        <ul>
          <li>
            {groupIds.map((id) => {
              return (
                <RuleGroup
                  key={id}
                  id={id}
                  {...restProps}
                  items={groupsById[id]}
                />
              );
            })}
          </li>
        </ul>
        <div>
          <input type="button" value="Add Rule" onClick={this.handleAdd} />
        </div>
      </div>
    );
  }
}

RuleList.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,

  groupIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupsById: PropTypes.object.isRequired,

  onAdd: PropTypes.func.isRequired,
};

export default DropTarget(ItemTypes.RULE, ruleTarget, collect)(RuleList);
