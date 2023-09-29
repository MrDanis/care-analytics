import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {Colors, Images} from '../../../../config';
import {CURRENT_TARGET, Fonts} from '../../../../config/AppConfig';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {SvgCssUri, SvgUri, SvgWithCssUri} from 'react-native-svg';
import colors from '../../../../config/Colors';
import moment from 'moment';

// This is the card Component of the Vital Screen.
const AllVitals = ({vitalData, navigation, openModal,bpReadingsHealthKit}) => {
  const [loaded, setLoaded] = useState(false);

  console.log('This is the critical data bro' + vitalData.isCritical);
  return (
    <>
      <TouchableOpacity
        //  style={{borderColor:'red',borderWidth:2}}
        onPress={() => {
          console.debug('This is the vitalsData');
          console.debug(vitalData.isCritical);
          console.log('====================================');
          console.log('vitalData', vitalData);
          console.log('====================================');
          if (vitalData.id === 10) {
            navigation.navigate('VitalWeight', {vitalsData: vitalData});
          }
          if (vitalData.id === 1) {
            navigation.navigate('VitalBloodPressure', {vitalsData: vitalData,bloodFromHealth:bpReadingsHealthKit});
          }
          if (vitalData.id === 4) {
            navigation.navigate('VitalTemperature', {vitalsData: vitalData});
          }
          if (vitalData.id === 9) {
            navigation.navigate('VitalHeight', {vitalsData: vitalData});
          }
          if (vitalData.id === 6) {
            navigation.navigate('VitalPulseRate', {vitalsData: vitalData});
          }

          // navigation.navigate('MeasureVitals', {vitalsData: vitalData});
        }}>
        <View
          style={{
            padding: hp(2),
            backgroundColor: Colors.white,
            marginTop: hp(3),
            borderRadius: hp(1),
            // borderColor:'green',
            // borderWidth:2,
            borderColor: Colors.line,
            borderWidth: 0.33,
            elevation: Platform.OS === 'ios' ? 20 : 0,
          }}>
          <View
            style={{
              marginBottom: hp(1),
              flexDirection: 'row',
              alignItems: 'center',
              // borderColor:'green',
              // borderWidth:2,
            }}>
            <View
              style={{
                width: '50%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: vitalData.icon}}
                style={{width: hp(4), height: hp(4)}}
              />
              <Text
                style={{
                  paddingHorizontal: hp(1),
                  // marginTop: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.black,
                  fontSize: hp(2),
                }}>
                {vitalData.name === null ? '' : vitalData.name}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'flex-end',
                width: '50%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  paddingLeft: hp(2.5),
                  paddingRight: hp(0.5),
                  // marginHorizontal: hp(0),
                  // marginLeft: 0,
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.blueGrayDisableText,
                  fontSize: hp(1.9),
                }}>
                {vitalData.measuredDate === null ||
                vitalData.measuredDate === '0001-01-01T00:00:00'
                  ? ''
                  : moment(vitalData.measuredDate).format('ddd, MMM DD, YYYY')}
              </Text>
              <Image
                style={{
                  // transform: [{rotate: '180deg'}],
                  width: hp(1.0),
                  height: hp(1.0),
                  // alignContent: 'center',
                  alignSelf: 'center',
                  // marginHorizontal: hp(0),
                  // marginTop: hp(0.7),
                  // fontFamily: Fonts.SourceSansRegular,
                  // color: Colors.blueGrayDisableText,
                }}
                source={Images.rightArrow}
              />
            </View>
          </View>
          {vitalData.value !== null ? (
            <View
              style={{
                alignContent: 'space-between',
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    paddingRight: hp(0.5),
                    // marginLeft: hp(0.5),
                    marginTop: hp(0),
                    fontFamily: Fonts.SourceSansBold,
                    fontSize: hp(3),
                    color: Colors.black,
                  }}>
                  {vitalData.value === null ? '' : vitalData.value}
                </Text>
                {vitalData.isCritical &&
                  vitalData.id !== 10 &&
                  vitalData.id !== 9 && (
                     <View>
                        <FastImage
                          style={{
                            width: 15,
                            height: 15,
                            marginLeft: hp(0.5),
                            // alignSelf: 'flex-end',
                            // marginTop: hp(2),
                            // marginRight: hp(20),
                          }}
                          resizeMode="contain"
                          source={require('../../../../../assets/images/icon_alert_fill.png')}
                        />
                      </View>
                    )}
              </View>
              {vitalData.isCritical &&
                vitalData.id !== 10 &&
                vitalData.id !== 9 &&
                  (
                    <View>
                      <View
                        style={{
                          paddingLeft: 9,
                          paddingRight: 8,
                          paddingVertical: 2,
                          backgroundColor: colors.red3,
                          borderRadius: 20,
                          elevation: 10,
                        }}>
                        <Text style={{color: Colors.white, fontSize: hp(1.5)}}>
                          {'Critical'}
                        </Text>
                      </View>
                    </View>
                  )}
            </View>
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansSemibold,
                  fontSize: hp(2),
                  color: Colors.black,
                }}>
                Keeping a record will help you and your doctor.
              </Text>
            </View>
          )}

          <View>
            <Text
              style={{
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(1.7),
                color: Colors.blueGrayDisableText,
              }}>
              {vitalData.unit === null || vitalData.value === null
                ? `Learn more about your ${vitalData.name} `
                : vitalData.unit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default AllVitals;
