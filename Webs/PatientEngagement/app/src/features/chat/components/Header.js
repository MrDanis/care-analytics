//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SvgCss} from 'react-native-svg';
import {Colors, Svgs} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import Icon_video from '../../../../../assets/svg/icon_video.svg';
import Icon_audio from '../../../../../assets/svg/icon_audio.svg';
import {connect} from 'react-redux';

// create a component
const Header = props => {
  const [cmStatus, setcmStatus] = useState(0);
  useEffect(() => {
    setcmStatus(props.cmStatusData);
    console.log('====================================');
    console.log('cmStatusData,', props);
    console.log('====================================');
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerLeft}>
          <SvgCss
            xml={Svgs.arrowHeadLeft}
            width={hp(5)}
            height={hp(5)}
            fill={Colors.black}
            onPress={() => props.navigation.pop()}
            style={{marginHorizontal: hp(1)}}
          />
          {/* <Image
            source={require('../../../../../assets/images/user_logo.png')}
            style={{width: 40, height: 40}}
          /> */}
          <View style={{marginHorizontal: hp(1)}}>
            <Text
              style={{
                color: Colors.black4,
                fontSize: hp(2),
                fontFamily: Fonts.SourceSansSemibold,
              }}>
              {props.careData?.data.name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: Colors.blueTextColor,
                  borderRadius: 6 / 2,
                  marginRight: hp(0.5),
                }}
              />
              <Text
                style={{
                  color: Colors.noRecordFound,
                  fontSize: hp(1.5),
                  fontFamily: Fonts.SourceSansSemibold,
                }}>
                {cmStatus === 0 ? 'Offline' : 'Online'}
              </Text>
            </View>
          </View>
          {/* <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                backgroundColor: Colors.bleLayer4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon_video />
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('IncomingCallScreen')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40 / 2,
                backgroundColor: Colors.bleLayer4,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: hp(1),
              }}>
              <Icon_audio />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
      {props.children}
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BgColor,
    height: Platform.OS === 'ios' ? hp(10) : hp(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.transparent,
    justifyContent: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? hp(6) : 0,
  },
});

const mapStateToProps = ({cmStatusData}) => ({
  cmStatusData,
});
//make this component available to the app
export default connect(mapStateToProps)(Header);
