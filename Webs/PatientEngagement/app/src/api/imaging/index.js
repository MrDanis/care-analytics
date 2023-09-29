/* istanbul ignore file */
import request from '../NetworkHelper';

function getImagingData() {
  return request(true, {
    url: '/360PatientEngagement/api/Imaging/GetImaging',
    method: 'GET',
  });
}

function uploadimagingData(imagingData, imageData) {
  console.log(imagingData);
  const formdata = new FormData();
  formdata.append('Name', imagingData.Name);
  formdata.append('Description', imagingData.Description);
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
  console.log(JSON.stringify(formdata));
  return request(true, {
    url: '360PatientEngagement/api/Imaging/AddImaging',
    method: 'POST',
    data: formdata,
  });
}

const ImagingService = {
  getImagingData,
  uploadimagingData,
};

export default ImagingService;
