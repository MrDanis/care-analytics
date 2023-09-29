import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  BackHandler,
  Alert,
  StatusBar,
  Platform,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
// import { getTodaySteps } from '../../../helpers/GoogleFit/GoogleFitHandler';
// import Divider from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors, Images, Svgs} from '../../../../config';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {baseUrl, CURRENT_TARGET, Fonts} from '../../../../config/AppConfig';
import {
  getStepCountFromHK,
  getDistanceWalkingFromHK,
  getHeartRateHK,
  getSleepSamplesHK,
} from '../../../helpers/HealthKit/HealthKitHandler';
import HomeService from '../../../api/home';
import {getHomeApiData} from '../action';
import {connect, useDispatch, useSelector} from 'react-redux';
import {getAppLogoutTime} from '../../bluebutton/action';
import ProfileService from '../../../api/profile';
import {getUserProfile} from '../../profile/action';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../../../config/Colors';
import {getDayTime, saveTokens} from '../../../helpers/Common';
import {startSignalR} from '../../../helpers/signalR/SignalRService';
import {NavigationHelper} from '../../../helpers/NavigationHelper';
import {messageListener} from '../../../helpers/NotificationHelper';

import startPushKit from '../../../helpers/PushKit/PushKitHelper';
import ActivitiesHeadingComponent from './components/activities_heaading_component';
import ActivityIcon from './components/activityIcon';
import {CallStatus, TwilioHelper} from '../../../helpers/Twilio/TwilioHelper';

import AcoMidTabBar from './components/aco_midtab_bar';
import NonAcoMidTabBar from './components/non_aco_midtab_bar';
import DiscoverService from '../../../api/discover';
import {useFocusEffect} from '@react-navigation/native';
import ShortcutCards from './components/shortcuts_card';
import images from '../../../../config/Images';
import {getDiscoverData} from '../../discover/action';

// import {SvgCss} from 'react-native-svg';
import CameraScreen from './components/CameraScreen';
import TakePicModalize from './components/TakePicModalize';
import {Modalize} from 'react-native-modalize';
import UploadResultModal from '../../imaging&Radiology/components/uploadResultModal';
import {modalHanlder} from '../../medication/actions';

import moment from 'moment';
import {
  setDistanceLive,
  setSpeedLive,
  setStepsLive,
} from '../../welcome/action';
import {
  startGoogleFit,
  checkGoogleFitAppInstalled,
} from '../../../helpers/GoogleFit/GoogleFitHandler';
import {
  getTodaySteps,
  getWeightFromGoogleFit,
} from '../../../helpers/GoogleFit/GoogleFitHandler';
import {isAuthorizedFromGoogleFit} from '../../welcome/action';
// import NewCamraScreen from './components/NewCamraScreen';
// const ActivityList = InitialActivityList;

