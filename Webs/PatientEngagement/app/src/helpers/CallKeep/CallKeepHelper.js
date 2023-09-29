/* istanbul ignore file */
import React from 'react';
import {AppState, Platform} from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import wakeUpApp from 'react-native-wakeup-screen';
import {CallActionType} from '../Constants';
import {CallAction} from '../signalR/SignalRService';
import {NavigationHelper} from '../NavigationHelper';
import {TwilioHelper} from '../Twilio/TwilioHelper';

var number = '360 TeleWise™';

export var currentCallID: String = '';

export default function runCallKeep() {
  const isIOS = Platform.OS === 'ios';
  RNCallKeep.setup({
    ios: {
      // IconTemplateImage.png
      appName: 'Patient Touch',
      imageName: '../../assets/images/IconTemplateImage.png',
      supportsVideo: true,
      maximumCallGroups: '1',
      maximumCallsPerCallGroup: '1',
      ringtoneSound: 'default',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
      // Required to get audio in background when using Android 11
      foregroundService: {
        channelId: 'com.wisemani.patientEngagement',
        channelName: 'Incomming Call',
        notificationTitle: 'Incomming Video call',
      },
    },
  });

  const answerCall = ({callUUID}) => {
    currentCallID = callUUID;
    console.log('answer call');
    if (isIOS) {
      // RNCallKeep.startCall(callUUID, number, number);
      global.isIncomingCall = true;
      let navigation = NavigationHelper.sharedInstance().navigation;
      setTimeout(function () {
        navigation.navigate('CallUI');
      }, 300);
    } else {
      if (
        AppState.currentState === 'background' ||
        AppState.currentState === 'active'
      ) {
        wakeUpApp();
        NavigationHelper.sharedInstance().navigation.navigate('CallUI');
      } else {
        global.isIncomingCall = true;
        wakeUpApp();
      }
    }
  };

  const hangup = callUUID => {
    RNCallKeep.endCall(callUUID);
  };

  const setOnHold = (callUUID, held) => {
    RNCallKeep.setOnHold(callUUID, held);
  };

  const setOnMute = (callUUID, muted) => {
    console.log('Muted From CallKit', muted);
    RNCallKeep.setMutedCall(callUUID, muted);
  };
  const updateDisplay = callUUID => {
    // Workaround because Android doesn't display well displayName, se we have to switch ...
    if (isIOS) {
      RNCallKeep.updateDisplay(callUUID, 'New Name', number);
    } else {
      RNCallKeep.updateDisplay(callUUID, number, 'New Name');
    }
  };
  RNCallKeep.addEventListener('answerCall', answerCall);

  RNCallKeep.addEventListener('endCall', jsonBody => {
    let {callUUID} = jsonBody;
    hangup(callUUID);
    CallAction(CallActionType.reject);
  });
  RNCallKeep.addEventListener('didPerformSetMutedCallAction', jsonBody => {
    console.log('RNCallKeep', 'didPerformSetMutedCallAction');
    console.log('RNCallKeep', jsonBody);
    let {callUUID} = jsonBody;
    let {muted} = jsonBody;
    TwilioHelper.sharedInstance().didPerformSetMuted(muted);
  });
}

//To report the call in callkit when call is answered from In-App incoming call screen.
export function answerIncomingIOSCall(callID: string) {
  currentCallID = callID;
  RNCallKeep.startCall(callID, number, '', 'generic', true);
}

export function displayIncomingCallNow(callID, roomName, callerName) {
  TwilioHelper.sharedInstance().currentRoom = roomName;
  TwilioHelper.sharedInstance().callerName = callerName;
  currentCallID = callID;
  setTimeout(function () {
    RNCallKeep.displayIncomingCall(
      currentCallID,
      callerName,
      callerName,
      'generic',
      true,
    );
  }, 1000);

  // RNCallKeep.endAllCalls();
}
export function setMutedCurrentCall(muted: Boolean) {
  RNCallKeep.setMutedCall(currentCallID, muted);
}
export function endCurrentCall() {
  RNCallKeep.endAllCalls();
  TwilioHelper.sharedInstance().reset();
}
