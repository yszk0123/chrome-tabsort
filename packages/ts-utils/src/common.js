export const validateId = (id) => Number.isFinite(id);

export const validateRegExp = (input) => {
  if (!input) {
    return false;
  }

  try {
    new RegExp(input); // eslint-disable-line no-new
    return true;
  } catch (err) {
    return false;
  }
};

export const createMapper = (fns, defaultFn = () => null) => (key) =>
  fns.hasOwnProperty(key) ? fns[key] : defaultFn;

export const arrayGroupBy = (items, getIndex, maxSize) => {
  const dest = [];
  dest.length = maxSize;
  for (let i = 0; i < maxSize; i += 1) {
    dest[i] = [];
  }
  items.forEach((item) => dest[getIndex(item)].push(item));
  return dest;
};

export const reverse = (array) => {
  const result = [];
  const length = array.length;

  for (let i = 0; i < length; i += 1) {
    result.push(array[length - i - 1]);
  }

  return result;
};

export const condition = (...args) => {
  const last = args.length - (args.length % 2);

  for (let i = 0; i < last; i += 2) {
    if (args[i]) {
      return args[i + 1];
    }
  }

  return args[last];
};

export const promisify = (api) => (...args) =>
  new Promise((resolve, reject) => {
    api(...args, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
