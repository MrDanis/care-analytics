/* istanbul ignore file */
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'react-native-crypto-js';
export const AuthCode = 'authCode';
export const AppleData = 'appleData';
export const AuthToken = 'authToken';
export const UserEmail = 'userEmail';
export const UserPhoneNumber = 'userNumber';
export const IsEmailORPhone = 'isEmailORPhone';
export const DrawOverly = 'drawOverlay';
export const RefreshToken = 'refreshToken';
export const IsAcoUserLogin = 'isAcoUserLogin';
export const BlueButtonAccessToken = 'blueButtonAccessToken';
export const BlueButtonRefreshToken = 'blueButtonRefreshToken';
export const TimeStamp = 'timeStamp';
export const OfflineAssessment = 'offlineAssessment';

const secretKey = '360PatientTouch' + DeviceInfo.getBundleId();
// secretKey.substring(0, 24);
console.log('====================================');
console.log('Device Info Secret Key', secretKey);
console.log('====================================');

//Store the data in encrypted form in local pref
export const storeItem = async (key, item) => {
  try {
    console.log('====================================');
    console.log('DeviceInfo.getBundleId()', DeviceInfo.getBundleId());
    console.log('====================================');
    //we want to wait for the Promise returned by AsyncStorage.setItem()
    //to be resolved to the actual value before returning the value
    let encryptedText = CryptoJS.AES.encrypt(item, secretKey).toString();
    if (encryptedText && !encryptedText.isEmpty) {
      await AsyncStorage.setItem(key, encryptedText);
    }
  } catch (error) {
    console.log('Error in Store Item', error.message);
  }
};

//the functionality of the retrieveItem is to ge the data from local pref and decrypt it
export const retrieveItem = async key => {
  try {
    const cipherText = await AsyncStorage.getItem(key);
    if (cipherText && !cipherText.isEmpty) {
      let bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
      let originalText = bytes.toString(CryptoJS.enc.Utf8);
      // console.log('originalText' + originalText);
      return originalText;
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Store the value in local pref
export const storeValue = async (key, item) => {
  try {
    //we want to wait for the Promise returned by AsyncStorage.setItem()
    //to be resolved to the actual value before returning the value
    if (item && !item.isEmpty) {
      await AsyncStorage.setItem(key, item);
    }
  } catch (error) {
    console.log(error.message);
  }
};

//the functionality of the retrieveValue is to ge the data from local pref
export const retrieveValue = async key => {
  try {
    const cipherText = await AsyncStorage.getItem(key);
    if (cipherText && !cipherText.isEmpty) {
      return cipherText;
    }
  } catch (error) {
    console.log(error.message);
  }
};
export const removeItemValue = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};
