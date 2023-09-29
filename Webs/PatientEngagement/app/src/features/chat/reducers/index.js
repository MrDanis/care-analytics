/* istanbul ignore file */
export const cmStatusData = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_STATUS':
      return action.status;
    default:
      return state;
  }
};
export const signalRStatus = (state = false, action) => {
  switch (action.type) {
    case 'SIGNALR_CONNECTION':
      return action.status;
    default:
      return state;
  }
};
export const splashSignalRStatus = (state = false, action) => {
  switch (action.type) {
    case 'SPLASH_SIGNALR_CONNECTION':
      return action.status;
    default:
      return state;
  }
};
export const careCoordinationContactList = (state = false, action) => {
  switch (action.type) {
    case 'CARECOORDINATION_CONTACT_LIST':
      return action.data;
    default:
      return state;
  }
};
export const physicianContactList = (state = false, action) => {
  switch (action.type) {
    case 'PHYSICIAN_CONTACT_LIST':
      return action.data;
    default:
      return state;
  }
};
export const historyData = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_DATA':
      state.pop();
      return [];
    case 'HISTORY_DATA':
      return state.length ? [...action.data, ...state] : action.data;
    case 'SEND_MESSAGE':
      // console.log('message', action.message);
      return [...state, action.message];
    default:
      return state;
  }
};
// export const messageData = (state = [], action) => {
//   switch (action.type) {
//     case 'SEND_MESSAGE':
//       return [...state, action.message];
//     default:
//       return state;
//   }
// };
