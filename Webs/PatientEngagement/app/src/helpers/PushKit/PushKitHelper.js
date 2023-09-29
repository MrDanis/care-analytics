/* istanbul ignore file */
import {DeviceEventEmitter} from 'react-native';
import VoipPushNotification from 'react-native-voip-push-notification';
import {TwilioHelper} from '../Twilio/TwilioHelper';
import {useDispatch} from 'react-redux';
import {setCallIncomming} from '../../features/telehealth/actions';

export var voipPushToken = '';
export default function startPushKit() {
  // const dispatch = useDispatch();
  VoipPushNotification.addEventListener('register', token => {
    // send token to your apn provider server
    console.log('VoIP token', token);
    voipPushToken = token;
  });

  // VoipPushNotification.onVoipNotificationCompleted()
  DeviceEventEmitter.addListener(
    'RNVoipPushNotificationRemoteNotificationsRegisteredEvent',
    data => {
      const voipToken = data.voipToken;
      console.log('====================================');
      console.log('voipToken last', data.voipToken);
      console.log('====================================');
      // Handle the registered VoIP token here
    },
  );
  // ...// Remove event listeners and clean up when necessary
  DeviceEventEmitter.removeAllListeners(
    'RNVoipPushNotificationRemoteNotificationsRegisteredEvent',
  );
  VoipPushNotification.addEventListener('notification', notification => {
    console.log('====================================');
    console.log('comin');
    console.log('====================================');
    console.log('====================================');
    console.log('notification in Voip', notification);
    console.log('====================================');
    // register your VoIP client, show local notification, etc.
    // e.g.
    // VoipPushNotification.onVoipNotificationCompleted(notification.uuid);
    // let {_data} = notification;
    // dispatch(setCallIncomming(true));
    TwilioHelper.sharedInstance().handleVOIPIncomingPush(notification);

    /* there is a boolean constant exported by this module called
     *
     * wakeupByPush
     *
     * you can use this constant to distinguish the app is launched
     * by VoIP push notification or not
     *
     * e.g.
     */
    if (VoipPushNotification.wakeupByPush) {
      console.log('wakeupByPush');
      // do something...

      // remember to set this static variable to false
      // since the constant are exported only at initialization time
      // and it will keep the same in the whole app
      VoipPushNotification.wakeupByPush = false;
    }
  });
  VoipPushNotification.registerVoipToken(); // --- required
}
