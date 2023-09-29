/* istanbul ignore file */
// Optional flow type
import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from '../../../App';
import {NotificationType} from '../Constants';
import wakeUpApp from 'react-native-wakeup-screen';
// import {
//   getUpcomingAppointments,
//   removeCalenderEvents,
// } from '../SyncCalender/SyncCalenderHelper';
import {TwilioHelper} from './Twilio/TwilioHelper';
import RNCallKeep from 'react-native-callkeep';
// export default async (message: RemoteMessage) => {
//   // handle your message
//   console.log('Incoming Received', message);
//   let {data} = message;
//
//   TwilioHelper.sharedInstance().handleVOIPIncomingPush(data, true);
//   return Promise.resolve();
// };

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  //   // handle your message
  console.log('Incoming Received', remoteMessage);
  let {data} = remoteMessage;
  wakeUpApp();
  RNCallKeep.backToForeground();
  TwilioHelper.sharedInstance().handleVOIPIncomingPush(data, true);

  return Promise.resolve();
});

AppRegistry.registerComponent('app', () => App);
