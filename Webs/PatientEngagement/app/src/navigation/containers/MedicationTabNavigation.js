// /* istanbul ignore file */
// import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
// import Colors from '../../../config/Colors';
// import {Text, TouchableOpacity, View} from 'react-native';
// import {
//   heightPercentageToDP,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import React from 'react';
// import {createStackNavigator} from 'react-navigation-stack';
// import AllMedicationScreen from '../../features/medication/screens/AllMedicationScreen';
// import MedicationMainScreen from '../../features/medication/screens/MedicationMainScreen';
// // import CalenderIcon from '../../../../assets/svg/icon_today.svg';
// // import RxIcon from '../../../../assets/svg/icon_prescription.svg';
// import {Fonts} from '../../../config/AppConfig';
// import {NearPharmacies} from '../../features/medication/screens/goodRx/NearPharmacies';
// const MedicationTabNav = createMaterialTopTabNavigator(
//   {
//     MedicationDashboard: MedicationMainScreen,
//     Prescriptions: AllMedicationScreen,
//   },
//   {
//     navigationOptions: {
//       tabBarVisible: false,
//     },
//     headerMode: 'none',
//     tabBarPosition: 'top',
//     swipeEnabled: true,
//     animationEnabled: true,
//     lazy: true,
//     tabBarOptions: {
//       activeTintColor: Colors.blueTextColor,
//       inactiveTintColor: Colors.black3,
//       style: {
//         backgroundColor: Colors.white,
//       },
//       labelStyle: {
//         textAlign: 'center',
//       },
//       indicatorStyle: {
//         borderBottomColor: Colors.blueTextColor,
//         borderBottomWidth: 3,
//       },
//     },
//     defaultNavigationOptions: ({navigation}) => ({
//       tabBarLabel: ({focused, tintColor}) => {
//         const {routeName} = navigation.state;
//         let label;
//         switch (routeName) {
//           case 'MedicationDashboard':
//             return (
//               <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                 {/*<CalenderIcon*/}
//                 {/*  width={heightPercentageToDP(2)}*/}
//                 {/*  height={heightPercentageToDP(2)}*/}
//                 {/*  fill={tintColor}*/}
//                 {/*/>*/}
//                 <Text
//                   style={{
//                     fontSize: hp(2),
//                     fontFamily: Fonts.NunitoBold,
//                     color: tintColor,
//                     marginLeft: hp(1.5),
//                   }}>
//                   Dashboard
//                 </Text>
//               </View>
//             );
//           case 'Prescriptions':
//             return (
//               <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                 {/*<RxIcon*/}
//                 {/*  width={heightPercentageToDP(2)}*/}
//                 {/*  height={heightPercentageToDP(2)}*/}
//                 {/*  fill={tintColor}*/}
//                 {/*/>*/}
//                 <Text
//                   style={{
//                     fontSize: hp(2),
//                     fontFamily: Fonts.NunitoBold,
//                     color: tintColor,
//                     marginLeft: hp(1.5),
//                   }}>
//                   Prescriptions
//                 </Text>
//               </View>
//             );
//         }
//         return label;
//       },
//     }),
//   },
// );
// const DashboardTab = createStackNavigator(
//   {
//     MainScreen: MedicationMainScreen,
//   },
//   {
//     headerMode: 'none',
//   },
// );
// const AllMedicationTab = createStackNavigator(
//   {
//     AllMedication: AllMedicationScreen,
//   },
//   {
//     headerMode: 'none',
//   },
// );
// const MedicationTabNavigation = {
//   MedicationTabNav,
// };

// export default MedicationTabNavigation;
