import React, { Component, PropTypes } from 'react'

export default class OptionsButtons extends Component {
  render() {
    const {
      onLoad,
      onSave,
      onImport,
      onExport
    } = this.props

    return (
      <div>
        <input type="button" value="Load" onClick={onLoad} />
        <input type="button" value="Save" onClick={onSave} />
        <input type="button" value="Import" onClick={onImport} />
        <input type="button" value="Export" onClick={onExport} />
      </div>
    )
  }
}

OptionsButtons.propTypes = {
  onLoad: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
}
