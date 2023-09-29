/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import bgMessages from './app/src/helpers/bgMessages';
import NotificationActionHandler from './app/src/helpers/NotificationActionHandler';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => bgMessages,
);
AppRegistry.registerHeadlessTask(
  'RNPushNotificationActionHandlerTask',
  () => NotificationActionHandler,
);
