import HTML5Backend from 'react-dnd-html5-backend';
import React, { PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Layout from '../components/Layout';
import OptionsButtons from '../components/OptionsButtons';
import RuleList from '../components/RuleList';
import TabOptions from '../components/TabOptions';
import { getRules } from '../selectors';
import '../styles/app.css';

const mapStateToProps = (state) => {
  return {
    rules: getRules(state),
  };
};

export function Rules({ rules, modifyRegExpById, add, removeById, moveToGroupById }) {
  return (
    <RuleList
      {...rules}
      onModifyRegExpById={modifyRegExpById}
      onAdd={add}
      onRemoveById={removeById}
      onMoveToGroupById={moveToGroupById}
    />
  );
}

Rules.propTypes = {
  rules: PropTypes.object.isRequired,
  modifyRegExpById: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  removeById: PropTypes.func.isRequired,
  moveToGroupById: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, actions),
  DragDropContext(HTML5Backend)
)(Rules);
