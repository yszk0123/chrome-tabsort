import generateUniqueId from '../utils/generateUniqueId';

export const createRule = (groupId) => {
  return {
    id: generateUniqueId(),
    groupId: groupId || generateUniqueId(),
    regexp: '',
    valid: true,
    disable: false,
    isolate: false
  };
};
