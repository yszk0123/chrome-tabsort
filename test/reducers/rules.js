import assert from 'power-assert';

import rulesReducer from '../../src/reducers/rules';
import * as RulesActions from '../../src/actions/rules';

describe('rules', () => {
  it('returns initialState when no action match', () => {
    const result = rulesReducer(undefined, RulesActions.select());
    assert.deepEqual(result, { items: [] });
  });

  context('when modifyRegExpAt is called', () => {
    it('modifies regexp', () => {
      const action = RulesActions.modifyRegExpAt(0, 'bar');

      const result = rulesReducer({ items: [{ regexp: 'foo' }] }, action);
      assert.deepEqual(result, { items: [{ regexp: 'bar', valid: true }] });
    });

    specify('validation fails when the input is invalid', () => {
      const action = RulesActions.modifyRegExpAt(0, '\\');

      const result = rulesReducer({ items: [{ regexp: 'foo' }] }, action);
      assert.deepEqual(result, { items: [{ regexp: '\\', valid: false }] });
    });
  });

  context('when toggleDisableAt is called', () => {
    it('toggles disable', () => {
      const action = RulesActions.toggleDisableAt(0);

      const first = rulesReducer({ items: [{ disable: false }] }, action);
      assert.deepEqual(first, { items: [{ disable: true }] });

      const second = rulesReducer(first, action);
      assert.deepEqual(second, { items: [{ disable: false }] });
    });
  });

  context('when toggleIsolateAt is called', () => {
    it('toggles isolate', () => {
      const action = RulesActions.toggleIsolateAt(0);

      const first = rulesReducer({ items: [{ isolate: false }] }, action);
      assert.deepEqual(first, { items: [{ isolate: true }] });

      const second = rulesReducer(first, action);
      assert.deepEqual(second, { items: [{ isolate: false }] });
    });
  });

  context('when add is called', () => {
    it('appends an item to items', () => {
      const action = RulesActions.add();

      const first = rulesReducer({ items: [] }, action);
      assert.ok(first.items.length === 1);

      const second = rulesReducer(first, action);
      assert.ok(second.items.length === 2);
    });
  });

  context('when removeAt is called', () => {
    it('remove the specified item from items', () => {
      const items = [1, 2, 3];
      const action = RulesActions.removeAt(1);

      const first = rulesReducer({ items }, action);
      assert.deepEqual(first.items, [1, 3]);

      const second = rulesReducer(first, action);
      assert.deepEqual(second.items, [1]);
    });
  });

  context('when moveToPrevious is called', () => {
    it('swaps the item with the previous item', () => {
      const items = [1, 2, 3, 4];
      const action = RulesActions.moveToPrevious(1);

      const result = rulesReducer({ items }, action);
      assert.deepEqual(result.items, [2, 1, 3, 4]);
    });
  });

  context('when moveToNext is called', () => {
    it('swaps the item with the next item', () => {
      const items = [1, 2, 3, 4];
      const action = RulesActions.moveToNext(1);

      const result = rulesReducer({ items }, action);
      assert.deepEqual(result.items, [1, 3, 2, 4]);
    });
  });
});
