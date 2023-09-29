/* istanbul ignore file */
import {Alert, Platform} from 'react-native';
import {
  HandleNotification,
  showDefaultPushNotification,
  showRelatedScreen,
} from './NotificationHandler';
import messaging from '@react-native-firebase/messaging';
import FCMTokenService from '../api/notification';
import {source} from '../api/constants';
var myRef = null;
export const checkPermission = async ref => {
  myRef = ref;
  const enabled = await messaging().hasPermission();
  if (enabled) {
    getFcmToken();
  } else {
    requestPermission();
  }
};

export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('FCM Token:', fcmToken);
    return fcmToken;
  } else {
    showAlert('Failed', 'No token received');
  }
};

const requestPermission = async () => {
  try {
    await messaging().requestPermission();
    // User has authorised
  } catch (error) {
    // User has rejected permissions
  }
};

export const messageListener = async () => {
  const notification = messaging.notifications();
  this.notificationOnNotification = messaging()
    .notifications()
    .onNotification(async notification => {
      console.log('comingggggggg onNotification');
      // HandleNotification(notification, myRef);
    });

  this.notificationOpenedListener = messaging().onNotificationOpenedApp(
    async notificationOpen => {
      console.log('openNotification', notificationOpen);
      const {data} = notificationOpen.notification;
      const {type} = data;
    },
  );

  const notificationOpen = await messaging().getInitialNotification();
  if (notificationOpen) {
    const {data} = notificationOpen.notification;
    const {type} = data;
    console.log('dataaaaaaa', data);
  }
  this.onMessageListener = messaging().onMessage(async remoteMessage => {
    setTimeout(function () {
      console.log('FireBase Incoming onMessage', remoteMessage);
      HandleNotification(remoteMessage, myRef);
    }, 1000);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
};

const showAlert = (title, message) => {
  Alert.alert(
    title,
    message,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
  );
};

export function savePushTokenOnServer(token, type: TokenType) {
  // 0 for Android, 1 for iOS
  // let source = Platform.OS === 'ios' ? 1 : 0;
  let data = JSON.stringify({
    token: token,
    source: source,
    type: type,
  });
  FCMTokenService.postFCMToken(data)
    .then(response => {
      let responseData = JSON.parse(JSON.stringify(response));
      if (responseData) {
        console.log('token success');
      }
    })
    .catch(error => {
      console.log('token error');
    });
}
