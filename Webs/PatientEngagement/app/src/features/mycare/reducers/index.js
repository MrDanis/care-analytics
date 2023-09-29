export const vitalsData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ALL_VITALS':
      return action.vitalsData;
    default:
      return state;
  }
};
export const vitalCategoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_VITAL_Category_DATA':
      return action.vitalCategoryData;
    default:
      return state;
  }
};
export const vitalSubTypeData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_VITAL_SUB_TYPE_DATA':
      return action.vitalSubTypesData;
    default:
      return state;
  }
};
