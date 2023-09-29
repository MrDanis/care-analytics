/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  Alert,
  PanResponder,
  Modal,
  Image,
} from 'react-native';
import AuthService from '../../../api/auth';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {homeApiData} from '../../home/reducers';
import axios from 'axios';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgNoImageFoundIcon} from '../../medication/constants';
import {Colors, Images, Svgs} from '../../../../config';
import {
  Fonts,
  HospitalVisitsEnum,
  CURRENT_TARGET,
  baseUrl,
} from '../../../../config/AppConfig';
import CoverageIcon from '../../../../../assets/svg/icon_his_Coverage.svg';
import MedicationIcon from '../../../../../assets/svg/icon_his_medication.svg';
import AppointmentIcon from '../../../../../assets/svg/icon_his_appointment.svg';
import ProviderIcon from '../../../../../assets/svg/icon_his_MyProviders.svg';
import DiseaseIcon from '../../../../../assets/svg/icon_his_Disease.svg';
import AllergiesIcon from '../../../../../assets/svg/icon_his_Allergies.svg';
import ProcedureIcon from '../../../../../assets/svg/icon_his_Procedures.svg';
import HospitalIcon from '../../../../../assets/svg/icon_his_hospitalsVisits.svg';
import MedicationHistory from '../../../../../assets/svg/medication_history.svg';
import ProfileService from '../../../api/profile';
import {getUserProfile} from '../../profile/action';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../../../config/Colors';
import images from '../../../../config/Images';
import MedicalHistoryCard from './component/MedicalHistoryCard';
import CustomTabNav from '../../../navigation/containers/CustomtabBar';
import MedicationService from '../../../api/medication';

import moment from 'moment';
import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  removeItemValue,
  retrieveItem,
  storeItem,
} from '../../../helpers/LocalStorage';
import {isACOUserLogin, isBlueButtonToken} from '../../../helpers/Common';
import {NavigationActions} from 'react-navigation';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';

import ProfileStack from '../../../navigation/containers/ProfileStack';
import {showMessage} from 'react-native-flash-message';
import BlueButtonService from '../../../api/bluebutton';
import {getEmailSharingResource, getHospitalVisitHistory} from '../action';
import UserInactivity from '../../../helpers/UserInactivity';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {BlurView} from '@react-native-community/blur';
import IconInfo from '../../../../../assets/svg/icon_info_green.svg';

