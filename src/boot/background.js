import configureStore from '../store/configureStore';
import {
  registerBrowserActionClicked,
  registerMessageReceived,
  registerTabsCreated,
  registerTabsRemoved,
  registerTabsUpdated
} from '../utils/ChromeExtensionsAPIWrapper';
import * as BackgroundActions from '../actions/Background';
import * as OptionsActions from '../actions/Options';
import { CHROME_OPTIONS_UPDATE_STATE } from '../constants/Actions';

const store = configureStore();

const bindDispatch = (action) => (...args) => {
  return store.dispatch(action(...args));
};

registerBrowserActionClicked(bindDispatch(BackgroundActions.executeDivideTabsInAllWindows));

registerTabsCreated(bindDispatch(BackgroundActions.executeDivideTabsInOneWindow));
registerTabsCreated(bindDispatch(BackgroundActions.setBadge));
registerTabsRemoved(bindDispatch(BackgroundActions.setBadge));
registerTabsUpdated((newTabId, { status }, { url: newTabUrl }) => {
  return store.dispatch(BackgroundActions.sortTabsInWindow(newTabId, status, newTabUrl));
});

registerMessageReceived((request) => {
  if (request.type === CHROME_OPTIONS_UPDATE_STATE) {
    return store.dispatch(OptionsActions.loadWithState(request.state));
  }
});

store.dispatch(OptionsActions.load());
