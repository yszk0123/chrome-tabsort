import assert from 'power-assert';
import _ from 'lodash';

import rulesReducer from '../../src/reducers/rules';
import * as RulesActions from '../../src/actions/rules';
import { createRule } from '../../src/utils/Rule';

describe('rules', () => {
  const setup = () => {
    return {
      initialState: {
        itemIds: [0, 1, 2, 3],
        itemsById: {
          0: { regexp: 'foo', valid: true, isolate: false },
          1: { regexp: 'bar', valid: true, isolate: false },
          2: { regexp: 'baz', valid: true, isolate: false },
          3: { regexp: 'hoge', valid: true, isolate: false }
        }
      }
    };
  };

  it('returns initialState when no action match', () => {
    const result = rulesReducer(undefined, { type: null });
    assert.deepEqual(result, { itemIds: [], itemsById: {} });
  });

  context('when modifyRegExpAt is called', () => {
    it('modifies regexp', () => {
      const { initialState } = setup();
      const action = RulesActions.modifyRegExpAt(0, 'bar');

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemsById[0].regexp === 'bar');
    });

    specify('validation fails when the input is invalid', () => {
      const { initialState } = setup();
      const action = RulesActions.modifyRegExpAt(0, '\\');

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemsById[0].valid === false);
    });
  });

  context('when toggleDisableAt is called', () => {
    it('toggles disable', () => {
      const { initialState } = setup();
      const action = RulesActions.toggleDisableAt(0);

      const first = rulesReducer(initialState, action);
      assert(first.itemsById[0].disable === true);

      const second = rulesReducer(first, action);
      assert(second.itemsById[0].disable === false);
    });
  });

  context('when toggleIsolateAt is called', () => {
    it('toggles isolate', () => {
      const { initialState } = setup();
      const action = RulesActions.toggleIsolateAt(0);

      const first = rulesReducer(initialState, action);
      assert(first.itemsById[0].isolate === true);

      const second = rulesReducer(first, action);
      assert(second.itemsById[0].isolate === false);
    });
  });

  context('when add is called', () => {
    it('appends an item to items', () => {
      const { initialState } = setup();
      const newRule = createRule();
      const action = RulesActions.add(newRule);

      const nextState = rulesReducer(initialState, action);
      const lastId = _.last(nextState.itemIds);
      assert(nextState.itemIds.length === initialState.itemIds.length + 1);
      assert(nextState.itemsById[lastId] === newRule);
    });
  });

  context('when removeAt is called', () => {
    it('remove the specified item from items', () => {
      const { initialState } = setup();
      const id = initialState.itemIds[1];
      const action = RulesActions.removeAt(id);

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemIds.length === initialState.itemIds.length - 1);
      assert(!nextState.itemsById.hasOwnProperty(id));
    });
  });

  context('when moveToPrevious is called', () => {
    it('swaps the item with the previous item', () => {
      const { initialState } = setup();
      const action = RulesActions.moveToPrevious(1);

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemIds[0] === initialState.itemIds[1]);
      assert(nextState.itemIds[1] === initialState.itemIds[0]);
    });
  });

  context('when moveToNext is called', () => {
    it('swaps the item with the next item', () => {
      const { initialState } = setup();
      const action = RulesActions.moveToNext(1);

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemIds[1] === initialState.itemIds[2]);
      assert(nextState.itemIds[2] === initialState.itemIds[1]);
    });
  });
});
