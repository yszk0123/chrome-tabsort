export const registerTabsCreate = (handler) => {
  return chrome.tabs.onCreated.addEventListener(handler)
}

export const registerTabsUpdate = (handler) => {
  return chrome.tabs.onUpdated.addEventListener(handler)
}

export const registerTabsRemove = (handler) => {
  return chrome.tabs.onRemoved.addEventListener(handler)
}

export const registerBrowserActionClick = (handler) => {
  return chrome.browserAction.onClicked.addListener(handler)
}
