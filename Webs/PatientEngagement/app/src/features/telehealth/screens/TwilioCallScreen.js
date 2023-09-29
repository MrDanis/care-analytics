// //import liraries
// import React, {Component, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import {Modalize, useModalize} from 'react-native-modalize';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {SvgCss} from 'react-native-svg';
// import {connect} from 'react-redux';
// import {Colors, Svgs} from '../../../../config';
// import {Fonts} from '../../../../config/AppConfig';
// import Icon_cam_flip from '../../../../../assets/svg/icon_cam_flip.svg';
// import { TwilioHelper } from '../../../helpers/Twilio/TwilioHelper';

// // create a component
// const TwilioCallScreen = props => {
//   const {ref, open, close} = useModalize();
//   console.log('====================================');
//   console.log('homeApi data', props.homeApiData);
//   console.log('====================================');

//   useEffect(() => {
//     open();
//     init()
//   }, []);

//   const init = () => {
//     // Assigned function reference so that call is disconnected when ended from call ki UI
//     this.twilioHelper = TwilioHelper.sharedInstance();
//     this.twilioHelper.callEndedFromCallKitCallBack = () => {
//       this._onEndButtonPress();
//     };
//     TwilioHelper.sharedInstance().speakerSetBackgroundCallBack = () => {
//       this._onSpeakerButtonPress();
//     };

//     this.twilioHelper.mutedSetFromCallKitCallBack = (muted: Boolean) => {
//       let localVarMicEnabled = !muted;

//       if (this.state.isMicEnabled !== localVarMicEnabled) {
//         this.refs.twilioVideo
//           .setLocalAudioEnabled(localVarMicEnabled)
//           .then(isEnabled => {
//             this.setState({isMicEnabled: isEnabled});
//           });
//       }
//     };

//     if (
//       this.twilioHelper.currentCallStatus === CallStatus.DISCONNECTED ||
//       this.twilioHelper.currentCallStatus === CallStatus.INCOMING
//     ) {
//       this.twilioHelper.currentCallStatus = CallStatus.CONNECTING;
//     }

//     this.setState({
//       status: this.twilioHelper.currentCallStatus,
//       isMicEnabled: this.twilioHelper.isMicEnabled,
//       isLocalVideoEnabled: this.twilioHelper.isLocalVideoEnabled,
//       isSpeakerEnabled: this.twilioHelper.isSpeakerEnabled,
//       counter: this.twilioHelper.currentCallDuration,
//       showTopBottomBars: true,
//       recordingBanner: true,
//     });

//     // let testToken =
//     //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2MwMDM0ZGIxZTJmODg3ZjM0ZWYyN2QzNDA3MTJlM2QwLTE1OTM2MzQ0NTQiLCJpc3MiOiJTS2MwMDM0ZGIxZTJmODg3ZjM0ZWYyN2QzNDA3MTJlM2QwIiwic3ViIjoiQUM5NzYzMzA4OTMyZmRhOTM0MjdiYmIwZWYxZGRhNjRhOSIsImV4cCI6MTU5MzYzODA1NCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiUFQtaVBhZCIsInZpZGVvIjp7InJvb20iOiJDb29sUm9vbSJ9fX0.TMxDd5-y9fkkJSSbZZntZVmB5ZUEBbmzVQEwrxxMKEg';
//     // let testRoomName = 'CoolRoom';
//     // this.setState({token: testToken, roomName: testRoomName});
//     // this._onConnectButtonPress();
//     // return;
//     // console.log(
//     //   'Current Appointment ID',
//     //   this.twilioHelper.currentAppointmentID,
//     // );
//     if (this.twilioHelper.currentCallStatus === CallStatus.CONNECTING) {
//       TeleHealthService.generateTokenOnServer(
//         this.props.homeApiData.PatientId,
//         this.props.homeApiData.AcoKey,
//         this.twilioHelper.currentAppointmentID,
//       )
//         .then(response => {
//           let responseData = JSON.parse(JSON.stringify(response));
//           console.log('twillio token', responseData);
//           if (responseData && responseData.token) {
//             let roomName = responseData.roomname;
//             console.log(responseData);
//             let appointmentStatus = responseData.appointmentStatus;
//             if (
//               appointmentStatus === '1' ||
//               this.twilioHelper.currentAppointmentID == '666666'
//             ) {
//               this.setState({token: responseData.token, roomName: roomName});
//               this._onConnectButtonPress();
//             } else {
//               this.showRoomConnectionFailureMessage(
//                 'The appointment you want to join is not active.',
//               );
//               this.leaveRoom();
//             }
//           }
//         })
//         .catch(error => {
//           this.showRoomConnectionFailureMessage(
//             'Something went wrong, Please try again later.',
//           );
//           this.leaveRoom();
//         });
//     } else if (this.twilioHelper.currentCallStatus === CallStatus.CONNECTED) {
//       this.twilioHelper.timerCallBack = timerValue => {
//         this.setState({counter: timerValue});
//       };
//     }
//   }

