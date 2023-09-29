/* istanbul ignore file */
import {combineReducers} from 'redux';
import {userProfileData} from '../features/profile/reducers';
import {homeApiData} from '../features/home/reducers';
import {liveStepsData, liveDistanceData, liveSpeedData,liveHeartData} from '../features/welcome/reducers';
import {
  vitalsData,
  vitalCategoryData,
  vitalSubTypeData,
} from '../features/mycare/reducers';
import {
  diseasesHistoryData,
  appLogoutTime,
  emailSharingResourceData,
} from '../features/bluebutton/reducers';
import {
  allMedicationData,
  allTodayMedicationData,
  medicationByIdData,
  medicationLookUpData,
  userLocationData,
  modalHandlerReducer,
} from '../features/medication/reducers';
import {
  historyData,
  // messageData,
  cmStatusData,
  careCoordinationContactList,
  physicianContactList,
} from '../features/chat/reducers';

import {
  callHistoryData,
  getCallStatus,
  getCallIncomming,
} from '../features/telehealth/reducers';
import {labsData} from '../features/lab/reducers';
import {imagingData} from '../features/imaging&Radiology/reducers';
import {allCategoriesData} from '../features/discover/reducers';
import { authFromFit } from '../features/welcome/reducers';
export default combineReducers({
  userProfileData,
  liveStepsData,
  liveDistanceData,
  liveSpeedData,
  liveHeartData,
  homeApiData,
  allCategoriesData,
  diseasesHistoryData,
  appLogoutTime,
  vitalsData,
  vitalCategoryData,
  vitalSubTypeData,
  medicationLookUpData,
  allMedicationData,
  allTodayMedicationData,
  medicationByIdData,
  modalHandlerReducer,
  userLocationData,
  historyData,
  // messageData,
  cmStatusData,
  callHistoryData,
  getCallStatus,
  getCallIncomming,
  careCoordinationContactList,
  physicianContactList,
  labsData,
  imagingData,
  emailSharingResourceData,
  authFromFit
});
