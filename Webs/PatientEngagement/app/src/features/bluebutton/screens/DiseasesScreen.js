/* istanbul ignore file */
// 1 : Pull to refresh
// 2 : On reach end
// 3 : Revoke the email
// 4 : Email Share
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
  Alert,
  PanResponder,
  BackHandler,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts, AppLogoutTime} from '../../../../config/AppConfig';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import MedicationService from '../../../api/medication';
import {getUserProfile} from '../../profile/action';
import {
  getAppLogoutTime,
  getDiseasesHistory,
  getMedicationHistory,
} from '../action';
import ShareGrey from '../../../../../assets/svg/ShareGrey.svg';
import Dot from '../../../../../assets/svg/Dot.svg';
import {connect} from 'react-redux';
import MyIcon from '../../../../../assets/svg/illustration_Prescription_mega.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import Share from 'react-native-share';
import EmptyIcon from '../../../../../assets/svg/empty_norecords.svg';
import {isACOUserLogin} from '../../../helpers/Common';
import {returnPdfFileFromStorage} from './component/HtmlToPdf';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import EmailPopover from './component/EmailPopover';
import ProfileService from '../../../api/profile';
import IconInfo from '../../../../../assets/svg/icon_info_green.svg';
import DiseaseIcon from '../../../../../assets/svg/icon_disease_screen.svg';
import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  removeItemValue,
  storeItem,
} from '../../../helpers/LocalStorage';
import UserInactivity from '../../../helpers/UserInactivity';
import IconInfoGrey from '../../../../../assets/svg/icon_info_grey.svg';
import PlateIcon from '../../../../../assets/svg/illustration_Plate.svg';
import {BlurView} from '@react-native-community/blur';
import {NavigationActions} from 'react-navigation';
import images from '../../../../../app/config/Images';
import {Images, Svgs} from '../../../../../app/config';
import {Modalize} from 'react-native-modalize';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import ShareHistory from './ShareHistory';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';
import {modalHanlder} from '../../medication/actions';
import BlueButtonService from '../../../api/bluebutton';
import moment from 'moment';
import { RefreshControl } from 'react-native-gesture-handler';
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
class DiseasesScreen extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    console.log('Props from the parent component are : ',props)
    this.state = {
      showLoader: false,
      shareLoader: false,
      modalVisible: false,
      emailID: '',
      isDisease: true,
      sessionModal: false,
      timeNoAction: this.props.appLogoutTime,
      scroll: true,
      newBtn: true,
      completeBtn: false,
      autoHeight: true,
      pageNumber: 0,
      emailHistoryList: [],
      historyList: [],
      moduleID: 1,
      selectedItemID: 0,
      isHistoryShared:false
    };
  }
  state = {
    show: true,
  };
  _panResponder = {};
  timer = 0;
  setModalVisible() {
    this.resetTimer();
    this.setState({modalVisible: !this.state.modalVisible}); 
  }
  setSessionModalVisible() {
    this.setState({sessionModal: !this.state.sessionModal});
  }
  // handleIsHistoryShared() {
  //   console.log('I am called when the history is share through the email',this.props);
  //   // this.forceUpdate();
  //   // MedicationService.getDiseasesHistory().then((res)=>{
  //   //  console.log('Response getting after the history is shared...',res.data)})
      
  //    // this.setState({emailHistoryList:response.data});

  // }
  componentWillMount(): void {
    console.log('backin willMount');
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('event');
        this.setState({scroll: true});
        this.resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gesture) => {
        if (gesture?.moveX > gesture?.moveY) {
          this.resetTimer();
          return false;
        }
        this.resetTimer();
        //only next
        // return gesture.dx != 0 && gesture.dy != 0;
      },
      onStartShouldSetPanResponderCapture: () => {
        console.log('aaaaaaaaaaß');
        this.resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
      // onPanResponderGrant: () => {
      //   console.log('in onPanResponderGrant');
      //   this.setState({scroll: false});
      // },
      // onPanResponderMove: () => {
      //   console.log('in onPanResponderMove');
      //   this.setState({scroll: true});
      // },
      // onPanResponderRelease: () => {
      //   console.log('in onPanResponderRelease');
      //   this.setState({scroll: true});
      // },
      // onPanResponderEnd: (e, gestureState) => {
      //   console.log('onPanResponderEnd');
      //   this.setState({scroll: true});
      // },
    });
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  resetTimer() {
    console.log('resett');
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
    // let time = this.props.appLogoutTime;
    this.setState({showLoader: true});
    this.getModuleHistory('get',0);

    console.log('time', this.state.timeNoAction);
    console.log('====================================');
    console.log(
      'isAcoLogin in touchable',
      this.props.userProfileData.IsAcoPatient,
    );
    console.log('====================================');
    // console.log('Timer time', this.state.timeNoAction);
    // this.setState({showLoader: true});
    MedicationService.getDiseasesHistory()
      .then(response => {
        console.log('getDiseasesHistory');
        console.log(response?.data);
        if (response) {
          if (response.statusCode === 200) {
            this.props.dispatch(getDiseasesHistory(response.data));
            this.setState({showLoader: false});
          } else {
            this.props.dispatch(getDiseasesHistory([]));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getMedicationHistoryError');
        console.log(error);
      });
  }

  onOpen() {
    this.refs.modalize.open();
    console.log('Sharing modal is called....')
    this.props.dispatch(modalHanlder(false));
  }

  onClose() {
    this.refs.modalize.close();
    this.setState({autoHeight: true});
  }
  heightToggle() {
    this.setState({autoHeight: !this.state.autoHeight});
  }
  // getModuleHistory from the Coverage screen (START)
  getModuleHistory(type,subtype) {
    console.log('====================================');
    console.log('executed and request Type is ',subtype);
    console.log('====================================');
    if (type === 'revoke') {
      this.setState({pageNumber: 1, emailHistoryList: [], historyList: []});
      this.setState({showLoader: false})
    }
    // if((subtype === 1)||(subtype === 4))
    // {
    //   this.setState({pageNumber: 0});
    // }
    this.setState({showLoader: true});
    setTimeout(() => {
      console.log('refreshing state is : ',this.state.refreshingHistory);
    }, 1000);
    console.log('Page number before sending request to the api is : ',this.state.pageNumber,' and refreshing state is : ',this.state.refreshingHistory);

    BlueButtonService.getModuleShareHistory(
      this.state.moduleID,
     ((subtype === 1) || (subtype === 4)) ? 1: this.state.pageNumber,
    )
      .then(response => {
        console.log('getShareHistory');
        console.log(JSON.stringify(response.data.length));
        console.log(response.data);
        if (response.data.length > 0) {
          if (response.statusCode) {
            // let dummyArr = this.state.emailHistoryList.concat(response.data);
            let dummyArr = response.data;
            const groupedData = this.state.emailHistoryList
            .concat(response.data)
            .reduce((acc, cur) => {
              const createdDate = cur.createdDate.split('T')[0];
              const existingGroup = acc.find(
                group => group.createdDate === createdDate,
                );
                if (existingGroup) {
                  existingGroup.objects.push(cur);
                } else {
                  acc.push({createdDate, objects: [cur]});
                }
                return acc;
              }, []);
            // Danish Logic to test the data (START)
            let sampleData =[];let currentDateIndex = 0; let data = [];
            for(let i=0; i<dummyArr.length; i++)
            {
              if(dummyArr[currentDateIndex]?.createdDate.split('T')[0] === dummyArr[i]?.createdDate.split('T')[0])
              {
                  data.push(dummyArr[i]);
                  if(dummyArr[i]?.createdDate.split('T')[0] !== dummyArr[i+1]?.createdDate.split('T')[0])
                  {
                    sampleData.push({
                      createdDate:dummyArr[currentDateIndex]?.createdDate.split('T')[0],
                      objects:data
                    });
                    data=[];
                    currentDateIndex=i+1;
                  }
                  if(i+1 === dummyArr.length-1)
                  {
                    data.push(dummyArr[i+1]);
                    sampleData.push({
                      createdDate:dummyArr[currentDateIndex]?.createdDate.split('T')[0],
                      objects:data
                    });
                    break;
                  }
              }
            }
            // Danish Logic to test the data (END)
              console.log('Group data is : ',groupedData);
              console.log('Dummy data is : ',dummyArr)
              console.log('Danish sample data formated is : ',sampleData)
              if((subtype === 4) || (subtype === 2) ||(subtype === 1) || (subtype === 3))
              {
                this.setState({showLoader: false});
              }
              
              switch (subtype) {
          
                case 1: //For pull to refresh
                case 4: //After the email is send
                console.log('pull to refresh is : ',this.state.refreshingHistory);
                this.setState({
                  emailHistoryList: sampleData,
                  pageNumber: ((this.state.refreshingHistory)||(subtype === 4))?2:this.state.pageNumber + 1,
                  historyList: response.data,
                });
                break;
                case 2: //When reach end
                  console.log('Sub type is : ',subtype);
                  let previousList = this.state.emailHistoryList;
                     console.log('Previous history list is :',previousList);
                     console.log('New list is : ',sampleData);
                     for(let i=0;i<sampleData.length;i++)
                     {
                      let objectFound = previousList.findIndex(item => item.createdDate === sampleData[i].createdDate);
                       if(objectFound !== -1)
                       {
                           previousList[objectFound].objects = previousList[objectFound].objects.concat(sampleData[i].objects); 
                       }
                       else 
                       {
                         previousList.push(sampleData[i]);
                       }
                     }
                     for(let i=0;i<previousList.length;i++)
                      {                
                        // Generic check for removing the empty objects from the list
                         if(previousList[i].objects[0].emailAddress === undefined)
                         {
                           previousList[i].objects=previousList[i].objects.slice(1);
                         }
                     }
                     console.log('Updated List is : ',previousList);
                     this.setState({
                      emailHistoryList: previousList,
                      pageNumber: this.state.refreshingHistory?1:this.state.pageNumber + 1,
                      historyList: response.data,
                    });
                  break;
              
                default:
                  this.setState({
                    emailHistoryList: groupedData,
                    pageNumber:this.state.pageNumber+1,
                    historyList: response.data,
                  });
                  break;
              }
              this.setState({refreshingHistory:false});
              console.log('Page number for the flatlist is : ',this.state.pageNumber);
            } else {
              this.setState({emailHistoryList: []});
              // this.setState({refreshingHistory:false})
            }
          } else {
            this.setState({historyList: []});
            this.setState({showLoader: false});
            // this.setState({refreshingHistory:false})
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getShareHistory Error');
        console.log(error);
        showMessage({
          message: 'Info',
          description: `Internal Server Error ${err}`,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  // =========================================================== getModuleHistory from the Coverage screen (END) ========================================================
  // getModuleHistory(type,subtype) {
  //   console.log('====================================');
  //   console.log('executed and subtype is ',subtype,' This module is called after the email is shared...');
  //   console.log('====================================');
  //   if (type === 'revoke') {
  //     this.setState({pageNumber: 0, emailHistoryList: [], historyList: []});
  //   }
  //   // this.setState({showLoader: true});
  //   console.log('Payload for the share history data is : ',{ModuleID:this.state.moduleID,PageNumber:this.state.pageNumber})
  //   BlueButtonService.getModuleShareHistory(
  //     this.state.moduleID,
  //     this.state.pageNumber,
  //   )
  //     .then(response => {
  //       console.log('getShareHistory');
  //       console.log('Share history response is : ',response);
  //       console.log(JSON.stringify(response.data.length));
  //       console.log(response.data);
  //       if (response.data.length > 0) {
  //         if (response.statusCode) {
            
  //           const groupedData = this.state.emailHistoryList
  //           .concat(response.data)
  //           .reduce((acc, cur) => {
  //             const createdDate = cur.createdDate.split('T')[0];
  //             const existingGroup = acc.find(
  //               group => group.createdDate === createdDate,
  //               );
  //               if (existingGroup) {
  //                 existingGroup.objects.push(cur);
  //               } else {
  //                 acc.push({createdDate, objects: [cur]});
  //               }
  //               return acc;
  //             }, []);
  //             // console.log('====================================');
  //             console.log('grouped', groupedData);
  //             for(let i=0;i<groupedData.length;i++)
  //              {                
  //               // Generic check for removing the empty objects from the list
  //                if(groupedData[i].objects[0].emailAddress === undefined)
  //                {
  //                  groupedData[i].objects=groupedData[i].objects.slice(1);
  //                }
  //              }
  //              console.log('Group data after refactration is : ',groupedData);
  //              this.setState({
  //                emailHistoryList: groupedData,
  //                pageNumber: this.state.pageNumber + 1,
  //                historyList: response.data,
  //               });
  //               // this check is to stop the loading after sending the email (START)
  //               if(subtype === 4)
  //               {
  //                 this.setState({showLoader: false});
  //               }
  //               // this check is to stop the loading after sending the email (End)
  //            console.log('This is the email history list :',this.state.emailHistoryList,'and subtype is : ',subtype)
  //           } else {
  //           this.setState({emailHistoryList: []});
  //         }
  //       } else {
  //         this.setState({historyList: []});
  //       }
  //     })
  //     .catch(error => {
  //       this.setState({showLoader: false});
  //       console.log('getShareHistory Error');
  //       console.log(error);
  //       showMessage({
  //         message: 'Info',
  //         description: 'Internal Server Error',
  //         type: 'default',
  //         icon: {icon: 'info', position: 'left'},
  //         backgroundColor: Colors.red,
  //       });
  //     });
  // }
  isTodayYesterday = date => {
    // console.log('this is the date thats being recieved in is today', date);
    let today = Moment().format('YYYY-MM-DD');
    // console.log('this is todays result', today);
    let yesterday = Moment().subtract(1, 'day').format('YYYY-MM-DD');
    // console.log('this is yesterday result', yesterday);

    const formattedDate = Moment(date).format('YYYY-MM-DD');
    // console.log('this is formated result', formattedDate);

    if (Moment(formattedDate).isSame(today, 'day')) {
      return 'Today';
    } else if (Moment(formattedDate).isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return Moment(new Date(formattedDate)).format('M/D/YYYY').toUpperCase();
    }
  };
  onOpenHistory(id) {
    this.refs.modalizeHistory.open();
    this.setState({selectedItemID: id});
  }

  onCloseHistory() {
    this.refs.modalizeHistory.close();
  }
  revokeEmail() {
    this.setState({showLoader: true});
    console.log('Selected Item ID', this.state.selectedItemID);
    BlueButtonService.revokeSentEmail(this.state.selectedItemID)
      .then(response => {
        this.setState({showLoader: false});
        console.log('getShareHistory');
        console.log(JSON.stringify(response));
        if (response.statusCode === 200) {
          this.setState({selectedItemID: 0});
          this.getModuleHistory('revoke',3);
        } else {
          alert(response.Exception[0].Message);
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getShareHistory Error');
        console.log(error);
      });
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '80%',
          backgroundColor: Colors.BgColor,
          // marginTop: hp(1),
          // marginBottom: hp(1),
          alignSelf: 'flex-end',
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
            ref="modalizeHistory"
            adjustToContentHeight={true}
            backgroundColor={Colors.black2}
            withHandle={false}
            modalStyle={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
            }}>
            <View style={{padding: hp(3)}}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.2),
                  flex: 1,

                  color: Colors.black1,
                }}>
                Confirmation
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: hp(1),
                }}>
                <Image
                  style={{
                    width: 68,
                    height: 60,
                    alignSelf: 'center',
                    marginLeft: hp(1),
                  }}
                  source={require('../../../../../assets/images/icon_unlink.png')}
                />
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2.2),
                    flex: 1,
                    color: Colors.red,
                    marginTop: hp(2),
                    marginLeft: hp(2),
                  }}>
                  Are you sure you want to remove access?
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: hp(4),
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.onCloseHistory();
                  }}
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginBottom: hp(2),
                    marginRight: hp(3),
                    width: 150,
                    borderWidth: 1,
                    borderColor: Colors.blueTextColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.blueTextColor,
                      textAlign: 'center',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/*<View*/}
                {/*  style={{*/}
                {/*    height: 1,*/}
                {/*    backgroundColor: Colors.line,*/}
                {/*    width: '90%',*/}
                {/*    alignSelf: 'center',*/}
                {/*  }}*/}
                {/*/>*/}
                <TouchableOpacity
                  onPress={() => {
                    this.onCloseHistory();
                    this.revokeEmail(this.state.selectedItemID);
                  }}
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginBottom: hp(2),
                    marginLeft: hp(3),
                    width: 150,
                    height: 50,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.white,
                      textAlign: 'center',
                    }}>
                    Remove access
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modalize>
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
                moduleID={1}
                keyboardFocus={() => this.heightToggle()}
                dismissModal={() => this.onClose()}
                onOpen={() => this.onOpen(this.state.emailID)}
                navigation={this?.props?.navigation}
                updateData={()=> this.getModuleHistory('get',4)}
              />
              {/* </KeyboardAwareScrollView> */}
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
          <View style={{flex: 1}} collapsable={false}>
            {/* {this.state.show
              ? this.setState({sessionModal: true}) // open store if update is needed.
              : null} */}
            <View style={{flex: 1, backgroundColor: Colors.BgColor}}>
              {/* this is the header */}
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: hp(7.5),
                  borderBottomWidth: 1,
                  borderColor: Colors.BgColor,
                  // marginBottom: hp(2),
                  backgroundColor: Colors.BgColor,
                }}>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}>
                  <Text
                    style={{
                      fontFamily: 'WisemanPTSymbols',
                      marginLeft: heightPercentageToDP(2),
                      marginRight: heightPercentageToDP(1),
                      fontSize: hp(5),
                      color: Colors.black,
                    }}>
                    W
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoSemiBold,
                    // marginLeft: hp(10),
                    textAlign: 'center',
                    fontSize: hp(2.5),
                    color: Colors.black,
                    flex: 1,
                  }}>
                  Disease(s)
                </Text>
                <View style={{alignItems: 'flex-end'}}>
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
                  marginTop: hp(1.5),
                  marginBottom: hp(1),
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.BgColor,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: Colors.bleLayer4,
                    width: Platform.OS === 'ios' ? '90%' : '90%',
                    borderRadius: hp(1),
                  }}>
                  <TouchableOpacity
                    style={{
                      // paddingHorizontal: hp(8),
                      // paddingVertical: hp(1.7),
                      minWidth: Platform.OS === 'ios' ? '45%' : '45%',
                      height: Platform.OS === 'android' ? hp(6) : hp(7),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: this.state.newBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(1),
                    }}
                    onPress={() => {
                      this.setState({
                        isDisease: true,
                        inPatientSelected: false,
                        outPatientSelected: false,
                        newBtn: true,
                        completeBtn: false,
                      });
                    }}>
                    <Text
                      style={{
                        color: this.state.newBtn
                          ? Colors.white
                          : Colors.noRecordFound,
                      }}>
                      Disease(s)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      minWidth: Platform.OS === 'ios' ? '45%' : '45%',
                      height: Platform.OS === 'android' ? hp(6) : hp(7),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: this.state.completeBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(1),
                      shadowRadius: 5,
                      // marginLeft: Platform.OS === 'ios' ? hp(0.1) : hp(0),
                    }}
                    onPress={() => {
                      this.setState({
                        isDisease: false,
                        inPatientSelected: true,
                        outPatientSelected: false,
                        completeBtn: true,
                        newBtn: false,
                      });
                    }}>
                    <Text
                      style={{
                        color: this.state.completeBtn
                          ? Colors.white
                          : Colors.noRecordFound,
                      }}>
                      History
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* this is the list of the diseases */}
              {((this.state.isDisease === true)&&(!this.state.showLoader)) ? (
                this.props.diseasesHistoryData.length ? (
                  <View
                    style={
                      {
                        borderColor:'red',
                        borderWidth:0
                        // maxHeight: '80%'
                      }
                    }>
                    <FlatList
                      contentContainerStyle={{
                        backgroundColor: Colors.BgColor,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        paddingBottom: hp(18),
                      }}
                      data={this.props.diseasesHistoryData}
                      ItemSeparatorComponent={this.renderSeparator}
                      // scrollEnabled={state.scroll}
                      renderItem={({item}) => {
                        // console.log('Item Type', item.DiseaseType);
                        return (
                          <View
                            style={{
                              padding: hp(2),
                              marginVertical: hp(1),
                              marginHorizontal: hp(2),
                              // height: hp(10),
                              minWidth: '90%',
                              maxWidth: '90%',
                              borderRadius: 10,
                              shadowOffset: {width: 0.3, height: 0.3},
                              shadowOpacity: 0.1,
                              shadowRadius: 3,
                              elevation: 3,
                              backgroundColor: Colors.white,
                              borderColor:'blue',
                              borderWidth:0
                            }}
                            {...this._panResponder.panHandlers}>
                            <View>
                              {this.props.userProfileData.IsAcoPatient && (
                                <View style={{flexDirection: 'row',borderColor:'green',borderWidth:0}}>
                                  <Text
                                    style={{
                                      marginTop: hp(0.5),
                                      fontFamily: Fonts.SourceSansSemibold,
                                      color: Colors.black3,
                                      width: hp(13),
                                      fontSize: hp(2),
                                    }}>
                                    Diagnosis Date
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: hp(0.5),
                                      marginLeft: hp(2),
                                      fontSize: hp(2),
                                      fontFamily: Fonts.SourceSansSemibold,
                                      color: Colors.black2,
                                    }}>
                                    {item.diagnosisDate !== ''
                                      ? moment(item.diagnosisDate).format(
                                          'MM/DD/YYYY',
                                        )
                                      : 'N/A'}
                                  </Text>
                                </View>
                              )}
                              <View
                                style={{
                                  flexDirection: 'row',
                                  // alignItems: 'center',
                                  borderColor:'green',
                                  borderWidth:0
                                }}>
                                <Image
                                  style={{
                                    width: 40,
                                    height: 40,
                                    resizeMode: 'contain',
                                  }}
                                  source={images.diseasesIcon}
                                />
                                <View>
                                  <Text
                                    style={{
                                      marginTop: hp(0),
                                      marginLeft: hp(2),
                                      marginRight: hp(3),
                                      fontSize: hp(1.8),
                                      fontFamily: Fonts.SourceSansSemibold,
                                      color: Colors.black4,
                                      textTransform: 'capitalize',
                                      maxWidth: '88%',
                                    }}>
                                    {item.description.toLowerCase()}
                                  </Text>
                                  <Text
                                    style={{
                                      // marginTop: hp(0.5),
                                      marginLeft: hp(2),
                                      fontSize: hp(2),
                                      fontFamily: Fonts.SourceSansSemibold,
                                      color: Colors.noRecordFound,
                                    }}>
                                    {item.code}
                                  </Text>
                                </View>
                              </View>

                              {this.props.userProfileData.IsAcoPatient && (
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={{
                                      marginTop: hp(0.5),
                                      fontFamily: Fonts.SourceSansSemibold,
                                      color: Colors.black3,
                                      width: hp(13),
                                      fontSize: hp(2),
                                    }}>
                                    Type
                                  </Text>
                                  <Text
                                    style={{
                                      marginTop: hp(0.5),
                                      marginLeft: hp(2),
                                      flex: 1,
                                      marginRight: hp(1),
                                      fontSize: hp(2),
                                      fontFamily: Fonts.SourceSansSemibold,
                                      color: Colors.black2,
                                    }}>
                                    {item.diseaseType === '' ||
                                    item.diseaseType === null
                                      ? 'N/A'
                                      : item.diseaseType}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    />
                    {this.props.diseasesHistoryData.length > 0 && (
                      <View style={{zIndex: 80}}>
                        <View style={{flexDirection: 'row'}}></View>
                        <TouchableOpacity
                          onPress={async () => {
                            this.onOpen();
                          }}
                          style={{
                            position: 'absolute',
                            bottom: Platform.OS === 'ios' ? hp(19) : hp(17),
                            right: 10,
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
                            }}>
                            <Image source={Images.shareIcon} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ) : (
                  (this.props.diseasesHistoryData.length === 0 && (!this.state.showLoader))  && (
                    <View
                      {...this._panResponder.panHandlers}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.BgColor,
                        paddingBottom: hp(10),
                        borderColor:'red',
                        borderWidth:0
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
                // <ShareHistory moduleID={5} />
                //  <Text>False Condition</Text>
                <Fragment>
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
                              this.setState({
                                modalVisible: false,
                                sessionModal: false,
                                show: false,
                              });
                              storeItem(BlueButtonAccessToken, '');
                              storeItem(BlueButtonRefreshToken, '');
                              storeItem(IsAcoUserLogin, 'false');
                              clearTimeout(this.timer);
                              // this.props.navigation.navigate('MainDashboard', {
                              //   screenName: 'Profile',
                              // });
                              this.props.navigation.navigate(
                                'AuthenticationType',
                              );
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
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: Colors.white,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      shadowOffset: {width: 0.5, height: 0.5},
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      // paddingTop: hp(2),
                    }}>
                    {/* here starts the list */}
                    {(this.state.emailHistoryList.length && !this.state.isDisease) ? (
                      <FlatList
                        contentContainerStyle={{marginHorizontal: hp(1)}}
                        data={this.state.emailHistoryList}
                        onEndReached={({distanceFromEnd}) => {
                          console.log('Distance', distanceFromEnd);
                          if ( !this.state.showLoader && this.state.pageNumber !== 0 && parseInt(distanceFromEnd) >= 0)
                          {
                            this.state.historyList.length > 0 &&
                            this.getModuleHistory('get',2);
                          }
                        }}
                        onEndReachedThreshold={0.05}
                        renderItem={({item}) => {
                        console.log('item in history on desease : ',item);
                          return (
                            <View style={{paddingTop: hp(1)}}>
                              {console.log('item being recivedde', item)}
                              <Text
                                style={{
                                  marginHorizontal: hp(2),
                                  fontSize: hp(2),
                                  fontFamily: Fonts.SourceSansSemibold,
                                  color: Colors.black4,
                                }}>
                                {this.isTodayYesterday(
                                  Moment(item.createdDate).format('L'),
                                )}
                              </Text>
                              {item.objects && item.objects.length
                                ? item.objects.map((data, index) => {
                                    // console.log('item.Valueeee', data);
                                    return (
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
                                              backgroundColor: Colors.bleLayer4,
                                              marginHorizontal: hp(2),
                                              paddingVertical: hp(1.5),
                                              width:
                                                Platform.OS === 'ios'
                                                  ? hp(6.5)
                                                  : hp(7),
                                              height:
                                                Platform.OS === 'android'
                                                  ? hp(7)
                                                  : hp(6.5),
                                              display: 'flex',
                                              flexDirection: 'row',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                            }}>
                                            <ShareGrey
                                              height="25"
                                              width="25"
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
                                                fontFamily:
                                                  Fonts.SourceSansRegular,
                                                color: Colors.black4,
                                                marginTop: hp(0.3),
                                                borderColor:'red',
                                                borderWidth:0,
                                                textDecorationLine: data.isDeleted === true?'line-through':'none',
                                              }}>
                                              {data.emailAddress}
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
                                                  fontFamily:
                                                    Fonts.SourceSansRegular,
                                                  color: Colors.noRecordFound,
                                                  borderColor:'red',
                                                  borderWidth:0
                                                  // marginTop:
                                                  //   Platform.OS === 'ios' ? hp(0.5) : hp(0),
                                                }}>
                                                {moment.utc(moment.utc(data?.createdDate).format()).local().format('YYYY-MM-DD hh:mm').split(' ')[1]} {moment.utc(moment.utc(data?.createdDate).format()).local().format('YYYY-MM-DD hh:mm:A').split(' ')[1].split(':')[2]}
                                                {/* {Moment(
                                                  data.createdDate,
                                                ).format('LT')} */}
                                              </Text>
                                              <View
                                                style={{
                                                  // marginTop: hp(0.5),
                                                  marginLeft: hp(1),
                                                }}>
                                                <Dot />
                                              </View>
                                              <TouchableOpacity
                                                {...this._panResponder
                                                  .panHandlers}
                                                activeOpacity={
                                                  data.isDeleted === true
                                                    ? 1
                                                    : 0
                                                }
                                                onPress={() =>
                                                  data.isDeleted === false &&
                                                  this.onOpenHistory(data.id)
                                                }>
                                                <Text
                                                  style={{
                                                    fontFamily:
                                                      Fonts.SourceSansRegular,
                                                    color:
                                                      data.isDeleted === true
                                                        ? Colors.black3
                                                        : Colors.blueTextColor,
                                                    // marginLeft: hp(2),
                                                    fontSize: hp(2),
                                                    padding: hp(1),
                                                  }}>
                                                  {data.isDeleted === false
                                                    ? 'Recall'
                                                    : 'Link expired'}
                                                </Text>
                                              </TouchableOpacity>
                                            </View>
                                          </View>
                                        </View>
                                        <View
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            flexDirection: 'row',
                                          }}>
                                          <View
                                            style={{
                                              borderWidth: 0.5,
                                              borderColor: Colors.line,
                                              width:
                                                Platform.OS === 'ios'
                                                  ? '76%'
                                                  : '77%',
                                            }}
                                          />
                                        </View>
                                      </View>
                                    );
                                  })
                                : null}
                            </View>
                          );
                        }}
                        refreshControl={
                          <RefreshControl
                           refreshing={this.state.refreshingHistory}
                           onRefresh={()=>{
                            this.setState({refreshingHistory:true})
                            this.getModuleHistory('get',1)
                            // this.setState({refreshingHistory:false})
                          }}
                          />
                        }
                      />
                    ) : (
                      this.state.showLoader === false && this.state.isDisease === false &&
                      this.state.emailHistoryList?.length === 0 && (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: hp(10),
                          }}
                          {...this._panResponder.panHandlers}>
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
                            No records foundss
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </Fragment>
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
  diseasesHistoryData,
  userProfileData,
  appLogoutTime,
}) => ({
  diseasesHistoryData,
  userProfileData,
  appLogoutTime,
});
export default connect(mapStateToProps)(DiseasesScreen);
