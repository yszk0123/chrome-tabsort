import assert from 'power-assert';

import divideTabs from '../../src/utils/divideTabs';

describe('divideTabs', () => {
  const getIds = (division) => {
    return division
      .map((array) => array.map((element) => element.id))
      .sort((a, b) => a[0] - b[0]);
  };

  it('sorts output by url', () => {
    const tabs = [
      { id: 1, windowId: 1, url: 'http://a.com' },
      { id: 2, windowId: 1, url: 'http://b.com' },
      { id: 3, windowId: 1, url: 'http://d.com' },
      { id: 4, windowId: 1, url: 'http://c.com' }
    ];
    const windows = [
      { tabs, id: 1, type: 'normal' }
    ];
    const division = divideTabs({ rulesById: {}, windows, capacity: 10 });
    assert.deepEqual(getIds(division), [[1, 2, 4, 3]]);
  });

  context('without rules', () => {
    it('including all tabs in one window', () => {
      const tabs = [
        { id: 1, windowId: 1, url: 'http://a.com/1' },
        { id: 2, windowId: 1, url: 'http://a.com/2' },
        { id: 3, windowId: 1, url: 'http://a.com/3' },
        { id: 4, windowId: 1, url: 'http://b.co.jp/4' }
      ];
      const windows = [
        { tabs, id: 1, type: 'normal' }
      ];
      const division = divideTabs({ rulesById: {}, windows, capacity: 3 });
      assert.deepEqual(getIds(division), [[1, 2, 3], [4]]);
    });

    it('too much tabs per window', () => {
      const tabs = [
        { id: 1, windowId: 1, url: 'http://a.com/1' },
        { id: 2, windowId: 1, url: 'http://b.com/2' },
        { id: 3, windowId: 1, url: 'http://c.com/3' },
        { id: 4, windowId: 1, url: 'http://d.com/4' }
      ];
      const windows = [
        { tabs, id: 1, type: 'normal' }
      ];
      const division = divideTabs({ rulesById: {}, windows, capacity: 2 });
      assert.deepEqual(getIds(division), [[1, 2], [3, 4]]);
    });
  });

  context('with rules', () => {
    it('including all tabs in one window', () => {
      const tabs = [
        { id: 1, windowId: 1, url: 'http://a.com/1' },
        { id: 2, windowId: 1, url: 'http://a.com/2' },
        { id: 3, windowId: 1, url: 'http://b.co.jp/c' },
        { id: 4, windowId: 1, url: 'http://b.co.jp/d' }
      ];
      const windows = [
        { tabs, id: 1, type: 'normal' }
      ];
      const rulesById = {
        1: { groupId: 10, matchingText: '.com' }
      };
      const division = divideTabs({ rulesById, windows, capacity: 3 });
      assert.deepEqual(getIds(division), [[1, 2], [3, 4]]);
    });

    it('too much tabs per window', () => {
      const tabs = [
        { id: 1, windowId: 1, url: 'http://a.com/1' },
        { id: 2, windowId: 1, url: 'http://b.co.jp/c' },
        { id: 3, windowId: 1, url: 'http://a.com/2' },
        { id: 4, windowId: 1, url: 'http://b.co.jp/d' },
        { id: 5, windowId: 1, url: 'http://b.co.jp/doc/isolate' }
      ];
      const windows = [
        { tabs, id: 1, type: 'normal' }
      ];
      const rulesById = {
        1: { groupId: 10, isolate: true, matchingText: '.com' },
        2: { groupId: 11, isolate: true, matchingText: 'doc' }
      };
      const division = divideTabs({ rulesById, windows, capacity: 3 });
      assert.deepEqual(getIds(division), [[1, 3], [2, 4], [5]]);
    });

    it('with groupId', () => {
      const tabs = [
        { id: 1, windowId: 1, url: 'http://a.com/1' },
        { id: 2, windowId: 1, url: 'http://a.com/2' },
        { id: 3, windowId: 1, url: 'http://b.co.jp/c' },
        { id: 4, windowId: 1, url: 'http://b.co.jp/d' },
        { id: 5, windowId: 1, url: 'http://a.org/d' }
      ];
      const windows = [
        { tabs, id: 1, type: 'normal' }
      ];
      const rulesById = {
        1: { groupId: 10, isolate: true, matchingText: '.com' },
        2: { groupId: 10, isolate: true, matchingText: '.org' },
        3: { groupId: 11, isolate: true, matchingText: '.jp' }
      };
      const division = divideTabs({ rulesById, windows, capacity: 3 });
      assert.deepEqual(getIds(division), [[1, 2, 5], [3, 4]]);
    });
  });
});
