import assert from 'power-assert';
import getTabsNeedToBeSorted from '../../src/utils/getTabsNeedToBeSorted';

describe('getTabsNeedToBeSorted()', () => {
  it('include only normal windows', () => {
    const windows = [
      { type: 'normal', tabs: [{ id: 1, url: 'http://a.com/1' }] },
      { type: 'popup', tabs: [{ id: 2, url: 'http://b.com/2' }] },
      { type: 'panel', tabs: [{ id: 3, url: 'http://c.com/3' }] },
      { type: 'app', tabs: [{ id: 4, url: 'http://d.com/4' }] },
      { type: 'devtools', tabs: [{ id: 5, url: 'http://e.com/4' }] },
    ];

    const result = getTabsNeedToBeSorted(windows);
    assert.ok(result.length === 1);
    assert.ok(result[0].id === 1);
  });

  it('returns only id and url', () => {
    const windows = [
      { type: 'normal', tabs: [{ id: 1, windowId: 1, url: 'http://a.com/1' }] },
      { type: 'normal', tabs: [{ id: 2, windowId: 1, url: 'http://b.com/2', foo: 3 }] },
    ];

    assert.deepEqual(getTabsNeedToBeSorted(windows), [
      { id: 1, url: 'http://a.com/1', windowId: 1 },
      { id: 2, url: 'http://b.com/2', windowId: 1 },
    ]);
  });
});
