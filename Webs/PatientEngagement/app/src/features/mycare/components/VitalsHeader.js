import {View, Text, SafeAreaView, Platform, TouchableOpacity} from 'react-native';
import React, {Children} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import {Colors, Svgs,Images} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import {SvgCss} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
const VitalsHeader = ({children, navigation, headerName}) => {
  return (
    <SafeAreaView style={{backgroundColor: Colors.backgroundMain, flex: 1}}>
      <View
        style={{
          borderColor:'red',
          borderWidth:0,
          flexDirection: 'row',
          alignItems: 'center',
          height: Platform.OS === 'android' ? hp(8) : hp(7),
          backgroundColor: Colors.backgroundMainLogin,
          paddingTop:hp(1.5),
          paddingBottom:hp(1.5),
          
        }}>
        <SvgCss
          xml={Svgs.arrowHeadLeft}
          width={hp(5)}
          height={hp(5)}
          fill={Colors.black}
          onPress={() => navigation.pop()}
          style={{marginHorizontal: hp(1), marginVertical: hp(1)}}
        />
        {
          headerName==='Screenings'?<View
          style={{borderColor:'red',borderWidth:0,flex:1,flexDirection:'row'}}
          >
            <View style={{flex:.55,borderColor:'green',borderWidth:0,alignItems:'flex-end'}}>
                <Text
                style={{
                fontSize: hp(2.2),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.black,
                }}>
                 {headerName}
                </Text>
            </View>
        <View  style={{flex:.45,borderColor:'green',borderWidth:0,alignItems:'flex-end'}}>
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
                }}
                source={Images.notification_dashboard}
              />
            </TouchableOpacity>
        </View>
          </View>:<Text
          style={{
            color: Colors.black,
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(2.6),
            alignSelf:'center'
          }}>
          {headerName}
        </Text>
        }
        {/* <Text
          style={{
            color: Colors.black,
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(2.6),
            alignSelf:'center'
          }}>
          {headerName}
        </Text> */}
      </View>
      {children}
    </SafeAreaView>
  );
};
export default VitalsHeader;
