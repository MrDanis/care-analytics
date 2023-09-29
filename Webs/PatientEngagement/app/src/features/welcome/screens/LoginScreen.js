import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component, PureComponent, useEffect, useState} from 'react';
import Colors from '../../../../config/Colors';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import Images from '../../../../config/Images';
import Divider from 'react-native-divider';
import {
  loginWithFacebookID,
  loginWithGoogle,
} from '../../../helpers/SocailLoginHelper';
import AuthService from '../../../api/auth';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  AppleData,
  AuthCode,
  AuthToken,
  RefreshToken,
  retrieveItem,
  storeItem,
} from '../../../helpers/LocalStorage';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {useDispatch} from 'react-redux';
import {getUserProfile} from '../../profile/action';
import {startSignalR} from '../../../helpers/signalR/SignalRService';
import {color} from 'react-native-reanimated';
import {Fragment} from 'react';
import SignInButton from '../components/signInButtonComponent';
import { startGoogleFit } from '../../../helpers/GoogleFit/GoogleFitHandler';
import { useSelector } from 'react-redux';
import { isAuthorizedFromGoogleFit } from '../action';
let user = null;
let authCredentialListener = null;

const Login = ({navigation}) => {
  const isAuthorizeFromFit = useSelector(state => state?.authFromFit);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [credentialStateForUser, setCredentialStateForUser] = useState(-1);

  useEffect(() => {
    if (appleAuth.isSupported) {
      authCredentialListener = appleAuth.onCredentialRevoked(async () => {
        console.warn('Credential Revoked');
        fetchAndUpdateCredentialState().catch(error =>
          setCredentialStateForUser(`Error: ${error.code}`),
        );
      });

      fetchAndUpdateCredentialState()
        .then(res => setCredentialStateForUser(res))
        .catch(error => setCredentialStateForUser(`Error: ${error.code}`));
    }
    // if(isAuthorizeFromFit === false)
    // {
    //  startGoogleFit()
    // }
    // function handleDispatchIsAuth(isAuth){
    //   // dispatch(isAuthorizedFromGoogleFit(isAuth));
    //   // console.log('Is user is authorize ......',isAuth);
    // }
    console.log('Is authorize form the google fit : ',isAuthorizeFromFit);
  }, []);

  const verifyGoogleToken = token => {
    setLoader(true);
    AuthService.verifyGoogleAccessToken(token)
      .then(response => {
        console.log(response);
        setLoader(false);
        if (response.statusCode === 200) {
          dispatch(getUserProfile(response.data.profile));
          storeItem(AuthCode, response.data.accessToken).then(authCode => {
            console.log('authCode', authCode);
          });
          storeItem(AuthToken, response.data.accessToken).then(email => {
            console.log('email', email);
          });
          storeItem(RefreshToken, response.data.refreshToken);
          navigation.navigate('HomeTab');
        } else {
          showMessage({
            message: 'Error',
            description: response.Error
              ? response.Error.Message
              : 'Invalid Email, Please try again!',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        showMessage({
          message: 'Error',
          description: 'Invalid email. Please try again.',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };

  const appleSignIn = async () => {
    console.warn('Beginning Apple Authentication');
    // start a login request
    try {
      console.log('Inside Apple Login');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        fullName,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      user = newUser;

      fetchAndUpdateCredentialState()
        .then(res => setCredentialStateForUser(res))
        .catch(error => setCredentialStateForUser(`Error: ${error.code}`));

      if (identityToken) {
        console.log('====================================');
        console.log('email', email);
        console.log('====================================');
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        console.log('nonce, identityToken');
        if (email !== null) {
          let appleData = {};
          appleData.email = email;
          appleData.fullName = fullName.familyName + ' ' + fullName.givenName;
          appleData.appleID = user;
          verifyAppleToken(appleData);
          await storeItem(AppleData, JSON.stringify(appleData));
        } else {
          var appleData = await retrieveItem(AppleData);
          console.log('====================================');
          console.log('appleData', appleData);
          console.log('====================================');
          verifyAppleToken(JSON.parse(appleData));
        }
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  const fetchAndUpdateCredentialState = async () => {
    if (user === null) {
      setCredentialStateForUser('N/A');
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(
        this.user,
      );
      if (credentialState === appleAuth.State.AUTHORIZED) {
        setCredentialStateForUser('AUTHORIZED');
      } else {
        setCredentialStateForUser(credentialState);
      }
    }
  };

  const verifyAppleToken = data => {
    setLoader(true);
    AuthService.verifyAppleToken(data)
      .then(response => {
        console.log(response);
        setLoader(false);
        if (response.statusCode === 200) {
          dispatch(getUserProfile(response.data.profile));
          storeItem(AuthCode, response.data.accessToken).then(authCode => {
            console.log(authCode);
          });
          storeItem(AuthToken, response.data.accessToken).then(email => {
            console.log(email);
          });
          storeItem(RefreshToken, response.data.refreshToken);
          navigation.navigate('HomeTab');
        } else {
          showMessage({
            message: 'Error',
            description: response.Error
              ? response.Error.Message
              : 'Invalid Email, Please try again!',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        showMessage({
          message: 'Error',
          description: 'Invalid email. Please try again.',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };

  /* istanbul ignore next */
  const verifyFBToken = token => {
    setLoader(true);
    AuthService.verifyFacebookAccessToken(token)
      .then(response => {
        console.log('====================================');
        console.log('response facebook verify');
        console.log('====================================');
        console.log(response);
        setLoader(false);
        if (response.statusCode === 200) {
          dispatch(getUserProfile(response.data.profile));
          storeItem(AuthCode, response.data.accessToken).then(authCode => {
            console.log('authCode', authCode);
          });
          storeItem(AuthToken, response.data.accessToken).then(email => {
            console.log(email);
          });
          storeItem(RefreshToken, response.data.refreshToken);
          navigation.navigate('HomeTab');
        } else {
          showMessage({
            message: 'Error',
            description: response.error
              ? response.error
              : 'Invalid Email, Please try again!',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        showMessage({
          message: 'Error',
          description: 'Invalid email. Please try again.',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };
  return (
    <Fragment>
      <SafeAreaView
        style={{
          backgroundColor: Colors.BgColor,
        }}>
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'center',
          }}>
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={{color: '#FFF'}}
          />
          <View style={{alignItems: 'center', color: '#E5E5E5'}}>
            <Image
              source={Images.splashForegroundLogo}
              style={{
                marginTop: hp(5),
                height: hp(20),
                width: hp(22),
                resizeMode: 'contain',
              }}
            />

            <Text
              style={{
                // textAlign: 'center',
                fontFamily: Fonts.SourceSansSemibold,
                marginTop: hp(0.5),
                fontSize: hp(2.3),
                color: Colors.black,
              }}>
              Sign in with social Platforms
            </Text>
          </View>

          <View
            style={{
              marginTop: hp(2.6),
              // marginLeft: hp(3),
              ///+3 Added for bottom SignIn Cards Space
              marginBottom: hp(4),
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                loginWithGoogle()
                  .then(data => {
                    console.log('Google Response :', data);
                    console.log('AuthCode :', data.serverAuthCode);
                    verifyGoogleToken(data.serverAuthCode);
                  })
                  .catch(error => {
                    console.log('ERROR ' + error);
                  });
              }}
              style={{
                width: '22%',
                backgroundColor: Colors.white,
                borderRadius: 30,
                height: hp(5.5),
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.google_image}
                style={{
                  // height: hp(2.5),
                  height: hp(3),
                  width: hp(5),
                  resizeMode: 'contain',
                }}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                // console.log('pressing it for the android.....')
                loginWithFacebookID().then(token => {
                  console.log('facebook token is : ',token);
                  console.log(token);
                  if (token) {
                    verifyFBToken(token);
                  }
                });
              }}
              style={{
                width: '22%',
                backgroundColor: Colors.blueFacebook,
                borderRadius: 30,
                height: hp(5.5),
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.facebook_image}
                style={{
                  height: hp(3),
                  width: hp(4.5),
                  resizeMode: 'contain',
                }}
              />
            </Pressable>
            {Platform.OS === 'ios' ? (
              <Pressable
                onPress={() => appleSignIn()}
                style={{
                  width: '22%',
                  backgroundColor: Colors.white,
                  borderRadius: 30,
                  height: hp(5.5),
                  shadowOffset: {width: 0.5, height: 0.5},
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.apple_image}
                  style={{
                    height: hp(3),
                    width: hp(5),
                    resizeMode: 'contain',
                  }}
                />
              </Pressable>
            ) : null}
          </View>
        </View>
        {/* <Fragment/> */}
      </SafeAreaView>

      <View
        style={{
          backgroundColor: Colors.backgroundMainLogin,
        }}>
        <View
          style={{
            backgroundColor: Colors.backgroundMainLogin,
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.5,
            shadowRadius: 1.5,
            elevation: 1,
            borderTopColor: Colors.darkGrey1,
            // borderColor: Colors.black,
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            // backgroundColor: Colors.white,
          }}>
          <ScrollView
            style={{
              // marginTop: hp(3),

              // width: '90%',
              // alignItems: 'center',
              // borderTopEndRadius: 30,
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              backgroundColor: Colors.white,
              // backgroundColor: Colors.backgroundMainLogin,
            }}
            contentContainerStyle={{
              // elevation: 10,
              flexGrow: 1,
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            <Text
              style={{
                color: Colors.black,
                fontSize: hp(3),
                marginTop: hp(4),
                alignContent: 'center',
                justifyContent: 'center',
                fontFamily: Fonts.SourceSansBold,
              }}>
              {' '}
              Sign in Now
            </Text>
            <Text
              style={{
                color: Colors.darkGrey,
                fontSize: hp(2.1),
                paddingHorizontal: hp(6),
                marginTop: hp(2.2),
                fontFamily: Fonts.SourceSansRegular,
                textAlign: 'center',
              }}>
              Select Options to Sign In. You can Sign in from Phone or Email
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                // padding: hp(1),
                justifyContent: 'space-evenly',
                alignItems: 'center',
                alignSelf: 'center',
                width: '100%',
              }}>
              <Pressable onPress={() => navigation.navigate('EmailScreen')}>
                <SignInButton
                  image={Images.homeIconProfileSignUpEmailIcon}
                  text="Email"
                />
              </Pressable>

              <Pressable onPress={() => navigation.navigate('PhoneScreen')}>
                <SignInButton image={Images.phoneIcon} text="Phone" />
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: Colors.white,
                marginTop: Platform.OS == 'ios' ? hp(11) : hp(13.2),
                marginBottom: hp(10),
                width: '100%',
                // alignItems: 'flex-start',
                // justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.5),
                  color: Colors.black4,
                }}>
                Can't access your account?
              </Text>
              <Pressable>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.5),
                    color: Colors.blueTextColor,
                    marginLeft: hp(2),
                  }}>
                  Get Help
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
      {/* Sign In Part */}
    </Fragment>
  );
};
export default Login;

{
  /* <TouchableOpacity
  onPress={() => appleSignIn()}
  style={{
    width: '27%',
    backgroundColor: Colors.white,
    padding: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    height: hp(4),
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  }}>
  <Image
    source={Images.apple_image}
    style={{
      height: hp(3),
      width: hp(5),
      resizeMode: 'contain',
    }}
  />
</TouchableOpacity> */
}
