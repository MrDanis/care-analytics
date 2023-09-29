//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SvgCss} from 'react-native-svg';
import {Colors, Images, Svgs} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';

// create a component
const MainHeader = ({navigation, children, name}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop:name.includes('Screenings')?hp(3):hp(1),
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
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: Colors.BgColor,
    bordercolor:'red',
    borderWidth:0,
  },
});

//make this component available to the app
export default MainHeader;
