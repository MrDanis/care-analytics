import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Colors, Svgs} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import VitalsHeader from '../components/VitalsHeader';
import VitalsMeasureCard from '../components/VitalsMeasureCardWeight';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import SeriousCondition from '../../../../../assets/svg/seriousCondition.svg';
import {Modalize} from 'react-native-modalize';
import CalendarStrip from 'react-native-calendar-strip';
import Moment from 'moment';
import VitalsService from '../../../api/vitals';
import Images from '../../../../config/Images';
import CustomTestChart from '../../home/screens/custom_chart';
import MainHeader from '../components/MainHeader';

// import renderTitle

const VitalTemperatureScreen = props => {
  let dateType = 0;
  const {vitalsData} = props.route.params;
  console.log('====================================');
  console.log('vitalsData', vitalsData);
  console.log('====================================');
  const [vitalData, setvitalData] = useState(vitalsData);
  // const [dateType, setDateType] = useState(0);
  const TODAY = moment(vitalData.measuredDate).format('YYYY-MM-DD');
  const YESTERDAY = moment(vitalData.measuredDate)
    .subtract(1, 'days')
    .format('YYYY-MM-DD');
  const [loader, setLoader] = useState(false);
  const modalizeRef = useRef(Modalize);
  const homeApiData = useSelector(state => state.homeApiData);
  const [date, setDate] = useState(
    Moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );
  const [barData, setbarData] = useState([]);
  const [isSelectedDay, setisSelectedDay] = useState('Day');
  const [isScrollable, setIsScrollable] = useState(true);
  // const [showBottomColor, setshowBottomColor] = useState(true);
  // const [isSelectedDay, setisSelectedDay] = useState('Month');

  function onClose() {
    modalizeRef.current?.close();
    props.navigation.pop();
  }
  function dialCall(number) {
    console.log('CareManager Phone Number', number);
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
    onClose();
  }
  useEffect(() => {
    // getDataSetValues(vitalHistory);
    // getDateValues(vitalHistory);
    getVitalHistory(date);
    // setCategoryDataForGraph(vitalHistory)
  }, []);

  const getVitalHistory = date => {
    setLoader(true);
    console.log(
      'Data',
      `/api/Vitals/VitalHistory?VitalTypeId=${vitalData.id}&date=${Moment(
        new Date(date),
      ).format('YYYY-MM-DD')}`,
      date,
    );
    console.log('====================================');
    console.log('date ttype in history function', dateType);
    console.log('====================================');
    VitalsService.getVitalCategoryHistory(
      vitalData.id,
      Moment(new Date(date)).format('YYYY-MM-DD'),
      dateType,
    )
      .then(response => {
        setLoader(false);
        console.log('getVitalCategoryHistory');
        console.log(response);
        if (response && response.statusCode === 200) {
          getvitalDataForChart(response.data);
          // console.log('====================================');
          // console.log(
          //   'date get by history',
          //   moment(new Date(response.data[0].createdDate)).toLocaleString(),
          // );
          // console.log('====================================');
          // const isoString = moment(
          //   new Date(response.data[0].createdDate),
          // ).toLocaleString();
          // console.log('====================================');
          // const momentDate = moment(isoString);
          // const localTime = momentDate.tz('Pakistan/Islamabad');
          // console.log('====================================');
          // console.log('after convertion', localTime);
          // console.log('====================================');
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
            labelTextStyle: {color: 'grey', fontSize: 10},
            frontColor: objData[0]?.isCritical ? '#F44336' : '#00D685',
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
                  <Text>{tempdata[index]?.vitalData[0]?.value}</Text>
                </Text>
              </View>
            ),
            spacing: 23,
          });
        } else {
          newVitallist.push({
            value: 0,
            label: day.slice(0, 3),
            labelWidth: 40,
            labelTextStyle: {color: 'grey', fontSize: 10},
            frontColor: '#2962FF',
            spacing: 23,
          });
        }
      });
    } else if (dateType === 2) {
      console.log('====================================');
      console.log('dateType', dateType);
      console.log('====================================');
      let newDate = moment(date).subtract(30, 'days');
      const days = []; //getting all the dates of the month
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
      // Mapping through all the dates of the month along with the api data in response
      days.map((day, index) => {
        console.log('====================================');
        console.log('day in array', day, index);
        console.log('====================================');
        //
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
            labelTextStyle: {color: 'grey', fontSize: 10},
            frontColor: objData[0]?.isCritical ? '#F44336' : '#00D685',
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
                  <Text>{tempdata[index]?.vitalData[0]?.value}</Text>
                </Text>
              </View>
              // <Text
              //   style={{
              //     color: 'black',
              //     fontSize: 8,
              //     // width: 20,
              //     // marginLeft: 5,
              //     marginBottom: 5,
              //     height: 10,
              //   }}>
              //   {tempdata[index]?.vitalData[0]?.value}
              // </Text>
            ),
            spacing: 23,
          });
        } else {
          newVitallist.push({
            value: 0,
            label: day.slice(8, 10),
            labelWidth: 50,
            labelTextStyle: {color: 'grey', fontSize: 10},
            frontColor: '#2962FF',
            spacing: 23,
          });
        }
      });
    } else {
      console.log('data before changing is : ', listData);
      //  Change In code with new Flow By Danish(Start)
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
              labelTextStyle: {color: 'gray', fontSize: 10},
              frontColor: listData[k]?.isCritical ? '#F44336' : '#00D685', //Colors.purpleBar,
              topLabelComponent: () => (
                <View>
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
        console.log(`Group data for the day is : ${j} `, groupedDayData);
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
          frontColor: groupedDayData[0]?.frontColor, //'#F44336', //: '#00D685'//Colors.purpleBar,
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
                <Text style={{color: 'black', fontSize: 8}}>
                  {groupedDayData[0]?.value}
                </Text>
              </Text>
            </View>
          ),
        };
        console.log(testData);
        stackData.push(testData);
      }

      console.log('Data fro the day in the Temprature is : ', stackData);

      newVitallist.push(...stackData);

      //  Change In code with new Flow By Danish(Start)
      // Object.keys(listData).map(valAtIndex => {
      //   newVitallist.push({
      //     value: listData[valAtIndex].value,
      //     label: moment(new Date(listData[valAtIndex].createdDate)).format(
      //       'hh:mm A',
      //     ),
      //     labelWidth: 40,
      //     labelTextStyle: {color: 'grey', fontSize: 9},
      //     frontColor: listData[valAtIndex].isCritical ? '#F44336' : '#00D685',
      //     // topLabelComponent: () => (
      //     //   <Text style={{color: 'black', fontSize: 10}}>
      //     //     {listData[valAtIndex].vitalData[0].value}
      //     //   </Text>
      //     // ),
      //     // spacing: 100,
      //   });
      // });
    }
    console.log('The new newVitallist is');
    console.log(newVitallist);
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

  const scrollEnabled = isScroll => {
    console.log('====================================');
    console.log('isScroll', isScroll);
    console.log('====================================');
    setIsScrollable(isScroll);
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
      <MainHeader navigation={props.navigation} name="Temperature">
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
          modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
          <View style={{padding: hp(3)}}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: hp(1),
              }}>
              <SeriousCondition />
              <Text
                style={{
                  fontFamily: Fonts.SourceSansBold,
                  fontSize: hp(3),
                  flex: 1,
                  color: Colors.black1,
                  marginTop: hp(1),
                  marginLeft: hp(2),
                }}>
                Serious Condition
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(1.8),
                  flex: 1,
                  color: Colors.black,
                  marginTop: hp(1),
                  marginLeft: hp(2),
                  textTransform: 'uppercase',
                }}>
                Please contact your care manager
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                marginTop: hp(1),
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  dialCall(homeApiData.common.careManagerPhone);
                }}
                style={{
                  flexDirection: 'row',
                  marginTop: hp(2),
                  marginBottom: hp(2),
                  marginRight: hp(3),
                  width: '100%',
                  borderWidth: 1,
                  height: 50,
                  borderColor: Colors.blueTextColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor: Colors.blueRxColor,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    fontSize: hp(2.2),
                    flex: 1,
                    color: Colors.white,
                    textAlign: 'center',
                  }}>
                  Contact
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                }}
                style={{
                  flexDirection: 'row',
                  // marginBottom: hp(2),
                  width: '100%',
                  height: 50,
                  backgroundColor: Colors.criticalVital,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    fontSize: hp(2.2),
                    flex: 1,
                    color: Colors.red,
                    textAlign: 'center',
                  }}>
                  Contact Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>
        <View style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
          <View style={{backgroundColor: Colors.BgColor}}>
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
              // onPressDate={date => {
              //   console.log('====================================');
              //   console.log('selected date', date);
              //   console.log('====================================');
              // }}
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
            style={{marginBottom: hp(2)}}
            scrollEnabled={Platform.OS === 'android' ? isScrollable : true}
            nestedScrollEnabled={true}>
            <Spinner
              visible={loader}
              textContent={'Loading...'}
              textStyle={{color: '#FFF'}}
            />

            {/* CALENDER VIEW */}

            {/* Measure & History Card */}
            <View style={{width: '100%', alignSelf: 'center'}}>
              <View style={{width: '90%', alignSelf: 'center'}}>
                <VitalsMeasureCard
                  vitalData={vitalData}
                  setLoader={setLoader}
                  sliderValueParent={vitalData.value}
                  navigation={props.navigation}
                  openModal={() => onOpen()}
                  showLine={false}
                  setIsScrollable={scrollEnabled}
                  isScrollable={isScrollable}
                />
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
                setIsScrollable={scrollEnabled}
              />
              {vitalData.name === 'Blood Pressure' ||
                (vitalData.name === 'Weight' && (
                  <>
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
                      <Text
                        style={{
                          color: Colors.noRecordFound,
                          marginVertical: hp(1),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Connected Devices
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          backgroundColor: Colors.white,
                          // marginLeft: hp(1),
                          alignItems: 'center',
                          marginTop: hp(1),
                          borderRadius: 8,
                        }}>
                        {vitalData.name === 'Weight' ? (
                          <FastImage
                            style={{
                              width: 40,
                              height: 40,
                              marginTop: hp(2.8),
                            }}
                            resizeMode="contain"
                            // source={require('../../../../../assets/images/icon_connect_device.png')}
                            source={require('../../../../../assets/images/connect_body_weight.png')}
                          />
                        ) : (
                          <FastImage
                            style={{
                              width: 40,
                              height: 40,
                              marginVertical: hp(1.5),
                            }}
                            resizeMode="contain"
                            source={require('../../../../../assets/images/icon_connect_device.png')}
                            // source={require('../../../../../assets/images/connect_body_weight.png')}
                          />
                        )}
                        {/* <View
                          style={{
                            borderWidth: 0.5,
                            borderColor: Colors.line,
                            width: '100%',
                          }}
                        /> */}
                        <TouchableOpacity
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
                  </>
                ))}

              {/* {vitalData.value !== null &&
                (vitalData.value !== '0' || vitalData.value !== 0) && (
                  <>
                    <Text
                      style={{
                        color: Colors.noRecordFound,
                        marginVertical: hp(2.5),
                        fontFamily: Fonts.SourceSansRegular,
                        width: '90%',
                        alignSelf: 'center',
                      }}>
                      Last {vitalData.name} Record
                    </Text>
                    <View
                      style={{
                        backgroundColor:
                          vitalData.isCritical === true
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
                            new Date(vitalData.measuredDate),
                          )}
                        </Text>
                        <Text
                          style={{
                            color: Colors.noRecordFound,
                            fontFamily: Fonts.SourceSansSemibold,
                            fontSize: hp(2.3),
                          }}>
                          {convertUTCDateToAMPM(
                            new Date(vitalData.measuredDate),
                          )}
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
                          {vitalData.name}
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
                          {vitalData.name === 'Blood Pressure'
                            ? vitalData.value === null
                              ? `${0}/${0}`
                              : vitalData.value
                            : vitalData.value === null
                            ? 0
                            : vitalData.value}
                        </Text>
                        <Text
                          style={{
                            color: Colors.noRecordFound,
                            fontFamily: Fonts.SourceSansSemibold,
                            fontSize: hp(2.3),
                          }}>
                          {vitalData.unit}
                        </Text>
                      </View>
                    </View>
                  </>
                )} */}
            </View>
          </ScrollView>
        </View>
      </MainHeader>
    </SafeAreaView>
  );
};

export default connect()(VitalTemperatureScreen);
