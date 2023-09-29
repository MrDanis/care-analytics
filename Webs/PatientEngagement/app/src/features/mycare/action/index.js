export const getAllVitals = vitalsData => ({
  type: 'GET_ALL_VITALS',
  vitalsData,
});
export const getVitalCategoryData = vitalCategoryData => ({
  type: 'GET_VITAL_Category_DATA',
  vitalCategoryData,
});
export const getVitalSubTypesData = vitalSubTypesData => ({
  type: 'GET_VITAL_SUB_TYPE_DATA',
  vitalSubTypesData,
});
