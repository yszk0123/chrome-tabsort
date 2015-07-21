'use strict';
import test from 'tape';
import Divider from '../app/lib/Divider';

function getIds(array) {
  return array.map((element) => element.id).sort();
}

test('Divider', (tDivider) => {
  tDivider.test('No rule', (tNoRule) => {
    tNoRule.test('tabsPerWindow', (t) => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://a.com/2' },
        { id: 3, url: 'http://a.com/3' },
        { id: 4, url: 'http://b.co.jp/4' },
      ];
      const divider = new Divider([]);
      t.deepEqual(getIds(divider.divide(items, 3)), [1, 2, 3]);
      t.end();
    });

    tNoRule.test('tabsPerWindow', (t) => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://a.com/2' },
        { id: 3, url: 'http://a.com/3' },
        { id: 4, url: 'http://b.co.jp/4' },
      ];
      const divider = new Divider([]);
      t.deepEqual(divider.divide(items, 2), {});
      t.end();
    });

    tNoRule.end();
  });

  tDivider.test('Rule', (tRule) => {
    tRule.test('tabsPerWindow', (t) => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://a.com/2' },
        { id: 3, url: 'http://b.co.jp/c' },
        { id: 4, url: 'http://b.co.jp/d' },
      ];
      const rules = [
        { regexp: '\\.com\\b' },
      ];
      const divider = new Divider(rules);
      t.deepEqual(divider.divide(items, 3), {});
      t.end();
    });

    tRule.test('should ', (t) => {
      const items = [
        { id: 1, url: 'http://a.com/a' },
        { id: 2, url: 'http://a.com/nextgroup/a' },
        { id: 2, url: 'http://a.com/nextgroup/b' },
        { id: 3, url: 'http://b.co.jp/c' },
        { id: 4, url: 'http://b.co.jp/doc/isolate' },
        { id: 5, url: 'http://b.co.jp/d' },
        { id: 6, url: 'http://b.co.jp/e' },
        { id: 7, url: 'http://b.co.jp/f' },
        { id: 10, url: 'http://c.ne.jp/g' },
      ];
      const rules = [
        { regexp: '\\.com\\b' },
        { regexp: '\\bdoc|\\bapi', isolate: true },
      ];
      const divider = new Divider(rules);
      t.deepEqual(divider.divide(items, 3), {});
    });

    tRule.end();
  });

  tDivider.end();
});
