export const promisifyChromeExtensionsAPI = (api) => (...args) => {
  return new Promise((resolve, reject) => {
    api(...args, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }

      resolve(result)
    })
  })
}

export const createWindow = promisifyChromeExtensionsAPI(chrome.windows.create)
export const getAllWindows = promisifyChromeExtensionsAPI(chrome.windows.getAll)
export const getCurrentWindow = promisifyChromeExtensionsAPI(chrome.windows.getCurrent)
export const getTab = promisifyChromeExtensionsAPI(chrome.tabs.get)
export const moveTabs = promisifyChromeExtensionsAPI(chrome.tabs.move)
export const queryAgainstTabs = promisifyChromeExtensionsAPI(chrome.tabs.query)
export const updateWindow = promisifyChromeExtensionsAPI(chrome.windows.update)

// TODO: Return a promise
export const setBadgeText = (text) => {
  return chrome.browserAction.setBadgeText(text)
}

// TODO: Return a promise
export const setBadgeBackgroundColor = (params) => {
  return chrome.browserAction.setBadgeBackgroundColor(params)
}
