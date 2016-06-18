import _ from 'lodash';

const DEFAULT_GROUP = 'DEFAULT';

class TabsDivider {
  constructor(rules, tabs, capacity) {
    this.rules = rules
      .filter((rule) => !rule.disable);
    this.tabs = tabs;
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
      .map(({ id, url }) => ({ id, url, groupId: this.getGroupId(url) }))
      .groupBy('groupId')
      .values()
      .map((group) => group.slice(0).sort((a, b) => a.url > b.url))
      .map((item) => _.chunk(item, this.capacity))
      .flatten()
      .value();
  }

  _canDivide() {
    return Boolean(this.rules);
  }
}

export default ({ rulesById, tabs, capacity }) => {
  return new TabsDivider(_.values(rulesById), tabs, capacity).divide();
};
