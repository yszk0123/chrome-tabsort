'use strict';
import test from 'tape';
import Divider from '../app/lib/Divider';

function getIds(array) {
  return array.map((element) => element.id).sort();
}

test('Divider#divide', (tDivider) => {
  tDivider.test('without rules', (tNoRule) => {
    tNoRule.test('including all tabs in one window', (t) => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://a.com/2' },
        { id: 3, url: 'http://a.com/3' },
        { id: 4, url: 'http://b.co.jp/4' },
      ];
      const divider = new Divider([]);
      t.deepEqual(divider.divide(items, 3).map(getIds), [[1, 2, 3], [4]]);
      t.end();
    });

    tNoRule.test('too much tabs per window', (t) => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://b.com/2' },
        { id: 3, url: 'http://c.com/3' },
        { id: 4, url: 'http://d.com/4' },
      ];
      const divider = new Divider([]);
      t.deepEqual(divider.divide(items, 2).map(getIds), [[1, 2], [3, 4]]);
      t.end();
    });

    tNoRule.end();
  });

  tDivider.test('with rules', (tRule) => {
    tRule.test('including all tabs in one window', (t) => {
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
      t.deepEqual(divider.divide(items, 3).map(getIds), [[1, 2], [3, 4]]);
      t.end();
    });

    tRule.test('too much tabs per window', (t) => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://b.co.jp/c' },
        { id: 3, url: 'http://a.com/2' },
        { id: 4, url: 'http://b.co.jp/d' },
        { id: 5, url: 'http://b.co.jp/doc/isolate' },
      ];
      const rules = [
        { regexp: '\\.com\\b' },
        { regexp: '\\bdoc|\\bapi', isolate: true },
      ];
      const divider = new Divider(rules);
      t.deepEqual(divider.divide(items, 3).map(getIds), [[5], [1, 3], [2, 4]]);
      t.end();
    });

    tRule.end();
  });

  tDivider.end();
});
