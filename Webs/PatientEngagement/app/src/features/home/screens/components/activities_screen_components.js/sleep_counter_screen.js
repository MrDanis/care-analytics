// import {View, Text} from 'react-native';
import {useState, useEffect, Fragment} from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {StyleSheet, Text, View, ScrollView, PanResponder} from 'react-native';
import React from 'react';
import {Colors, Images, Svgs} from '../../../../../../config';
import {Fonts} from '../../../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';
import images from '../../../../../../config/Images';
import Moment from 'moment';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Image, SvgCss} from 'react-native-svg';
import CustomTestChart from '../../custom_chart';
import Spinner from 'react-native-loading-spinner-overlay';
import VitalsService from '../../../../../api/vitals';
import {TouchableOpacity} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import EmailPopover from '../../../../bluebutton/screens/component/EmailPopover';
import MainHeader from '../../../../mycare/components/MainHeader';
import Modal from 'react-native-modal';
import {Button} from 'react-native-share';
import {SafeAreaView} from 'react-native-safe-area-context';
// import styled from 'styled-components/native';
// import AnalogClock from 'react-native-clock-analog';
import colors from '../../../../../../config/Colors';
import DiscoverService from '../../../../../api/discover';
// import CircularProgress from 'react-native-circular-progress-indicator';
import {useSelector} from 'react-redux';
//Note graph data flag is 0:default or any specific date 1:Weekly data for Sleep counter Screen is 2:Monthly data for sleep counter screen is
let dateType = 0;
const SleepCounterScreen = ({navigation, route}) => {
  // console.log('Routes are : ', route?.params?.id,' and patient goal is : ',route?.params?.sleepGoal);
  // console.log('Paramns are : ',route?.params);
  // const {navigationObject} = props.route.params;
  // const [navigation, setnavigation] = useState(navigationObject);
  // const [loading,setloading] = useState(false);
  const dataFromTehFit = useSelector(state => state?.authFromFit);
  const [circularProgressFill, setcircularProgressFill] = useState(0);
  const [sleepShedule, setsleepShedule] = useState('');
  const [angleOfRotation, setangleOfRotation] = useState(0);
  const [sleepRoutine, setsleepRoutine] = useState(null); //used to open the timer on the time which user set by himself
  const [isModalVisible, setModalVisible] = useState(false);
  const [sleepScreenData, setsleepScreenData] = useState([]);
  const [loader, setloader] = useState(false);
  const [mySleepDuration, setMySleepDuration] = useState(
    route?.params?.sleepDuration,
  );
  // Creating the state for the goal when user update the goal we must update this state as well
  const [patientGoal, setpatientGoal] = useState(route?.params?.sleepGoal);
  // const [maxChartRange,setmaxChartRange] = useState(0)
  // const [stepNo, setstepNo] = useState('first');
  const [isSelectedDay, setisSelectedDay] = useState('Day');
  const [date, setDate] = useState(
    moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );

  const [barData, setbarData] = useState([]);
  // UseEffect (START)  
  useEffect(() => {
    convertTime(mySleepDuration)
    handleGoal(patientGoal); // this function will be responsible for showing the fill of circular progressbar and will represent the patient goal
    getChartData(0, date); // this function is responsible for handling the chart data for Day,Month,Week
  }, []);
  // UseEffect (End)  
  const handleGoal = (goal) =>{
    // Step(1) : Find that which time is greater between Start and end
    const [startTime, endTime] = goal.split('-');
    
    // Parse the times using Moment.js
    const startMoment = moment(startTime, 'hh:mm A').format('HH');
    const endMoment = moment(endTime, 'hh:mm A').format('HH');
    let circularFill = 0;
    let rotationAngle = 0;
    console.log('Start time in 24 hour : ',parseInt(startMoment));
    console.log('End time in 24 hour : ',parseInt(endMoment))
    
    // Check if the start time is greater then end time (indicating a time span across midnight)
    if (parseInt(startMoment)>parseInt(endMoment)) {
      // Add 1 day to the end time to account for the next day
      circularFill = (parseInt(endMoment)+24)-(parseInt(startMoment));
      rotationAngle = parseInt((startMoment))*15;
      setcircularProgressFill(circularFill);
      setangleOfRotation(rotationAngle);
       console.log('Circular progressbar to be filled for ',circularFill,' hours when start time is in PM');
       console.log('Circular progressbar start angle : ',rotationAngle);
    }
    else
    {
      circularFill = (parseInt(endMoment))-(parseInt(startMoment));
      rotationAngle = parseInt(startMoment)*15;
      setcircularProgressFill(circularFill);
      setangleOfRotation(rotationAngle);
      console.log('Circular progressbar to be filled for ',circularFill,' hours when start time is in AM');
      console.log('Circular progressbar start angle : ',rotationAngle);
    }
    // Step(2) : Find the difference between the time in hours based on step one result
    // Step(3) : Find the angle of rotation based on Step one result
   console.log('Goal of the patient is : ',goal);
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // const [modalHeight, setmodalHeight] = useState(0.3);
  // Generic function to handle the chart data is
  const getChartData = async (dateType, date) => {
    console.log(
      'Bar chart data type is : ',
      dateType,
      ' and bar chart date is : ',
      date,
    );
    setloader(true);
    try {
      let dataRequest = await DiscoverService.getHealthCategoryById(
        route?.params?.id,
        date.split('T')[0],
        dateType,
      );
      let dataResponse = await dataRequest;
      console.log('Sleep Screen data request is : ', dataResponse);
      if (dataResponse && dataResponse?.statusCode === 200) {
        let tempData = [];
        if (dataResponse?.data?.length > 0) {
          switch (dateType) {
            case 0:

                console.log('Called for updating the day data : ',dataResponse);
              break;
            case 1:
              //Code block to handle the week data
              console.log('============ Format the week data ==============');
              console.log(date);
              console.log(
                'This is the data of the week : ',
                dataResponse?.data,
              );
              for (let u = 0; u < dataResponse?.data?.length; u++) {
                console.log('Value of the response is : ', dataResponse?.data);
                tempData.push({
                  value: Math.ceil(
                    parseInt(dataResponse?.data[u]?.value.split(' ')[0]) / 60,
                  ),
                  label: moment(dataResponse?.data[u]?.createdDate).format(
                    'ddd',
                  ),
                  labelWidth: 20,
                  spacing: 20,
                  labelTextStyle: {color: 'gray', fontSize: 10},
                  frontColor: Colors.purpleBar,

                  topLabelComponent: () => (
                    <View style={{borderColor: 'green', borderWidth: 0}}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 8,
                          width: '100%',
                          // width: 20,
                          // marginLeft: 5,
                          marginBottom: 5,
                          height: 10,
                          borderColor: 'red',
                          borderWidth: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {parseInt(dataResponse?.data[u]?.value.split(' ')[0]) /
                          60 ===
                        0 ? null : (
                          <Text>
                            {`${
                              Math.ceil(
                                parseInt(
                                  dataResponse?.data[u]?.value.split(' ')[0],
                                ) / 60,
                              ) === 0
                                ? ''
                                : Math.ceil(
                                    parseInt(
                                      dataResponse?.data[u]?.value.split(
                                        ' ',
                                      )[0],
                                    ) / 60,
                                  )
                            }hr`}
                          </Text>
                        )}
                      </Text>
                    </View>
                  ),
                });
              }
              setbarData(tempData);
              console.log('Week data results array is : ', dataResponse?.data);
              break;
            case 2:
              //code block to handle the monthly data
              for (let u = 0; u < dataResponse?.data?.length; u++) {
                tempData.push({
                  value: Math.ceil(
                    parseInt(dataResponse?.data[u]?.value.split(' ')[0]) / 60,
                  ),
                  label: dataResponse?.data[u]?.createdDate
                    .split('T')[0]
                    .split('-')[2],
                  labelWidth: 20,
                  labelTextStyle: {color: 'gray', fontSize: 10},
                  frontColor: Colors.purpleBar,
                  topLabelComponent: () => (
                    <View style={{borderColor: 'green', borderWidth: 0}}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 8,
                          width: '100%',
                          // width: 20,
                          // marginLeft: 5,
                          marginBottom: 5,
                          height: 10,
                          borderColor: 'red',
                          borderWidth: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {parseInt(dataResponse?.data[u]?.value.split(' ')[0]) /
                          60 ===
                        0 ? null : (
                          <Text>
                            {`${Math.ceil(
                              parseInt(
                                dataResponse?.data[u]?.value.split(' ')[0],
                              ) / 60,
                            )}hr`}
                          </Text>
                        )}
                      </Text>
                    </View>
                    // <Text style={{color: 'black', fontSize: 10}}>2</Text>
                  ),
                });
              }
              setbarData(tempData);
              console.log('Month results array is : ', dataResponse?.data);
              break;
            default:
              break;
          }
        } //This case will work when there is no data comming from the api
        else {
          // Adjust the sleep routine circle for default value and shedule hours
          console.log(
            'Comes to else when we dont have the data for the current day',
          );
          console.log(
            'Params from the previous screen is : ',
            route?.params,
            'Start time in hours ',
            parseInt(
              moment(route?.params?.sleepGoal.split('-')[0], 'HH:mm A')
                .format('HH:mm')
                .split(':')[0],
            ),
            'End time in hours',
            parseInt(
              moment(route?.params?.sleepGoal.split('-')[1], 'HH:mm A')
                .format('HH:mm')
                .split(':')[0],
            ),
          );
          if (
            parseInt(
              moment(route?.params?.sleepGoal.split('-')[0], 'HH:mm A')
                .format('HH:mm')
                .split(':')[0],
            ) >
            parseInt(
              moment(route?.params?.sleepGoal.split('-')[1], 'HH:mm A')
                .format('HH:mm')
                .split(':')[0],
            )
          ) 
          {
            let resutenHour =
              parseInt(
                moment(route?.params?.sleepGoal.split('-')[1], 'HH:mm A')
                  .format('HH:mm')
                  .split(':')[0],
              ) +
              24 -
              parseInt(
                moment(route?.params?.sleepGoal.split('-')[0], 'HH:mm A')
                  .format('HH:mm')
                  .split(':')[0],
              );
            setcircularProgressFill(resutenHour);
            console.log('default hours difference : ', resutenHour,'Defalut start time is : ',parseInt(moment(route?.params?.sleepGoal.split('-')[0], 'HH:mm A').format('HH:mm').split(':')[0]),'Defalut end time is : ',(parseInt(moment(route?.params?.sleepGoal.split('-')[1], 'HH:mm A').format('HH:mm').split(':')[0])+12));
            let startRotationAngle =
              (parseInt(
                moment(route?.params?.sleepGoal.split('-')[0], 'HH:mm A')
                  .format('HH:mm')
                  .split(':')[0],
              ) /
                24) *
              360; // for setting the starting point of the filled circular progress bar
            setangleOfRotation(startRotationAngle);
            console.log('Start angle of rotation : ', startRotationAngle);
            // let endTimeInMinuts =
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[1], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[0],
            //   ) *
            //     60 +
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[1], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[1],
            //   );
            // let startTimeInMinuts =
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[0], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[0],
            //   ) *
            //     60 +
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[0], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[1],
            //   );
            // let resultenTime = `${
            //   (endTimeInMinuts + 24 * 60 - startTimeInMinuts) / 60
            // }-${(endTimeInMinuts + 24 * 60 - startTimeInMinuts) % 60}`;
            // setsleepShedule(resultenTime);
          } else {
            let differenceInHour =
              parseInt(
                moment(route?.params?.sleepGoal.split('-')[1], 'HH:mm A')
                  .format('HH:mm')
                  .split(':')[0],
              ) -
              parseInt(
                moment(route?.params?.sleepGoal.split('-')[0], 'HH:mm A')
                  .format('HH:mm')
                  .split(':')[0],
              );
            // let endTimeInMinuts =
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[1], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[0],
            //   ) *
            //     60 +
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[1], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[1],
            //   );
            // let startTimeInMinuts =
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[0], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[0],
            //   ) *
            //     60 +
            //   parseInt(
            //     moment(route?.params?.sleepValue.split('-')[0], 'HH:mm A')
            //       .format('HH:mm')
            //       .split(':')[1],
            //   );
            // let resultenTime = `${(endTimeInMinuts - startTimeInMinuts) / 60}-${
            //   (endTimeInMinuts + 24 * 60 - startTimeInMinuts) % 60
            // }`;
            let startRotationAngle =
              (parseInt(
                moment(route?.params?.sleepGoal.split('-')[0], 'HH:mm A')
                  .format('HH:mm')
                  .split(':')[0],
              ) /
                24) *
              360; // for setting the starting point of the filled circular progress bar
            setangleOfRotation(startRotationAngle);
            // setsleepShedule(resultenTime);
            setcircularProgressFill(differenceInHour);
          }
          // for displaying the shedule time when there is no record for the current day
          // if works when the start time is bigger then end time other wise it goes to else
          if( parseInt(
            moment(route?.params?.sleepValue.split('-')[0], 'HH:mm A')
              .format('HH:mm')
              .split(':')[0],
          ) >
          parseInt(
            moment(route?.params?.sleepValue.split('-')[1], 'HH:mm A')
              .format('HH:mm')
              .split(':')[0],
          ))
          {
            let endTimeInMinuts =
            parseInt(
              moment(route?.params?.sleepValue.split('-')[1], 'HH:mm A')
                .format('HH:mm')
                .split(':')[0],
            ) *
              60 +
            parseInt(
              moment(route?.params?.sleepValue.split('-')[1], 'HH:mm A')
                .format('HH:mm')
                .split(':')[1],
            );
          let startTimeInMinuts =
            parseInt(
              moment(route?.params?.sleepValue.split('-')[0], 'HH:mm A')
                .format('HH:mm')
                .split(':')[0],
            ) *
              60 +
            parseInt(
              moment(route?.params?.sleepValue.split('-')[0], 'HH:mm A')
                .format('HH:mm')
                .split(':')[1],
            );
          let resultenTime = `${
            (endTimeInMinuts + 24 * 60 - startTimeInMinuts) / 60
          }-${(endTimeInMinuts + 24 * 60 - startTimeInMinuts) % 60}`;
          setsleepShedule(resultenTime);
          }
          else{
            let differenceInHour = (parseInt((moment(dataResponse?.data[0].patientGoal.split('-')[1],'HH:mm A').format('HH:mm')).split(':')[0]))-(parseInt((moment(dataResponse?.data[0].patientGoal.split('-')[0],'HH:mm A').format('HH:mm')).split(':')[0]));
            let endTimeInMinuts = ((parseInt((moment(dataResponse?.data[0].value.split('-')[1],'HH:mm A').format('HH:mm')).split(':')[0]))*60)+((parseInt((moment(dataResponse?.data[0].value.split('-')[1],'HH:mm A').format('HH:mm')).split(':')[1])));
            let startTimeInMinuts = ((parseInt((moment(dataResponse?.data[0].value.split('-')[0],'HH:mm A').format('HH:mm')).split(':')[0]))*60)+((parseInt((moment(dataResponse?.data[0].value.split('-')[0],'HH:mm A').format('HH:mm')).split(':')[1])));
            let resultenTime = `${((endTimeInMinuts)-(startTimeInMinuts))/60}-${((endTimeInMinuts+(24*60))-(startTimeInMinuts))%60}`;
            console.log('Resultan time in else is : ',resultenTime.includes('NaN'));
            if(!(resultenTime.includes('NaN')))
            {
              setsleepShedule(resultenTime);
            }
            if(!(Number.isNaN(differenceInHour)))
            {
              setcircularProgressFill(differenceInHour);
            }
            // console.log('Difference in hours are : ',differenceInHour);
          }
          // console.log('Comes to else when there is no data for the current day ..........');
          let dummyData = [
            '12:00 AM',
            '01:00 AM',
            '02:00 AM',
            '03:00 AM',
            '04:00 AM',
            '05:00 AM',
            '06:00 AM',
            '07:00 AM',
            '08:00 AM',
            '09:00 AM',
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '01:00 PM',
            '02:00 PM',
            '03:00 PM',
            '04:00 PM',
            '05:00 PM',
            '06:00 PM',
            '07:00 PM',
            '08:00 PM',
            '09:00 PM',
            '10:00 PM',
            '11:00 PM',
            '12:00 AM',
          ];
          let dayData = [];
          for (let i = 0; i < dummyData?.length; i++) {
            let dayValue = {
              value: 0,
              label:
                i === 0
                  ? '12A'
                  : i === 12
                  ? '12P'
                  : i === 24
                  ? '12A'
                  : i % 2 !== 0
                  ? ''
                  : dummyData[i].split(':')[0], //dummyData[i].split(':')[0],
              spacing: 15,
              labelWidth: 20,
              labelTextStyle: {color: 'gray', fontSize: 10},
              frontColor: Colors.purpleBar,
              topLabelComponent: () => (
                <Text style={{color: 'black', fontSize: 10}}></Text>
              ),
            };
            dayData.push(dayValue);
          }
          dayData = [...dayData];
          tempData.push(...dayData);
          setbarData(tempData);
        }
        setloader(false);
      }
    } catch (error) {
      setloader(false);
      console.log('Server is busy now', error);
    }
  };
  
  // below functions run when the date is change from the top calender (START)
  const handleSpecificDateSleepRoutine = date => {
    let userSelectedDate = moment(date).format('yyyy-MM-DDThh:mm:ss');
    setDate(userSelectedDate);
    console.log('User selected date is : ', userSelectedDate);
    getChartData(0, userSelectedDate);
  };
  //Function is responsible for selecting the type(day,month,year) of which data is required
  const setDateTypeFunction = d => {
    console.log('====================================');
    console.log('fetch date type', d);
    console.log('====================================');
    dateType = d;
  };
  const convertTime = timeRange => {
    const [startTime, endTime] = timeRange.split('-');

    // Parse the times using Moment.js
    const startMoment = moment(startTime, 'hh:mm A');
    const endMoment = moment(endTime, 'hh:mm A');

    // Check if the end time is before the start time (indicating a time span across midnight)
    if (endMoment.isBefore(startMoment)) {
      endMoment.add(1, 'day'); // Add 1 day to the end time to account for the next day
      // Calculate the duration
      const duration = moment.duration(endMoment.diff(startMoment));
  
      // Format the duration
      const hours = duration.hours();
      const minutes = duration.minutes();
      const formattedDuration = `${hours}hr ${minutes}min`;
        
      setMySleepDuration(formattedDuration)
      console.log('the converted time', formattedDuration); // Output: "8hr 0min"
    }


  };
  const handleUpdateSleepRoutine = (sleepRoutine, type) => {
    getChartData(0, date);
    setsleepRoutine(sleepRoutine);
    convertTime(sleepRoutine)
    // console.log('User Sleep Record is ', sleepRoutine);
    // switch (type) {
    //   case 0:
    //     getChartData(0, date);
    //     setsleepRoutine(sleepRoutine);
    //     console.log('Setting the sleep routine ', sleepRoutine);
    //     break;
    //   case 1:
    //      handleGoal(sleepRoutine);
    //     break;
    //   default:
    //     break;
    // }
    //  console.log('Sleep Routine is updated : ',sleepRoutine);
  };
  // Function is responsible for getting the day,month and yearly data

  const getVitalHistory = () => {
    console.log('Call the api from inside the chart : ');
    getChartData(dateType, date);
    // console.log('This function is used to get the data of the steps taken by user in a Day,Month,Year',dateType);
  };

  return (
    <Fragment>
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
        <MainHeader navigation={navigation} name={'Sleep Monitor'}>
          <ScrollView
            style={{
              backgroundColor: Colors.backgroundMainLogin,
              width: '100%',
              height: '100%',
            }}>
            <Spinner
              visible={loader}
              textContent={'Loading...'}
              textStyle={{color: '#FFF'}}
            />

            {/* Calender View */}
            <View
              style={{
                backgroundColor: Colors.backgroundMainLogin,
                width: '100%',
              }}>
              <CalendarStrip
                scrollable
                calendarAnimation={{type: 'sequence', duration: 2}}
                daySelectionAnimation={{
                  type: 'background',
                  duration: 200,
                  borderWidth: 1,
                  highlightColor: Colors.blueHeadingColor,
                  borderHighlightColor: Colors.bleLayer4,
                }}
                style={{
                  height: hp(10),
                  width: '95%',
                  marginLeft: hp(1),
                  padding: hp(1),
                  justifyContent: 'center',
                }}
                innerStyle={{
                  flex: 1,
                }}
                calendarHeaderStyle={{color: Colors.transparent}}
                calendarColor={Colors.BgColor}
                dateNumberStyle={{
                  color: Colors.black,
                  // paddingTop: Platform.OS === 'ios' ? hp(1) : hp(0.8),
                  fontSize: hp(1.5),
                }}
                disabledDateNameStyle={{color: 'black'}}
                disabledDateNumberStyle={{
                  color: Colors.black,
                  fontSize: hp(1.3),
                }}
                dateNameStyle={{color: Colors.black, fontSize: hp(1.3)}}
                highlightDateNumberStyle={{
                  color: Colors.white,
                  // paddingTop: Platform.OS === 'ios' ? hp(1) : hp(0.8),
                  fontSize: hp(1.5),
                }}
                highlightDateContainerStyle={{
                  backgroundColor: Colors.blueTextColor,
                  borderRadius: 30,
                  width: Platform.OS === 'ios' ? hp(5.2) : hp(5.5),
                  height: Platform.OS === 'ios' ? hp(5.2) : hp(5.6),
                  // marginTop: -hp(0.2),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                highlightDateNameStyle={{
                  color: Colors.white,
                  fontSize: hp(1.3),
                }}
                maxDate={moment(new Date()).add(7, 'days')}
                datesBlacklist={[
                  moment(new Date()).add(1, 'days'),
                  moment(new Date()).add(2, 'days'),
                  moment(new Date()).add(3, 'days'),
                  moment(new Date()).add(4, 'days'),
                  moment(new Date()).add(5, 'days'),
                  moment(new Date()).add(6, 'days'),
                  moment(new Date()).add(7, 'days'),
                ]}
                iconContainer={{flex: 0.02}}
                selectedDate={date}
                onDateSelected={date => {
                  handleSpecificDateSleepRoutine(date);
                  // setDate(date);
                  // console.log(date);
                  // this.getTodayMedicationData(date);
                }}
              />
            </View>

            {/* Main Card Daily Steps, Circular Bar And Distance Speed Time, Custom Chart*/}
            <View style={{width: '100%', alignSelf: 'center'}}>
              {/* Daily Steps Row */}
              <View
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  alignSelf: 'center',
                  marginVertical: hp(2),
                  paddingVertical: hp(2),
                  alignItems: 'center',
                  borderRadius: hp(1),
                  elevation: hp(5),
                  shadowOffset: {width: 0.5, height: 0.5},
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  // borderTopLeftRadius: 10,
                  // borderTopRightRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'flex-end',
                    //   alignItems: 'center',
                    // alignSelf: 'center',
                    // justifyContent: 'space-between',
                  }}>
                  {/* {console.log('Time in hours are : ',((((parseInt((moment(sleepScreenData[0]?.patientGoal.split('-')[0],'HH:mm A').format('HH:mm')).split(':')[0]))*60)-((parseInt((moment(sleepScreenData[0]?.patientGoal.split('-')[1],'HH:mm A').format('HH:mm')).split(':')[0]))*60))/60) )}
                    {console.log('Time in hours are : ',moment(sleepScreenData[0]?.patientGoal.split('-')[1],'hh:mm A').diff(moment(sleepScreenData[0]?.patientGoal.split('-')[0],'hh:mm A'),'hours'))} */}
                  <View
                    style={{
                      paddingRight: hp(35),
                    }}
                  />
                  {/* HealthCategoriesEditValuesScreen */}
                  <TouchableOpacity
                    style={{
                      padding: hp(0.5),
                    }}
                    onPress={() => {
                      navigation.navigate('HealthCategoriesEditValuesScreen', {
                        heading: 'Edit Sleep Goal',
                        changeTextTitle: 'Sleep Time',
                        unit: '',
                        id: route.params.id,
                        updateSleepRoutine: handleGoal,//handleUpdateSleepRoutine,
                        sleepTime: patientGoal?.split('-')[0], //route?.params?.sleepGoal.split('-')[0],//sleepRoutine===null?route?.params?.sleepGoal.split('-')[0]:sleepRoutine?.split('-')[0],
                        wakeTime: patientGoal?.split('-')[1], //</View>route?.params?.sleepGoal.split('-')[1]//</View></View>sleepRoutine===null?route?.params?.sleepGoal.split('-')[1]:sleepRoutine?.split('-')[1]
                      });
                    }}>
                    <FastImage
                      style={{
                        width: 20,
                        height: 20,
                        // marginRight: hp(1),
                        // alignSelf: 'center',
                        // borderRadius: 30,
                        // marginVertical: hp(1),
                      }}
                      source={images.settings_activities}
                    />
                  </TouchableOpacity>
                </View>
                {/* settings_activities */}
                {/* Circular Progress Bar */}
                <AnimatedCircularProgress
                  // arcSweepAngle={3600} (Math.ceil(((Math.ceil((parseInt(sleepScreenData[0].value.split(' ')[0]))/60))/24)*100)) (parseInt((moment(groupedDayData[0].value.split('-')[0],'HH:mm A').format('HH:mm')).split(':')[0]))
                  size={hp(24)}
                  width={7.5}
                  arcSweepAngle={360}
                  // prefill={60} fill={sleepScreenData.length > 0 ?((((parseInt(sleepScreenData[0].value.split(' ')[0])/60)/24)*100)) : 0}
                  // fill={90}
                  // tintColorSecondary="orange"
                  style={{borderColor: 'red', borderWidth: 0}}
                  rotation={angleOfRotation}
                  fill={(circularProgressFill / 24) * 100}
                  tintColor={Colors.purpleBar}
                  backgroundColor={Colors.bleLayer4}>
                  {fill => (
                    <View
                      style={{
                        borderColor: 'red',
                        borderWidth: 0,
                        // borderRadius:'50%'
                        // paddingTop: hp(2.3),
                      }}>
                      <SvgCss
                        xml={Svgs.clock_sleep_counter}
                        width={hp(30.5)}
                        height={hp(21.5)}
                        fill={Colors.black}
                        // onPress={() => navigation.pop()}
                        style={{marginHorizontal: hp(1)}}
                      />
                      {/* <AnalogClock
                        colorClock="#FFFFFF"
                        colorNumber="#000000"
                        colorCenter="#FFFFFF"
                        colorHour="#FFFFFF"
                        colorMinutes="#FFFFFF"
                      /> */}
                      {/* <View
                        style={{
                          paddingBottom: hp(10),
                          zIndex: -2,
                          backgroundColor:Colors.black,
                          // width: 20,
                          // height: 20,
                          // position: 'absolute',
                        }}>
                        <Image
                          style={{
                            justifyContent: 'center',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: -2,
                            backgroundColor: Colors.black,
                          
                            // position: 'absolute',
                          }}
                          source={images.AdMedIcon}
                        />
                      </View> */}
                    </View>
                  )}
                </AnimatedCircularProgress>
                <View
                  style={{
                    borderColor: 'green',
                    borderWidth: 0,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('HealthCategoriesEditValuesScreen', {
                        heading: 'Add Data',
                        changeTextTitle: 'Sleep Time',
                        unit: '',
                        id: route?.params?.id,
                        updateSleepRoutine: handleUpdateSleepRoutine,
                        sleepTime:
                          sleepRoutine === null
                            ? route?.params?.sleepValue.split('-')[0]
                            : sleepRoutine?.split('-')[0],
                        wakeTime:
                          sleepRoutine === null
                            ? route?.params?.sleepValue.split('-')[1]
                            : sleepRoutine?.split('-')[1],
                      });
                    }}>
                    <View>
                      <Text
                        style={{paddingVertical: hp(1), color: Colors.black}}>
                        Add Data
                        {console.log(
                          'Routine of the sleep is : ',
                          sleepRoutine,
                          'Value comming fromthe parent is : ',
                          route?.params?.sleepValue,
                          'User goal is : ',
                          route?.params?.sleepGoal,
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '90%',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}>
                    {/* Distance Box View */}
                    <View
                      style={{
                        flexDirection: 'column',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      {route?.params?.sleepDuration !== '' ? (
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansPro,
                            fontSize: hp(2.6),
                            fontWeight: '600',
                            marginTop: hp(4),
                            marginBottom: hp(0.4),
                            color: Colors.black,
                          }}>
                          {console.log(
                            'this is reciebed val',
                            route?.params?.sleepDuration,
                          )}
                          {mySleepDuration}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansPro,
                            fontSize: hp(2.6),
                            fontWeight: '600',
                            marginTop: hp(4),
                            marginBottom: hp(0.4),
                            color: Colors.black,
                          }}>
                          0hr 0min
                        </Text>
                      )}
                      {/* <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(2.6),
                          fontWeight: '600',
                          marginTop: hp(4),
                          marginBottom: hp(0.4),
                          color: Colors.black,
                        }}>
                        8 hr 30Min
                      </Text> */}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(1.8),
                          fontWeight: '600',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.blueGrayDisableText,
                        }}>
                        Scheduled time To Meet Goal
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <CustomTestChart
                date={date} //date on the base of which we retrive the chart data
                getVitalHistory={getVitalHistory}
                setDateType={setDateTypeFunction}
                isSelectedDay={isSelectedDay}
                setisSelectedDay={setisSelectedDay}
                barDataRetrived={barData}
                maxValue={24} //{maxChartRange}//{(parseInt(sleepScreenData[0]?.value.split(' ')[0])/60)+5}
              />
            </View>
            {/* Connected Devices Card */}
            {/* <View>
              <Text
                style={{
                  color: Colors.darkGrey,
                  marginHorizontal: hp(2),
                  marginTop: hp(1),
                  fontSize: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                }}>
                Connected Devices
              </Text>
              <View style={{width: '100%', alignSelf: 'center'}}>
                
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '90%',
                    alignSelf: 'center',
                    marginVertical: hp(2),
                    paddingVertical: hp(2),
                    alignItems: 'center',
                    borderRadius: hp(1),
                    elevation: hp(5),
                    shadowOffset: {width: 0.5, height: 0.5},
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    // borderTopLeftRadius: 10,
                    // borderTopRightRadius: 10,
                  }}>
                  <View
                    style={{
                      marginHorizontal: hp(2),
                      // width: '100%',
                      // backgroundColor: Colors.white,
                      // marginLeft: hp(1),
                      // alignItems: 'center',
                      // marginTop: hp(1),
                      // borderRadius: 8,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: Colors.white,
                        // marginLeft: hp(1),
                        alignItems: 'center',
                        marginTop: hp(1),
                        borderRadius: 8,
                      }}>
                      {barData.length > 1 ? (
                        <FastImage
                          style={{
                            width: 40,
                            height: 40,
                            marginTop: hp(2.8),
                          }}
                          resizeMode="contain"
                          // source={require('../../../../../assets/images/icon_connect_device.png')}
                          source={Images.icon_connect_pulse}
                        />
                      ) : (
                        <FastImage
                          style={{
                            width: 40,
                            height: 40,
                            marginVertical: hp(1.5),
                          }}
                          resizeMode="contain"
                          source={Images.icon_connect_pulse}
                          // source={require('../../../../../assets/images/connect_body_weight.png')}
                        />
                      )}
                    
                      <TouchableOpacity
                        onPress={() => {
                          console.log('Pressed for Modal' + isModalVisible);
                          setModalVisible(!isModalVisible);
                        }}
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            color: Colors.blueTextColor,
                            marginTop: hp(2),
                            marginBottom: hp(1.5),
                            fontFamily: Fonts.SourceSansSemibold,
                            fontSize: hp(4),
                            marginRight: hp(2),
                          }}>
                          +
                        </Text>
                        <Text
                          style={{
                            color: Colors.blueTextColor,
                            marginTop: hp(2),
                            marginBottom: hp(1.5),
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.2),
                          }}>
                          Connect Device
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View> */}
          </ScrollView>
        </MainHeader>
      </SafeAreaView>
    </Fragment>
  );
};