class MainDashboard extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      html: '',
      showLoader: false,
      isAcoUserLogin: false,
      isBlueButton: false,
      showBlueButtonLoading: false,
      // screenName: this.props.route.params.screenName,
      sessionModal: false,
      timeNoAction: this.props.appLogoutTime,
      scroll: true,
      historyData: [],
      newDataHistory: [],
      isBlueButtonCode: false,
      enum: {
        Diseases: 1,
        Allergies: 2,
        AppointmentHistory: 3,
        Coverage: 4,
        HospitalAlert: 5,
        Medication: 6,
        Procedure: 7,
        Provider: 8,
        Labs: 9,
        Imaging: 10,
      },
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
  componentWillMount(): void {
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        this.timer = setTimeout(() => {
          console.log('====================================');
          console.log('here at will mount for claims');
          console.log('====================================');
          this.setState({show: true});
        }, this.state.timeNoAction);
        console.log('backin willMount');
        console.log('====================================');
        console.log('modal property', this.state.sessionModal);
        console.log('====================================');
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackButtonClick,
        );
      },
    );
  }
  resetTimer() {
    console.log('reset in dashboard');
    clearTimeout(this.timer);
    if (this.state.show) {
      this.setState({show: false}, async () => {
        this.setSessionModalVisible();
      });
    }
    this.timer = setTimeout(() => {
      console.log('====================================');
      console.log('here at will reset');
      console.log('====================================');
      this.setState({show: true});
    }, this.state.timeNoAction);
  }
  async GetShareSources() {
    BlueButtonService.getShareSource()
      .then(response => {
        this.setState({showLoader: false});
        if (response) {
          if (response.statusCode === 200) {
            const dummyArray = [];
            console.log('length', Object.entries(response.data).length);
            console.log('api recieved resources', response.data);

            response.data?.map((itemAtIndex, index) => {
              dummyArray.push({
                id: itemAtIndex.id,
                name: itemAtIndex.name,
                url: itemAtIndex.url,
              });
            });
            console.log('DropDown Valuessss', dummyArray);
            //  this.setState({items: dummyArray});
            //  console.log(JSON.stringify('getSharingResourceDropDown'));
            //  console.log(JSON.stringify(response.data));
            this.props.dispatch(getEmailSharingResource(dummyArray));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getSharingResourceDropDown Error', error);
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
  async GetAllHistoryCall(callType) {
    // console.log('runnain');
    console.log('Call type for the history is : ', callType);
    if (callType === 0) {
      this.setState({showBlueButtonLoading: true});
    }
    this.setState({showLoader: true});

    MedicationService.GetAllHistory()
      .then(response => {
        console.log('get all history for drop response is : ', response);
        console.log(response.data);
        // const newObj = response.data.reduce((result, current) => {
        //   Object.keys(current).forEach(key => {
        //     result[key] = current[key];
        //   });
        //   return result;
        // }, {});
        if (response && response.statusCode === 200) {
          this.setState({historyData: response.data});
          const newArray = Object.keys(response.data[0]).map(
            key => response.data[0][key],
          );
          this.setState({newDataHistory: newArray});
          this.setState({showLoader: false});

          console.log(
            'Blue Button login status is :',
            this.state.showBlueButtonLoading,
          );
          this.setState({showBlueButtonLoading: false});
          // this.setState({showBlueButtonLoading:false})
          // console.log(
          //   '================ /n this is the new sorted array for medical history ',
          //   newArray,
          // );
          // this.props.dispatch(getAllMedication(response.data));
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({showLoader: false});
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  async getProfileData() {
    var isLogin = await isACOUserLogin();
    var isBlueButton = await isBlueButtonToken();
    if (!isLogin && isBlueButton) {
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => {
          this.resetTimer();
          return true;
        },
        onMoveShouldSetPanResponder: (e, gestureState) => {
          this.resetTimer();
          return !(gestureState.dx === 0 && gestureState.dy === 0);
        },
        onStartShouldSetPanResponderCapture: () => {
          this.resetTimer();
          return false;
        },
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderTerminationRequest: () => true,
        onShouldBlockNativeResponder: () => false,
      });
      this.timer = setTimeout(() => {
        console.log('====================================');
        console.log('here at profile data');
        console.log('====================================');
        this.setState({show: true});
      }, this.state.timeNoAction);
    }
    ProfileService.getUserProfile()
      .then(response => {
        console.log('getUserProfile');
        console.log(this.props.userProfileData.isTokenExpired);
        if (response && response.Status === true && response.Data.Profile) {
          this.props.dispatch(getUserProfile(response.Data.Profile));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async componentDidMount(): void {
    console.log(
      'Previous screen routes are :',
      this.props?.route?.params?.params,
    );
    this.setState({showLoader: true});
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        console.log(
          'come here to fokos in case of bluebutton login',
          this.props,
        );

        var isLogin = await isACOUserLogin();
        var isBlueButton = await isBlueButtonToken();
        console.log('isLoginDashboard');
        console.log(isLogin);
        console.log('isBlueButton');
        console.log(isBlueButton);
        this.setState({isBlueButton: isBlueButton});
        if (isLogin === false && !isBlueButton) {
          console.log('Comming to blue button not login ', isBlueButton);
          this.setState({
            showLoader: true,
            isACOUserLogin: false,
            // timeNoAction: this.state.timeNoAction * this.props.appLogoutTime,
          });
        } else {
          console.log(
            'Comming to blue button section when the when not login ',
            isBlueButton,
          );
          this.setState({
            showLoader: false,
            isACOUserLogin: true,
            // timeNoAction: this.state.timeNoAction * this.props.appLogoutTime,
          });
        }
        console.log(
          'Calling these apis in case of comming back from the bluebutton logIn',
        );

        // this.GetShareSources();
        // this.GetAllHistoryCall();

        if (isBlueButton !== isLogin) {
          console.log('This will work when atleast one of the user is login');
          console.log('Blue Button login : ', isBlueButton);
          console.log('Dashboard login : ', isLogin);
          this.GetShareSources();
          this.GetAllHistoryCall();
          console.log('Blue Button login Calls Start');
          console.log('Blue Button login Calls End');
        } else {
          console.log('Bluebutton : ', isBlueButton);
          console.log('Dashboard : ', isBlueButton);
        }
      },
    );
    // console.log('time', this.state.timeNoAction);
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        this.timer = setTimeout(() => {
          console.log('====================================');
          console.log('here at did mount');
          console.log(
            'This must work when the user is login with the blue button and is navigating back to the main dashboard from the sub module...',
          );
          console.log('====================================');
          this.setState({show: true});
        }, this.state.timeNoAction);

        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackButtonClick,
        );
        console.log(
          'Current Stack screen',
          this.props.navigation.state.routeName,
        );

        var isLogin = await isACOUserLogin();
        var isBlueButton = await isBlueButtonToken();
        console.log('isLoginDashboard in case of blue button');
        console.log(isLogin);
        console.log('isBlueButton in case of blue button');
        console.log(isBlueButton);
        this.setState({isBlueButton: isBlueButton});
        if (isLogin === false && !isBlueButton) {
          this.setState({
            showLoader: true,
            isACOUserLogin: false,
            // timeNoAction: this.state.timeNoAction * this.props.appLogoutTime,
          });
        } else {
          this.setState({
            showLoader: false,
            isACOUserLogin: true,
            // timeNoAction: this.state.timeNoAction * this.props.appLogoutTime,
          });
        }
        this.refreshBlueButtonToken();
        this.getSharingResourceDropDown();
        this._panResponder = PanResponder.create({
          onStartShouldSetPanResponderCapture: () => {
            clearTimeout(this.timer);
            return false;
          },
          onMoveShouldSetPanResponder: (e, gestureState) => {
            this.resetTimer();
            return !(gestureState.dx === 0 && gestureState.dy === 0);
          },
        });
      },
    );
  }

  getSharingResourceDropDown() {
    BlueButtonService.getShareSource()
      .then(response => {
        this.setState({showLoader: false});
        if (response) {
          if (response.Status === true) {
            console.log(JSON.stringify('getSharingResourceDropDown'));
            console.log(JSON.stringify(response.Data));
            this.props.dispatch(getEmailSharingResource(response.Data));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getSharingResourceDropDown Error', error);
        console.log(error);
      });
  }
  async refreshBlueButtonToken() {
    let refreshToken = await retrieveItem(BlueButtonRefreshToken);
    console.log('refreshToken');
    console.log(refreshToken);
    if (refreshToken && this.props.userProfileData.isTokenExpired === true) {
      this.setState({showLoader: true});
      AuthService.getBlueButtonRefreshToken()
        .then(res => {
          this.setState({showLoader: false});
          console.log('getBlueButtonAccessToken');
          console.log(res);
          if (res && res.statusCode === 200) {
            storeItem(BlueButtonAccessToken, res.data.accessToken);
            storeItem(BlueButtonRefreshToken, res.data.refreshToken);
            storeItem(IsAcoUserLogin, 'false');
            this.setState({
              bluetoken: res.data.accessToken,
            });
          }
          // this.getProfileData();
        })
        .catch(err => {
          this.setState({showLoader: false});
          console.log('getBlueButtonAccessTokenError');
          console.log(err);
        });
    }
  }
  componentWillUnmount() {
    // this.removeEventListener();
  }
  removeEventListener() {
    // this.willFocusSubscription.remove();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  resetProfieStack() {
    this.props.navigation.reset(
      [NavigationActions.navigate({routeName: 'Profile'})],
      0,
    );
  }
  handleBackButtonClick() {
    // if (this.state.screenName === 'Home') {
    //   this.resetProfieStack();
    //   this.props.navigation.navigate(this.state.screenName);
    // } else {
    //   this.props.navigation.navigate(this.state.screenName);
    // }
    // return true;
  }
  getAge(dateString: string) {
    console.log('====================================');
    console.log(
      'date',
      moment(new Date(this.props.userProfileData.dateOfBirth)).format(
        'YYYY-MM-DD',
      ),
    );
    console.log('====================================');
    const date = moment(
      new Date(this.props.userProfileData.dateOfBirth),
    ).format('YYYY-MM-DD');
    const years = moment().diff(date, 'years');
    console.log('====================================');
    console.log('years', years);
    console.log('====================================');
    // const days = moment().diff(date.add(years, 'years'), 'days', false);
    // return { years,days }
    return years + 'yrs';
  }

  onNavigationStateChange = webViewState => {
    console.log('here on back');
    console.log('webViewState');
    console.log('webViewState', webViewState);
    console.log('webViewState.url', webViewState.url);
    if (
      webViewState.url.includes(
        this.props.homeApiData.blueButton.callbackUrl,
      ) &&
      !webViewState.url.includes(this.props.homeApiData.blueButton.clientID)
    ) {
      var appLink = webViewState.url;
      var urlParts = appLink.split('?');
      console.log('urlParts');
      console.log(urlParts);
      let code = urlParts[1].split('=')[1];
      console.log(code);
      //Danish (START)
      this.setState({isBlueButtonCode: true});
      //Danish (END)

      if (code === 'access_denied') {
        this.props.navigation.goBack();
        alert(
          'You need to allow permission for your blue button account to access your medical data',
        );
      } else {
        // if we have the blueButton code then we will do the below process and update the bluebutton state
        if (!this.state.isBlueButtonCode) {
          console.log('Check by danish....');
          let dataObj = {};
          dataObj.code = code;
          // this.setState({showLoader: true});
          this.setState({showBlueButtonLoading: true});
          AuthService.getBlueButtonAccessToken(dataObj)
            .then(async res => {
              console.log('getBlueButtonAccessToken response is : ', res);
              console.log(res);
              if (res && res.statusCode === 200) {
                storeItem(BlueButtonAccessToken, res.data.accessToken);
                storeItem(BlueButtonRefreshToken, res.data.refreshToken);
                storeItem(IsAcoUserLogin, 'false');
                this.setState({isBlueButton: true, isBlueButtonCode: false});
              }
              console.log('Calling the profile api after getting the token...');
              console.log('Blue Button login Calls Start');
              console.log('Step 1 start');
              // getBlueButtonData()
              this.getProfileData().then(res => {
                console.log(
                  'response of the getProfileData when user login from the blue button : ',
                  res,
                );
              });
              console.log('Step 2 start');
              this.GetShareSources().then(res => {
                console.log(
                  'response of the GetShareSources when user login from the blue button : ',
                  res,
                );
              });
              console.log('Step 3 start');
              this.GetAllHistoryCall(0).then(res => {
                console.log(
                  'response of the GetAllHistoryCall when user login from the blue button : ',
                  res,
                );
              });
              console.log('Step 3 ends');
              // this.setState({showLoader: false});
              // this.setState({showBlueButtonLoading:false})

              console.log(
                'Blue Button login Calls End',
                this.state.isBlueButtonCode,
              );
            })
            .catch(err => {
              this.setState({showLoader: false});
              console.log('getBlueButtonAccessTokenError');
              console.log(err);
            });
        }
      }
    }
  };
  render() {
    console.log('this.props.homeApiData');
    console.log(this.props.homeApiData);
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
          {console.log('Screen type is : ', this.props?.route?.params)}
          {this.state.showBlueButtonLoading === false ? (
            <Spinner
              visible={
                this.props?.route?.params?.params === 0
                  ? this.state.showLoader
                  : this.state.showLoader ||
                    this.state.newDataHistory.length <= 0
              }
              textContent={'Loading....'}
              textStyle={{color: '#FFF'}}
            />
          ) : (
            <Spinner
              visible={this.state.showBlueButtonLoading}
              textContent={'Loading....'}
              textStyle={{color: '#FFF'}}
            />
          )}
          {/* 
            visible={(this.props?.route?.params?.params===0)?this.state.showLoader:(this.state.showLoader||this.state.newDataHistory.length<=0)}
            <NavigationEvents
             onWillFocus={async () => {
              console.log('in navigation events');
              var isLogin = await isACOUserLogin();
              var isBlueButton = await isBlueButtonToken();
              // this.setState({sessionModal: false, show: false});
              console.log('isLoginDashboard');
              console.log(isLogin);
              console.log('isBlueButton');
              console.log(isBlueButton);
              this.setState({isBlueButton: isBlueButton});
              if (isLogin === false && !isBlueButton) {
                this.setState({showLoader: true, isACOUserLogin: false});
              } else {
                this.setState({showLoader: false, isACOUserLogin: true});
              }
              this.refreshBlueButtonToken();
              this.getSharingResourceDropDown();
              clearTimeout(this.timer);
              this._panResponder = PanResponder.create({
                onStartShouldSetPanResponderCapture: () => {
                  clearTimeout(this.timer);
                  return false;
                },
                onMoveShouldSetPanResponder: (e, gestureState) => {
                  this.resetTimer();
                  return !(gestureState.dx === 0 && gestureState.dy === 0);
                },
              });
            }}
          /> */}
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
                      fontFamily: Fonts.NunitoBold,
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
                      console.log('====================================');
                      console.log(
                        'isAcoLogin in touchable',
                        this.props.userProfileData.isAcoPatient,
                      );
                      console.log('====================================');
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
                        this.setState(
                          {sessionModal: false, show: false},
                          async () => {
                            storeItem(BlueButtonAccessToken, '');
                            storeItem(BlueButtonRefreshToken, '');
                            storeItem(IsAcoUserLogin, 'false');
                            this.resetTimer();
                            var isLogin = await isACOUserLogin();
                            var isBlueButton = await isBlueButtonToken();
                            console.log('isLoginDashboard');
                            console.log(isLogin);
                            console.log('isBlueButton');
                            console.log(isBlueButton);
                            this.setState({isBlueButton: isBlueButton});
                            if (isLogin === false && !isBlueButton) {
                              this.setState({
                                showLoader: true,
                                isACOUserLogin: false,
                              });
                            } else {
                              this.setState({
                                showLoader: false,
                                isACOUserLogin: true,
                              });
                            }
                            this.refreshBlueButtonToken();
                            this.getSharingResourceDropDown();
                            this._panResponder = PanResponder.create({
                              onStartShouldSetPanResponderCapture: () => {
                                clearTimeout(this.timer);
                                return false;
                              },
                            });
                          },
                        );
                      }
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.NunitoBold,
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
          <View
            style={{flex: 1, backgroundColor: Colors.BgColor}}
            collapsable={false}>
            {/* {this.state.show
              ? this.setState({sessionModal: true}) // open store if update is needed.
              : null} */}
            {/* <View
              style={{
                width: '100%',
                alignItems: 'center',
                height: hp(7.5),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderBottomWidth: 0.5,
                borderColor: Colors.BgColor,
                backgroundColor: Colors.BgColor,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansSemibold,
                  fontSize: hp(3),
                  color: Colors.black1,
                  
                  textTransform: 'capitalize',
                }}>
                Medical History
              </Text>
            </View> */}
            {/* ============================================ */}
            {/* header for medical hsitory ahead */}
            {this.state.isACOUserLogin ? (
              <View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: hp(1.5),
                    marginBottom: hp(2),
                  }}>
                  <View style={{flex: 0.25, marginLeft: hp(2)}}>
                    {this.props.userProfileData.imagePath !== null &&
                    this.props.userProfileData.imagePath !== '' ? (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('ProfileStack')
                        }>
                        <FastImage
                          style={{
                            width: hp(5),
                            height: hp(5),
                            marginLeft: hp(1),
                            borderRadius: 10,
                          }}
                          source={{
                            uri:
                              baseUrl +
                              '/' +
                              this.props.userProfileData.imagePath +
                              '?' +
                              new Date(),
                            priority: FastImage.priority.high,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('ProfileStack')
                        }>
                        <FastImage
                          style={{
                            width: hp(5),
                            height: hp(5),
                            borderRadius: 10,
                            marginLeft: hp(1),
                          }}
                          resizeMode="contain"
                          source={require('../../../../../assets/images/user_logo.png')}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{flex: 0.5, alignItems: 'center'}}>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: hp(2.5),
                        fontFamily: Fonts.SFProSemibold,
                      }}>
                      Medical History
                    </Text>
                  </View>
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
              </View>
            ) : (
              this.state.isBlueButton && (
                <View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      marginTop: hp(1.5),
                      marginBottom: hp(2),
                    }}>
                    <View style={{flex: 0.25, marginLeft: hp(2)}}>
                      {this.props.userProfileData.imagePath !== null &&
                      this.props.userProfileData.imagePath !== '' ? (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('ProfileStack')
                          }>
                          <FastImage
                            style={{
                              width: hp(5),
                              height: hp(5),
                              marginLeft: hp(1),
                              borderRadius: 10,
                            }}
                            source={{
                              uri:
                                baseUrl +
                                '/' +
                                this.props.userProfileData.imagePath +
                                '?' +
                                new Date(),
                              priority: FastImage.priority.high,
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('ProfileStack')
                          }>
                          <FastImage
                            style={{
                              width: hp(5),
                              height: hp(5),
                              borderRadius: 10,
                              marginLeft: hp(1),
                            }}
                            resizeMode="contain"
                            source={require('../../../../../assets/images/user_logo.png')}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={{flex: 0.5, alignItems: 'center'}}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontSize: hp(2.5),
                          fontFamily: Fonts.SourceSansSemibold,
                        }}>
                        Medical History
                      </Text>
                    </View>
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
                </View>
              )
            )}
            {/* <TouchableOpacity
              onPress={() => {
                this.handleBackButtonClick();
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
            </TouchableOpacity> */}
            {/* {this.state.isBlueButton ||
                            this.props.userProfileData.isAcoPatient === true ? (
                                <View
                                    {...this._panResponder.panHandlers}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: hp(3),
                                        marginVertical: hp(2),
                                    }}>
                                    { this.props.userProfileData.imagePath !== null &&
                                    this.props.userProfileData.imagePath !== '' ? (
                                        <FastImage
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30,
                                                marginVertical: hp(1),
                                            }}
                                            source={{
                                                uri: CURRENT_TARGET + '/' +  this.props.userProfileData.imagePath,
                                                priority: FastImage.priority.high,
                                            }}
                                        />
                                    ) : (
                                        <FastImage
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30,
                                                marginVertical: hp(1),
                                            }}
                                            resizeMode="contain"
                                            source={require('../../../../../assets/images/user_logo.png')}
                                        />
                                    )}
                                    <View style={{marginLeft: hp(2)}}>
                                        <Text
                                            style={{
                                                fontFamily: Fonts.SourceSansBold,
                                                fontSize: hp(3),
                                                color: colors.black4,
                                                textTransform: 'capitalize',
                                            }}>
                                            { this.props.userProfileData.firstName.toLowerCase() +' '+ this.props.userProfileData.lastName.toLowerCase()}
                                        </Text>
                                        <View style={{flexDirection:'row'}}>
                                            { this.props.userProfileData.gender !== null &&
                                            this.props.userProfileData.gender !== '' && (
                                                <>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.SourceSansRegular,
                                                            fontSize: hp(2),
                                                            color: colors.noRecordFound,
                                                        }}>
                                                        { this.props.userProfileData.gender === '2' ? 'Female' :'Male'}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontFamily: Fonts.SourceSansRegular,
                                                            fontSize: hp(2),
                                                            color: colors.noRecordFound,
                                                        }}>
                                                        {', '}
                                                    </Text>
                                                </>
                                            )}
                                            <Text
                                                style={{
                                                    fontFamily: Fonts.SourceSansRegular,
                                                    fontSize: hp(2),
                                                    color: colors.noRecordFound,
                                                }}>
                                                {this.getAge( this.props.userProfileData.dateOfBirth)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : null} */}
            {!this.state.isACOUserLogin && !this.state.isBlueButton ? (
              <WebView
                style={{flex: 1}}
                source={{
                  uri:
                    this.props.homeApiData?.blueButton?.authUrl +
                    '?response_type=code&client_id=' +
                    this.props.homeApiData?.blueButton?.clientID +
                    '&redirect_uri=' +
                    this.props.homeApiData?.blueButton?.callbackUrl,
                }}
                onNavigationStateChange={this.onNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                onLoadStart={() => {
                  console.log('loading start of webview');
                  this.setState({showLoader: true});
                }}
                onLoadEnd={() => {
                  console.log('loading end of webview');
                  this.setState({showLoader: false});
                }}
              />
            ) : (
              <FlatList
                // columnWrapperStyle={{justifyContent: 'space-between'}}
                contentContainerStyle={{
                  // marginHorizontal: hp(1),
                  // paddingBottom: hp(2),
                  // marginTop:hp(2),
                  backgroundColor: Colors.BgColor,
                }}
                data={this.state.newDataHistory}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this._panResponder = {};
                        this.resetTimer();
                        console.log('touchable', item);
                        this.removeEventListener();
                        if (item.moduleId === 6) {
                          this.props.navigation.navigate('Medication');
                        }
                        if (item.moduleId === 'T') {
                          this.props.navigation.navigate('AppointmentScreen');
                          // showMessage({
                          //   message: 'Info',
                          //   description: 'No appointment available yet!',
                          //   type: 'default',
                          //   icon: {icon: 'info', position: 'left'},
                          //   backgroundColor: Colors.green,
                          // });
                        }
                        if (item.moduleId === 1) {
                          this.props.navigation.navigate('Diseases');
                        }
                        if (item.moduleId === 7) {
                          this.props.navigation.navigate('Procedure');
                        }
                        if (item.moduleId === 4) {
                          this.props.navigation.navigate('CoverageScreen');
                        }
                        if (item.moduleId === 8) {
                          this.props.navigation.navigate('ProviderScreen');
                        }
                        if (item.moduleId === 2) {
                          this.props.navigation.navigate('AllergiesScreen');
                        }
                        if (item.moduleId === 5) {
                          this.props.navigation.navigate('HospitalVisitScreen');
                        }
                      }}
                      style={{
                        backgroundColor: Colors.white,
                        borderRadius: 8,
                        flex: 1,
                        // height: hp(15),
                        shadowOffset: {width: 0.5, height: 0.5},
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 10,
                        justifyContent: 'space-between',
                        marginHorizontal: hp(2),
                        marginVertical: hp(1.5),
                        borderRadius: 0,
                        borderColor: 'red',
                      }}
                      {...this._panResponder.panHandlers}>
                      <MedicalHistoryCard item={item} />
                      {/* <View
                    iconimage={item.icon}
                    name={item.name}
                    date={item.date}
                    description={item.description}
                    time={'8:00am'}
                    medstatus={
                      item.name == 'Medication' ? 'Previous Taken' : null
                    }
                    visitStatus={item.name == 'Visits' ? 'In-Patient' : null}
                                                    style={{
                                                        height: '60%',
                                                        flexDirection:'row'
                                                    }}>
                                                    <Image
                                                        style={{
                                                            width: 27,
                                                            height: 27,
                                                            marginLeft: hp(2),
                                                            marginTop: hp(1.5),
                                                            resizeMode: 'contain',
                                                        }}
                                                        source={item.icon}
                                                    />
                                                     <Text
                                                        style={{
                                                            marginHorizontal: hp(2),
                                                            marginTop: hp(2),
                                                            fontFamily: Fonts.SourceSansBold,
                                                            color: Colors.blueGrayDisableText,
                                                            fontSize: hp(2),
                                                        
                                                        }}>
                                                        {item.name}
                                                    </Text>

                                                </View> */}

                      {/* <View
                                                    style={{
                                                        height: '40%',
                                                        justifyContent: 'flex-end',
                                                        flex: 1,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            marginHorizontal: hp(2.5),
                                                            fontFamily: Fonts.SourceSansBold,
                                                            color: Colors.blueGrayDisableText,
                                                            fontSize: hp(2),
                                                            marginBottom: hp(2),
                                                        }}>
                                                        {item.name}
                                                    </Text>
                                                </View> */}
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = ({
  homeApiData,
  userProfileData,
  emailSharingResourceData,
  appLogoutTime,
}) => ({
  homeApiData,
  userProfileData,
  emailSharingResourceData,
  appLogoutTime,
});
export default connect(mapStateToProps)(MainDashboard);
//this.porops.userdata
