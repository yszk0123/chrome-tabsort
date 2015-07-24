'use strict';
import test from 'tape';
import assign from 'object-assign';
import {fixGroupProps, groupTabs} from '../../app/lib/WindowUtils';
import {cloneDeep} from 'lodash';

const getIds = (array) => array.map((o) => o.tabId);

test('WindowUtils', (assert) => {
  assert.test('.fixGroupProps()', (assert) => {
    const props = { id: 1, tabsPerWindow: 200 };
    const fixedGroupProps = fixGroupProps(cloneDeep(props));
    assert.equal(fixedGroupProps.tabsPerWindow, props.tabsPerWindow);

    assert.end();
  });

  assert.test('.groupTabs', (assert) => {
    assert.test('without rules', (assert) => {
      assert.test('including all tabs in one window', (assert) => {
        const defaultGroupProps = fixGroupProps({ id: 0, tabsPerWindow: 3 });
        const props = [{ id: 1, rules: [], tabsPerWindow: 3 }].map(fixGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://a.com/2' },
          { id: 3, url: 'http://a.com/3' },
          { id: 4, url: 'http://b.co.jp/4' },
        ];
        assert.deepEqual(groupTabs(items, props, defaultGroupProps).map(getIds), [[1, 2, 3], [4]]);
        assert.end();
      });

      assert.test('too much tabs per window', (assert) => {
        const defaultGroupProps = fixGroupProps({ id: 0, tabsPerWindow: 2 });
        const props = [{ id: 1, rules: [], tabsPerWindow: 2 }].map(fixGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://b.com/2' },
          { id: 3, url: 'http://c.com/3' },
          { id: 4, url: 'http://d.com/4' },
        ];
        assert.deepEqual(groupTabs(items, props, defaultGroupProps).map(getIds), [[1, 2], [3, 4]]);
        assert.end();
      });

      assert.end();
    });

    assert.test('with rules', (assert) => {
      assert.test('including all tabs in one window', (assert) => {
        const defaultGroupProps = fixGroupProps({ id: 0, tabsPerWindow: 3 });
        const props = [{
          id: 1,
          rules: [
            { type: 'regexp', value: '\\.com\\b' },
          ],
          tabsPerWindow: 3
        }].map(fixGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://a.com/2' },
          { id: 3, url: 'http://b.co.jp/c' },
          { id: 4, url: 'http://b.co.jp/d' },
        ];
        assert.deepEqual(groupTabs(items, props, defaultGroupProps).map(getIds), [[1, 2], [3, 4]]);
        assert.end();
      });

      assert.test('too much tabs per window', (assert) => {
        const defaultGroupProps = fixGroupProps({ id: 0, tabsPerWindow: 2 });
        const props = [{
          id: 1,
          rules: [
            { type: 'regexp', value: '\\.com\\b' },
          ],
          tabsPerWindow: 2
        }].map(fixGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://b.co.jp/c' },
          { id: 3, url: 'http://a.com/2' },
          { id: 4, url: 'http://b.co.jp/d' },
        ];
        assert.deepEqual(groupTabs(items, props, defaultGroupProps).map(getIds), [[1, 3], [2, 4]]);
        assert.end();
      });

      assert.end();
    });

    assert.end();
  });

  assert.end();
});
