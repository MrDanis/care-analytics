import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  BackHandler,
  Alert,
  Image,
  FlatList,
  StyleSheet,
  Platform,
  DevSettings,
  Pressable,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import FastImage from 'react-native-fast-image';
import Colors from '../../../config/Colors';
import NotificationItem from './component/NotificationItem';
import NotificationService from '../../api/notification/index';
import PatientProfile from '../../api/profile/index';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import Images from '../../../config/Images';
import {Fonts} from '../../../config/AppConfig';
import Collapsible from 'react-native-collapsible';
import ConnectPhysician from '../../../../assets/svg/connectphysician.svg';
import {Modalize} from 'react-native-modalize';
import Moment from 'moment';
import {useSelector} from 'react-redux';
import {StackActions, NavigationActions} from '@react-navigation/native';
import RNRestart from 'react-native-restart';
import moment from 'moment';
import {color} from 'react-native-reanimated';
import {StatusBar} from 'react-native';

const Notification = props => {
  const userProfileData = useSelector(state => state.userProfileData);
  // const dispatch = useDispatch();
  const [notificationList, setNotificationList] = useState([]);
  const [dummyNotificationList, setDummyNotificationList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [enablePhysicianView, setEnablePhysicianView] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [careManagerData, setCareManagerData] = useState({});
  const [listData, setListData] = useState([]);
  //set this on join api and remove connectwithPhysician view from main screen
  const [connectedWithPhysician, setConnectedWithPhysician] = useState(false);
  const [physicianInviteFound, setPhysicianInvite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modalizeRef = useRef();
  const [pageNum, setPageNumber] = useState(0);
  const forceUpdate = useCallback(() => setPageNumber({}), []);

  useEffect(() => {
    let willFocusSubscription = props.navigation.addListener(
      'willFocus',
      () => {
        console.log('WIllFocus Called');
        setPageNumber(0);
        forceUpdate();
        setNotificationList([]);
        setDummyNotificationList([]);
        setCareManagerData({});
        setPhysicianInvite(false);
        setConnectedWithPhysician(false);
        getNotificationCall(0);

        return;
      },
    );
    setPageNumber(0);
    forceUpdate();
    setNotificationList([]);
    setDummyNotificationList([]);
    setCareManagerData({});
    setPhysicianInvite(false);
    setConnectedWithPhysician(false);
    getNotificationCall(0);
    // return () => {
    //   willFocusSubscription.remove();
    // };
  }, []);

  const getNotificationCall = clearCallPageNumber => {
    setLoader(true);
    NotificationService.getUserNotification(
      clearCallPageNumber === '' ? pageNum : clearCallPageNumber,
    )
      .then(response => {
        setLoader(false);
        console.log('getUserNotification');
        console.log(
          'PageNumber',
          pageNum,
          'clearCallPageNumber',
          clearCallPageNumber,
        );
        console.log(response);
        if (response && response.statusCode === 200) {
          setCareManagerData({});
          setPhysicianInvite(false);
          setConnectedWithPhysician(false);
          setDataWRTDate(response.data);
          setPageNumber(pageNum + 1);
          NotificationService.readUserNotification()
            .then(response => {
              console.log('readUserNotification');
              console.log(response);
              if (response && response.data === true) {
                console.log('Successfully read all notifications');
              }
            })
            .catch(error => {
              setLoader(false);
              console.log('error in readUserNotification');
            });
        }
      })
      .catch(error => {
        setLoader(false);
        console.log('error');
        console.log(error);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };
  const joinPhysicianServiceCall = () => {
    setLoader(true);
    console.log('Care Manger NotificationID', careManagerData.id);
    NotificationService.joinPhysicianInvite(careManagerData.id)
      .then(response => {
        setLoader(false);
        console.log('joinPhysicianServiceCall');
        console.log(response);
        if (response && response.statusCode === 200) {
          setConnectedWithPhysician(true);
          setCareManagerData({});
          setPhysicianInvite(false);
          onOpen();
        }
      })
      .catch(error => {
        setLoader(false);
        setConnectedWithPhysician(false);
        console.log('error');
        console.log(error);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };

  const refreshNotificationListAfterClearCall = type => {
    console.log('AFter clear type', type);
    if (type === 'Clear') {
      setPageNumber(0);
      forceUpdate();
      setNotificationList([]);
      setDummyNotificationList([]);
      getNotificationCall(0);
    } else {
      getNotificationCall('');
    }
  };
  const clearNotificationServiceCall = notificationID => {
    console.log('Clear call method in parent', notificationID);
    setLoader(true);
    NotificationService.clearUserNotification(notificationID)
      .then(response => {
        console.log('clearUserNotification');
        console.log(response);
        setLoader(false);
        if (response && response.statusCode === 200) {
          setCareManagerData({});
          setPhysicianInvite(false);
          setConnectedWithPhysician(false);
          refreshNotificationListAfterClearCall('Clear');
        }
      })
      .catch(error => {
        setLoader(true);
        console.log('error');
        console.log(error);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };

  const onRefresh = () => {
    //set isRefreshing to true
    console.log('PageNumber On refresh', pageNum);
    getNotificationCall(0);
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  const onOpen = () => {
    modalizeRef.current?.open();
    setConnectedWithPhysician(false);
    setPhysicianInvite(false);
  };
  const onClose = () => {
    // props.navigation.dispatch(StackActions.reset(StackActions.popToTop()))
    props.navigation.navigate('HomeTab', {profileDetails: userProfileData});
    // props.navigation.navigate('Home', {profileDetails : userProfileData})
    modalizeRef.current?.close();
    // getNotificationCall(0);
  };
  const toggleExpanded = () => {
    setCollapsed(!collapsed);
  };

  const setDataWRTDate = data => {
    let dateArr = [];
    if (data.length > 0) {
      data.map(objAtIndex => {
        if (objAtIndex.moduleSubType === 8) {
          setCareManagerData(objAtIndex);
          setPhysicianInvite(true);
        } else {
          let notificationDate = objAtIndex.createdDate.split('T')[0];
          if (dateArr.indexOf(notificationDate) === -1) {
            dateArr.push(notificationDate);
          }
        }
      });
      console.log('Distinct Date Array', dateArr);
      let notificationData = [];
      dateArr.map(dateAtIndex => {
        let objData = [];
        data.map(objAtIndex => {
          if (
            dateAtIndex === objAtIndex.createdDate.split('T')[0] &&
            objAtIndex.moduleSubType !== 8
          ) {
            objData.push(objAtIndex);
          }
        });
        notificationData.push({
          key: dateAtIndex,
          value: objData,
        });
      });
      const dummyList = dummyNotificationList.concat(notificationData);
      console.log('Final Notification Data', notificationData.length);
      console.log('careManagerData', careManagerData);
      console.log('dummyNotificationList Data', dummyList);
      setNotificationList(notificationData);
      setDummyNotificationList(dummyList);
      setListData(notificationData);
    }
  };
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '80%',
          backgroundColor: Colors.lightGrey,
          alignSelf: 'flex-end',
        }}
      />
    );
  };

  const renderItem = data => (
    <TouchableOpacity
      onPress={() => console.log('You touched me')}
      style={styles.rowFront}
      underlayColor={'#AAA'}>
      <View>
        <Text>I am in a SwipeListView</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <Text>Left</Text>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        // onPress={() => closeRow(rowMap, data.item.key)}
      >
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        // onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  const convertUTCDateToLocalDate = date => {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    );
    const dateTimeAndroid = Moment(new Date(date)).format('hh:mm A');

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);

    const dateTimeIos = Moment(new Date(newDate)).format('hh:mm A');

    return Platform.OS === 'ios' ? dateTimeIos : dateTimeAndroid;
  };
  const isTodayYesterday = date => {
    let today = moment().format('YYYY-MM-DD');
    let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const formattedDate = moment().utc(date).format('YYYY-MM-DD');
    if (moment(formattedDate).isSame(today, 'day')) {
      return 'Today';
    } else if (moment(formattedDate).isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return moment(new Date(formattedDate))
        .format('MMM D, YYYY')
        .toUpperCase();
    }
  };
  // const renderSectionHeader = ({ section }) => <Text>{section.key}</Text>;
  return (
    <SafeAreaView
      style={{flex: 1, height: '100%', backgroundColor: Colors.BgColor}}>
      <StatusBar backgroundColor={Colors.BgColor} />
      {/* commented by Danish on Hanan request at 18 July 2023 */}
      {/* <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        modalStyle={{
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
        }}
        HeaderComponent={
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <ImageBackground
              source={require('../../../../assets/images/dashboard_background_module.png')}
              style={{width: '100%', alignItems: 'center'}}>
              <ConnectPhysician
                height="100"
                width="100"
                style={{margin: hp(2)}}
              />
            </ImageBackground>

            <Text
              style={{
                fontSize: hp(2.6),
                fontFamily: Fonts.SourceSansSemibold,
                width: '100%',
                textAlignVertical: 'center',
                textAlign: 'center',
                borderRadius: 10,
                margin: hp(1),
                color: Colors.black,
              }}>
              Congratulations
            </Text>
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: Fonts.SourceSansRegular,
                width: '80%',
                textAlignVertical: 'center',
                textAlign: 'center',
                borderRadius: 10,
              }}>
              You have successfully connected to your Care manager.
            </Text>
            <TouchableOpacity
              onPress={() => {
                onClose();
                RNRestart.Restart();
              }}
              style={{
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                backgroundColor: Colors.blueTextColor,
                width: '90%',
                marginVertical: hp(2),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.white,
                  fontSize: hp(2.2),
                }}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        }
      /> */}
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />

      <View
        style={{
          // flex: 1,
          // backgroundColor: Colors.white,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: hp(2),
          borderTopLeftRadius: hp(2.5),
          borderTopRightRadius: hp(2.5),
          shadowOffset: {width: 0.5, height: 0.5},
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation:Platform.OS === 'ios'?5:0,
        }}>
        <Pressable
          onPress={() => {
            clearNotificationServiceCall(0);
          }}
          style={{
            alignSelf: 'flex-end',
            marginRight: hp(2.5),
            marginTop: hp(2),
            marginBottom: hp(-3),
            zIndex: 4,
          }}>
          <Text
            style={{
              color: Colors.blueTextColor,
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2),
            }}>
            Clear All
          </Text>
        </Pressable>
        {/*<SwipeListView*/}
        {/*    useFlatList={true}*/}
        {/*    data={listData}*/}
        {/*    // useSectionList*/}
        {/*    // sections={listData}*/}
        {/*    renderItem={*/}
        {/*        ({item}) => {*/}
        {/*                console.log('====================================');*/}
        {/*                console.log('item', item);*/}
        {/*                console.log('====================================');*/}
        {/*                return (*/}
        {/*                    <NotificationItem*/}
        {/*                        item={item}*/}
        {/*                        navigation={props.navigation}*/}
        {/*                    />*/}
        {/*                );*/}
        {/*    }*/}
        {/*    }*/}
        {/*    renderHiddenItem={renderHiddenItem}*/}
        {/*    // renderSectionHeader={renderSectionHeader}*/}
        {/*    leftOpenValue={75}*/}
        {/*    rightOpenValue={-150}*/}
        {/*    previewRowKey={'0'}*/}
        {/*    previewOpenValue={-40}*/}
        {/*    previewOpenDelay={3000}*/}
        {/*    ItemSeparatorComponent={renderSeparator}*/}
        {/*    onRefresh={onRefresh}*/}
        {/*    refreshing={isRefreshing}*/}
        {/*    onEndReached={({distanceFromEnd}) => {*/}
        {/*        console.log('Distance', distanceFromEnd);*/}
        {/*        if (*/}
        {/*            !loader &&*/}
        {/*            pageNum !== 0 &&*/}
        {/*            parseInt(distanceFromEnd) >= 0*/}
        {/*        ) {*/}
        {/*            getNotificationCall()*/}
        {/*        }*/}
        {/*    }}*/}
        {/*    onRowDidOpen={()=>console.log('This row opened')}*/}
        {/*/>*/}
        <FlatList
          // useSectionList
          //  sections={listData}
          nestedScrollEnabled={true}
          data={notificationList}
          contentContainerStyle={{
            flexGrow: Platform.OS === 'android' ? 1 : null,
          }}
          style={{
            flexGrow: 1,
            width: '100%',
            backgroundColor: Colors.BgColor,
            height: '100%',
          }}
          // ItemSeparatorComponent={renderSeparator}
          onRefresh={() => {
            setPageNumber(0);
            forceUpdate();
            setNotificationList([]);
            setDummyNotificationList([]);
            onRefresh();
          }}
          refreshing={isRefreshing}
          // onEndReached={({distanceFromEnd}) => {
          //   console.log('Distance', distanceFromEnd);
          //   if (!loader && pageNum !== 0 && parseInt(distanceFromEnd) >= 0) {
          //     getNotificationCall('');
          //   }
          // }}
          // ListHeaderComponent={() =>
          //   physicianInviteFound === true && (
          //     <View
          //       style={{
          //         width: '95%',
          //         alignItems: 'center',
          //         shadowOffset: {width: 0.5, height: 0.5},
          //         shadowOpacity: 0.01,
          //         shadowRadius: 2,
          //         elevation: 10,
          //         borderRadius: 10,
          //         marginVertical: hp(3),
          //         alignSelf: 'center',
          //         backgroundColor: Colors.white,
          //         shadowOffset: {width: 0.5, height: 0.5},
          //         shadowOpacity: 0.1,
          //         shadowRadius: 10,
          //       }}>
          //       <TouchableOpacity
          //         activeOpacity={1.0}
          //         style={{
          //           borderTopLeftRadius: 10,
          //           borderTopRightRadius: 10,
          //           borderBottomLeftRadius: collapsed === false ? 0 : 10,
          //           borderBottomRightRadius: collapsed === false ? 0 : 10,
          //           width: '97.4%',
          //           backgroundColor: Colors.white,
          //           // height: 60,
          //           marginTop: hp(1),
          //         }}
          //         onPress={() => toggleExpanded()}>
          //         <View
          //           style={{
          //             backgroundColor: Colors.white,
          //             borderRadius: 10,
          //             flexDirection: 'row',
          //             alignItems: 'center',
          //             justifyContent: 'space-around',
          //             flex: 1,
          //           }}>
          //           <View
          //             style={{
          //               flexDirection: 'row',
          //               alignItems: 'center',
          //               justifyContent: 'flex-start',
          //               // height: '100%',
          //               width: '85%',
          //             }}>
          //             {/* {collapsed && (
          //               <ConnectPhysician
          //                 height="35"
          //                 width="30"
          //                 style={{marginHorizontal: hp(1)}}
          //               />
          //             )} */}
          //             <Text style={{color: Colors.black}}>
          //               {isTodayYesterday(careManagerData.createdDate)}
          //             </Text>
          //           </View>

          //           {collapsed ? (
          //             <Text
          //               style={{
          //                 fontFamily: 'WisemanPTSymbols',
          //                 fontSize: hp(4),
          //                 color: Colors.black1,
          //               }}>
          //               Y
          //             </Text>
          //           ) : (
          //             <Text
          //               style={{
          //                 fontFamily: 'WisemanPTSymbols',
          //                 fontSize: hp(4),
          //                 color: Colors.black1,
          //               }}>
          //               Z
          //             </Text>
          //           )}
          //         </View>
          //         <View>
          //           <Text
          //             style={{
          //               textAlign: 'left',
          //               fontSize: hp(3.6),
          //               fontFamily: Fonts.SourceSansSemibold,
          //               width: '70%',
          //               marginLeft: hp(0.9),
          //               color: Colors.black,
          //             }}>
          //             Connect with Care Manager
          //           </Text>
          //         </View>
          //       </TouchableOpacity>

          //       <Collapsible
          //         collapsed={collapsed}
          //         align="center"
          //         style={{
          //           backgroundColor: 'white',
          //           width: '95%',
          //           borderRadius: 10,
          //         }}>
          //         <View
          //           style={{
          //             alignItems: 'flex-start',
          //             backgroundColor: Colors.white,
          //             alignSelf: 'center',
          //             width: '100%',
          //             flex: 1,
          //             borderTopLeftRadius: collapsed === false ? 0 : 10,
          //             borderTopRightRadius: collapsed === false ? 0 : 10,
          //             borderBottomLeftRadius: 10,
          //             borderBottomRightRadius: 10,
          //           }}>
          //           <View
          //             style={{
          //               flexDirection: 'row',
          //               alignItems: 'center',
          //               width: '100%',
          //               paddingVertical: hp(2),
          //             }}>
          //             {!collapsed && (
          //               <ConnectPhysician
          //                 height="80"
          //                 width="80"
          //                 style={{marginHorizontal: hp(2)}}
          //               />
          //             )}
          //             <View style={{flex: 1}}>
          //               {/* <Text
          //                 style={{
          //                   fontFamily: Fonts.SourceSansRegular,
          //                   fontSize: hp(1.8),
          //                   color: Colors.noRecordFound,
          //                   textAlign: 'left',
          //                 }}>
          //                 {Moment(new Date(careManagerData.createdDate)).format(
          //                   'MM/DD/yyy',
          //                 ) +
          //                   ' - ' +
          //                   convertUTCDateToLocalDate(
          //                     new Date(careManagerData.createdDate),
          //                   )}
          //               </Text> */}
          //               <Text
          //                 style={{
          //                   fontFamily: Fonts.SourceSansRegular,
          //                   fontSize: hp(2),
          //                   color: Colors.headingColor,
          //                   textAlign: 'left',
          //                   marginRight: hp(2),
          //                 }}>
          //                 Your Care manager has invited you to connect with his
          //                 management system. Do you want to join it?
          //               </Text>
          //             </View>
          //           </View>
          //         </View>
          //       </Collapsible>
          //       <View
          //         style={{
          //           flexDirection: 'row',
          //           marginBottom: hp(3),
          //           marginTop: hp(4.5),
          //           justifyContent: 'flex-start',
          //           backgroundColor: Colors.white,
          //           width: '99%',
          //           alignItems: 'center',
          //           borderRadius: 10,
          //           marginHorizontal: hp(0.9),
          //         }}>
          //         <TouchableOpacity
          //           onPress={() =>
          //             clearNotificationServiceCall(careManagerData.id)
          //           }
          //           style={{
          //             height: 35,
          //             alignItems: 'center',
          //             justifyContent: 'center',
          //             borderRadius: 5,
          //             width: '25%',
          //           }}>
          //           <Text
          //             style={{
          //               fontFamily: Fonts.SourceSansSemibold,
          //               color: Colors.blueTextColor,
          //               fontSize: hp(2.2),
          //             }}>
          //             Dismiss
          //           </Text>
          //         </TouchableOpacity>
          //         <TouchableOpacity
          //           onPress={() => joinPhysicianServiceCall()}
          //           style={{
          //             height: 35,
          //             alignItems: 'center',
          //             justifyContent: 'center',
          //             borderRadius: 5,
          //             backgroundColor: Colors.regularLabel,
          //             width: '25%',
          //             marginLeft: hp(0.5),
          //           }}>
          //           <Text
          //             style={{
          //               fontFamily: Fonts.SourceSansSemibold,
          //               color: Colors.white,
          //               fontSize: hp(2.2),
          //             }}>
          //             Join
          //           </Text>
          //         </TouchableOpacity>
          //       </View>
          //     </View>
          //   )
          // }
          renderItem={({item}) => {
            console.log('====================================');
            console.log('item', item);
            console.log('====================================');
            return (
              <NotificationItem
                item={item}
                navigation={props.navigation}
                reloadNotification={() =>
                  refreshNotificationListAfterClearCall('Clear')
                }
              />
            );
          }}
          // renderHiddenItem={renderHiddenItem}
          // leftOpenValue={75}
          // rightOpenValue={-150}
          // previewOpenValue={-40}
          // previewOpenDelay={3000}
          ListFooterComponent={() =>
            loader === false &&
            notificationList.length === 0 &&
            Object.entries(careManagerData).length === 0 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: '100%',
                  flex: 1,
                  alignItems: 'center',
                  marginTop: 200,
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
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.regularLabel,
                    marginTop: hp(4),
                    marginRight: hp(10),
                    marginLeft: hp(10),
                    textAlign: 'center',
                  }}>
                  No Record Found
                </Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
    flex: 1,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});

export default Notification;
//  <Pressable>
//    <Text
//      style={{
//        color: Colors.blueTextColor,
//        fontFamily: Fonts.SourceSansRegular,
//        fontSize: hp(2),
//      }}>
//      Clear All
//    </Text>
//  </Pressable>;
