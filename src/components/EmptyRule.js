import React, { Component, PropTypes } from 'react';

class EmptyRule extends Component {
  render() {
    const {
      onAdd
    } = this.props;

    return (
      <div className="Rule EmptyRule" onClick={onAdd}>
        Add Rule
      </div>
    );
  }
}

EmptyRule.propTypes = {
  onAdd: PropTypes.func.isRequired
};

export default EmptyRule;
