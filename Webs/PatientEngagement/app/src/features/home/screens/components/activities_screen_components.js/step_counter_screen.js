// import {View, Text} from 'react-native';
import {useState, useEffect} from 'react';
import {getStepCountFromHK} from '../../../../../helpers/HealthKit/HealthKitHandler';
import CalendarStrip from 'react-native-calendar-strip';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import {Colors, Images} from '../../../../../../config';
import {Fonts} from '../../../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';
import images from '../../../../../../config/Images';
import Moment from 'moment';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Image} from 'react-native-svg';
import CustomTestChart from '../../custom_chart';
import Spinner from 'react-native-loading-spinner-overlay';
import VitalsService from '../../../../../api/vitals';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MainHeader from '../../../../mycare/components/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getTodaySteps} from '../../../../../helpers/GoogleFit/GoogleFitHandler';
import ActivityService from '../../../../../api/activites';
import DiscoverService from '../../../../../api/discover';
import { setStepsLive } from '../../../../welcome/action';
import { source } from '../../../../../api/constants';
// import CircularProgress from 'react-native-circular-progress-indicator';
const StepCounterScreen = ({navigation, route}) => {
  console.log('Route step is : ', route?.params?.stepCount);
  //================================================= Declaring the all the states (START) =================================================
  let dateType = 0;
  // const [screenGenericData, setscreenGenericData] = useState([]);
  const [date, setDate] = useState(
    moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );
  const [isSelectedDay, setisSelectedDay] = useState('Day');
  const [goalCount, setgoalCount] = useState(route?.params?.item?.patientGoal);
  const [averageSteps, setaverageSteps] = useState(
    route?.params?.item?.patientGoal,
  );
  const [stepTakenCount, setstepTakenCount] = useState(0);
  const [loader, setloader] = useState(false);
  const [barData, setbarData] = useState([]);
  const [maxChartRange, setmaxChartRange] = useState(0);
  const [prevStepsTakenToday, setPrevStepsTakenToday] = useState();

  console.log('====================================');
  console.log('step data for api', parseInt(route?.params?.item?.value));
  console.log('====================================');
  //================================================= Declaring the all the states (END) =================================================
  const handleEditGoalCount = (val, type) => {
    if (type === 0) {
      setgoalCount(val);
      setaverageSteps(val);
    } else {
    }
  };
  // function responsible to calculate the totall steps and the average steps
  // ========================Declaring all the function to preform the required functionality (START) ===============================
  // update the chart data base on the date on calendarStrip
  const handleDateChangeAndUpdateChart = date => {
    getChartData(date, 0);
    setDate(date);
  };
  async function getChartData(date, type) {
    // set the generic data for the screen also set the data for the chart

    setloader(true);
    console.log('Params comming from the parent are : ', route?.params);
    if (
      parseInt(route?.params?.item?.value) !==
      parseInt(route?.params?.stepsTakenToday)
    ) {
      console.log('here call the api for saving the steps');
      try {
        let payload = {
          categoryId: route?.params?.id,
          value: `${route?.params?.stepsTakenToday}`,
        };
        console.log('Payload is : ', payload);
        let saveStepsRequest = await DiscoverService.postHealthCategoryById(
          payload,
        );
        let saveStepsResponse = await saveStepsRequest;
        if (saveStepsResponse && saveStepsResponse.statusCode === 200) {
          console.log(
            'Steps are saved successfully and there response in JSON is : ',
            JSON.stringify(saveStepsResponse),
          );
        } else {
          console.log(
            'To handle the code for the error in the api : ',
            saveStepsResponse,
          );
        }
      } catch (error) {}
    }
    console.log("current date type is ",dateType)
    try {
      const dataRequest = await DiscoverService.getHealthCategoryById(
        route?.params?.id,
        date.split('T')[0],
        type,
      );
      const dataResponse = await dataRequest;
      if (dataResponse && dataResponse.statusCode === 200) {
        // setscreenGenericData(dataResponse.data);
        //getting value for step counter api 
        const firstNonZeroIdObject = dataResponse?.data.find(item => item?.id !== 0);
        console.log("firstNonZeroIdObject steps",firstNonZeroIdObject);
        console.log('response of the step counter api is : ', dataResponse);
        
        if (route?.params?.stepCount !== parseInt(firstNonZeroIdObject.value)) {
          updateStepHistory();
          console.log("f val ",route?.params?.stepCount,"s val ",parseInt(firstNonZeroIdObject.value))
          console.log("actual con",route?.params?.stepCount !== parseInt(firstNonZeroIdObject.value))
        }
        let tempData = [];
        if (dataResponse?.data?.length > 0) {
          switch (dateType) {
            case 0:
              setaverageSteps(route?.params?.item?.patientGoal);
              setstepTakenCount(route?.params?.stepsTakenToday);
              let dayFormatSample = [
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
              let stackData = [];
              for (let j = 0; j < dayFormatSample.length; j++) {
                let groupedDayData = [];
                for (let k = 0; k < dataResponse?.data?.length; k++) {
                  let recordSubmitTime = moment(
                    dataResponse?.data[k]?.createdDate.split('T')[1],
                    'HH:mm:ss.SS',
                  ).format('hh:mm A');
                  let currentTime = moment(recordSubmitTime, 'hh:mm A');
                  let afterTime = moment(dayFormatSample[j], 'hh:mm A');
                  let beforeTime = moment(dayFormatSample[j + 1], 'hh:mm A');
                  if (currentTime.isBetween(afterTime, beforeTime)) {
                    groupedDayData.push({
                      value: dataResponse?.data[k]?.value,
                      label:
                        j === 0
                          ? '12A'
                          : j === 12
                          ? '12P'
                          : j === 24
                          ? '12A'
                          : j % 2 !== 0
                          ? ''
                          : dayFormatSample[j].split(':')[0], //'',//moment(moment(dataResponse?.data[i]?.createdDate)).format('hh:mm A'),
                      labelWidth: 20,
                      labelTextStyle: {color: 'gray', fontSize: 10},
                      frontColor: Colors.blueTextColor,
                      topLabelComponent: () => (
                        <Text style={{color: 'black', fontSize: 10}}>
                          {dataResponse?.data[k]?.value}
                        </Text>
                      ),
                    });
                  }
                }
                if (groupedDayData.length === 0) {
                  stackData.push({
                    value: 0,
                    label:
                      j === 0
                        ? '12A'
                        : j === 12
                        ? '12P'
                        : j === 24
                        ? '12A'
                        : j % 2 !== 0
                        ? ''
                        : dayFormatSample[j].split(':')[0], //'',//moment(moment(dataResponse?.data[i]?.createdDate)).format('hh:mm A'),
                    spacing: 15,
                    labelWidth: 20,
                    labelTextStyle: {color: 'gray', fontSize: 10},
                    frontColor: Colors.blueTextColor,
                  });
                } else {
                  stackData.push(groupedDayData[0]);
                }
              }
              console.log('=========================================');
              console.log('Stack data is : ', stackData);
              console.log('=========================================');
              // setbarData(stackData);
              // console.log('Data for the day is : ',tempData);

              let maxValue = [...stackData];
              //tempData.sort((a,b) => b.value - a.value); is ki vaja sy data ki formation kharab ho rahi hai
              maxValue = maxValue.sort((a, b) => b.value - a.value);
              let maxRangeValue = parseInt(maxValue[0]?.value);

              setmaxChartRange(maxRangeValue + 10);
              setTimeout(() => {
                console.log('Maximum Range Value is : ', maxChartRange);
                // setbarData(tempData)
                setbarData(stackData);
              }, 500);

              break;
            case 1:
              let dataForMaxRage = [...dataResponse?.data].sort(
                (a, b) => b.value - a.value,
              );
              let weekMaxValue = parseInt(dataForMaxRage[0]?.value);
              setmaxChartRange(weekMaxValue + 10);
              let averageWeeklySteps = 0;
              let weeklyStepsTaken = 0;
              for (let j = 0; j < dataResponse?.data?.length; j++) {
                averageWeeklySteps += parseInt(
                  dataResponse?.data[j]?.patientGoal,
                );
                weeklyStepsTaken += parseInt(dataResponse?.data[j]?.value);
                console.log(
                  'Values are ',
                  parseInt(dataResponse?.data[j]?.patientGoal),
                );
                tempData.push({
                  value: dataResponse?.data[j]?.value,
                  label: moment(dataResponse?.data[j]?.createdDate).format(
                    'ddd',
                  ), //weekDates[j+1].dayName,
                  spacing: 23,
                  labelWidth: 20,
                  labelTextStyle: {color: 'gray', fontSize: 10},
                  frontColor: Colors.blueTextColor,
                  topLabelComponent: () => (
                    <Text style={{color: 'black', fontSize: 10}}>
                      {dataResponse?.data[j].value === '0'
                        ? ''
                        : dataResponse?.data[j]?.value}
                    </Text>
                  ),
                });
              }
              console.log('weekly step count is :',(dataResponse?.data[0]?.patientGoal*7));
              setaverageSteps(parseInt(dataResponse?.data[0]?.patientGoal*7));
              setstepTakenCount(parseInt(weeklyStepsTaken/7));
              setbarData(tempData);
              console.log('Weekly results are : ', dataResponse?.data);
              break;
            case 2:
              let MonthdataForMaxRage = [...dataResponse?.data].sort(
                (a, b) => b.value - a.value,
              );
              let monthMaxValue = parseInt(MonthdataForMaxRage[0]?.value);
              let averageMonthlySteps = 0;
              let monthlyStepsTaken = 0;
              setmaxChartRange(monthMaxValue + 10);
              for (let j = 0; j < dataResponse.data.length; j++) {
                monthlyStepsTaken += parseInt(dataResponse?.data[j]?.value);
                averageMonthlySteps += parseInt(
                  dataResponse?.data[j]?.patientGoal,
                );

                tempData.push({
                  value: dataResponse?.data[j]?.value,
                  label: dataResponse?.data[j]?.createdDate
                    .split('T')[0]
                    .split('-')[2],
                  spacing: 18,
                  labelWidth: 20,
                  labelTextStyle: {color: 'gray', fontSize: 10},
                  frontColor: Colors.blueTextColor,
                  topLabelComponent: () => (
                    <Text style={{color: 'black', fontSize: 10}}>
                      {dataResponse?.data[j].value === '0'
                        ? ''
                        : dataResponse?.data[j]?.value}
                    </Text>
                  ),
                });
              }
              console.log(tempData[0])
              setaverageSteps(parseInt(dataResponse?.data[0]?.patientGoal*30));
              setstepTakenCount(parseInt(monthlyStepsTaken/30));
              console.log('Monthly steps taken : ',monthlyStepsTaken)
              setbarData(tempData);
              console.log('Monthly results are : ', dataResponse?.data);
              break;
            default:
              break;
          }
        } else {
          console.log('Comes to else ..........');
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
                  : dummyData[i].split(':')[0],
              spacing: 20,
              labelWidth: 20,
              labelTextStyle: {color: 'gray', fontSize: 10},
              frontColor: Colors.purpleBar,
              topLabelComponent: () => (
                <Text style={{color: 'black', fontSize: 10}}></Text>
              ),
            };
            dayData.push(dayValue);
          }
          console.log('Data before reverse is : ', dayData);
          tempData.push(...dayData);
          setbarData(tempData);
        }
        setloader(false);
      }
    } catch (error) {
      setloader(false);
      console.log('Server is busy now', error);
    }
  }
  const setDateTypeFunction = d => {
    dateType = d;
    
  };
  const getStepsHistory = () => {
    console.log('Calling the api data from the chart : ', dateType);
    getChartData(date, dateType);
    //handleAssembleChartData(screenGenericData, dateType);
  };
  const updateStepHistory = () => {
    console.log('inside update step history');
    let payload = {
      categoryId: route?.params?.id,
      value: `${route?.params?.stepCount}`,
      source: source,
      device: "1",
    };
    console.log('Payload is : ', payload);

    DiscoverService.postHealthCategoryById(payload)
      .then(res => {
        console.log('Response of the step api is  lolololo: ', res.data);
        if (res.data) {
          console.log('data posted success step');
        }
      })
      .catch(err => {
        console.log('Error of the step Save api is : ', err);
      });
  };
  // ========================Declaring all the function to preform the required functionality (END) ===============================
  useEffect(() => {
   
    getChartData(date, 0);
  }, []);

 
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
      <MainHeader navigation={navigation} name={'Step Counter'}>
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
              disabledDateNumberStyle={{color: Colors.black, fontSize: hp(1.3)}}
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
                handleDateChangeAndUpdateChart(
                  moment(date).format('YYYY-MM-DDTHH:mm:ss'),
                );
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
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(1.8),
                    fontWeight: '400',
                    marginLeft: hp(2),
                    marginVertical: hp(1.1),
                    color: Colors.blueTextColor,
                    letterSpacing: 2.5,
                    alignSelf: 'center',
                  }}>
                  {'DAILY STEPS'}
                </Text>
                <View
                  style={{
                    paddingRight: hp(10),
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('HealthCategoriesEditValuesScreen', {
                      heading: 'Edit Goal',
                      changeTextTitle: 'Steps',
                      unit: 'steps',
                      updateGoal: handleEditGoalCount,
                      id: route?.params?.id,
                      userSteps: route?.params?.stepsTakenToday,
                    });
                  }}>
                  <FastImage
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: hp(1),
                      alignSelf: 'center',
                      // borderRadius: 30,
                      // marginVertical: hp(1),
                    }}
                    source={images.settings_activities}
                  />
                </TouchableOpacity>
              </View>
              {/* Main Text for You have walked % */}
              <Text
                style={{
                  fontFamily: Fonts.SourceSansPro,
                  fontSize: hp(1.8),
                  fontWeight: '600',
                  marginTop: hp(1.8),
                  marginBottom: hp(3.1),
                  color: Colors.black,
                }}>
                {'You have walked '}
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(1.8),
                    fontWeight: '600',
                    // marginLeft: hp(2),
                    color: Colors.blueTextColor,
                  }}>
                  {`${
                    Math.ceil(
                      (route?.params?.stepsTakenToday / goalCount) * 100,
                    ) > 100
                      ? 100
                      : Math.ceil(
                          (route?.params?.stepsTakenToday / goalCount) * 100,
                        )
                  }% `}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(1.8),
                    fontWeight: '600',
                    color: Colors.black,
                  }}>
                  {'of your goal'}
                </Text>
              </Text>

              {/* settings_activities */}
              {/* Circular Progress Bar */}
              <AnimatedCircularProgress
                size={hp(24)}
                width={7.5}
                fill={Math.ceil(
                  (route?.params?.stepsTakenToday / goalCount) * 100,
                )}
                rotation={360}
                tintColor={Colors.blueTextColor}
                backgroundColor={Colors.bleLayer4}>
                {fill => (
                  <View>
                    <FastImage
                      source={Images.steps_icon_step_activities}
                      style={{
                        height: hp(4),
                        width: hp(2.4),
                        resizeMode: 'contain',
                        // alignContent:'center',
                        alignSelf: 'center',
                      }}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: hp(1.4),
                        color: Colors.darkgrey,
                        paddingBottom: hp(0.5),
                        // darkgrey
                      }}>
                      Steps
                    </Text>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: hp(2.5),
                        fontWeight: '600',
                        fontFamily: Fonts.SourceSansRegular,
                        paddingBottom: hp(0.5),
                        color: 'black',
                      }}>
                      {route?.params?.stepCount}
                      {console.log(
                        'Steps comming from the parent screen is : ',
                        route?.params?.stepCount,
                      )}
                      {/* {5 + ',' + 300} */}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          color: Colors.blueTextColor,
                        }}>
                        Goal{' '}
                      </Text>
                      <Text
                        style={{
                          color: Colors.blueTextColor,
                        }}>
                        {goalCount}
                        {/* {7 + ',' + 500} */}
                        {/* {goalCount>0?goalCount:screenGenericData[0]?.value} */}
                        {/* {screenGenericData.length === 0
                          ? goalCount
                          : screenGenericData[0]?.value} */}
                      </Text>
                    </View>
                  </View>
                )}
              </AnimatedCircularProgress>
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
                    justifyContent: 'space-between',
                    paddingHorizontal: hp(2.5),
                  }}>
                  {/* Distance Box View */}
                  <View
                    style={{
                      flexDirection: 'column',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontSize: hp(2.6),
                        fontWeight: '600',
                        marginTop: hp(4),
                        marginBottom: hp(0.4),
                        color: Colors.black,
                      }}>
                      {/* {10.2}{console.log('Speed of the user is : ',route?.params?.speed)} */}
                      {route?.params?.dsstanceCoverd / 1000}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(1.6),
                          fontWeight: '400',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.darkGrey,
                        }}>
                        {' km'}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontSize: hp(1.6),
                        fontWeight: '400',
                        // marginTop: hp(4),
                        // marginBottom: hp(3.1),
                        color: Colors.darkGrey,
                      }}>
                      {'Distance'}
                    </Text>
                  </View>
                  {/* Speed Box View */}
                  <View
                    style={{
                      flexDirection: 'column',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontSize: hp(2.6),
                        fontWeight: '600',
                        marginTop: hp(4),
                        marginBottom: hp(0.4),
                        // marginBottom: hp(3.1),
                        color: Colors.black,
                      }}>
                      {/* {5} */}
                      {route?.params?.speed}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(1.6),
                          fontWeight: '400',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.darkGrey,
                        }}>
                        {' km/h'}
                        {/* {'m/s'} */}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontSize: hp(1.6),
                        fontWeight: '400',
                        // marginTop: hp(4),
                        // marginBottom: hp(3.1),
                        color: Colors.darkGrey,
                      }}>
                      {'Speed'}
                    </Text>
                  </View>
                  {/* Time Box View */}
                  <View
                    style={{
                      display: 'none',
                      flexDirection: 'column',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontSize: hp(2.6),
                        fontWeight: '600',
                        marginTop: hp(4),
                        marginBottom: hp(0.4),
                        // marginBottom: hp(3.1),
                        color: Colors.black,
                      }}>
                      {/* {'2:10'} */}
                      {route?.params?.dsstanceCoverd === 0 &&
                      route?.params?.speed === 0
                        ? '0:0'
                        : moment
                            .utc(
                              moment
                                .duration(
                                  route?.params?.dsstanceCoverd /
                                    1000 /
                                    route?.params?.speed,
                                  'hours',
                                )
                                .asMilliseconds(),
                            )
                            .format('H:m')}
                      {/* {':'} */}
                      {/* {(((route?.params?.dsstanceCoverd/1000)/(route?.params?.speed))/60)}  */}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(1.6),
                          fontWeight: '400',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.darkGrey,
                        }}>
                        {/* {' h/m'} */}
                        {' h/m'}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontSize: hp(1.6),
                        fontWeight: '400',
                        // marginTop: hp(4),
                        // marginBottom: hp(3.1),
                        color: Colors.darkGrey,
                      }}>
                      {'Time'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <CustomTestChart
              date={date} //date on the base of which we retrive the chart data
              getVitalHistory={getStepsHistory}
              setDateType={setDateTypeFunction}
              isSelectedDay={isSelectedDay}
              setisSelectedDay={setisSelectedDay}
              barDataRetrived={barData}
              maxValue={maxChartRange}
            />
          </View>
          {/* Total Steps Card */}
          <View>
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
                {/* Main Text for You have walked % */}
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginLeft: hp(2),
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(2.1),
                    fontWeight: '400',
                    // marginTop: hp(1.8),
                    color: Colors.black,
                  }}>
                  {'Total Steps'}
                </Text>

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
                      justifyContent: 'space-between',
                    }}>
                    {/* Distance Box View */}
                    <View
                      style={{
                        flexDirection: 'column',
                        alignContent: 'center',
                        alignItems: 'center',
                        // marginBottom: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(2.6),
                          fontWeight: '600',
                          marginTop: hp(4),
                          marginBottom: hp(0.4),
                          color: Colors.black,
                        }}>
                        {averageSteps}
                        {console.log('date type is : ', dateType)}
                        {/* {10 + ',' + '000'} */}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(1.6),
                          fontWeight: '400',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.darkGrey,
                        }}>
                        {/* {'Step Count'} */}{'Goal'}
                      </Text>
                    </View>

                    {/* Time Box View */}
                    <View
                      style={{
                        flexDirection: 'column',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(2.6),
                          fontWeight: '600',
                          marginTop: hp(4),
                          marginBottom: hp(0.4),
                          // marginBottom: hp(3.1),
                          color: Colors.black,
                        }}>
                        {console.log('day type is : ', dateType)}
                        {stepTakenCount}
                        {/* {20 + ',' + '000'} */}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontSize: hp(1.6),
                          fontWeight: '400',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.darkGrey,
                        }}>
                        {'Avg Goal'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </MainHeader>
    </SafeAreaView>
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

export default StepCounterScreen;

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
//     // getStepsHistory(date);
//     // }}
//   />
// </View>
//   );
// };

// export default StepCounterScreen;
