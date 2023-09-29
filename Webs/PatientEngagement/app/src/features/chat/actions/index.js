/* istanbul ignore file */
export const getCMStatus = status => ({
  type: 'UPDATE_STATUS',
  status,
});
export const sendMessage = message => ({
  type: 'SEND_MESSAGE',
  message,
});
export const getHistoryData = data => ({
  type: 'HISTORY_DATA',
  data,
});
export const clearData = data => ({
  type: 'CLEAR_DATA',
  data,
});
export const getSignalRStatus = status => ({
  type: 'SIGNALR_CONNECTION',
  status,
});
export const getSplashSignalRStatus = status => ({
  type: 'SPLASH_SIGNALR_CONNECTION',
  status,
});
export const getCareCoordinationContactList = data => ({
  type: 'CARECOORDINATION_CONTACT_LIST',
  data,
});
export const getPhysicianContactList = data => ({
  type: 'PHYSICIAN_CONTACT_LIST',
  data,
});
