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

const CustomSliderWeight = ({
  sliderValue,
  setSliderValue,
  vitalsSubTypesData,
  isEditable,
}) => {
  console.log('====================================');
  console.log('vitalsSubTypesData', vitalsSubTypesData);
  console.log('====================================');
  // const customValue = 85;

  console.log('this is the value:');

  return (
    <View
      style={
        {
          borderColor:'purple',
          borderWidth:0
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
          borderColor:'orange',
          borderWidth:0
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
            borderColor:'red',
            borderWidth:0
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
          borderColor:'green',
          borderWidth:0
        }}>
        {sliderValue}
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
        kg
      </Text>
      <View style={{borderColor:'red',borderWidth:0}}>
        <LineGauge
          // min={vitalsSubTypesData[0]?.minRange}
          min={0}
          // max={vitalsSubTypesData[0]?.maxRange}
          max={250}
          value={sliderValue}
          onChange={setSliderValue}
          isEditable={isEditable}
        />
      </View>
    </View>
  );
};

export default CustomSliderWeight;

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

// export default class CustomSliderWeight extends React.Component {
//   // state = {
//   //   value: 50,
//   // };
//   onValueChanged = value => {
//     console.debug(value);
//     this.setState({value});
//   };
//   // scrollViewRef = React.createRef();
//   // textInputRef = React.createRef();
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: 15,
//       // ScrollX: new Animated.Value(0),
//       // initalWeight: 65,
//     };

//     //   this.state.ScrollX.addListener(({value}) => {
//     //     const weightValue = Math.round(value / snapSegment) + minWeight;

//     //     if (this.textInputRef && this.textInputRef.current) {
//     //       this.textInputRef.current.setNativeProps({
//     //         text: `${weightValue}`,
//     //       });
//     //     }
//     //   });
//   }

//   componentDidMount() {
//     setTimeout(() => {
//       if (this.scrollViewRef && this.scrollViewRef.current) {
//         this.scrollViewRef.current.scrollTo({
//           x: (this.state.initalWeight - minWeight) * snapSegment,
//           y: 0,
//           animated: true,
//         });
//       }
//     }, 1000);
//   }

//   render() {
//     {
//       return (
//         <SafeAreaView>
//           <Text
//             style={{
//               paddingBottom: width / 1.2,
//             }}>
//             CustomSliderWeight
//           </Text>
//           <View
//             style={{
//               zIndex: -1,
//               marginBottom: width * -0.13,
//               marginLeft: width * 0.455,

//               // fontSize: 30,
//             }}>
//             <View
//               style={{
//                 borderRadius:
//                   Math.round(
//                     Dimensions.get('window').width +
//                       Dimensions.get('window').height,
//                   ) / 2,
//                 width: Dimensions.get('window').width * 0.1,
//                 height: Dimensions.get('window').width * 0.1,

//                 backgroundColor: '#607D8B',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//               underlayColor="#607D8B"
//               onPress={() => alert('Yaay!')}>
//               {/* <Text> Mom, look, I am a circle! </Text> */}
//             </View>
//             <View
//               style={{
//                 // zIndex: 1,
//                 width: Dimensions.get('window').width * 0.08,
//                 marginLeft: Dimensions.get('window').width * 0.01,

//                 // marginRight: Dimensions.get('window').width * -0.5,
//                 marginTop: Dimensions.get('window').width * -0.02,
//                 height: Dimensions.get('window').width * 0.02,
//                 borderTopWidth: Dimensions.get('window').width * 0.05,
//                 borderTopColor: '#607D8B',
//                 borderLeftColor: 'transparent',
//                 borderLeftWidth: Dimensions.get('window').width * 0.04,
//                 borderRightColor: 'transparent',
//                 borderRightWidth: Dimensions.get('window').width * 0.04,
//                 borderBottomColor: 'transparent',
//                 // borderBottomWidth: Dimensions.get('window').width * 0.2,
//               }}></View>
//           </View>
//           <Text
//             style={{
//               zIndex: -0,
//               // marginBottom: width * -2.35,
//               marginLeft: width * 0.47,
//               // marginBottom: width * -0.1,
//               marginTop: 10,
//               fontSize: 20,
//               color: 'white',
//               fontWeight: 'bold',
//             }}>
//             {this.state.value === 1 ? 15 : this.state.value}
//           </Text>
//           <Text
//             style={{
//               marginLeft: width * 0.483,
//               fontSize: 13,
//               color: 'white',
//               fontWeight: 'bold',
//             }}>
//             kg
//           </Text>
//           <View
//             style={
//               {
//                 // zIndex:-5,
//                 // backgroundColor: 'white',
//               }
//             }>
//             <LineGauge
//               // min={10}
//               max={100}
//               value={this.state.value}
//               onChange={this.onValueChanged}
//             />
//           </View>
//           {/* <LineGuage
//             min={0}
//             max={100}
//             value={42}
//             onChange={this._handleGaugeChange}
//           /> */}

//           {/* <RNScrollRuler /> */}
//           {/* <RTVScrollRuler /> */}
//           {/* RCTScrollRuler */}
//           {/* <RCTScrollRuler /> */}
//           {/* <Animated.ScrollView
//             ref={this.scrollViewRef}
//             onScroll={Animated.event(
//               [
//                 {
//                   nativeEvent: {
//                     contentOffset: {x: this.state.ScrollX},
//                   },
//                 },
//               ],
//               {useNativeDriver: true},
//             )}
//             bounces={false}
//             scrollEventThrottle={1}
//             snapToInterval={snapSegment}
//             showsHorizontalScrollIndicator={false}
//             horizontal={true}
//             contentContainerStyle={styles.scrollViewContainerStyle}>
//             <Ruler />
//           </Animated.ScrollView>
//           <View style={styles.indicatorWrapper}>
//             <TextInput
//               ref={this.textInputRef}
//               style={styles.weightTextStyle}
//               defaultValue={minWeight.toString()}
//               // value={15}
//             />
//             <View style={[styles.segment, styles.segmentIndicator]}></View>
//           </View> */}
//         </SafeAreaView>
//       );
//     }
//   }
// }
