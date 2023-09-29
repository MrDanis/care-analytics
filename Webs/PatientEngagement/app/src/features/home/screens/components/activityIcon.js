import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
// import {Fonts} from '../../../../../config/AppConfig';
import {Images} from '../../../../../config';
import {baseUrl, Fonts} from '../../../../../config/AppConfig';
import colors from '../../../../../config/Colors';
import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import VitalsScreen from '../../../mycare/screens/VitalsScreen';
import images from '../../../../../config/Images';
import {SvgCssUri} from 'react-native-svg';

const ActivityIcon = ({
  id,
  backgroundColor,
  imageSource,
  text,
  onPress,
  navigation,
  healthKitData,
  distanceWalked,
  activityData,
  calculatedSpeed,
  stepHealth,
  heartHealth,
  sleepHealth,
}) => {
  console.log('====================================');
  console.log('activityData', activityData);
  console.log('====================================');
  console.log('hear rate comming from the homeScreen is ',heartHealth)
  console.log('This is the id and name' + id + text);
  console.log('Steps from the health kit are : ', healthKitData);
  return text === 'Add More' ? (
    <Pressable
      style={{marginBottom: hp(1)}}
      onPress={() => {
        // Medications
        navigation.navigate('DiscoverScreen');
      }}>
      <View
        style={{
          alignItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          paddingRight: hp(2),
          // paddingLeft: hp(1),
          height: hp(8.2),
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            height: hp(8.2),
            backgroundColor: backgroundColor,
            width: hp(8.2),
            borderRadius: hp(2),
            borderColor: colors.darkgrey,
            borderWidth: 1.2,
            borderStyle: 'dashed',
            justifyContent: 'center',
          }}>
          <FastImage
            resizeMode="contain"
            style={{
              width: 30,
              height: 45,
            }}
            source={
              // uri: baseUrl + '/' + imageSource,
              Images.addIcon_dashboard
            }
          />
        </View>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.6),
            color: colors.black4,
            marginTop: hp(2.2),
            marginBottom: hp(1.1),
          }}>
          {text}
        </Text>
      </View>
    </Pressable>
  ) : text === 'Heart' ? (
    <Pressable
      onPress={() => {
        // Medications
        console.log('');
        // navigation.navigate('MeasureVitals', {vitalsData: vitalData});
        navigation.navigate('HeartCounter', {
          navigation: navigation,
          id: id,
          item: activityData,
          heartRate: heartHealth,
        });
      }}>
      <View
        style={{
          alignItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          paddingRight: hp(2),
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            height: hp(8.2),
            backgroundColor: backgroundColor,
            width: hp(8.2),
            borderRadius: hp(2),
            justifyContent: 'center',
          }}>
          {console.log('Value of the heart before sending to the next ',heartHealth)}
          {/* <FastImage
            resizeMode="contain"
            style={{
              width: 40,
              height: 45,
            }}
            source={{uri: baseUrl + '/' + imageSource}}
          /> */}
          <SvgCssUri
            width={40}
            height={45}
            uri={imageSource + '?' + new Date()}
            fill={backgroundColor}
            // style={{
            //   marginTop: vitalData.isCritical ? hp(-2) : null,
            //   marginBottom: vitalData.isCritical ? hp(2) : null,
            //   marginVertical: vitalData.isCritical ? 0 : hp(3),
            // }}
          />
        </View>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.6),
            color: colors.black4,
            marginTop: hp(2.2),
            marginBottom: hp(1.1),
          }}>
          {text}
        </Text>
      </View>
    </Pressable>
  ) : text === 'Sleep Monitor' ? (
    <Pressable
      onPress={() => {
        // Medications
        console.log('Inside Sleep Monitor');
        // navigation.navigate('MeasureVitals', {vitalsData: vitalData});
        // navigation.navigate('HeartCounter', {navigation: navigation});

        navigation.navigate('SleepCounter', {
          navigation: navigation,
          id: id,
          sleepGoal: activityData?.patientGoal,
          sleepValue: activityData.value,
          sleepDuration:sleepHealth
        });
      }}>
      <View
        style={{
          alignItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          paddingRight: hp(2),
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            height: hp(8.2),
            backgroundColor: backgroundColor,
            width: hp(8.2),
            borderRadius: hp(2),

            justifyContent: 'center',
          }}>
          {/* <FastImage
            resizeMode="contain"
            style={{
              width: 40,
              height: 45,
            }}
            source={{uri: baseUrl + '/' + imageSource}}
          /> */}
          <SvgCssUri
            width={40}
            height={45}
            uri={imageSource + '?' + new Date()}
            fill={backgroundColor}
            // style={{
            //   marginTop: vitalData.isCritical ? hp(-2) : null,
            //   marginBottom: vitalData.isCritical ? hp(2) : null,
            //   marginVertical: vitalData.isCritical ? 0 : hp(3),
            // }}
          />
        </View>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.6),
            color: colors.black4,
            marginTop: hp(2.2),
            marginBottom: hp(1.1),
          }}>
          {text}
        </Text>
      </View>
    </Pressable>
  ) : text === 'Symptoms' ? (
    <Pressable
      onPress={() => {
        // Medications
        console.log('Inside Sleep Monitor');
        // navigation.navigate('MeasureVitals', {vitalsData: vitalData});
        // navigation.navigate('HeartCounter', {navigation: navigation});

        navigation.navigate('SymptomsStack', {navigation: navigation});
      }}>
      <View
        style={{
          alignItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          paddingRight: hp(2),
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            height: hp(8.2),
            backgroundColor: backgroundColor,
            width: hp(8.2),
            borderRadius: hp(2),

            justifyContent: 'center',
          }}>
          {/* <FastImage
            resizeMode="contain"
            style={{
              width: 40,
              height: 45,
            }}
            source={{uri: baseUrl + '/' + imageSource}}
          /> */}
          <SvgCssUri
            width={40}
            height={45}
            uri={imageSource + '?' + new Date()}
            fill={backgroundColor}
            // style={{
            //   marginTop: vitalData.isCritical ? hp(-2) : null,
            //   marginBottom: vitalData.isCritical ? hp(2) : null,
            //   marginVertical: vitalData.isCritical ? 0 : hp(3),
            // }}
          />
        </View>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.6),
            color: colors.black4,
            marginTop: hp(2.2),
            marginBottom: hp(1.1),
          }}>
          {text}
        </Text>
      </View>
    </Pressable>
  ) : (
    <Pressable
      style={{
        marginBottom: hp(1),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: hp(1),
      }}
      onPress={() => {
        console.log(
          navigation,
          id,
          healthKitData,
          activityData,
          distanceWalked,
        );
        // Medications
        // console.log('This is StepID in activityIcon ' + id,'and steps record is : '+healthKitData);
        // navigation.navigate('StepCounter', {navigation: navigation, id: id, stepsTakenToday: healthKitData.stepsTakenToday});
        navigation.navigate('StepCounter', {
          navigation: navigation,
          id: id,
          stepsTakenToday: healthKitData,
          item: activityData,
          dsstanceCoverd: Math.ceil(distanceWalked),
          speed: calculatedSpeed,
          stepCount: stepHealth,
        });
      }}>
      <View
        style={{
          alignContent: 'center',
          alignItems: 'center',
          height: hp(8.2),
          backgroundColor: backgroundColor,
          width: hp(8.2),
          borderRadius: hp(2),
          justifyContent: 'center',
        }}>
        <SvgCssUri
          width={40}
          height={45}
          uri={imageSource + '?' + new Date()}
          fill={backgroundColor}
          // style={{
          //   marginTop: vitalData.isCritical ? hp(-2) : null,
          //   marginBottom: vitalData.isCritical ? hp(2) : null,
          //   marginVertical: vitalData.isCritical ? 0 : hp(3),
          // }}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: hp(11),
        }}>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.6),
            color: colors.black4,
            marginTop: hp(2.2),
            // width: hp(12),
            // textAlign: 'center',
          }}
          numberOfLines={1}>
          {text}{console.log('Steps from the health kit are : ',healthKitData)}
        </Text>
      </View>
    </Pressable>
  );
};

export default ActivityIcon;

const styles = StyleSheet.create({});