const HomeScreen = props => {
  navigationHelper: NavigationHelper;
  twilioHelper: TwilioHelper;
  NavigationHelper.sharedInstance().navigation = props.navigation;
  messageListener();
  const twilio = TwilioHelper.sharedInstance();
  const dispatch = useDispatch();
  const [isAco, setAco] = useState(true);
  const [loader, setLoader] = useState(false);
  const [isCamera, setIsCamera] = useState(false);
  const [isLabModal, setIsLabModal] = useState(false);
  const [barCodeData, setBarCodeData] = useState(null);
  const [testName, setTestName] = useState('');
  const [labName, setLabName] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState(null);
  const [size, setSize] = useState(null);
  const [lastPhoto, setLastPhoto] = useState(null);
  const [imageObject, setImageObject] = useState(null);
  const [time, setTime] = useState(null);
  const [heartRateHealthKit, setHeartRateHealthKit] = useState(0);
  const [stepCountHealthKit, setStepCountHealthKit] = useState(0);
  const [sleepDurationHealthKit,setSleepDurationHealthKit] = useState("");
  const userProfileData = useSelector(state => state.userProfileData);
  const homaApiData = useSelector(state => state.homeApiData);
  const takePicModalizeRef = useRef(null);
  const imagingModalizeRef = useRef(null);
  const labModalizeRef = useRef(null);

  // const [stepsLive, setstepsLive] = useState(null);
  // const [distanceLive, setdistanceLive] = useState(null);

  const stepsLiveRD = useSelector(state => state?.liveStepsData);
  const distanceLiveRD = useSelector(state => state?.liveDistanceData);
  const speedLiveRD = useSelector(state => state?.liveSpeedData);
  const isAuthorizeFromFit = useSelector(state => state?.authFromFit);
  const heartLiveRD = useSelector(state => state?.liveHeartData)
  // const healthKitData = {stepsTakenToday: stepsLive};

  var plusIcon = {
    icon: images.addIcon_dashboard,
    // id: 300,
    isActive: true,
    name: 'Add More',
    // textColor: '#39C736',
    tileColor: colors.blueGrayDisableBG,
    value: null,
  };
  const [dashActivityItem, setdashActivityItem] = useState([plusIcon]);
  const [shortCutsItem, setshortCutsItem] = useState([
    {image: Images.shortcut_pillRefill, text: 'Refill', id: 0},
    {image: Images.shortcut_takePicture, text: 'Take Pic', id: 2},
    {image: Images.shortcut_pillDiscount, text: 'Discounts', id: 1},
    {image: Images.shortcut_urgentCare, text: 'Urgent Care', id: 3},
  ]);
  // const barData = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];

  const getCategoryDataHome = () => {
    setLoader(true);
    DiscoverService.getCategories()
      .then(response => {
        setLoader(false);
        console.log('changeDashboardStatus');
        console.log(response.data);
        if (response && response.statusCode === 200) {
          let newList = [];
          let dashList = response.data.healthCategories.filter(
            item => item.isActive === true,
          );
          console.log('this is dashList');
          console.log(dashList);
          // setdashActivityItem(dashList);
          newList = [...dashList, plusIcon];
          setdashActivityItem(newList);
          dispatch(getDiscoverData(response.data));
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('getCategories Error');
        console.log(err);
      });
  };

  console.log('====================================');
  console.log(
    'image path',
    baseUrl + '/' + userProfileData.imagePath + '?' + new Date(),
  );
  console.log('====================================');
  console.log('THIS IS REDUX STEPS LIVE' + stepsLiveRD);
  console.log('THIS IS REDUX DISTANCE LIVE' + distanceLiveRD);
  console.log('THIS IS REDUX SPEED LIVE' + speedLiveRD);

  useEffect(() => {
    setHeartRateHealthKit(heartLiveRD)
    fetchData();
    if (Platform.OS === 'ios') {
      startPushKit();
    }
    HomeService.getHomeApi()
      .then(response => {
        console.log('getHomeApi');
        console.log(response);
        setLoader(false);
        if (response) {
          global.isPatientTouch = response.data.common?.isPatientTouchEnabled;
          setAco(response.data.common?.isPatientTouchEnabled);
          props.dispatch(getHomeApiData(response.data));
          startSignalR(response.data, props);
          console.log('APpLogoutTime', response.data.appLogoutTime);
          const timer = 60000 * response.data.appLogoutTime;
          props.dispatch(getAppLogoutTime(timer));
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('getHomeApi Error');
        console.log(err);
      });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log('logger from use fokus from home screen ran');
      getStepCountFromHK()
        .then(results => {
          // Handle the resolved results here
          console.log('Received results home screen from steps:', results);
          console.log('Setting the steps in the action');
          // dispatch(setStepsLive(results.value));
          setStepCountHealthKit(results.value);
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
          console.log('Received results from home screen heart:', results[0]);
          console.log('Setting the steps in the action');
          // dispatch(setHeartLive(results[0]));
          setHeartRateHealthKit(results[0]?.value);
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
          setSleepDurationHealthKit(timeOfSleep)
          console.log('Hours:', hours);
          console.log('Minutes:', minutes);
          console.log("duration of sleep",timeOfSleep)
          console.log('Formatted Start Time:', formattedStartTime);
          console.log('Formatted End Time:', formattedEndTime);

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
    }, []),
  );
  const fetchData = async () => {
    // console.log('Fetch data is called.....');
    // console.log('Platform is : ',Platform.OS)
    try {
      console.log('Here in try catch');
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
      } else {
        console.log('Come here in else for the android : ', Platform.OS);
        getTodaySteps().then(res => {
          console.log('Steps comming from the google fit is ', res);
          console.log(
            'Steps comming from the google fit is : ',
            res?.res[2].steps[0].value,
          );
          if (res?.res[2]?.steps.length > 0) {
            // dispatch the livesteps function
            console.log('dispatching the event with steps value');
            dispatch(setStepsLive(res?.res[2].steps[0].value));
          } else {
            console.log('dispatching the event with the 0 value');
            dispatch(setStepsLive(0));
            //  dispatch it with the 0 value
          }
        });
        // startGoogleFit();
        // checkGoogleFitAppInstalled();
        //  startGoogleFit();
        //  console.log('is Google fit is : ',isGoogleFitStart);
        // getTodaySteps().then((res)=>{
        //   console.log('Response comming back from the google fit is :',res)
        //   if(res.auth){
        //     dispatch(isAuthorizedFromGoogleFit(res?.auth));
        //   }
        // });

        console.log('Is authorize from the fit : ', isAuthorizeFromFit);
        // getTodaySteps().then(res => {
        //   console.log('Response Comming from the data google fit is :',res);
        //   // if (res[1].steps.length === 0) {
        //   //   //dispatch an action and set the steps speed and distance equall to 0
        //   //   dispatch(setStepsLive(0));
        //   //   dispatch(setDistanceLive(0));
        //   //   dispatch(setSpeedLive(0));
        //   // } else {
        //   //   let todaySteps = parseInt(
        //   //     res[1].steps[res[1].steps.length - 1].value,
        //   //   );
        //   //   console.log('Steps of the day are : ', todaySteps);
        //   //   dispatch(setStepsLive(todaySteps));
        //   // }
        // });
        // getWeightFromGoogleFit().then(res => {
        //   console.log('====================================');
        //   console.log('res getWeightFromGoogleFit', res);
        //   console.log('====================================');
        //   // if (res[1].steps.length === 0) {
        //   //   //dispatch an action and set the steps speed and distance equall to 0
        //   //   dispatch(setStepsLive(0));
        //   //   dispatch(setDistanceLive(0));
        //   //   dispatch(setSpeedLive(0));
        //   // } else {
        //   //   let todaySteps = parseInt(
        //   //     res[1].steps[res[1].steps.length - 1].value,
        //   //   );
        //   //   console.log('Steps of the day are : ', todaySteps);
        //   //   dispatch(setStepsLive(todaySteps));
        //   // }
        // });
      }
    } catch {
      console.error('Some Catch error came' + error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // fetchData();
      // dispatch(modalHanlder(true));
      // dispatch(modalHanlder(true));
      console.log('I am focussed on the screen......');
      setLoader(true);
      ProfileService.getUserProfile()
        .then(response => {
          console.log('getUserProfile');
          console.log(response);
          if (response && response.statusCode === 200) {
            setLoader(false);
            saveTokens(response.data);
            // setPatientData(response.data);
            dispatch(getUserProfile(response.data));
          }
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
        });

      setLoader(true);
      DiscoverService.getCategories()
        .then(response => {
          setLoader(false);

          console.log('changeDashboardStatus');
          console.log(response.data, response);
          if (response && response.statusCode === 200) {
            let dashList = response?.data?.healthCategories?.filter(
              item => item.isActive === true,
            );
            console.log('this is dashList length');
            console.log(dashList.length);
            // setdashActivityItem(dashList);
            if (dashList?.length < 5) {
              newList = [...dashList, plusIcon];
            } else {
              newList = [...dashList, plusIcon];
            }
            setdashActivityItem(newList);
            dispatch(getDiscoverData(response.data));
          }
        })
        .catch(err => {
          setLoader(false);
          console.log('getCategories Error');
          console.log(err);
        });
      // dispatch(modalHanlder(true));
    }, []),
  );

  // const getDayTimeFun = () => {
  //   const currentTime = moment(new Date()).format('hh:mm A');
  //   console.log('====================================');
  //   console.log('getDayTime(currentTime)', getDayTime(currentTime));
  //   console.log('====================================');
  //   if (getDayTime(currentTime) === DayTime.MORNING) {
  //     setTime('0');
  //     console.log('====================================');
  //     console.log('getDayTime(currentTime)', getDayTime(currentTime));
  //     console.log('====================================');
  //   } else if (getDayTime(currentTime) === DayTime.NOON) {
  //     setTime('1');
  //     console.log('====================================');
  //     console.log('getDayTime(currentTime)', getDayTime(currentTime));
  //     console.log('====================================');
  //   } else if (getDayTime(currentTime) === DayTime.EVENING) {
  //     setTime('2');
  //     console.log('====================================');
  //     console.log('getDayTime(currentTime)', getDayTime(currentTime));
  //     console.log('====================================');
  //   } else if (getDayTime(currentTime) === DayTime.NIGHT) {
  //     setTime('3');
  //     console.log('====================================');
  //     console.log('getDayTime(currentTime)', getDayTime(currentTime));
  //     console.log('====================================');
  //   }
  // };

  function onOpenTakePic() {
    takePicModalizeRef.current?.open();
  }

  function onCloseTakePic() {
    // dispatch(modalHanlder(false));
    handleOusidePress(false);
    takePicModalizeRef.current?.close();
  }

  function onOpenLabModal() {
    labModalizeRef.current?.open();
    console.log('====================================');
    console.log('open');
    console.log('====================================');
  }

  function onCloseLabModal() {
    labModalizeRef.current?.close();
    setTestName('');
    setDescription('');
    setImageObject(null);
  }

  function onOpenImagingModal() {
    imagingModalizeRef.current?.open();
    console.log('====================================');
    console.log('open');
    console.log('====================================');
  }

  function onCloseImagingModal() {
    imagingModalizeRef.current?.close();
    setTestName('');
    setDescription('');
    setImageObject(null);
  }
  const clearStoreData = () => {
    props.dispatch(getMedicationHistory([]));
    props.dispatch(getProviderHistory([]));
    props.dispatch(getHospitalVisitHistory([]));
    props.dispatch(getDiseasesHistory([]));
    props.dispatch(getCoverageHistory([]));
    props.dispatch(getAllergiesHistory([]));
    props.dispatch(getProceduresHistory([]));
    props.dispatch(getHomeApiData({}));
  };

  const handleOusidePress = type => {
    console.log('You press outside the modal Screen   ', type);
    if (type) {
      console.log('Outside call......');
      dispatch(modalHanlder(true));
    }
  };
  return (
    <>
      <Modalize
        ref={imagingModalizeRef}
        withHandle={false}
        adjustToContentHeight
        onClosed={() => {
          console.log('====================================');
          console.log('onClosed modal');
          console.log('====================================');
          dispatch(modalHanlder(true));
        }}
        modalStyle={{
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          minHeight: '90%',
          backgroundColor: Colors.white,
        }}>
        <UploadResultModal
          onClose={onCloseImagingModal}
          onOpen={onOpenImagingModal}
          testName={testName}
          description={description}
          setTestName={setTestName}
          setDescription={setDescription}
          imageObject={imageObject}
          setImageObject={setImageObject}
          isLab={false}
          setLoader={setLoader}
          navigation={props.navigation}

          // imagingGetData={imagingGetData}
        />
      </Modalize>
      <Modalize
        ref={labModalizeRef}
        withHandle={false}
        adjustToContentHeight
        onClosed={() => {
          console.log('====================================');
          console.log('onClosed modal');
          console.log('====================================');
          dispatch(modalHanlder(true));
        }}
        modalStyle={{
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          minHeight: '90%',
          backgroundColor: Colors.white,
        }}>
        <UploadResultModal
          onClose={onCloseLabModal}
          onOpen={onOpenLabModal}
          testName={testName}
          labName={labName}
          setLabName={setLabName}
          description={description}
          setTestName={setTestName}
          setDescription={setDescription}
          imageObject={imageObject}
          setImageObject={setImageObject}
          isLab={true}
          setLoader={setLoader}
          navigation={props.navigation}
          // labsGetData={labsGetData}
        />
      </Modalize>
      <Modalize
        ref={takePicModalizeRef}
        withHandle={false}
        adjustToContentHeight
        onOverlayPress={() => {
          handleOusidePress(true);
        }}
        // onClose={()=>{handleOusidePress('outside')}}
        // onClose={()=>{
        //   dispatch(modalHanlder(true))
        // }}
        // onClosed={() => {
        //   console.log('====================================');
        //   console.log('onClosed modal');
        //   console.log('====================================');
        //   dispatch(modalHanlder(true));
        // }}
        modalStyle={{
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          backgroundColor: Colors.white,
          minHeight: '30%',
        }}>
        <TakePicModalize
          onCloseTakePic={onCloseTakePic}
          onOpenTakePic={onOpenTakePic}
          onOpenLabModal={onOpenLabModal}
          onOpenImagingModal={onOpenImagingModal}
          imageData={setImageObject}
        />
      </Modalize>
      {/* <SafeAreaView style={{backgroundColor: Colors.BgColor, flex: 1}}> */}
      {!isCamera ? (
        <>
          <View
            style={{
              // alignItems: 'center',
              // justifyContent: 'center',
              flexDirection: 'column',
              paddingTop: Platform.OS === 'ios' ? hp(6) : 0,
              backgroundColor: Colors.BgColor,
            }}>
            {twilio.currentCallStatus === CallStatus.CONNECTED ? (
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('CallUI');
                }}
                style={{
                  // zIndex: 1111,
                  // position: 'absolute',
                  // flex: 1,
                  width: '100%',
                }}>
                <View
                  style={{
                    height: hp(5),
                    // flex: 1,
                    // minWidth: '100%',

                    backgroundColor: Colors.greenCallHandler,

                    // zIndex: 1111,

                    display: 'flex',

                    flexDirection: 'row',

                    alignItems: 'center',

                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Colors.white,

                      fontFamily: Fonts.SourceSansSemibold,

                      fontSize: hp(2),
                    }}>
                    Tap To Return To Call
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{paddingLeft: hp(1)}}>
                {userProfileData.imagePath !== null &&
                userProfileData.imagePath !== '' ? (
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('ProfileStack')}>
                    <FastImage
                      style={{
                        width: hp(5),
                        height: hp(5),
                        marginLeft: hp(1),
                        borderRadius: 10,
                      }}
                      source={{
                        uri:
                          baseUrl +
                          '/' +
                          userProfileData.imagePath +
                          '?' +
                          new Date(),
                        priority: FastImage.priority.high,
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('ProfileStack')}>
                    <FastImage
                      style={{
                        width: hp(5),
                        height: hp(5),
                        borderRadius: 10,
                        marginLeft: hp(1),
                      }}
                      resizeMode="contain"
                      source={require('../../../../../assets/images/user_logo.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  // flex: 0.5,
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.splashForegroundLogo}
                  style={{
                    height: hp(9),
                    width: hp(15),
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('NotificationStack')
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <FastImage
                      style={{
                        width: hp(2),
                        height: hp(2.5),
                        // marginRight:-20,
                        marginHorizontal: hp(1.5),
                        // marginTop:10,
                      }}
                      source={Images.notification_dashboard}
                    />
                    {/* <TouchableOpacity>
                    <SvgCss
                      xml={Svgs.settings_Icon}
                      width={hp(2.2)}
                      height={hp(2.3)}
                      fill={Colors.black}
                      onPress={() => props.navigation.pop()}
                      style={{marginHorizontal: hp(1.5)}}
                    />
                  </TouchableOpacity> */}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: Colors.BgColor,
            }}>
            <StatusBar
              backgroundColor={Colors.BgColor}
              barStyle="dark-content"
              hidden={false}
            />
            <Spinner
              visible={loader}
              textContent={'Loading...'}
              textStyle={{color: '#FFF'}}
            />
            {/* here starts the activities */}
            <View>
              <View style={styles.isIosActivityBox}>
                <ActivitiesHeadingComponent
                  stepsTaken={stepsLiveRD}
                  distanceWalked={distanceLiveRD}
                  stepHealth={stepCountHealthKit}
                />
                <View
                  style={{
                    marginHorizontal: hp(1.7),
                    marginBottom: hp(1.5),
                  }}>
                  <ScrollView
                    style={{}}
                    scrollEnabled={dashActivityItem.length <= 2 ? false : true}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}>
                    {dashActivityItem?.map((item, index) => (
                      <ActivityIcon
                        navigation={props.navigation}
                        backgroundColor={item.tileColor}
                        id={item.id}
                        key={item.id}
                        healthKitData={stepsLiveRD}
                        heartHealth={heartRateHealthKit=== undefined ? parseInt(item?.value):heartRateHealthKit} //this check is added by danish in case if the heartrate is not comming from the health kit. In this case we will send the value comming from the api other wise health kit heart rate is transfer
                        stepHealth={stepCountHealthKit}
                        sleepHealth={sleepDurationHealthKit}
                        activityData={item}
                        // imageSource={item.imageSiconource}
                        imageSource={
                          // CURRENT_TARGET + '/' + item.icon + '?' + new Date(),
                          item.icon
                          // 'https://pre-release.wmi360.com/360PatientEngagement/HealthCategories/body_measurement.png'
                        }
                        text={item.name}
                        distanceWalked={distanceLiveRD}
                        calculatedSpeed={speedLiveRD}
                      />
                    ))}
                  </ScrollView>
                </View>
                {console.log('Home api data for the ',dashActivityItem,'healthkit hearty value : ',heartRateHealthKit)}
              </View>

              <View style={styles.isIosShortCut}>
                <ScrollView
                  contentContainerStyle={{
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  horizontal={true}>
                  {shortCutsItem?.map((item, index) => (
                    <ShortcutCards
                      // backgroundColor={Colors.transparent}
                      // imageSource={item.imageSiconource}
                      imageSource={item.image}
                      text={item.text}
                      id={item.id}
                      navigation={props.navigation}
                      setIsCamera={setIsCamera}
                      isCamera={isCamera}
                      dispatch={dispatch}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
            {/* </View> */}

            {isAco === true ? (
              <AcoMidTabBar navigation={props.navigation} />
            ) : (
              <NonAcoMidTabBar navigation={props.navigation} />
            )}
          </ScrollView>
        </>
      ) : (
        <CameraScreen
          isCamera={isCamera}
          setIsCamera={setIsCamera}
          navigation={props.navigation}
          dispatch={dispatch}
          // barCodeData={barCodeData}
          origin={origin}
          size={size}
          setOrigin={setOrigin}
          setSize={setSize}
          setBarCodeData={setBarCodeData}
          lastPhoto={lastPhoto}
          setLastPhoto={setLastPhoto}
          setImageObject={setImageObject}
          onOpenTakePic={onOpenTakePic}
          onCloseTakePic={onCloseTakePic}
        />
      )}
      {/* </SafeAreaView> */}
    </>
  );
};

export default connect()(HomeScreen);

const styles = StyleSheet.create({
  isIosActivityBox: {
    marginTop: hp(1),
    borderColor: colors.line,
    borderRadius: hp(1),
    borderBottomWidth: 1,
    // borderTopColor: colors.line,
    borderWidth: 0.3,
    elevation: 2,
    // borderBottomWidth: 1,
    backgroundColor: colors.white,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '94%',
    alignSelf: 'center',
  },
  isAndroidActivityBox: {
    marginLeft: hp(1.7),
    marginRight: hp(1.7),
    marginTop: hp(3),
    borderColor: colors.line,
    borderRadius: hp(1),
    borderBottomWidth: 1,
    // borderTopColor: colors.line,
    borderWidth: 0.3,
    elevation: 2,
    // borderBottomWidth: 1,
    backgroundColor: colors.white,
  },
  isIosShortCut: {
    marginTop: hp(2.5),
    borderColor: colors.line,
    borderRadius: hp(1),
    paddingVertical: hp(1.5),
    borderWidth: 0.3,
    elevation: 5,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '94%',
    alignSelf: 'center',
  },
  isAndroidShortCut: {
    marginLeft: hp(1.7),
    marginRight: hp(1.7),
    marginTop: hp(2.5),
    borderColor: colors.line,
    borderRadius: hp(1),
    paddingVertical: hp(1),
    paddingLeft: hp(4.0),
    // borderTopColor: colors.line,
    borderWidth: 0.3,
    elevation: 2,
    borderBottomWidth: 0.5,
    backgroundColor: colors.white,
  },
  imageStyle: {
    width: 27,
    height: 27,
  },
  textStyle: {
    color: Colors.noRecordFound,
    alignItems: 'center',
    alignContent: 'center',
    fontFamily: Fonts.SourceSansRegular,
    fontSize: hp(1.7),
  },
});
