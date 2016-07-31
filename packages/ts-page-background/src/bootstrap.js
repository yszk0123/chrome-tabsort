import * as Background from 'ts-page-background';
import { CHROME_OPTIONS_UPDATE_STATE } from 'ts-page-options';
import configureStore from '../store/configureStore';
import {
  registerBrowserActionClicked,
  registerMessageReceived,
  registerTabsCreated,
  registerTabsRemoved,
  registerTabsUpdated,
} from '../utils/ChromeExtensionsAPIWrapper';
import * as OptionsActions from '../actions/Options';

export default function bootstrap({ store }) {
  const store = configureStore();

  const bindDispatch = (action) => (...args) =>
    store.dispatch(action(...args));

  registerBrowserActionClicked(bindDispatch(Background.actions.executeDivideTabsInAllWindows));

  registerTabsCreated(bindDispatch(Background.actions.executeDivideTabsInOneWindow));
  registerTabsCreated(bindDispatch(Background.actions.setBadge));
  registerTabsRemoved(bindDispatch(Background.actions.setBadge));
  registerTabsUpdated((newTabId, { status }, { url: newTabUrl }) => {
    return store.dispatch(Background.actions.sortTabsInWindow(newTabId, status, newTabUrl));
  });

  registerMessageReceived((request) => {
    if (request.type === CHROME_OPTIONS_UPDATE_STATE) {
      return store.dispatch(OptionsActions.loadWithState(request.state));
    }
  });

  store.dispatch(OptionsActions.load());
}
