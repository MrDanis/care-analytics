/* istanbul ignore file */
import request from '../NetworkHelper';

function postFCMToken(dataObject) {
  return request(true, {
    url: '/360PatientEngagement/api/Device/SaveDeviceToken',
    method: 'POST',
    data: dataObject,
  });
}
function getUserNotification(pageNo) {
  return request(true, {
    url: '/360PatientEngagement/api/Notification/Get?pageNo=' + pageNo,
    method: 'GET',
  });
}
// function clearUserNotification() {
//   return request(true, {
//     url: '/api/Notification/Clear',
//     method: 'GET',
//   });
// }
function readUserNotification() {
  return request(true, {
    url: '/360PatientEngagement/api/Notification/Read',
    method: 'GET',
  });
}
function clearUserNotification(notificationId) {
  console.log('notificationId', notificationId);
  return request(true, {
    url:
      '/360PatientEngagement/api/Notification/Clear?notificationId=' +
      notificationId,
    method: 'GET',
  });
}
function joinPhysicianInvite(notificationId) {
  return request(true, {
    url:
      '/360PatientEngagement/api/Notification/Joined?notificationId=' +
      notificationId,
    method: 'POST',
  });
}
const FCMTokenService = {
  postFCMToken,
  getUserNotification,
  clearUserNotification,
  // deleteUserNotification,
  readUserNotification,
  joinPhysicianInvite,
};
export default FCMTokenService;
