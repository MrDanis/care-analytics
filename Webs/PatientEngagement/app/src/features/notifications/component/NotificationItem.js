import {Platform, Text, View, Animated} from 'react-native';
import {Fonts} from '../../../../config/AppConfig';
import {Colors} from '../../../../config';
import React, {useEffect, useState, useRef} from 'react';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Moment from 'moment';
import ProfileIcon from '../../../../../assets/svg/notificationIcons/notificationProfile.svg';
import MedicationIcon from '../../../../../assets/svg/notificationIcons/notificationMedication.svg';
import ProfileIconNew from '../../../../../assets/svg/notificationIcons/newNotificationProfile.svg';
import MedicationIconNew from '../../../../../assets/svg/notificationIcons/newNotificationMedication.svg';
import {MedicationIndicator} from '../../medication/components/MedicationIndicator';
import {
  Directions,
  Gesture,
  GestureDetector,
  Swipeable,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import moment from 'moment';
import PatientProfile from '../../../api/profile';
import {showMessage} from 'react-native-flash-message';
import NotificationService from '../../../api/notification';

const NotificationItem = props => {
  const swipeableRef = useRef(null);
  const LeftSwipeActions = () => {
    return (
      <View
        style={{flex: 1, backgroundColor: '#ccffbd', justifyContent: 'center'}}>
        <Text
          style={{
            color: '#40394a',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingVertical: 20,
          }}>
          Bookmark
        </Text>
      </View>
    );
  };
  const rightSwipeActions = itemID => {
    return (
      <View
        style={{
          backgroundColor: Colors.backgroundMain,
          justifyContent: 'center',
          alignItems: 'flex-end',
          flex: 1,
        }}>
        <Text
          style={{
            color: '#1b1a17',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingVertical: 20,
          }}>
          Clear
        </Text>
      </View>
    );
  };
  const isTodayYesterday = date => {
    console.log('this is the date thats being recieved in is today', date);
    let today = moment().format('YYYY-MM-DD');
    console.log('this is todays result', today);
    let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    console.log('this is yesterday result', yesterday);

    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log('this is formated result', formattedDate);

    if (moment(formattedDate).isSame(today, 'day')) {
      return 'Today';
    } else if (moment(formattedDate).isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return moment(new Date(formattedDate)).format('M/D/YYYY').toUpperCase();
    }
  };
  const swipeFromLeftOpen = () => {
    alert('Swipe from left');
  };
  const swipeFromRightOpen = data => {
    closeSwipeable();
    clearNotificationServiceCall(data.id);
  };
  const closeSwipeable = () => {
    swipeableRef.current.close();
  };
  const getModuleName = modulesubTypeID => {
    var name = '';
    if (
      modulesubTypeID === 1 ||
      modulesubTypeID === 2 ||
      modulesubTypeID === 3 ||
      modulesubTypeID === 5 ||
      modulesubTypeID === 6
    ) {
      name = 'Medication';
    } else if (modulesubTypeID === 4 || modulesubTypeID === 7) {
      name = 'Profile';
    }
    return name;
  };

  const getModuleIcon = modulesubTypeID => {
    if (
      modulesubTypeID === 1 ||
      modulesubTypeID === 2 ||
      modulesubTypeID === 3 ||
      modulesubTypeID === 5 ||
      modulesubTypeID === 6
    ) {
      return <MedicationIcon />;
    } else if (modulesubTypeID === 4 || modulesubTypeID === 7) {
      return <MedicationIcon />;
    }
  };

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

  const clearNotificationServiceCall = notificationID => {
    console.log('Clear call method in parent', notificationID);
    NotificationService.clearUserNotification(notificationID)
      .then(response => {
        console.log('clearUserNotification');
        console.log(response);
        if (response && response.statusCode === 200) {
          props.reloadNotification('Clear');
        }
      })
      .catch(error => {
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
  return (
    <View
      style={{
        // display: 'flex',
        // flexDirection: 'column',
        // flexGrow: 1,
        // marginBottom: hp(3),
        // height: '100%',
        backgroundColor: Colors.white,
      }}>
      <Text
        style={{
          fontFamily: Fonts.SourceSansSemibold,
          color: Colors.black4,
          marginLeft: hp(2),
          marginBottom: hp(2),
          marginTop: hp(2),
          fontSize: hp(2),
        }}>
        {isTodayYesterday(
          Moment(new Date(props.item.key)).format('YYYY-MM-DD'),
        )}
      </Text>
      {props.item.value && props.item.value.length
        ? props.item.value.map((data, index) => {
            console.log('item.Valueeee', props.item.value);
            return (
              <Swipeable
                ref={swipeableRef}
                renderRightActions={() => rightSwipeActions(data)}
                onSwipeableRightOpen={() => swipeFromRightOpen(data)}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: hp(1),
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      borderRadius: hp(1),
                      backgroundColor: Colors.bleLayer4,
                      marginHorizontal: hp(2),
                      paddingVertical: hp(1.5),
                      width: Platform.OS === 'ios' ? hp(6.5) : hp(7),
                      height: Platform.OS === 'android' ? hp(7) : hp(6.5),
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {data.moduleSubType === 1 ||
                    data.moduleSubType === 2 ||
                    data.moduleSubType === 3 ||
                    data.moduleSubType === 5 ||
                    data.moduleSubType === 6 ? (
                      <MedicationIconNew
                        height="30"
                        width="30"
                        style={{marginHorizontal: hp(2)}}
                      />
                    ) : (
                      <ProfileIconNew
                        height="25"
                        width="25"
                        style={{marginHorizontal: hp(2)}}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '75%',
                      alignItems: 'flex-start',
                      justifyContent: 'space-around',
                      marginVertical: hp(1.5),
                    }}>
                    <Text
                      style={{
                        fontSize: hp(2),
                        fontFamily: Fonts.SourceSansSemibold,
                        color: Colors.black4,
                        marginTop: hp(0.3),
                      }}>
                      {data.description}
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
                          marginTop: Platform.OS === 'ios' ? hp(0.5) : hp(0),
                        }}>
                        {convertUTCDateToLocalDate(new Date(data.createdDate))}
                      </Text>
                      {/* <View
                        style={{
                          height: 4,
                          width: 4,
                          alignSelf: 'center',
                          marginHorizontal: hp(0.7),
                          backgroundColor: Colors.border,
                          borderRadius: 2,
                        }}
                      /> */}
                      {/* <Text
                        style={{
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.noRecordFound,
                        }}>
                        {getModuleName(data.moduleSubType)}
                      </Text> */}
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
                      width: Platform.OS === 'ios' ? '78%' : '77%',
                    }}
                  />
                </View>
              </Swipeable>
            );
          })
        : null}
    </View>
  );
};

export default NotificationItem;
