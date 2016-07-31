import assert from 'power-assert';
import _ from 'lodash';

import rulesReducer from '../../src/reducers/rules';
import * as RulesActions from '../../src/actions/Rules';
import { createRule } from '../../src/utils/RuleUtils';
import generateUniqueId from '../../src/utils/generateUniqueId';

describe('rules', () => {
  const setup = () => {
    const itemIds = _.times(4, generateUniqueId);

    return {
      initialState: {
        itemIds,
        itemsById: {
          [itemIds[0]]: { matchingText: 'foo', valid: true, isolate: false },
          [itemIds[1]]: { matchingText: 'bar', valid: true, isolate: false },
          [itemIds[2]]: { matchingText: 'baz', valid: true, isolate: false },
          [itemIds[3]]: { matchingText: 'hoge', valid: true, isolate: false }
        }
      }
    };
  };

  it('returns initialState when no action match', () => {
    const result = rulesReducer(undefined, { type: null });
    assert.deepEqual(result, { itemIds: [], itemsById: {} });
  });

  context('when modifyRegExpById is called', () => {
    it('modifies matchingText', () => {
      const { initialState } = setup();
      const id = initialState.itemIds[0];
      const action = RulesActions.modifyRegExpById(id, 'bar');

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemsById[id].matchingText === 'bar');
    });

    specify('validation fails when the input is invalid', () => {
      const { initialState } = setup();
      const id = initialState.itemIds[0];
      const action = RulesActions.modifyRegExpById(id, '\\');

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemsById[id].valid === false);
    });
  });

  context('when toggleDisableById is called', () => {
    it('toggles disable', () => {
      const { initialState } = setup();
      const id = initialState.itemIds[0];
      const action = RulesActions.toggleDisableById(id);

      const first = rulesReducer(initialState, action);
      assert(first.itemsById[id].disable === true);

      const second = rulesReducer(first, action);
      assert(second.itemsById[id].disable === false);
    });
  });

  context('when toggleIsolateById is called', () => {
    it('toggles isolate', () => {
      const { initialState } = setup();
      const id = initialState.itemIds[0];
      const action = RulesActions.toggleIsolateById(id);

      const first = rulesReducer(initialState, action);
      assert(first.itemsById[id].isolate === true);

      const second = rulesReducer(first, action);
      assert(second.itemsById[id].isolate === false);
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

  context('when removeById is called', () => {
    it('remove the specified item from items', () => {
      const { initialState } = setup();
      const id = initialState.itemIds[1];
      const action = RulesActions.removeById(id);

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemIds.length === initialState.itemIds.length - 1);
      assert(!nextState.itemsById.hasOwnProperty(id));
    });
  });

  context('when moveToPrevious is called', () => {
    it('swaps the item with the previous item', () => {
      const { initialState } = setup();
      const ids = initialState.itemIds;
      const action = RulesActions.moveToPrevious(ids[1]);

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemIds[ids[0]] === initialState.itemIds[ids[1]]);
      assert(nextState.itemIds[ids[1]] === initialState.itemIds[ids[0]]);
    });
  });

  context('when moveToNext is called', () => {
    it('swaps the item with the next item', () => {
      const { initialState } = setup();
      const ids = initialState.itemIds;
      const action = RulesActions.moveToNext(ids[1]);

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemIds[ids[1]] === initialState.itemIds[ids[2]]);
      assert(nextState.itemIds[ids[2]] === initialState.itemIds[ids[1]]);
    });
  });

  context('when moveToGroupById is called', () => {
    it('swaps the item with the next item', () => {
      const { initialState } = setup();
      const ruleId = initialState.itemIds[1];
      const newGroupId = generateUniqueId();
      const action = RulesActions.moveToGroupById(ruleId, newGroupId);

      const nextState = rulesReducer(initialState, action);
      assert(nextState.itemsById[ruleId].groupId === newGroupId);
    });
  });
});
