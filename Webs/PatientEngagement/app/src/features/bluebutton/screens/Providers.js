/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
  Modal,
  PanResponder,
  Image,
} from 'react-native';
import {Colors, Svgs} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {BarChart} from 'react-native-chart-kit';
import {Fonts} from '../../../../config/AppConfig';
import Share from 'react-native-share';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import ProviderListItem from './component/ProviderListItem';
import Spinner from 'react-native-loading-spinner-overlay';
import BlueButtonService from '../../../api/bluebutton';
import {getProviderHistory} from '../action';
import {connect} from 'react-redux';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {returnPdfFileFromStorage} from './component/HtmlToPdf';
import LottieView from 'lottie-react-native';
import EmailPopover from './component/EmailPopover';
import {BlurView} from '@react-native-community/blur';
import IconInfo from '../../../../../assets/svg/icon_info_green.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import Carousel from 'react-native-snap-carousel';
import {Modalize} from 'react-native-modalize';
import {modalHanlder} from '../../medication/actions';

import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  storeItem,
} from '../../../helpers/LocalStorage';
import Images from '../../../../config/Images';
import {showMessage} from 'react-native-flash-message';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.6;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const DEFAULT_PADDING = {top: 60, right: 60, bottom: 60, left: 60};

class Providers extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    // this.mapRef = null;
    this.state = {
      showLoader: false,
      providerList: [],
      isMapReady: false,
      shareLoader: false,
      modalVisible: false,
      emailID: '',
      sessionModal: false,
      timeNoAction: this.props.appLogoutTime,
      lati: 0.0,
      long: 0.0,
      autoHeight: true,
    };
  }
  state = {
    show: true,
  };
  _panResponder = {};
  timer = 0;
  setSessionModalVisible() {
    this.setState({sessionModal: !this.state.sessionModal});
  }
  onOpen() {
    this.refs.modalize.open();
    this.props.dispatch(modalHanlder(false));
  }
  onClose() {
    this.refs.modalize.close();
  }
  heightToggle() {
    this.setState({autoHeight: !this.state.autoHeight});
  }
  getCords(data) {
    data.forEach(item => {
      if (
        (item.lattitude && item.longitude != null) ||
        (item.lattitude && item.longitude != '')
      ) {
        console.log('these are the cords found', item);
        this.setState({
          lati: item.lattitude,
          long: item.longitude,
        });
      }
    });
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
    clearTimeout(this.timer);
    if (this.state.show) {
      this.setState({show: false});
    }
    console.log('Reset Called');
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }

  componentDidMount(): void {
    this.setState({
      showLoader: true,
    });
    BlueButtonService.getProviderHistory()
      .then(response => {
        this.setState({showLoader: false});
        console.log('getProviderHistory');
        console.log('getProviderHistory', response);
        if (response) {
          if (response.statusCode === 200) {
            this.props.dispatch(getProviderHistory(response.data));
            this.setState({providerList: response.data});
            this.getCords(response.data);
          } else {
            this.props.dispatch(getProviderHistory([]));
          }

          // {
          //   Object.keys(response.data).map(objectAtIndex =>
          //     console.log(
          //       'address at index',
          //       response.data[objectAtIndex].address,
          //       response.data[objectAtIndex].lattitude,
          //       response.data[objectAtIndex].longitude,
          //     ),
          //   );
          // }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getProviderHistoryError', error);
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
  // onMapLayout = () => {
  //   this.setState({isMapReady: true});
  // };
  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
    this.resetTimer();
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '92%',
          backgroundColor: Colors.lightGrey,
          marginRight: hp(1),
          marginTop: hp(1),
          marginBottom: hp(1),
          alignSelf: 'center',
        }}
      />
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
          <Modalize
            ref="modalize"
            visible={this.state.modalVisible}
            backgroundColor={Colors.black2}
            adjustToContentHeight={true}
            // modalHeight={this.state.autoHeight === true ? hp(45) : hp(80)}
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
              {/* <KeyboardAwareScrollView
                contentInsetAdjustmentBehavior="always"
                contentContainerStyle={{flex: 1}}
                innerRef={ref => {
                  this.scroll = ref;
                }}> */}
              <EmailPopover
                moduleID={8}
                keyboardFocus={() => this.heightToggle()}
                dismissModal={() => this.onClose()}
                onOpen={() => this.onOpen()}
                navigation={this?.props?.navigation}
              />
              {/* </KeyboardAwareScrollView> */}
            </View>
          </Modalize>

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
              }}>
              <EmailPopover
                moduleID={8}
                dismissModal={() => this.setModalVisible()}
                onOpen={() => this.onOpen(this.state.emailID)}
              />
            </View>
          </Modal>
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
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.BgColor,
                alignItems: 'center',
              }}>
              {/* <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: hp(7.5),
                  borderBottomWidth: 0.5,
                  borderColor: Colors.transparent,
                  marginBottom: hp(0.1),
                  backgroundColor: Colors.transparent,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.resetTimer();
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
                    marginLeft: hp(2),
                    fontSize: hp(2.5),
                    color: Colors.black1,
                    flex: 1,
                  }}>
                  My Providers
                </Text>
                <View style={{marginRight: hp(2)}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('ShareHistoryScreen', {
                        moduleID: 8,
                      });
                    }}
                    {...this._panResponder.panHandlers}>
                    <HistoryIcon />
                  </TouchableOpacity>
                </View>
                {this.state.providerList?.length > 0 && (
                  <TouchableOpacity
                    onPress={async () => {
                      this.setModalVisible();
                      // this.setState({shareLoader: true});
                      // await returnPdfFileFromStorage(
                      //   this.props.userProfileData,
                      //   this.props.providerHistoryData,
                      //   'My Provider(s)',
                      // );
                      // setTimeout(() => {
                      //   this.setState({shareLoader: false});
                      // }, 1000);
                    }}
                    style={{
                      alignSelf: 'center',
                      marginRight: hp(3),
                    }}
                    {...this._panResponder.panHandlers}>
                    <ShareIcon />
                  </TouchableOpacity>
                )}
              </View> */}
              {this.state.providerList?.length ? (
                <>
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                    }}>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      ref={ref => {
                        this.map = ref;
                      }}
                      style={{flex: 1}}
                      // initialRegion={{
                      //   latitude: parseFloat(
                      //     this.state.providerList[0]?.lattitude,
                      //   ),
                      //   longitude: parseFloat(
                      //     this.state.providerList[0]?.longitude,
                      //   ),
                      //   latitudeDelta: LATITUDE_DELTA,
                      //   longitudeDelta: LONGITUDE_DELTA,
                      // }}
                      initialCamera={{
                        center: {
                          latitude: parseFloat(this.state.lati),
                          longitude: parseFloat(this.state.long),
                        },
                        pitch: 45,
                        heading: 90,
                        altitude: 1000,
                        zoom: 17,
                      }}
                      {...this._panResponder.panHandlers}>
                      {/* {Object.keys(this.state.providerList).map(
                        objectAtIndex => (
                          <Marker
                            {...this._panResponder.panHandlers}
                            title={
                              this.state.providerList[objectAtIndex] !== '' &&
                              this.state.providerList[objectAtIndex] !== null
                                ? this.state.providerList[objectAtIndex].name
                                : ''
                            }
                            coordinate={{
                              latitude: parseFloat(
                                this.state.providerList[objectAtIndex]
                                  ?.lattitude,
                              ),
                              longitude: parseFloat(
                                this.state.providerList[objectAtIndex]
                                  ?.longitude,
                              ),
                            }}
                          />
                        ),
                      )} */}
                      {this.state.providerList.map((marker, index) => {
                        if (
                          marker.lattitude === null &&
                          marker.longitude === null
                        ) {
                          return null; // Skip this marker
                        }
                        return (
                          <Marker
                            key={index}
                            coordinate={{
                              latitude: parseFloat(marker.lattitude),
                              longitude: parseFloat(marker.longitude),
                            }}
                            title={marker.name}
                          />
                        );
                      })}
                    </MapView>
                    <View
                      style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        height: hp(6),
                        borderBottomWidth: 0.5,
                        borderColor: Colors.transparent,
                        marginBottom: hp(0.1),
                        backgroundColor: Colors.transparent,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.resetTimer();
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
                        My Providers
                      </Text>
                      <View style={{alignItems: 'flex-end'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            marginRight: hp(2),
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                'NotificationStack',
                              )
                            }>
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
                          </TouchableOpacity>
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
                      </View>
                      {/* {this.state.providerList?.length > 0 && (
                        <TouchableOpacity
                          onPress={async () => {
                            this.setModalVisible();
                            // this.setState({shareLoader: true});
                            // await returnPdfFileFromStorage(
                            //   this.props.userProfileData,
                            //   this.props.providerHistoryData,
                            //   'My Provider(s)',
                            // );
                            // setTimeout(() => {
                            //   this.setState({shareLoader: false});
                            // }, 1000);
                          }}
                          style={{
                            alignSelf: 'center',
                            marginRight: hp(3),
                          }}
                          {...this._panResponder.panHandlers}>
                          <ShareIcon />
                        </TouchableOpacity>
                      )} */}
                    </View>
                    <View>
                      {this.state.providerList.length > 0 && (
                        <View style={{zIndex: 80}}>
                          <View style={{flexDirection: 'row'}}></View>
                          <TouchableOpacity
                            onPress={async () => {
                              this.onOpen();
                            }}
                            style={{
                              position: 'absolute',
                              bottom: Platform.OS === 'ios' ? hp(21) : hp(17),
                              right: 19,
                              elevation: 80,
                            }}>
                            <View
                              style={{
                                backgroundColor: Colors.blueTextColor,
                                width: 55,
                                height: 55,
                                borderRadius: 45,
                                // paddingTop: hp(2),
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'green',
                                borderWidth: 0,
                              }}>
                              {this.state?.providerList?.length > 0 ? (
                                <Image source={Images.shareIcon} />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: hp(20),
                      position: 'absolute',
                      bottom: 5,
                      alignItems: 'center',
                    }}>
                    <Carousel
                      ref={c => {
                        this._carousel = c;
                      }}
                      data={this.state.providerList}
                      renderItem={({item}) => {
                        return <ProviderListItem item={item} />;
                      }}
                      sliderWidth={400}
                      itemWidth={300}
                      {...this._panResponder.panHandlers}
                    />
                    {/*<FlatList*/}
                    {/*    horizontal*/}
                    {/*    pagingEnabled={true}*/}
                    {/*    showsHorizontalScrollIndicator={false}*/}
                    {/*    contentContainerStyle = {{justifyContent:'space-between', alignItems:'center'}}*/}
                    {/*  style={{margin: hp(2), flex:1, flexDirection:'row', width:'100%', backgroundColor:'red'}}*/}
                    {/*  data={this.state.providerList}*/}
                    {/*  ItemSeparatorComponent={this.renderSeparator}*/}
                    {/*  renderItem={({item}) => {*/}
                    {/*    return <ProviderListItem item={item} />;*/}
                    {/*  }}*/}
                    {/*  keyExtractor={item => item.id}*/}
                    {/*/>*/}
                  </View>
                  <View>
                    {this.state.providerList.length > 0 && (
                      <View style={{zIndex: 80, borderWidth: 2}}>
                        {/* <View
                          style={{   
                            flexDirection: 'row',
                          }}></View> */}
                        <TouchableOpacity
                          onPress={async () => {
                            console.log('pressed');
                            this.props.navigation.navigate(
                              'ProviderHistoryScreen',
                            );
                          }}
                          style={{
                            position: 'absolute',
                            bottom: Platform.OS === 'ios' ? hp(30) : hp(17),
                            left: 100,
                            elevation: 80,
                            // display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: 'red',
                            borderWidth: 0,
                          }}>
                          <View
                            style={{
                              backgroundColor: Colors.white,
                              width: 55,
                              height: 55,
                              borderRadius: 45,
                              // paddingTop: hp(2),
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              width="5"
                              height="5"
                              source={Images.historyIcon}
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={async () => {
                            this.onOpen();
                          }}
                          style={{
                            position: 'absolute',
                            bottom: Platform.OS === 'ios' ? hp(21) : hp(17),
                            left: 100,
                            elevation: 80,
                            borderColor: 'red',
                            borderWidth: 2,
                            display: 'none',
                          }}>
                          <View
                            style={{
                              backgroundColor: Colors.blueTextColor,
                              width: 55,
                              height: 55,
                              borderRadius: 45,
                              // paddingTop: hp(2),
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image source={Images.shareIcon} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                this.state.showLoader === false &&
                this.state.providerList.length === 0 && (
                  <View
                    style={{
                      backgroundColor: Colors.BgColor,
                      flex: 1,
                      // alignItems: 'center',
                      // justifyContent: 'center',
                      paddingBottom: hp(10),
                    }}
                    {...this._panResponder.panHandlers}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        // alignItems: 'center',
                        height: hp(6),
                        borderBottomWidth: 0.5,
                        borderColor: Colors.transparent,
                        marginBottom: hp(0.1),
                        backgroundColor: Colors.transparent,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.resetTimer();
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
                          marginLeft: hp(8),
                          fontSize: hp(2.5),
                          color: Colors.black1,
                          flex: 1,
                        }}>
                        My Providers
                      </Text>
                      {/* <View style={{marginRight: hp(2)}}>
                        <TouchableOpacity
                        // onPress={() => {
                        //   this.props.navigation.navigate(
                        //     'ShareHistoryScreen',
                        //     {
                        //       moduleID: 8,
                        //     },
                        //   );
                        // }}
                        // {...this._panResponder.panHandlers}
                        >
                          <HistoryIcon />
                        </TouchableOpacity>
                      </View> */}
                      {this.state.providerList?.length > 0 && (
                        <TouchableOpacity
                          onPress={async () => {
                            this.setModalVisible();
                            // this.setState({shareLoader: true});
                            // await returnPdfFileFromStorage(
                            //   this.props.userProfileData,
                            //   this.props.providerHistoryData,
                            //   'My Provider(s)',
                            // );
                            // setTimeout(() => {
                            //   this.setState({shareLoader: false});
                            // }, 1000);
                          }}
                          style={{
                            alignSelf: 'center',
                            marginRight: hp(3),
                            borderColor: 'green',
                            borderWidth: 0,
                          }}
                          {...this._panResponder.panHandlers}>
                          <ShareIcon />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Image
                      source={Images.emptyIcon}
                      style={{
                        marginTop: hp(15),
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
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = ({
  providerHistoryData,
  userProfileData,
  appLogoutTime,
}) => ({
  providerHistoryData,
  userProfileData,
  appLogoutTime,
});
export default connect(mapStateToProps)(Providers);
