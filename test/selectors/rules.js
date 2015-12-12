import assert from 'power-assert';
import _ from 'lodash';

import rulesSelector from '../../src/selectors/rules';
import generateUniqueId from '../../src/utils/generateUniqueId';

describe('rules', () => {
  const setup = () => {
    const itemIds = _.times(4, generateUniqueId);
    const groupIds = _.times(2, generateUniqueId);

    return {
      initialState: {
        itemIds,
        itemsById: {
          [itemIds[0]]: { groupId: groupIds[0] },
          [itemIds[1]]: { groupId: groupIds[1] },
          [itemIds[2]]: { groupId: groupIds[1] },
          [itemIds[3]]: { groupId: groupIds[0] }
        }
      },
      groupIds
    };
  };

  it('adds groupIds and groupsById', () => {
    const { initialState, itemIds, groupIds } = setup();
    const nextProps = rulesSelector(initialState);
    assert.deepEqual(nextProps.groupIds, groupIds);
    assert(nextProps.groupsById[groupIds[0]].every((group) => group.groupId === groupIds[0]));
    assert(nextProps.groupsById[groupIds[1]].every((group) => group.groupId === groupIds[1]));
  });
});
