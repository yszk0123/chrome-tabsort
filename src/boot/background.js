import {
  registerBrowserActionClicked,
  registerMessageReceived,
  registerTabsCreated,
  registerTabsRemoved,
  registerTabsUpdated
} from '../utils/ChromeAPIWrapper';
import {
  onBrowserActionClicked,
  onMessageReceived,
  onTabsCreated,
  onTabsRemoved,
  onTabsUpdated
} from '../actions/Background';

// Event handlers
registerBrowserActionClicked(onBrowserActionClicked);
registerMessageReceived(onMessageReceived);
registerTabsCreated(onTabsCreated);
registerTabsRemoved(onTabsRemoved);
registerTabsUpdated(onTabsUpdated);
