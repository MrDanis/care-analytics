/* istanbul ignore file */
export const homeApiData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_HOME_API_DATA':
      return action.data;
    default:
      return state;
  }
};
export const modalData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_MODAL_DATA':
      return action.data;
    default:
      return state;
  }
};

