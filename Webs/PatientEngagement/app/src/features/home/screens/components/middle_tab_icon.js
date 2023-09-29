import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';
import {Colors, Images} from '../../../../../config';
import colors from '../../../../../config/Colors';

const MiddleTabIcon = ({imageSource, text}) => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.parentContainer}>
        <FastImage
          resizeMode="contain"
          style={styles.imageStyle}
          source={imageSource}
        />
      </View>
      <Text style={styles.textStyle}>{text}</Text>
    </View>
  );
};

export default MiddleTabIcon;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 27,
    paddingRight: 27,
  },
  parentContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(6.2),
    width: hp(8.2),
  },
  imageStyle: {
    width: hp(4),
    height: hp(4),
  },
  textStyle: {
    color: Colors.noRecordFound,
    alignItems: 'center',
    alignContent: 'center',
    fontFamily: Fonts.SourceSansRegular,
    fontSize: hp(1.7),
  },
});
