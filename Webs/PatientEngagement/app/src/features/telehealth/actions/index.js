/* istanbul ignore file */
export const getCallHistoryData = data => ({
  type: 'CALL_HISTORY_DATA',
  data,
});
export const clearHistoryData = data => ({
  type: 'CLEAR_HISTORY_DATA',
  data,
});
export const setCallStatus = status => ({
  type: 'CALL_STATUS',
  status,
});
export const setCallIncomming = status => ({
  type: 'CALL_INCOMMING',
  status,
});
