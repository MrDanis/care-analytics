// import {View, Text} from 'react-native';
import {useState, useEffect, Fragment} from 'react';

import CalendarStrip from 'react-native-calendar-strip';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import moment from 'moment';

import {StyleSheet, Text, View, ScrollView} from 'react-native';
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
import {TouchableOpacity} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import EmailPopover from '../../../../bluebutton/screens/component/EmailPopover';
import MainHeader from '../../../../mycare/components/MainHeader';
import Modal from 'react-native-modal';
import {Button} from 'react-native-share';
import {SafeAreaView} from 'react-native-safe-area-context';
// import ActivityService from '../../../../../api/activites';
import {connect, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import DiscoverService from '../../../../../api/discover';
import {
  getHeartRateHK,
} from '../../../../../helpers/HealthKit/HealthKitHandler';
import { source } from '../../../../../api/constants';

const HeartCounterScreen = ({navigation, route}) => {
  // ============================= Declaring all the states(Start) ==================================
  const heartLiveRD = useSelector(state => state?.liveHeartData)
  let dateType = 0;

  console.log('====================================');
  console.log('item data in heart', route.params);
  console.log('====================================');
  const [loader, setloader] = useState(false);
  const [screenGenericData, setscreenGenericData] = useState([]);
  const [myHeartRate, setmyHeartRate] = useState(
    parseInt(route?.params?.item?.value),
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSelectedDay, setisSelectedDay] = useState('Day');
  const [stepNo, setstepNo] = useState('first');
  const [barData, setbarData] = useState([]);
  const [date, setDate] = useState(
    moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );
  const [minHeartRate, setMinHeartRte] = useState(0);
  const [maxHeartRate, setMaxHeartRate] = useState(0);
  const [maxChartRange, setmaxChartRange] = useState(0);
  console.log('Data comming in the heart rate is : ',route?.params)

  const [prevHeartRate, setPrevHeartRate] = useState(heartLiveRD);//(route?.params?.heartRate);
  // ============================= UseEffect =============================
  useEffect(() => {
    getHeartHistory(date, 0);
    handleDefaultValue();
    
  }, []);
  //================================ UseEffect(END) =======================
  // function is responsible for updating the data of the chart
  const handleDateChangeAndUpdateChart = date => {
    setDate(date);
  };
  // =======================End===========================
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // get min and max heart rate here
  const handleDefaultValue = () => {
    let valueDefault = null;
    valueDefault = route.params.item.patientGoal.split(' - ');
    console.log('====================================');
    console.log('valueDefault', valueDefault);
    console.log('====================================');
    setMinHeartRte(valueDefault[0]);
    setMaxHeartRate(valueDefault[1]);
  };

  // const [modalHeight, setmodalHeight] = useState(0.3);
  // ================================================================================ UseEffect ==================================

  // ================================================================================ UseEffect ==================================
  // Below function is responsible for updating the heart rate set by the user (START)
  const handleUpdateHeartRate = val => {
    console.log('updated heart rate is : ', val);
    setmyHeartRate(val);
    getHeartHistory(date, dateType);
    setPrevHeartRate(val)
  };
  // Below function is responsible for updating the heart rate set by the user (End)

  // Setting the type(Day,Week,Month) base on which cart data will be papulated
  const setDateTypeFunction = d => {
    console.log('====================================');
    console.log('fetch date type', d);
    console.log('====================================');
    dateType = d;
  };
  const getHeartData = () => {
    console.log('Date type is : ', dateType, 'and the date is : ', date);
    getHeartHistory(date, dateType);
  };
  // Below function is responsible for Filtering and papulating the chart data

  const getHeartHistory = async (date, type) => {
    setloader(true);
    try {
      const dataRequest = await DiscoverService.getHealthCategoryById(
        route?.params?.id,
        date.split('T')[0],
        type,
      );
      const dataResponse = await dataRequest;
      if (dataResponse && dataResponse.statusCode === 200) {
        // setscreenGenericData(dataResponse.data);
        
        const firstNonZeroIdObject = dataResponse?.data.find(item => item?.id !== 0);
        console.log("firstNonZeroIdObject heart",firstNonZeroIdObject);
        
        console.log('response of the heart counter api is : ', dataResponse);
        
        if (route?.params?.heartRate?.value !== parseInt(firstNonZeroIdObject?.value)) {
          updateHeartHistory();
          // console.log("f val ",route?.params?.heartRate?.value,"s val ",parseInt(firstNonZeroIdObject?.value))
          // console.log("actual con",route?.params?.heartRate?.value !== parseInt(firstNonZeroIdObject?.value))
        }
        let tempData = [];
        if (dataResponse?.data?.length > 0) {
          switch (dateType) {
            case 0:
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
                      value:(dataResponse?.data[k]?.value === 'undefined')?0:dataResponse?.data[k]?.value,
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
                      frontColor:'#00D685', //Colors.red3,
                      topLabelComponent: () => (
                        <Text style={{color: 'black', fontSize: 8}}>
                          {(dataResponse?.data[k]?.value === 'undefined')?'':dataResponse?.data[k]?.value}
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
                    frontColor: '#00D685'//Colors.red3,
                  });
                } else {
                  stackData.push(groupedDayData[0]);
                }
                console.log(
                  'Data of the hour of the day is : ',
                  groupedDayData,
                );
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
              console.log('Data of the chart is : ',stackData);
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
              console.log('====================================');
              console.log('Max value for the week data is : ',weekMaxValue);
              console.log('====================================');
              setmaxChartRange(weekMaxValue + 10);
              for (let j = 0; j < dataResponse?.data?.length; j++) {
                tempData.push({
                  value: ((dataResponse?.data[j]?.value=== '0')||(dataResponse?.data[j]?.value=== 'undefined'))?'':dataResponse?.data[j]?.value,
                  label: moment(dataResponse?.data[j]?.createdDate).format(
                    'ddd',
                  ), //weekDates[j+1].dayName,
                  spacing: 23,
                  labelWidth: 20,
                  labelTextStyle: {color: 'gray', fontSize: 10},
                  frontColor: '#00D685',//Colors.red3,
                  topLabelComponent: () => (
                    <Text style={{color: 'black', fontSize: 8}}>
                      {((dataResponse?.data[j].value === '0')||(dataResponse?.data[j].value === 'undefined'))
                        ? ''
                        : dataResponse?.data[j]?.value}
                    </Text>
                  ),
                });
              }
              setbarData(tempData);
              console.log('Weekly results are : ', dataResponse?.data);
              break;
            case 2:
              let MonthdataForMaxRage = [...dataResponse?.data].filter((item) => item.value!=='undefined').sort(
                (a, b) => b.value - a.value,
              );
              console.log('Sorted list for the monthly record...',MonthdataForMaxRage)
              let monthMaxValue = parseInt(MonthdataForMaxRage[0]?.value);
              setmaxChartRange(monthMaxValue + 10);
              for (let j = 0; j < dataResponse.data.length; j++) {
                tempData.push({
                  value: ((dataResponse?.data[j]?.value === '0')||(dataResponse?.data[j]?.value === 'undefined'))?'':dataResponse?.data[j]?.value,
                  label: dataResponse?.data[j]?.createdDate
                    .split('T')[0]
                    .split('-')[2],
                  // spacing: 30,

                  labelWidth: 20,
                  labelTextStyle: {color: 'gray', fontSize: 10},
                  frontColor:'#00D685', //Colors.red3,
                  topLabelComponent: () => (
                    <Text style={{color: 'black', fontSize: 8}}>
                      {((dataResponse?.data[j].value === '0')||(dataResponse?.data[j]?.value === 'undefined'))
                        ? ''
                        : dataResponse?.data[j]?.value}
                    </Text>
                  ),
                });
              }
              setbarData([...tempData].reverse());
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
              spacing: 15,
              labelWidth: 20,
              labelTextStyle: {color: 'gray', fontSize: 10},
              frontColor: '#00D685',//Colors.red3,
              topLabelComponent: () => (
                <Text style={{color: 'black', fontSize: 8}}></Text>
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
  };
  const updateHeartHistory = () => {
    console.log('booyah');
    let payload = {
      categoryId: route?.params?.id,
      value: `${route?.params?.heartRate?.value}`,
      source: source,
      device: "1",
    };
    console.log('Payload is : ', payload);
    // Check add by DC to prevent the call of api if it contains the undefined value in the payload
    if(payload?.value !== 'undefined')
    {
      DiscoverService.postHealthCategoryById(payload)
        .then(res => {
          console.log('Response of the step api is  lolololo: ', res.data);
          if (res.data) {
            console.log('data posted success heart');
          }
        })
        .catch(err => {
          console.log('Error of the step Save api is : ', err);
        });
      
    }
    else
    {
      console.log('====================================');
      console.log('Undefined heartrate cannot be entered....');
      console.log('====================================');
    }
  };
  // ========================Declaring all the function to preform the required functionality (END) ===============================
  
  
  return (
    <Fragment>
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
        <MainHeader navigation={navigation} name={'Heart Rate'}>
          <Modal
            // propagateSwipe={true}
            isVisible={isModalVisible}
            style={{justifyContent: 'flex-end', margin: 0, zIndex: 1}}
            onBackdropPress={() => {
              setTimeout(
                () => setModalVisible(!isModalVisible),
                Platform.OS === 'ios' ? 200 : 0,
              );
              // setModalVisible(!isModalVisible);
            }}>
            <View
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                flex: stepNo === 'first' || stepNo === 'fourth' ? 0.35 : 0.47,
                backgroundColor: 'white',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}></View>
          </Modal>
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
              iconContainer={{flex: 0.02}}
              selectedDate={date}
              onDateSelected={date => {
                let currentDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
                getHeartHistory(currentDate, 0);
                setDate(currentDate);
                // console.log('====================================');
                // console.log(date);
                // this.getTodayMedicationData(date);
              }}
            />
          </View>
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
                    //   alignContent: 'center',
                    //   alignItems: 'center',
                    // alignSelf: 'center',
                    justifyContent: 'space-between',
                    width: '90%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      // alignContent: 'center',
                      // alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(1.6),
                        flexDirection: 'column',
                        fontWeight: '400',
                        // marginLeft: hp(2),
                        marginTop: hp(1.5),
                        color: Colors.darkGrey,
                        //   letterSpacing: 2.5,
                        // alignSelf: 'center',
                      }}>
                      {'Range'}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2.8),
                        flexDirection: 'column',
                        fontWeight: '600',
                        color: Colors.black,
                        //   letterSpacing: 2.5,
                        // alignSelf: 'center',
                      }}>
                      {route.params.item.patientGoal}
                      <Text
                        style={{
                          color: Colors.darkGrey,
                          fontWeight: '600',
                          fontSize: hp(1.5),
                        }}>
                        {' bpm'}
                      </Text>
                    </Text>
                  </View>
                  {/* Space between range and settings icon */}
                  {/* <View
                    style={{
                      paddingLeft: hp(9.3),
                      paddingRight: hp(9.3),
                    }}
                  /> */}
                  <View
                    style={{
                      paddingRight: hp(10),
                    }}
                  />
                  {/* HealthCategoriesEditValuesScreen */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('HealthCategoriesEditValuesScreen', {
                        heading: 'Set Heart Rate',
                        changeTextTitle: 'Heart Rate',
                        unit: 'bmp',
                        updateHaertRate: handleUpdateHeartRate,
                        id: route.params.id,
                        minHeartRate: minHeartRate,
                        maxHeartRate: maxHeartRate,
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
                  size={hp(24)}
                  width={7.5}
                  fill={((prevHeartRate/(parseInt(route?.params?.item?.patientGoal.split('-')[1]))))*100}//{myHeartRate / 2}
                  rotation={360}
                  tintColor={Colors.red3}
                  backgroundColor={Colors.bleLayer4}>
                  {fill => (
                    <View>
                      <FastImage
                        source={Images.pulse_icon_activities}
                        style={{
                          height: hp(4),
                          width: hp(4),
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
                        Heart Rate
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontSize: hp(2.5),
                          fontWeight: '600',
                          fontFamily: Fonts.SourceSansRegular,
                          paddingBottom: hp(0.5),
                          color: Colors.black4,
                        }}>
                        {prevHeartRate}{console.log('Heart value is : ',prevHeartRate,'amd max range value is : ',((prevHeartRate/(parseInt(route?.params?.item?.patientGoal.split('-')[1]))))*100)}
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'center',
                          color: Colors.darkGrey,
                        }}>
                        {'BPM'}
                      </Text>
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
                      justifyContent: 'space-around',
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
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2.6),
                          fontWeight: '600',
                          marginTop: hp(4),
                          marginBottom: hp(0.4),
                          color: Colors.black,
                        }}>
                        {minHeartRate}
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(1.6),
                            fontWeight: '400',
                            // marginTop: hp(4),
                            // marginBottom: hp(3.1),
                            color: Colors.darkGrey,
                          }}>
                          {' bpm'}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(1.6),
                          fontWeight: '400',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.darkGrey,
                        }}>
                        {'Min'}
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
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2.6),
                          fontWeight: '600',
                          marginTop: hp(4),
                          marginBottom: hp(0.4),
                          // marginBottom: hp(3.1),
                          color: Colors.black,
                        }}>
                        {maxHeartRate}
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(1.6),
                            fontWeight: '400',
                            // marginTop: hp(4),
                            // marginBottom: hp(3.1),
                            color: Colors.darkGrey,
                          }}>
                          {' bpm'}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(1.6),
                          fontWeight: '400',
                          // marginTop: hp(4),
                          // marginBottom: hp(3.1),
                          color: Colors.darkGrey,
                        }}>
                        {'Max'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <CustomTestChart
                date={date}
                getVitalHistory={getHeartData}
                setDateType={setDateTypeFunction}
                isSelectedDay={isSelectedDay}
                setisSelectedDay={setisSelectedDay}
                barDataRetrived={barData}
                maxValue={maxChartRange}
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

const mapStateToProps = ({allCategoriesData}) => ({
  allCategoriesData,
});

export default connect(mapStateToProps)(HeartCounterScreen);
