import * as Background from 'ts-page-background';
import * as Options from 'ts-page-options';
import {
  registerBrowserActionClicked,
  registerMessageReceived,
  registerTabsCreated,
  registerTabsRemoved,
  registerTabsUpdated,
} from 'ts-utils-chrome-extensions';

const { CHROME_OPTIONS_UPDATE_STATE } = Options;

export default function bootstrap({ store }) {
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
      return store.dispatch(Options.actions.loadWithState(request.state));
    }
  });

  store.dispatch(Options.actions.load());
}
