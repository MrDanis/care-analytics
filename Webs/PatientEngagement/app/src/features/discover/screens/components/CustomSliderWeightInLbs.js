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

const CustomSliderWeightInLbs = ({
  sliderValue,
  setSliderValue,
  vitalsSubTypesData,
  isEditable,
}) => {
  console.log('====================================');
  console.log('sliderValue', sliderValue);
  console.log('====================================');
  // const customValue = 85;

  console.log('this is the value:');

  return (
    <View
      style={
        {
          // backgroundColor: 'black',
          // borderRadius: 12,
          // marginHorizontal: 20,
          // width: '95%',
          // marginLeft: 200,
          // marginRight: 200,
        }
      }>
      <View
        style={{
          zIndex: -1,
          marginBottom: width * -0.13,
          // marginLeft: width * 0.445,
          marginLeft: width * 0.345,

          // fontSize: 30,
        }}>
        <View
          style={{
            borderRadius:
              Math.round(
                Dimensions.get('window').width +
                  Dimensions.get('window').height,
              ) / 2,
            width: Dimensions.get('window').width * 0.12,
            height: Dimensions.get('window').width * 0.12,

            backgroundColor: '#607D8B',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Text> Mom, look, I am a circle! </Text> */}
        </View>
        <View
          style={{
            // zIndex: 1,
            width: Dimensions.get('window').width * 0.08,
            marginLeft: Dimensions.get('window').width * 0.01,

            // marginRight: Dimensions.get('window').width * -0.5,
            marginTop: Dimensions.get('window').width * -0.026,
            height: Dimensions.get('window').width * 0.02,
            borderTopWidth: Dimensions.get('window').width * 0.05,
            borderTopColor: '#607D8B',
            borderLeftColor: 'transparent',
            borderLeftWidth: Dimensions.get('window').width * 0.049,
            borderRightColor: 'transparent',
            borderRightWidth: Dimensions.get('window').width * 0.05,
            borderBottomColor: 'transparent',
            // borderBottomWidth: Dimensions.get('window').width * 0.2,
          }}></View>
      </View>
      <Text
        style={{
          zIndex: 1,
          // marginBottom: width * -2.35,
          marginLeft: sliderValue < 100 ? width * 0.38 : width * 0.36,
          // marginTop: width * -0.5,
          // marginBottom: width * -0.1,
          marginTop: 1,
          fontSize: 19,
          color: 'white',
          fontWeight: 'bold',
        }}>
        {parseInt(sliderValue)}
      </Text>
      <Text
        style={{
          marginLeft: width * 0.383,
          marginBottom: width * -0.08,
          fontSize: 12,
          color: 'white',
          fontWeight: 'bold',
          zIndex:1
        }}>
        lbs
      </Text>
      <View>
        <LineGauge
          // min={vitalsSubTypesData[0]?.minRange}
          min={0}
          // max={vitalsSubTypesData[0]?.maxRange}
          max={551}
          value={sliderValue}
          onChange={setSliderValue}
          isEditable={isEditable}
        />
      </View>
    </View>
  );
};

export default CustomSliderWeightInLbs;