//   return (
//     <>
//       <View style={styles.container}>
//         <StatusBar
//           backgroundColor={Colors.black1}
//           barStyle="light-content"
//           hidden={false}
//         />
//         <SvgCss
//           xml={Svgs.arrowHeadLeft}
//           width={hp(5)}
//           height={hp(5)}
//           fill={Colors.white}
//           onPress={() => props.navigation.navigate('ChatMain')}
//           style={{marginHorizontal: hp(1), alignSelf: 'flex-start'}}
//         />
//         <View style={{alignItems: 'center', marginTop: hp(2)}}>
//           <Text
//             style={{
//               fontSize: hp(2.5),
//               color: Colors.white,
//               fontFamily: Fonts.SourceSansSemibold,
//             }}>
//             {props.homeApiData.common.careManagerName}
//           </Text>
//           <Text
//             style={{
//               fontSize: hp(2),
//               color: Colors.blueGrayDisableText,
//               fontFamily: Fonts.SourceSansSemibold,
//             }}>
//             Incoming Video Call...
//           </Text>
//         </View>
//         {/* <View style={{justifyContent: 'center', flex: 0.7}}>
//           <View
//             style={{
//               height: 120,
//               width: 120,
//               borderRadius: 120 / 2,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: Colors.noRecordFound,
//             }}>
//             <Text
//               style={{
//                 fontSize: hp(4),
//                 color: Colors.white,
//                 fontFamily: Fonts.SourceSansSemibold,
//               }}>
//               AQ
//             </Text>
//           </View>
//         </View> */}
//       </View>
//       <Modalize
//         ref={ref}
//         adjustToContentHeight={true}
//         // alwaysOpen
//         handlePosition="inside"
//         closeSnapPointStraightEnabled={false}
//         snapPoint={hp(2)}
//         withOverlay={false}
//         handleStyle={styles.handle__shape}
//         panGestureEnabled={false}
//         modalStyle={{
//           borderTopRightRadius: 16,
//           borderTopLeftRadius: 16,
//           backgroundColor: Colors.noRecordFound,
//           minHeight: hp(12),
//         }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             marginTop: hp(6),
//             marginBottom: hp(4),
//             justifyContent: 'space-evenly',
//           }}>
//           <TouchableOpacity
//             style={{
//               height: 60,
//               width: 60,
//               borderRadius: 60 / 2,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: Colors.black1,
//             }}>
//             <Image
//               source={require('../../../../../assets/images/icon_cam-flip.png')}
//               style={{width: 25, height: 25}}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{
//               height: 60,
//               width: 60,
//               borderRadius: 60 / 2,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: Colors.black1,
//             }}>
//             <Image
//               source={require('../../../../../assets/images/icon_cam-off.png')}
//               style={{width: 25, height: 25, resizeMode: 'contain'}}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={{
//               height: 60,
//               width: 60,
//               borderRadius: 60 / 2,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: Colors.white,
//             }}>
//             <Image
//               source={require('../../../../../assets/images/icon_mic.png')}
//               style={{width: 25, height: 25, resizeMode: 'contain'}}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               props.navigation.navigate('ChatMain');
//             }}
//             style={{
//               height: 60,
//               width: 60,
//               borderRadius: 60 / 2,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: Colors.red3,
//             }}>
//             <Image
//               source={require('../../../../../assets/images/icon_cross_white.png')}
//               style={{width: 25, height: 25, resizeMode: 'contain'}}
//             />
//           </TouchableOpacity>
//         </View>
//       </Modalize>
//     </>
//   );
// };

// // define your styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: Colors.black1,
//   },
//   handle__shape: {
//     alignSelf: 'center',

//     top: 8,

//     width: 45,
//     height: 5,

//     borderRadius: 5,
//     backgroundColor: Colors.blueGrayDisableText,
//   },
// });

// const mapStateToProps = ({homeApiData}) => ({
//   homeApiData,
// });

// //make this component available to the app
// export default connect(mapStateToProps)(TwilioCallScreen);

import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  BackHandler,
  SafeAreaView,
  Image,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RemoteParticipantsGrid} from '../components/RemoteParticipantsGrid';
import {CallStatus, TwilioHelper} from '../../../helpers/Twilio/TwilioHelper';
import {showEndCallNote, toHHMMSS} from '../../../helpers/Common';
import Colors from '../../../../config/Colors';
import {CallCircularView} from '../components/CallCircularView';
import {
  currentCallID,
  answerIncomingIOSCall,
  endCurrentCall,
  setMutedCurrentCall,
} from '../../../../src/helpers/CallKeep/CallKeepHelper';

