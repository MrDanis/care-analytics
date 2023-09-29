/* istanbul ignore file */
import request from '../NetworkHelper';

function getLabsData() {
  return request(true, {
    url: '/360PatientEngagement/api/Labs/GetLabs',
    method: 'GET',
  });
}
function getLabsContactData() {
  return request(true, {
    url: '/360PatientEngagement/api/Contact/GetPatientLab',
    method: 'GET',
  });
}

function uploadLabData(labsData, imageData) {
  console.log(labsData);
  const formdata = new FormData();
  formdata.append('TestName', labsData.TestName);
  formdata.append('LabName', labsData.LabName);
  formdata.append('Description', labsData.Description);
  console.log('====================================');
  console.log('formdata', formdata);
  console.log('====================================');
  if (
    imageData &&
    imageData !== null &&
    imageData.name &&
    imageData.name !== null
  ) {
    formdata.append('Files', {
      uri: imageData.uri,
      name: imageData.name,
      type: imageData.type,
    });
  }
  console.log('formdata updateProfileData');
  console.log("hola",formdata);
  return request(true, {
    url: '360PatientEngagement/api/Labs/AddLabs',
    method: 'POST',
    data: formdata,
  });
}

const LabService = {
  getLabsData,
  uploadLabData,
  getLabsContactData,
};

export default LabService;
