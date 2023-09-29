/* istanbul ignore file */
import {AppState, Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as Constants from './Constants';
import MedicationService from '../api/medication';
import {getTodayMedicationData} from './NotificationApis';
import {func} from 'prop-types';
import {TwilioHelper} from './Twilio/TwilioHelper';

var myRef = null;
var navigation = null;

// createChannel(
//   Constants.NOTIFICATION_MED_REMINDER_CHANNEL_ID,
//   Constants.NOTIFICATION_MED_REMINDER_CHANNEL_NAME,
//   Constants.NOTIFICATION_REMINDER_SOUND_NAME,
// );
export async function HandleNotification(notification, ref) {
  myRef = ref;
  showNotification(notification);
}
function showNotification(notification) {
  console.log('showNotification', notification);
  const {data} = notification;
  const {body} = notification;
  const {type} = data;
  console.log('onNotification', data);
  console.log('onNotificationDataType', type);

  switch (type) {
    case Constants.NotificationType.chatMessage:
      showPatientInAppNotification(notification);
      break;
    case Constants.NotificationType.CallInitiated:
      if (Platform.OS !== 'ios') {
        let {data} = notification;
        TwilioHelper.sharedInstance().handleVOIPIncomingPush(data, true);
      }
      break;
    default:
      // showDefaultPushNotification(notification);
      let title = `${notification.data.name} • (${notification.data.dose})`;
      let reminderMessage = `Quantity: ${notification.data.qty} • ${
        notification.data.meal ? 'After Meal' : 'Before Meal'
      }`;
      scheduleLocalNotification(title, reminderMessage, notification.data);
      fireLocalNotificationNow(title, reminderMessage);
      break;
  }
}

export function setNavigation(nav) {
  navigation = nav;
}

// export function createChannel(channelID, channelName, soundName) {
//   // wakeUpApp();
//   PushNotification.createChannel(
//     {
//       channelId: channelID,
//       channelName: channelName, // (required)
//       // soundName: soundName,
//       importance: Importance.HIGH,
//       vibrate: true,
//     },
//     created => console.log(`createChannel ${channelID} returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
//   );
//   if (Platform.OS === 'ios') {
//     PushNotificationIOS.setNotificationCategories([
//       {
//         id: 'userAction',
//         actions: [
//           {
//             id: 'Taken',
//             title: 'TAKEN',
//             options: {foreground: true, destructive: false},
//           },
//           {
//             id: 'Missed',
//             title: 'MISSED',
//             options: {foreground: true, destructive: false},
//           },
//         ],
//       },
//     ]);
//   }
// }

export async function showDefaultPushNotification(remoteMessage) {
  const {notification} = remoteMessage;
  PushNotification.createChannel(
    {
      channelId: 'GENERAL_NOTIF_CHANNEL_ID1', // (required)
      channelName: 'Default channel', // (required)
      channelDescription: 'A default channel', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created =>
      console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: 'GENERAL_NOTIF_CHANNEL_ID1', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
    smallIcon: 'icon_tp', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    color: Colors.colorPrimary, // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    priority: 'high', // (optional) set notification priority, default: high
    visibility: 'private', // (optional) set notification visibility, default: private
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
    autoCancel: true, // (optional) default: true
    /* iOS only properties */
    alertAction: 'view', // (optional) default: view
    category: '', // (optional) default: empty string
    userInfo: remoteMessage.data,

    /* iOS and Android properties */
    title: notification.title, // (optional)
    message: notification.body, // (required)
    data: remoteMessage.data,
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  });
}

export async function fireLocalNotificationNow(
  title: string = title,
  body: string = body,
  data: NotificationSchedule,
) {
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: Constants.NOTIFICATION_DEFAULT_CHANNEL_ID, // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
    smallIcon: 'icon_tp', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    color: 'blue', // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    priority: 'high', // (optional) set notification priority, default: high
    visibility: 'private', // (optional) set notification visibility, default: private
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
    autoCancel: true, // (optional) default: true
    /* iOS only properties */
    // id: data.id,
    alertAction: 'view', // (optional) default: view
    category: '', // (optional) default: empty string
    userInfo: data,

    /* iOS and Android properties */
    title: title, // (optional)
    message: body, // (required)
    data: data,
    // playSound: true, // (optional) default: true
    // soundName: Constants.NOTIFICATION_REMINDER_SOUND_NAME,
    // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  });
}

export function scheduleLocalNotification(
  title = 'Medicine Reminder',
  message,
  data,
) {
  // console.log('message: ', message);
  // console.log('Data: ', data);
  let notification = createNotificationObject(title, message, data);
  // let quantityTaken = data.meal === '1' ? ' Before Meal' : ' After Meal';
  // let voiceMessage =
  // 'Medicine Reminder. Please take ' +
  // data.name.toLowerCase() +
  // quantityTaken +
  // ' of Quantity ' +
  // data.dose;
  if (Platform.OS === 'ios') {
    console.log('iOS Schedule - ', notification);
    // PushNotificationIOS.addNotificationRequest(notification);
    // PushNotificationIOS.addNotificationRequest({
    //   id: notification.id,
    //   title: title,
    //   body: message,
    //   // sound: Constants.NOTIFICATION_REMINDER_SOUND_NAME_WAV,
    //   badge: 0,
    //   // category: 'userAction',
    //   userInfo: {id: data.id, meal: data.meal, time: data.time},
    // });
    // console.log('new message');
    // console.log(voiceMessage);
    // Tts.setDucking(true);
    // Tts.setDefaultPitch(1);
    // Tts.setDefaultRate(1, true);
    // Tts.speak(voiceMessage, {
    //   androidParams: {
    //     KEY_PARAM_PAN: -1,
    //     KEY_PARAM_VOLUME: 1,
    //     KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
    //   },
    // });
  } else {
    // console.log('new message');
    // console.log(voiceMessage);
    PushNotification.localNotificationSchedule(notification);
    // Tts.setDucking(true);
    // Tts.setDefaultPitch(1);
    // Tts.setDefaultRate(1, true);
    // Tts.speak(voiceMessage, {
    //   androidParams: {
    //     KEY_PARAM_PAN: -1,
    //     KEY_PARAM_VOLUME: 1,
    //     KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
    //   },
    // });
  }
}

function createNotificationObject(title, message, data) {
  return {
    /* Android Only Properties */
    channelId: Constants.NOTIFICATION_MED_REMINDER_CHANNEL_ID, // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
    smallIcon: 'icon_tp', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    color: 'blue', // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    priority: 'high', // (optional) set notification priority, default: high
    visibility: 'private', // (optional) set notification visibility, default: private
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
    autoCancel: true, // (optional) default: true

    id: data.id,
    subText: 'Medicine Reminder',
    tag: data.tag,
    alertAction: 'view', // (optional) default: view
    actions: ['Taken', 'Missed'],
    invokeApp: false,
    category: 'userAction', // (optional) default: empty string
    title: title,
    message: message,
    alertTitle: title, // For iOS
    alertBody: message, // For iOS
    data: data,
    userInfo: data,
    date: new Date(Date.now()),
    // playSound: false,
    // soundName: Constants.NOTIFICATION_REMINDER_SOUND_NAME,
    number: 0,
    /* iOS only properties */
    subtitle: 'Medicine Reminder',
    body: message,
    // sound: Constants.NOTIFICATION_REMINDER_SOUND_NAME_WAV, // iOS
    badge: 0,
  };
}
export function cancelLocalNotificationWithTag(tag: string) {
  PushNotification.cancelLocalNotifications({tag: tag});
}
function handleButtonAction(NotificationData) {
  console.log(NotificationData);
  console.log('action: ', 'pressed');

  console.log('notificatinoData');
  console.log(NotificationData.data.id);
  console.log(NotificationData.data.meal);
  console.log(NotificationData.data.time);
  if (NotificationData && NotificationData.action === 'Taken') {
    var data = {};
    data.id = parseInt(NotificationData.data.id);
    data.taken = true;
    data.mealStatus = NotificationData.data.meal === '1' ? true : false;
    data.doseTime = NotificationData.data.time;
    MedicationService.UpdateTakenMedication(data)
      .then(response => {
        console.log('UpdateTakenMedication');
        getTodayMedicationData();
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  } else if (NotificationData && NotificationData.action === 'Missed') {
    var data = {};
    data.id = parseInt(NotificationData.data.id);
    data.taken = false;
    data.mealStatus = NotificationData.data.meal === '1' ? true : false;
    data.doseTime = NotificationData.data.time;
    MedicationService.UpdateTakenMedication(data)
      .then(response => {
        console.log('UpdateTakenMedication');
        getTodayMedicationData();
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
export function configurePushNotification(ref) {
  myRef = ref;
  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: notification => {
      console.log('Remote Notification REceived:', notification);
      if (AppState.currentState === 'active') {
        // console.log('State active');
        // GoogleCastHelper.getInstance().castMedia();

        HandleNotification(notification);
      }
      if (notification.userInteraction) {
        console.log('User Interaction', notification);
        handleButtonAction(notification);
      }
    },
    onAction: NotificationData => {
      handleButtonAction(NotificationData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: true,
  });
}

class NotificationSchedule {
  id: string;
  fireDate: string;
  repeatInterval: string; // month, week, day, hour, minute, time
  endDate: string;
  tag: string;
}
