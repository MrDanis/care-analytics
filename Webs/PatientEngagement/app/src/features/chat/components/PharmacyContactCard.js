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
import FastImage from 'react-native-fast-image';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
const PharmacyContactCard = props => {
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
  const openLocationOnMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };
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
            source={
              props.type === 'ph' ? Images.Icon_Medication_gray : Images.labIcon
            }
          />
        </View>
        <View style={{flex: 1}}>
          <Text
            numberOfLines={1}
            style={{
              marginLeft: hp(2),
              // marginTop: hp(2),
              fontFamily: Fonts.SourceSansSemibold,
              color: Colors.black,
              fontSize: hp(2),
            }}>
            {props?.type === 'ph'
              ? props.item?.pharmacyName
              : props.item?.labName}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: hp(1.7),
                height: hp(1.7),

                marginLeft: hp(2),

                resizeMode: 'contain',
              }}
              source={Images.clockSm}
            />
            <Text
              numberOfLines={1}
              style={{
                // marginHorizontal: hp(2),
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.noRecordFound,
                fontSize: hp(1.7),
                marginLeft: hp(0.5),
              }}>
              {props?.type === 'ph'
                ? props.item?.pharmacyTiming
                : props.item?.labTiming}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.3,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => dialCall(props.item?.phoneNo)}>
            <FastImage
              source={Images.call_Icon_Black}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openLocationOnMap(props.item?.latitude, props.item?.longitude)
            }>
            <FastImage
              source={Images.locationCon}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default PharmacyContactCard;
