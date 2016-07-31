import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Group from './Group';

export function Options({ groupPropsList }) {
  return (
    <div>
      {groupPropsList.map((groupProps) => <Group {...groupProps} />)}
    </div>
  );
}

Options.propTypes = {
  groupPropsList: PropTypes.array.isRequired
};

export default connect((state) => {}, {}, Options);