import {
  TwilioVideoLocalView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {setCallStatus} from '../actions';
import {connect} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import IdleTimerManager from 'react-native-idle-timer';
import BackgroundTimer from 'react-native-background-timer';
import TeleHealthService from '../../../api/telehealth';
import {NavigationHelper} from '../../../helpers/NavigationHelper';
import {Modalize} from 'react-native-modalize';
import {CallAction} from '../../../helpers/signalR/SignalRService';
import {CallActionType} from '../../../helpers/Constants';
import {Fonts} from '../../../../config/AppConfig';
import RNCallKeep from 'react-native-callkeep';
var myRef = null;
export class TwillioCallScreen extends React.PureComponent {
  twilioHelper: TwilioHelper;
  autoEndTimer = null;
  _isMounted: false;
  room = '';
  /* istanbul ignore next */
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.twilioHelper = TwilioHelper.sharedInstance();
    if (
      this.twilioHelper.currentCallStatus === CallStatus.DISCONNECTED ||
      this.twilioHelper.currentCallStatus === CallStatus.INCOMING
    ) {
      this.twilioHelper.currentCallStatus = CallStatus.CONNECTING;
    }
    this.state = {
      isMicEnabled: this.twilioHelper.isMicEnabled,
      isSpeakerEnabled: this.twilioHelper.isSpeakerEnabled,
      status: this.twilioHelper.currentCallStatus,
      participants: this.twilioHelper.participants,
      videoTracks: this.twilioHelper.videoTracks,
      roomName: 'CoolRoom',
      token: '',
      counter: this.twilioHelper.currentCallDuration,
      showTopBottomBars: true,
      recordingBanner: true,
    };

    // if (Platform.OS === 'ios') {
    if (Platform.OS === 'ios' && this._isMounted === true) {
      this.init();
    }
  }
  // ConnectAfterBack = async () => {
  //   try {
  //     const localVideoTrack = this.state.videoTracks;
  //     const room = await this.refs.twilioVideo.connect(this.state.token, {
  //       roomName: this.state.roomName,
  //     });
  //     console.log('====================================');
  //     console.log('this is the froom', room);
  //     console.log('====================================');
  //     await room.localParticipant.publishTrack(localVideoTrack);
  //   } catch (error) {
  //     console.error('async fun error', error);
  //   }
  // };
  /* istanbul ignore next */
  componentDidMount() {
    // if (this.state.showTopBottomBars === false) {
    //   this.refs.modalize.close();
    // } else {
    //   this.refs.modalize.open();
    // }

    if (this.twilioHelper.currentCallStatus === CallStatus.CONNECTED) {
      // RNCallKeep.backToForeground();
      this.setState({videoTracks: this.twilioHelper.videoTracks});
      this.setState({token: this.twilioHelper.token});
      // this._onRoomDidConnect();
      // this._onParticipantEnabledAudioTrack(
      //   this.twilioHelper.participants,
      //   this.twilioHelper.videoTracks,
      // );
      // console.log('====================================');
      // console.log(
      //   'this is the helper',
      //   this.twilioHelper,
      //   this.refs.twilioVideo
      // );
      // console.log('====================================');

      this.refs.twilioVideo.setLocalVideoEnabled(true).then(isEnabled => {
        this.setState({isLocalVideoEnabled: isEnabled});
        this.twilioHelper.isLocalVideoEnabled = isEnabled;
      });
      // this.refs.twilioVideo._eventEmitter._nativeModule.publishLocalVideo();

      // this.ConnectAfterBack();
    }

    myRef = this;
    this._isMounted = true;
    const {navigation} = this.props;

    IdleTimerManager.setIdleTimerDisabled(true);
    this.willFocusSubscription = navigation.addListener('focus', async () => {
      this.init();
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );
      BackHandler.addEventListener(
        'hardwareBackPress',
        myRef.handleBackButtonClick,
      );
    });
    // this.focusListener = navigation.addListener('willFocus', () => {
    //   console.log('====================================');
    //   console.log('here reached in twiliocall screwen');
    //   console.log('====================================');
    //   this.init();
    //   BackHandler.removeEventListener(
    //     'hardwareBackPress',
    //     this.handleBackButtonClick,
    //   );
    //   BackHandler.addEventListener(
    //     'hardwareBackPress',
    //     myRef.handleBackButtonClick,
    //   );
    // });
  }
  /* istanbul ignore next */
  init() {
    // Assigned function reference so that call is disconnected when ended from call ki UI
    // console.log('====================================');
    // console.log('inside the init function inside twilio call screen');
    // console.log('====================================');
    this.twilioHelper = TwilioHelper.sharedInstance();
    this.twilioHelper.callEndedFromCallKitCallBack = () => {
      this._onEndButtonPress();
    };
    TwilioHelper.sharedInstance().speakerSetBackgroundCallBack = () => {
      this._onSpeakerButtonPress();
    };

    this.twilioHelper.mutedSetFromCallKitCallBack = (muted: Boolean) => {
      let localVarMicEnabled = !muted;

      if (this.state.isMicEnabled !== localVarMicEnabled) {
        this.refs.twilioVideo
          .setLocalAudioEnabled(localVarMicEnabled)
          .then(isEnabled => {
            this.setState({isMicEnabled: isEnabled});
          });
      }
    };

    if (
      this.twilioHelper.currentCallStatus === CallStatus.DISCONNECTED ||
      this.twilioHelper.currentCallStatus === CallStatus.INCOMING
    ) {
      this.twilioHelper.currentCallStatus = CallStatus.CONNECTING;
    }

    this.setState({
      status: this.twilioHelper.currentCallStatus,
      isMicEnabled: this.twilioHelper.isMicEnabled,
      isLocalVideoEnabled: this.twilioHelper.isLocalVideoEnabled,
      isSpeakerEnabled: this.twilioHelper.isSpeakerEnabled,
      counter: this.twilioHelper.currentCallDuration,
      showTopBottomBars: true,
      recordingBanner: true,
    });

    // let testToken =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2MwMDM0ZGIxZTJmODg3ZjM0ZWYyN2QzNDA3MTJlM2QwLTE1OTM2MzQ0NTQiLCJpc3MiOiJTS2MwMDM0ZGIxZTJmODg3ZjM0ZWYyN2QzNDA3MTJlM2QwIiwic3ViIjoiQUM5NzYzMzA4OTMyZmRhOTM0MjdiYmIwZWYxZGRhNjRhOSIsImV4cCI6MTU5MzYzODA1NCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiUFQtaVBhZCIsInZpZGVvIjp7InJvb20iOiJDb29sUm9vbSJ9fX0.TMxDd5-y9fkkJSSbZZntZVmB5ZUEBbmzVQEwrxxMKEg';
    // let testRoomName = 'CoolRoom';
    // this.setState({token: testToken, roomName: testRoomName});
    // this._onConnectButtonPress();
    // return;
    // console.log(
    //   'Current Appointment ID',
    //   this.twilioHelper.currentAppointmentID,
    // );
    if (this.twilioHelper.currentCallStatus === CallStatus.CONNECTING) {
      console.log('====================================');
      console.log(
        'data in telehealth',
        this.props.homeApiData.common.patientId,
        this.props.homeApiData.common.acoKey,
        this.twilioHelper.currentAppointmentID,
      );
      console.log('====================================');
      TeleHealthService.generateTokenOnServer(
        this.props.homeApiData.common.patientId,
        this.props.homeApiData.common.acoKey,
        this.twilioHelper.currentAppointmentID,
      )
        .then(response => {
          let responseData = JSON.parse(JSON.stringify(response));
          console.log('twillio token', responseData);
          if (responseData && responseData.token) {
            let roomName = responseData.roomname;
            this.tollen = responseData.token;

            console.log(responseData);
            let appointmentStatus = responseData.appointmentStatus;
            if (
              appointmentStatus === '1' ||
              this.twilioHelper.currentAppointmentID == '666666'
            ) {
              this.setState({token: responseData.token, roomName: roomName});
              this._onConnectButtonPress();
            } else {
              this.showRoomConnectionFailureMessage(
                'The appointment you want to join is not active.',
              );
              this.leaveRoom();
            }
          }
        })
        .catch(error => {
          this.showRoomConnectionFailureMessage(
            'Something went wrong, Please try again later.',
          );
          this.leaveRoom();
        });
    } else if (this.twilioHelper.currentCallStatus === CallStatus.CONNECTED) {
      this.twilioHelper.timerCallBack = timerValue => {
        this.setState({counter: timerValue});
      };
    }
  }
  /* istanbul ignore next */
  showRoomConnectionFailureMessage(message) {
    showMessage({
      message: 'Error',
      description: message,
      type: 'default',
      icon: {icon: 'info', position: 'left'},
      backgroundColor: Colors.red,
    });
  }
  /* istanbul ignore next */
  showParticipantCountMessage() {
    showMessage({
      message: 'No Participant',
      description: 'There is no active participant in call',
      type: 'default',
      icon: {icon: 'info', position: 'left'},
      backgroundColor: Colors.red,
    });
  }
  /* istanbul ignore next */
  componentWillUnmount(): void {
    this._isMounted = false;
    console.log('Component Unmounted');
    // this.focusListener.remove();
    IdleTimerManager.setIdleTimerDisabled(false);
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  /* istanbul ignore next */
  handleBackButtonClick() {
    myRef.props.navigation.navigate('HomeTab');
    return true;
  }
  /* istanbul ignore next */
  _onConnectButtonPress = () => {
    this.setState({status: CallStatus.CONNECTING});
    this.twilioHelper.currentCallStatus = CallStatus.CONNECTING;
    console.log('_onConnectButtonPress');
    room = this.refs.twilioVideo.connect({
      roomName: this.state.roomName,
      accessToken: this.state.token,
    });
    console.log('====================================');
    console.log('got the room ', room);
    console.log('====================================');
  };
  /* istanbul ignore next */
  _onEndButtonPress = () => {
    // leaveRoomthis.refs.twilioVideo.disconnect();
    this.leaveRoom();
  };
  /* istanbul ignore next */
  _onBackButtonPress = () => {
    this.twilioHelper.videoTracks = this.state.videoTracks;
    //temporary just to turn off camera so that video is not stucked when user comes back to calling screen.
    this.refs.twilioVideo.setLocalVideoEnabled(false).then(isEnabled => {
      this.setState({isLocalVideoEnabled: isEnabled});
      this.twilioHelper.isLocalVideoEnabled = isEnabled;
    });
    this.twilioHelper.token = this.state.token;
    this.props.navigation.navigate('Home');
  };
  /* istanbul ignore next */
  _toggleTopBottomBars = () => {
    let value = this.state.showTopBottomBars;
    this.setState({showTopBottomBars: !value});
  };
  /* istanbul ignore next */
  _onMuteButtonPress = () => {
    this.refs.twilioVideo
      .setLocalAudioEnabled(!this.state.isMicEnabled)
      .then(isEnabled => {
        this.setState({isMicEnabled: isEnabled});
        this.twilioHelper.isMicEnabled = isEnabled;
        // Set muted value on call kit, muted will be false when enabled true.
        if (Platform.OS === 'ios') {
          setMutedCurrentCall(!isEnabled);
        }
      });
  };
  /* istanbul ignore next */
  _onSpeakerButtonPress = () => {
    let updatedValue = !this.state.isSpeakerEnabled;
    this.twilioHelper.isSpeakerEnabled = updatedValue;
    this.setState({isSpeakerEnabled: updatedValue});
    this.refs.twilioVideo.toggleSoundSetup(updatedValue);
  };
  /* istanbul ignore next */
  _onCameraMuteButtonPress = () => {
    this.refs.twilioVideo
      .setLocalVideoEnabled(!this.state.isLocalVideoEnabled)
      .then(isEnabled => {
        this.setState({isLocalVideoEnabled: isEnabled});
        this.twilioHelper.isLocalVideoEnabled = isEnabled;
      });
  };
  /* istanbul ignore next */
  _onFlipButtonPress = () => {
    // this.refs.twilioVideo.flipCamera();
  };
  /* istanbul ignore next */
  _onChatPress = () => {
    if (this.twilioHelper.currentAppointmentID === '666666') {
      this.props.navigation.navigate('ChatMain');
    }
  };

  /* istanbul ignore next */
  _onRoomDidConnect = () => {
    console.log('Room Connected');
    myRef.props.dispatch(setCallStatus(true));
    this.LeaveRoomAutoEndTimer();
    this.setState({status: CallStatus.CONNECTED});
    this.twilioHelper.currentCallStatus = CallStatus.CONNECTED;

    // To resolve issue of black local video, when call when ended while camera disabled.
    this.refs.twilioVideo.setLocalVideoEnabled(true).then(isEnabled => {
      this.setState({isLocalVideoEnabled: isEnabled});
      this.twilioHelper.isLocalVideoEnabled = isEnabled;
    });

    // Mic mute issue when call ended while mic was muted.
    this.refs.twilioVideo.setLocalAudioEnabled(true).then(isEnabled => {
      this.setState({isMicEnabled: isEnabled});
      this.twilioHelper.isMicEnabled = isEnabled;
    });

    if (Platform.OS === 'ios' && currentCallID !== this.twilioHelper.callUUID) {
      // Room Joined from Appointment. Add to CallKit
      console.log('CallAdded:', this.twilioHelper.callUUID);
      answerIncomingIOSCall(this.twilioHelper.callUUID);
    }

    this.twilioHelper.startCallTimer(timerValue => {
      this.setState({counter: timerValue});
    });
  };
  /* istanbul ignore next */
  _onRoomDidDisconnect = ({roomName, error}) => {
    this.leaveRoom();
    // showEndCallNote(
    //   this.props.homeApiData.IsPatientTouchEnabled,
    //   !this.twilioHelper.participantStatus,
    //   this.props.navigation,
    // );
  };
  /* istanbul ignore next */
  _onRoomDidFailToConnect = error => {
    console.log('_onRoomDidFailToConnect', error);
    this.setState({status: CallStatus.DISCONNECTED});
    this.twilioHelper.currentCallStatus = CallStatus.DISCONNECTED;
    this.showRoomConnectionFailureMessage(
      'Something went wrong, Please try again later.',
    );
    this.leaveRoom();
  };
  /* istanbul ignore next */
  leaveRoom() {
    console.log('on Leave Room');
    global.isIncomingCall = false;
    myRef.props.dispatch(setCallStatus(false));
    NavigationHelper.sharedInstance().totalCallDuration = this.state.counter;
    this.setState({status: CallStatus.DISCONNECTED});
    this.twilioHelper.currentCallStatus = CallStatus.DISCONNECTED;
    this.twilioHelper.reset();
    this.refs.twilioVideo.disconnect();
    // To End Current Call in callkit, ref. CallKeepHelper
    endCurrentCall();
    this._onBackButtonPress();
    CallAction(CallActionType.reject);
  }
  // To Leave Room if Participant is not added in 1 min duration
  /* istanbul ignore next */
  LeaveRoomAutoEndTimer() {
    if (this.autoEndTimer !== null) {
      BackgroundTimer.clearTimeout(this.autoEndTimer);
    }
    // Auto leave room after 1 min, if participant is not added
    this.autoEndTimer = BackgroundTimer.setTimeout(function () {
      if (!myRef.twilioHelper.participantStatus) {
        myRef.refs.twilioVideo.disconnect();
      }
    }, 2 * 60 * 1000);
  }
  /* istanbul ignore next */
  _onRoomParticipantDidConnect = ({roomName, participant}) => {
    console.log('-------------Participant Joined----------');
    this.twilioHelper.participantStatus = true;
    let tempTracks = new Map([
      ...this.state.videoTracks,
      [
        participant.sid,
        {participant: participant, audioTrack: null, videoTrack: null},
      ],
    ]);

    this.setState({
      videoTracks: tempTracks,
    });
  };
  /* istanbul ignore next */
  _onRoomParticipantDidDisconnect = ({roomName, participant}) => {
    console.log('-------------Participant Left----------');
    const videoTracks = this.state.videoTracks;
    videoTracks.delete(participant.sid);

    if (videoTracks.size === 0) {
      this.leaveRoom();
    } else {
      this.setState({videoTracks: new Map([...videoTracks])});
    }
  };
  /* istanbul ignore next */
  _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('-------------VIDEO TRACK ADDED----------');
    console.log('====================================');
    console.log('participant:', participant, 'track:', track);
    console.log('====================================');
    let tempTracks = new Map([...this.state.videoTracks]);
    let obj = {};
    if (tempTracks.has(participant.sid)) {
      obj = Object.create(tempTracks.get(participant.sid));
    }
    obj.participant = participant;
    obj.videoTrack = track;

    tempTracks.set(participant.sid, obj);
    console.log('----Map Updated', tempTracks);
    this.setState({
      videoTracks: tempTracks,
    });
  };
  /* istanbul ignore next */
  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('-------------VIDEO TRACK REMOVED----------');
    const videoTracks = this.state.videoTracks;
    videoTracks.delete(participant.sid);
    this.setState({videoTracks: new Map([...videoTracks])});
  };
  /* istanbul ignore next */
  _onParticipantEnabledVideoTrack = ({participant, track}) => {
    console.log('-------------VIDEO TRACK RESUMED----------');
    let tempTracks = new Map([...this.state.videoTracks]);
    let obj = {};
    if (tempTracks.has(participant.sid)) {
      obj = Object.create(tempTracks.get(participant.sid));
    }
    obj.participant = participant;
    obj.videoTrack = track;

    tempTracks.set(participant.sid, obj);
    console.log('----Map Updated', tempTracks);
    this.setState({
      videoTracks: tempTracks,
    });
  };
  /* istanbul ignore next */
  _onParticipantDisabledVideoTrack = ({participant, track}) => {
    console.log('-------------VIDEO TRACK PAUSED----------');
    let tempTracks = new Map([...this.state.videoTracks]);
    let obj = {};
    if (tempTracks.has(participant.sid)) {
      obj = Object.create(tempTracks.get(participant.sid));
    }
    obj.participant = participant;
    obj.videoTrack = track;

    tempTracks.set(participant.sid, obj);
    console.log('----Map Updated', tempTracks);
    this.setState({
      videoTracks: tempTracks,
    });
  };
  /* istanbul ignore next */
  _onParticipantAddedAudioTrack = ({participant, track}) => {
    console.log('-------------AUDIO TRACK ADDED----------');
    this.twilioHelper.participantStatus = true;

    let tempTracks = new Map([...this.state.videoTracks]);
    let obj = {};
    if (tempTracks.has(participant.sid)) {
      obj = Object.create(tempTracks.get(participant.sid));
    }
    obj.participant = participant;
    obj.audioTrack = track;

    tempTracks.set(participant.sid, obj);
    console.log('----Map Updated', tempTracks);
    this.setState({
      videoTracks: tempTracks,
    });
  };
  /* istanbul ignore next */
  _onParticipantEnabledAudioTrack = ({participant, track}) => {
    console.log('-------------AUDIO TRACK RESUMED----------');
    this.twilioHelper.participantStatus = true;

    let tempTracks = new Map([...this.state.videoTracks]);
    let obj = {};
    if (tempTracks.has(participant.sid)) {
      obj = Object.create(tempTracks.get(participant.sid));
    }
    obj.participant = participant;
    obj.audioTrack = track;

    tempTracks.set(participant.sid, obj);
    console.log('----Map Updated', tempTracks);
    this.setState({
      videoTracks: tempTracks,
    });
  };
  /* istanbul ignore next */
  _onParticipantDisabledAudioTrack = ({participant, track}) => {
    console.log('-------------AUDIO TRACK PAUSED----------');
    this.twilioHelper.participantStatus = true;

    let tempTracks = new Map([...this.state.videoTracks]);
    let obj = {};
    if (tempTracks.has(participant.sid)) {
      obj = Object.create(tempTracks.get(participant.sid));
    }
    obj.participant = participant;
    obj.audioTrack = track;

    tempTracks.set(participant.sid, obj);
    console.log('----Map Updated', tempTracks);
    this.setState({
      videoTracks: tempTracks,
    });
  };
  /* istanbul ignore next */
  _onCameraDidStart = () => {
    console.log('_onCameraDidStart');
  };
  /* istanbul ignore next */
  _onCameraWasInterrupted = () => {
    console.log('_onCameraWasInterrupted');
  };
  /* istanbul ignore next */
  _onCameraDidStopRunning = error => {
    console.log('_onCameraDidStopRunning: Error', error);
  };
  /* istanbul ignore next */
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Fragment>
          <View style={styles.container}>
            {this.state.status === CallStatus.CONNECTED &&
              this.state.videoTracks.size > 0 && (
                <TouchableOpacity
                  onPress={this._toggleTopBottomBars}
                  activeOpacity={1}
                  style={styles.callContainer}>
                  <View style={styles.remoteGrid}>
                    <RemoteParticipantsGrid
                      roomParticipants={this.state.videoTracks}
                    />
                    {this.renderTopBar()}
                    {this.renderOptionsBar()}
                  </View>
                </TouchableOpacity>
              )}
            {this.state.status === CallStatus.CONNECTED &&
              this.state.videoTracks.size === 0 && (
                <View style={styles.callContainer}>
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{
                      fontSize: 18,
                      color: 'white',
                      fontFamily: Fonts.SourceSansRegular,
                      alignSelf: 'center',
                      textAlign: 'center',
                      marginBottom: 20,
                    }}>
                    {'Waiting for participants to join'}
                  </Text>
                  <CallCircularView textLabel="Connected" />
                  {this.renderTopBar()}
                  {this.renderOptionsBar()}
                </View>
              )}

            {this.state.status === CallStatus.CONNECTING && (
              <View style={styles.callContainer}>
                <CallCircularView textLabel="Connecting..." />
              </View>
            )}

            <TwilioVideo
              ref="twilioVideo"
              onRoomDidConnect={this._onRoomDidConnect}
              onRoomDidDisconnect={this._onRoomDidDisconnect}
              onRoomDidFailToConnect={this._onRoomDidFailToConnect}
              onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
              onParticipantRemovedVideoTrack={
                this._onParticipantRemovedVideoTrack
              }
              onCameraDidStart={this._onCameraDidStart}
              onCameraWasInterrupted={this._onCameraWasInterrupted}
              onCameraDidStopRunning={this._onCameraDidStopRunning}
              onParticipantDisabledVideoTrack={
                this._onParticipantDisabledVideoTrack
              }
              onParticipantEnabledVideoTrack={
                this._onParticipantEnabledVideoTrack
              }
              onParticipantAddedAudioTrack={this._onParticipantAddedAudioTrack}
              onParticipantEnabledAudioTrack={
                this._onParticipantEnabledAudioTrack
              }
              onParticipantDisabledAudioTrack={
                this._onParticipantDisabledAudioTrack
              }
              onRoomParticipantDidConnect={this._onRoomParticipantDidConnect}
              onRoomParticipantDidDisconnect={
                this._onRoomParticipantDidDisconnect
              }
            />
          </View>
        </Fragment>
        {/* <Modalize
          ref="modalize"
          adjustToContentHeight={true}
          // alwaysOpen
          handlePosition="inside"
          closeSnapPointStraightEnabled={false}
          snapPoint={hp(2)}
          withOverlay={false}
          handleStyle={styles.handle__shape}
          panGestureEnabled={false}
          modalStyle={{
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            backgroundColor: Colors.noRecordFound,
            minHeight: hp(12),
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(6),
              marginBottom: hp(4),
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 60 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.black1,
              }}>
              <Image
                source={require('../../../../../assets/images/icon_cam-flip.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 60 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.black1,
              }}>
              <Image
                source={require('../../../../../assets/images/icon_cam-off.png')}
                style={{width: 25, height: 25, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                borderRadius: 60 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.white,
              }}>
              <Image
                source={require('../../../../../assets/images/icon_mic.png')}
                style={{width: 25, height: 25, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => {
              //   props.navigation.navigate('ChatMain');
              // }}
              style={{
                height: 60,
                width: 60,
                borderRadius: 60 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.red3,
              }}>
              <Image
                source={require('../../../../../assets/images/icon_cross_white.png')}
                style={{width: 25, height: 25, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </Modalize> */}
      </SafeAreaView>
    );
  }
  /* istanbul ignore next */
  renderTopBar(): View {
    return (
      <View style={styles.topBarContainer}>
        {this.state.showTopBottomBars ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'rgba(10, 10, 10, 0.2)',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={this._onBackButtonPress}>
              <Text
                style={{
                  marginLeft: hp(1),
                  fontFamily: 'WisemanPTSymbols',
                  fontSize: 40,
                  color: Colors.white,
                  flexGrow: 1,
                }}>
                W
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 6,
              }}>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: Fonts.SourceSansBold,
                  color: Colors.white,
                  // marginLeft: -hp(2.5),
                  // marginRight: hp(5),
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                {this.twilioHelper.callerName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}>
                {toHHMMSS(this.state.counter)}
              </Text>
            </View>
            <View style={{flex: 1}}></View>
          </View>
        ) : null}
        {/* {this.state.recordingBanner ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              padding: hp(1),
              backgroundColor: '#FFF2D1',
            }}>
            <Text
              style={{
                marginLeft: hp(1),
                fontFamily: 'WisemanPTSymbols',
                alignSelf: 'center',
                fontSize: 34,
                color: Colors.darkGrey,
              }}>
              o
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto-Bold',
                color: Colors.darkGrey,
                alignSelf: 'center',
                marginLeft: hp(1),
              }}>
              Recording!
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto-Light',
                flex: 1,
                alignSelf: 'center',
                color: Colors.darkGrey,
                marginLeft: hp(1),
              }}>
              This session will be recorded.
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({recordingBanner: false});
              }}
              style={{
                backgroundColor: '#FBBC3F',
                padding: hp(0.5),
                justifyContent: 'center',
                borderRadius: 3,
                marginRight: hp(1),
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Roboto-Light',
                  color: Colors.black,
                }}>
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        ) : null} */}
      </View>
    );
  }
  /* istanbul ignore next */
  renderOptionsBar() {
    if (this.state.showTopBottomBars === false) {
      return null;
    }
    return (
      <View style={styles.optionsContainer}>
        {this.state.isLocalVideoEnabled === true && (
          <TwilioVideoLocalView
            enabled={this.state.isLocalVideoEnabled}
            style={styles.localVideo}
          />
        )}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={this._onSpeakerButtonPress}>
          <Text
            style={{
              fontFamily: 'WisemanPTSymbols',
              fontSize: 40,
              color: Colors.white,
            }}>
            {this.state.isSpeakerEnabled ? '{' : 'z'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={this._onMuteButtonPress}>
          <Text
            style={{
              fontFamily: 'WisemanPTSymbols',
              fontSize: 40,
              color: Colors.white,
            }}>
            {this.state.isMicEnabled ? 's' : 'y'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={this._onEndButtonPress}>
          <Text
            adjustsFontSizeToFit={true}
            style={{
              fontFamily: 'WisemanPTSymbols',
              fontSize: 40,
              color: Colors.white,
            }}>
            5
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={this._onCameraMuteButtonPress}>
          <Text
            style={{
              fontFamily: 'WisemanPTSymbols',
              fontSize: 40,
              color: Colors.white,
            }}>
            {this.state.isLocalVideoEnabled ? 'o' : 'x'}
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'column', flex: 1}}>
          {global.newMessage === true ? (
            <View style={styles.circleShape} />
          ) : null}

          <TouchableOpacity
            style={styles.optionButton}
            onPress={this._onChatPress}>
            <Text
              style={{
                fontFamily: 'WisemanPTSymbols',
                fontSize: 40,
                color: Colors.white,
              }}>
              M
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

/* istanbul ignore next */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(77,107,184,1)',
  },
  callContainer: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'rgba(77,107,184,1)',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: 80,
    height: 110,
    position: 'absolute',
    right: 5,
    bottom: 85,
    transform: [{scaleX: 1}],
  },
  remoteGrid: {
    flex: 1,
    flexDirection: 'row',
    // flexWrap: 'wrap'
  },
  remoteVideo: {
    flex: 1,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    transform: [{scaleX: -1}],
  },

  topBarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 60,
    flexDirection: 'column',
    alignItems: 'center',
  },

  optionsContainer: {
    position: 'absolute',
    left: 20,
    bottom: 50,
    right: 20,
    height: 80,
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
  },
  optionButton: {
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centerButton: {
    height: '85%',
    aspectRatio: 1,
    backgroundColor: 'rgba(212, 105, 96, 1.0)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  circleShape: {
    width: 10,
    height: 10,
    position: 'absolute',
    top: 25,
    left: 25,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10 / 2,
    backgroundColor: Colors.red,
  },
  handle__shape: {
    alignSelf: 'center',

    top: 8,

    width: 45,
    height: 5,

    borderRadius: 5,
    backgroundColor: Colors.blueGrayDisableText,
  },
});
/* istanbul ignore next */
const mapStateToProps = ({homeApiData}) => ({
  homeApiData,
});
export default connect(mapStateToProps)(TwillioCallScreen);
