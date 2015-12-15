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
} from '../handlers/Background';

// Event handlers
registerMessageReceived(onMessageReceived);
registerTabsCreated(onTabsCreated);
registerTabsUpdated(onTabsUpdated);
registerBrowserActionClicked(onBrowserActionClicked);
registerTabsRemoved(onTabsRemoved);
