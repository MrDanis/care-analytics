/* istanbul ignore file */
export const getMedicationHistory = medication => ({
  type: 'GET_MEDICATION_HISTORY',
  medication,
});
export const getAppointmentHistory = appointment => ({
  type: 'GET_APPOINTMENT_HISTORY',
  appointment,
});
export const getDiseasesHistory = diseases => ({
  type: 'GET_DISEASES_HISTORY',
  diseases,
});
export const getProceduresHistory = procedure => ({
  type: 'GET_PROCEDURES_HISTORY',
  procedure,
});
export const getAllergiesHistory = allergies => ({
  type: 'GET_ALLERGIES_HISTORY',
  allergies,
});
export const getCoverageHistory = coverage => ({
  type: 'GET_COVERAGE_HISTORY',
  coverage,
});
export const getHospitalVisitHistory = hospital => ({
  type: 'GET_HOSPITAL_VISIT_HISTORY',
  hospital,
});
export const getProviderHistory = provider => ({
  type: 'GET_PROVIDER_HISTORY',
  provider,
});
export const getEmailSharingResource = sharingResource => ({
  type: 'GET_EMAIL_SHARING_RESOURCE',
  sharingResource,
});
export const getAppLogoutTime = logoutTime => ({
  type: 'GET_APP_LOGOUT_TIME',
  logoutTime,
});
export const Increase = payload => ({
  type: 'MyFunc',
  payload,
});
