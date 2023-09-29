/* istanbul ignore file */
import React, {Fragment, useState, useEffect, useCallback, useRef} from 'react';
import {
  Text,
  Keyboard,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import ArrowHeadLeft from '../../../../../assets/svg/icon_arrow_left.svg';
import {Fonts} from '../../../../config/AppConfig';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Svgs from '../../../../config/Svgs';
import {SvgCss} from 'react-native-svg';
import AuthService from '../../../api/auth';
import {
  AuthCode,
  IsEmailORPhone,
  storeItem,
  UserEmail,
  retrieveItem,
  UserPhoneNumber,
  AuthToken,
} from '../../../helpers/LocalStorage';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import CountDown from 'react-native-countdown-component';
import {getUserProfile} from '../../profile/action';
import {connect, useDispatch} from 'react-redux';

function useForceUpdate() {
  const [counter, setCounter] = useState(60);
  return () => setCounter(value => counter); // update the state to force render
}

const OTPScreen = ({navigation, route}) => {
  const [oTPcode, setOTPCode] = useState(''); //useState(navigation.state.params.OtpCode);
  const [loader, showLoader] = useState(false);
  const {email, type} = route.params;
  console.log('====================================');
  console.log('email', email);
  console.log('====================================');
  const [loginType, setLoginType] = useState(type);
  const [timerFinish, setTimerFinish] = useState(false);
  const [counter, setCounter] = useState(60);
  const forceUpdate = useCallback(() => setCounter({}), []);
  const dispatch = useDispatch();

  async function verifyOTPCall(email, isEmail) {
    let authCode = await retrieveItem(AuthCode);
    if (oTPcode.length < 6) {
      // alert('Please enter valid otp');
      showMessage({
        message: 'Info',
        animationDuration: 200,
        description: 'Please Enter Valid OTP.',
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.red,
      });
    } else {
      showLoader(true);
      AuthService.getAccessToken(oTPcode, authCode)
        .then(response => {
          console.log(response);
          showLoader(false);
          if (response && response.statusCode === 200) {
            storeItem(AuthToken, response.data.accessToken).then(authToken => {
              console.log(authToken);
              if (Object.keys(response.data.profile).length > 0) {
                dispatch(getUserProfile(response.data.profile));
                console.log('====================================');
                console.log('response.data.profile', response.data.profile);
                console.log('====================================');
                if (
                  response.data.profile.firstName !== '' &&
                  response.data.profile.firstName !== null &&
                  response.data.profile.lastName !== '' &&
                  response.data.profile.lastName !== null &&
                  response.data.profile.gender !== 0 &&
                  response.data.profile.gender !== null &&
                  response.data.profile.dateOfBirth !== '01/01/1900 00:00:00' &&
                  response.data.profile.dateOfBirth !== null &&
                  response.data.profile.email !== '' &&
                  response.data.profile.email !== null &&
                  response.data.profile.phone !== '' &&
                  response.data.profile.phone !== null
                ) {
                  console.log('====================================');
                  console.log('here');
                  console.log('====================================');
                  navigation.navigate('HomeTab');
                } else {
                  navigation.navigate('EditProfile', {
                    profileDetails: response.data.profile,
                    screenName: 'otp',
                  });
                }
              } else {
                navigation.navigate('EditProfile', {
                  profileDetails: response.data.profile,
                  screenName: 'otp',
                });
              }
            });
          } else {
            showMessage({
              message: 'Error',
              description: 'Invalid OTP. Please Try Again.',
              type: 'default',
              icon: {icon: 'info', position: 'left'},
              backgroundColor: Colors.red,
            });
          }
        })
        .catch(error => {
          console.log(error);
          showLoader(false);
          showMessage({
            message: 'Info',
            description: 'Invalid OTP. Please Try Again.', //error.response.data.title,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    }
  }
  async function getAuthToken() {
    showLoader(true);
    let userLoginType =
      //   loginType === 'e-mail'
      //     ? await retrieveItem(UserEmail)
      //     : await retrieveItem(UserPhoneNumber);
      // let isEmail = await retrieveItem(IsEmailORPhone);
      AuthService.getAuthToken(email, type === 'e-mail' ? true : false)
        .then(response => {
          console.log('api response');
          console.log(response);
          showLoader(false);
          if (response && response.statusCode === 200) {
            setOTPCode('');
            setCounter(60);
            setTimerFinish(false);
            forceUpdate();
            // showMessage({
            //     message: 'Success',
            //     animationDuration: 200,
            //     description: 'Code Sent Successfully.',
            //     type: 'default',
            //     icon: {icon: 'info', position: 'left'},
            //     backgroundColor: Colors.green,
            // });
            storeItem(AuthCode, response.data.authCode).then(authCode => {
              console.log(authCode);
            });
          } else {
            showMessage({
              message: 'Error',
              animationDuration: 200,
              description: 'Invalid ' + loginType + '. Please try again.',
              type: 'default',
              icon: {icon: 'info', position: 'left'},
              backgroundColor: Colors.red,
            });
          }
        })
        .catch(error => {
          showLoader(false);
          console.log('api error');
          console.log(error);
          showMessage({
            message: 'Info',
            description: error.message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
  }
  return (
    <Fragment>
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
        <View
          onTouchStart={() => {
            Keyboard.dismiss();
          }}
          style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              minHeight: hp(8),
              paddingVertical: hp(2),
              paddingHorizontal: hp(2),
              backgroundColor: Colors.backgroundMainLogin,
            }}>
            <SvgCss
              xml={Svgs.arrowHeadLeft}
              width={hp(5)}
              height={hp(5)}
              fill={Colors.black}
            />
          </TouchableOpacity>

          <Text
            style={{
              textAlign: 'left',
              fontFamily: Fonts.SourceSansBold,
              marginTop: hp(2),
              marginLeft: hp(3.5),
              // marginRight: hp(5),
              fontSize: hp(3.5),
              color: Colors.notificationGray,
            }}>
            {'Verify your '}
          </Text>

          <Text
            style={{
              textAlign: 'left',
              fontFamily: Fonts.SourceSansBold,
              // marginTop: hp(2),
              marginLeft: hp(3.5),
              // marginRight: hp(5),
              fontSize: hp(3.5),
              color: Colors.notificationGray,
            }}>
            {loginType}
          </Text>

          <Text
            style={{
              textAlign: 'left',
              fontFamily: Fonts.SourceSansRegular,
              marginTop: hp(1),
              marginLeft: hp(3.5),
              // marginRight: hp(5),
              fontSize: hp(2.5),
              color: Colors.noRecordFound,
            }}>
            We sent you a code to
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontFamily: Fonts.SourceSansRegular,
              marginLeft: hp(3.5),
              marginRight: hp(5),
              fontSize: hp(2.5),
              color: Colors.noRecordFound,
            }}>
            {email}
          </Text>
          <OTPInputView
            pinCount={6}
            code={oTPcode}
            style={{
              width: '85%',
              height: 150,
              alignSelf: 'center',
              alignItems: 'center',
            }}
            autoFocusOnLoad={true}
            placeholderCharacter="_"
            placeholderTextColor={Colors.line}
            codeInputFieldStyle={{
              backgroundColor: Colors.white,
              borderColor: Colors.white,
              elevation: 1,
              width: 45,
              height: 45,
              borderRadius: 8,
              color: Colors.black,
              fontFamily: Fonts.SourceSansBold,
            }}
            codeInputHighlightStyle={{
              backgroundColor: Colors.white,
              borderColor: Colors.white,
              elevation: 1,
              width: 45,
              height: 60,
              borderRadius: 8,
            }}
            keyboardType="number-pad"
            onCodeChanged={setOTPCode}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: hp(-5),
              width: '60%',
              alignSelf: 'flex-end',
              marginRight: hp(2.5),
            }}>
            <TouchableOpacity
              onPress={
                () => {
                  timerFinish === true && getAuthToken();
                }

                // navigation.navigate('EditProfile')
              }
              disbaled={!timerFinish}
              activeOpacity={timerFinish === true ? 0 : 1}
              style={{
                borderRadius: 8,
                justifyContent: 'center',
                alignSelf: 'center',
                height: hp(6),
                // marginHorizontal: hp(0),
              }}>
              {loader ? (
                <Spinner
                  visible={loader}
                  textContent={'Loading...'}
                  textStyle={{color: '#FFF'}}
                />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2),
                    opacity: timerFinish === true ? 1 : 0,
                    width: '100%',
                    marginLeft: timerFinish === true ? hp(6.5) : 0,
                    color:
                      timerFinish === true
                        ? Colors.blueTextColor
                        : Colors.noRecordFound,
                  }}>
                  Send me a new code
                </Text>
              )}
            </TouchableOpacity>
            <CountDown
              until={counter}
              size={14}
              onFinish={() => setTimerFinish(true)}
              digitStyle={{
                backgroundColor: Colors.backgroundMainLogin,
                marginLeft: hp(-1),
                opacity: timerFinish === true ? 0 : 1,
              }}
              digitTxtStyle={{color: Colors.blueTextColor}}
              timeToShow={['M', 'S']}
              // timeLabels={{m: 'MM', s: 'SS'}}
              timeLabels={{m: null, s: null}}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              oTPcode !== '' ? verifyOTPCall() : alert('please enter otp');
            }}
            disabled={oTPcode !== '' ? false : true}
            style={{
              backgroundColor:
                oTPcode !== ''
                  ? Colors.blueTextColor
                  : Colors.blueTextColorDisabled,
              minHeight: hp(8),
              borderRadius: 8,
              justifyContent: 'center',
              maxWidth: '85%',
              minWidth: '85%',
              alignSelf: 'center',
            }}>
            {loader ? (
              <Spinner
                visible={loader}
                textContent={'Loading...'}
                textStyle={{color: '#FFF'}}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: Fonts.SourceSansSemibold,
                  fontSize: hp(2.5),
                  color: Colors.white,
                }}>
                Verify
              </Text>
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: hp(2),
              width: '40%',
              alignSelf: 'center',
            }}>
            {/* <TouchableOpacity
              onPress={
                () => {
                  timerFinish === true && getAuthToken();
                }

                // navigation.navigate('EditProfile')
              }
              disbaled={!timerFinish}
              activeOpacity={timerFinish === true ? 0 : 1}
              style={{
                borderRadius: 8,
                justifyContent: 'center',
                alignSelf: 'center',
                height: hp(6),
                marginHorizontal: hp(1),
              }}>
              {loader ? (
                <Spinner
                  visible={loader}
                  textContent={'Loading...'}
                  textStyle={{color: '#FFF'}}
                />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.5),
                    color:
                      timerFinish === true
                        ? Colors.black
                        : Colors.noRecordFound,
                  }}>
                  Resend
                </Text>
              )}
            </TouchableOpacity>
            <CountDown
              until={counter}
              size={15}
              onFinish={() => setTimerFinish(true)}
              digitStyle={{backgroundColor: Colors.lightGrey1}}
              digitTxtStyle={{color: Colors.black}}
              timeToShow={['M', 'S']}
              // timeLabels={{m: 'MM', s: 'SS'}}
              timeLabels={{m: null, s: null}}
            /> */}
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};
const mapStateToProps = ({userProfileData}) => ({
  userProfileData,
});

export default connect(mapStateToProps)(OTPScreen);
