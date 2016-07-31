import assign from 'object-assign';
import { createSelector } from 'reselect';

export const getRules = createSelector(
  (state) => state.rules,
  (rules) => {
    const { itemIds, itemsById } = rules;
    const groupsById = itemIds.reduce((memo, id) => {
      const item = itemsById[id];
      const groupId = item.groupId;
      const group = memo[groupId] = memo[groupId] || [];
      group.push(item);
      return memo;
    }, {});

    return assign(
      {},
      rules,
      {
        groupIds: Object.keys(groupsById),
        groupsById,
      }
    );
  }
);
