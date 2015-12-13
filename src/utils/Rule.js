import generateUniqueId from '../utils/generateUniqueId';

export const createRule = (groupId) => {
  return {
    id: generateUniqueId(),
    groupId: groupId || generateUniqueId(),
    matchingText: '',
    valid: false,
    disable: false,
    isolate: false
  };
};
