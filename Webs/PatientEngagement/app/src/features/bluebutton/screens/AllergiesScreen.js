/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Image,
  Modal,
  PanResponder,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts} from '../../../../config/AppConfig';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import {getAllergiesHistory, getAppointmentHistory} from '../action';
import BlueButtonService from '../../../api/bluebutton';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import LottieView from 'lottie-react-native';
import EmailPopover from './component/EmailPopover';
import {BlurView} from '@react-native-community/blur';
import IconInfo from '../../../../../assets/svg/icon_info_green.svg';
import AllergyIcon from '../../../../../assets/svg/icon_allergy_screen.svg';

import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  storeItem,
} from '../../../helpers/LocalStorage';
import {Images, Svgs} from '../../../../config';
import {showMessage} from 'react-native-flash-message';
import ShareHistory from './ShareHistory';
import {Modalize} from 'react-native-modalize';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';

class AllergiesScreen extends React.PureComponent {
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
      modalVisible: false,
      emailID: '',
      emergencySelected: true,
      sessionModal: false,
      timeNoAction: this.props.appLogoutTime,
      allergiesData: [],
    };
  }
  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
    this.resetTimer();
  }

  state = {
    show: true,
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
    console.log('reset T');
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
    BlueButtonService.getAllergiesHistory()
      .then(response => {
        this.setState({showLoader: false});
        console.log('getAllergiesHistory');
        console.log(response);
        if (response) {
          if (response.statusCode === 200) {
            this.setState({allergiesData: response.data});
            this.props.dispatch(getAllergiesHistory(response.data));
          } else {
            this.setState({allergiesData: []});
            this.props.dispatch(getAllergiesHistory([]));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getAllergiesHistoryError');
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
          width: '80%',
          backgroundColor: Colors.lightGrey4,
          // marginLeft: hp(2),
          // marginRight: hp(2),
          marginTop: hp(1),
          marginBottom: hp(1),
          alignSelf: 'flex-end',
        }}
      />
    );
  };

  getInteractionCountAndType(key, interactionData) {
    if (key === 'DrugToDrugInteractionCount') {
      return `${interactionData[key]} Drug`;
    } else if (key === 'DrugToFoodInteractionCount') {
      return `${interactionData[key]} Food`;
    } else if (key === 'DrugToAllergyInteractionCount') {
      return `${interactionData[key]} Allergy`;
    } else if (key === 'DrugToLabInteractionCount') {
      return `${interactionData[key]} Lab`;
    }
  }

  onOpen() {
    this.refs.modalize.open();
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
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
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
                moduleID={2}
                keyboardFocus={() => this.heightToggle()}
                dismissModal={() => this.onClose()}
                onOpen={() => this.onOpen(this.state.emailID)}
                navigation={this?.props?.navigation}
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
            <View style={{flex: 1, backgroundColor: Colors.BgColor}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: hp(7.5),
                  borderBottomWidth: 1,
                  borderColor: Colors.BgColor,
                  marginBottom: hp(2),
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
                    fontSize: hp(2.5),
                    textAlign: 'center',
                    color: Colors.black1,
                    flex: 1,
                  }}>
                  Allergy(s)
                </Text>

                <View style={{alignItems: 'flex-end', marginRight: hp(2)}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('NotificationStack')
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
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
                {/* {this.state.allergiesData?.length > 0 && (
                  <TouchableOpacity
                    onPress={async () => {}}
                    style={{
                      alignSelf: 'center',
                      marginRight: hp(3),
                    }}>
                    <Image source={images.hamburgIcon} />
                  </TouchableOpacity>
                )} */}
              </View>
              <View
                style={{
                  backgroundColor: Colors.BgColor,
                  width: '100%',
                  paddingBottom: hp(2),
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <View
                  style={{
                    color: Colors.bleLayer4,
                    backgroundColor: Colors.bleLayer4,
                    width: '90%',
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: hp(0),
                    paddingBottom: hp(0),
                    borderBottomColor: Colors.BgColor,
                    borderBottomWidth: 1,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        emergencySelected: true,
                        inPatientSelected: false,
                        outPatientSelected: false,
                      });
                    }}>
                    <View
                      style={{
                        minWidth: Platform.OS === 'ios' ? '50%' : '45%',
                        height: Platform.OS === 'android' ? hp(6) : hp(6),
                        borderRadius: 10,

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
                          fontSize: hp(2.5),

                          color:
                            this.state.emergencySelected === true
                              ? Colors.white
                              : Colors.label,
                          marginLeft: hp(1),
                          marginBottom: hp(0),
                        }}>
                        Allergy(s)
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        emergencySelected: false,
                        inPatientSelected: true,
                        outPatientSelected: false,
                      });
                    }}>
                    <View
                      style={{
                        minWidth: Platform.OS === 'ios' ? '50%' : '45%',
                        height: Platform.OS === 'android' ? hp(6) : hp(6),
                        borderRadius: 10,

                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          this.state.emergencySelected === false
                            ? Colors.blueTextColor
                            : Colors.transparent,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2.5),
                          color:
                            this.state.inPatientSelected === true
                              ? Colors.white
                              : Colors.label,
                          marginHorizontal: hp(1),
                          marginBottom: hp(0),
                        }}>
                        History
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.emergencySelected === true ? (
                this.state.allergiesData?.length ? (
                  <View
                    style={{
                      backgroundColor: Colors.BgColor,
                      flex: 1,
                    }}>
                    <FlatList
                      contentContainerStyle={{
                        marginHorizontal: hp(1),
                        backgroundColor: Colors.BgColor,
                      }}
                      //  style={{backgroundColor : Colors.medicalHistoryBg}}
                      data={this.state.allergiesData}
                      ItemSeparatorComponent={this.renderSeparator}
                      renderItem={({item}) => {
                        return (
                          <View
                            style={{
                              padding: hp(2),
                              marginVertical: hp(1),
                              marginHorizontal: hp(2),
                              height: hp(10),
                              width: '90%',
                              borderRadius: 10,
                              shadowOffset: {width: 0.5, height: 0.5},
                              shadowOpacity: 0.1,
                              shadowRadius: 8,
                              elevation: 3,
                              backgroundColor: Colors.white,
                            }}
                            {...this._panResponder.panHandlers}>
                            <View style={{flexDirection: 'row'}}>
                              <Image
                                style={{
                                  width: 40,
                                  height: 50,
                                  resizeMode: 'contain',
                                }}
                                source={images.diseasesIcon}
                              />
                              <View>
                                <Text
                                  style={{
                                    marginTop: hp(0.5),
                                    marginLeft: hp(2),
                                    marginRight: hp(3),
                                    fontSize: hp(2),
                                    fontFamily: Fonts.SourceSansSemibold,
                                    color: Colors.black4,
                                    textTransform: 'capitalize',
                                  }}>
                                  {item.description}
                                </Text>
                                <Text
                                  style={{
                                    marginLeft: hp(2),
                                    fontSize: hp(2),
                                    fontFamily: Fonts.SourceSansSemibold,
                                    color: Colors.noRecordFound,
                                  }}>
                                  {item.diagnosisCode}
                                </Text>
                              </View>
                            </View>
                            {item.interactions &&
                              item.interactions !== null && (
                                <View
                                  style={{
                                    flexDirection: 'column',
                                    marginTop: hp(1),
                                    alignItems: 'flex-start',
                                  }}>
                                  <Text
                                    style={{
                                      fontFamily: Fonts.SourceSansSemibold,
                                      color: Colors.homeRed,
                                      alignSelf: 'flex-start',
                                    }}>
                                    Interactions:
                                  </Text>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginVertical: hp(1),
                                    }}>
                                    {Object.keys(item.Interactions).map(key => {
                                      if (
                                        key.includes('Count') &&
                                        item.Interactions[key] !== 0
                                      ) {
                                        return (
                                          <TouchableOpacity
                                            style={{marginRight: hp(1)}}
                                            onPress={() => {
                                              const responseData =
                                                this.getInteractionDetailObj(
                                                  key,
                                                  item.Interactions,
                                                );
                                              this.props.navigation.navigate(
                                                'InteractionScreen',
                                                {
                                                  interactionDetails:
                                                    responseData,
                                                },
                                              );
                                            }}>
                                            <Text
                                              style={{
                                                fontFamily:
                                                  Fonts.SourceSansSemibold,
                                                backgroundColor:
                                                  Colors.circleBackground,
                                                // marginHorizontal: hp(1),
                                                borderRadius: hp(2),
                                                paddingVertical: hp(0.5),
                                                paddingHorizontal: hp(2),
                                                color: Colors.label,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignSelf: 'flex-start',
                                              }}>
                                              {this.getInteractionCountAndType(
                                                key,
                                                item.Interactions,
                                              )}
                                            </Text>
                                          </TouchableOpacity>
                                        );
                                      }
                                    })}
                                  </View>
                                </View>
                              )}

                            {/*<View*/}
                            {/*  style={{*/}
                            {/*    alignSelf: 'center',*/}
                            {/*  }}>*/}
                            {/*  <RightIcon />*/}
                            {/*</View>*/}
                          </View>
                        );
                      }}
                    />
                    {this.state.allergiesData?.length > 0 && (
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
                  </View>
                ) : (
                  this.state.showLoader === false &&
                  this.state.allergiesData.length === 0 && (
                    <View
                      {...this._panResponder.panHandlers}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.BgColor,
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
                )
              ) : (
                <ShareHistory moduleID={2} />
                //  <Text>False Condition</Text>
              )}

              {this.state.shareLoader === true ? (
                <LottieView
                  source={require('../../../../../assets/animations/animation_loading.json')}
                  autoPlay
                  loop
                />
              ) : null}
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({
  allergiesHistoryData,
  userProfileData,
  appLogoutTime,
}) => ({
  allergiesHistoryData,
  userProfileData,
  appLogoutTime,
});
export default connect(mapStateToProps)(AllergiesScreen);
