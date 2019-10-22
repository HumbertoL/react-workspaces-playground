export const createReducer = (initialState, handlers) => (state = initialState, action) => (
  {}.hasOwnProperty.call(handlers, action.type)
    ? handlers[action.type](state, action)
    : state
);

export default createReducer;
