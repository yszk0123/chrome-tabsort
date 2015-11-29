'use strict';
import { find, findKey, flatten } from 'lodash';
import { arrayGroupBy } from '../lib/utils';
const DOMAIN_RE = /^[^:]+:\/+([^\/]+)/;

export default class Divider {
  constructor(rulesArray) {
    this.updateRules(rulesArray);
  }

  updateRules(rulesArray = []) {
    return this.rules = rulesArray
      .filter((rule) => !rule.disable)
      .reduce((rules, rule, i) => {
          rules[`_rule_${i}`] = {
            regexp: new RegExp(rule.regexp, 'i'),
            isolate: rule.isolate
          };
        return rules;
      }, {});
  }

  // ルールに合致する場合はルール名を
  // そうでなければドメイン名をグループ名とみなして返す
  // ドメイン名も取得できない場合は空文字''を返す
  getGroupName(url) {
    const ruleName = findKey(this.rules, (rule) => rule.regexp && rule.regexp.test(url));
    if (ruleName) {
      return ruleName;
    }

    const match = DOMAIN_RE.exec(url);
    return match ? match[1] : '';
  }

  groupByName(input) {
    return input
      .map((item) => ({
        id: item.id,
        url: item.url,
        name: this.getGroupName(item.url)
      }))
      .reduce((newGroups, item) => {
        let newGroup = find(newGroups, (group) => group.name === item.name);
        if (newGroup) {
          newGroup.push(item);
        }
        else {
          newGroup = [item];
          newGroup.name = item.name;
          newGroup.isolate = !!(this.rules[item.name] || {}).isolate;
          newGroups.push(newGroup);
        }
        return newGroups;
      }, []);
  }

  pack(_groups, capacity) {
    const newGroups = [];

    // isolateオプションが付いているグループは
    // capacityによらず強制的に別個のグループに分ける
    const [groups, isolatedGroups] = arrayGroupBy(_groups, ((group) => group.isolate ? 1 : 0), 2);

    while (groups.length) {
      let newGroup = groups.pop();
      let count = newGroup.length;
      if (groups.length) {
        for (let i = groups.length - 1; i >= 0; i -= 1) {
          const group = groups[i];
          const len = group.length;
          if (count + len <= capacity) {
            newGroup = newGroup.concat(group);
            groups.splice(i, 1);
            count += len;
          }
        }
      }
      newGroups.unshift(newGroup);
    }

    return isolatedGroups.concat(newGroups);
  }

  // ここで言うgroupはchromeのウィンドウ、itemはchromeのタブに相当する
  //
  // 分割手順は次のようになる
  //  1. それぞれの要素にグループ名をつける(デフォルトではドメイン名)
  //  2. グループ名でグループ分けしてグループの配列を作る
  //     => [ [<グループ名1を持つ要素>, ...],
  //          [<グループ名2を持つ要素>, ...],
  //          ...]
  //  3. グループの配列をグループの要素数が多い順にソートする
  //  4. 要素の多いグループから順にcapacityを超えないように新しいグループの配列へと詰め込んでいく
  //     要素の多いグループを詰め込めるか試す
  //     capacityを超えるなら次に要素の少ないグループが詰め込めるか試す
  // rules:
  //   グループ名の生成ルール
  //   グループは正規表現による一致か、グループ名(文字列)のリストを指定できる
  //   例
  //   [ /\bdoc/, /game/, /^chrome|extensions/, ['http://docs.angularjs.org/', 'backbonejs.org'] ]
  divide(input, size) {
    if (!this._canDivide()) {
      throw new Error('cannot divide');
    }

    const groups = this.groupByName(input).sort((a, b) => b.length - a.length);
    return this.pack(groups, size)
      .map((div) => flatten(div).sort((a,b) => a.url > b.url));
  }

  _canDivide() {
    return !!this.rules;
  }
}
