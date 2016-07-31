export default function getTabsNeedToBeSorted(windows) {
  return windows
    .filter((wnd) => wnd.type === 'normal')
    .reduce((list, wnd) => {
      const tabs = wnd.tabs.map(({ id, url, windowId }) => ({ id, url, windowId }));
      return list.concat(tabs);
    }, []);
}
