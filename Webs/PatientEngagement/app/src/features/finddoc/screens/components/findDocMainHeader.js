import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import { Colors, Images, Svgs } from '../../../../../config';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SvgCss} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import { Fonts } from '../../../../../config/AppConfig';
const findDocMainHeader = ({navigation,children,name}) => {
  return (
    <View style={{ justifyContent: 'center',
    flex: 1,
    backgroundColor:name==='Doctor'?'transparent':Colors.BgColor,
    bordercolor:'red',
    borderWidth:0
    }}>
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop:hp(3)//name.includes('Screenings')?hp(3):hp(1),
      }}>
      <View style={{flex: 0.25, paddingLeft: hp(1)}}>
        <SvgCss
          xml={Svgs.arrowHeadLeft}
          width={hp(4)}
          height={hp(4)}
          fill={Colors.black}
          onPress={() => {
            console.log('Pressed onTap From' + name);
            navigation.pop();
          }}
        />
      </View>
      <View style={{flex: 0.6, alignItems: 'center'}}>
        <Text
          style={{
            color: Colors.black,
            fontSize: hp(2.5),
            fontFamily: Fonts.SourceSansSemibold,
          }}>
          {name}
        </Text>
      </View>
      <View style={{flex: 0.25, alignItems: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationStack')}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginRight: hp(2),
            }}>
            <FastImage
              style={{
                width: hp(2),
                height: hp(2.5),
                // marginRight:-20,
                // marginHorizontal: hp(3),
                // marginTop:10,
              }}
              source={Images.notification_dashboard}
            />
            {/* <TouchableOpacity>
              <SvgCss
                xml={Svgs.settings_Icon}
                width={hp(2.2)}
                height={hp(2.3)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
                style={{marginHorizontal: hp(1.5)}}
              />
            </TouchableOpacity> */}
          </View>
        </TouchableOpacity>
      </View>
    </View>
    {children}
  </View>
  )
}
// Defining styles for the component
const styles = StyleSheet.create({
  container: {
   
  },
});
export default findDocMainHeader
