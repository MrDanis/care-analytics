import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Colors, Images, Svgs} from '../../../config';
import {baseUrl, Fonts} from '../../../config/AppConfig';
import {SvgCss} from 'react-native-svg';
import {NavigationContainer} from '@react-navigation/native';

const HeaderLeft = ({image, name, width, height, navigation}) => {
  console.log('!global.isPatientTouch', !global.isPatientTouch);
  return (
    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center',borderColor:'red',borderWidth:0}}>
      {name === 'Discover' || name === 'Home' || !global.isPatientTouch ? (
        image !== null && image !== '' ? (
          <TouchableOpacity onPress={() => navigation.navigate('ProfileStack')}>
            <FastImage
              style={{
                width: hp(5), //width,
                height: hp(5), //height,
                marginLeft: hp(2.3),
                borderRadius: 10,
              }}
              source={{
                uri: baseUrl + '/' + image + '?' + new Date(),
                priority: FastImage.priority.high,
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('ProfileStack')}>
            <FastImage
              style={{
                width: width,
                height: height,
                borderRadius: 10,
                // width: hp(5),
                //     height: hp(5),
                //     marginLeft: hp(1),
                borderRadius: 10,
                marginLeft: hp(2),
                marginTop: hp(0.9),
              }}
              resizeMode="contain"
              source={require('../../../../assets/images/user_logo.png')}
            />
          </TouchableOpacity>
        )
      ) : (
        <SvgCss
          xml={Svgs.arrowHeadLeft}
          width={hp(5)}
          height={hp(5)}
          fill={Colors.black}
          onPress={() => navigation.pop()}
          style={{marginHorizontal: hp(1)}}
        />
      )}
    </View>
  );
};

export default HeaderLeft;
