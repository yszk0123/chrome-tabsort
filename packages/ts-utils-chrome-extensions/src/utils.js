/* global chrome */

export const promisifyChromeExtensionsAPI = (api) => (...args) =>
  new Promise((resolve, reject) => {
    api(...args, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      resolve(result);
    });
  });
