/* istanbul ignore file */
import React, {Fragment, useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';

import Colors from '../../../../config/Colors';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import Images from '../../../../config/Images';
import ArrowHeadLeft from '../../../../../assets/svg/icon_arrow_left.svg';
import IconEmail from '../../../../../assets/svg/icon_email.svg';
import {SvgCss} from 'react-native-svg';
import Spinner from 'react-native-loading-spinner-overlay';
import Svgs from '../../../../config/Svgs';
import AuthService from '../../../api/auth';
import {
  AuthCode,
  IsEmailORPhone,
  storeItem,
  UserEmail,
  UserPhoneNumber,
} from '../../../helpers/LocalStorage';
import {showMessage} from 'react-native-flash-message';

const InputPhoneScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneValidation, setPhoneValidation] = useState(false);
  const [loader, showLoader] = useState(false);

  /* istanbul ignore next */
  function validatePhone(text) {
    // var regex = /^\+(?:[0-9] ?){10}[0-9]$/;
    var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if (regex.test(text) === false) {
      setPhoneValidation(false);
      setPhoneError('Enter valid phone number');
      console.log('phone false');
      return false;
    } else {
      setPhoneValidation(true);
      setPhoneError('');
      return true;
    }
  }
  function sendOTPOverPhone(phone, isEmail) {
    Keyboard.dismiss();
    showLoader(true);
    AuthService.getAuthToken(phone, isEmail)
      .then(response => {
        console.log(response);
        showLoader(false);
        if (response && response.statusCode === 200) {
          storeItem(UserPhoneNumber, phone).then(phone => {
            console.log(phone);
          });
          storeItem(IsEmailORPhone, false).then(email => {
            console.log(email);
          });
          storeItem(AuthCode, response.data.authCode).then(authCode => {
            console.log(authCode);
            navigation.navigate('OTP', {
              email: phone,
              OtpCode: response.data.otp,
              type: 'Phone Number',
            });
          });

          // storeItem(RefreshToken, data.RefreshToken);
        } else {
          showMessage({
            message: 'Error',
            description: 'Invalid phone number. Please try again.',
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
              Phone Number
            </Text>
            <Text
              style={{
                textAlign: 'left',
                fontFamily: Fonts.SourceSansRegular,
                marginTop: hp(1),
                fontSize: hp(2),
                color: Colors.noRecordFound,
              }}>
              We will sent you a OTP code on your provided phone number to login
              in 360HealthSpot.
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
              }}>
              <Image
                source={Images.phoneIcon}
                style={{
                  height: hp(2.8),
                  width: hp(2.6),
                  resizeMode: 'contain',
                  marginRight: hp(1.3),
                }}
              />
              <TextInput
                style={{
                  fontSize: hp(2.0),
                  width: '90%',
                  color: Colors.black4,
                }}
                value={phoneNumber}
                onChangeText={e => {
                  setPhoneNumber(e);
                  validatePhone(e);
                }}
                placeholderTextColor={Colors.noRecordFound}
                placeholder={'+CXXXXXXXXXX'}
                keyboardType="phone-pad"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              phoneError === '' && sendOTPOverPhone(phoneNumber, false)
            }
            disabled={phoneValidation ? false : true}
            style={{
              backgroundColor: phoneValidation
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
                  fontSize: hp(2.5),
                  color: Colors.white,
                }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default InputPhoneScreen;
