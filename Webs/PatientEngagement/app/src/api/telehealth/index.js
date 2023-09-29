/* istanbul ignore file */
import request from '../NetworkHelper';

function getCallHistoryData(pageNo) {
  return request(true, {
    url: 'PatientTouchService/api/HomeScreen/PatientCallLogs?PageNo=' + pageNo,
    method: 'GET',
  });
}
function postCallRating(dataObject) {
  console.log(dataObject);
  return request(true, {
    url: 'PatientTouchService/api/Call/CallRating',
    method: 'POST',
    data: dataObject,
  });
}
function generateTokenOnServer(patientId, acoKey, telewiseAppointmentID) {
  let requestURL =
    '/TeleHealth/TwilioComm/api/Utilities/api/AppToken?patientId=' +
    patientId +
    '&acoKey=' +
    acoKey +
    '&appointmentId=' +
    telewiseAppointmentID;

  return request(true, {
    url: requestURL,
    method: 'GET',
  });
}
const TeleHealthService = {
  getCallHistoryData,
  generateTokenOnServer,
  postCallRating,
};

export default TeleHealthService;
