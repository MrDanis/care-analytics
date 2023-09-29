import {
  StyleSheet,
  Text,
  View,
  DatePickerIOS,
  Alert,
  Keyboard,
} from 'react-native';
import React from 'react';
import {useState, useEffect, Fragment} from 'react';
import VitalsHeader from '../../../../mycare/components/VitalsHeader';
import MainHeader from '../../../../mycare/components/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../../../../../config/Colors';
import Button from 'reinput/src/Button';
import CustomDatePicker from './sub_components/custom_date_picker';
import {Fonts} from '../../../../../../config/AppConfig';
//import api to save the time
import ActivityService from '../../../../../api/activites';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import DiscoverService from '../../../../../api/discover';
const HealthCategoriesEditValuesScreen = ({route, navigation}) => {
  const [number, onChangeNumber] = React.useState(''); // this state is use for updating the steps goal
  const [heartRate, setheartRate] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDatePickerVisibleWakeTime, setIsDatePickerVisibleWakeTime] =
    useState(false);
  const [selectedSleepTime, setselectedSleepTime] = useState(new Date());
  const [selectedWakeTime, setselectedWakeTime] = useState(new Date());
  // Changes by Danish (Start)
  const [sleepTime, setsleepTime] = useState(
    route?.params?.changeTextTitle === 'Sleep Time'
      ? moment((route?.params?.sleepTime).trim(), 'h:mma').format('hh:mm A')
      : moment().format('hh:mm A'),
  );
  const [wakeupTime, setwakeupTime] = useState(
    route?.params?.changeTextTitle === 'Sleep Time'
      ? moment((route?.params?.wakeTime).trim(), 'h:mma').format('hh:mm A')
      : moment().format('hh:mm A'),
  );

  //const [sleepTime, setsleepTime] = useState(moment(((route?.params?.sleepTime).trim()),'h:mma').format('hh:mm A'));
  // const [wakeupTime, setwakeupTime] = useState(moment(((route?.params?.wakeTime).trim()),'h:mma').format('hh:mm A'));
  const [loader, setLoader] = useState(false);
  const [isUpdateStep, setisUpdateStep] = useState(false);
  // Changes by Danish (End)
  console.log(
    'Params are : ',
    route?.params,
    'and title is : ',
    route?.params?.changeTextTitle,
  );
  console.log(
    'Sleep time : ',
    route?.params?.sleepTime,
    'Wakeup time : ',
    route?.params?.wakeTime,
  );
  // console.log('Params are : ',route?.params,'Sleep time is :',(route?.params?.sleepTime).trim(),'Wakeup time :',(route?.params?.wakeTime).trim(),' Navigation are : ',navigation);
  // const {onChangValue, onChangValuePercant} = route.params;
  const {
    updateGoal,
    updateHaertRate,
    minHeartRate,
    maxHeartRate,
    updateSleepRoutine,
  } = route?.params;
  const {onChangValue} = route.params;
  console.log('====================================');
  console.log('data', minHeartRate, '-', maxHeartRate);
  console.log('====================================');

  const showDatePicker = () => {
    console.log('Date picker is called for setting the sleep time');
    setIsDatePickerVisible(true);
  };
  const showDatePickerWake = () => {
    setIsDatePickerVisibleWakeTime(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };
  const hideDatePickerWake = () => {
    setIsDatePickerVisibleWakeTime(false);
  };
  //  Below function is for setting the the sleep time (Start)
  const handleDateChange = newDate => {
    // console.log('SleepTime get from the modal...',newDate);
    // console.log('time in string is : ',moment(newDate).format('h:mm A'))
    console.log('Sleep time from the new package is : ', newDate);
    setsleepTime(moment(newDate).format('hh:mm A'));
    // setselectedSleepTime(newDate);
    hideDatePicker();
  };
  //  Below function is for setting the the sleep time (Start)
  const handleDateChangeWakeTime = newDate => {
    console.log('Sleep time from the new package is : ', newDate);

    setwakeupTime(moment(newDate).format('hh:mm A'));
    // setselectedWakeTime(newDate);
    hideDatePickerWake();
  };

  const handleCancel = () => {
    hideDatePicker();
  };
  const handleCancelWake = () => {
    hideDatePickerWake();
  };
  // function responsible for updating the steps counter goal(Start)
  const handleGoalUpdateAndNavigae = () => {
    console.log(
      'Latest goal that we need to send to the parent : ',
      number,
      ' and Props comming from the parents are : ',
      route.params,
    );
    if (number.replace(/\s/g, '').includes('.')) {
      Keyboard.dismiss();
      showMessage({
        message: 'Warning',
        description: 'Please provide a value without decimal number',
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.yellowHeadingColor,
        duration: 5000,
        autoHide: true,
      });
      console.log(
        'Please provide a value without decimal number :',
        number,
        'is Integer : ',
        number,
        'is Not a number : ',
        Number.isNaN(number),
      );
    } else {
      // console.log('Number is : ',number.replace(/\s/g, '').length,' Number is : ',parseInt((number.replace(/\s/g, ''))));
      let numberCheck = number.replace(/\s/g, '');
      // console.log(`Number check is :${numberCheck} and is satisfy with ${number.replace(/\s/g, '').length>0} or ${parseInt(numberCheck)>0}`);
      if (number.replace(/\s/g, '').length > 0 && parseInt(numberCheck) > 0) {
        Keyboard.dismiss();
        DiscoverService.changeCatgoalStatus(route?.params?.id, number)
          .then(res => {
            console.log('Saving step goal is : ', res?.data);
            if (res.data) {
              updateGoal(number, 0);
              setTimeout(() => {
                navigation.pop();
              }, 3000);
              showMessage({
                message: 'Goal Updated',
                description: 'Your goal is successfully updated',
                type: 'success',
                icon: {icon: 'success', position: 'left'},
                duration: 2500,
                autoHide: true,
              });
            }
          })
          .catch(err => {
            showMessage({
              message: 'Internal Server Error',
              description: 'Server is busy now',
              type: 'default',
              icon: {icon: 'info', position: 'left'},
              backgroundColor: Colors.lightYellow,
            });
          });
        // Keyboard.dismiss();
        // showMessage({
        //   message: 'Warning',
        //   description: `Provided value is : ${parseInt(number.replace(/\s/g, ''))} should be greater then 0`,
        //   type: 'default',
        //   icon: {icon: 'info', position: 'left'},
        //   backgroundColor: Colors.yellowHeadingColor,
        // });Provided value is : ${parseInt(number.replace(/\s/g, ''))} should be greater then 0
      } else {
        showMessage({
          message: 'Warning',
          description: `Provided value should be greater then 0`,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.yellowHeadingColor,
          duration: 5000,
          autoHide: true,
        });
        Keyboard.dismiss();
      }
      // console.log('Provided value for the step is : ',number);
      // Keyboard.dismiss();
      // showMessage({
      //   message: 'Success',
      //   description: `Provided value is :${parseInt(number.replace(/\s/g, ''))}`,
      //   type: 'default',
      //   icon: {icon: 'info', position: 'left'},
      //   backgroundColor: Colors.yellowHeadingColor,
      // });
      //when the number is provided in correct format check that the number must be greater then the 0
      // if (number.trim().length>0) {
      // showMessage({
      //   message: 'Success',
      //   description: 'Must call the api now..',
      //   type: 'default',
      //   icon: {icon: 'info', position: 'left'},
      //   backgroundColor: Colors.yellowHeadingColor,
      // });
      // If the goal is greater then 0 then call the api
      //   if (route?.params?.id !== null && route?.params?.id !== undefined) {
      //     DiscoverService.changeCatgoalStatus(route?.params?.id,number)
      //      .then(res => {
      //      console.log('Saving step goal is : ', res?.data);
      //      if (res.data) {
      //          updateGoal(number,0);
      //          navigation.pop();
      //        }
      //      })
      //      .catch(err => {
      //        showMessage({
      //          message: 'Internal Server Error',
      //          description: 'Server is busy now',
      //          type: 'default',
      //          icon: {icon: 'info', position: 'left'},
      //          backgroundColor: Colors.lightYellow,
      //        })
      //        // console.log('Can not update goal because of  : ', err);
      //      });
      //  } else {
      //    showMessage({
      //      message: 'Invalid Parameter',
      //      description: `Invalid catigorey ID is provided ${route?.params?.id}`,
      //      type: 'default',
      //      icon: {icon: 'error', position: 'left'},
      //      backgroundColor: Colors.red,
      //    })
      //  }
      //    navigation.pop();
      //    console.log('Number is provided in a correct format...');
      // } else
      // {
      //   Keyboard.dismiss();
      // showMessage({
      //   message: 'Warning',
      //   description: 'Goal must be greater then 0',
      //   type: 'default',
      //   icon: {icon: 'info', position: 'left'},
      //   backgroundColor: Colors.yellowHeadingColor,
      // });
      // }
    }
  };

  // Function for Saving the user Steps taken (START)
  const handleSaveSteps = async () => {
    try {
      setLoader(true);
      let payload = {
        categoryId: route?.params?.id,
        value: `${route?.params?.userSteps}`,
      };

      let saveStepsRequest = await DiscoverService.postHealthCategoryById(
        payload,
      );
      let saveStepsResponse = await saveStepsRequest;
      if (saveStepsResponse && saveStepsResponse.statusCode === 200) {
        setLoader(false);
        updateGoal(number, 1);
        navigation.pop();
      } else {
        // to handle if some thing went wrong
        setLoader(false);
        showMessage({
          message: 'Invalid Parameter',
          description: 'Invalid time is provided',
          type: 'default',
          icon: {icon: 'error', position: 'left'},
          backgroundColor: Colors.red,
        });
        console.log(
          'To handle the code for the error in the api : ',
          saveSleepResponse,
        );
      }
    } catch (error) {
      setLoader(false);
      showMessage({
        message: 'Server Error ',
        description: 'Some thing went wrong',
        type: 'default',
        icon: {icon: 'error', position: 'left'},
        backgroundColor: Colors.red,
      });
      console.log('Server error : ', error);
    }
    console.log(
      'Steps of the user from the health kit is : ',
      route?.params?.userSteps,
    );
  };
  // Function for Saving the user Steps taken (END)

  // function responsible for updating the Heartrate (Start)
  const handleUpdateHeartRateAndNavigate = () => {
    // setLoader(true);
    // Call the api here so that the data will be saved and on success it will be redirected to previous screen
    if (
      route.params.id !== null &&
      route.params.id !== undefined &&
      heartRate >= parseInt(minHeartRate) &&
      heartRate <= parseInt(maxHeartRate)
    ) {
      if (heartRate.replace(/\s/g, '').includes('.')) {
        Keyboard.dismiss();
        showMessage({
          message: 'Warning',
          description: 'Please provide a value without decimal number',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.yellowHeadingColor,
          duration: 5000,
          autoHide: true,
        });
      } else {
        let payload = {
          categoryId: route?.params?.id,
          value: heartRate,
        };
        console.log('Payload for saving the heart is : ', payload);
        DiscoverService.postHealthCategoryById(payload)
          .then(res => {
            console.log('Response of the Heart Save api is : ', res.data);
            if (res.data) {
              Keyboard.dismiss();
              updateHaertRate(heartRate);
              showMessage({
                message: 'Heart Rate Updated',
                description: 'Your heart rate is successfully updated',
                type: 'success',
                icon: {icon: 'success', position: 'left'},
                duration: 2500,
                autoHide: true,
              });
              navigation.pop();
            }
          })
          .catch(err => {
            Keyboard.dismiss();
            setLoader(false);
            console.log('Error of the Heart Save api is : ', err);
          });
      }
    } else {
      Keyboard.dismiss();
      setLoader(false);
      showMessage({
        message: 'Warning',
        description: `Heart Rate should be in the range of ${minHeartRate} - ${maxHeartRate}`,
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.yellowHeadingColor,
      });
    }
    // api end here
  };
  // Function for saving the heart rate is end......
  //  Function is responsibe for saving the Sleep Time....
  const handleSaveTime = async () => {
    let sleepTimings = `${sleepTime}-${wakeupTime}`;
    console.log(
      'Data before sending to the backend is : ',
      sleepTimings,
      route?.params?.id,
    );
    let payloaData = {
      categoryId: route?.params?.id,
      value: sleepTimings,
    };
    // console.log('Payload is : ',JSON.stringify(payloaData));
    console.log('Payload is : ', JSON.stringify(payloaData));
    console.log('user comes to : ', route?.params?.heading);
    if (route?.params?.heading === 'Add Data') {
      // updateSleepRoutine(sleepTimings);
      // navigation.pop();
      try {
        setLoader(true);
        let saveSleepDataRequest = await DiscoverService.postHealthCategoryById(
          payloaData,
        );
        let saveSleepResponse = await saveSleepDataRequest;
        if (saveSleepDataRequest && saveSleepDataRequest.statusCode === 200) {
          console.log(
            'Response after saving the sleep routine of the user ....',
            JSON.stringify(saveSleepDataRequest),
          );
          updateSleepRoutine(sleepTimings, 0);//passing this (0) because it update value
          setLoader(false);
          navigation.pop();
        } else {
          // to handle if some thing went wrong
          console.log(
            'To handle the code for the error in the api : ',
            saveSleepResponse,
          );
        }
        // console.log('response after saving the data is : ',saveSleepResponse);
      } catch (error) {
        setLoader(false);
        console.log('Server Error response is : ', error);
      }
    } else {
      try {
        setLoader(true);
        // let saveSleepDataRequest = await DiscoverService.postHealthCategoryById(payloaData);
        let saveSleepDataRequest = await DiscoverService.changeCatgoalStatus(
          route?.params?.id,
          sleepTimings,
        );
        let saveSleepResponse = await saveSleepDataRequest;
        if (saveSleepDataRequest && saveSleepDataRequest.statusCode === 200) {
          console.log(
            'Response after saving the sleep routine of the user ....',
            JSON.stringify(saveSleepDataRequest),
          );
          updateSleepRoutine(sleepTimings, 1);//passing this (1) because it update goal
          setLoader(false);
          navigation.pop();
        } else {
          // to handle if some thing went wrong
          console.log(
            'To handle the code for the error in the api : ',
            saveSleepResponse,
          );
        }
        // console.log('response after saving the data is : ',saveSleepResponse);
      } catch (error) {
        setLoader(false);
        console.log('Server Error response is : ', error);
      }
    }
    // updateSleepRoutine(sleepTimings);
    // navigation.pop();
    //  try {
    //   setLoader(true);
    //     // let saveSleepDataRequest = await DiscoverService.postHealthCategoryById(payloaData);
    //     let saveSleepDataRequest = await DiscoverService.changeCatgoalStatus(route?.params?.id,sleepTimings);
    //     let saveSleepResponse = await saveSleepDataRequest;
    //     if((saveSleepDataRequest)&&(saveSleepDataRequest.statusCode===200))
    //     {
    //       console.log('Response after saving the sleep routine of the user ....',JSON.stringify(saveSleepDataRequest));
    //       updateSleepRoutine(sleepTimings);
    //       setLoader(false);
    //       navigation.pop();
    //     }
    //     else{
    //      // to handle if some thing went wrong
    //      console.log('To handle the code for the error in the api : ',saveSleepResponse);
    //     }
    //     // console.log('response after saving the data is : ',saveSleepResponse);
    //  } catch (error) {
    //   setLoader(false);
    //   console.log('Server Error response is : ',error);
    //  }
  };

  return (
    // <View>
    //   <Text
    //     style={{
    //       alignSelf: 'center',
    //     }}>
    //     {route.params.heading}
    //   </Text>
    // </View>
    // <VitalsHeader
    //   navigation={navigation}
    //   headerName={route.params.heading}></VitalsHeader>
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <MainHeader navigation={navigation} name={route.params.heading}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.backgroundMainLogin, //isUpdateStep?Colors.backgroundMainLogin:Colors.bleLayer4,
            width: '90%',
            alignSelf: 'center',
          }}>
          {route.params.changeTextTitle === 'Sleep Time' ? (
            <View
              style={{
                marginTop: hp(5),
                flexDirection: 'column',
                // alignContent: 'space-between',
                // alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'row',
                  // alignContent: 'space-between',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {/* ///Uncomment this */}
                <Text style={{color: Colors.black}}>
                  {route.params.changeTextTitle}
                </Text>
                <View>
                  <TouchableOpacity onPress={showDatePicker}>
                    {/* <Text style={{color:'red'}}>{getCurrentDate(selectedSleepTime)}</Text> */}
                    <Text style={{color: Colors.black}}>{sleepTime}</Text>
                  </TouchableOpacity>
                  <CustomDatePicker
                    date
                    time={sleepTime}
                    isVisible={isDatePickerVisible}
                    onDateChange={handleDateChange}
                    onCancel={handleCancel}
                  />
                  {/* <CustomDatePicker
                      isVisible={isDatePickerVisible}
                      onDateChange={handleDateChange}
                      onCancel={handleCancel}
                    /> */}
                </View>
              </View>
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'row',
                  // alignContent: 'space-between',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: Colors.black}}>Wakeup Time</Text>
                {/* <TextInput
                    onChangeText={setwakeupTime}
                    value={wakeupTime}
                    placeholder="----"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.black} wakeupTime
                  /> */}

                <View>
                  <TouchableOpacity onPress={showDatePickerWake}>
                    {/* <Text>{getCurrentDate(selectedWakeTime)}</Text> */}
                    <Text style={{color: Colors.black}}>{wakeupTime}</Text>
                  </TouchableOpacity>
                  <CustomDatePicker
                    time={wakeupTime}
                    isVisible={isDatePickerVisibleWakeTime}
                    onDateChange={handleDateChangeWakeTime}
                    onCancel={handleCancelWake}
                  />
                </View>
              </View>
              {/* save time start */}
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{width: '75%', marginTop: hp(5)}}>
                  <TouchableOpacity
                    onPress={handleSaveTime}
                    style={{
                      backgroundColor: Colors.blueTextColor,
                      borderRadius: 8,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.5),
                        paddingVertical: hp(2),
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* save time end */}
            </View>
          ) : route.params.changeTextTitle === 'Heart Rate' ? (
            <>
              {/* This section will work for editing the heart rate of the user (START) */}
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.noRecordFound,
                  }}>
                  {route.params.changeTextTitle}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    display: 'flex',
                  }}>
                  <TextInput
                    onChangeText={e => {
                      setheartRate(e);
                      //  this function will help to update the text value enter by the user
                    }}
                    style={{
                      width: '60%',
                      textAlign: 'right',
                      color: Colors.noRecordFound,
                      paddingTop: hp(0.5),
                      paddingVertical: hp(0.3),
                    }}
                    value={heartRate}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.noRecordFound}
                  />
                  <Text
                    style={{
                      color: Colors.noRecordFound,
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2),
                      marginLeft: hp(0.5),
                    }}>
                    {route.params.unit}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleUpdateHeartRateAndNavigate}
                style={{
                  width: '100%',
                  backgroundColor: Colors.blueTextColor,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: hp(5),
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.5),
                    paddingVertical: hp(2),
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
              {/* This section will work for editing the heart rate of the user (END) */}
            </>
          ) : (
            <>
              {/* This section is working for updating the goal of the step counter screen*/}
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'column',
                  // alignContent: 'space-between',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                  borderColor: 'red',
                  borderWidth: 0,
                }}>
                <View
                  style={{
                    display: 'none',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderColor: 'blue',
                    borderWidth: 0,
                    marginBottom: '2%',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flex: 0.5,
                      borderColor: 'yellow',
                      borderWidth: 0,
                      paddingRight: '1%',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setisUpdateStep(true);
                      }}
                      style={{
                        backgroundColor: isUpdateStep
                          ? Colors.blueTextColor
                          : Colors.bleLayer4,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: isUpdateStep ? Colors.white : Colors.darkgrey,
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          paddingVertical: hp(2),
                        }}>
                        Update Steps
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      borderColor: 'yellow',
                      borderWidth: 0,
                      paddingLeft: '1%',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setisUpdateStep(false);
                      }}
                      style={{
                        backgroundColor: !isUpdateStep
                          ? Colors.blueTextColor
                          : Colors.bleLayer4, //Colors.blueTextColor,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: !isUpdateStep ? Colors.white : Colors.darkgrey, //Colors.white,
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          paddingVertical: hp(2),
                        }}>
                        Update Goal
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {isUpdateStep ? (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderColor: 'green',
                      borderWidth: 0,
                      marginTop: hp(1),
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderColor: 'orange',
                        borderWidth: 0,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.noRecordFound,
                        }}>
                        {'Save Steps'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        display: 'flex',
                        borderColor: 'blue',
                        borderWidth: 0,
                      }}>
                      <Text
                        style={{
                          color: Colors.noRecordFound,
                        }}>
                        {route?.params?.userSteps}
                      </Text>
                      <Text
                        style={{
                          color: Colors.noRecordFound,
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          marginLeft: hp(0.5),
                        }}>
                        {route.params.unit}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderColor: 'green',
                      borderWidth: 0,
                      marginTop: hp(1),
                    }}>
                    <View style={{borderColor: 'red', borderWidth: 0}}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.noRecordFound,
                        }}>
                        {route?.params?.changeTextTitle}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        borderColor: 'green',
                        borderWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                      <TextInput
                        onChangeText={e => {
                          const percentValue = (e / 120) * 100;
                          // onChangValuePercant(percentValue);
                          // onChangValue(e);
                          console.log(
                            'Value form the input text is : ',
                            e,
                            'and the percentValue is : ',
                            percentValue,
                          );
                          if (Number.isNaN(e)) {
                            console.log('Please Provide a value with decimal');
                          } else {
                            onChangeNumber(e);
                          }
                        }}
                        style={{
                          width: '60%',
                          textAlign: 'right',
                          color: Colors.noRecordFound,
                          paddingTop: hp(0.5),
                          paddingVertical: hp(0.3),
                        }}
                        value={
                          isUpdateStep && number == 0
                            ? route?.params?.userSteps
                            : number
                        }
                        placeholder="0"
                        keyboardType="numeric"
                        placeholderTextColor={Colors.noRecordFound}
                      />
                      <Text
                        style={{
                          color: Colors.noRecordFound,
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          marginLeft: hp(0.5),
                        }}>
                        {route.params.unit}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              {isUpdateStep ? (
                <TouchableOpacity
                  // onPress={() => navigation.pop()}
                  onPress={handleSaveSteps}
                  style={{
                    width: '100%',
                    backgroundColor: Colors.blueTextColor,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: hp(5),
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.5),
                      paddingVertical: hp(2),
                    }}>
                    Save Steps
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  // onPress={() => navigation.pop()}
                  onPress={handleGoalUpdateAndNavigae}
                  style={{
                    width: '100%',
                    backgroundColor: Colors.blueTextColor,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: hp(5),
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.5),
                      paddingVertical: hp(2),
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </MainHeader>
    </SafeAreaView>
  );
};

// api end here
// Function for saving the heart rate is end......
//  Function is responsibe for saving the Sleep Time....

// Function for saving the sleep time is end

// };

export default HealthCategoriesEditValuesScreen;

const styles = StyleSheet.create({});
