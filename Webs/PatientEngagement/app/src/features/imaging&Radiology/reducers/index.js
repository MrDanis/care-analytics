/* istanbul ignore file */
export const imagingData = (state = false, action) => {
  switch (action.type) {
    case 'GET_IMAGING_DATA':
      return action.data;
    default:
      return state;
  }
};
