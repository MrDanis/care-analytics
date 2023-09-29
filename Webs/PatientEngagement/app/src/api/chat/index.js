/* istanbul ignore file */
import request from '../NetworkHelper';

function getChatHistoryData(cmId, pageNo, appointmentId) {
  console.log('====================================');
  console.log('pageNo', pageNo);
  console.log('====================================');
  return request(true, {
    url:
      '/360PatientEngagement/api/Chat/ChatHistory?receiverId=' +
      cmId +
      '&pageNo=' +
      pageNo,
    method: 'GET',
  });
}

function getCareCoordinationContacts() {
  return request(true, {
    url: '/360PatientEngagement/api/Contact/GetCareCoordination',
    method: 'GET',
  });
}

function getPhysicianContacts() {
  return request(true, {
    url: '/360PatientEngagement/api/Contact/GetPhysician',
    method: 'GET',
  });
}

function uploadAttachments(dataObject) {
  return request(true, {
    url: 'PatientTouchService/api/Chat/UploadChatFile',
    method: 'POST',
    data: dataObject,
  });
}
const ChatService = {
  getChatHistoryData,
  uploadAttachments,
  getPhysicianContacts,
  getCareCoordinationContacts,
};

export default ChatService;
