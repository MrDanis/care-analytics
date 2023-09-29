/* istanbul ignore file */
export const medicationLookUpData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_LOOK_UP_MEDICATION':
      return action.medication;
    default:
      return state;
  }
};
export const allMedicationData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_All_MEDICATION':
      return action.medication;
    default:
      return state;
  }
};
export const allTodayMedicationData = (state = [], action) => {
  switch (action.type) {
    case 'GET_TODAY_MEDICATION':
      return action.medication;
    default:
      return state;
  }
};

export const medicationByIdData = (state = [], action) => {
  switch (action.type) {
    case 'GET_MEDICATION_BY_ID':
      return action.medication;
    default:
      return state;
  }
};

export const userLocationData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_LOCATION':
      return action.location;
    default:
      return state;
  }
};

export const modalHandlerReducer = (state = true, action) => {
  console.log('====================================');
  console.log('action in bool', action.bool);
  console.log('====================================');
  switch (action.type) {
    case 'GET_MODAL_HANDLER':
      return action.bool;
    default:
      return state;
  }
};
