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
  PanResponder,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import {Colors, Svgs} from '../../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts} from '../../../../../config/AppConfig';
import ShareIcon from '../../../../../../assets/svg/icon_share.svg';
import HistoryIcon from '../../../../../../assets/svg/icon_history.svg';
import MedicationService from '../../../../api/medication';
import {getMedicationHistory} from '../../action';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import LottieView from 'lottie-react-native';
import EmailPopover from '../component/EmailPopover';
import {BlurView} from '@react-native-community/blur';
import IconInfo from '../../../../../../assets/svg/icon_info_green.svg';
import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  storeItem,
} from '../../../../helpers/LocalStorage';
import {modalHanlder} from '../../../medication/actions';

import images from '../../../../../config/Images';
import Images from '../../../../../config/Images';
import {Increase} from '../../reducers';
import ShareHistory from '../ShareHistory';
import colors from '../../../../../config/Colors';
import {Modalize} from 'react-native-modalize';
import FastImage from 'react-native-fast-image';
import {SvgCss} from 'react-native-svg';
import ShareGrey from '../../../../../../assets/svg/ShareGrey.svg';
import Dot from '../../../../../../assets/svg/Dot.svg';
import BlueButtonService from '../../../../api/bluebutton';
import Moment from 'moment';
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
const clickHandler = () => {
  //function to handle click on floating Action Button
  alert('Floating Button Clicked');
};
class MedicationScreen extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      pageCount: 10,
      recordFound: true,
      emergencySelected: true,
      shareLoader: false,
      modalVisible: false,
      emailID: '',
      sessionModal: false,
      timeNoAction: this.props.appLogoutTime,
      medicationHistory: [],
      pageNumber: 1,
      emailHistoryList: [],
      historyList: [],
      moduleID: 6,
      selectedItemID: 0,
      refreshingHistory:false
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
    console.log('Component will mount is called..');
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
  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
  }
  componentDidMount(): void {
    this.setState({
      showLoader: true,
    });
    this.medicationHistoryCall();
    this.getModuleHistory('get',0);
  }

  medicationHistoryCall() {
    MedicationService.getMedicationHistory('1', this.state.pageCount)
      .then(response => {
        if (response) {
          if (response.statusCode === 200) {
            console.log('====================================');
            console.log('getMedicationHistory', response.data);
            console.log('====================================');
            if (response.data.length) {
              console.log('Medication Response', response);
              this.setState({showLoader: false});
              this.setState({medicationHistory: response.data});
              this.props.dispatch(getMedicationHistory(response.data));
              this.setState({
                pageCount: this.state.pageCount + 10,
              });
            } else {
              // this.setState({recordFound: false});
              this.setState({recordFound: false,showLoader: false});
            }
          } else {
            console.log('Medication Response', response);
            this.props.dispatch(getMedicationHistory([]));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getMedicationHistoryError');
        console.log(error);
      });
    console.log('====================================');
    console.log(
      'this.props.medicationHistoryData',
      this.state.medicationHistory,
    );
    console.log('====================================');
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '80%',
          backgroundColor: Colors.BgColor,
          marginLeft: hp(2),
          marginRight: hp(2),
          marginTop: hp(1),
          marginBottom: hp(1),
          alignSelf: 'flex-end',
        }}
      />
    );
  };

  getInteractionCountAndType(key, interactionData) {
    if (key === 'drugToDrugInteractionCount') {
      return `${interactionData[key]} Drug`;
    } else if (key === 'drugToFoodInteractionCount') {
      return `${interactionData[key]} Food`;
    } else if (key === 'drugToAllergyInteractionCount') {
      return `${interactionData[key]} Allergy`;
    } else if (key === 'drugToLabInteractionCount') {
      return `${interactionData[key]} Lab`;
    }
  }

  getInteractionDetailObj(selectedInteraction, interactionrray, rowIndex) {
    console.log('Row Index Called', rowIndex);
    console.log(
      'Row Index Called',
      this.state.medicationHistory[rowIndex].drugCode,
    );

    if (selectedInteraction === 'drugToDrugInteractionCount') {
      let array = {
        ndcs: interactionrray.drugToDrugInteractionNDCs,
        type: 0,
        name: 'Drug Interaction(s)',
        count: interactionrray.drugToDrugInteractionCount,
        drugCode: this.state.medicationHistory[rowIndex].drugCode,
      };
      console.log('NDCS and Count Detail of DRUG', array);
      return array;
    } else if (selectedInteraction === 'drugToFoodInteractionCount') {
      let array = {
        ndcs: interactionrray.drugToFoodInteractionNDCs,
        type: 1,
        name: 'Food Interaction(s)',
        count: interactionrray.drugToFoodInteractionCount,
        drugCode: this.state.medicationHistory[rowIndex].drugCode,
      };
      console.log('NDCS and Count Detail of FOOD', array);
      return array;
    } else if (selectedInteraction === 'drugToAllergyInteractionCount') {
      let array = {
        ndcs: interactionrray.drugToAllergyInteractionNDCs,
        type: 2,
        name: 'Allergy Interaction(s)',
        count: interactionrray.drugToAllergyInteractionCount,
        drugCode: this.state.medicationHistory[rowIndex].drugCode,
      };
      console.log('NDCS and Count Detail of ALLERGY', array);
      return array;
    } else if (selectedInteraction === 'drugToLabInteractionCount') {
      let array = {
        ndcs: interactionrray.drugToLabInteractionNDCs,
        type: 3,
        name: 'Lab Interaction(s)',
        count: interactionrray.drugToLabInteractionCount,
        drugCode: this.state.medicationHistory[rowIndex].drugCode,
      };
      console.log('NDCS and Count Detail of LAB', array);
      return array;
    }
  }

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
  //   console.log('execurted');
  //   console.log('====================================');
  //   if (type === 'revoke') {
  //     this.setState({pageNumber: 0, emailHistoryList: [], historyList: []});
  //   }
  //   this.setState({showLoader: true});
  //   BlueButtonService.getModuleShareHistory(
  //     this.state.moduleID,
  //     this.state.pageNumber,
  //   )
  //     .then(response => {
  //       // this.setState({showLoader: false});
  //       console.log('getShareHistory');
  //       console.log(JSON.stringify(response.data.length));
  //       console.log(response.data);
  //       if (response.data.length > 0) {
  //         if (response.statusCode) {
  //           console.log('Data in response is : ',response?.data)
  //           // var dummyArr = this.state.emailHistoryList.concat(response.data);
  //           const groupedData = this.state.emailHistoryList
  //             .concat(response.data)
  //             .reduce((acc, cur) => {
  //               const createdDate = cur.createdDate.split('T')[0];
  //               const existingGroup = acc.find(
  //                 group => group.createdDate === createdDate,
  //               );
  //               if (existingGroup) {
  //                 existingGroup.objects.push(cur);
  //               } else {
  //                 acc.push({createdDate, objects: [cur]});
  //               }
  //               return acc;
  //             }, []);
  //           console.log('====================================');
  //           console.log('grouped before refactoring', groupedData);
  //           console.log('====================================');
             
  //           for(let i=0;i<groupedData.length;i++)
  //           {                
  //            // Generic check for removing the empty objects from the list
  //             if(groupedData[i].objects[0].emailAddress === undefined)
  //             {
  //               groupedData[i].objects=groupedData[i].objects.slice(1);
  //             }
  //            }
  //            console.log('====================================');
  //            console.log('grouped after refactoring', groupedData,'Sub type is : ',subtype);
  //            console.log('====================================');
  //              // this check is to stop the loading after sending the email (START)
  //              if((subtype === 4) || (subtype === 0))
  //              {
  //                this.setState({showLoader: false});
  //              }
  //              // this check is to stop the loading after sending the email (End)
  //           this.setState({
  //             emailHistoryList: groupedData,
  //             pageNumber: this.state.pageNumber + 1,
  //             historyList: response.data,
  //           });
  //         } else {
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
  render() {
    return (
      <Fragment>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
            // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          }}>
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
                  source={require('../../../../../../assets/images/icon_unlink.png')}
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
                moduleID={6}
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
                      console.log(
                        'UserProfileData',
                        this.props.userProfileData,
                      );
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
                      marginRight: heightPercentageToDP(1),
                      fontSize: hp(5),
                      color: Colors.black1,
                    }}>
                    W
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.SFProSemibold,
                    // marginLeft: hp(8),
                    fontSize: hp(2.5),
                    color: Colors.black,
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  Medication(s)
                </Text>

                <View
                  style={{
                    alignItems: 'flex-end',
                    marginRight: hp(2),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
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
                        Medicine(s)
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
                this.state.medicationHistory.length ? (
                  <View
                    style={{
                      backgroundColor: Colors.BgColor,
                      flex: 1,
                      // paddingTop: 10,
                      // marginTop: hp(2),
                    }}>
                    <FlatList
                    style={{borderColor:'red',borderWidth:0}}
                      contentContainerStyle={{
                        marginBottom: hp(1),
                        backgroundColor: Colors.BgColor,
                        marginTop: hp(2),
                        paddingBottom:Platform.OS === 'android'?200:0
                       }}
                      contentInset={{ bottom: 25 }} // Add some bottom inset
                      contentOffset={{ x: 0, y:-25 }}
                      data={this.state.medicationHistory}
                      ItemSeparatorComponent={this.renderSeparator}
                      onEndReached={() => {
                        if (this.state.recordFound) {
                          this.setState({showLoader: true});
                          console.log('On end reached');
                          this.medicationHistoryCall();
                        }
                      }}
                      onEndReachedThreshold={0.1}
                      
                      renderItem={({item, index}) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'center',
                              marginHorizontal: hp(2),
                              // minHeight: hp(17),
                              // width: hp(42),
                              borderRadius: 10,
                              shadowOffset: {width: 0.5, height: 0.5},
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                              elevation: 5,
                              backgroundColor: Colors.white,
                              alignItems: 'flex-start',
                              paddingVertical: hp(1.5),
                              paddingHorizontal: hp(0.5),
                              borderColor:'green',
                              borderWidth:0,
                              marginTop:Platform.OS==='android'?hp(1):0
                              
                            }}
                            {...this._panResponder.panHandlers}>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                              }}>
                              <Image
                                style={{
                                  width: 50,
                                  height: 60,
                                  // marginTop: hp(2),
                                  marginLeft: hp(2),
                                  resizeMode: 'contain',
                                }}
                                source={images.medicationMed}
                              />
                              <View
                                style={{
                                  flex: 1,
                                  padding: hp(1),
                                }}>
                                <Text
                                  style={{
                                    marginTop: hp(0.5),
                                    marginLeft: hp(1.5),
                                    fontFamily: Fonts.SourceSansRegular,
                                    fontSize: hp(2.2),
                                    color: Fonts.black4,
                                  }}>
                                  {item.propName}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: Fonts.SourceSansRegular,
                                    color: Colors.black2,
                                    marginLeft: hp(1.5),
                                    fontSize: hp(2),
                                  }}>
                                  Start at {item.serviceDate}
                                </Text>
                                {item.prescribedBy === '' ||
                                  (item.prescribedBy === null && (
                                    <Text
                                      style={{
                                        marginTop: hp(0.5),
                                        fontFamily: Fonts.SourceSansSemibold,
                                        marginLeft: hp(1.5),
                                        color: Colors.black2,
                                      }}>
                                      {item.prescribedBy}
                                    </Text>
                                  ))}
                                {
                                  item.interactions !== null && (
                                    // <View
                                    //     style={{
                                    //         flexDirection: 'column',
                                    //         marginTop: hp(1),
                                    //         alignItems: 'flex-start',
                                    //     }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginVertical: hp(1),
                                      }}>
                                      {Object.keys(item.interactions).map(
                                        key => {
                                          if (
                                            key.includes('Count') &&
                                            item.interactions[key] !== 0
                                          ) {
                                            return (
                                              <TouchableOpacity
                                                style={{
                                                  marginRight: hp(1),
                                                  marginLeft: hp(1.5),
                                                  marginTop: hp(1),

                                                  backgroundColor:
                                                    Colors.bleLayer4,
                                                  // marginHorizontal: hp(1),
                                                  borderRadius: hp(2),
                                                }}
                                                {...this._panResponder
                                                  .panHandlers}
                                                onPress={() => {
                                                  const responseData =
                                                    this.getInteractionDetailObj(
                                                      key,
                                                      item.interactions,
                                                      index,
                                                    );
                                                  console.log(
                                                    'Data of interation',
                                                    responseData,
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
                                                      Fonts.SourceSansRegular,
                                                    paddingVertical: hp(0.5),
                                                    paddingHorizontal: hp(2),
                                                    color: Colors.blueTextColor,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignSelf: 'flex-start',
                                                  }}>
                                                  {this.getInteractionCountAndType(
                                                    key,
                                                    item.interactions,
                                                  )}
                                                </Text>
                                              </TouchableOpacity>
                                            );
                                          }
                                        },
                                      )}
                                    </View>
                                  )

                                  // </View>
                                }
                              </View>
                            </View>
                          </View>
                        );
                      }}
                    />
                    {this.state.medicationHistory.length > 0 && (
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
                            <Image source={images.shareIcon} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ) : (
                  this.state.showLoader === false &&
                  this.medicationHistory?.length === 0 && (
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
                // <ShareHistory moduleID={6} />
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
                          if (
                            !this.state.showLoader &&
                            this.state.pageNumber !== 0 &&
                            parseInt(distanceFromEnd) >= 0
                          ) {
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
              {/* this check is for when the user come from the blue button and dont have his history (START) */}
              {
                (this.state.shareLoader === false && this.state.recordFound === false && this.state.medicationHistory.length===0 && this.state.emergencySelected===true)?
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
              </View>:null
                 
              }
              {/* this check is for when the user come from the blue button and dont have his history (END) */}
              {this.state.shareLoader === true ? (
                <LottieView
                  source={require('../../../../../../assets/animations/animation_loading.json')}
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
  medicationHistoryData,
  userProfileData,
  appLogoutTime,
}) => ({
  medicationHistoryData,
  userProfileData,
  appLogoutTime,
});
export default connect(mapStateToProps)(MedicationScreen);

const styles = StyleSheet.create({
  touchableOpacityStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    borderRadius: 100,
  },
});
