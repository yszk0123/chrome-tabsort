import assert from 'power-assert';
import Divider from '../../src/utils/Divider';

const getIds = (array) => {
  return array.map((element) => element.id).sort();
};

describe('Divider#divide', () => {
  context('without rules', () => {
    it('including all tabs in one window', () => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://a.com/2' },
        { id: 3, url: 'http://a.com/3' },
        { id: 4, url: 'http://b.co.jp/4' }
      ];
      const division = new Divider([]).divide(items, 3);
      assert.deepEqual(division.map(getIds), [[1, 2, 3], [4]]);
    });

    it('too much tabs per window', () => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://b.com/2' },
        { id: 3, url: 'http://c.com/3' },
        { id: 4, url: 'http://d.com/4' }
      ];
      const division = new Divider([]).divide(items, 2);
      assert.deepEqual(division.map(getIds), [[1, 2], [3, 4]]);
    });
  });

  context('with rules', () => {
    it('including all tabs in one window', () => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://a.com/2' },
        { id: 3, url: 'http://b.co.jp/c' },
        { id: 4, url: 'http://b.co.jp/d' }
      ];
      const rules = [
        { matchingText: '.com' }
      ];
      const division = new Divider(rules).divide(items, 3);
      assert.deepEqual(division.map(getIds), [[1, 2], [3, 4]]);
    });

    it('too much tabs per window', () => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://b.co.jp/c' },
        { id: 3, url: 'http://a.com/2' },
        { id: 4, url: 'http://b.co.jp/d' },
        { id: 5, url: 'http://b.co.jp/doc/isolate' }
      ];
      const rules = [
        { matchingText: '.com' },
        { matchingText: 'doc', isolate: true }
      ];
      const division = new Divider(rules).divide(items, 3);
      assert.deepEqual(division.map(getIds), [[5], [1, 3], [2, 4]]);
    });

    it('with groupId', () => {
      const items = [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://a.com/2' },
        { id: 3, url: 'http://b.co.jp/c' },
        { id: 4, url: 'http://b.co.jp/d' },
        { id: 5, url: 'http://a.org/d' }
      ];
      const rules = [
        { id: 0, groupId: 0, matchingText: '.com' },
        { id: 1, groupId: 0, matchingText: '.org' },
        { id: 2, groupId: 1, matchingText: '.jp' }
      ];
      const division = new Divider(rules).divide(items, 3);
      assert.deepEqual(division.map(getIds), [[1, 2, 5], [3, 4]]);
    });
  });
});
