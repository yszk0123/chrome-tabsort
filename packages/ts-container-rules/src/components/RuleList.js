import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import EmptyRule from '../components/EmptyRule';
import EmptyRuleGroup from '../components/EmptyRuleGroup';
import RuleGroup from '../components/RuleGroup';
import { DND_ITEM_TYPE_RULE } from '../constants';
import { createRule } from '../utils/RuleUtils';

const ruleTarget = {
  canDrop(props, monitor) {
    const { id } = monitor.getItem();

    return Boolean(id);
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
      <div className="RuleList">
        <h2>Rules</h2>
        <div className="RuleGroupContainer">
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
          {isOver &&
            <EmptyRuleGroup {...restProps} />
          }
        </div>
        <div>
          <EmptyRule onAdd={this.handleAdd} />
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

  onAdd: PropTypes.func.isRequired
};

export default DropTarget(DND_ITEM_TYPE_RULE, ruleTarget, collect)(RuleList);
