/* istanbul ignore file */
import {
  AuthCode,
  AuthToken,
  BlueButtonAccessToken,
  DrawOverly,
  IsAcoUserLogin,
  retrieveItem,
  storeItem,
} from './LocalStorage';
import moment from 'moment';
import {PermissionsAndroid, Platform, Alert, Linking} from 'react-native';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import VersionCheck from 'react-native-version-check';
import RNDrawOverlay from 'react-native-draw-overlay';
import {DayTime} from '../features/medication/constants';
import {getFcmToken, savePushTokenOnServer} from './NotificationHelper';
import {TokenType} from '../api/NetworkHelper';
import {voipPushToken} from './PushKit/PushKitHelper';

export const isAuthCode = async () => {
  var isToken = false;
  await retrieveItem(AuthCode).then(authToken => {
    console.log('isAuthCode');
    console.log(authToken);
    if (authToken && !authToken.isEmpty) {
      isToken = true;
    } else {
      isToken = false;
    }
  });
  return isToken;
};
export async function isAccessToken() {
  var isToken = false;
  await retrieveItem(AuthToken).then(authToken => {
    if (authToken && !authToken.isEmpty) {
      isToken = true;
    } else {
      isToken = false;
    }
  });
  return isToken;
}
export async function isBlueButtonToken() {
  var isToken = false;
  await retrieveItem(BlueButtonAccessToken).then(authToken => {
    if (authToken && !authToken.isEmpty) {
      isToken = true;
    } else {
      isToken = false;
    }
  });
  return isToken;
}
export const isACOUserLogin = async () => {
  let isLogin = false;
  await retrieveItem(IsAcoUserLogin).then(login => {
    console.log('isACOUserLogin');
    console.log(login);
    if (login && login === 'true') {
      isLogin = true;
    } else {
      isLogin = false;
    }
  });
  return isLogin;
};
export const showGreetings = hour => {
  if (hour >= 0 && hour <= 11) {
    return 'Good Morning';
  } else if (hour >= 12 && hour <= 16) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};
// export const getNewUUID = () => uuidv4();
export const getNewUUID = () => {
  var dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
};

