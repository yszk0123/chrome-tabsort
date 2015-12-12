import assert from 'power-assert';
import { buildGroupProps, groupTabs } from '../../src/utils/WindowUtils';
import { cloneDeep } from 'lodash';

const getIds = (array) => array.map((o) => o.tabId);

describe('WindowUtils', () => {
  describe('.buildGroupProps()', () => {
    const props = { id: 1, tabsPerWindow: 200 };
    const groupProps = buildGroupProps(cloneDeep(props));
    assert.equal(groupProps.tabsPerWindow, props.tabsPerWindow);
  });

  describe('.groupTabs', () => {
    context('without rules', () => {
      it('including all tabs in one window', () => {
        const defaultGroupProps = buildGroupProps({ id: 0, tabsPerWindow: 3 });
        const propsList = [{ id: 1, rules: [], tabsPerWindow: 3 }].map(buildGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://a.com/2' },
          { id: 3, url: 'http://a.com/3' },
          { id: 4, url: 'http://b.co.jp/4' }
        ];
        assert.deepEqual(groupTabs(items, propsList, defaultGroupProps).map(getIds), [[1, 2, 3], [4]]);
      });

      it('too much tabs per window', () => {
        const defaultGroupProps = buildGroupProps({ id: 0, tabsPerWindow: 2 });
        const propsList = [{ id: 1, rules: [], tabsPerWindow: 2 }].map(buildGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://b.com/2' },
          { id: 3, url: 'http://c.com/3' },
          { id: 4, url: 'http://d.com/4' }
        ];
        assert.deepEqual(groupTabs(items, propsList, defaultGroupProps).map(getIds), [[1, 2], [3, 4]]);
      });
    });

    context('with rules', () => {
      it('including all tabs in one window', () => {
        const defaultGroupProps = buildGroupProps({ id: 0, tabsPerWindow: 3 });
        const propsList = [{
          id: 1,
          rules: [
            { type: 'regexp', value: '\\.com\\b' }
          ],
          tabsPerWindow: 3
        }].map(buildGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://a.com/2' },
          { id: 3, url: 'http://b.co.jp/c' },
          { id: 4, url: 'http://b.co.jp/d' }
        ];
        assert.deepEqual(groupTabs(items, propsList, defaultGroupProps).map(getIds), [[1, 2], [3, 4]]);
      });

      it('too much tabs per window', () => {
        const defaultGroupProps = buildGroupProps({ id: 0, tabsPerWindow: 2 });
        const propsList = [{
          id: 1,
          rules: [
            { type: 'regexp', value: '\\.com\\b' }
          ],
          tabsPerWindow: 2
        }].map(buildGroupProps);
        const items = [
          { id: 1, url: 'http://a.com/1' },
          { id: 2, url: 'http://b.co.jp/c' },
          { id: 3, url: 'http://a.com/2' },
          { id: 4, url: 'http://b.co.jp/d' }
        ];
        assert.deepEqual(groupTabs(items, propsList, defaultGroupProps).map(getIds), [[1, 3], [2, 4]]);
      });
    });
  });
});
