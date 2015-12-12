export const validateId = (id) => Number.isFinite(id);

export const validateRegExp = (input) => {
  try {
    new RegExp(input);
    return true;
  }
  catch (err) {
    return false;
  }
};

export const createMapper = (fns, defaultFn = () => null) => {
  return (key) => {
    return fns.hasOwnProperty(key) ? fns[key] : defaultFn;
  };
};

// 該当要素を配列の最後尾に移動する
export const moveToTail = (arr, target) => {
  const index = arr.indexOf(target);
  if (index > -1) {
    arr.push(arr.splice(index, 1)[0]);
  }
};

export function arrayGroupBy(items, getIndex, maxSize) {
  let dest = [];
  dest.length = maxSize;
  for (let i = 0; i < maxSize; i += 1) {
    dest[i] = [];
  }
  items.forEach((item) => dest[getIndex(item)].push(item));
  return dest;
}

export const reverse = (array) => {
  let result = [];
  let length = array.length;

  for (let i = 0; i < length; i += 1) {
    result.push(array[length - i - 1]);
  }

  return result;
};