// style={{
//   backgroundColor: 'white',
//   width: '90%',
//   alignSelf: 'center',
//   marginVertical: hp(2),
//   paddingVertical: hp(2),
//   alignItems: 'center',
//   borderRadius: hp(1),
//   elevation: hp(5),
//   shadowOffset: {width: 0.5, height: 0.5},
//   shadowOpacity: 0.1,
//   shadowRadius: 8,
//   // borderTopLeftRadius: 10,
//   // borderTopRightRadius: 10,
// }}

export default SleepCounterScreen;

const styles = StyleSheet.create({});
// const StepCounterScreen = props => {
//   return (
// <View
//   style={{
//     backgroundColor: Colors.backgroundMainLogin,
//     width: '100%',
//   }}>
//   <CalendarStrip
//     scrollable
//     calendarAnimation={{type: 'sequence', duration: 2}}
//     daySelectionAnimation={{
//       type: 'background',

//       duration: 200,

//       borderWidth: 1,

//       highlightColor: Colors.blueHeadingColor,

//       borderHighlightColor: Colors.bleLayer4,
//     }}
//     style={{
//       height: 90,

//       width: '95%',

//       marginLeft: hp(1),

//       padding: hp(1),

//       backgroundColor: Colors.BgColor,
//     }}
//     calendarHeaderStyle={{color: Colors.transparent}}
//     calendarColor={Colors.BgColor}
//     dateNumberStyle={{
//       color: Colors.black,

//       paddingTop: hp(1),

//       fontSize: hp(1.5),
//     }}
//     dateNameStyle={{color: Colors.black, fontSize: hp(1.5)}}
//     highlightDateNumberStyle={{
//       color: Colors.white,

//       paddingTop: hp(1),

//       fontSize: hp(1.5),
//     }}
//     highlightDateContainerStyle={{
//       backgroundColor: Colors.blueTextColor,

//       borderRadius: 17,

//       width: 40,
//     }}
//     highlightDateNameStyle={{
//       color: Colors.white,

//       fontSize: hp(1.5),
//     }}
//     iconContainer={{flex: 0.02}}
//     selectedDate={''}
//     // onDateSelected={date => {
//     // this.setDate(date); // console.log(date); // this.getTodayMedicationData(date);
//     // setDate(date);
//     // getVitalHistory(date);
//     // }}
//   />
// </View>
//   );
// };

// export default StepCounterScreen;
