/* istanbul ignore file */
import BackgroundTimer from 'react-native-background-timer';
import runCallKeep, {endCurrentCall} from '../CallKeep/CallKeepHelper';
import {AppState, Platform} from 'react-native';
import {CallActionType} from '../Constants';
import {
  checkCameraPermission,
  checkMicPermission,
  requestMicCameraPermission,
  timeIntervalSinceNow,
} from '../Common';
import wakeUpApp from 'react-native-wakeup-screen';
// import {showDefaultPushNotification} from '../Notifications/NotificationHandler';
import {source} from '../../api/constants';
import {useSelector} from 'react-redux';
import {CallAction} from '../signalR/SignalRService';
import {NavigationHelper} from '../NavigationHelper';
export const CallStatus = {
  CONNECTING: 1,
  CONNECTED: 2,
  DISCONNECTED: 3,
  INCOMING: 4,
};

export class TwilioHelper {
  constructor() {}

  // Variables
  currentCallStatus: CallStatus = CallStatus.DISCONNECTED;
  currentCallDuration = 0;
  participantStatus = false;
  currentRoom: String = '';
  // Added to join call from appointments module
  currentAppointmentID = '0';
  callerName: String = '';
  callerId: String = '';
  callUUID: String = '';
  isMicEnabled = true;
  isLocalVideoEnabled = true;
  participants = new Map();
  videoTracks = new Map();
  isSpeakerEnabled = true;
  timer = null;
  timerCallBack = null;
  callEndedFromCallKitCallBack = null;
  callEndedFromSignalRCallBack = null;
  mutedSetFromCallKitCallBack = null;
  speakerSetBackgroundCallBack = null;
  autoEndTimer = null;
  token = '';

  // Singleton Class
  static _instance: TwilioHelper = null;
  static sharedInstance() {
    if (this._instance === null) {
      this._instance = new TwilioHelper();
    }
    return this._instance;
  }

  reset = () => {
    console.log('[ Twilio RESET ]');
    this.stopCallTimer();
    TwilioHelper._instance = null;
  };

  // endCurrentCall = () => {
  //   if (this.callEndedFromCallKitCallBack !== null) {
  //     this.callEndedFromCallKitCallBack();
  //   }
  // };
  endIncomingCall = () => {
    if (
      this.callEndedFromSignalRCallBack !== null &&
      this.currentCallStatus != CallStatus.CONNECTED
    ) {
      this.callEndedFromSignalRCallBack();
    }
  };
  setSpeakerON = () => {
    if (this.speakerSetBackgroundCallBack !== null) {
      this.speakerSetBackgroundCallBack();
    }
  };
  didPerformSetMuted = (muted: Boolean) => {
    if (this.mutedSetFromCallKitCallBack !== null) {
      this.isMicEnabled = !muted;
      this.mutedSetFromCallKitCallBack(muted);
    }
  };

  // Member Functions
  startCallTimer = tickFunction => {
    this.stopCallTimer();
    this.timerCallBack = tickFunction;
    BackgroundTimer.runBackgroundTimer(this.tick, 1000);
  };

  tick = () => {
    this.currentCallDuration = this.currentCallDuration + 1;
    this.timerCallBack(this.currentCallDuration);
  };
  stopCallTimer = () => {
    clearInterval(this.timer);
    this.timerCallBack = null;
    this.currentCallDuration = 0;
    // BackgroundTimer.runBackgroundTimer(this.tick, 1000);
    BackgroundTimer.stopBackgroundTimer();
  };

  startAutoEndTimer = () => {
    if (this.autoEndTimer !== null) {
      BackgroundTimer.clearTimeout(this.autoEndTimer);
    }
    // Auto end call after 40 seconds, if not answered/declined
    this.autoEndTimer = BackgroundTimer.setTimeout(function () {
      let status = TwilioHelper.sharedInstance().currentCallStatus;
      if (status === CallStatus.INCOMING) {
        if (Platform.OS === 'ios') {
          // CallAction(CallActionType.reject);
          // endCurrentCall();
        } else {
          CallAction(CallActionType.reject);
          TwilioHelper.sharedInstance().endIncomingCall();
        }
      }
    }, 40 * 1000);
  };

  handleVOIPIncomingPush = (notificationPayload, shouldWakeUp: boolean) => {
    // const homeDetail = useSelector(this.state.homeDetail);
    // console.log('homeDetail in twillio helper', homeDetail);
    console.log('Push Received', notificationPayload);
    console.log('Current Call Apt ID', this.currentAppointmentID);
    const {caller, room, call_id, caller_id, time, apt_id} =
      notificationPayload;

    if (
      timeIntervalSinceNow(time) <= 300 &&
      this.currentCallStatus === CallStatus.DISCONNECTED
    ) {
      global.isIncomingCall = true;
      this.currentRoom = room;
      this.callerName = caller;
      this.callerId = caller_id;
      this.callUUID = call_id;
      this.currentCallStatus = CallStatus.INCOMING;
      this.startAutoEndTimer();
      this.currentAppointmentID = apt_id;
      NavigationHelper.sharedInstance().aptId = apt_id;
      if (source === 0) {
        // Android
        if (shouldWakeUp) {
          wakeUpApp();
          console.log('====================================');
          console.log('wakeup in background');
          console.log('====================================');
        }
        if (NavigationHelper.sharedInstance().navigation) {
          NavigationHelper.sharedInstance().navigation.navigate(
            'IncomingCallScreen',
          );
        }
      } else {
        // iOS
        runCallKeep();
        if (
          (NavigationHelper.sharedInstance().navigation &&
            AppState.currentState === 'active') ||
          AppState.currentState === 'background'
        ) {
          NavigationHelper.sharedInstance().navigation.navigate(
            'IncomingCallScreen',
          );
        } else {
          requestMicCameraPermission().then(statuses => {
            if (statuses.cameraPermission !== 'granted') {
              checkCameraPermission();
            }
            if (statuses.microphonePermission !== 'granted') {
              checkMicPermission();
            }
          });
        }
      }
    } else if (parseInt(apt_id) !== parseInt(this.currentAppointmentID)) {
      // Incoming Call received to join another appointment, While call was established.
      let notification = {
        title: 'Call Missed',
        body: "You've been invited to join a call.",
        data: {},
      };
      // showDefaultPushNotification(notification);
    }
  };
}
