import React, { Component, PropTypes } from 'react';

export default class TabOptions extends Component {
  render() {
    const {
      tabsPerWindow,
      onTabsPerWindowChange
    } = this.props;

    return (
      <div>
        <h2>Tabs</h2>
        <label htmlFor="tabs-per-window">ウィンドウ毎のタブ数</label>
        <input type="number" value={tabsPerWindow} onChange={onTabsPerWindowChange} />
      </div>
    );
  }
}

TabOptions.propTypes = {
  tabsPerWindow: PropTypes.number.isRequired,
  onTabsPerWindowChange: PropTypes.func.isRequired
};
