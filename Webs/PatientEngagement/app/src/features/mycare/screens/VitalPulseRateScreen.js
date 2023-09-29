// import {View, Text} from 'react-native';
import {useState, useEffect} from 'react';

import CalendarStrip from 'react-native-calendar-strip';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import moment from 'moment';

import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Moment from 'moment';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Spinner from 'react-native-loading-spinner-overlay';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import VitalsService from '../../../api/vitals';
import MainHeader from '../components/MainHeader';
import {Colors, Images, Svgs} from '../../../../config';
import {Fonts, OSSource} from '../../../../config/AppConfig';
import images from '../../../../config/Images';
import CustomTestChart from '../../home/screens/custom_chart';
import {SvgCss} from 'react-native-svg';
import {getVitalSubTypesData} from '../action';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {convertUTCDateToLocalDate} from '../../../helpers/Common';
import {useFocusEffect} from '@react-navigation/native';

// import CircularProgress from 'react-native-circular-progress-indicator';

const VitalPulseRateScreen = ({navigation, route}) => {
  let dateType = 0;
  console.log('Data from the parent screen is : ', route.params);
  const dispatch = useDispatch();
  const {vitalsData} = route.params;
  const userProfileData = useSelector(state => state.userProfileData);
  const [date, setDate] = useState(
    moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );
  const [pulseRate, setPulseRate] = useState(0);
  const [pulsePercentValue, setPulsePercentValue] = useState(0);
  const [vitalSubType, setVitalSubType] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [barData, setbarData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isSelectedDay, setisSelectedDay] = useState('Day');
  let percentValue = 0;

  useFocusEffect(
    React.useCallback(() => {
      getVitalSubType();
      getVitalHistory(date);
    }, []),
  );

  const getVitalSubType = () => {
    setLoader(true);
    // setLoaderSlider(true);
    VitalsService.getVitalSubTypeData(vitalsData.id)
      .then(res => {
        console.log('Vitals SubType Data');
        console.log(res);
        // LoaderSlider(false);
        if (res.statusCode === 200) {
          let val = null;
          setLoader(false);
          setVitalSubType(res?.data[0]);
          // Below check is added because we have null value when the user is first time comming to PulseRate Screen wich cause issue in the Circular Progress bar
          if (Object.is(res.data[0].value, null)) {
            percentValue =
              (parseInt(res?.data[0]?.defaultValue) / res?.data[0]?.maxRange) *
              100;
            percentValue = parseInt(percentValue.toFixed(0));
          } else {
            percentValue =
              (parseInt(res?.data[0]?.value) / res?.data[0]?.maxRange) * 100;
            percentValue = parseInt(percentValue.toFixed(0));
          }
          console.log('====================================');
          console.log('percentValue', percentValue);
          console.log('====================================');
          setPulsePercentValue(percentValue);
          setPulseRate(res.data[0].value);
          dispatch(getVitalSubTypesData(res.data));
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('Vitals Error');
        showMessage({
          message: 'Information',
          description: err.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };

  // function getChartData(date) {
  //   setLoader(true);
  //   VitalsService.getVitalCategoryHistory(
  //     10,
  //     Moment(new Date(date)).format('YYYY-MM-DD'),
  //   )
  //     .then(response => {
  //       setLoader(false);
  //       console.log('getVitalCategoryHistory');
  //       console.log(JSON.stringify(response));
  //       if (response && response.statusCode === 200) {
  //         getvitalDataForChart(response.data);
  //       } else {
  //         showMessage({
  //           message: 'Information',
  //           description:
  //             'Authentication Failed. Provided information is not verified.',
  //           type: 'default',
  //           icon: {icon: 'info', position: 'left'},
  //           backgroundColor: Colors.red,
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       setLoader(false);
  //       console.log('error');
  //       console.log(err);
  //       showMessage({
  //         message: 'Info',
  //         description: 'Internal Server Error',
  //         type: 'default',
  //         icon: {icon: 'info', position: 'left'},
  //         backgroundColor: Colors.red,
  //       });
  //     });
  // }
  const getVitalHistory = date => {
    setLoader(true);
    console.log(
      'Data',
      `/api/Vitals/VitalHistory?VitalTypeId=${vitalsData.id}&date=${Moment(
        new Date(date),
      ).format('YYYY-MM-DD')}`,
      date,
    );
    console.log('====================================');
    console.log('date ttype in history function', dateType);
    console.log('====================================');
    VitalsService.getVitalCategoryHistory(
      vitalsData.id,
      Moment(new Date(date)).format('YYYY-MM-DD'),
      dateType,
    )
      .then(response => {
        setLoader(false);
        console.log('getVitalCategoryHistory');
        console.log(response);
        if (response && response.statusCode === 200) {
          getvitalDataForChart(response.data);
        } else {
          showMessage({
            message: 'Information',
            description:
              'Authentication Failed. Provided information is not verified.',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('error');
        console.log(err);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };
  function getvitalDataForChart(listData) {
    let newVitallist = [];
    let tempdata = [];
    console.debug('Just Inside');
    // console.debug(vitalValues);
    if (dateType === 1) {
      console.log('====================================');
      console.log('dateType', dateType);
      console.log('====================================');
      let newDate = moment(date).subtract(7, 'days');
      const days = [];
      for (let i = 1; i <= 7; i++) {
        newDate = newDate.add(1, 'days');
        const dayName = newDate.format('dddd');

        // const dayString = day.format('YYYY-MM-DD');
        days.push(dayName);
      }
      console.log('====================================');
      console.log('dayname', days);
      console.log('====================================');
      let objData = null;
      days.map((day, index) => {
        console.log('====================================');
        console.log('day in array', day, index);
        console.log('====================================');
        objData = listData.filter((data, index) => {
          if (day === moment(new Date(data.createdDate)).format('dddd')) {
            return data;
          }
        });
        tempdata.push(objData.length !== 0 ? objData[0] : {});
        console.log('====================================');
        console.log('objData', tempdata);
        console.log('====================================');
        if (
          objData.length !== 0 &&
          tempdata[index] !== null &&
          tempdata[index] !== {}
        ) {
          newVitallist.push({
            value: objData[0]?.vitalData[0]?.value,
            label: day.slice(0, 3),
            labelWidth: 50,
            labelTextStyle: {color: 'gray', fontSize: 10},
            frontColor: objData[0]?.isCritical ? '#F44336' : '#00D685',
            topLabelComponent: () => (
              <Text
                style={{
                  color: 'black',
                  fontSize: 8,
                  // width: 20,
                  // marginLeft: 5,
                  marginBottom: 5,
                  height: 10,
                }}>
                {tempdata[index]?.vitalData[0]?.value}
              </Text>
            ),
            spacing: 20,
          });
        } else {
          newVitallist.push({
            value: 0,
            label: day.slice(0, 3),
            labelWidth: 40,
            labelTextStyle: {color: 'grey', fontSize: 9},
            frontColor: '#2962FF',
            spacing: 20,
          });
        }
      });
    } else if (dateType === 2) {
      console.log('====================================');
      console.log('dateType', dateType);
      console.log('====================================');
      let newDate = moment(date).subtract(30, 'days');
      const days = [];
      for (let i = 1; i <= 30; i++) {
        newDate = newDate.add(1, 'days');
        // const dayName = newDate.format('dddd');

        const dayString = newDate.format('YYYY-MM-DD');
        days.push(dayString);
      }
      console.log('====================================');
      console.log('dayname', days);
      console.log('====================================');
      let objData = null;
      days.map((day, index) => {
        console.log('====================================');
        console.log('day in array', day, index);
        console.log('====================================');
        objData = listData.filter((data, index) => {
          if (day === moment(new Date(data.createdDate)).format('YYYY-MM-DD')) {
            return data;
          }
        });
        tempdata.push(objData.length !== 0 ? objData[0] : {});
        console.log('====================================');
        console.log('objData', objData);
        console.log('====================================');
        if (objData.length !== 0) {
          newVitallist.push({
            value: objData[0]?.vitalData[0]?.value,
            label: day.slice(8, 10),
            labelWidth: 50,
            labelTextStyle: {color: 'gray', fontSize: 10},
            frontColor: objData[0]?.isCritical ? '#F44336' : '#00D685',
            topLabelComponent: () => (
              <Text
                style={{
                  color: 'black',
                  fontSize: 8,
                  // width: 20,
                  // marginLeft: 5,
                  marginBottom: 5,
                  height: 10,
                }}>
                {tempdata[index]?.vitalData[0]?.value}
              </Text>
            ),
            spacing: 20,
          });
        } else {
          newVitallist.push({
            value: 0,
            label: day.slice(8, 10),
            labelWidth: 50,
            labelTextStyle: {color: 'gray', fontSize: 10},
            frontColor: '#2962FF',
            spacing: 20,
          });
        }
      });
    } else {
      console.log(
        'data for the day is : ',
        Object.entries(listData),
        ' and list data is : ',
        listData,
      );
      // Same logic but it is not working like it is working in activities for the day data
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
        for (let k = 0; k < listData?.length; k++) {
          let recordSubmitTime = moment(
            listData[k]?.createdDate.split('T')[1],
            'HH:mm:ss.SS',
          ).format('hh:mm A');
          let currentTime = moment(recordSubmitTime, 'hh:mm A');
          let afterTime = moment(dayFormatSample[j], 'hh:mm A');
          let beforeTime = moment(dayFormatSample[j + 1], 'hh:mm A');
          if (currentTime.isBetween(afterTime, beforeTime)) {
            groupedDayData.push({
              value: listData[k]?.value,
              label: '', //moment(moment(dataResponse?.data[i]?.createdDate)).format('hh:mm A'),
              labelWidth: 20,
              labelTextStyle: {color: 'gray'},
              frontColor: listData[k]?.isCritical ? '#F44336' : '#00D685', //Colors.purpleBar,
              spacing: 20,
              topLabelComponent: () => (
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 8,
                      width: '100%',
                      marginBottom: 5,
                      height: 10,
                      borderColor: 'red',
                      borderWidth: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 8,
                        // width: 20,
                        // marginLeft: 5,
                        marginBottom: 5,
                        height: 10,
                      }}>
                      {listData[k]?.value}
                    </Text>
                  </Text>
                </View>
              ),
            });
          }
        }
        let testData = {
          value: groupedDayData?.length > 0 ? groupedDayData[0]?.value : 0,
          label:
            j === 0
              ? '12A'
              : j === 12
              ? '12P'
              : j === 24
              ? '12A'
              : j % 2 !== 0
              ? ''
              : dayFormatSample[j].split(':')[0],
          spacing: 10,
          labelWidth: 20,
          labelTextStyle: {color: 'gray', fontSize: 10},
          frontColor: groupedDayData[0]?.frontColor,
          topLabelComponent: () => (
            <Text style={{color: 'black', fontSize: 8}}>
              {groupedDayData[0]?.value}
            </Text>
          ),
        };
        stackData.push(testData);
      }
      newVitallist.push(...stackData);
    }
    console.log('The new newVitallist is');

    console.log(newVitallist);
    console.log('====================================');
    console.log('Day type is ', dateType);
    console.log('====================================');
    setbarData(newVitallist);
    console.log('The new barData');
    console.log(barData);
  }

  const setDateTypeFunction = d => {
    console.log('====================================');
    console.log('fetch date type', d);
    console.log('====================================');
    dateType = d;
  };

  const handleValue = React.useCallback(
    newValue => {
      // percentValue = (newValue / vitalSubType?.maxRange) * 100;
      percentValue =
        (newValue / vitalsData?.criticalMaxRange.split('.')[0]) * 100;
      console.log('====================================');
      console.log(
        'New value is :',
        newValue,
        'percentValue in back',
        percentValue,
        'and vital data max value is : ',
        vitalsData?.criticalMaxRange.split('.')[0],
      );
      console.log('====================================');
      console.log('====================================');
      console.log('vitalSubType?.maxRange in back', vitalSubType?.maxRange);
      console.log('====================================');
      setPulsePercentValue(percentValue);
      setPulseRate(newValue);
    },
    [setPulseRate],
  );

  const addVitalHandler = () => {
    measureVitalCall();
  };

  function measureVitalCall() {
    const listObj = [];
    const catData = {
      vitalSubTypeId: vitalSubType.id,
      value: String(pulseRate),
    };
    listObj.push(catData);
    setLoader(true);
    const data = {
      vitalTypeId: vitalsData.id,
      source: OSSource,
      categoryData: listObj,
      createdSource: userProfileData.role === 'Patient' ? 1 : 2,
      dateCreated: moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss.SSS'),
    };
    console.log('addVitalDetails Data', data);
    VitalsService.addVital(data)
      .then(response => {
        setLoader(false);
        console.log('response');
        console.log(response);
        if (response && response.statusCode === 200) {
          setIsEditable(false);
          // if (outOfRange) {
          //   openModal();
          // } else {
          navigation.pop();
          // }
        } else {
          showMessage({
            message: 'Information',
            description:
              'Authentication Failed. Provided information is not verified.',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('error');
        console.log(err);
        showMessage({
          message: 'Info',
          description: err.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }

  const convertUTCDateToAMPM = date => {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    );
    const dateTimeAndroid = moment(new Date(date)).format('A');

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);

    const dateTimeIos = moment(new Date(newDate)).format('A');

    return Platform.OS === 'ios' ? dateTimeIos : dateTimeAndroid;
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
      <MainHeader navigation={navigation} name="Pulse Rate">
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
            dateNameStyle={{color: Colors.black, fontSize: hp(1.3)}}
            disabledDateNameStyle={{color: 'black'}}
            disabledDateNumberStyle={{color: Colors.black, fontSize: hp(1.3)}}
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
            onDateSelected={date => {
              setDate(date);
              getVitalHistory(date);
              setisSelectedDay('Day');
              console.log('====================================');
              console.log(
                'selected date',
                Moment(new Date(date)).format('YYYY-MM-DD'),
              );
              console.log('====================================');
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
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                }}>
                <View
                  style={{
                    paddingRight: hp(10),
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('PulseRateEditScreen', {
                      heading: 'Set Pulse Rate',
                      changeTextTitle: 'Pulse Rate',
                      onChangValue: handleValue,
                      unit: 'bpm',
                      value: pulseRate,
                      maxRange: vitalSubType.maxRange,
                      minRange: vitalSubType.minRange,
                      vitalSubType: vitalSubType,
                      vitalsData: vitalsData,
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
                    source={images.edit_assessment}
                  />
                </TouchableOpacity>
                {/* ) : (
                  <TouchableOpacity
                    onPress={() => {
                      addVitalHandler();
                    }}
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      marginRight: hp(2.5),
                      alignItems: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: hp(2),
                        fontFamily: Fonts.SourceSansRegular,
                        color: Colors.blueTextColor,
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                )} */}
              </View>
              <AnimatedCircularProgress
                size={hp(24)}
                width={7.5}
                fill={pulsePercentValue}
                rotation={360}
                tintColor={Colors.red3}
                backgroundColor={Colors.bleLayer4}>
                {fill => (
                  <View>
                    <SvgCss
                      xml={Svgs.pulse_rate}
                      width={hp(5)}
                      height={hp(5)}
                      fill={Colors.black}
                      // onPress={() => navigation.pop()}
                      style={{marginHorizontal: hp(1.5)}}
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
                      }}>
                      {pulseRate === null
                        ? vitalSubType?.defaultValue
                        : pulseRate}
                      {console.log(
                        'Pulse rate is : ',
                        pulseRate,
                        ' vital subtype value is : ',
                        vitalSubType,
                        'and pulse rate percentage value is : ',
                        Number.isNaN(pulsePercentValue),
                      )}
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
                    justifyContent: 'space-evenly',
                    marginTop: hp(4),
                    marginBottom: hp(0.4),
                  }}>
                  {/* Pulse Rate Box View */}
                  <View
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.6),

                        color: Colors.black,
                      }}>
                      {vitalSubType?.minRange} {''}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2),

                          color: Colors.noRecordFound,
                        }}>
                        bpm
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(1.6),
                        fontWeight: '400',
                        // marginTop: hp(4),
                        // marginBottom: hp(3.1),
                        color: Colors.noRecordFound,
                      }}>
                      Min
                    </Text>
                  </View>
                  {/* Max Pulse Rate Box View */}
                  <View
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.6),

                        color: Colors.black,
                      }}>
                      {vitalSubType?.maxRange} {''}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2),

                          color: Colors.noRecordFound,
                        }}>
                        bpm
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(1.6),
                        fontWeight: '400',
                        // marginTop: hp(4),
                        // marginBottom: hp(3.1),
                        color: Colors.noRecordFound,
                      }}>
                      Max
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <CustomTestChart
              barDataRetrived={barData}
              setDateType={setDateTypeFunction}
              getVitalHistory={getVitalHistory}
              date={date}
              setisSelectedDay={setisSelectedDay}
              isSelectedDay={isSelectedDay}
              maxValue={
                barData?.length === 0
                  ? vitalsData?.criticalMaxRange
                  : parseInt(
                      ([...barData]?.sort((a, b) => b?.value - a?.value))[0]
                        ?.value,
                    ) + 50
              } //{vitalsData.criticalMaxRange}
            />
          </View>
          {/* {vitalsData.value !== null &&
            (vitalsData.value !== '0' || vitalsData.value !== 0) && (
              <>
                <Text
                  style={{
                    color: Colors.noRecordFound,
                    marginVertical: hp(2.5),
                    fontFamily: Fonts.SourceSansRegular,
                    width: '90%',
                    alignSelf: 'center',
                  }}>
                  Last {vitalsData.name} Record
                </Text>
                <View
                  style={{
                    backgroundColor:
                      vitalsData.isCritical === true
                        ? Colors.criticalVital
                        : Colors.white,
                    flexDirection: 'row',
                    // width: '100%',
                    justifyContent: 'space-between',
                    borderWidth: 0,
                    paddingVertical: hp(1.5),
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginHorizontal: hp(2),
                    paddingHorizontal: hp(2),
                    // borderColor: Colors.blueTextColor,
                    borderColor: Colors.line,
                    // position: 'absolute',
                    // bottom: 0,
                  }}>
                  <View
                    style={{
                      // marginVertical: hp(0),
                      // width: '25%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.black4,
                        fontFamily: Fonts.SourceSansBold,
                        // fontSize: hp(3),
                        // justifyContent: 'center',
                        fontSize: hp(2.3),
                      }}>
                      {convertUTCDateToLocalDate(
                        new Date(vitalsData.measuredDate),
                      )}
                    </Text>
                    <Text
                      style={{
                        color: Colors.noRecordFound,
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.3),
                      }}>
                      {convertUTCDateToAMPM(new Date(vitalsData.measuredDate))}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      // flex: 1,
                      // alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.black4,
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.5),
                        textAlign: 'center',
                      }}>
                      {vitalsData.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      // width: '25%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // marginRight: hp(2),
                    }}>
                    <Text
                      style={{
                        color: Colors.black4,
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.3),
                      }}>
                      {vitalsData.name === 'Blood Pressure'
                        ? vitalsData.value === null
                          ? `${0}/${0}`
                          : vitalsData.value
                        : vitalsData.value === null
                        ? 0
                        : vitalsData.value}
                    </Text>
                    <Text
                      style={{
                        color: Colors.noRecordFound,
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.3),
                      }}>
                      {vitalsData.unit}
                    </Text>
                  </View>
                </View>
              </>
            )} */}
        </ScrollView>
      </MainHeader>
    </SafeAreaView>
  );
};

export default VitalPulseRateScreen;

const styles = StyleSheet.create({});
