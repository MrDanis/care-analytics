/* istanbul ignore file */
import request from '../NetworkHelper';

function getAuthToken(email, isEmail) {
  console.log(email);
  console.log(isEmail);
  if (isEmail === true) {
    return request(false, {
      url: '/360PatientEngagement/api/Login/GetOTP?Email=' + email,
      method: 'GET',
    });
  } else {
    return request(false, {
      url: '/360PatientEngagement/api/Login/GetOTP?Phone=' + email,
      method: 'GET',
    });
  }
}
function getAccessToken(otp, authCode) {
  console.log(otp);
  console.log(authCode);
  return request(false, {
    url:
      '/360PatientEngagement/api/Login/VerifyOTP?AuthCode=' +
      authCode +
      '&OTP=' +
      otp,
    method: 'GET',
  });
}
function verifyFacebookAccessToken(fbAccessToken) {
  console.log('fbAccessToken');
  console.log(fbAccessToken);
  return request(false, {
    url:
      '/360PatientEngagement/api/Login/VerifyWithFBToken?accessToken=' +
      fbAccessToken,
    method: 'GET',
  });
}
function verifyGoogleAccessToken(AuthCode) {
  console.log('googleAccessToken');
  console.log(AuthCode);
  return request(false, {
    url:
      '/360PatientEngagement/api/Login/VerifyWithGoogleToken?authCode=' +
      AuthCode,
    method: 'GET',
  });
}
function verifyAppleToken(data) {
  console.log('api/Login/VerifyWithApple');
  console.log(data);
  return request(false, {
    url: '/360PatientEngagement/api/Login/VerifyWithApple',
    method: 'POST',
    data: data,
  });
}
function getRefreshToken(refreshToken) {
  return request(false, {
    url: 'PatientTouchService/api/Login/RefreshToken?Refresh=' + refreshToken,
    method: 'GET',
  });
}

function getOTP(value, isEmail) {
  const dataObj = {
    Email: isEmail ? value : '',
    PhoneNumber: !isEmail ? value : '',
  };

  return request(false, {
    url: 'PatientTouchService/api/Login/GetOTP',
    method: 'POST',
    data: dataObj,
  });
}
function getTermsPolicy(isTerms) {
  return request(true, {
    url: 'PatientTouchService/api/Patient/SaveTermsStatus?status=' + isTerms,
    method: 'GET',
  });
}
function getBlueButtonAccessToken(data) {
  console.log('code here', data);
  return request(true, {
    url:
      '/360PatientEngagement/api/PatientHistory/AuthenticateWithBlueButton?code=' +
      data.code,
    method: 'POST',
  });
}
function getBlueButtonRefreshToken() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/AuthenticateWithBlueButton',
    method: 'POST',
  });
}
function loginACOUser(data) {
  console.log(data);
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/AuthenticateACOUser',
    method: 'POST',
    data: data,
  });
}
const AuthService = {
  getAuthToken,
  getRefreshToken,
  getOTP,
  getTermsPolicy,
  verifyAppleToken,
  getAccessToken,
  verifyFacebookAccessToken,
  verifyGoogleAccessToken,
  getBlueButtonAccessToken,
  loginACOUser,
  getBlueButtonRefreshToken,
};

export default AuthService;
