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

// import renderTitle

const MeasureVitals = props => {
  const {vitalsData} = props.route.params;
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
  useEffect(() => {
    // getDataSetValues(vitalHistory);
    // getDateValues(vitalHistory);
    getVitalHistory(date);
    // setCategoryDataForGraph(vitalHistory)
  }, []);

  function getVitalHistory(date) {
    setLoader(true);
    console.log(
      'Data',
      `/api/Vitals/VitalHistory?VitalTypeId=${vitalData.id}&date=${Moment(
        new Date(date),
      ).format('YYYY-MM-DD')}`,
      date,
    );
    VitalsService.getVitalCategoryHistory(
      vitalData.id,
      Moment(new Date(date)).format('YYYY-MM-DD'),
    )
      .then(response => {
        setLoader(false);
        console.log('getVitalCategoryHistory');
        console.log(JSON.stringify(response));
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
  }
  function getvitalDataForChart(listData) {
    let newVitallist = [
      {
        value: 40,
        label: 'Jan',
        // spacing: 30,
        labelWidth: 20,
        labelTextStyle: {color: 'gray'},
        frontColor: '#177AD5',
        topLabelComponent: () => (
          <Text style={{color: 'black', fontSize: 10}}>50</Text>
        ),
      },
    ];
    console.debug('Just Inside');
    // console.debug(vitalValues);
    Object.keys(listData).map(valAtIndex => {
      newVitallist.push({
        value: listData[valAtIndex].vitalData[0].value,
        label: listData[valAtIndex].vitalData[0].name.slice(0, 6),
        labelWidth: 40,
        // topLabelComponent: () => (
        //   <Text style={{color: 'black', fontSize: 10}}>
        //     {listData[valAtIndex].vitalData[0].value}
        //   </Text>
        // ),
        // spacing: 100,
      });
    });
    console.log('The new newVitallist is');
    console.log(newVitallist);
    setbarData(newVitallist);
    console.log('The new barData');
    console.log(barData);
  }

  return (
    <VitalsHeader navigation={props.navigation} headerName={vitalData.name}>
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
        <ScrollView>
          <Spinner
            visible={loader}
            textContent={'Loading...'}
            textStyle={{color: '#FFF'}}
          />

          {/* CALENDER VIEW */}
          <View
            style={{
              backgroundColor: Colors.backgroundMainLogin,
              width: '100%',
              // height: '20%',
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
              disabledDateNameStyle={{color: 'black'}}
              disabledDateNumberStyle={{color: Colors.black, fontSize: hp(1.3)}}
              style={{
                height: 90,

                width: '95%',

                marginLeft: hp(1),

                padding: hp(1),

                backgroundColor: Colors.BgColor,
              }}
              calendarHeaderStyle={{color: Colors.transparent}}
              calendarColor={Colors.BgColor}
              dateNumberStyle={{
                color: Colors.black,

                paddingTop: hp(1),

                fontSize: hp(1.5),
              }}
              dateNameStyle={{color: Colors.black, fontSize: hp(1.5)}}
              highlightDateNumberStyle={{
                color: Colors.white,

                paddingTop: hp(1),

                fontSize: hp(1.5),
              }}
              highlightDateContainerStyle={{
                backgroundColor: Colors.blueTextColor,
                borderRadius: 17,
                width: 40,
              }}
              highlightDateNameStyle={{
                color: Colors.white,

                fontSize: hp(1.5),
              }}
              iconContainer={{flex: 0.02}}
              selectedDate={date}
              onDateSelected={date => {
                // this.setDate(date); // console.log(date); // this.getTodayMedicationData(date);
                setDate(date);
                getVitalHistory(date);
              }}
            />
          </View>

          {/* Measure & History Card */}
          <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{width: '90%', alignSelf: 'center'}}>
              <VitalsMeasureCard
                vitalData={vitalData}
                setLoader={setLoader}
                sliderValueParent={120}
                navigation={props.navigation}
                openModal={() => onOpen()}
              />
            </View>
            {barData.length > 0 ? (
              /* <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  margin: hp(2),
                }}
                > */

              <CustomTestChart barDataRetrived={barData} />
            ) : (
              <View />
            )}
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

            {vitalData.value !== null &&
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
                        {convertUTCDateToAMPM(new Date(vitalData.measuredDate))}
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
              )}
          </View>
        </ScrollView>
      </View>
    </VitalsHeader>
  );
};
MeasureVitals.navigationOptions = {
  headerShown: false,
};

export default connect()(MeasureVitals);
