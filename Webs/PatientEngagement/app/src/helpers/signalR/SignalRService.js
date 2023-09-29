//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Vibration} from 'react-native';
import * as signalR from '@microsoft/signalr';
import {SignalREvents, SignalRMethods} from '../Constants';
import {useDispatch, useSelector} from 'react-redux';
import {getCMStatus, sendMessage} from '../../features/chat/actions';
import {TwilioHelper} from '../Twilio/TwilioHelper';
import InCallManager from 'react-native-incall-manager';
import {setCallIncomming} from '../../features/telehealth/actions';

var connectionHub = null;
var myData = null;
// create a component
export const startSignalR = (homaApiData, props) => {
  // const getCallIncomming = useSelector(state => state.getCallIncomming);
  // console.log('====================================');
  // console.log('getCallIncomming in SignalR', getCallIncomming);
  // console.log('====================================');
  const myProps = props;
  myData = homaApiData;
  connectionHub = new signalR.HubConnectionBuilder()
    .withUrl('https://pre-release.wmi360.com/RTC/chathub', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();
  console.log('signalR Status connectionHub', connectionHub);
  connectionHub.serverTimeoutInMilliseconds = 100000;
  // --------------------------------- INITIALIZING ----------------------------- //
  connectionHub
    .start()
    .then(() => {
      console.log(
        'Now connected, connection ID=' + connectionHub.connection.connectionId,
      );
      console.log('====================================');
      console.log('homaApiData in service', homaApiData);
      console.log('====================================');
      updateUserConnection(homaApiData);
    })
    .catch(err => {
      console.log('connection error' + err);
      //   if (screenName === 'splash') {
      //     myProps.dispatch(getSplashSignalRStatus(false));
      //   } else {
      //     myProps.dispatch(getSignalRStatus(false));
      //   }
      //   SignalRHelper.sharedInstance().signalRStatus = false;
      //   console.log('Connection Error', err);
    });

  // ---------------------------------------------------------------------------- //
  // ---------------------------- SIGNAL - R EVENTS ----------------------------- //
  connectionHub.on(
    SignalREvents.CHAT_MESSAGE_RECEIVED,
    (argOne, argTwo, argThree, argFour) => {
      console.log(
        'message-from-server received',
        argOne,
        argTwo,
        argThree,
        argFour,
      );
      //Here I could response by calling something else on the server...
      if (myProps !== null && argOne !== undefined) {
        let mData = {};
        mData.id = argOne.id;
        mData.senderId = argOne.senderId;
        mData.receiverId = argOne.receiverId;
        mData.type = argOne.type;
        mData.message = argOne.message;
        mData.timeStamp = argOne.timeStamp;
        mData.acoKey = argOne.acoKey;
        mData.title = argOne.title;
        mData.messageSenderName = argOne.senderUserName;
        mData.showTime = argOne.showTime;
        mData.messageAttachments = argOne.messageAttachments;
        myProps.dispatch(sendMessage(mData));
      }
      if (
        myProps !== null &&
        argOne !== undefined &&
        argOne?.message === 'Call cancelled' &&
        argOne?.type === 6
      ) {
        myProps.dispatch(setCallIncomming(Math.random()));
      }
      // myProps.dispatch(sendMessage(argOne));
    },
  );
  connectionHub.on(
    SignalREvents.CM_STATUS_UPDATED,
    (argOne, argTwo, argThree, argFour) => {
      console.log(
        'cmStatus-from-server status',
        argOne,
        argTwo,
        argThree,
        argFour,
      );
      //Here I could response by calling something else on the server...
      if (myProps !== null && argOne !== undefined) {
        myProps.dispatch(getCMStatus(argOne));
      }
    },
  );
};
// ---------------------------------------------------------------------------- //
// ---------------------------- SIGNAL R - ACTIONS ----------------------------- //
export function sendMessagetoCM(data, receiverId, appointmentID, message) {
  // console.log("SendMethod: ",SignalRMethods.chat, data.PatientId, receiverId, data.AcoKey, message,appointmentID)
  console.log('data', data);
  console.log('receiverId', receiverId);
  console.log('appointmentID', appointmentID);
  console.log('message', message);
  connectionHub
    .invoke(
      SignalRMethods.chat.toString(),
      data.patientId.toString(),
      receiverId.toString(),
      parseInt(data.acoKey),
      message.toString(),
      parseInt(appointmentID),
    )
    .then(directResponse => {
      console.log('direct-response-from-server Messages', directResponse);
    });
}

export function CallAction(action) {
  console.log('action:', action);
  connectionHub
    .invoke(
      SignalRMethods.callAction,
      TwilioHelper.sharedInstance().callerId.toString(),
      myData.common.patientId.toString(),
      parseInt(myData.common.acoKey),
      action,
    )
    .then(directResponse => {
      console.log('direct-response-from-server', directResponse);
    });
}

export function updateUserConnection(data) {
  connectionHub
    .invoke(
      SignalRMethods.updateUserConnection,
      data.common.patientId,
      data.common.acoKey,
    )
    .then(directResponse => {
      console.log('direct-response-from-server for connection', directResponse);
    });
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
