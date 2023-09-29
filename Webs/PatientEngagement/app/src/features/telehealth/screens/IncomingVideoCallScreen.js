import React, {Component, Fragment} from 'react';
import {
  Vibration,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import {CallCircularView} from '../components/CallCircularView';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
import {CallActionType} from '../../../helpers/Constants';
import RNExitApp from 'react-native-exit-app';
import {CallAction} from '../../../helpers/signalR/SignalRService';
import {TwilioHelper} from '../../../helpers/Twilio/TwilioHelper';
import {
  checkCameraPermission,
  checkMicPermission,
  requestMicCameraPermission,
} from '../../../helpers/Common';
// import RNExitApp from 'react-native-exit-app';
import InCallManager from 'react-native-incall-manager';
// import {TwilioHelper} from '../../../helpers/Twilio/TwilioHelper';
// import {CallAction} from '../../../helpers/SignalR/SingnalRService';
// import {CallActionType} from '../../../helpers/Constants';
import RingerMode from 'react-native-ringer-mode';
import {answerIncomingIOSCall} from '../../../helpers/CallKeep/CallKeepHelper';
import {connect} from 'react-redux';
import {setCallIncomming} from '../actions';

// import {
//   checkCameraPermission,
//   checkMicPermission,
//   requestMicCameraPermission,
// } from '../../../helpers/Common';

class IncomingCallScreen extends React.PureComponent {
  // static navigationOptions = {
  //   //To hide the ActionBar/NavigationBar
  //   header: null,
  // };
  /* istanbul ignore next */
  async componentDidMount(): void {
    // this.props.dispatch(setCallIncomming(true));
    console.log('====================================');
    console.log('getCallIncomming', this.props.getCallIncomming);
    console.log('====================================');
    const PATTERN = [1000, 2000, 3000];
    InCallManager.startRingtone('_DEFAULT_');
    console.log('====================================');
    console.log('here in did mount');
    console.log('====================================');
    TwilioHelper.sharedInstance().callEndedFromSignalRCallBack = () => {
      console.log('====================================');
      console.log('here in call end from web');
      console.log('====================================');
      this._onCallEndFromWebPress();
    };
    // getRingerMode is a static async function
    // resolves the ringer mode as a string of the android device
    // "NORMAL" || "SILENT" || "VIBRATE"
    // RINGER_MODE_NORMAL, RINGER_MODE_SILENT, RINGER_MODE_VIBRATE

    // Get the value like this
    var mode = await RingerMode.getRingerMode();
    console.log('mode', mode);
    if (mode === 'VIBRATE') {
      // Device Will Vibrate for 10 seconds.
      Vibration.vibrate(PATTERN, true);
    }
  }
  componentDidUpdate(prevState) {
    console.log('====================================');
    console.log('here in before update');
    console.log('====================================');
    // Compare the previous and current props
    if (prevState.getCallIncomming !== this.props.getCallIncomming) {
      // Dispatch the action to fetch data again
      console.log('====================================');
      console.log('here in update of Incomming');
      console.log('====================================');
      this.props.dispatch(setCallIncomming(this.props.getCallIncomming + 1));
      console.log('====================================');
      console.log('getCallIncomming after update', this.props.getCallIncomming);
      console.log('====================================');
      this._onCallEndFromWebPress();
    }
  }

  constructor(props) {
    super(props);
  }
  /* istanbul ignore next */
  _onCallEndFromWebPress = () => {
    global.isIncomingCall = false;
    console.log('_onCallEndFromWebPress');
    InCallManager.stopRingtone();
    // Stop Vibration.
    Vibration.cancel();
    TwilioHelper.sharedInstance().reset();
    if (global.isBackground) {
      global.isBackground = false;
      // RNExitApp.exitApp();
      this.props.navigation.pop();
    } else {
      this.props.navigation.pop();
    }
  };
  /* istanbul ignore next */
  _onRejectPress = () => {
    CallAction(CallActionType.reject);
    global.isIncomingCall = false;
    console.log('_onRejectPress');
    InCallManager.stopRingtone();
    // Stop Vibration.
    Vibration.cancel();
    TwilioHelper.sharedInstance().reset();
    if (global.isBackground) {
      global.isBackground = false;
      // RNExitApp.exitApp();
    } else {
      this.props.navigation.pop();
    }
  };
  /* istanbul ignore next */
  _onAcceptPress = () => {
    if (Platform.OS === 'ios') {
      let callUUID = TwilioHelper.sharedInstance().callUUID;
      answerIncomingIOSCall(callUUID);
    }

    CallAction(CallActionType.accept);
    InCallManager.stopRingtone();
    // Stop Vibration.
    Vibration.cancel();
    global.isBackground = false;
    this.props.navigation.goBack(null);
    this.props.navigation.navigate('CallUI');
  };
  /* istanbul ignore next */
  renderTopContainer(): View {
    return (
      <View style={styles.topBarContainer}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: hp(3),
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: Fonts.SourceSansBold,
              color: Colors.white,
              alignItems: 'center',
              textAlign: 'center',
              marginTop: hp(2),
            }}>
            {TwilioHelper.sharedInstance().callerName}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: Colors.white,
              marginTop: hp(1),
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontFamily: Fonts.SourceSansRegular,
            }}>
            Video Call
          </Text>
        </View>
      </View>
    );
  }
  /* istanbul ignore next */
  renderBottomContainer(): View {
    return (
      <View style={styles.topBarContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp(10),
            marginLeft: hp(5),
            marginRight: hp(5),
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <TouchableOpacity
            style={styles.leftButton}
            onPress={() => {
              // this.props.navigation.navigate('CallUI');
              requestMicCameraPermission().then(statuses => {
                if (statuses.cameraPermission !== 'granted') {
                  checkCameraPermission();
                }
                if (statuses.microphonePermission !== 'granted') {
                  checkMicPermission();
                }
                if (
                  statuses.cameraPermission === 'granted' &&
                  statuses.microphonePermission === 'granted'
                ) {
                  this._onAcceptPress();
                }
              });
            }}>
            <Text
              style={{
                fontFamily: 'WisemanPTSymbols',
                fontSize: 60,
                color: Colors.white,
              }}>
              m
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={() => {
              this._onRejectPress();
            }}>
            <Text
              style={{
                fontFamily: 'WisemanPTSymbols',
                fontSize: 60,
                color: Colors.white,
              }}>
              5
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        <StatusBar
          backgroundColor={Colors.black1}
          barStyle="light-content"
          hidden={false}
        />
        <View style={styles.container}>
          {this.renderTopContainer()}
          <View style={styles.callContainer}>
            <CallCircularView textLabel="Incoming..." />
          </View>
          {this.renderBottomContainer()}
        </View>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black1,
    flexDirection: 'column',
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.black1,
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
    width: 75,
    height: 100,
    position: 'absolute',
    right: 5,
    bottom: 125,
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
  },

  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(10, 10, 10, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centerButton: {
    height: 90,
    width: 90,
    backgroundColor: 'rgba(212, 105, 96, 1.0)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  leftButton: {
    height: 90,
    width: 90,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});

const mapStateToProps = ({homeApiData, getCallIncomming}) => ({
  homeApiData,
  getCallIncomming,
});
export default connect(mapStateToProps)(IncomingCallScreen);
