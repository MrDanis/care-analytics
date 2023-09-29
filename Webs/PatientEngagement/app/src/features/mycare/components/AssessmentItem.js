import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import React from 'react';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Images from '../../../../config/Images';
import AssessmentIcon from '../../../../../assets/svg/AssesmentIcon.svg';
import EditAssessmentIcon from '../../../../../assets/svg/EditAssessmentIcon';
import moment from 'moment';
import {convertUTCDateToLocalDate} from '../../../helpers/Common';
const AssessmentItem = ({item, navigation, completed,titleDate}) => {
  console.log('=================================');
  console.log('item data coming', item);
  console.log('=================================');
  const fill = item.completionPercentage;
  console.log('Item percentage is : ',item?.completionPercentage,'complete assesment status is : ',completed,' and date is : ',titleDate);
  const convertUTCDateToAMPM = date => {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    );
    const dateTimeAndroid = moment(new Date(date)).format('A');

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);

    const dateTimeIos = moment(new Date(newDate)).format('A');

    return Platform.OS === 'ios' ? dateTimeIos : dateTimeAndroid;
  };

  function getFormattedTimeWithAMPM(date) {
    let createdDate = convertUTCDateToLocalDate(
      new Date(date),
    ).toLocaleString();
    let time = createdDate.split(',');
    console.log('time', time[1]);
    let formattedTime = moment(createdDate).format('hh:mm A');
    console.log('formated time', createdDate);
    return time[1];
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (completed === true) {
          console.log('====================================');
          console.log('data', item);
          console.log('====================================');
          navigation.navigate('AssessmentSummary', {
            data: item,
            progress: 1,
            isCompleted: true,
            dateOfCompletion:titleDate 
          });
        } else {
          navigation.navigate('AssessmentParentQuestions', {
            itemData: item,
            fromPending: true,
            index: item.currentIndex ? item.currentIndex : 0,
            title: item.title,
            
          });
        }
      }}
      style={{
        backgroundColor: Colors.BgColor,
        height: 80,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        marginVertical: Platform.OS === 'ios' ? hp(0.7) : hp(0.7),
      }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: Colors.white,
          borderRadius: hp(1.8),
          padding: hp(1),
          alignItems: 'center',
          justifyContent: 'space-between',
          width: Platform.OS === 'ios' ? '95%' : '90%',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: Platform.OS === 'ios'?5:0,
        }}>
        <View
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <AssessmentIcon />
          </View>
          <View style={{marginLeft: hp(2)}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.headingColor,
                  marginBottom: hp(0.1),
                  maxWidth: Platform.OS === 'android' ? hp(23) : hp(20),
                }}>
                {item.title}
              </Text>
              {/* {item.isEditable ? (
                <View style={{marginHorizontal: hp(0.9)}}>
                  <EditAssessmentIcon />
                </View>
              ) : null} */}
            </View>

            {completed ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.noRecordFound,
                  }}>
                  {item.modifiedDate === null ||
                  moment(new Date(item.modifiedDate)).format('LL') ===
                    '01 January 2020'
                    ? 'N/A'
                    : moment(new Date(item.modifiedDate)).format('MMMM') +
                      ' ' +
                      moment(new Date(item.modifiedDate)).format('MM/DD/yyyy')}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.label,
                }}>
                {item.modifiedDate === null ||
                moment(new Date(item.modifiedDate)).format('LL') ===
                  '01 January 2020'
                  ? 'N/A'
                  : moment(new Date(item.modifiedDate)).format('MMMM') +
                    ' ' +
                    moment(new Date(item.modifiedDate)).format('MM/DD/yyyy')}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <AnimatedCircularProgress
            size={50}
            width={5}
            fill={fill}
            rotation={0}
            style={{marginRight: hp(1)}}
            tintColor={Colors.blueTextColor}
            backgroundColor={Colors.blueGrayDisableBG}>
            {fill => <Text>{fill + '%'}</Text>}
          </AnimatedCircularProgress>
          <Text
            style={{
              fontFamily: 'WisemanPTSymbols',
              fontSize: hp(4),
              color: Colors.noRecordFound,
              alignSelf: 'center',
            }}>
            X
          </Text>
        </View>

        {/* <View
          style={{
            flexDirection: 'column',
            flex: 1,
            marginLeft: hp(1),
            alignSelf: 'center',
            justifyContent: 'space-between',
            width: '65%',
          }}>
          
        </View>

         */}
        {/*</TouchableOpacity>*/}
      </View>
    </TouchableOpacity>
  );
};

export default AssessmentItem;
