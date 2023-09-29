/* istanbul ignore file */
import request from '../NetworkHelper';
import {CURRENT_TARGET} from '../../../config/AppConfig';

function getAllVitals() {
  return request(true, {
    url: '/360PatientEngagement/api/Vitals/GetAllVitals',
    method: 'GET',
  });
}
function getVitalCategoryData() {
  return request(true, {
    url: '/360PatientEngagement/api/Vitals/VitalCategoryData',
    method: 'GET',
  });
}

function getVitalSubTypeData(VitalTypeId) {
  return request(true, {
    url: `/360PatientEngagement/api/Vitals/VitalSubTypes?VitalTypeId=${VitalTypeId}`,
    method: 'GET',
  });
}

function addVital(dataObject) {
  console.log('====================================');
  console.log('dataObject', dataObject);
  console.log('====================================');
  return request(true, {
    url: `/360PatientEngagement/api/Vitals/AddVital`,
    method: 'POST',
    data: dataObject,
  });
}

function getVitalCategoryHistory(vitalCategoryId, date, type) {
  // /api/Vitals/VitalHistory?VitalTypeId=6&date=2022-08-11
  return request(true, {
    url:
      '/360PatientEngagement/api/Vitals/VitalHistory?VitalTypeId=' +
      vitalCategoryId +
      '&date=' +
      date +
      '&type=' +
      type,
    method: 'GET',
  });
}
const VitalsService = {
  getAllVitals,
  getVitalCategoryData,
  getVitalSubTypeData,
  addVital,
  getVitalCategoryHistory,
};

export default VitalsService;
