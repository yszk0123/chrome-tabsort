/* global chrome */
import { promisifyChromeExtensionsAPI } from './ChromeExtensionsUtils';

export const createWindow = promisifyChromeExtensionsAPI(chrome.windows.create);
export const getAllWindows = promisifyChromeExtensionsAPI(chrome.windows.getAll);
export const getCurrentWindow = promisifyChromeExtensionsAPI(chrome.windows.getCurrent);
export const getTab = promisifyChromeExtensionsAPI(chrome.tabs.get);
export const moveTabs = promisifyChromeExtensionsAPI(chrome.tabs.move);
export const queryAgainstTabs = promisifyChromeExtensionsAPI(chrome.tabs.query);
export const updateWindow = promisifyChromeExtensionsAPI(chrome.windows.update);

// TODO: Return a promise
export const setBadgeText = (text) => chrome.browserAction.setBadgeText(text);

// TODO: Return a promise
export const setBadgeBackgroundColor = (params) =>
  chrome.browserAction.setBadgeBackgroundColor(params);

// Event Listeners

export const registerMessageReceived = (handler) => chrome.runtime.onMessage.addListener(handler);
export const registerTabsCreated = (handler) => chrome.tabs.onCreated.addListener(handler);
export const registerTabsUpdated = (handler) => chrome.tabs.onUpdated.addListener(handler);
export const registerTabsRemoved = (handler) => chrome.tabs.onRemoved.addListener(handler);
export const registerBrowserActionClicked = (handler) =>
  chrome.browserAction.onClicked.addListener(handler);
