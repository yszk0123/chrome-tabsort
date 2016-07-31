/* global chrome */
import zlib from 'zlib';
import { promisify } from 'ts-utils';
import { promisifyChromeExtensionsAPI } from '../utils';

const ENCODING = 'base64';

const deflateAsync = promisify(zlib.deflate);

const unzipAsync = promisify(zlib.unzip);

const storageSyncGet =
  promisifyChromeExtensionsAPI(chrome.storage.sync.get.bind(chrome.storage.sync));

const storageSyncSet =
  promisifyChromeExtensionsAPI(chrome.storage.sync.set.bind(chrome.storage.sync));

const deflate = (input) =>
  deflateAsync(input)
    .then((buffer) => buffer.toString(ENCODING));

const unzip = (input) =>
  unzipAsync(new Buffer(input, ENCODING))
    .then((buffer) => buffer.toString());

export const get = (key, defaultValue) =>
  storageSyncGet(defaultValue)
    .then((data) => unzip(data[key]))
    .then(JSON.parse);

export const set = (key, value) =>
  deflate(JSON.stringify(value))
    .then((deflated) => storageSyncSet({ [key]: deflated }));
