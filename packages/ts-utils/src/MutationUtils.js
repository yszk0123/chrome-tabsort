// TODO: Extract this file as a module
// This file is duplicated. Don't modify this file directly
import update from 'react-addons-update';
import _, { curry } from 'lodash';

export function isEqualPath(pathA, pathB) {
  if (!pathA || !pathB || pathA.length !== pathB.length) {
    return false;
  }

  return pathA.every((value, index) => pathB[index] === value);
}

function wrapNormalizePath(path, bareSpec) {
  return path.reduceRight((spec, key) => {
    const wrapper = {};
    wrapper[key] = spec;
    return (typeof key === 'number') ? { children: wrapper } : wrapper;
  }, bareSpec);
}

function wrapPath(path, bareSpec) {
  return path.reduceRight((spec, key) => {
    const wrapper = {};
    wrapper[key] = spec;
    return wrapper;
  }, bareSpec);
}

export const getAt = curry((index, data) => data[index]);

export const getIn = curry((path, data) => path.reduce((memo, key) => memo[key], data));

export const getInTree = curry(
  (path, data) =>
    path.reduce((memo, key) => {
      if (typeof key === 'number') {
        return memo.children && memo.children[key];
      }
      return memo[key];
    }, data)
);

export const updateInTree = curry(
  (path, updateFn, data) => update(data, wrapNormalizePath(path, { $apply: updateFn }))
);

export const setInTree = curry((path, value, data) => {
  if (getInTree(path, data) === value) {
    return data;
  }

  return update(data, wrapNormalizePath(path, { $set: value }));
});

export const createASTNode = (node) => node;

export const updateIn = curry(
  (path, updateFn, data) => update(data, wrapPath(path, { $apply: updateFn }))
);

export const setIn = curry((path, value, data) => {
  if (getIn(path, data) === value) {
    return data;
  }

  return update(data, wrapPath(path, { $set: value }));
});

export const removeIn = curry(
  (path, index, data) => update(data, wrapPath(path, { $splice: [[index, 1]] }))
);

export const pushIn = curry(
  (path, value, data) => update(data, wrapPath(path, { $push: value }))
);

export const unshiftIn = curry(
  (path, value, data) => update(data, wrapPath(path, { $unshift: value }))
);

export const omitIn = curry(
  (path, key, data) => update(data, wrapPath(path, { $apply: (o) => _.omit(o, key) }))
);
