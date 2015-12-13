import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import cx from 'classnames';

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
      isDragging,
      matchingText,
      valid,
      disable,
      isolate,
      onModifyRegExpAt,
      onRemoveAt
    } = this.props;

    return connectDragSource(
      <div className={cx({ Rule: true, dragging: isDragging })}>
        <input
          type="text"
          className={valid ? 'valid' : 'invalid'}
          value={matchingText}
          placeholder="google.com"
          onChange={(event) => onModifyRegExpAt(event.target.value)}
        />
        <input type="button" className="RemoveRuleByIdButton" value="×" onClick={onRemoveAt} />
      </div>
    );
  }
}

Rule.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,

  matchingText: PropTypes.string.isRequired,
  valid: PropTypes.bool.isRequired,
  disable: PropTypes.bool.isRequired,
  isolate: PropTypes.bool.isRequired,

  onModifyRegExpAt: PropTypes.func.isRequired,
  onRemoveAt: PropTypes.func.isRequired
};

export default DragSource(ItemTypes.RULE, ruleItemSource, collect)(Rule);
