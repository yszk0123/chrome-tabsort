export default (initialState, reducers) => {
  return (state = initialState, action) => {
    if (!reducers.hasOwnProperty(action.type)) {
      return state;
    }

    return reducers[action.type](state, action);
  };
};
