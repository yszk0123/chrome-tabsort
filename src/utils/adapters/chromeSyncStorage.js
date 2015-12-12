export const get = (key, defaultValue) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(defaultValue, (value) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(value);
    });
  });
};

export const set = (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(value, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
};
