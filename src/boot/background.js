import configureStore from '../store/configureStore';
import {
  registerBrowserActionClicked,
  registerMessageReceived,
  registerTabsCreated,
  registerTabsRemoved,
  registerTabsUpdated
} from '../utils/ChromeExtensionsAPIWrapper';
import * as BackgroundActions from '../actions/Background';
import * as optionsActions from '../actions/Options';
import { CHROME_OPTIONS_UPDATE_STATE } from '../constants/Actions';

const store = configureStore();
store.dispatch(optionsActions.load());

const bindDispatch = (store, action) => (...args) => {
  return store.dispatch(action(...args));
};

// Event handlers
registerBrowserActionClicked(bindDispatch(store, BackgroundActions.executeDivideTabsInAllWindows));
registerTabsCreated(bindDispatch(store, BackgroundActions.executeDivideTabsInOneWindow));
registerTabsCreated(bindDispatch(store, BackgroundActions.setBadge));
registerTabsRemoved(bindDispatch(store, BackgroundActions.setBadge));
registerTabsUpdated((newTabId, { status }, { url: newTabUrl }) => {
  return store.dispatch(BackgroundActions.sortTabsInWindow(newTabId, status, newTabUrl));
});
registerMessageReceived((request) => {
  if (request.type === CHROME_OPTIONS_UPDATE_STATE) {
    store.dispatch(optionsActions.loadWithState(request.state));
  }
});
