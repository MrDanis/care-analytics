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

const CustomSliderBPDiastolic = ({
  sliderValue,
  setSliderValue,
  vitalsSubTypesData,
  isEditable,
}) => {
  console.log('====================================');
  console.log('vitalsSubTypesData', vitalsSubTypesData);
  console.log('====================================');
  const customValue = 85;

  console.log('this is the value:');

  return (
    <View
      style={
        {
          // transform: [{rotate: '90deg'}],
          // backgroundColor: 'black',
          // borderRadius: 12,
          // marginHorizontal: 20,
          // width: '95%',
          // marginLeft: 200,
          // marginRight: 200,
        }
      }>
      {/* ///This is the slider stick sticking out */}
      <View
        style={{
          zIndex: -1,
          marginBottom: width * -0.09,
          // marginLeft: width * 0.445,
          marginLeft: width * 0.345,

          // fontSize: 30,
        }}>
        <SvgCss
          xml={Svgs.slider_toucbpad_red}
          width={hp(5)}
          height={hp(4.3)}
          fill={Colors.black}
          onPress={() => this.props.navigation.pop()}
          style={{marginHorizontal: hp(0.3), transform: [{rotate: '270deg'}]}}
        />
      </View>
      <View
        style={{
          zIndex: 1,
          // marginBottom: width * -2.35,
          marginLeft: sliderValue < 100 ? width * 0.38 : width * 0.37,

          // marginTop: width * -0.5,
          // marginBottom:  hp(-20),
          position: 'absolute',
          marginTop: 7,
          fontSize: 19,
          transform: [{rotate: '270deg'}],
          // transform: 'rotate(90deg)',
          color: 'black',
          fontWeight: 'bold',
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
          {sliderValue === 98.6 ? 98 : sliderValue}
        </Text>
      </View>

      <View>
        <LineGauge
          rotateText={true}
          // min={vitalsSubTypesData[0]?.minRange}
          min={50}
          // max={vitalsSubTypesData[0]?.maxRange}
          max={112}
          value={sliderValue}
          onChange={setSliderValue}
          isEditable={isEditable}
          type={1.5}
        />
      </View>
    </View>
  );
};

export default CustomSliderBPDiastolic;

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
