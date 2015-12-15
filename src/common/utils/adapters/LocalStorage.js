export const get = (key, defaultValue) => {
  return new Promise((resolve, reject) => {
    const value = localStorage.getItem(key) || defaultValue;
    resolve(typeof value === 'string' ? JSON.parse(value) : null);
  });
};

export const set = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(localStorage.setItem(key, JSON.stringify(value)));
    }
    catch (err) {
      reject(err);
    }
  });
};
