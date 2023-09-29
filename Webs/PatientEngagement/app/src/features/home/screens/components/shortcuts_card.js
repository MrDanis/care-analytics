import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import colors from '../../../../../config/Colors';
import FastImage from 'react-native-fast-image';
import {Fonts} from '../../../../../config/AppConfig';
import {Images} from '../../../../../config';
import {Modalize} from 'react-native-modalize';
import DropDownPicker from 'react-native-dropdown-picker';
import {modalHanlder} from '../../../medication/actions';

const ShortcutCards = ({
  imageSource,
  text,
  id,
  navigation,
  setIsCamera,
  isCamera,
  dispatch,
}) => {
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
  // Function responsible for navigating through shortcuts on android by Danish (Start)
    const handleAndroidPress = ()=>{
      switch (id) {
        case 0:
          // Code Block Navigate to Refill from android
            navigation.navigate('MedicationStack', {
            screen: 'Prescriptions',
          })
          break;
          case 2:
            dispatch(modalHanlder(false));
            console.log('====================================');
            console.log('herer');
            console.log('====================================');
            setIsCamera(!isCamera);
            console.log('Navigate to Take Pic from android');
          break;
          case 3:
            dialCall('911');
            console.log('Navigate to Urgent call from android');
          break;
        default:
          break;
      }
    }
  // Function responsible for navigating through shortcuts on android by Danish (End)
  return Platform.OS === 'ios' ? (
    <>
      <Pressable
        onPress={() => {
          if (id === 0) {
            navigation.navigate('MedicationStack', {
              screen: 'Prescriptions',
            });
          }
          if (id === 2) {
            dispatch(modalHanlder(false));
            console.log('====================================');
            console.log('herer');
            console.log('====================================');
            setIsCamera(!isCamera);
          }
          if (id === 3) {
            dialCall('911');
          }
        }}
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FastImage
          resizeMode="contain"
          style={{
            width: 25,
            height: 35,
          }}
          source={imageSource}
        />
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: 13.5,
            color: colors.black4,
          }}>
          {text}
        </Text>
      </Pressable>
    </>
  ) : (
    <View
      style={
        {
          borderColor:'red',
          borderWidth:0
          // marginLeft: hp(1.7),
          // marginRight: hp(1.7),
          // marginTop: hp(3),
          // borderColor: colors.line,
          // borderRadius: hp(1),
          // // borderTopColor: colors.line,
          // borderWidth: 0.3,
          // elevation: 20,
          // // borderBottomWidth: 1,
          // backgroundColor: colors.white,
        }
      }>
        <Pressable onPress={handleAndroidPress} style={{borderColor:'red',borderWidth:0}}>
        <View
        style={{
          alignItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          // paddingRight: hp(3.5),
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            // height: hp(3.2),
            // backgroundColor: backgroundColor,
            width: hp(4.2),
            borderRadius: 8,
            justifyContent: 'center',
          }}>
          <FastImage
            resizeMode="contain"
            style={{
              width: 25,
              height: 35,
            }}
            source={imageSource}
          />
        </View>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: 13.5,
            color: colors.black4,
          }}>
          {text}
        </Text>
      </View>
        </Pressable>
      
    </View>
  );
};

export default ShortcutCards;

const styles = StyleSheet.create({});
