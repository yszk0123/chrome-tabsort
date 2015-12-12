import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import * as ItemTypes from '../constants/ItemTypes';

const ruleItemSource = {
  beginDrag({ id }) {
    return {
      id
    };
  }
};

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

class Rule extends Component {
  render() {
    const {
      connectDragSource,
      matchingText,
      valid,
      disable,
      isolate,
      onModifyRegExpAt,
      onToggleDisableAt,
      onToggleIsolateAt,
      onRemoveAt
    } = this.props;

    return connectDragSource(
      <div className="Rule">
        <input
          type="text"
          className={valid ? 'valid' : 'invalid'}
          value={matchingText}
          onChange={(event) => onModifyRegExpAt(event.target.value)}
        />
        <input type="checkbox" checked={disable} onChange={onToggleDisableAt} />
        <input type="checkbox" checked={isolate} onChange={onToggleIsolateAt} />
        <input type="button" className="RemoveRuleByIdButton" value="×" onClick={onRemoveAt} />
      </div>
    );
  }
}

Rule.propTypes = {
  matchingText: PropTypes.string.isRequired,
  valid: PropTypes.bool.isRequired,
  disable: PropTypes.bool.isRequired,
  isolate: PropTypes.bool.isRequired,

  onModifyRegExpAt: PropTypes.func.isRequired,
  onToggleDisableAt: PropTypes.func.isRequired,
  onToggleIsolateAt: PropTypes.func.isRequired,
  onRemoveAt: PropTypes.func.isRequired
};

export default DragSource(ItemTypes.RULE, ruleItemSource, collect)(Rule);
