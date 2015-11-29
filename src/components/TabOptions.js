import React, { Component, PropTypes } from 'react'

export default class TabOptions extends Component {
  render() {
    const { tabsPerWindow } = this.props

    return (
      <div>ウィンドウ毎のタブ数: {tabsPerWindow}</div>
    )
  }
}

TabOptions.propTypes = {
  tabsPerWindow: PropTypes.number.isRequired
}
