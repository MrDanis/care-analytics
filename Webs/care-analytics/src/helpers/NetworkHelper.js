import axios from 'axios'
// import {CURRENT_TARGET} from '../../config/AppConfig';
// import {HeaderInfo, source} from './constants';
// import {Alert, Platform} from 'react-native';
// import RNExitApp from 'react-native-exit-app';
// import {
//   AuthToken,
//   BlueButtonAccessToken,
//   RefreshToken,
//   retrieveItem,
//   storeItem,
// } from '../helpers/LocalStorage';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {showMessage, hideMessage} from 'react-native-flash-message';
// import NetInfo from '@react-native-community/netinfo';
// import Colors from '../../config/Colors';
// import FCMTokenService from './fcm';

/**
 * Request Wrapper with default success/error actions
 */
const request = async function (isHeader, options) {
  console.log('====================================');
  console.log('option.url', options.url);
  console.log('====================================');
  if (isHeader) {

  }
  const client = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      //text/plain
      Accept: 'text/plain,application/json',
      'Content-Type':
      networkCheck?
      (options.url ===
        '360PatientEngagement/api/PatientProfile/SaveUserProfile'||'360PatientEngagement/api/Labs/AddLabs'||'360PatientEngagement/api/Imaging/AddImaging'
          ? Platform.OS === 'ios'
            ? 'application/json, multipart/form-data'
            : 'multipart/form-data'
          : 'application/json,multipart/form-data'):
          (options.url ===
            '360PatientEngagement/api/PatientProfile/SaveUserProfile'
              ? Platform.OS === 'ios'
                ? 'application/json, multipart/form-data'
                : 'multipart/form-data'
              : 'application/json,multipart/form-data')
          ,
      // 'Meta-Data': HeaderInfo,
      // 'Security-Key': 'lSWQ9NyZ1c2VyTmFtZT1TeWVkIFNoYWgmcGF0aWVudElkPTMwMD',
      Authorization: 'Bearer '.concat(authToken === null ? '' : authToken),
      // access_token: blueButtonToken === null ? '' : blueButtonToken,
      ...(blueButtonToken && {access_token: blueButtonToken}),
    },
  });
  const onSuccess = function (response) {
    const {status} = response;
    if (status === 200) {
      return response.data;
    }
  };
  return client(options).then(onSuccess).catch(onError);
};

// function exitApp() {
//   AsyncStorage.clear();
//   // clearTokensOnServer();
//   Alert.alert(
//     'Care Management',
//     'Your care has been stopped.\nPlease contact your Care Manager.',
//     [{text: 'Close App', onPress: () => RNExitApp.exitApp()}],
//     {cancelable: false},
//   );
//   return true;
// }
export const TokenType = {
  FIREBASE: 0,
  VOIP: 1,
  CLEAR_TOKEN: 2,
};

export default request;
