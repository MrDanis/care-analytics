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
import LineGaugeHeight from './src_ruler_gauge/LineGuageHeight';

const CustomSliderHeightCm = ({
  sliderValue,
  setSliderValue,
  vitalsSubTypesData,
  isEditable,
}) => {
  console.log('====================================');
  console.log('vitalsSubTypesData', vitalsSubTypesData);
  console.log('====================================');
  console.log('====================================');
  console.log('sliderValue in slider', sliderValue);
  console.log('====================================');
  const customValue = 85;

  console.log('this is the value:');

  return (
    <View
      style={{
        borderColor: 'green',
        borderWidth: 0,
        // transform: [{rotate: '90deg'}],
        // backgroundColor: 'black',
        // borderRadius: 12,
        // marginHorizontal: 20,
        // width: '95%',
        // marginLeft: 200,
        // marginRight: 200,
      }}>
      {/* ///This is the slider stick sticking out */}
      <View
        style={{
          zIndex: -1,
          marginBottom: width * -0.09,
          marginLeft: width * 0.345,
          borderColor: 'red',
          borderWidth: 0,
        }}>
        {/* <View
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
            
            </View>
            <View
              style={{
                // zIndex: 1,
                width: Dimensions.get('window').width * 0.06,
                marginLeft: Dimensions.get('window').width * 0.03,
    
                // marginRight: Dimensions.get('window').width * -0.5,
                marginTop: Dimensions.get('window').width * -0.026,
                height: Dimensions.get('window').width * 0.04,
                borderTopWidth: Dimensions.get('window').width * 0.05,
                borderTopColor: '#607D8B',
                borderLeftColor: 'transparent',
                borderLeftWidth: Dimensions.get('window').width * 0.029,
                borderRightColor: 'transparent',
                borderRightWidth: Dimensions.get('window').width * 0.025,
                borderBottomColor: 'transparent',
                // borderBottomWidth: Dimensions.get('window').width * 0.2,
              }}></View> */}
        <SvgCss
          xml={Svgs.slider_toucbpad}
          width={hp(5)}
          height={hp(4.3)}
          fill={Colors.black}
          onPress={() => this.props.navigation.pop()}
          style={{marginHorizontal: hp(0.4), transform: [{rotate: '270deg'}]}}
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
      <View style={{borderColor:'red',borderWidth:0}}>
        <LineGauge
          // min={vitalsSubTypesData[0]?.minRange}
          min={91}
          // max={vitalsSubTypesData[0]?.maxRange}
          max={250}
          value={sliderValue}
          onChange={setSliderValue}
          isEditable={isEditable}
        />

        {/* <LineGauge
            rotateText={true}
            // min={vitalsSubTypesData[0]?.minRange}
            min={1}
            // max={vitalsSubTypesData[0]?.maxRange}
            max={12}
            value={sliderValue}
            onChange={setSliderValue}
            labels={{
              [1]: '1',
              [2]: '2',
              [3]: '3',
              [4]: '4',
              [5]: '5',
              [6]: '6',
              [7]: '7',
              [8]: '8',
              [9]: '9',
            }}
            step={0.1}
          /> */}
        {/* <LineGauge
          // min={vitalsSubTypesData[0]?.minRange}
          min={92}
          // max={vitalsSubTypesData[0]?.maxRange}
          max={250}
          value={sliderValue}
          onChange={setSliderValue}
          isEditable={isEditable}
        /> */}
      </View>
    </View>
  );
};

export default CustomSliderHeightCm;
