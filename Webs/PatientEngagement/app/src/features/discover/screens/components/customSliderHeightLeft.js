import {
  ScrollView,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';

const {width} = Dimensions.get('screen');
import LineGauge from './src_ruler_gauge/LineGuage';
import {Dimensions} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SvgCss} from 'react-native-svg';
import {Svgs} from '../../../../../config';
import colors from '../../../../../config/Colors';
import LineGaugeHeight from './src_ruler_gauge/LineGuageHeight';
import {color} from 'react-native-reanimated';

const CustomSliderHeightLeft = ({
  sliderValue,
  setSliderValue,
  vitalsSubTypesData,
  isEditable,
}) => {
  console.log('====================================');
  console.log('sliderValue', sliderValue);
  console.log('====================================');
  const customValue = 5;

  console.log('this is the value:');

  return (
    <View>
      {/* ///This is the slider stick sticking out */}
      <View
        style={{
          zIndex: -1,
          marginBottom: width * -0.09,
          marginLeft: width * 0.345,
          //   color:colors.green
        }}>
        <SvgCss
          xml={Svgs.slider_toucbpad}
          width={hp(5)}
          height={hp(4.3)}
          onPress={() => this.props.navigation.pop()}
          style={{marginHorizontal: hp(0.4), transform: [{rotate: '270deg'}]}}
        />
      </View>
      <View
        style={{
          zIndex: 1,
          // marginBottom: width * -2.35,
          marginLeft: sliderValue < 100 ? width * 0.39 : width * 0.37,

          // marginTop: width * -0.5,
          // marginBottom:  hp(-20),
          position: 'absolute',

          marginTop: 7,
          transform: [{rotate: '90deg'}],
        }}>
        <Text
          style={{
            zIndex: -0,
            // marginBottom: width * -2.35,
            // marginLeft: sliderValue < 100 ? width * 0.37 : width * 0.36,
            // marginTop: width * -0.5,
            // marginBottom:  hp(-20),
            // position: 'absolute',
            // marginTop: 1,
            fontSize: 12,
            // transform: [{rotate: '-90deg'}],
            // transform: 'rotate(90deg)',
            color: 'white',
            fontWeight: 'bold',
          }}>
          {sliderValue}
        </Text>
      </View>

      {/* <Text
          style={{
            marginLeft: width * 0.353,
            transform: [{rotate: '-180deg'}],
            marginBottom: width * -0.060,
            fontSize: 10,
            color: 'white',
            fontWeight: 'bold',
          }}>
          {sliderValue}
        </Text> */}
      <View>
        
        <LineGaugeHeight
          rotateText={true}
          min={3}
          max={9}
          value={sliderValue}
          onChange={setSliderValue}
          isEditable={isEditable}
          type={1}
        />
      </View>
    </View>
  );
};

export default CustomSliderHeightLeft;

const styles = StyleSheet.create({
  // ruler: {
  //   width: rulerWidth,
  //   alignItems: 'flex-end',
  //   // justifyContent: 'flex-start',
  //   flexDirection: 'row',
  // },
  // segment: {
  //   width: segmentWidth,
  // },
  // scrollViewContainerStyle: {
  //   justifyContent: 'flex-end',
  // },
  // weightTextStyle: {
  //   fontSize: 42,
  //   fontFamily: 'Menlo',
  // },
  // indicatorWrapper: {
  //   position: 'absolute',
  //   left: (width - IndicatorWidth) / 2,
  //   bottom: 0,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   // backgroundColor: 'red',
  //   width: IndicatorWidth,
  // },
  // segmentIndicator: {
  //   height: IndicatorWidth,
  //   backgroundColor: 'turquoise',
  // },
  // spacer: {
  //   width: spacerWidth,
  //   backgroundColor: 'red',
  // },
});
