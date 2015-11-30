import React, { Component, PropTypes } from 'react'

export default class OptionsButtons extends Component {
  render() {
    const {
      onLoad,
      onSave
    } = this.props

    return (
      <div>
        <input type="button" value="Load" onClick={onLoad} />
        <input type="button" value="Save" onClick={onSave} />
      </div>
    )
  }
}

OptionsButtons.propTypes = {
  onLoad: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}
