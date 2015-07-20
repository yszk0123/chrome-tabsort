'use strict';
import {expect} from 'chai';
import {divideNode} from '../app/lib/Divider';

describe('TabSort.Divider', () => {
  describe('divideNode()', () => {
    it('should ', () => {
      const items = [
        {id: 1, url: 'http://a.com/a'},
        {id: 2, url: 'http://a.com/nextgroup/a'},
        {id: 2, url: 'http://a.com/nextgroup/b'},
        {id: 3, url: 'http://b.co.jp/c'},
        {id: 4, url: 'http://b.co.jp/doc/isolate'},
        {id: 5, url: 'http://b.co.jp/d'},
        {id: 6, url: 'http://b.co.jp/e'},
        {id: 7, url: 'http://b.co.jp/f'},
        {id: 10, url: 'http://c.ne.jp/g'},
      ];
      const rules = [
        {regexp: '\\.com\\b'}
        {regexp: '\\bdoc|\\bapi', isolate: true}
      ];
      groups = divideNode(items, 5, rules);
      expect(groups).to
    });
  });
});
