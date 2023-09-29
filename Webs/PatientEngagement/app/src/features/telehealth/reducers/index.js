/* istanbul ignore file */
export const callHistoryData = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_HISTORY_DATA':
      state.pop();
      return [];
    case 'CALL_HISTORY_DATA':
      return state.length ? [...state, ...action.data] : action.data;
    default:
      return state;
  }
};
export const getCallStatus = (state = false, action) => {
  switch (action.type) {
    case 'CALL_STATUS':
      return action.status;
    default:
      return state;
  }
};
export const getCallIncomming = (state = 0, action) => {
  switch (action.type) {
    case 'CALL_INCOMMING':
      return action.status;
    default:
      return state;
  }
};
