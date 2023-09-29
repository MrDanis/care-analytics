import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {CURRENT_TARGET, Fonts} from '../../../../config/AppConfig';
import StepsIcon from '../../../../../assets/svg/stepsIcon.svg';
import GlassIcon from '../../../../../assets/svg/glassIcon.svg';
import ActivitiesIcon from '../../../../../assets/svg/activities.svg';
import TrophyIcon from '../../../../../assets/svg/icon_trophy.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeService from '../../../api/home';
import {getHomeApiData} from '../action';
import {connect, useDispatch, useSelector} from 'react-redux';
import {getAppLogoutTime} from '../../bluebutton/action';
import Moment from 'moment';
import ProfileService from '../../../api/profile';
import {getUserProfile} from '../../profile/action';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../../../config/Colors';
import moment from 'moment';

const Modules = [
  {
    title: 'Steps',
    icon: <StepsIcon />,
    quantity: '9,890',
    time: 'last update 3m',
  },
  {
    title: 'Water Intake',
    icon: <GlassIcon />,
    quantity: '3 Glasses',
    time: 'last update 1h',
  },
  {
    title: 'Sleep',
    icon: <StepsIcon />,
    quantity: '5hr 15min',
    time: 'Avg. time in bed',
  },
];
const DiscoverActiveScreen = props => {
  const [loader, setLoader] = useState(false);
  const userProfileData = useSelector(state => state.userProfileData);
  // const [userProfileData, setPatientData] = useState(userProfileData);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoader(true);
    ProfileService.getUserProfile()
      .then(response => {
        console.log('getUserProfile');
        console.log(response);
        if (response && response.statusCode === 200) {
          setLoader(false);
          // setPatientData(response.data);
          dispatch(getUserProfile(response.data));
        }
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
    let willFocusSubscription = props.navigation.addListener(
      'willFocus',
      () => {
        console.log('will focus called');
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
        return;
      },
    );
    let unsubscribe2 = props.navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      console.log('Screen is unfocused');
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      unsubscribe2.remove();
      willFocusSubscription.remove();
    };
  }, []);

  useEffect(() => {
    HomeService.getHomeApi()
      .then(response => {
        console.log('getHomeApi');
        console.log(response);
        if (response) {
          props.dispatch(getHomeApiData(response.data));
          console.log('APpLogoutTime', response.data.appLogoutTime);
          const timer = 60000 * response.data.appLogoutTime;
          props.dispatch(getAppLogoutTime(timer));
        }
      })
      .catch(err => {
        console.log('getHomeApi Error');
        console.log(err);
      });
  }, []);
  function getAge(dateString: string) {
    console.log('====================================');
    console.log(
      'date',
      moment(new Date(userProfileData.dateOfBirth)).format('YYYY-MM-DD'),
    );
    console.log('====================================');
    const date = moment(new Date(userProfileData.dateOfBirth)).format(
      'YYYY-MM-DD',
    );
    const years = moment().diff(date, 'years');
    console.log('====================================');
    console.log('years', years);
    console.log('====================================');
    // const days = moment().diff(date.add(years, 'years'), 'days', false);
    // return { years,days }
    return years + 'yrs';
  }
  function handleBackButtonClick() {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to exit app?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {
            AsyncStorage.clear();
            props.navigation.navigate('LoginScreen');
            // const resetAction = StackActions.reset({
            //     index: 0,
            //     actions: [NavigationActions.navigate({routeName: 'LoginScreen'})],
            // });
            // props.navigation.dispatch(resetAction);
          },
        },
      ], // open store if update is needed.
    );
    return true;
  }

  return (
    <SafeAreaView
      style={{flex: 1, height: '100%', backgroundColor: Colors.backgroundMain}}>
      <ScrollView style={{flex: 1}}>
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <View
          style={{
            flex: 1,
            maxWidth: '90%',
            minWidth: '90%',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: hp(1),
            }}>
            {userProfileData.imagePath !== null &&
            userProfileData.imagePath !== '' ? (
              <FastImage
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  marginVertical: hp(3),
                }}
                source={{
                  uri:
                    CURRENT_TARGET +
                    '/' +
                    userProfileData.imagePath +
                    '?' +
                    new Date(),
                  priority: FastImage.priority.high,
                }}
              />
            ) : (
              <FastImage
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  marginVertical: hp(1),
                }}
                resizeMode="contain"
                source={require('../../../../../assets/images/user_logo.png')}
              />
            )}
            <View style={{marginLeft: hp(2)}}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansBold,
                  fontSize: hp(3),
                  color: colors.black4,
                  textTransform: 'capitalize',
                }}>
                {userProfileData?.firstName?.toLowerCase() +
                  ' ' +
                  userProfileData?.lastName?.toLowerCase()}
              </Text>
              <View style={{flexDirection: 'row'}}>
                {userProfileData.gender !== null &&
                  userProfileData.gender !== '' && (
                    <>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2),
                          color: colors.noRecordFound,
                        }}>
                        {userProfileData.gender === '2' ? 'Female' : 'Male'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2),
                          color: colors.noRecordFound,
                        }}>
                        {', '}
                      </Text>
                    </>
                  )}
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2),
                    color: colors.noRecordFound,
                  }}>
                  {getAge(userProfileData.dateOfBirth)}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
            {Modules.map((item, index) => {
              console.log('====================================');
              console.log('item', item);
              console.log('====================================');
              return (
                <View
                  style={{
                    minWidth: '45%',
                    backgroundColor: Colors.white,
                    height: hp(30),
                    borderRadius: 8,
                    elevation: 3,
                    margin: hp(0.5),
                    shadowOffset: {width: 0.5, height: 0.5},
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    justifyContent: 'center',
                    marginBottom: hp(2),
                  }}
                  key={index}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.5),
                      color: Colors.blueGrayDisableText,
                      marginHorizontal: hp(2),
                      paddingBottom: hp(2),
                    }}>
                    {item.title}
                  </Text>
                  <View style={{alignSelf: 'center'}}>{item.icon}</View>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(3.5),
                      color: Colors.black4,
                      paddingHorizontal: hp(2),
                      paddingTop: hp(2),
                    }}>
                    9,890
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: 17,
                      color: Colors.blueGrayDisableText,
                      paddingHorizontal: hp(2),
                    }}>
                    last update 3m
                  </Text>
                </View>
              );
            })}
            <View
              style={{
                minWidth: '45%',
                height: hp(30),
                borderRadius: 8,
                margin: hp(0.5),
                borderWidth: 1,
                borderColor: Colors.line,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansSemibold,
                  fontSize: 17,
                  color: Colors.blueGrayDisableText,
                  paddingHorizontal: hp(2),
                  paddingBottom: hp(2),
                }}>
                10+ Activities
              </Text>
              <ActivitiesIcon style={{alignSelf: 'center'}} />
              <TouchableOpacity
                // onPress={() => props.navigation.navigate('Home')}
                style={{
                  backgroundColor: Colors.blueTextColor,
                  minHeight: hp(7),
                  minWidth: hp(17),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: heightPercentageToDP(2.5),
                    color: Colors.white,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={{
            maxWidth: '86%',
            minWidth: '86%',
            minHeight: hp(40),
            borderRadius: 8,
            margin: hp(0.5),
            alignSelf:'center',
            backgroundColor: Colors.white,
          elevation: 3,
         }}>
          <ImageBackground
            source={require('../../../../../assets/images/dashboard_background_module.png')}
            resizeMode="contain"
            style={{flex:1, }}>
            <TrophyIcon  />
            <Text style={{
              fontFamily: Fonts.SourceSansSemibold,
              fontSize: 26,
              color: Colors.black4,

            }}>
              Best Records
            </Text>
            </ImageBackground>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Home')}
              style={{
                  backgroundColor:Colors.blueTextColor,
                  minHeight:hp(7),
                  minWidth:hp(17),
                  borderRadius:8,
                  justifyContent:'center',
                  alignSelf:'center'
                  }}>
                  <Text style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: heightPercentageToDP(2.5),
                      color:Colors.white
                  }}>
                      Submit
                  </Text>
              </TouchableOpacity>
          </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect()(DiscoverActiveScreen);
