import React, { PropTypes } from 'react';

export default function TabOptions({ tabsPerWindow, onTabsPerWindowChange }) {
  return (
    <div>
      <h2>Tabs</h2>
      <label htmlFor="tabs-per-window">ウィンドウ毎のタブ数</label>
      <input type="number" value={tabsPerWindow} onChange={onTabsPerWindowChange} />
    </div>
  );
}

TabOptions.propTypes = {
  tabsPerWindow: PropTypes.number.isRequired,
  onTabsPerWindowChange: PropTypes.func.isRequired
};
