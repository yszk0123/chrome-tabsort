import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import cx from 'classnames';
import { DND_ITEM_TYPE_RULE } from '../constants';

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
      onModifyRegExpById,
      onRemoveById
    } = this.props;

    return connectDragSource(
      <div className={cx({ Rule: true, dragging: isDragging })}>
        <input
          type="text"
          className={valid ? 'valid' : 'invalid'}
          value={matchingText}
          placeholder="google.com"
          onChange={(event) => onModifyRegExpById(event.target.value)}
        />
        <input type="button" className="RemoveRuleByIdButton" value="×" onClick={onRemoveById} />
      </div>
    );
  }
}

Rule.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,

  matchingText: PropTypes.string.isRequired,
  valid: PropTypes.bool.isRequired,

  onModifyRegExpById: PropTypes.func.isRequired,
  onRemoveById: PropTypes.func.isRequired
};

export default DragSource(DND_ITEM_TYPE_RULE, ruleItemSource, collect)(Rule);