export const getInitials = string => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const toHHMMSS = secs => {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map(v => (v < 10 ? '0' + v : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

export const toformattedHourMinSec = (secs, detailed: Boolean = false) => {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;
  let tempArray = [hours, minutes, seconds];

  var formattedStr = '';
  for (let i = 0; i < tempArray.length; i++) {
    let value = tempArray[i];
    if (value === 0) {
      continue;
    }
    if (i === 0) {
      formattedStr =
        formattedStr +
        value +
        (detailed ? (value > 1 ? ' Hours' : ' Hour') : 'h');
    }

    if (i === 1) {
      formattedStr = formattedStr + value + (detailed ? ' Minutes' : 'm');
    }

    if (i === 2) {
      formattedStr = formattedStr + value + (detailed ? ' Seconds' : 's');
    }

    formattedStr = formattedStr + ' ';
  }
  formattedStr = formattedStr.trim();
  return formattedStr;
};

export const isTodayYesterday = (date, dateFormat = 'MMM D, YYYY', title) => {
  console.log('====================================');
  console.log('date', date);
  console.log('====================================');
  console.log('====================================');
  console.log('title in tOday function', title);
  console.log('====================================');
  let engagementDate = moment(date).format('YYYY-MM-DD');
  const REFERENCE = title;
  const TODAY = REFERENCE.clone().startOf('day');
  const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
  let tomorrow = moment().add(1, 'day');

  if (moment(REFERENCE).isSame(TODAY, 'day')) {
    return 'Today';
  } else if (moment(REFERENCE).isSame(YESTERDAY, 'day')) {
    return 'Yesterday';
  } else if (moment(REFERENCE).isSame(tomorrow, 'day')) {
    return 'Tomorrow';
  } else {
    return moment(new Date(date)).format(dateFormat).toUpperCase();
  }
};
export const isSameDay = (date, otherDate) => {
  return date.toDateString() === otherDate.toDateString();
};

let micAccessAlertTitle = 'Allow Microphone';
let micAccessAlertMessage =
  'Microphone access is required for Audio / Video calling feature.';

let bluetoothAndroidAlertTitle = 'Allow Location';
let bluetoothAndroidAlertMessage =
  'Location access is required to find and connect nearby bluetooth devices.';

let bluetoothIOSAlertTitle = 'Allow Bluetooth';
let bluetoothIOSAlertMessage =
  'Bluetooth access is required to find and connect nearby bluetooth devices.';

let cameraAccessAlertTitle = 'Allow Camera';
let cameraAccessAlertMessage =
  'Camera access is required for Audio / Video calling feature.';

let calenderAccessAlertTitle = 'Allow Calender';
let calenderAccessAlertMessage =
  'Calender access is required for appointments feature.';

let drawOverTitle = 'Allow Appear on top Permission';
let drawOverMessage =
  'Appear on top is required for Audio / Video calling feature.';

export async function requestAudioPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: micAccessAlertTitle,
        message: micAccessAlertMessage,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the mic');
    } else {
      console.log('mic permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
export async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
      {
        title: cameraAccessAlertTitle,
        message: cameraAccessAlertMessage,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
export async function requestMicrophonePermission() {
  const result = await request(
    Platform.select({
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      ios: PERMISSIONS.IOS.MICROPHONE,
    }),
    {
      title: micAccessAlertTitle,
      message: micAccessAlertMessage,
      buttonPositive: 'OK',
      buttonNegative: 'Cancel',
      buttonNeutral: 'Ask me later',
    },
  );
  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('MIC PERMISSION GRANTED');
  } else {
    console.log('MIC PERMISSION GRANTED');
  }
}
export async function requestMicCameraPermission() {
  if (Platform.OS === 'ios') {
    const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
    const recordStatus = await request(PERMISSIONS.IOS.MICROPHONE);
    return {
      cameraPermission: cameraStatus,
      microphonePermission: recordStatus,
    };
  } else {
    const arecordStatus = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    const acameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
    const calenderStatus = await request(PERMISSIONS.ANDROID.WRITE_CALENDAR);
    return {
      microphonePermission: arecordStatus,
      cameraPermission: acameraStatus,
      calenderPermission: calenderStatus,
    };
  }
}
export async function requestBluetoothPermission() {
  if (Platform.OS === 'ios') {
    const bluetoothStatus = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    return {
      bluetoothPermission: bluetoothStatus,
    };
  } else {
    const bluetoothStatus = await request(
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    );
    return {
      bluetoothPermission: bluetoothStatus,
    };
  }
}

export async function checkMicPermission() {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      ios: PERMISSIONS.IOS.MICROPHONE,
    }),
  )
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.BLOCKED:
        case RESULTS.DENIED:
          Alert.alert(
            micAccessAlertTitle,
            micAccessAlertMessage,
            [
              {
                text: 'Later',
                onPress: null,
              },
              {
                text: 'Give Access',
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn('cannot open settings'),
                  ),
              },
            ], // open store if update is needed.
            {cancelable: false},
          );
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
      }
    })
    .catch(error => {
      // …
    });
}
export async function checkCameraPermission() {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  )
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.BLOCKED:
        case RESULTS.DENIED:
          Alert.alert(
            cameraAccessAlertTitle,
            cameraAccessAlertMessage,
            [
              {
                text: 'Later',
                onPress: null,
              },
              {
                text: 'Give Access',
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn('cannot open settings'),
                  ),
              },
            ], // open store if update is needed.
            {cancelable: false},
          );
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          // requestCameraPermission();
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
      }
    })
    .catch(error => {
      // …
    });
}
export async function checkCalenderPermission() {
  check(
    Platform.select({
      android: [
        PERMISSIONS.ANDROID.WRITE_CALENDAR,
        PERMISSIONS.ANDROID.READ_CALENDAR,
      ],
      ios: PERMISSIONS.IOS.CALENDARS,
    }),
  )
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.BLOCKED:
        case RESULTS.DENIED:
          Alert.alert(
            calenderAccessAlertTitle,
            calenderAccessAlertMessage,
            [
              {
                text: 'Later',
                onPress: null,
              },
              {
                text: 'Give Access',
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn('cannot open settings'),
                  ),
              },
            ], // open store if update is needed.
            {cancelable: false},
          );
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          // requestCameraPermission();
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
      }
    })
    .catch(error => {
      // …
    });
}
export async function checkBluetoothPermission() {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    }),
  )
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.BLOCKED:
        case RESULTS.DENIED:
          Alert.alert(
            Platform.OS === 'ios'
              ? bluetoothIOSAlertTitle
              : bluetoothAndroidAlertTitle,
            Platform.OS === 'ios'
              ? bluetoothIOSAlertMessage
              : bluetoothAndroidAlertMessage,
            [
              {
                text: 'Later',
                onPress: null,
              },
              {
                text: 'Give Access',
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn('cannot open settings'),
                  ),
              },
            ], // open store if update is needed.
            {cancelable: false},
          );
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:
          console.log('BLUETOOTH PERMISSION GRANTED');
          break;
      }
    })
    .catch(error => {
      // …
    });
}
export function timeIntervalSinceNow(dateTime): Int {
  // 2020-04-03T15:45:02.862Z
  let currenTime = new Date().getTime();
  let targetTime = new Date(dateTime).getTime();
  let diff = (Number(currenTime) - Number(targetTime)) / 1000;
  // returning timeinterval in seconds.
  return diff;
}
export function showBluetoothNotEnabledAlert() {
  Alert.alert(
    'Bluetooth Not Enabled',
    'Please enable Bluetooth in Settings to find and connect nearby devices.',
    [
      {
        text: 'OK',
        onPress: () => {
          // openSettings().catch(() => console.warn('cannot open settings'));
        },
      },
    ], // open store if update is needed.
    {cancelable: true},
  );
}
export function showUpdateAlert() {
  console.log(VersionCheck.getPackageName()); // com.wisemani.patienttouch
  console.log(VersionCheck.getCurrentBuildNumber()); // 1
  console.log(VersionCheck.getCurrentVersion()); // 1.0
  VersionCheck.needUpdate().then(async res => {
    console.log(res.isNeeded); // true
    if (res.isNeeded) {
      Alert.alert(
        'Update Available!',
        'A newer version of this application is available. Would you like to update?',
        [
          {text: 'Not Now', onPress: null, style: 'cancel'},
          {
            text: 'Update',
            onPress: () => Linking.openURL(res.storeUrl),
          },
        ], // open store if update is needed.
        {cancelable: true},
      );
    }
  });
}
export function allowDrawOverPermission() {
  Alert.alert(
    drawOverTitle,
    drawOverMessage,
    [
      {
        text: 'Later',
        onPress: null,
        style: 'cancel',
      },
      {
        text: 'Give Access',
        onPress: () => {
          RNDrawOverlay.askForDispalayOverOtherAppsPermission()
            .then(res => {
              // res will be true if permission was granted
              console.log('response', res);
              storeItem(DrawOverly, 'true');
            })
            .catch(e => {
              // permission was declined
              console.log('response', e);
              storeItem(DrawOverly, 'false');
            });
        },
      },
    ], // open store if update is needed.
    {cancelable: true},
  );
}
export function specialCharValidate(value) {
  //Regex for Valid Characters i.e. Alphabets, Numbers and Space.
  var regex = /^[A-Za-z0-9 ]+$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(value);
  return isValid;
}
export function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);
  return newDate;
}
export function getFormattedTimeWithAMPM(date) {
  let createdDate = convertUTCDateToLocalDate(new Date(date)).toLocaleString();
  let formattedTime = moment(createdDate).format('hh:mm A');
  return formattedTime;
}
//05:15 AM
export function getDayTime(timeString) {
  var data = timeString.split(':');
  let hour = parseInt(data[0]);
  let minute = parseInt(data[1]);
  if (timeString.includes('PM')) {
    if (hour !== 12) {
      hour = hour + 12;
    }
  }
  // console.log(hour);
  // console.log(minute);
  switch (true) {
    case hour >= 0 && hour < 11:
      return DayTime.MORNING;
    case hour == 10 && minute <= 59:
      return DayTime.MORNING;
    case hour >= 11 && hour < 18:
      return DayTime.NOON;
    case hour == 17 && minute <= 59:
      return DayTime.NOON;
    case hour >= 18 && hour < 24:
      return DayTime.EVENING;
    case hour == 23 && minute <= 59:
      return DayTime.EVENING;
    // case hour >= 20 && hour < 24:
    //   return DayTime.NIGHT;
    // case hour == 24 && minute <= 59:
    //   return DayTime.NIGHT;
    default:
      console.log('come her to default');
  }
}
export function getBetweenTime(timeString) {
  var currentTime = convertUTCDateToLocalDate(new Date());
  var date = new Date();
  console.log('getBetweenTime********');
  console.log(timeString);
  console.log(currentTime.getUTCHours() + ':' + currentTime.getUTCMinutes());
  var data = timeString.split(':');
  let hour = parseInt(data[0]);
  let minute = parseInt(data[1]);
  if (timeString.includes('PM')) {
    hour = hour + 12;
  }
  date.setHours(hour);
  date.setMinutes(minute);
  if (convertUTCDateToLocalDate(date) < currentTime) {
    return true;
  } else {
    return false;
  }
}

export function validateEmail(text) {
  var reg = new RegExp(
    '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
  );
  if (reg.test(text) === false) {
    return false;
  } else {
    return true;
  }
}
export const validatePhone = text => {
  var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  if (regex.test(text) === false) {
    return false;
  } else {
    return true;
  }
};

export function getAllNumbersFromString(text) {
  return text.replace(/^\D+/g, ''); // replace all leading non-digits with nothing
}
export function saveTokens(responseData) {
  getFcmToken().then(token => {
    if (responseData.fcmToken !== token) {
      console.log('in fcm token');
      savePushTokenOnServer(token, TokenType.FIREBASE);
    }
  });
  if (responseData.voipToken !== voipPushToken && Platform.OS === 'ios') {
    console.log('in VOIP token', voipPushToken);
    savePushTokenOnServer(voipPushToken, TokenType.VOIP);
  }
}
export const allowedFiles = ['jpg', 'jpeg', 'pjpeg', 'png'];
