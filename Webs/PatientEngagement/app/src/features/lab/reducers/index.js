/* istanbul ignore file */
export const labsData = (state = false, action) => {
  switch (action.type) {
    case 'GET_LAB_DATA':
      return action.data;
    default:
      return state;
  }
};
