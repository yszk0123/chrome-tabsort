import _ from 'lodash';
import getTabsNeedToBeSorted from './getTabsNeedToBeSorted';

const DEFAULT_GROUP = 'DEFAULT';

class TabsDivider {
  constructor(rules, windows, capacity) {
    this.rules = rules
      .filter((rule) => !rule.disable);
    this.tabs = getTabsNeedToBeSorted(windows);
    this.windowsById = _.mapValues(_.groupBy(windows, 'id'), (group) => group[0]);
    this.capacity = capacity;
  }

  getGroupId(rawUrl) {
    const url = rawUrl.toLowerCase();

    const foundRule = _.find(this.rules, (rule) => {
      if (!rule.matchingText) {
        return false;
      }
      if (typeof rule.matchingText === 'string') {
        return url.indexOf(rule.matchingText.toLowerCase()) > -1;
      }
      return rule.matchingText.test(url);
    });

    if (foundRule) {
      return foundRule.groupId;
    }

    return DEFAULT_GROUP;
  }

  divide() {
    if (!this._canDivide()) {
      throw new Error('cannot divide');
    }

    return _(this.tabs)
      .map(({ id, url, windowId }) => ({ id, url, windowId, groupId: this.getGroupId(url) }))
      .groupBy('groupId')
      .values()
      .map((group) => group.slice(0).sort((a, b) => a.url > b.url))
      .map((group) => _.chunk(group, this.capacity))
      .flatten()
      .value();
  }

  _canDivide() {
    return Boolean(this.rules);
  }
}

export default ({ rulesById, windows, capacity }) => {
  return new TabsDivider(_.values(rulesById), windows, capacity).divide();
};
