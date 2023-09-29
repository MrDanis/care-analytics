/**
 * Patient Touch 360 React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, useEffect} from 'react';
import AppContainer from './app/src/navigation/navigators/Routes';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import logger from 'redux-logger';
import combineReducers from './app/src/reducers';
import FlashMessage from 'react-native-flash-message';
import {
  checkPermission,
  messageListener,
} from './app/src/helpers/NotificationHelper';
import {LogBox, StatusBar} from 'react-native';
import {configurePushNotification} from './app/src/helpers/NotificationHandler';
import {GoogleCastHelper} from './app/src/helpers/GoogleCastHelper';
import {CURRENT_CP_TARGET_KEY} from './app/config/AppConfig';
import {Colors} from './app/config';
import codePush from 'react-native-code-push';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {NativeBaseProvider, Box} from "native-base";

export const store: any = createStore(combineReducers, applyMiddleware(logger));
LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Reanimated 2']);
type Props = {};

class App extends React.PureComponent<Props> {
  /* istanbul ignore next */
  constructor(props: any | void) {
    super(props);
    configurePushNotification(this);
    checkPermission(this);
    // Initializing, so that shared instance of Google cast is created
    // let instance = GoogleCastHelper.getInstance();
  }
  /* istanbul ignore next */
  // componentDidMount(): void {
  //   messageListener();
  //   this.notificationOpenedListener;
  //   this.notificationOnNotification;
  //   this.onMessageListener;
  //   this.notificationDisplayListener;
  // }
  /* istanbul ignore next */
  // componentWillUnmount(): void {
  //   messageListener();
  //   this.notificationOpenedListener;
  //   this.notificationOnNotification;
  //   this.onMessageListener;
  // }
  /* istanbul ignore next */
  render(): any {
    return (
      <Fragment>
        <Provider store={store}>
          <StatusBar barStyle="dark-content" />
          <GestureHandlerRootView style={{flex: 1}}>
            <AppContainer />
          </GestureHandlerRootView>
        </Provider>
        <FlashMessage position="bottom" />
      </Fragment>
    );
  }
}
// let codePushOptions = {
//   checkFrequency: codePush.CheckFrequency.ON_APP_START,
//   deploymentKey: CURRENT_CP_TARGET_KEY,
// };
// App = codePush(codePushOptions)(App);
export default App;
