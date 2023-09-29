import request from '../NetworkHelper';
import {convertUTCDateToLocalDate} from '../../helpers/Common';

function getAppointmentHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/Appointments',
    method: 'GET',
  });
}
function getAllergiesHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/Allergies',
    method: 'GET',
  });
}
function getCoverageHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/CoverageDetails',
    method: 'GET',
  });
}
function getHospitalVisitHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/HospitalVisits',
    method: 'GET',
  });
}

function getProviderHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/MyProviders',
    method: 'GET',
  });
}
function getRefreshTokenBlueButton() {
  return request(true, {
    url: '/360PatientEngagement/PatientHistory/MyProviders',
    method: 'POST',
  });
}
function sendPDFOverEmail(moduleID, emailAddress, sourceID) {
  return request(true, {
    url:
      '/360PatientEngagement/api/Pdf/GeneratePdf?module=' +
      moduleID +
      '&emailAddress=' +
      emailAddress +
      '&SharingSourceId=' +
      sourceID,
    method: 'GET',
  });
}
function sendPDFOverEmailById(moduleID, emailAddress, id, sourceID) {
  return request(true, {
    url:
      '/360PatientEngagement/api/Pdf/GeneratePdfById?module=' +
      moduleID +
      '&emailAddress=' +
      emailAddress +
      '&id=' +
      id +
      '&SharingSourceId=' +
      sourceID,
    method: 'GET',
  });
}
function getModuleShareHistory(moduleID, pageNumber) {
  return request(true, {
    url:
      '/360PatientEngagement/api/Pdf/GetHistory?module=' +
      moduleID +
      '&pageNumber=' +
      pageNumber,
    method: 'GET',
  });
}
function revokeSentEmail(id) {
  return request(true, {
    url: '/360PatientEngagement/api/Pdf/Revoke?id=' + id,
    method: 'GET',
  });
}
function getShareSource() {
  return request(true, {
    url: '/360PatientEngagement/api/Pdf/GetSharingSource',
    method: 'GET',
  });
}
const BlueButtonService = {
  getAppointmentHistory,
  getAllergiesHistory,
  getCoverageHistory,
  getHospitalVisitHistory,
  getProviderHistory,
  sendPDFOverEmail,
  getModuleShareHistory,
  revokeSentEmail,
  getShareSource,
  sendPDFOverEmailById,
};
export default BlueButtonService;
