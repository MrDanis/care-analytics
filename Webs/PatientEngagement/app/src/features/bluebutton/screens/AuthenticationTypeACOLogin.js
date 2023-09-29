//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors, Images} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  getAllergiesHistory,
  getCoverageHistory,
  getDiseasesHistory,
  getHospitalVisitHistory,
  getMedicationHistory,
  getProceduresHistory,
  getProviderHistory,
} from '../../bluebutton/action';
import {
  BlueButtonAccessToken,
  IsAcoUserLogin,
  removeItemValue,
  storeItem,
} from '../../../helpers/LocalStorage';

// create a component
const AuthenticationType = ({navigation}) => {
  const dispatch = useDispatch();
  const clearStoreData = () => {
    dispatch(getMedicationHistory([]));
    dispatch(getProviderHistory([]));
    dispatch(getHospitalVisitHistory([]));
    dispatch(getDiseasesHistory([]));
    dispatch(getCoverageHistory([]));
    dispatch(getAllergiesHistory([]));
    dispatch(getProceduresHistory([]));
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: Fonts.SourceSansBold,
            fontSize: hp(2.5),
            color: Colors.headingColor,
            textAlign: 'center',
            marginTop: hp(1.5),
          }}>
          Authentication 
        </Text>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={styles.container}>
          <Text
            style={{
              fontFamily: Fonts.SourceSansBold,
              fontSize: hp(2.5),
              color: Colors.headingColor,
              width: '70%',
              textAlign: 'center',
              marginTop: hp(3.5),
            }}>
            Select authentication type for Login
          </Text>

          <View
            style={{
              paddingTop: hp(6),
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-evenly',
              width: '90%',
            }}>
            <Pressable
              onPress={() => {
                console.log('====================================');
                console.log('pressesd');
                console.log('====================================');
                removeItemValue(BlueButtonAccessToken);
                clearStoreData();
                storeItem(IsAcoUserLogin, 'false').then(login => {
                  console.log(login);
                });
                navigation.navigate('MainDashboard',{params:0});
              }}
              style={{
                width: hp(15),
                height: hp(15),
                backgroundColor: Colors.white,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastImage
                style={{
                  width: hp(5.5),
                  height: hp(5.5),
                  resizeMode: 'contain',
                }}
                source={Images.bluebutton_icon}
              />
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(1.6),
                  color: Colors.headingColor,
                  textAlign: 'center',
                  marginTop: hp(1),
                }}>
                Blue button
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                removeItemValue(BlueButtonAccessToken);
                clearStoreData();
                storeItem(IsAcoUserLogin, 'true').then(login => {
                  console.log(login);
                });

                navigation.navigate('MainDashboard',{params:1});
              }}
              style={{
                width: hp(15),
                height: hp(15),
                backgroundColor: Colors.white,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastImage
                style={{
                  width: hp(5.5),
                  height: hp(5.5),
                  resizeMode: 'contain',
                }}
                source={Images.claim_icon}
              />
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(1.6),
                  color: Colors.headingColor,
                  textAlign: 'center',
                  marginTop: hp(1),
                }}>
                Claim
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 0.97,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

//make this component available to the app
export default AuthenticationType;
