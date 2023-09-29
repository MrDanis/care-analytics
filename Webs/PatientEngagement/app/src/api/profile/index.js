/* istanbul ignore file */
import request from '../NetworkHelper';
import {CURRENT_TARGET} from '../../../config/AppConfig';

function getUserProfile() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientProfile/GetUserProfile',
    method: 'GET',
  });
}
function updateProfileData(userData, imageData) {
  console.log(userData);
  const formdata = new FormData();
  formdata.append('FirstName', userData.FirstName);
  formdata.append('LastName', userData.LastName);
  formdata.append('Email', userData.Email);
  formdata.append('Phone', userData.Phone);
  formdata.append('Gender', userData.Gender);
  formdata.append('Address', userData.Address);
  formdata.append('DateOfBirth', userData.DateOfBirth);
  formdata.append('ReferenceNumber', userData.ReferenceNumber);
  formdata.append('startDate', userData.StartDate);
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
    url: '360PatientEngagement/api/PatientProfile/SaveUserProfile',
    method: 'POST',
    data: formdata,
  });
}
function userLogout() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientProfile/Logout',
    method: 'POST',
  });
}

const ProfileService = {
  getUserProfile,
  updateProfileData,
  userLogout,
};

export default ProfileService;
