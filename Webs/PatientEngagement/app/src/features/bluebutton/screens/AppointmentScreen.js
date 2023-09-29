/* istanbul ignore file */
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
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts} from '../../../../config/AppConfig';
import RightIcon from '../../../../../assets/svg/icon_arrow_right.svg';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import {getAppointmentHistory} from '../action';
import BlueButtonService from '../../../api/bluebutton';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import EmptyIcon from '../../../../../assets/svg/empty_norecords.svg';
import Share from 'react-native-share';
import EmailPopover from './component/EmailPopover';
import {showMessage} from 'react-native-flash-message';
import Images from '../../../../config/Images';
import {Svgs} from '../../../../config';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import AppointmentSlideComponent from './component/AppointmentCard';
import colors from '../../../../config/Colors';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';
import Moment from 'moment';
import AppointmentIcon from '../../../../../assets/svg/AppointmentIcon.svg';

const data = [
  {key: 'A', name: 'Coverage'},
  {key: 'B', name: 'Medication'},
  {key: 'C', name: 'Appointments'},
  {key: 'D', name: 'My Providers'},
  {key: 'E', name: 'Diseases'},
  {key: 'F', name: 'Allergies'},
  {key: 'G', name: 'Procedures'},
  {key: 'H', name: 'Hospital Visits'},
];
class AppointmentScreen extends Component {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      modalVisible: false,
      emailID: '',
      appointmentHistory: [],
      timeNoAction: this.props.appLogoutTime,
      upcoming: true,
      completed: false,
      missed: false,
      activeIndex: 0,
      upcomingAppointmentData: [],
    };
  }

  // const [index, setIndex] = useState(0);
  // const isCarousel = useRef(null);
  componentWillMount(): void {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      async () => {
        console.log('backin willMount');
        this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: () => {
            console.log('event');
            this.setState({scroll: true});
            this.resetTimer();
            return true;
          },
          onMoveShouldSetPanResponder: (evt, gesture) => {
            // if (gesture?.moveX > gesture?.moveY) {
            //   this.resetTimer();
            //   return false;
            // }
            // this.resetTimer();
            return gesture.dx != 0 && gesture.dy != 0;
          },
          onStartShouldSetPanResponderCapture: () => {
            console.log('aaaaaaaaaaß');
            this.resetTimer();
            return false;
          },
          onMoveShouldSetPanResponderCapture: () => false,
          onPanResponderTerminationRequest: () => {
            console.log('in onPanResponderTerminationRequest');
            return true;
          },
          onShouldBlockNativeResponder: () => false,
          onPanResponderGrant: () => {
            console.log('in onPanResponderGrant');
            this.setState({scroll: false});
          },
          onPanResponderMove: () => {
            console.log('in onPanResponderMove');
            this.setState({scroll: true});
          },
          onPanResponderRelease: () => {
            console.log('in onPanResponderRelease');
            this.setState({scroll: true});
          },
          onPanResponderEnd: (e, gestureState) => {
            console.log('onPanResponderEnd');
            this.setState({scroll: true});
          },
        });
        this.timer = setTimeout(
          () => this.setState({show: true}),
          this.state.timeNoAction,
        );
      },
    );
  }
  componentDidMount(): void {
    this.setState({showLoader: true});
    BlueButtonService.getAppointmentHistory()
      .then(response => {
        this.setState({showLoader: false});
        console.log('getAppointmentHistory');
        console.log(response);
        if (response) {
          if (response.statusCode === true) {
            console.log('====================================');
            console.log('hehe', response.data);
            console.log('====================================');
            this.props.dispatch(getAppointmentHistory(response.data));
            this.setState({appointmentHistory: response.data});
          } else {
            this.props.dispatch(getAppointmentHistory([]));
            this.setState({appointmentHistory: []});
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getAppointmentHistoryError');
        console.log(error);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }

  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
    this.resetTimer();
  }
  resetTimer() {
    console.log('reset');
    clearTimeout(this.timer);
    if (this.state.show) {
      this.setState({show: false});
    }
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  isTodayYesterday = date => {
    console.log('this is the date thats being recieved in is today', date);
    let today = Moment().format('YYYY-MM-DD');
    console.log('this is todays result', today);
    let yesterday = Moment().subtract(1, 'day').format('YYYY-MM-DD');
    console.log('this is yesterday result', yesterday);

    const formattedDate = Moment(date).format('YYYY-MM-DD');
    console.log('this is formated result', formattedDate);

    if (Moment(formattedDate).isSame(today, 'day')) {
      return 'Today';
    } else if (Moment(formattedDate).isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return Moment(new Date(formattedDate)).format('M/D/YYYY').toUpperCase();
    }
  };
  renderSeparator = () => {
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
  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Please Wait....'}
            textStyle={{color: '#FFF'}}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible();
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: hp(4),
              }}>
              <EmailPopover
                moduleID={3}
                dismissModal={() => this.setModalVisible()}
                onOpen={() => this.onOpen(this.state.emailID)}
              />
            </View>
          </Modal>
          <View style={{flex: 1, backgroundColor: Colors.BgColor}}>
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
                  this.props.navigation.goBack();
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
                  color: Colors.black1,
                  flex: 1,
                }}>
                Appointment
              </Text>

              <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('NotificationStack')
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginRight: hp(2),
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
            <View
              style={{
                backgroundColor: Colors.BgColor,
                width: '100%',
                paddingBottom: hp(2),
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: hp(2),
                // borderWidth: 1,
              }}>
              <View
                style={{
                  color: Colors.bleLayer4,
                  backgroundColor: Colors.bleLayer4,
                  width: '90%',
                  borderRadius: 10,
                  flexDirection: 'row',
                  paddingTop: hp(0),
                  paddingBottom: hp(0),
                  borderBottomColor: Colors.BgColor,
                  borderBottomWidth: 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      lastVisit: this.state.emergencyArray,
                      upcoming: true,
                      completed: false,
                      missed: false,
                      name: 'Emergency',
                    });
                  }}>
                  <View
                    style={{
                      minWidth: Platform.OS === 'ios' ? '33.3%' : '35%',
                      height: Platform.OS === 'android' ? hp(6) : hp(6),
                      borderRadius: 10,
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        this.state.upcoming === true
                          ? Colors.blueTextColor
                          : Colors.transparent,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2),

                        color:
                          this.state.upcoming === true
                            ? Colors.white
                            : Colors.label,
                        marginLeft: hp(1),
                        marginBottom: hp(0),
                      }}>
                      Upcoming
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      lastVisit: this.state.inPatientArray,
                      upcoming: false,
                      completed: true,
                      missed: false,
                      name: 'In-Patient',
                    });
                  }}>
                  <View
                    style={{
                      minWidth: Platform.OS === 'ios' ? '33.3%' : '35%',
                      height: Platform.OS === 'android' ? hp(6) : hp(6),
                      borderRadius: 10,
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        this.state.completed === true
                          ? Colors.blueTextColor
                          : Colors.transparent,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2),
                        color:
                          this.state.completed === true
                            ? Colors.white
                            : Colors.label,
                        marginHorizontal: hp(1),
                        marginBottom: hp(0),
                      }}>
                      Completed
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      lastVisit: this.state.outPatientArray,
                      upcoming: false,
                      completed: false,
                      missed: true,
                      name: 'Out-Patient',
                    });
                  }}>
                  <View
                    style={{
                      minWidth: Platform.OS === 'ios' ? '33.3%' : '35%',
                      height: Platform.OS === 'android' ? hp(6) : hp(6),
                      borderRadius: 10,

                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        this.state.missed === true
                          ? Colors.blueTextColor
                          : Colors.transparent,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2),
                        color:
                          this.state.missed === true
                            ? Colors.white
                            : Colors.label,
                        marginHorizontal: hp(0),
                        marginBottom: hp(0),
                      }}>
                      Missed
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <Carousel
                layout={'default'}
                ref={ref => (this.carousel = ref)}
                data={this.state.carouselItems}
                sliderWidth={300}
                itemWidth={300}
                renderItem={this._renderItem}
                onSnapToItem={index => this.setState({activeIndex: index})}
              />
            </View> */}
            {this.state.upcoming === true ? (
              <View
                style={{
                  // flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.BgColor,
                  marginTop: hp(2),
                  maxHeight: '60%',
                }}>
                {/* <AppointmentSlideComponent /> */}
                <View
                  style={{
                    minWidth: '100%',
                    backgroundColor: colors.white,
                    marginTop: hp(2.5),
                    minHeight: '100%',
                  }}>
                  {this.state.upcomingAppointmentData.length ? (
                    <FlatList
                      contentContainerStyle={{marginHorizontal: hp(1)}}
                      data={this.state.upcomingAppointmentData}
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
                      ItemSeparatorComponent={this.renderSeparator}
                      renderItem={({item}) => {
                        return (
                          <View style={{paddingTop: hp(1)}}>
                            {/* {console.log('item being recivedd', item)} */}
                            <Text
                              style={{
                                marginHorizontal: hp(2),
                                fontSize: hp(2),
                                fontFamily: Fonts.SourceSansSemibold,
                                color: Colors.black4,
                              }}>
                              {this.isTodayYesterday(
                                Moment(item.date).format('L'),
                              )}
                            </Text>

                            <View style={{}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  // marginVertical: hp(1),
                                  alignItems: 'center',
                                  // borderWidth: 1,
                                  marginTop: hp(1.5),
                                }}>
                                <View
                                  style={{
                                    borderRadius: hp(1),
                                    // backgroundColor: Colors.bleLayer4,
                                    marginHorizontal: hp(2),
                                    paddingVertical: hp(1.5),
                                    width:
                                      Platform.OS === 'ios' ? hp(6.5) : hp(7),
                                    height:
                                      Platform.OS === 'android'
                                        ? hp(7)
                                        : hp(6.5),
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <AppointmentIcon
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
                                      fontFamily: Fonts.SourceSansRegular,
                                      color: Colors.black4,
                                      marginTop: hp(0.3),
                                    }}>
                                    {item.title}
                                  </Text>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: hp(2),
                                        fontFamily: Fonts.SourceSansRegular,
                                        color: Colors.noRecordFound,
                                        marginTop:
                                          Platform.OS === 'ios'
                                            ? hp(0.5)
                                            : hp(0),
                                      }}>
                                      {Moment(data.date).format('LT')}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        );
                      }}
                    />
                  ) : (
                    this.state.showLoader === false &&
                    this.state.upcomingAppointmentData.length === 0 && (
                      <View
                        style={{
                          flex: 1,
                          // alignItems: 'center',
                          // justifyContent: 'center',
                          paddingTop: hp(10),
                        }}
                        // {...this._panResponder.panHandlers}
                      >
                        <Image
                          source={Images.emptyIcon}
                          style={{
                            alignSelf: 'center',
                            height: hp(16),
                            width: hp(18),
                          }}
                        />
                        <Text
                          style={{
                            fontSize: hp(2.5),
                            fontFamily: Fonts.SourceSansBold,
                            color: Colors.black4,
                            marginTop: hp(4),
                            // marginRight: hp(10),
                            // marginLeft: hp(10),
                            textAlign: 'center',
                          }}>
                          No Record Found
                        </Text>
                      </View>
                    )
                  )}
                </View>
                <Pressable
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 1111,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('ScheduleAppointment')
                  }>
                  <Image
                    source={Images.appointmentPlus}
                    style={{
                      alignSelf: 'center',
                      height: hp(10),
                      width: hp(10),
                    }}
                  />
                </Pressable>
                {/* <Text style={{position: 'absolute', top: 10, zIndex: 1111}}>
                  asad
                </Text> */}
              </View>
            ) : this.state.completed === true ? (
              <View
                style={{
                  minWidth: '100%',
                  backgroundColor: Colors.white,
                  marginTop: hp(2.5),
                  flex: 1,
                  marginTop: hp(2),
                  borderTopLeftRadius: hp(2.5),
                  borderTopRightRadius: hp(2.5),
                  shadowOffset: {width: 0.5, height: 0.5},
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 5,
                }}>
                {this.state.upcomingAppointmentData.length ? (
                  <FlatList
                    contentContainerStyle={{marginHorizontal: hp(1)}}
                    data={this.state.upcomingAppointmentData}
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
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({item}) => {
                      return (
                        <View style={{paddingTop: hp(1)}}>
                          {/* {console.log('item being recivedd', item)} */}
                          <Text
                            style={{
                              marginHorizontal: hp(2),
                              fontSize: hp(2),
                              fontFamily: Fonts.SourceSansSemibold,
                              color: Colors.black4,
                            }}>
                            {this.isTodayYesterday(
                              Moment(item.date).format('L'),
                            )}
                          </Text>

                          <View style={{}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                // marginVertical: hp(1),
                                alignItems: 'center',
                                // borderWidth: 1,
                                marginTop: hp(1.5),
                              }}>
                              <View
                                style={{
                                  borderRadius: hp(1),
                                  // backgroundColor: Colors.bleLayer4,
                                  marginHorizontal: hp(2),
                                  paddingVertical: hp(1.5),
                                  width:
                                    Platform.OS === 'ios' ? hp(6.5) : hp(7),
                                  height:
                                    Platform.OS === 'android' ? hp(7) : hp(6.5),
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <AppointmentIcon
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
                                    fontFamily: Fonts.SourceSansRegular,
                                    color: Colors.black4,
                                    marginTop: hp(0.3),
                                  }}>
                                  {item.title}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: hp(2),
                                      fontFamily: Fonts.SourceSansRegular,
                                      color: Colors.noRecordFound,
                                      marginTop:
                                        Platform.OS === 'ios' ? hp(0.5) : hp(0),
                                    }}>
                                    {Moment(data.time).format('LT')}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                  />
                ) : (
                  this.state.showLoader === false &&
                  this.state.upcomingAppointmentData.length === 0 && (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: hp(10),
                      }}
                      // {...this._panResponder.panHandlers}
                    >
                      <Image
                        source={Images.emptyIcon}
                        style={{
                          alignSelf: 'center',
                          height: hp(16),
                          width: hp(18),
                        }}
                      />
                      <Text
                        style={{
                          fontSize: hp(2.5),
                          fontFamily: Fonts.SourceSansBold,
                          color: Colors.black4,
                          marginTop: hp(4),
                          marginRight: hp(10),
                          marginLeft: hp(10),
                          textAlign: 'center',
                        }}>
                        No records found
                      </Text>
                    </View>
                  )
                )}
                {/* <Image
                  source={Images.appointmentPlus}
                  style={{
                    position: 'absolute',
                    top: '80%',
                    right: 0,
                    zIndex: 1111,
                    alignSelf: 'center',
                    height: hp(10),
                    width: hp(10),
                  }}
                />{' '} */}
                {/* <Pressable
                  style={{
                    position: 'absolute',
                    top: '82%',
                    right: 0,
                    zIndex: 1111,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('ScheduleAppointment')
                  }>
                  <Image
                    source={Images.appointmentPlus}
                    style={{
                      position: 'absolute',
                      top: '80%',
                      right: 0,
                      zIndex: 1111,
                      alignSelf: 'center',
                      height: hp(10),
                      width: hp(10),
                    }}
                  />
                </Pressable> */}
              </View>
            ) : this.state.missed === true ? (
              <View
                style={{
                  minWidth: '100%',
                  backgroundColor: Colors.white,
                  marginTop: hp(2.5),
                  flex: 1,
                  marginTop: hp(2),
                  borderTopLeftRadius: hp(2.5),
                  borderTopRightRadius: hp(2.5),
                  shadowOffset: {width: 0.5, height: 0.5},
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 5,
                }}>
                {this.state.upcomingAppointmentData.length ? (
                  <FlatList
                    contentContainerStyle={{marginHorizontal: hp(1)}}
                    data={this.state.upcomingAppointmentData}
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
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({item}) => {
                      return (
                        <View style={{paddingTop: hp(1)}}>
                          {/* {console.log('item being recivedd', item)} */}
                          <Text
                            style={{
                              marginHorizontal: hp(2),
                              fontSize: hp(2),
                              fontFamily: Fonts.SourceSansSemibold,
                              color: Colors.black4,
                            }}>
                            {this.isTodayYesterday(
                              Moment(item.date).format('L'),
                            )}
                          </Text>

                          <View style={{}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                // marginVertical: hp(1),
                                alignItems: 'center',
                                // borderWidth: 1,
                                marginTop: hp(1.5),
                              }}>
                              <View
                                style={{
                                  borderRadius: hp(1),
                                  // backgroundColor: Colors.bleLayer4,
                                  marginHorizontal: hp(2),
                                  paddingVertical: hp(1.5),
                                  width:
                                    Platform.OS === 'ios' ? hp(6.5) : hp(7),
                                  height:
                                    Platform.OS === 'android' ? hp(7) : hp(6.5),
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <AppointmentIcon
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
                                    fontFamily: Fonts.SourceSansRegular,
                                    color: Colors.black4,
                                    marginTop: hp(0.3),
                                  }}>
                                  {item.title}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: hp(2),
                                      fontFamily: Fonts.SourceSansRegular,
                                      color: Colors.noRecordFound,
                                      marginTop:
                                        Platform.OS === 'ios' ? hp(0.5) : hp(0),
                                    }}>
                                    {Moment(data.date).format('LT')}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                  />
                ) : (
                  this.state.showLoader === false &&
                  this.state.upcomingAppointmentData.length === 0 && (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: hp(10),
                      }}
                      // {...this._panResponder.panHandlers}
                    >
                      <Image
                        source={Images.emptyIcon}
                        style={{
                          alignSelf: 'center',
                          height: hp(16),
                          width: hp(18),
                        }}
                      />
                      <Text
                        style={{
                          fontSize: hp(2.5),
                          fontFamily: Fonts.SourceSansBold,
                          color: Colors.black4,
                          marginTop: hp(4),
                          marginRight: hp(10),
                          marginLeft: hp(10),
                          textAlign: 'center',
                        }}>
                        No records found
                      </Text>
                    </View>
                  )
                )}
                {/* <Pressable
                  style={{
                    position: 'absolute',
                    top: '80%',
                    right: 0,
                    zIndex: 1111,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('ScheduleAppointment')
                  }>
                  <Image
                    source={Images.appointmentPlus}
                    style={{
                      alignSelf: 'center',
                      height: hp(10),
                      width: hp(10),
                    }}
                  />
                </Pressable> */}
              </View>
            ) : null}

            {/* {this.state.appointmentHistory.length ? (
              <FlatList
                contentContainerStyle={{marginHorizontal: hp(1)}}
                data={this.state.appointmentHistory}
                ItemSeparatorComponent={this.renderSeparator}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('AppointmentDetail', {
                          data: item,
                        });
                      }}
                      style={{
                        borderRadius: 4,
                        flex: 1,
                        flexDirection: 'row',
                        padding: hp(2),
                      }}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily: Fonts.NunitoSemiBold,
                            color: Colors.label,
                          }}>
                          {item.dateTime}
                        </Text>
                        <Text
                          style={{
                            marginTop: hp(0.5),
                            fontFamily: Fonts.NunitoBold,
                            fontSize: hp(2),
                          }}>
                          {item.physician}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: 'center',
                        }}>
                        <RightIcon />
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              this.state.showLoader === false &&
              this.state.appointmentHistory.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: hp(10),
                    backgroundColor: Colors.BgColor,
                  }}>
                  <Image
                    source={Images.emptyIcon}
                    style={{
                      alignSelf: 'center',
                      height: hp(16),
                      width: hp(18),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontFamily: Fonts.SourceSansBold,
                      color: Colors.noRecordFound,
                      marginTop: hp(4),
                      marginRight: hp(10),
                      marginLeft: hp(10),
                      textAlign: 'center',
                    }}>
                    No records found
                  </Text>
                </View>
              )
            )} */}
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({appointmentHistoryData}) => ({
  appointmentHistoryData,
});
export default connect(mapStateToProps)(AppointmentScreen);
