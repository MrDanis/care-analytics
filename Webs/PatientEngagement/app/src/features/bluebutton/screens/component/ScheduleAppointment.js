import React, {Component, Fragment, useState, useRef} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
  Image,
  PanResponder,
  Pressable,
} from 'react-native';
import {Colors, Images, Svgs} from '../../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import {SvgCss} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import UserBlue from '../../../../../../assets/svg/UserBlue.svg';
import ClockBlue from '../../../../../../assets/svg/ClockBlue.svg';
import CalendarStrip from 'react-native-calendar-strip';
import Moment from 'moment';
import {Modalize} from 'react-native-modalize';
import ShareSuccess from '../../../../../../assets/svg/ShareSuccess.svg';
import AppointmentService from '../../../../api/appointment';
import {showMessage} from 'react-native-flash-message';
const ScheduleAppointment = ({navigation}) => {
  const [selectPhysicianScreen, setSelectPhysicianScreen] = useState(true);
  const [dateScreen, setDateScreen] = useState(false);
  const [confirmationScreen, setConfirmationScreen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [timeSelected, setTimeSelected] = useState(null);

  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    Moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );

  const [data, setData] = useState([
    {
      id: 1,
      title: 'Michelle Fleming ',
      time: '2:30 PM - 4:30 PM',
    },
    {
      id: 2,
      title: 'Julie Stark',
      time: '9:30 AM - 10:30 AM',
    },
  ]);
  const [timeArr, setTimeArr] = useState([
    {id: 1, time: '09:00', disabled: true},
    {id: 2, time: '11:00', disabled: false},
    {id: 3, time: '13:00', disabled: false},
    {id: 4, time: '14:00', disabled: false},
    {id: 5, time: '16:00', disabled: false},
    {id: 6, time: '18:00', disabled: false},
    {id: 7, time: '20:00', disabled: true},
    {id: 8, time: '22:00', disabled: false},
    {id: 9, time: '23:00', disabled: true},
    {id: 10, time: '00:30', disabled: true},
    {id: 11, time: '02:00', disabled: false},
    {id: 12, time: '03:00', disabled: false},
    {id: 13, time: '04:00', disabled: false},
    {id: 14, time: '06:00', disabled: false},
    {id: 15, time: '07:00', disabled: false},
    {id: 16, time: '08:00', disabled: false},
  ]);
  const modalize = useRef(null);
  const renderSeparator = () => {
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          marginTop: hp(1.7),
        }}>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.line,
            width: Platform.OS === 'ios' ? '76%' : '77%',
          }}
        />
      </View>
    );
  };
  const handleDateSelected = date => {
    setSelectedDate(date);
    console.log('Selected date:', date);
    console.log('====================================');
    console.log(selectedDate);
    console.log('====================================');
  };
  function onOpen() {
    modalize.current?.open();
  }

  function onClose() {
    modalize.current?.close();
  }
  const scheduleAppointmentCall = () => {
    let dataForApi = {};
    dataForApi = {
      id: selectedPhysician?.id,
      title: selectedPhysician?.title,
      time: timeSelected?.time,
    };

    AppointmentService.addAppointment(dataForApi)
      .then(response => {
        console.log('response from schedule api is here', response);
        if (response && response.statusCode === 200 && response.data) {
          // dispatch(getUserProfile(response.data));
          // resetProfieStack()
          setLoader(false);
          onClose();
          showMessage({
            message: 'Success',
            description: 'Appointment has been saved successfully',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.green,
          });
          navigation.navigate('AppointmentScreen');
        } else {
          console.log('====================================');
          console.log('response error', response);
          console.log('====================================');
          alert(response.Error.ErrorMessage);
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('error from api error');
        console.log(err);
        showMessage({
          message: err.title,
          description: err.detail,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };
  return (
    <Fragment>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
        <Spinner
          visible={loader}
          textContent={'Please Wait....'}
          textStyle={{color: '#FFF'}}
        />
        <Modalize
          ref={modalize}
          adjustToContentHeight={true}
          backgroundColor={Colors.black2}
          withHandle={true}
          modalStyle={{
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
          }}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: hp(4),
            }}>
            <ShareSuccess />
            <Text
              style={{
                fontFamily: Fonts.SourceSansBold,
                fontSize: hp(3),
                marginTop: hp(2.2),
              }}>
              Confirmation
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              marginTop: hp(1.5),
              marginHorizontal: hp(3),
            }}>
            <View style={{marginTop: hp(2.5)}}>
              <Text
                style={{
                  color: Colors.noRecordFound,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                }}>
                Patient Name
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SFProSemibold,
                  fontSize: hp(2.2),
                }}>
                Michelle Fleming
              </Text>
            </View>
            <View style={{marginTop: hp(2.5)}}>
              <Text
                style={{
                  color: Colors.noRecordFound,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                }}>
                Physician Name
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SFProSemibold,
                  fontSize: hp(2.2),
                }}>
                Julie Stark
              </Text>
            </View>
            <View style={{marginTop: hp(2.5)}}>
              <Text
                style={{
                  color: Colors.noRecordFound,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                }}>
                Date/Time
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SFProSemibold,
                  fontSize: hp(2.2),
                }}>
                Sep 02,2020 - 09:00 AM
              </Text>
            </View>
            <View style={{marginTop: hp(2.5)}}>
              <Text
                style={{
                  color: Colors.noRecordFound,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                }}>
                Patient Email
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SFProSemibold,
                  fontSize: hp(2.2),
                }}>
                MichelleFleming@gmail.com
              </Text>
            </View>
            <View style={{marginTop: hp(2.5)}}>
              <Text
                style={{
                  color: Colors.noRecordFound,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                }}>
                Patient Phone Number
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SFProSemibold,
                  fontSize: hp(2.2),
                }}>
                (961) 555-1101
              </Text>
            </View>
          </View>
          <View style={{marginTop: hp(13)}}>
            <View
              style={{
                borderRadius: hp(1),
                marginHorizontal: hp(2.2),
                marginBottom: hp(3.2),
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  setDateScreen(false);
                  setSelectPhysicianScreen(true);
                  setSelectedPhysician(null);
                }}
                style={{
                  borderRadius: hp(1),
                  flex: 1,
                  height: hp(6.5),
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.bleLayer3,
                }}>
                <Text
                  style={{
                    color: Colors.blueTextColor,
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.2),
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
              <View style={{flex: 0.1}}></View>
              <TouchableOpacity
                onPress={() => {
                  setLoader(true);
                  scheduleAppointmentCall();
                }}
                style={{
                  borderRadius: hp(1),
                  flex: 1,

                  height: hp(6.5),
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.blueTextColor,
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.2),
                  }}>
                  Book Appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modalize>
        {/* Header */}
        <View
          style={{
            // borderWidth: 1,
            // borderColor: 'red',
            backgroundColor: Colors.BgColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              height: hp(7.5),
              borderBottomWidth: 0.5,
              borderColor: Colors.BgColor,
              backgroundColor: Colors.BgColor,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Text
                style={{
                  fontFamily: 'WisemanPTSymbols',
                  marginLeft: heightPercentageToDP(2),
                  marginRight: heightPercentageToDP(1),
                  fontSize: hp(5),

                  color: Colors.black1,
                }}>
                W
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Fonts.SourceSansSemibold,
                textAlign: 'center',
                fontSize: hp(2.5),
                color: Colors.black,
                flex: 1,
              }}>
              Schedule Appointment
            </Text>

            <View style={{flex: 0.2, alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NotificationStack')}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginRight: heightPercentageToDP(2),
                  }}>
                  <FastImage
                    style={{
                      width: hp(2),
                      height: hp(2.5),
                      // marginRight:-20,
                      // marginHorizontal: hp(3),
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
                      onPress={() => this.props.navigation.pop()}
                      style={{marginHorizontal: hp(1.5)}}
                    />
                  </TouchableOpacity> */}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* select Physician */}
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            marginTop: hp(2),
            borderTopLeftRadius: hp(2.5),
            borderTopRightRadius: hp(2.5),
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
          }}>
          {selectPhysicianScreen === true ? (
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp(4.2),
                  marginBottom: hp(3.5),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.black,
                    fontSize: hp(2.5),
                  }}>
                  Select Physician
                </Text>
              </View>
              <FlatList
                contentContainerStyle={{marginHorizontal: hp(1)}}
                data={data}
                // onEndReached={({distanceFromEnd}) => {
                //   console.log('Distance', distanceFromEnd);
                //   if (
                //     !this.state.showLoader &&
                //     this.state.pageNumber !== 0 &&
                //     parseInt(distanceFromEnd) >= 0
                //   ) {
                //     this.state.historyList.length > 0 &&
                //       this.getModuleHistory('get');
                //   }
                // }}
                // onEndReachedThreshold={0.05}
                ItemSeparatorComponent={renderSeparator}
                renderItem={({item}) => {
                  return (
                    <View style={{paddingTop: hp(1)}}>
                      {/* {console.log('item being recivedd', item)} */}

                      <TouchableOpacity
                        onPress={() => {
                          setSelectPhysicianScreen(false);
                          setDateScreen(true);
                          console.log('ok lets move');
                          setSelectedPhysician(item);
                        }}>
                        <View style={{}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: hp(1),
                              alignItems: 'center',
                              // borderWidth: 1,
                              // marginTop: hp(1.5),
                            }}>
                            <View
                              style={{
                                borderRadius: hp(1),
                                // backgroundColor: Colors.bleLayer4,
                                marginHorizontal: hp(2),
                                paddingVertical: hp(1.5),
                                marginTop: hp(0.5),
                                width: Platform.OS === 'ios' ? hp(6.5) : hp(7),
                                height:
                                  Platform.OS === 'android' ? hp(7) : hp(6.5),
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <UserBlue
                                height="50"
                                width="50"
                                style={{marginHorizontal: hp(2)}}
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'column',
                                width: '75%',
                                alignItems: 'flex-start',
                                justifyContent: 'space-around',
                              }}>
                              <Text
                                style={{
                                  fontSize: hp(2.2),
                                  fontFamily: Fonts.SourceSansSemibold,
                                  color: Colors.black,
                                  marginTop: hp(0.3),
                                }}>
                                {item.title}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  // marginTop: hp(0.5),
                                }}>
                                <Text
                                  style={{
                                    fontSize: hp(2),
                                    fontFamily: Fonts.SourceSansRegular,
                                    color: Colors.noRecordFound,
                                    marginTop:
                                      Platform.OS === 'ios' ? hp(0.5) : hp(0),
                                    minWidth: '30%',
                                  }}>
                                  Cardiologist
                                </Text>
                                <ClockBlue
                                  height="18"
                                  width="18"
                                  style={{
                                    marginHorizontal: hp(0.8),
                                    marginTop:
                                      Platform.OS === 'ios' ? hp(0.5) : hp(0),
                                  }}
                                />

                                <Text
                                  style={{
                                    fontSize: hp(2),
                                    fontFamily: Fonts.SourceSansRegular,
                                    color: Colors.noRecordFound,
                                    marginTop:
                                      Platform.OS === 'ios' ? hp(0.5) : hp(0),
                                  }}>
                                  {item.time}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : dateScreen === true ? (
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.black,
                    fontSize: hp(2.5),
                  }}>
                  Select your Date
                </Text>
              </View>
              {/* Calender */}
              <View>
                <CalendarStrip
                  scrollable
                  leftSelector={[]}
                  rightSelector={[]}
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
                  calendarColor={Colors.white}
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
                    // width: Platform.OS === 'ios' ? hp(5.2) : hp(5.5),
                    // height: Platform.OS === 'ios' ? hp(5.2) : hp(5.6),
                    // marginTop: -hp(0.2),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  highlightDateNameStyle={{
                    color: Colors.white,
                    fontSize: hp(1.3),
                  }}
                  iconContainer={{flex: 0.02}}
                  selectedDate={selectedDate}
                  // onDateSelected={date => {
                  //   setSelectedDate(date);
                  //   console.log(
                  //     'this is the selected date that os brimg ',
                  //     selectedDate,
                  //   );
                  //   // this.getTodayMedicationData(date);
                  // }}
                  onDateSelected={date => handleDateSelected(date)}
                />
              </View>
              <View
                style={{
                  borderTopColor: Colors.line,
                  borderTopWidth: hp(0.2),
                  marginTop: hp(3),
                }}></View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.black,
                    fontSize: hp(2.5),
                  }}>
                  Select your Time
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(1.5),
                  marginHorizontal: hp(1),
                  justifyContent: 'space-between',
                }}>
                {timeArr.map(item => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (item.disabled === false) {
                          setTimeSelected(item);
                        }
                      }}>
                      <View
                        style={{
                          borderWidth: 1,
                          backgroundColor:
                            item.disabled === true
                              ? Colors.line
                              : item.id === timeSelected?.id
                              ? Colors.blueTextColor
                              : Colors.bleLayer4,
                          // padding: hp(1.2),
                          width: hp(9),
                          height: hp(6),
                          borderColor: Colors.bleLayer3,
                          margin: hp(1),
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: hp(1.2),
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            // color: Colors.blueTextColor,
                            color:
                              item.disabled === true
                                ? Colors.blueGrayDisableText
                                : item.id === timeSelected?.id
                                ? Colors.white
                                : Colors.blueTextColor,
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.2),
                          }}>
                          {item.time}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              <View
                style={{
                  borderRadius: hp(1),
                  marginTop: hp(4),
                  marginHorizontal: hp(3.5),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (timeSelected != null) {
                      onOpen();
                    } else {
                      alert('Select Time');
                    }
                  }}
                  style={{
                    borderRadius: hp(1),

                    height: hp(6.5),
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.blueTextColor,
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.2),
                    }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default ScheduleAppointment;
