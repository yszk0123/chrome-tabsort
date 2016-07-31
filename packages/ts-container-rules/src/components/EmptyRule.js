import React, { PropTypes } from 'react';

export default function EmptyRule({ onAdd }) {
  return (
    <div className="Rule EmptyRule" onClick={onAdd}>
      Add Rule
    </div>
  );
}

EmptyRule.propTypes = {
  onAdd: PropTypes.func.isRequired
};
