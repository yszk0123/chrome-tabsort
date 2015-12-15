/* global chrome */
import zlib from 'zlib';

import { promisify } from '../../utils/CommonUtils';
import { promisifyChromeExtensionsAPI } from '../../utils/ChromeExtensionsUtils';

const ENCODING = 'base64';

const deflateAsync = promisify(zlib.deflate);

const unzipAsync = promisify(zlib.unzip);

const storageSyncGet =
  promisifyChromeExtensionsAPI(chrome.storage.sync.get.bind(chrome.storage.sync));

const storageSyncSet =
  promisifyChromeExtensionsAPI(chrome.storage.sync.set.bind(chrome.storage.sync));

const deflate = (input) => {
  return deflateAsync(input)
    .then((buffer) => buffer.toString(ENCODING));
};

const unzip = (input) => {
  return unzipAsync(new Buffer(input, ENCODING))
    .then((buffer) => buffer.toString());
};

export const get = (key, defaultValue) => {
  return storageSyncGet(defaultValue)
    .then((data) => unzip(data[key]))
    .then(JSON.parse);
};

export const set = (key, value) => {
  return deflate(JSON.stringify(value))
    .then((deflated) => storageSyncSet({ [key]: deflated }));
};
