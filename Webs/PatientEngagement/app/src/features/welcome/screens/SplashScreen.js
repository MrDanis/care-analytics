/* istanbul ignore file */
import React, {Fragment, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Platform,
} from 'react-native';

import Colors from '../../../../config/Colors';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import Images from '../../../../config/Images';
import WisemanIcon from '../../../../../assets/svg/Wiseman_logo_full_horizontal_colored.svg';
import {AuthCode, retrieveItem} from '../../../helpers/LocalStorage';
import ProfileService from '../../../api/profile';
import {
  getStepCountFromHK,
  getDistanceWalkingFromHK,
  getHeartRateHK,
  HealthKitPermissions,
  getSleepSamplesHK,
  getBloodPressureHK,
} from '../../../helpers/HealthKit/HealthKitHandler';
import {useDispatch} from 'react-redux';
import {setDistanceLive, setStepsLive, setSpeedLive, setHeartLive} from '../action';
import {startGoogleFit} from '../../../helpers/GoogleFit/GoogleFitHandler';
import {getTodaySteps} from '../../../helpers/GoogleFit/GoogleFitHandler';
import moment from 'moment';
function SplashScreen({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    // HealthKitPermissions();
    if (Platform.OS === 'ios') {
      // console.debug('Initiating Steps');
      console.log('In try catch for Ios is .....');
      getDistanceWalkingFromHK()
        .then(results => {
          // Handle the resolved results here
          console.log('Received distance from healthkit:', results);
          console.log('Setting the distance in the action' + results.value);
          let startTime = moment(results?.startDate);
          let endTime = moment(results?.endDate);
          let difference = Math.ceil(
            endTime.valueOf() / 1000 - startTime.valueOf() / 1000,
          ); //time in second
          let distanceCovered = Math.ceil(
            results.value / 1000 / (difference / 3600),
          ); // calculating speed into km/h for stem counter
          //console.log('Distance covered : ',results.value,'Speed to cover the distance : ',difference,'Calculated speed is  : ',Math.ceil((results.value/1000)/(difference/3600)));
          dispatch(setDistanceLive(results.value)); //distance comes
          dispatch(setSpeedLive(distanceCovered));
          console.log('Setting the DISTANCE COMPLETED CHECK NOW');

          // Do something with the results in your homeScreen component
        })
        .catch(error => {
          // Handle any errors that occurred during the execution of x() here
          console.error('Error calling x:', error);
        })
        .finally(() => {
          console.debug('came back');
        });
      getStepCountFromHK()
        .then(results => {
          // Handle the resolved results here
          console.log('Received results from x:', results);
          console.log('Setting the steps in the action');
          dispatch(setStepsLive(results.value));
          console.log('Setting the steps COMPLETED CHECK NOW');
          console.log(
            'This is the default of healthKitData',
            // healthKitData.stepsTakenToday,
          );

          // Do something with the results in your homeScreen component
        })
        .catch(error => {
          // Handle any errors that occurred during the execution of x() here
          console.error('Error calling x:', error);
        });
      getHeartRateHK()
        .then(results => {
          // Handle the resolved results here
          console.log('Received results from heart kit in splash:', results[0]);
          console.log('Setting the steps in the action');
          dispatch(setHeartLive(results[0]));
          console.log('Setting the steps COMPLETED CHECK NOW');
          console.log(
            'This is the default of healthKitData',
            // healthKitData.stepsTakenToday,
          );

          // Do something with the results in your homeScreen component
        })
        .catch(error => {
          // Handle any errors that occurred during the execution of x() here
          console.error('Error calling x:', error);
        });
        getSleepSamplesHK()
        .then(results => {
          // Handle the resolved results here
          console.log(
            'Received results from home screen sleep:',
            results[0].startDate,
          );
          const startDate = moment(results[0]?.startDate);
          const endDate = moment(results[0]?.endDate);

          // Format the startDate and endDate in AM/PM format.
          const formattedStartTime = startDate.format('h:mm A');
          const formattedEndTime = endDate.format('h:mm A');
          // to get duration of sleep
          const duration = moment.duration(endDate.diff(startDate));
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();
          const timeOfSleep = hours +"hr " + minutes + "min"
          

          // Do something with the results in your homeScreen component
        })
        .catch(error => {
          // Handle any errors that occurred during the execution of x() here
          console.error('Error calling x:', error);
        });
        getBloodPressureHK()
        .then(results => {
         console.log("the response of bp healthkit from splash",results)
          
        })
        .catch(error => {
          // Handle any errors that occurred during the execution of x() here
          console.error('Error calling x:', error);
        });
    }
    setTimeout(() => {
      retrieveItem(AuthCode).then(authCode => {
        console.log('autrhCode', authCode);
        if (authCode === undefined || authCode === null) {
          navigation.navigate('LoginScreen');
        } else {
          ProfileService.getUserProfile()
            .then(response => {
              console.log('getUserProfile in splash');
              // console.log('respondo', response);
              // console.log(this.props.userProfileData.isTokenExpired);
              if (response && response.statusCode === 200 && response.data) {
                console.log('FirstName', response.data.firstName);
                console.log('LastName', response.data.lastName);
                console.log('DOB', response.data.dateOfBirth);
                console.log('Gender', response.data.gender);
                if (
                  response.data.firstName !== '' &&
                  response.data.firstName !== null &&
                  response.data.lastName !== '' &&
                  response.data.lastName !== null &&
                  response.data.gender !== 0 &&
                  response.data.gender !== '0' &&
                  response.data.gender !== '' &&
                  response.data.gender !== null &&
                  response.data.dateOfBirth !== '01/01/1900 00:00:00' &&
                  response.data.dateOfBirth !== null &&
                  response.data.email !== '' &&
                  response.data.email !== null &&
                  response.data.phone !== '' &&
                  response.data.phone !== null
                ) {
                  navigation.navigate('HomeTab');
                } else {
                  navigation.navigate('EditProfile', {
                    profileDetails: response.data,
                    screenName: 'splash',
                  });
                }
              }
            })
            .catch(error => {
              console.log(error);
            });
          navigation.navigate('HomeTab');
        }
      });
    }, 2000);
  });

  return (
    <Fragment>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImageBackground
            source={Images.splashBackGroundImage}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              // marginTop:hp(10),
              // marginBottom: hp(10),
              marginRight: hp(6),
              height: hp(60),
              width: hp(50),
            }}
            resizeMode="contain">
            <Image
              source={Images.splashForegroundLogo}
              style={{
                marginLeft: hp(3),
                height: hp(65),
                width: hp(25),
                resizeMode: 'contain',
                alignSelf: 'center',
              }}></Image>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </Fragment>
  );
}

export default SplashScreen;
