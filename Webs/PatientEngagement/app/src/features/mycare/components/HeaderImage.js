import {View, Text} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {baseUrl, CURRENT_TARGET, Fonts} from '../../../../config/AppConfig';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import moment from 'moment';
import colors from '../../../../config/Colors';

const HeaderImage = ({userProfileData}) => {
  function getAge(dateString: string) {
    console.log('====================================');
    console.log(
      'date',
      moment(new Date(userProfileData.dateOfBirth)).format('YYYY-MM-DD'),
    );
    console.log('====================================');
    const date = moment(new Date(userProfileData.dateOfBirth)).format(
      'YYYY-MM-DD',
    );
    const years = moment().diff(date, 'years');
    console.log('====================================');
    console.log('years', years);
    console.log('====================================');
    // const days = moment().diff(date.add(years, 'years'), 'days', false);
    // return { years,days }
    return years < 1 ? '' : ', ' + years + 'yrs';
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: hp(1),
        marginVertical: 15,
      }}>
      {userProfileData.imagePath !== null &&
      userProfileData.imagePath !== '' ? (
        <FastImage
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            marginVertical: hp(1),
          }}
          source={{
            uri: baseUrl + '/' + userProfileData.imagePath + '?' + new Date(),
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
          {userProfileData.firstName.toLowerCase() +
            ' ' +
            userProfileData.lastName.toLowerCase()}
        </Text>
        <View style={{flexDirection: 'row'}}>
          {userProfileData.gender !== null && userProfileData.gender !== '' && (
            <>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: colors.noRecordFound,
                }}>
                {userProfileData.gender === '2' ? 'Female' : 'Male'}
              </Text>
            </>
          )}
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2),
              color: colors.noRecordFound,
            }}>
            {getAge(userProfileData.dateOfBirth)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderImage;
