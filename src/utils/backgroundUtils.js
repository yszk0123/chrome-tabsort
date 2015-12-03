export const getTabsNeedToBeSorted = (windows) => {
  return windows
    .filter((wnd) => wnd.type === 'normal')
    .reduce((list, wnd) => {
      return list.concat(wnd.tabs.map(({ id, url }) => ({ id, url })))
    }, [])
}
