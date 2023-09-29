import {View, Text, Image, TouchableOpacity, Linking} from 'react-native';
import React, {Fragment} from 'react';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import Images from '../../../../config/Images';

import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import colors from '../../../../config/Colors';
import images from '../../../../config/Images';
import FastImage from 'react-native-fast-image';

const CareCoordinationContactCard = props => {
  function dialCall(number) {
    console.log('CareManager Phone Number', number);
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }
  return (
    <>
      <View
        style={{
          backgroundColor: colors.white,
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <View
          style={{
            width: hp(7),
            height: hp(7),
            backgroundColor: Colors.bleLayer4,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}>
          <Image
            style={{
              width: hp(4.5),
              height: hp(4.5),
              // marginTop: hp(1.5),
              resizeMode: 'contain',
            }}
            source={props.iconimage}
          />
        </View>
        <View style={{flex: 1}}>
          <Text
            numberOfLines={1}
            style={{
              marginLeft: hp(2),
              // marginTop: hp(2),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.black,
              fontSize: hp(2),
            }}>
            {props.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              marginHorizontal: hp(2),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.blueGrayDisableText,
              fontSize: hp(1.7),
            }}>
            {props.roleName.split(/(?=[A-Z])/).join(' ')}
          </Text>
        </View>
        {/* <View style={{flex: 0.15}}>
          <TouchableOpacity onPress={() => dialCall(props.phoneNumber)}>
            <FastImage
              source={Images.call_Icon_Black}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
};

export default CareCoordinationContactCard;
