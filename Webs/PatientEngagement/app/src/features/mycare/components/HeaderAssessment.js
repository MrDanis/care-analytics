import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {Children, Fragment} from 'react';
import {Colors, Svgs, Images} from '../../../../config/';
import {Fonts} from '../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';

import {SvgCss} from 'react-native-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const HeaderAssessment = ({navigation, children}) => {

  console.log('Assesment navigation is : ',navigation)

  return (
    <Fragment>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: Colors.BgColor,
          // paddingTop:hp(2)
          //   width: wp(100),
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: Colors.BgColor,
            marginBottom: hp(1.5),
            marginTop: hp(1.5),

            //   width: wp(100),
          }}>
          {/* header left  */}
          <View
            style={{
              width: wp('25%'),
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.pop();
              }}
              style={{alignSelf: 'center'}}>
              <SvgCss
                xml={Svgs.arrowHeadLeft}
                width={hp(5)}
                height={hp(5)}
                fill={Colors.black}
                style={{marginLeft: hp(2)}}
              />
            </TouchableOpacity>
          </View>
          {/* header title */}
          <View
            style={{
              width: wp('50%'),
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: hp(2.2),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.black,
              }}>
              Screenings
            </Text>
          </View>
          {/* header right = option & notif icons  */}
          <View
            style={{
              width: wp('25%'),
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                console.log('helo');
                navigation.navigate('NotificationStack');
              }}
              style={{marginRight: hp(2)}}>
              <FastImage
                style={{
                  width: 20,
                  height: 25,
                  // marginRight:-20,
                  // marginHorizontal: hp(3),
                  // marginTop:10,
                }}
                source={Images.notification_dashboard}
              />
              {/* <SvgCss
                xml={Svgs.notification_bell}
                width={hp(3.5)}
                height={hp(3.5)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
                style={{marginHorizontal: hp(1)}}
              /> 
              */}
              {/* <View
                style={{
                  position: 'absolute',
                  right: Platform.OS === 'ios' ? '10%' : '36%',
                  backgroundColor: Colors.red3,
                  borderRadius: 10,
                  width: 7,
                  height: 7,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}></View> */}
            </TouchableOpacity>
            {/* <TouchableOpacity style={{}}>
              <SvgCss
                xml={Svgs.settings_Icon}
                width={hp(2.8)}
                height={hp(2.8)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
                style={{
                  marginHorizontal: hp(1),
                  marginRight: hp(2),
                }}
              />
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      {children}
    </Fragment>
  );
};

export default HeaderAssessment;

const styles = StyleSheet.create({});
