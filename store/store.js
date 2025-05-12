export const createStore = (initialState, reducers) => {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    
    dispatch: (action, payload) => {
      if (reducers[action]) {
        state = reducers[action](state, payload);
        listeners.forEach(listener => listener(state));
      }
    },

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};