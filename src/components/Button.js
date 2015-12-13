import React from 'react';

export default ({ value, onClick }) => {
  return (
    <div className="Button" onClick={onClick}>
      {value}
    </div>
  );
};
