/* istanbul ignore file */
import React, {Component, Fragment, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  Modal,
  PanResponder,
  Image,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {BarChart, XAxis} from 'react-native-chart-kit';
import {Fonts, HospitalVisitsEnum} from '../../../../config/AppConfig';
import Share from 'react-native-share';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import HospitalVisitListItem from './component/HospitalVisitListItem';
import BlueButtonService from '../../../api/bluebutton';
import {connect} from 'react-redux';
import {getHospitalVisitHistory} from '../action';
import Spinner from 'react-native-loading-spinner-overlay';
import {returnPdfFileFromStorage} from './component/HtmlToPdf';
import LottieView from 'lottie-react-native';
import EmailPopover from './component/EmailPopover';
import {BlurView} from '@react-native-community/blur';
import IconInfo from '../../../../../assets/svg/icon_info_green.svg';
import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  storeItem,
} from '../../../helpers/LocalStorage';
import {Images, Svgs} from '../../../../config';
import {showMessage} from 'react-native-flash-message';
import colors from '../../../../config/Colors';
import {Modalize} from 'react-native-modalize';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';
import {modalHanlder} from '../../medication/actions';

class HospitalVisits extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      shareLoader: false,
      HospitalVisitHistory: null,
      lastVisit: [],
      inPatients: '',
      outPatients: '',
      emergencyVisit: '',
      emergencyArray: [],
      inPatientArray: [],
      outPatientArray: [],
      emergencySelected: true,
      inPatientSelected: false,
      outPatientSelected: false,
      modalVisible: false,
      emailID: '',
      name: 'Emergency Visits',
      sessionModal: false,
      timeNoAction: this.props.appLogoutTime,
    };
  }

  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
    this.resetTimer();
  }

  state = {
    show: true,
    name: '',
  };
  _panResponder = {};
  timer = 0;
  setSessionModalVisible() {
    this.setState({sessionModal: !this.state.sessionModal});
  }
  componentWillMount(): void {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        this.resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (gesture?.moveX > gesture?.moveY) {
          this.resetTimer();
          return false;
        }
        this.resetTimer();
        return true;
      },
      onStartShouldSetPanResponderCapture: () => {
        this.resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  resetTimer() {
    console.log('reset timer');
    clearTimeout(this.timer);
    if (this.state.show) {
      this.setState({show: false});
    }
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  componentDidMount(): void {
    this.setState({
      showLoader: true,
    });
    BlueButtonService.getHospitalVisitHistory()
      .then(response => {
        this.setState({showLoader: false});
        if (response) {
          if (response.statusCode === 200) {
            console.log(JSON.stringify('getHospitalVisitHistory'));
            console.log(JSON.stringify(response.data));
            this.props.dispatch(getHospitalVisitHistory(response.data));
            console.log(
              'getHospitalHistory',
              Object.keys(response.data).length,
            );
            var responseData = JSON.parse(
              JSON.stringify(response?.data?.lastVisits),
            );
            const Emergency = responseData.filter(
              x => x.visitType === HospitalVisitsEnum?.Emergency,
            );
            const InPatient = responseData.filter(
              x => x.visitType === HospitalVisitsEnum?.InPatient,
            );
            const OutPatient = responseData.filter(
              x => x.visitType === HospitalVisitsEnum?.OutPatient,
            );
            const sortedLastVists = Emergency.sort((a, b) => {
              const dateA = new Date(`${a.date}`).valueOf();
              const dateB = new Date(`${b.date}`).valueOf();
              if (dateA > dateB) {
                return 1; // return -1 here for DESC order
              }
              return -1; // return 1 here for DESC Order
            });
            const sortedInPatientVists = InPatient.sort((a, b) => {
              const dateA = new Date(`${a.date}`).valueOf();
              const dateB = new Date(`${b.date}`).valueOf();
              if (dateA > dateB) {
                return 1; // return -1 here for DESC order
              }
              return -1; // return 1 here for DESC Order
            });
            const sortedOutPatientVists = OutPatient.sort((a, b) => {
              const dateA = new Date(`${a.date}`).valueOf();
              const dateB = new Date(`${b.date}`).valueOf();
              if (dateA > dateB) {
                return 1; // return -1 here for DESC order
              }
              return -1; // return 1 here for DESC Order
            });
            this.setState({
              lastVisit: sortedLastVists,
              inPatients: response.data.ipVisits,
              outPatients: response.data.edoptVisits,
              emergencyVisit: response.data.edVisits,
              emergencyArray: sortedLastVists,
              inPatientArray: sortedInPatientVists,
              outPatientArray: sortedOutPatientVists,
              HospitalVisitHistory: response.data,
            });
          } else {
            this.props.dispatch(getHospitalVisitHistory([]));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getHospitalHistoryError', error);
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

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '85%',
          backgroundColor: Colors.lightGrey,
          // marginRight: hp(1),
          // marginTop: hp(1),
          // marginBottom: hp(1),
          alignSelf: 'flex-end',
        }}
      />
    );
  };

  onOpen() {
    this.refs.modalize.open();
    this.props.dispatch(modalHanlder(false));
  }

  onClose() {
    this.refs.modalize.close();
    this.setState({autoHeight: true});
  }

  heightToggle() {
    this.setState({autoHeight: !this.state.autoHeight});
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1, backgroundColor: colors.BgColor}}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Please Wait....'}
            textStyle={{color: '#FFF'}}
          />
          <Modalize
            ref="modalize"
            visible={this.state.modalVisible}
            backgroundColor={Colors.black2}
            adjustToContentHeight={true}
            withHandle={false}
            onClosed={() => {
              this.props.dispatch(modalHanlder(true));
            }}
            modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
            <View
              style={{
                backgroundColor: Colors.transparent,
                flex: 1,
                width: '100%',
                alignSelf: 'center',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: hp(4),
              }}>
              <EmailPopover
                moduleID={5}
                keyboardFocus={() => this.heightToggle()}
                dismissModal={() => this.onClose()}
                onOpen={() => this.onOpen(this.state.emailID)}
                navigation={this?.props?.navigation}
                updateData={()=> console.log('No histoy data for the visit')}
              />
            </View>
          </Modalize>
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.sessionModal}>
            <BlurView
              blurType="light"
              blurAmount={10}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.transparent,
                  flex: 1,
                  width: '100%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    height: 200,
                    width: '80%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 10,
                  }}>
                  <IconInfo width={hp(35)} height={hp(10)} />
                  <Text
                    style={{
                      fontSize: hp(2.2),
                      fontFamily: Fonts.SourceSansBold,
                      textAlign: 'center',
                      marginBottom: hp(1),
                    }}>
                    {' '}
                    {'Session has expired.\n' + 'Please login again.'}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: '65%',
                      marginBottom: hp(1.5),
                      height: hp(7),
                      alignSelf: 'center',
                      borderRadius: 5,
                      borderColor: Colors.cyan,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.green_50,
                    }}
                    onPress={() => {
                      if (this.props.userProfileData.isAcoPatient === true) {
                        this.setState({
                          modalVisible: false,
                          sessionModal: false,
                          show: false,
                        });
                        clearTimeout(this.timer);
                        storeItem(IsAcoUserLogin, 'false');

                        // this.props.navigation.reset(
                        //   [NavigationActions.navigate({routeName: 'ACOLogin'})],
                        //   4,
                        // );
                        // this.props.navigation.navigate('ACOLogin', {
                        //   screenName: 'Profile',
                        // });
                        this.props.navigation.navigate('AuthenticationType');
                      } else {
                        this.setState({
                          modalVisible: false,
                          sessionModal: false,
                          show: false,
                        });
                        storeItem(BlueButtonAccessToken, '');
                        storeItem(BlueButtonRefreshToken, '');
                        storeItem(IsAcoUserLogin, 'false');
                        clearTimeout(this.timer);

                        this.props.navigation.navigate('MainDashboard', {
                          screenName: 'Profile',
                        });
                      }
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.6),
                        color: Colors.green,
                      }}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>
          <View style={{flex: 1}} collapsable={false}>
            {/* {this.state.show
              ? this.setState({sessionModal: true}) // open store if update is needed.
              : null} */}
            <LinearGradient
              colors={['#E0E0E0', '#FFFFFF']}
              style={{flex: 1, backgroundColor: Colors.BgColor}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: hp(7.5),
                  borderBottomWidth: 0.5,
                  borderColor: Colors.BgColor,
                  // marginBottom: hp(2),
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
                      marginRight: hp(1),
                      fontSize: hp(5),
                      color: Colors.black1,
                    }}>
                    W
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.5),
                    textAlign: 'center',
                    color: Colors.black1,
                    flex: 1,
                  }}>
                  Visits
                </Text>
                <View style={{flex: 0.25, alignItems: 'flex-end'}}>
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
              {this.state.HospitalVisitHistory !== undefined &&
              this.state.HospitalVisitHistory?.lastVisits !== undefined &&
              this.state.HospitalVisitHistory?.lastVisits?.length ? (
                <Fragment>
                  <View
                    style={{
                      backgroundColor: Colors.BgColor,
                      width: '100%',
                      paddingBottom: hp(2),
                      flexDirection: 'row',
                      justifyContent: 'center',
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
                            emergencySelected: true,
                            inPatientSelected: false,
                            outPatientSelected: false,
                            name: 'Emergency Visits',
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
                              this.state.emergencySelected === true
                                ? Colors.blueTextColor
                                : Colors.transparent,
                          }}>
                          <Text
                            style={{
                              fontFamily: Fonts.SourceSansRegular,
                              fontSize: hp(2),

                              color:
                                this.state.emergencySelected === true
                                  ? Colors.white
                                  : Colors.label,
                              marginLeft: hp(1),
                              marginBottom: hp(0),
                            }}>
                            Emergency
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            lastVisit: this.state.inPatientArray,
                            emergencySelected: false,
                            inPatientSelected: true,
                            outPatientSelected: false,
                            name: 'In-Patient Visits',
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
                              this.state.inPatientSelected === true
                                ? Colors.blueTextColor
                                : Colors.transparent,
                          }}>
                          <Text
                            style={{
                              fontFamily: Fonts.SourceSansRegular,
                              fontSize: hp(2),
                              color:
                                this.state.inPatientSelected === true
                                  ? Colors.white
                                  : Colors.label,
                              marginHorizontal: hp(1),
                              marginBottom: hp(0),
                            }}>
                            In-Patient
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            lastVisit: this.state.outPatientArray,
                            emergencySelected: false,
                            inPatientSelected: false,
                            outPatientSelected: true,
                            name: 'Out-Patient Visits',
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
                              this.state.outPatientSelected === true
                                ? Colors.blueTextColor
                                : Colors.transparent,
                          }}>
                          <Text
                            style={{
                              fontFamily: Fonts.SourceSansRegular,
                              fontSize: hp(2),
                              color:
                                this.state.outPatientSelected === true
                                  ? Colors.white
                                  : Colors.label,
                              marginHorizontal: hp(0),
                              marginBottom: hp(0),
                            }}>
                            Out-Patient
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: Colors.BgColor,
                      width: '100%',
                      height: hp(35),
                    }}>
                    <View
                      style={{
                        backgroundColor: Colors.white,
                        borderRadius: 10,
                        width: '90%',
                        // height: hp(30),
                        alignSelf: 'center',
                        shadowOffset: {width: 0.5, height: 0.5},
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                        paddingVertical: hp(2),
                      }}
                      {...this._panResponder.panHandlers}>
                      <BarChart
                        data={{
                          labels: ['Emergency', 'InPatient', 'OutPatient'],
                          datasets: [
                            {
                              data: [
                                this.state.emergencyVisit,
                                this.state.inPatients,
                                this.state.outPatients,
                              ],
                              colors: [
                                (opacity = 1) => Colors.red3,
                                (opacity = 1) => Colors.blueHeadingColor,
                                (opacity = 1) => Colors.eveningHeadingColor,
                              ],
                            },
                          ],
                        }}
                        withCustomBarColorFromData={true}
                        flatColor={false}
                        width={Dimensions.get('window').width - 50} // from react-native
                        height={220}
                        showBarTops={false}
                        withHorizontalLabels={false}
                        //segments={2}

                        showValuesOnTopOfBars={true}
                        chartConfig={{
                          backgroundGradientFrom: Colors.white,
                          backgroundGradientTo: Colors.white,
                          height: 100,

                          // fillShadowGradient: '#2F2F2E',
                          // fillShadowGradientOpacity: 3,
                          decimalPlaces: 0, // optional, defaults to 2dp
                          color: (opacity = 1) => Colors.black4,
                          labelColor: (opacity = 1) => Colors.noRecordFound,
                          barRadius: 5,
                          style: {
                            borderRadius: 12,
                            fontFamily: Fonts.SourceSansBold,
                            backgroundColor: Colors.medicalHistoryBg,
                          },
                          propsForBackgroundLines: {
                            strokeWidth: 1,
                            stroke: '#BDBDBD',
                            strokeDasharray: '',
                          },
                          propsForLabels: {
                            fontSize: hp(2),
                            fontFamily: Fonts.SourceSansRegular,
                            padding: hp(1),
                          },
                        }}
                        withInnerLines={false}
                        verticalLabelRotation={0}
                        fromZero={true}
                        style={{
                          backgroundColor: '#EFEBE9',
                          width: 10,
                        }}></BarChart>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: hp(1),
                      backgroundColor: Colors.BgColor,
                    }}>
                    <Text
                      style={{
                        paddingLeft: hp(2),
                        fontSize: hp(2.4),
                        fontFamily: Fonts.SourceSansSemibold,
                      }}>
                      {this.state.name}
                    </Text>
                    {/* <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginBottom: hp(0.2),
                        borderBottomColor: Colors.line,
                        borderBottomWidth: 1,
                        paddingTop: hp(0),
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            lastVisit: this.state.emergencyArray,
                            emergencySelected: true,
                            inPatientSelected: false,
                            outPatientSelected: false,
                          });
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.5),
                            color:
                              this.state.emergencySelected === true
                                ? Colors.blueTextColor
                                : Colors.label,
                            marginLeft: hp(1),
                            marginBottom: hp(1),
                          }}>
                          Emergency
                        </Text>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor:
                              this.state.emergencySelected === true
                                ? Colors.blueRxColor
                                : Colors.primary,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            lastVisit: this.state.inPatientArray,
                            emergencySelected: false,
                            inPatientSelected: true,
                            outPatientSelected: false,
                          });
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.5),
                            color:
                              this.state.inPatientSelected === true
                                ? Colors.blueTextColor
                                : Colors.label,
                            marginHorizontal: hp(1),
                            marginBottom: hp(1),
                          }}>
                          InPatient
                        </Text>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor:
                              this.state.inPatientSelected === true
                                ? Colors.blueRxColor
                                : Colors.primary,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            lastVisit: this.state.outPatientArray,
                            emergencySelected: false,
                            inPatientSelected: false,
                            outPatientSelected: true,
                          });
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.5),
                            color:
                              this.state.outPatientSelected === true
                                ? Colors.blueTextColor
                                : Colors.label,
                            marginBottom: hp(1),
                          }}>
                          OutPatient
                        </Text>
                        <View
                          style={{
                            height: 2,
                            width: '100%',
                            backgroundColor:
                              this.state.outPatientSelected === true
                                ? Colors.blueRxColor
                                : Colors.primary,
                          }}
                        />
                      </TouchableOpacity>
                    </View> */}
                    {this.state.lastVisit.length ? (
                      <FlatList
                        {...this._panResponder.panHandlers}
                        style={{
                          margin: hp(1),
                          backgroundColor: Colors.BgColor,
                        }}
                        data={this.state.lastVisit}
                        // ItemSeparatorComponent={this.renderSeparator}
                        renderItem={({item, index}) => {
                          return (
                            <HospitalVisitListItem
                              item={item}
                              shower={
                                this.state.lastVisit.length === 1 ||
                                index === this.state.lastVisit.length - 1
                                  ? false
                                  : true
                              }
                            />
                          );
                        }}
                        keyExtractor={item => item.id}
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: Colors.BgColor,
                        }}
                        {...this._panResponder.panHandlers}>
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansSemibold,
                            fontSize: hp(2.5),
                            color: Colors.label,
                            marginHorizontal: hp(2.5),
                          }}>
                          No Data Available
                        </Text>
                      </View>
                    )}
                  </View>
                  {this.state.lastVisit.length > 0 && (
                    <View>
                      <View style={{flexDirection: 'row'}}></View>
                      <TouchableOpacity
                        onPress={async () => {
                          this.onOpen();
                        }}
                        style={{
                          position: 'absolute',
                          bottom: hp(3),
                          right: hp(3),
                        }}>
                        <View
                          style={{
                            backgroundColor: Colors.blueTextColor,
                            width: 55,
                            height: 55,
                            borderRadius: 45,
                            paddingTop: hp(2),
                            alignItems: 'center',
                          }}>
                          <Image source={Images.shareIcon} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </Fragment>
              ) : (
                this.state.showLoader === false &&
                this.state.lastVisit.length === 0 && (
                  <View
                    {...this._panResponder.panHandlers}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: hp(10),
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
              )}
              {this.state.shareLoader === true ? (
                <LottieView
                  source={require('../../../../../assets/animations/animation_loading.json')}
                  autoPlay
                  loop
                />
              ) : null}
            </LinearGradient>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = ({
  hospitalVisitHistoryData,
  userProfileData,
  appLogoutTime,
}) => ({
  hospitalVisitHistoryData,
  userProfileData,
  appLogoutTime,
});
export default connect(mapStateToProps)(HospitalVisits);
