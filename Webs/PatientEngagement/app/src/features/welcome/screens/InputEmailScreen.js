/* istanbul ignore file */
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  Text,
  Keyboard,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  InteractionManager,
  Pressable,
} from 'react-native';
import {Colors, Images} from '../../../../config';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import ArrowHeadLeft from '../../../../../assets/svg/icon_arrow_left.svg';
import {Fonts} from '../../../../config/AppConfig';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Svgs from '../../../../config/Svgs';
import {SvgCss} from 'react-native-svg';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  AuthCode,
  IsEmailORPhone,
  storeItem,
  UserEmail,
} from '../../../helpers/LocalStorage';
import {showMessage} from 'react-native-flash-message';
import AuthService from '../../../api/auth';

const InputEmailScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailError, set_emailError] = useState('');
  const [emailValidation, setEmailValidation] = useState(false);
  const [loader, showLoader] = useState(false);

  const onSubmitEmail = email => {
    if (email === '' || email === null) {
      set_emailError('This field is required');
    } else {
      if (validateEmail(email)) {
        set_emailError('');
        console.log('====================================');
        console.log('true');
        console.log('====================================');
      } else {
        set_emailError('Enter valid phone or email address');
        validateEmail(email);
      }
    }
  };
  const validateEmail = text => {
    var reg = new RegExp(
      '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
    );
    if (reg.test(text) === false) {
      setEmailValidation(false);
      return false;
    } else {
      console.log('email true');
      setEmailValidation(true);
      return true;
    }
  };

  function sendOTPOverEmail(email, isEmail) {
    showLoader(true);
    AuthService.getAuthToken(email, isEmail)
      .then(response => {
        console.log(response);
        showLoader(false);
        if (response && response.statusCode === 200) {
          storeItem(UserEmail, email).then(email => {
            console.log(email);
          });
          storeItem(IsEmailORPhone, true).then(email => {
            console.log(email);
          });
          storeItem(AuthCode, response.data.authCode).then(authCode => {
            console.log(authCode);
            navigation.navigate('OTP', {
              email: email,
              OtpCode: response.data.otp,
              type: 'e-mail',
            });
          });

          // storeItem(RefreshToken, data.RefreshToken);
        } else {
          showMessage({
            message: 'Error',
            description: 'Invalid email. Please try again.',
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
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }

  return (
    <Fragment>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
        <View
          // onTouchStart={() => {
          //     Keyboard.dismiss();
          // }}
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              height: hp(9),
              width: hp(9),
              paddingVertical: hp(2),
              paddingHorizontal: hp(2),
              // backgroundColor: Colors.backgroundMainLogin,
              alignSelf: 'flex-start',
            }}>
            <SvgCss
              xml={Svgs.arrowHeadLeft}
              width={hp(5)}
              height={hp(5)}
              fill={Colors.black}
            />
          </TouchableOpacity>
          <View style={{width: '90%'}}>
            <Text
              style={{
                textAlign: 'left',
                fontFamily: Fonts.SourceSansBold,
                marginTop: hp(2),
                fontSize: hp(4.5),
                color: Colors.notificationGray,
              }}>
              Enter your
            </Text>
            <Text
              style={{
                textAlign: 'left',
                fontFamily: Fonts.SourceSansBold,
                marginTop: hp(0),
                fontSize: hp(4.5),
                color: Colors.notificationGray,
              }}>
              E-mail
            </Text>
            <Text
              style={{
                textAlign: 'left',
                fontFamily: Fonts.SourceSansRegular,
                marginTop: hp(1),
                fontSize: hp(2),
                color: Colors.noRecordFound,
              }}>
              We will sent you a OTP code on your provided email address to
              login in 360HealthSpot.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingHorizontal: hp(1.8),
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 10,
              height: hp(6.5),
              width: '90%',
              marginVertical: hp(4.5),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                // width: '100%',
              }}>
              <Image
                source={Images.EmailIconBlack}
                style={{
                  height: hp(2.8),
                  width: hp(2.6),
                  resizeMode: 'contain',
                  marginRight: hp(1.6),
                }}
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  width: '90%',
                  color: Colors.black4,
                }}
                value={email}
                onChangeText={e => {
                  setEmail(e);
                  onSubmitEmail(e);
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                placeholderTextColor={Colors.noRecordFound}
                placeholder={'Email address'}
                keyboardType="email-address"
              />
            </View>
          </View>
          <Pressable
            onPress={() => emailError === '' && sendOTPOverEmail(email, true)}
            disabled={emailValidation ? false : true}
            style={{
              backgroundColor: emailValidation
                ? Colors.blueTextColor
                : Colors.blueTextColorDisabled,
              borderRadius: 8,
              justifyContent: 'center',
              height: hp(6.5),
              width: '90%',
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
                  fontSize: hp(2.2),
                  color: Colors.white,
                }}>
                Submit
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default InputEmailScreen;
