/* istanbul ignore file */
import React from 'react';
import {Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import Colors from '../../../../config/Colors';

const LegendComponent = ({id}) => {
  console.log('LegendComponent idddd', id);
  // if (id && id === 1) {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        marginLeft: hp(10),
        marginBottom: hp(4),
        marginTop: hp(2),
      }}>
      <Text
        style={{
          fontFamily: 'WisemanPTSymbols',
          fontSize: hp(4),
          color: Colors.homeGreen,
          marginTop: hp(0.4),
        }}>
        +
      </Text>
      <Text
        style={{
          fontFamily: Fonts.RobotoRegular,
          fontSize: hp(2),
          color: Colors.fontGrey,
        }}>
        Normal
      </Text>
      <Text
        style={{
          fontFamily: 'WisemanPTSymbols',
          fontSize: hp(4),
          marginLeft: hp(2),
          marginTop: hp(0.4),
          color: Colors.red,
        }}>
        +
      </Text>
      <Text
        style={{
          fontFamily: Fonts.RobotoRegular,
          fontSize: hp(2),
          color: Colors.fontGrey,
        }}>
        Critical
      </Text>
    </View>
  );
  // } else if (id && id === 12) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(10),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                02 Saturation
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 10) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(10),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Weight
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 4) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(10),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Temperature
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 8) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(10),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 BMI
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 6) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(10),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Plus Rate
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 7) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(9),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Respiration Rate
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 9) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(10),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Height
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 11) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(12),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Pain
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // } else if (id && id === 13) {
  //     return (
  //         <View
  //             style={{
  //                 flexDirection: 'row',
  //                 width: '100%',
  //                 marginLeft: hp(12),
  //                 marginBottom: hp(4),
  //                 marginTop:hp(2)
  //             }}>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     color: Colors.homeGreen,
  //                     marginTop: hp(0.4),
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Blood Sugar
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'WisemanPTSymbols',
  //                     fontSize: hp(4),
  //                     marginLeft: hp(2),
  //                     marginTop: hp(0.4),
  //                     color: Colors.red,
  //                 }}>
  //                 +
  //             </Text>
  //             <Text
  //                 style={{
  //                     fontFamily: 'Roboto-Light',
  //                     fontSize: hp(2),
  //                     color: Colors.fontGrey,
  //                 }}>
  //                 Critical
  //             </Text>
  //         </View>
  //     );
  // }
  // else {
  //     return null;
  // }
};

export default LegendComponent;
