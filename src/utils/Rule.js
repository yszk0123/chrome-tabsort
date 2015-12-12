import generateUniqueId from '../utils/generateUniqueId';

export const createRule = () => {
  return {
    id: generateUniqueId(),
    regexp: '',
    disable: false,
    isolate: false
  };
};
