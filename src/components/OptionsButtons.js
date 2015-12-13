import React, { Component, PropTypes } from 'react';

import Button from '../components/Button';

export default class OptionsButtons extends Component {
  render() {
    const {
      onLoad,
      onSave,
      onImport,
      onExport
    } = this.props;

    return (
      <div className="OptionsButtons">
        <Button value="Load" onClick={onLoad} />
        <Button value="Save" onClick={onSave} />
        <Button value="Import" onClick={onImport} />
        <Button value="Export" onClick={onExport} />
      </div>
    );
  }
}

OptionsButtons.propTypes = {
  onLoad: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
};
