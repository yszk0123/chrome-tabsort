/* global chrome */

export const promisifyChromeExtensionsAPI = (api) => (...args) => {
  return new Promise((resolve, reject) => {
    api(...args, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve(result);
    });
  });
};
