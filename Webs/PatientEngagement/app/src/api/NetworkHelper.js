/* istanbul ignore file */
import axios from 'axios';
import {CURRENT_TARGET} from '../../config/AppConfig';
import {HeaderInfo, source} from './constants';
import {Alert, Platform} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {
  AuthToken,
  BlueButtonAccessToken,
  RefreshToken,
  retrieveItem,
  storeItem,
} from '../helpers/LocalStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';
import Colors from '../../config/Colors';
// import FCMTokenService from './fcm';

/**
 * Request Wrapper with default success/error actions
 */
const request = async function (isHeader, options) {
  console.log('====================================');
  console.log('option.url', options.url);
  console.log('====================================');
  let authToken = null;
  let blueButtonToken = null;
  if (isHeader) {
    authToken = await retrieveItem(AuthToken);
    blueButtonToken = await retrieveItem(BlueButtonAccessToken);
    console.log('Inside the request rn');
    console.log(authToken);
    console.log(blueButtonToken);
  }
  const conditionsToCheck = ['360PatientEngagement/api/Labs/AddLabs','360PatientEngagement/api/Imaging/AddImaging'];
  let networkCheck = conditionsToCheck.some(substring => options.url.includes(substring));
  console.log('Netwrok check is : ',networkCheck);
  const client = axios.create({
    baseURL: CURRENT_TARGET,
    headers: {
      //text/plain
      Accept: 'text/plain,application/json',
      'Security-Key': 'lSWQ9NyZ1c2VyTmFtZT1TeWVkIFNoYWgmcGF0aWVudElkPTMwMD',
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

  // client.interceptors.response.use(
  //   function(response) {
  //     return response;
  //   },
  //   async function(error) {
  //     const originalRequest = error.config;
  //     let refreshToken = null;
  //     if (error.response.status === 401 || error.response.status === 99) {
  //       refreshToken = await retrieveItem(RefreshToken);
  //       return AuthService.getRefreshToken(refreshToken)
  //         .then(response => {
  //           originalRequest.headers.Authorization =
  //             'Bearer ' + response.AccessToken;
  //           storeItem(AuthToken, response.AccessToken);
  //           storeItem(RefreshToken, response.RefreshToken);
  //           return axios(originalRequest);
  //         })
  //         .catch(error => {
  //           // console.log('erorrrrr' + error);
  //         });
  //     } else {
  //       return onError(error);
  //     }
  //   },
  // );

  const onSuccess = function (response) {
    const {status} = response;
    if (status === 200) {
      return response.data;
    }
  };

  const onError = async function (error) {
    NetInfo.fetch().then(state => {
      if (!state.isConnected && !state.isInternetReachable) {
        showMessage({
          message: 'Network Error',
          description: 'Internet is not available',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      }
    });
    if (error && error.response && error.response.status) {
      // Request was made but server responded with something
      // other than 2xx
      if (error.response.status === 401) {
        console.log('intercepter is called for 401');
        if (error.response.data && error.response.data.isError) {
          showMessage({
            message: 'Something went wrong!',
            description: error.response.data.Message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      } else if (error.response.status === 96) {
        if (error.response.data && error.response.data.isError) {
          showMessage({
            message: 'Something went wrong!',
            description: error.response.data.Message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      } else if (error.response.status === 520) {
        if (error.response.data && error.response.data.isError) {
          showMessage({
            message: 'Something went wrong!',
            description: error.response.data.Message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      } else if (error.response.status === 404) {
        if (error.response.data && error.response.data.isError) {
          showMessage({
            message: 'Something went wrong!',
            description: error.response.data.Message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      }
      else if(error.response.status === 500){
        if (error.response.data && error.response.data.detail) {
          showMessage({
            message: 'Something went wrong',
            description: "",
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      }
      console.log('Status:', error.response);
      console.log('Data:', error.response.data);
      // console.log('Headers:', error.response.headers);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      error && error.response && error.response.status;
      showMessage({
        message: 'Something went wrongssss!',
        description: error?.response?.data?.detail,
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.red,
      });
      console.log('Error Message:', error);
    }
    console.log('====================================');
    console.log('here in error');
    console.log('====================================');
    return Promise.reject(error.response.data);
  };
  return client(options).then(onSuccess).catch(onError);
};

function exitApp() {
  AsyncStorage.clear();
  // clearTokensOnServer();
  Alert.alert(
    'Care Management',
    'Your care has been stopped.\nPlease contact your Care Manager.',
    [{text: 'Close App', onPress: () => RNExitApp.exitApp()}],
    {cancelable: false},
  );
  return true;

}
export const TokenType = {
  FIREBASE: 0,
  VOIP: 1,
  CLEAR_TOKEN: 2,
};

// export function clearTokensOnServer() {
//   savePushTokenOnServer(
//     '<-Token Cleared from App upon logout->',
//     TokenType.CLEAR_TOKEN,
//   );
// }
// export function savePushTokenOnServer(token, type: TokenType) {
//   // 0 for Android, 1 for iOS
//   // let source = Platform.OS === 'ios' ? 1 : 0;
//   let data = JSON.stringify({
//     Token: token,
//     Source: source,
//     TokenType: type,
//   });
//   FCMTokenService.postFCMToken(data)
//     .then(response => {
//       let responseData = JSON.parse(JSON.stringify(response));
//       if (responseData) {
//         console.log('token success');
//       }
//     })
//     .catch(error => {
//       console.log('token error');
//     });
// }

export default request;
