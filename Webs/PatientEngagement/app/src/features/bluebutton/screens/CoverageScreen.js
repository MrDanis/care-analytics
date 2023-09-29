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
  ScrollView,
  Modal,
  PanResponder,
  Image,
  Platform,
} from 'react-native';
import {Colors, Svgs} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts} from '../../../../config/AppConfig';
import RightIcon from '../../../../../assets/svg/icon_arrow_right.svg';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import LeftArrowIcon from '../../../../../assets/svg/icon_arrow_head_left.svg';
import ReferenceNumberIcon from '../../../../../assets/svg/icon_coverage_reference_number.svg';
import {getCoverageHistory} from '../action';
import BlueButtonService from '../../../api/bluebutton';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import AppointmentIcon from '../../../../../assets/svg/icon_his_appointment.svg';
import Share from 'react-native-share';
import Moment from 'moment';
import {impureFinalPropsSelectorFactory} from 'react-redux/lib/connect/selectorFactory';
import {returnPdfFileFromStorage} from './component/HtmlToPdf';
import LottieView from 'lottie-react-native';
import EmailPopover from './component/EmailPopover';
import {BlurView} from '@react-native-community/blur';
import ShareGrey from '../../../../../assets/svg/ShareGrey.svg';
import Dot from '../../../../../assets/svg/Dot.svg';
import IconInfo from '../../../../../assets/svg/icon_info_green.svg';
import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  storeItem,
} from '../../../helpers/LocalStorage';
import CoverageDetailsCard from './component/CoverageDetailsCard';
import Images from '../../../../config/Images';
import {showMessage} from 'react-native-flash-message';
import ShareHistory from './ShareHistory';
import {Modalize} from 'react-native-modalize';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';
import {modalHanlder} from '../../medication/actions';
import {black} from 'react-native-paper/lib/typescript/styles/colors';
import moment from 'moment';
import { RefreshControl } from 'react-native-gesture-handler';
import { sub } from 'react-native-reanimated';
class CoverageScreen extends React.PureComponent {
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
      coverageDetails: null,
      blurred: false,
      pageNumber: 1,
      emailHistoryList: [],
      historyList: [],
      moduleID: 4,
      selectedItemID: 0,
      refreshingHistory:false
    };
  }
  state = {
    show: true,
  };
  _panResponder = {};
  timer = 0;
  coverageArray = [];
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
    console.log('====================================');
    console.log('reset');
    console.log('====================================');
    clearTimeout(this.timer);
    if (this.state.show) {
      this.setState({show: false}, async () => {
        this.setSessionModalVisible();
      });
    }
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  componentDidMount(): void {
    console.log('This is the coverage screen : ',this.props)
    this.setState({
      showLoader: true,
    });
    this.getModuleHistory('get',0);
    BlueButtonService.getCoverageHistory()
      .then(response => {
        this.setState({showLoader: false});
        console.log('getCoverageHistory');
        console.log(response);
        if (response) {
          if (response.statusCode === 200) {
            this.coverageArray.push({
              value:
                response.data.orec === '' || response.data.orec === null
                  ? 'N/A'
                  : response.data.orec,
              name: 'OREC',
            });
            this.coverageArray.push({
              value:
                response.data.crec === '' || response.data.crec === null
                  ? 'N/A'
                  : response.data.crec,
              name: 'CREC',
            });
            this.coverageArray.push({
              value:
                response.data.entitlmentPeriod === '' ||
                response.data.entitlmentPeriod === null
                  ? 'N/A'
                  : response.data.entitlmentPeriod,
              name: 'Entitlement Year',
            });
            this.coverageArray.push({
              value:
                response.data.buyInIndicator === '' ||
                response.data.buyInIndicator === null
                  ? 'N/A'
                  : response.data.buyInIndicator,
              name: 'Entitlement/Buy-in indicator',
            });
            this.coverageArray.push({
              value: response.data.consumedAmount,
              name: 'Consumed Amount (Last 12 Months)',
            });
            this.coverageArray.push({
              value: response.data.uncoveredServicesAmount,
              name: 'Uncovered Services Amount',
            });
            this.coverageArray.push({
              value:
                response.data.esrdIndicator === '' ||
                response.data.esrdIndicator === null
                  ? 'N/A'
                  : response.data.esrdIndicator,
              name: 'End stage Renal Disease(ESRD)',
            });
            console.log('====================================');
            console.log('coverageArray', this.coverageArray);
            console.log('====================================');
            this.setState({coverageDetails: response.data});
            this.props.dispatch(getCoverageHistory(response.data));
          } else {
            this.props.dispatch(getCoverageHistory([]));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getCoverageHistoryError');
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
  getModuleHistory(type,subtype) {
    console.log('====================================');
    console.log('executed and request Type is ',subtype);
    console.log('====================================');
    if (type === 'revoke') {
      this.setState({pageNumber: 1, emailHistoryList: [], historyList: []});
      this.setState({showLoader: false})
    }
    if((subtype === 1)||(subtype === 4))
    {
      this.setState({pageNumber: 0});
    }
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
  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
    this.resetTimer();
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
  // getData() {
  //   console.log('Refresh status is : ',this.state.refreshingHistory);
  //   this.setState({refreshingHistory:false});
  // }
  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
          <Spinner
            visible={this.state.showLoader || this.state.historyList.length<0}
            textContent={'Please Wait....'}
            textStyle={{color: '#FFF'}}
          />
          <Modalize
            ref="modalizeHistory"
            adjustToContentHeight={true}
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
            withHandle={false}
            onClosed={() => {
              this.props.dispatch(modalHanlder(true));
            }}
            modalStyle={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
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
                paddingBottom: hp(4),
              }}>
              <EmailPopover
                moduleID={4}
                keyboardFocus={() => this.heightToggle()}
                dismissModal={() => this.onClose()}
                onOpen={() => this.onOpen(this.state.emailID)}
                navigation={this?.props?.navigation}
                updateData={()=> this.getModuleHistory('get',4)}
                
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
          <View style={{flex: 1,borderColor:'red',borderWidth:0}} collapsable={false}>
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
                  // marginBottom: hp(2),
                  backgroundColor: Colors.BgColor,
                  // backgroundColor: this.state.blurred
                  //   ? 'rgba(0, 0, 0, 0.65)'
                  //   : Colors.BgColor,
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
                      color: Colors.black,
                    }}>
                    W
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.SFProSemibold,
                    textAlign: 'center',
                    fontSize: hp(2.5),
                    color: Colors.black,
                    flex: 1,
                    textTransform: 'capitalize',
                  }}>
                  Coverage
                </Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    marginRight: hp(0.5),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginRight: hp(2),
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('NotificationStack')
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
              </View>
              <View
                style={{
                  backgroundColor: Colors.BgColor,
                  width: '100%',
                  paddingBottom: hp(2),
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: hp(2),
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
                        Coverage
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
                this.state.coverageDetails !== null ? (
                  <View
                    style={{
                      backgroundColor: Colors.BgColor,
                      flex: 1,
                      // paddingTop: 10,
                      // marginTop: hp(2),
                    }}>
                    <ScrollView
                      style={{
                        flex: 1,
                        paddingHorizontal: hp(2),
                        paddingVertical: hp(4.6),
                        borderColor:'green',
                        borderWidth:0,
                        
                      }}>
                        {
                          Platform.OS === 'android'?
                          <View style={{display:'flex',alignItems:'center',position:'relative',borderColor:'blue',borderWidth:0,height:30,width:'100%',marginBottom:hp(1)}}>
                            <View style={{position:'absolute',top:0,left:0,width:'100%',borderColor:'red',borderWidth:0,alignItems:'center',zIndex:1111}}>
                              <Image
                                style={{
                                  width: 60,
                                  height: 60,
                                  // position:'absolute',
                                    // marginTop: '8%',
                                  resizeMode: 'contain',
                                  // zIndex:1111
                                  
                                }}
                                source={Images.coverageScreenIconNew}
                              />
                            </View>
                          {/* <Image
                            style={{
                              width: 60,
                              height: 60,
                              // position:'absolute',
                                marginTop: '8%',
                              resizeMode: 'contain',
                              zIndex:1000
                              
                            }}
                            source={Images.coverageScreenIconNew}
                          /> */}
                        </View>:null
                        }
                      <View
                        {...this._panResponder.panHandlers}
                        style={{
                          shadowOffset: {width: 0.5, height: 0.5},
                          shadowOpacity: 0.1,
                          // height: hp(30),
                          shadowRadius: 8,
                          elevation: 3,
                          backgroundColor: Colors.white,
                          borderRadius: 10,
                          borderBottomColor: Colors.line,
                          //marginTop: 0
                          paddingBottom: hp(2),
                          borderColor:'red',
                          zIndex:Platform.OS==='android'?-1:0
                        }}>
                          {
                            Platform.OS==='ios'?
                            <View style={{alignItems: 'center'}}>
                              <Image
                                style={{
                                  width: 60,
                                  height: 60,
                                  marginTop: '-8%',
                                  resizeMode: 'contain',
                                  
                                }}
                                source={Images.coverageScreenIconNew}
                              />
                            </View>:
                            <View style={{height:hp(2),borderColor:'red',borderWidth:0}}>
                               {/* This view is for android because above make issues in design */}
                            </View>
                          }
                        <View
                          style={{
                            marginHorizontal: hp(3),
                            paddingTop: 15,
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily: Fonts.SourceSansSemibold,
                              color: Colors.noRecordFound,
                              fontSize: hp(2),
                            }}>
                            Reference Number
                          </Text>
                          <Text
                            style={{
                              marginTop: hp(0.7),
                              fontFamily: Fonts.SourceSansSemibold,
                              fontSize: hp(2),
                              color: Colors.black4,
                            }}>
                            {this.state.coverageDetails?.referenceNumber ===
                              '' ||
                            this.state.coverageDetails?.referenceNumber === null
                              ? 'N/A'
                              : this.state.coverageDetails?.referenceNumber}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: hp(8),
                            marginVertical: hp(2),
                            flexDirection: 'row',
                            width: '100%',
                            paddingTop: hp(1),
                          }}>
                          <View
                            style={{
                              width: '33%',
                              alignItems: 'center',
                              paddingLeft: hp(1),
                            }}>
                            <Text
                              style={{
                                marginTop: hp(0.7),
                                fontFamily: Fonts.SourceSansSemibold,
                                fontSize: hp(2),
                                color: Colors.black4,
                              }}>
                              $1520.00
                            </Text>
                            <Text
                              style={{
                                fontFamily: Fonts.SourceSansRegular,
                                color: Colors.noRecordFound,
                                fontSize: 12,
                                paddingTop: 2,
                                maxWidth: 130,
                              }}>
                              Consumed Amount
                            </Text>
                            <Text
                              style={{
                                fontFamily: Fonts.SourceSansRegular,
                                color: Colors.noRecordFound,
                                fontSize: 12,
                                paddingTop: 2,
                                maxWidth: 130,
                              }}>
                              (Last 12 Months)
                            </Text>
                          </View>
                          <View
                            style={{
                              height: '100%',
                              width: 1,
                              backgroundColor: Colors.lineGrey,
                              marginHorizontal: hp(1),
                            }}></View>
                          <View style={{width: '29%', alignItems: 'center'}}>
                            <Text
                              style={{
                                marginTop: hp(0.7),
                                fontFamily: Fonts.SourceSansSemibold,
                                fontSize: hp(2),
                                color: Colors.black4,
                              }}>
                              $1520.00
                            </Text>
                            <Text
                              style={{
                                fontFamily: Fonts.SourceSansRegular,
                                color: Colors.noRecordFound,
                                fontSize: 12,
                                paddingTop: 2,
                                maxWidth: 130,
                              }}>
                              Uncovered
                            </Text>
                            <Text
                              style={{
                                fontFamily: Fonts.SourceSansRegular,
                                color: Colors.noRecordFound,
                                fontSize: 12,
                                paddingTop: 2,
                                maxWidth: 130,
                              }}>
                              Services Amount
                            </Text>
                          </View>
                          <View
                            style={{
                              height: '100%',
                              width: 0.5,
                              backgroundColor: Colors.lineGrey,
                              marginHorizontal: hp(1),
                            }}></View>
                          <View style={{width: '25%', alignItems: 'center'}}>
                            <Text
                              style={{
                                marginTop: hp(0.7),
                                fontFamily: Fonts.SourceSansSemibold,
                                fontSize: hp(2),
                                color: Colors.black4,
                              }}>
                              $1520.00
                            </Text>
                            <Text
                              style={{
                                fontFamily: Fonts.SourceSansRegular,
                                color: Colors.noRecordFound,
                                fontSize: 12,
                                paddingTop: 2,
                                maxWidth: 130,
                              }}>
                              Entitlement
                            </Text>
                            <Text
                              style={{
                                fontFamily: Fonts.SourceSansRegular,
                                color: Colors.noRecordFound,
                                fontSize: 12,
                                paddingTop: 2,
                                maxWidth: 130,
                              }}>
                              Year
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            marginTop: hp(1),
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              // marginTop: hp(0.5),
                              fontFamily: Fonts.SourceSansSemibold,
                              fontSize: hp(2),
                              color: Colors.black4,
                            }}>
                            {this.state.coverageDetails
                              ?.monthlyEnrolmentInfo === '' ||
                            this.state.coverageDetails?.monthlyEnrolmentInfo ===
                              null
                              ? 'N/A'
                              : this.state.coverageDetails
                                  ?.monthlyEnrolmentInfo}
                          </Text>
                          <Text
                            style={{
                              fontFamily: Fonts.SourceSansSemibold,
                              color: Colors.noRecordFound,
                              fontSize: hp(1.7),
                            }}>
                            Monthly Enrollment Information
                          </Text>
                        </View>
                      </View>

                      <FlatList
                        columnWrapperStyle={{justifyContent: 'space-evenly'}}
                        style={{marginBottom: hp(6.5)}}
                        data={this.coverageArray}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) => {
                          console.log('item', item);
                          return (
                            <View
                              {...this._panResponder.panHandlers}
                              style={{
                                // backgroundColor: Colors.white,
                                borderRadius: 8,
                                shadowOffset: {width: 0.5, height: 0.5},
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                borderWidth: 1,
                                borderColor: Colors.line,
                                width:
                                  item.name === 'End stage Renal Disease(ESRD)'
                                    ? '90%'
                                    : '43%',
                                marginTop: hp(3),
                                shadowOffset: {width: 0.5, height: 0.5},
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 1,
                                backgroundColor: Colors.BgColor,
                              }}>
                              <CoverageDetailsCard
                                coverageDetailsName={item.name}
                                coverageDetailsValue={item.value}
                              />
                            </View>
                          );
                        }}
                      />
                      {/* <View
                      style={{
                        marginHorizontal: hp(3),
                        marginVertical: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.label,
                          fontSize: hp(2.5),
                        }}>
                        OREC
                      </Text>
                      <Text
                        style={{
                          marginTop: hp(0.5),
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                        }}>
                        {this.state.coverageDetails?.orec === '' ||
                        this.state.coverageDetails?.orec === null
                          ? 'N/A'
                          : this.state.coverageDetails?.orec}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginHorizontal: hp(3),
                        marginVertical: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.label,
                          fontSize: hp(2.5),
                        }}>
                        CREC
                      </Text>
                      <Text
                        style={{
                          marginTop: hp(0.5),
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                        }}>
                        {this.state.coverageDetails?.crec === '' ||
                        this.state.coverageDetails?.crec === null
                          ? 'N/A'
                          : this.state.coverageDetails?.crec}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginHorizontal: hp(3),
                        marginVertical: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.label,
                          fontSize: hp(2.5),
                        }}>
                        End-Stage Renal Disease (ESRD)
                      </Text>
                      <Text
                        style={{
                          marginTop: hp(0.5),
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                        }}>
                        {this.state.coverageDetails?.esrdIndicator === '' ||
                        this.state.coverageDetails?.esrdIndicator === null
                          ? 'N/A'
                          : this.state.coverageDetails?.esrdIndicator}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginHorizontal: hp(3),
                        marginVertical: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.label,
                          fontSize: hp(2.5),
                        }}>
                        Entitlement Year
                      </Text>
                      <Text
                        style={{
                          marginTop: hp(0.5),
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                        }}>
                        {this.state.coverageDetails?.entitlmentPeriod === '' ||
                        this.state.coverageDetails?.entitlmentPeriod === null
                          ? 'N/A'
                          : this.state.coverageDetails?.entitlmentPeriod}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginHorizontal: hp(3),
                        marginVertical: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.label,
                          fontSize: hp(2.5),
                        }}>
                        Entitlement/Buy-in indicator
                      </Text>
                      <Text
                        style={{
                          marginTop: hp(0.5),
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                        }}>
                        {this.state.coverageDetails?.buyInIndicator === '' ||
                        this.state.coverageDetails?.buyInIndicator === null
                          ? 'N/A'
                          : this.state.coverageDetails?.buyInIndicator}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginHorizontal: hp(3),
                        marginVertical: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.label,
                          fontSize: hp(2.5),
                        }}>
                        Consumed Amount{' '}
                        <Text style={{fontSize: hp(1.8)}}>
                          (Last 12 Months)
                        </Text>
                      </Text>
                      <Text
                        style={{
                          marginTop: hp(0.5),
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                        }}>
                        {this.state.coverageDetails?.consumedAmount === '' ||
                        this.state.coverageDetails?.consumedAmount === null
                          ? '$0'
                          : '$' + this.state.coverageDetails?.consumedAmount}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginHorizontal: hp(3),
                        marginVertical: hp(1),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.label,
                          fontSize: hp(2.5),
                        }}>
                        Uncovered Services Amount
                      </Text>
                      <Text
                        style={{
                          marginTop: hp(0.5),
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                        }}>
                        {this.state.coverageDetails?.uncoveredServicesAmount ===
                          '' ||
                        this.state.coverageDetails?.uncoveredServicesAmount ===
                          null
                          ? '$0'
                          : '$' +
                            this.state.coverageDetails?.uncoveredServicesAmount}
                      </Text>
                    </View> */}
                    </ScrollView>
                    {this.coverageArray.length > 0 && (
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
                  this.coverageArray?.length === 0 && (
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
                )
              ) : (
                // <ShareHistory
                //   modalOpen={this.setModalOpen}
                //   modalClose={this.setModalClose}
                //   moduleID={4}
                // />

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
                    {this.state.emailHistoryList.length ? (
                      <FlatList
                        contentContainerStyle={{marginHorizontal: hp(1)}}
                        data={this.state.emailHistoryList}
                        onEndReached={({distanceFromEnd}) => {
                          console.log('Distance', distanceFromEnd);
                          if (!this.state.showLoader && this.state.pageNumber !== 0 && parseInt(distanceFromEnd) >= 0) {
                            console.log('Come to this condition for reach end');
                            this.state.historyList.length > 0 &&
                            this.getModuleHistory('get',2);
                          }
                        }}
                        onEndReachedThreshold={0.05}
                        renderItem={({item}) => {
                          return (
                            <View style={{paddingTop: hp(1)}}>
                              {/* {console.log('item being recivede', item)} */}
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
                      this.state.showLoader === false &&
                      this.state.emailHistoryList.length === 0 && (
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
                            No records found
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
  coverageHistoryData,
  userProfileData,
  appLogoutTime,
}) => ({
  coverageHistoryData,
  userProfileData,
  appLogoutTime,
});
export default connect(mapStateToProps)(CoverageScreen);
