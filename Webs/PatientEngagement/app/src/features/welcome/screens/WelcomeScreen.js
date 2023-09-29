/* istanbul ignore file */
import React, {Fragment, useRef} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import Colors from '../../../../config/Colors';
import Swiper from 'react-native-web-swiper';
import {SliderComponent} from '../components/SliderComponent';
import {slides} from '../constants';
import {
  AppleData,
  AuthCode,
  AuthToken,
  RefreshToken,
  retrieveItem,
  storeItem,
} from '../../../helpers/LocalStorage';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import FBIcon from '../../../../../assets/svg/icn_facebook.svg';
import GoogleIcon from '../../../../../assets/svg/icn_google.svg';
import AppleIcon from '../../../../../assets/svg/apple_logo.svg';
import {Modalize} from 'react-native-modalize';
import MyIcon from '../../../../../assets/svg/illustration_health_mate.svg';
import {
  loginWithFacebookID,
  loginWithGoogle,
} from '../../../helpers/SocailLoginHelper';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AuthService from '../../../api/auth';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {isAuthCode} from '../../../helpers/Common';


export class WelcomeScreen extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.authCredentialListener = null;
    this.user = null;
    this.state = {
      selectedIndex: 0,
      data: slides,
      showLoader: false,
      credentialStateForUser: -1,
    };
  }
  onOpen() {
    this.refs.modalize.open();
  }
  onClose() {
    this.refs.modalize.close();
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */
    if (appleAuth.isSupported) {
      this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
        console.warn('Credential Revoked');
        this.fetchAndUpdateCredentialState().catch(error =>
          this.setState({credentialStateForUser: `Error: ${error.code}`}),
        );
      });

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({credentialStateForUser: res}))
        .catch(error =>
          this.setState({credentialStateForUser: `Error: ${error.code}`}),
        );
    }
  }
  /* istanbul ignore next */
  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    if (appleAuth.isSupported) {
      this.authCredentialListener();
    }
  }
  appleSignIn = async () => {
    console.warn('Beginning Apple Authentication');

    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
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

      this.user = newUser;

      this.fetchAndUpdateCredentialState()
        .then(res => this.setState({credentialStateForUser: res}))
        .catch(error =>
          this.setState({credentialStateForUser: `Error: ${error.code}`}),
        );

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        console.log('nonce, identityToken');
        if (email !== null) {
          let appleData = {};
          appleData.email = email;
          appleData.fullName = fullName.familyName + ' ' + fullName.givenName;
          appleData.appleID = this.user;
          this.verifyAppleToken(appleData);
          await storeItem(AppleData, JSON.stringify(appleData));
        } else {
          var appleData = await retrieveItem(AppleData);
          this.verifyAppleToken(JSON.parse(appleData));
        }
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({credentialStateForUser: 'N/A'});
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(
        this.user,
      );
      if (credentialState === appleAuth.State.AUTHORIZED) {
        this.setState({credentialStateForUser: 'AUTHORIZED'});
      } else {
        this.setState({credentialStateForUser: credentialState});
      }
    }
  };
  /* istanbul ignore next */
  setActiveDotColor(index) {
    this.setState({selectedIndex: index});
  }
  /* istanbul ignore next */
  verifyAppleToken(data) {
    this.setState({showLoader: true});
    AuthService.verifyAppleToken(data)
      .then(response => {
        console.log(response);
        this.setState({showLoader: false});
        if (response.Status === true) {
          storeItem(AuthCode, response.Data.access_token).then(authCode => {
            console.log(authCode);
          });
          storeItem(AuthToken, response.Data.access_token).then(email => {
            console.log(email);
          });
          storeItem(RefreshToken, response.Data.refresh_token);
          this.props.navigation.navigate('HomeTab');
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
        this.setState({showLoader: false});
        showMessage({
          message: 'Error',
          description: 'Invalid email. Please try again.',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  /* istanbul ignore next */
  verifyFBToken(token) {
    this.setState({showLoader: true});
    AuthService.verifyFacebookAccessToken(token)
      .then(response => {
        console.log(response);
        this.setState({showLoader: false});
        if (response.Status === true) {
          storeItem(AuthCode, response.Data.access_token).then(authCode => {
            console.log(authCode);
          });
          storeItem(AuthToken, response.Data.access_token).then(email => {
            console.log(email);
          });
          storeItem(RefreshToken, response.Data.refresh_token);
          this.props.navigation.navigate('HomeTab');
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
        this.setState({showLoader: false});
        showMessage({
          message: 'Error',
          description: 'Invalid email. Please try again.',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  /* istanbul ignore next */
  verifyGoogleToken(token) {
    this.setState({showLoader: true});
    AuthService.verifyGoogleAccessToken(token)
      .then(response => {
        console.log(response);
        this.setState({showLoader: false});
        if (response.Status === true) {
          storeItem(AuthCode, response.Data.access_token).then(authCode => {
            console.log(authCode);
          });
          storeItem(AuthToken, response.Data.access_token).then(email => {
            console.log(email);
          });
          storeItem(RefreshToken, response.Data.refresh_token);
          this.props.navigation.navigate('HomeTab');
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
        this.setState({showLoader: false});
        showMessage({
          message: 'Error',
          description: 'Invalid email. Please try again.',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  /* istanbul ignore next */
  render() {
    const {navigation} = this.props;
    return (
      <Fragment>
        <ScrollView style={styles.container}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Loading...'}
            textStyle={{color: '#FFF'}}
          />
          <Text
            style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 28,
              alignSelf: 'center',
              padding: 5,
              marginTop: heightPercentageToDP(3),
              color: Colors.heading,
            }}>
            Welcome!
          </Text>
          <View style={{height: hp(70)}}>
            <Swiper
              timeout={4}
              springConfig={{friction: 10}}
              minDistanceForAction={0.15}
              loop
              buttonsEnabled={false}
              controlsEnabled={false}
              onIndexChanged={i => this.setActiveDotColor(i)}
              ref={ref => (this.swiper = ref)}>
              {this.state.data.map(item => {
                /* istanbul ignore next */
                return <SliderComponent key={item.key} data={item} />;
              })}
            </Swiper>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={
                this.state.selectedIndex === 0
                  ? styles.activeDotStyle
                  : styles.dotStyle
              }
            />
            <View
              style={
                this.state.selectedIndex === 1
                  ? styles.activeDotStyle
                  : styles.dotStyle
              }
            />
            <View
              style={
                this.state.selectedIndex === 2
                  ? styles.activeDotStyle
                  : styles.dotStyle
              }
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.onOpen();
            }}
            style={{
              width: '80%',
              marginTop: hp(4),
              height: hp(7),
              alignSelf: 'center',
              borderRadius: 5,
              marginHorizontal: '5%',
              borderColor: Colors.cyan,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.colorPrimary,
            }}>
            <Text
              style={{
                fontFamily: Fonts.RobotoMedium,
                fontSize: 16,
                color: Colors.white,
              }}>
              Get Started
            </Text>
          </TouchableOpacity>
          <Modalize
            ref="modalize"
            adjustToContentHeight={true}
            modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
            <View style={{padding: hp(3)}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.SourceSansRegular,
                  marginTop: hp(5),
                  marginLeft: hp(5),
                  color: Colors.garyLight,
                }}>
                Get Started
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.onClose();
                  loginWithFacebookID().then(token => {
                    console.log('token');
                    console.log(token);
                    if (token) {
                      this.verifyFBToken(token);
                    }
                  });
                }}
                style={{
                  width: '80%',
                  marginTop: hp(4),
                  height: hp(7),
                  alignSelf: 'center',
                  flexDirection: 'row',
                  borderRadius: 5,
                  marginHorizontal: '5%',
                  borderColor: Colors.cyan,
                  alignItems: 'center',
                  backgroundColor: Colors.facebookBackground,
                }}>
                <View style={{marginLeft: hp(3)}}>
                  <FBIcon
                    width={heightPercentageToDP(4)}
                    height={heightPercentageToDP(4)}
                    fill="#000"
                  />
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: 15,
                    marginLeft: hp(1),
                    color: Colors.white,
                  }}>
                  Continue with Facebook
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.onClose();
                  loginWithGoogle()
                    .then(data => {
                      console.log('Google Response :', data);
                      console.log('AuthCode :', data.serverAuthCode);
                      this.verifyGoogleToken(data.serverAuthCode);
                    })
                    .catch(error => {
                      console.log('ERROR ' + error);
                    });
                }}
                style={{
                  width: '80%',
                  marginTop: hp(2),
                  height: hp(7),
                  alignSelf: 'center',
                  borderRadius: 5,
                  flexDirection: 'row',
                  marginHorizontal: '5%',
                  borderColor: Colors.cyan,
                  alignItems: 'center',
                  backgroundColor: Colors.googleBackground,
                }}>
                <View style={{marginLeft: hp(3)}}>
                  <GoogleIcon
                    width={heightPercentageToDP(4)}
                    height={heightPercentageToDP(4)}
                    fill="#000"
                  />
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: 15,
                    marginLeft: hp(1),
                    color: Colors.white,
                  }}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  onPress={() => {
                    this.onClose();
                    this.appleSignIn();
                  }}
                  style={{
                    width: '80%',
                    marginTop: hp(2),
                    height: hp(7),
                    flexDirection: 'row',
                    alignSelf: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    marginHorizontal: '5%',
                    borderColor: Colors.black,
                    alignItems: 'center',
                    backgroundColor: Colors.black,
                  }}>
                  <View style={{marginLeft: hp(3)}}>
                    <AppleIcon
                      width={heightPercentageToDP(4)}
                      height={heightPercentageToDP(4)}
                      fill="#FFFFFF"
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: Fonts.RobotoMedium,
                      fontSize: 15,
                      color: Colors.white,
                      marginLeft: hp(1),
                    }}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  this.onClose();
                  this.props.navigation.navigate('EmailScreen');
                }}
                style={{
                  width: '80%',
                  marginTop: hp(2),
                  marginBottom: hp(5),
                  height: hp(7),
                  flexDirection: 'row',
                  alignSelf: 'center',
                  borderRadius: 5,
                  borderWidth: 1,
                  marginHorizontal: '5%',
                  borderColor: Colors.blueBackground,
                  alignItems: 'center',
                  backgroundColor: Colors.white,
                }}>
                <Text
                  style={{
                    fontFamily: 'WisemanPTSymbols',
                    marginLeft: hp(2),
                    fontSize: hp(6),
                    color: Colors.blueBackground,
                  }}>
                  %
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.RobotoMedium,
                    fontSize: 15,
                    color: Colors.blueBackground,
                    marginLeft: hp(1),
                  }}>
                  Continue with Email/Phone
                </Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        </ScrollView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slideContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  activeDotStyle: {
    backgroundColor: Colors.colorPrimary,
    width: 11,
    height: 11,
    borderRadius: 6,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  dotStyle: {
    backgroundColor: Colors.lightgreen_50,
    width: 8,
    height: 8,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  backButtonDisable: {
    fontSize: 16,
    padding: 13,
    color: Colors.lightGrey,
  },
  backButtonEnable: {
    fontSize: 16,
    padding: 13,
    color: Colors.darkGrey,
  },
});
