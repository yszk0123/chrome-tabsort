export default (windows) => {
  return windows
    .filter((wnd) => wnd.type === 'normal')
    .reduce((list, wnd) => {
      return list.concat(wnd.tabs.map(({ id, url, windowId }) => ({ id, url, windowId })));
    }, []);
};
