import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  PanResponder,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Colors, Svgs} from '../../../../config';
import {Fonts, OSSource} from '../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import VitalsHeader from '../components/VitalsHeader';
import VitalsMeasureCardWeight from '../components/VitalsMeasureCardWeight';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import SeriousCondition from '../../../../../assets/svg/seriousCondition.svg';
import {Modalize} from 'react-native-modalize';
import CalendarStrip from 'react-native-calendar-strip';
import Moment from 'moment';
import VitalsService from '../../../api/vitals';
import CustomTestChart from '../../home/screens/custom_chart';
import VitalsMeasureCardBloodPressure from '../components/VitalsMeasureCardBloodPressure';
import VitalsMeasureCard from '../components/VitalsMeasureCardWeight';
import MainHeader from '../components/MainHeader';
import {showMessage} from 'react-native-flash-message';
import BleConnector from '../../../helpers/BleHelper/BleConnector';
import useBle from '../../../helpers/BleHelper/useBle';
import {BleManager} from 'react-native-ble-plx';

// import renderTitle

const VitalWeightScreen = props => {
  const manager = new BleManager();
  const {scanAndConnect} = useBle();
  let dateType = 0;
  const {vitalsData} = props.route.params;
  const[prevBpValues,setPrevBpValues] = useState(props.route.params.bloodFromHealth[0])
  // const bpReadingFromHealthKit = 
  console.log('====================================');
  console.log('vitaldata', vitalsData);
  // console.log("this is the data coming from healthkit",bpReadingFromHealthKit)
  console.log('====================================');
  const [isStack, setisStack] = useState(true);
  const [vitalData, setvitalData] = useState(vitalsData);
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
  const [deviceName, setDeviceName] = useState('');
  const [isScrollable, setIsScrollable] = useState(true);
  const [sistolic, setSistolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);

  // const [showBottomColor, setshowBottomColor] = useState(true);
  // const [isSelectedDay, setisSelectedDay] = useState('Month');

  const convertUTCDateToLocalDate = date => {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    );
    const dateTimeAndroid = moment(new Date(date)).format('h:mm');

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);

    const dateTimeIos = moment(new Date(newDate)).format('h:mm');

    return Platform.OS === 'ios' ? dateTimeIos : dateTimeAndroid;
  };

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
  function onOpen() {
    modalizeRef.current?.open();
  }

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
  function sendHealthKitDataToDB(){
    const data = {
      vitalTypeId: vitalData.id,
      source: OSSource,
      categoryData: [
        {
          "vitalSubTypeId": 1,
          "value": `${props?.route?.params?.bloodFromHealth[0]?.bloodPressureSystolicValue}`
        },
        {
          "vitalSubTypeId": 2,
          "value": `${props?.route?.params?.bloodFromHealth[0]?.bloodPressureDiastolicValue}`
        }
      ],
      createdSource: 1,
      dateCreated: moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss.SSS'),
    };
    console.log("payload for the api to send health kit data to DB",data)
    VitalsService.addVital(data)
        .then(response => {
         
          console.log("this is the response of api call of send healthkit data to db",response);
          
          
        })
        .catch(err => {
         
          console.log('error in api call of send healthkit data to db');
          console.log(err);
         
        });
  }
  useEffect(() => {
    // getDataSetValues(vitalHistory);
    // getDateValues(vitalHistory);
    getVitalHistory(date);
    sendHealthKitDataToDB()
    // setCategoryDataForGraph(vitalHistory)
  }, []);

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => {
  //       console.log('====================================');
  //       console.log('here in on start');
  //       console.log('====================================');
  //       return true;
  //     },
  //     onMoveShouldSetPanResponder: (_, gesture) => {
  //       console.log('====================================');
  //       console.log('in move responder');
  //       console.log('====================================');
  //       if (gesture?.moveX > gesture?.moveY) {
  //         console.log('====================================');
  //         console.log('here in panResponder');
  //         console.log('====================================');
  //         return false;
  //       }
  //       return true;
  //     },
  //     onStartShouldSetPanResponderCapture: () => {
  //       return false;
  //     },
  //     onMoveShouldSetPanResponderCapture: () => false,
  //     onPanResponderTerminationRequest: () => true,
  //     onShouldBlockNativeResponder: () => false,
  //   }),
  // ).current;

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
          //   'weekday',
          //   moment(new Date(response.data[0].createdDate)).format('dddd'),
          // );
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
  function deviceNameUpdater(val) {
    setDeviceName(val);
    setInterval(() => {
      setSistolic(118);
      setDiastolic(65);
    }, 50000);
  }
  function getvitalDataForChart(listData) {
    if (vitalsData.id === 1) {
      console.log('====================================');
      console.log('log list data', listData);
      console.log('====================================');
      let newVitallist = [];
      let tempdata = [];
      if (dateType === 1) {
        let newDate = moment(date).subtract(7, 'days');
        const days = [];
        // For getting all the days form current day to previous day
        for (let i = 1; i <= 7; i++) {
          newDate = newDate.add(1, 'days');
          const dayName = newDate.format('dddd');
          days.push(dayName);
        }
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
          console.log(
            'Data object for displaying the data of the week : ',
            objData,
          );
          console.log('====================================');
          if (objData.length !== 0) {
            newVitallist.push({
              stacks: [
                {
                  value:
                    objData?.length > 0 ? objData[0]?.vitalData[0]?.value : 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  labelWidth: 20,
                  color: '#2962FF', //: '#00D685'//Colors.purpleBar,
                },
                {
                  value:
                    objData?.length > 0 ? objData[0]?.vitalData[1]?.value : 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  // spacing: 2,
                  labelWidth: 20,
                  color: '#F44336', //: '#00D685'//Colors.purpleBar,
                },
              ],
              label: moment(new Date(objData[0]?.createdDate)).format('ddd'),
              spacing: 18,
              labelTextStyle: {color: 'gray', fontSize: 10},
            });
          } else {
            newVitallist.push({
              stacks: [
                {
                  value: 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  labelWidth: 20,
                  color: '#2962FF', //: '#00D685'//Colors.purpleBar,
                },
                {
                  value: 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  // spacing: 2,
                  labelWidth: 20,
                  color: '#F44336', //: '#00D685'//Colors.purpleBar,
                },
              ],
              label: moment(day, 'dddd').format('ddd'),
              spacing: 18,
              labelTextStyle: {color: 'gray', fontSize: 10},
            });
          }
        });
        // setisStack(false);
      } else if (dateType === 2) {
        let newDate = moment(date).subtract(31, 'days');
        const days = [];
        for (let i = 0; i <= 30; i++) {
          newDate = newDate.add(1, 'days');
          // const dayName = newDate.format('dddd');

          const dayString = newDate.format('YYYY-MM-DD');
          days.push(dayString);
        }
        console.log('====================================');
        console.log('dayname', days);
        console.log('====================================');
        //  New Code According the Day stack data for the Month

        let objData = null;
        days.map((day, index) => {
          console.log('====================================');
          console.log('day in array', day, index);
          console.log('====================================');
          objData = listData.filter((data, index) => {
            if (
              day === moment(new Date(data.createdDate)).format('YYYY-MM-DD')
            ) {
              return data;
            }
          });
          tempdata.push(objData.length !== 0 ? objData[0] : {});
          console.log('====================================');
          console.log('ObjData for the day of the month : ', objData);
          console.log('====================================');

          // changin the flow according to stacks like the data of the week

          // previous code for saving the week data of the chart of blood pressure is starting from the below code
          if (objData.length !== 0) {
            newVitallist.push({
              stacks: [
                {
                  value:
                    objData?.length > 0 ? objData[0]?.vitalData[0]?.value : 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  labelWidth: 20,
                  color: '#2962FF', //: '#00D685'//Colors.purpleBar,
                },
                {
                  value:
                    objData?.length > 0 ? objData[0]?.vitalData[1]?.value : 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  // spacing: 2,
                  labelWidth: 20,
                  color: '#F44336', //: '#00D685'//Colors.purpleBar,
                },
              ],
              label: day.split('-')[2],
              spacing: 18,
              labelTextStyle: {color: 'gray', fontSize: 10},
            });
          } else {
            newVitallist.push({
              stacks: [
                {
                  value: 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  labelWidth: 20,
                  color: '#2962FF', //: '#00D685'//Colors.purpleBar,
                },
                {
                  value: 0,
                  label: '', //j===0?'12A':j===12?'12P':j===24?'12A':j%2!==0?'':(dayFormatSample[j].split(':')[0]),
                  // spacing: 2,
                  labelWidth: 20,
                  color: '#F44336', //: '#00D685'//Colors.purpleBar,
                },
              ],
              label: day.split('-')[2],
              spacing: 18,
              labelTextStyle: {color: 'gray', fontSize: 10},
            });
          }
          // Previous Code for the chart data of the week is End Above
        });
        // New code ends here
      } else {
        console.log(
          'Logs for the response of the day data result for bloodpresure are : ',
          listData,
        );
        console.log(
          '================(Danish Changes Start)====================',
        );
        console.log();

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
              listData[k]?.createdDate?.split('T')[1],
              'HH:mm:ss.SS',
            ).format('hh:mm A');
            let currentTime = moment(recordSubmitTime, 'hh:mm A');
            let afterTime = moment(dayFormatSample[j], 'hh:mm A');
            let beforeTime = moment(dayFormatSample[j + 1], 'hh:mm A');
            if (currentTime.isBetween(afterTime, beforeTime)) {
              console.log('list data before creating the list is : ', listData);
              groupedDayData.push(
                {
                  value: listData[k]?.vitalData[0]?.value,
                  label: '', //moment(moment(dataResponse?.data[i]?.createdDate)).format('hh:mm A'),
                  labelWidth: 20,

                  frontColor: listData[k]?.isCritical ? '#F44336' : '#00D685', //Colors.purpleBar,
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
                      {/* {listData[k]?.value} */}
                      {listData[k].vitalData[0].value}
                    </Text>
                  ),
                },
                {
                  value: listData[k]?.vitalData[1].value,
                  label: '', //moment(moment(dataResponse?.data[i]?.createdDate)).format('hh:mm A'),
                  labelWidth: 20,
                  frontColor: listData[k]?.isCritical ? '#F44336' : '#00D685', //Colors.purpleBar,
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
                      {/* {listData[k]?.value} */}
                      {listData[k].vitalData[1].value}
                    </Text>
                  ),
                },
              );
            }
          }
          console.log(`Group data for the day is : ${j} `, groupedDayData);

          // Stack data test
          let dayStack = {
            stacks: [
              {
                value:
                  groupedDayData?.length > 0 ? groupedDayData[0]?.value : 0,
                label: '',
                labelWidth: 20,
                color: '#2962FF',
              },
              {
                value:
                  groupedDayData?.length > 0 ? groupedDayData[1]?.value : 0,
                label: '',
                labelWidth: 20,
                color: '#F44336',
              },
            ],
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
            labelTextStyle: {color: 'gray', fontSize: 10},
          };
          //  console.log('Test data for the diastolic : ',testData,'Test data for the saystolic : ',testData2);
          stackData.push(dayStack);
        }
        newVitallist.push(...stackData);
        // console.log('Vital list is : ',newVitallist)

        setisStack(true);

        console.log(
          '=================(Danish Changes ENDS)===================',
        );
      }
      console.log('The new newVitallist is');
      console.log(newVitallist);
      setbarData(newVitallist);
      console.log('The new barData');
      console.log(barData);
    } else {
      let newVitallist = [];
      console.debug('Just Inside');
      // console.debug(vitalValues);
      Object.keys(listData).map(valAtIndex => {
        newVitallist.push({
          value: listData[valAtIndex].value,
          label: moment(new Date(listData[valAtIndex].createdDate)).format(
            'hh:mm A',
          ),
          labelWidth: 50,
          labelTextStyle: {color: 'grey', fontSize: 10},
          frontColor: listData[valAtIndex].isCritical ? '#F44336' : '#00D685',
        });
      });
      console.log('The new newVitallist is');
      console.log(newVitallist);
      setbarData(newVitallist);
      console.log('The new barData');
      console.log(barData);
    }
  }

  const setDateTypeFunction = d => {
    console.log('====================================');
    console.log('fetch date type', d);
    console.log('====================================');
    dateType = d;
    // if(dateType !== 0)
    // {
    //   setisStack(false);
    // }
    // else
    // {
    //   setisStack(true);
    // }
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
      <MainHeader navigation={props.navigation} name="Blood Pressure">
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
            onTouchStart={() => {
              console.log('====================================');
              console.log('on Touch start in main scroll view');
              console.log('====================================');
            }}
            onTouchCancel={() => {
              console.log('====================================');
              console.log('on Touch cancel in main scroll view');
              console.log('====================================');
            }}
            onTouchMove={() => {
              console.log('====================================');
              console.log('on Touch Move in main scroll view');
              console.log('====================================');
            }}
            onTouchEnd={() => {
              console.log('====================================');
              console.log('on Touch end in main scroll view');
              console.log('====================================');
            }}
            contentContainerStyle={{paddingBottom: hp(2)}}
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
                  sliderValueSystolic={sistolic}
                  sliderValueDiastolic={diastolic}
                  navigation={props.navigation}
                  openModal={() => onOpen()}
                  showLine={false}
                  setIsScrollable={scrollEnabled}
                  isScrollable={isScrollable}
                />
              </View>

              {console.log('date type is : ', dateType)}
              <View>
                <CustomTestChart
                  isstackData={isStack}
                  barDataRetrived={barData}
                  setDateType={setDateTypeFunction}
                  getVitalHistory={getVitalHistory}
                  date={date}
                  setisSelectedDay={setisSelectedDay}
                  isSelectedDay={isSelectedDay}
                  maxValue={barData?.length === 0 ? 260 : 260 + 10 + (120 + 10)}
                  setIsScrollable={scrollEnabled}
                />
              </View>
              <View />
              {vitalData.name === 'Blood Pressure' && (
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

                      {deviceName === '' ? (
                        <TouchableOpacity
                          style={{flexDirection: 'row', alignItems: 'center'}}
                          onPress={() => {
                            manager.onStateChange(state => {
                              console.log(
                                '====================================',
                              );
                              console.log('in connection state', state);
                              console.log(
                                '====================================',
                              );
                              if (state === 'PoweredOn') {
                                console.log(
                                  '====================================',
                                );
                                console.log('in powered on state');
                                console.log(
                                  '====================================',
                                );
                                scanAndConnect(manager, deviceNameUpdater);
                              }
                            }, true);
                            // scanAndConnect();
                          }}>
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
                      ) : (
                        <Text
                          style={{
                            color: Colors.blueTextColor,
                            marginBottom: hp(1.5),
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.2),
                          }}>
                          Connected To {deviceName}
                        </Text>
                      )}
                      {sistolic > 120 || sistolic < 120 ? (
                        <Text
                          style={{
                            color: Colors.black,
                            marginBottom: hp(1.5),
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.2),
                          }}>
                          {sistolic} / {diastolic}
                        </Text>
                      ) : (
                        <Text></Text>
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </MainHeader>
    </SafeAreaView>
  );
};
VitalWeightScreen.navigationOptions = {
  headerShown: false,
};

export default connect()(VitalWeightScreen);
