/* istanbul ignore file */
import React, {Component, Fragment, useState, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Switch,
  Image,
  SafeAreaView,
  I18nManager,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MedBlueIcon from '../../../../../assets/svg/illustration_meds_blue_1.svg';
import Colors from '../../../../config/Colors';
import AlertIcon from '../../../../../assets/svg/missedMedIcon.svg';
import MedTakenIcon from '../../../../../assets/svg/takenMedIcon.svg';
import DeleteIcon from '../../../../../assets/svg/icon_delete.svg';
import EditIcon from '../../../../../assets/svg/icon_edit.svg';
import NotificationIcon from '../../../../../assets/svg/icon_notification_off.svg';
import SvgNoImageFoundIcon from '../../../../../assets/svg/noMedImage.svg';
import {Fonts} from '../../../../config/AppConfig';
import Modal from 'react-native-modal';
import {
  Directions,
  Gesture,
  GestureDetector,
  Swipeable,
  PanGestureHandler,
  RectButton,
} from 'react-native-gesture-handler';

import MedicationService from '../../../api/medication';
import {getBetweenTime, getDayTime} from '../../../helpers/Common';
import {getAllMedication, getTodayMedication} from '../actions';
import {DayTime} from '../constants';
import moment from 'moment';
import {cancelLocalNotificationWithTag} from '../../../helpers/NotificationHandler';
import {createOrUpdateReminderForMedication} from '../../../helpers/MedicationReminderHelper';
import Images from '../../../../config/Images';
import {Modalize} from 'react-native-modalize';
import {SwipeListView} from 'react-native-swipe-list-view';

var myProps = null;
const MedicationItem = props => {
  // constructor= (props) => {
  // //  super(props);
  //   myProps = props;
  //    this.state = {
  //     modalVisible: false,
  //     rxModalVisible: false,
  //     morningArray: [],
  //     noonArray: [],
  //     eveningArray: [],
  //     nightArray: [],
  //     isEnabled: true,
  //     image: {uri: props.item.fdaMedicine.imagePath},
  //   };
  // }

  const [image, setimage] = useState({uri: props.item.fdaMedicine.imagePath});

  onError = error => {
    console.log(error);
    this.setState({image: Images.noImageFound});
  };
  /* istanbul ignore next */

  const showFrequencyDays = Days => {
    console.log('====================================');
    console.log(
      'props.item.doseTimings[0]',
      props.item.statusLogs[props.item.doseTimings[0]][0],
    );
    console.log('====================================');
    const Frequency = Days;
    console.log('====================================');
    console.log('Frequency', Frequency);
    console.log('====================================');
    if (Frequency === 1) {
      return 'Daily';
    } else if (Frequency === 7) {
      return 'Weekly';
    } else if (Frequency === 30) {
      return 'Monthly';
    } else {
      return 'Every ' + Frequency + ' Days';
    }
  };

  let doseTime = props.item.doseTimings[0];
  return (
    <Fragment>
      {/* <View> */}
      {/* <Swipeable
          ref={swipeableRef}
          renderRightActions={this.renderRightActions}

          // rightThreshold={0}
        > */}
      <View
        style={{
          borderRadius: 10,
          // height: hp(10),
          width: '95%',
          marginLeft: hp(1),
          marginBottom: hp(2),
          shadowOffset: {width: 0.5, height: 0.5},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          backgroundColor: Colors.white,
          flexDirection: 'row',
          alignItems: 'center',
          padding: hp(2),
        }}>
        {/* {props.item.fdaMedicine.imagePath ? ( */}
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            alignSelf: 'center',
            marginRight: hp(1),
          }}
          source={Images.medIcon4x}
          // onError={this.onError.bind(this)}
        />
        {/* ) : (
          <SvgNoImageFoundIcon height="50" width="50" />
        )} */}
        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: Fonts.SourceSansRegular,
                marginLeft: heightPercentageToDP(2),
                fontSize: hp(2.2),
                flex: 1,
                color: Colors.black4,
                textTransform: 'capitalize',
                maxWidth: '85%',
                height: 'auto',
              }}>
              {props.item.fdaMedicine.proprietaryname}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginLeft: heightPercentageToDP(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2),
                marginRight: hp(0.5),
                color: Colors.noRecordFound,
              }}>
              {showFrequencyDays(props.item.frequencyInDays)}
            </Text>
            <View
              style={{
                height: 8,
                width: 8,
                alignSelf: 'center',
                marginHorizontal: hp(0.5),
                backgroundColor: Colors.textFieldGrey,
                borderRadius: 4,
              }}
            />
            <Text
              style={{
                marginLeft: hp(0.5),
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2),
                color: Colors.noRecordFound,
              }}>
              {props.item.mealStatus === false ? 'Before Meal' : 'After Meal'}
            </Text>
          </View>
        </View>
        {props.item.doseTimings[0] &&
        props.item.statusLogs[doseTime].length === 0 ? (
          <View style={{backgroundColor: Colors.pilered, borderRadius: 20}}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(1.5),
                paddingVertical: hp(0.5),
                paddingHorizontal: hp(0.8),
              }}>
              Not Taken
            </Text>
          </View>
        ) : null}
        {props.item.doseTimings[0] &&
        props.item.statusLogs[doseTime].length > 0 &&
        props.item.statusLogs[doseTime][0].taken === true ? (
          <View
            style={{
              backgroundColor: Colors.badgeGreen,
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(1.5),
                paddingVertical: hp(0.3),
                paddingHorizontal: hp(0.8),
              }}>
              Taken
            </Text>
          </View>
        ) : null}
      </View>
      {/* </Swipeable>
      </View> */}
      {/* </TouchableOpacity> */}
    </Fragment>
  );
};

export default MedicationItem;

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: Colors.black,
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.bleLayer4,
  },
});
