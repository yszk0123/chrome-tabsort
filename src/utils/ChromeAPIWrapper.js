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
export const updateWindow = promisifyChromeExtensionsAPI(chrome.windows.update)
export const queryAgainstTabs = promisifyChromeExtensionsAPI(chrome.tabs.query)
export const getTab = promisifyChromeExtensionsAPI(chrome.tabs.get)
export const moveTabs = promisifyChromeExtensionsAPI(chrome.tabs.move)
