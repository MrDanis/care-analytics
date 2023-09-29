import React, {Component, Fragment, useEffect, useState, useRef} from 'react';
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
import {getProviderHistory} from '../../action';
import BlueButtonService from '../../../../api/bluebutton';
import ShareGrey from '../../../../../../assets/svg/ShareGrey.svg';
import Dot from '../../../../../../assets/svg/Dot.svg';
import Moment from 'moment';
import moment from 'moment';
import { RefreshControl } from 'react-native-gesture-handler';
const ProviderHistory = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = useState(10);
  const [recordFound, setRecordFound] = useState(true);
  const [refreshingHistory,setrefreshingHistory] = useState(false)
  const [providerhistory, setProviderhistory] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [emailHistoryList, setEmailHistoryList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [moduleID, setModuleID] = useState(8);
  const [sessionModal, setSessionModal] = useState(0);
  const [selectedItemID, setSelectedItemID] = useState(0);

  const modalizeHistory = useRef(null);
  function providerHistoryCall() {
    setLoader(true); 
    console.log('====================================');
    console.log('ran');
    console.log('====================================');
    BlueButtonService.getProviderHistory('1', pageCount)
      .then(response => {
        setLoader(false);
        console.log('====================================');
        console.log('Response for provider history', response);
        console.log('====================================');
        if (response.data.length) {
          setProviderhistory(response.data);
          setPageCount(pageCount + 10);
        } else {
          setRecordFound(false);
        }
      })
      .catch(error => {
        setLoader(false);

        console.log('getProviderHistoryError');
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
  function getModuleHistory(type,subtype) {
    console.log('====================================');
    console.log('executed and subtype is ',subtype);
    console.log('====================================');
    setLoader(true);
    console.log('ho re ha call with ', moduleID, pageNumber);

    BlueButtonService.getModuleShareHistory(moduleID, subtype===1?1:pageNumber)
      .then(response => {
        console.log('ho re ha call ');
        console.log('getShareHistory');
        console.log(JSON.stringify(response.data.length));
        console.log(response);
        if (response.data.length > 0) {
          if (response.statusCode) {
            // var dummyArr = emailHistoryList.concat(response.data);
            
            // const groupedData = emailHistoryList
            // .concat(response.data)
            // .reduce((acc, cur) => {
            //   const createdDate = cur.createdDate.split('T')[0];
            //   const existingGroup = acc.find(
            //     group => group.createdDate === createdDate,
            //     );
            //     if (existingGroup) {
            //       existingGroup.objects.push(cur);
            //     } else {
            //       acc.push({createdDate, objects: [cur]});
            //     }
            //     return acc;
            //   }, []);
            //   console.log('====================================');
            //   console.log('grouped provider history', groupedData);
            //   console.log('====================================');
            //   // subtype 2 is used because when this function is called from on react end so it will create an empty object for each array 
            //   if((subtype === 2))
            //   {
            //     for(let i=0;i<groupedData.length;i++)
            //     {
            //       if(groupedData[i].objects[0].emailAddress === undefined)
            //       {
            //         groupedData[i].objects=groupedData[i].objects.slice(1);
            //       }
            //       // // console.log('Refreshing data at 0 index : ',groupedData[i].objects)
            //       // groupedData[i].objects=groupedData[i].objects.slice(1);
            //     }
            //     console.log('This if is working....',subtype);
            //   }
            // ==================================================================================== 
            //=============== Code by Danish (Start) ================================================
            let dummyArr = response.data;
            console.log('Dummy array data : ',dummyArr)
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
                      createdDate:dummyArr[currentDateIndex].createdDate.split('T')[0],
                      objects:data
                    });
                    break;
                  }
              }
            }
            switch (subtype) {
              case 0:
                // Called when the useEffect is called  
                setEmailHistoryList(sampleData);
                setPageNumber(pageNumber + 1);
                setHistoryList(response.data);
                //setLoader(false);
                break;
              case 1:
                // called when the list is used to refresh
                setEmailHistoryList(sampleData);
                setPageNumber(2);
                setHistoryList(response.data);
                setrefreshingHistory(false)
                break;
              case 2:
                // Calle when reach end on scroll down is called
                let previousList = emailHistoryList;
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
                setEmailHistoryList(previousList);
                setPageNumber(pageNumber + 1);
                setHistoryList(response.data);
               // setLoader(false);  
                break;
              default:
                break;
            }
            //=============== Code by Danish (End) ================================================
            
            // setEmailHistoryList(groupedData);
            // setPageNumber(pageNumber + 1);
            // setHistoryList(response.data);
             setLoader(false);

          } else {
            setEmailHistoryList([]);
          }
        } else {
          setLoader(false);
          setHistoryList([]);
          setrefreshingHistory(false);
        }
      })
      .catch(error => {
        setLoader(false);

        console.log('getShareHistory Error');
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
  function isTodayYesterday(date) {
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
  }
  function onOpenHistory(id) {
    modalizeHistory.current?.open();

    setSelectedItemID(id);
  }

  function onCloseHistory() {
    modalizeHistory.current?.close();
  }
  function revokeEmail() {
    setLoader(true);

    console.log('Selected Item ID', selectedItemID);
    BlueButtonService.revokeSentEmail(selectedItemID)
      .then(response => {
        setLoader(false);
        console.log('getShareHistory');
        console.log(JSON.stringify(response));
        if (response.statusCode === 200) {
          setSelectedItemID(0);
          // getModuleHistory('revoke');
          setLoader(true);
          console.log('ho re ha call with ', moduleID, '00');

          BlueButtonService.getModuleShareHistory(moduleID, 1)
            .then(response => {
              setLoader(false);
              console.log('ho re ha call ');
              console.log('getShareHistory');
              console.log(JSON.stringify(response.data.length));
              console.log('afterRevoke', response);
              if (response.data.length > 0) {
                if (response.statusCode) {
                  // var dummyArr = emailHistoryList.concat(response.data);
                 let dummyArr = response.data;
                  //   const groupedData = response.data.reduce((acc, cur) => {
                  //   const createdDate = cur.createdDate.split('T')[0];
                  //   const existingGroup = acc.find(
                  //     group => group.createdDate === createdDate,
                  //   );
                  //   if (existingGroup) {
                  //     existingGroup.objects.push(cur);
                  //   } else {
                  //     acc.push({createdDate, objects: [cur]});
                  //   }
                  //   return acc;
                  // }, []);
                  // console.log('====================================');
                  // console.log('grouped', groupedData);
                  // console.log('====================================');
                  // for(let i=0;i<groupedData.length;i++)
                  // {
                  //   // console.log('Refreshing data at 0 index : ',groupedData[i].objects)
                  //   groupedData[i].objects=groupedData[i].objects.slice(1);
                  // }  
                  let sampleData =[];let currentDateIndex = 0; let data = [];
                  for(let i=0; i<dummyArr.length; i++)
                  {
                    if(dummyArr[currentDateIndex].createdDate.split('T')[0] === dummyArr[i].createdDate.split('T')[0])
                    {
                        data.push(dummyArr[i]);
                        if(dummyArr[i].createdDate.split('T')[0] !== dummyArr[i+1].createdDate.split('T')[0])
                        {
                          sampleData.push({
                            createdDate:dummyArr[currentDateIndex].createdDate.split('T')[0],
                            objects:data
                          });
                          data=[];
                          currentDateIndex=i+1;
                        }
                        if(i+1 === dummyArr.length-1)
                        {
                          data.push(dummyArr[i+1]);
                          sampleData.push({
                            createdDate:dummyArr[currentDateIndex].createdDate.split('T')[0],
                            objects:data
                          });
                          break;
                        }
                    }
                  }
                  setEmailHistoryList(sampleData);
                  setPageNumber(pageNumber + 1);
                  setHistoryList(response.data);
                } else {
                  setEmailHistoryList([]);
                }
              } else {
                setHistoryList([]);
              }
            })
            .catch(error => {
              setLoader(false);

              console.log('getShareHistory Error');
              console.log(error);
              showMessage({
                message: 'Info',
                description: 'Internal Server Error',
                type: 'default',
                icon: {icon: 'info', position: 'left'},
                backgroundColor: Colors.red,
              });
            });
        } else {
          alert(response.Exception[0].Message);
        }
      })
      .catch(error => {
        setLoader(false);

        console.log('getShareHistory Error');
        console.log(error);
      });
  }
  useEffect(() => {
    getModuleHistory('get',0);

    providerHistoryCall();
  }, []);
  return (
    <Fragment>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.BgColor,
          // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}>
        <Spinner
          visible={loader}
          textContent={'Please Wait....'}
          textStyle={{color: '#FFF'}}
        />
        <Modalize
          ref={modalizeHistory}
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
                  onCloseHistory();
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
                  onCloseHistory();
                  revokeEmail();
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
        <View style={{flex: 1}} collapsable={false}>
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
                  //   this.props.navigation.goBack();
                  navigation.pop();
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
                History
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
                    onPress={() => {
                      navigation.navigate('NotificationStack');
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
                  </TouchableOpacity>
                  {/* <TouchableOpacity>
                    <SvgCss
                      xml={Svgs.settings_Icon}
                      width={hp(2.2)}
                      height={hp(2.3)}
                      fill={Colors.black}
                      onPress={() => {
                        // this.props.navigation.pop()
                      }}
                      style={{marginHorizontal: hp(1.5)}}
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
            <View style={{flex: 1, backgroundColor: Colors.BgColor}}>
              {/* <ShareHistory moduleID={8} /> */}
              <Fragment>
                <Modal
                  animationType={'fade'}
                  transparent={true}
                  visible={sessionModal}>
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
                            setSessionModal(false);
                            storeItem(BlueButtonAccessToken, '');
                            storeItem(BlueButtonRefreshToken, '');
                            storeItem(IsAcoUserLogin, 'false');
                            clearTimeout(this.timer);
                            // navigation.navigate('MainDashboard', {
                            //   screenName: 'Profile',
                            // });
                            navigation.navigate('AuthenticationType');
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
                  {emailHistoryList.length ? (
                    <FlatList
                      contentContainerStyle={{marginHorizontal: hp(1)}}
                      data={emailHistoryList.length && emailHistoryList}
                      onEndReached={({distanceFromEnd}) => {
                        console.log('Distance', distanceFromEnd);
                        if (!loader && pageNumber !== 0 && parseInt(distanceFromEnd) >= 0) {
                          getModuleHistory('get',2);
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
                              {isTodayYesterday(
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
                                            {console.log(
                                              '====================================',
                                            )}
                                            {console.log(
                                              'this is the value',
                                              data,
                                            )}
                                            {console.log(
                                              '====================================',
                                            )}
                                            {data?.emailAddress}
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
                                              {/* {Moment(data.createdDate).format(
                                                'LT',
                                              )} */}
                                            </Text>
                                            <View
                                              style={{
                                                // marginTop: hp(0.5),
                                                marginLeft: hp(1),
                                              }}>
                                              <Dot />
                                            </View>
                                            <TouchableOpacity
                                              activeOpacity={
                                                data.isDeleted === true ? 1 : 0
                                              }
                                              onPress={() =>
                                                data.isDeleted === false &&
                                                onOpenHistory(data.id)
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
                         refreshing={refreshingHistory}
                         onRefresh={()=>{
                          setrefreshingHistory(true);
                          getModuleHistory('get',1)
                          // this.setState({refreshingHistory:false})
                        }}
                        />
                      }
                    />
                  ) : (
                    loader === false &&
                    emailHistoryList.length === 0 && (
                      <View
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
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default ProviderHistory;
