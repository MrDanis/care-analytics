/* istanbul ignore file */
export const getLookUpMedication = medication => ({
  type: 'GET_LOOK_UP_MEDICATION',
  medication,
});
export const getAllMedication = medication => ({
  type: 'GET_All_MEDICATION',
  medication,
});
export const getTodayMedication = medication => ({
  type: 'GET_TODAY_MEDICATION',
  medication,
});
export const getMedicationById = medication => ({
  type: 'GET_MEDICATION_BY_ID',
  medication,
});
export const getUserLocation = location => ({
  type: 'GET_USER_LOCATION',
  location,
});
export const modalHanlder = bool => ({
  type: 'GET_MODAL_HANDLER',
  bool,
});
