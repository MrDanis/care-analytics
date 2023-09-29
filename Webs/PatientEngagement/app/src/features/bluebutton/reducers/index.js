/* istanbul ignore file */

const initialState = {
  mytabID:0,
}

export const medicationHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_MEDICATION_HISTORY':
      return action.medication;
    default:
      return state;
  }
};
export const appointmentHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_APPOINTMENT_HISTORY':
      return action.appointment;
    default:
      return state;
  }
};
export const diseasesHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_DISEASES_HISTORY':
      return action.diseases;
    default:
      return state;
  }
};
export const proceduresHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_PROCEDURES_HISTORY':
      return action.procedure;
    default:
      return state;
  }
};
export const allergiesHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ALLERGIES_HISTORY':
      return action.allergies;
    default:
      return state;
  }
};
export const coverageHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_COVERAGE_HISTORY':
      return action.coverage;
    default:
      return state;
  }
};

export const hospitalVisitHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_HOSPITAL_VISIT_HISTORY':
      return action.hospital;
    default:
      return state;
  }
};

export const providerHistoryData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_PROVIDER_HISTORY':
      return action.provider;
    default:
      return state;
  }
};
export const emailSharingResourceData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_EMAIL_SHARING_RESOURCE':
      return action.sharingResource;
    default:
      return state;
  }
};
export const appLogoutTime = (state = {}, action) => {
  switch (action.type) {
    case 'GET_APP_LOGOUT_TIME':
      return action.logoutTime;
    default:
      return state;
  }
};
export const Increase = (state = {initialState}, action) => {
  switch (action.type) {
    case 'MyFunc':
      console.log(state.initialState.mytabID);
      return state.initialState.mytabID+1;
    default:
      return state;
  }
};

