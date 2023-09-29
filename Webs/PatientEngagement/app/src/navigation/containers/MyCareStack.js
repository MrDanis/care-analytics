// /* istanbul ignore file */
// import {createStackNavigator} from 'react-navigation-stack';
// import {Platform, Text, TouchableOpacity} from 'react-native';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import Colors from '../../../config/Colors';
// import React from 'react';
// import MyCareScreen from '../../features/mycare/screens/MyCareScreen';
// import HeaderRight from './HeaderRight';
// import HeaderLeft from './HeaderLeft';
// import images from '../../../config/Images';
// import VitalsScreen from '../../features/mycare/screens/VitalsScreen';
// import VitalHistory from '../../features/mycare/screens/VitalHistory';
// import MeasureVitals from '../../features/mycare/screens/MeasureVitals';
// import MedicationStackNavigator from './MedicationStack';
// import AssessmentStack from './AssessmentStack';
// import AssessmentDashboard from '../../features/mycare/screens/assessment/AssessmentDashboard';
// import AssessmentSummary from '../../features/mycare/screens/assessment/AssessmentSummary';
// import AssessmentDetail from '../../features/mycare/screens/assessment/AssessmentDetail';
// import AssessmentParentQuestions from '../../features/mycare/screens/assessment/AssessmentParentQuestions';
// import AssessmentParentQuestionsUnComplete from '../../features/mycare/screens/assessment/AssessmentParentQuestionsUnComplete';

// const MyCareStack = createStackNavigator(
//   {
//     MyCare: MyCareScreen,
//     Vitals: VitalsScreen,
//     MeasureVitals: MeasureVitals,
//     VitalHistory: VitalHistory,
//     Medication: {
//       screen: MedicationStackNavigator.MedicationStack,
//       navigationOptions: {
//         header: null,
//       },
//     },
//     Assessment: AssessmentDashboard,
//     AssessmentDetail: {
//       screen: AssessmentDetail,
//       navigationOptions: {
//         title: '',
//       },
//     },
//     AssessmentSummary: {
//       screen: AssessmentSummary,
//       navigationOptions: {
//         title: '',
//       },
//     },
//     AssessmentParentQuestions: {
//       screen: AssessmentParentQuestions,
//       navigationOptions: {
//         title: '',
//       },
//     },
//     AssessmentParentQuestionsUnComplete: {
//       screen: AssessmentParentQuestionsUnComplete,
//       navigationOptions: {
//         title: '',
//       },
//     },
//   },
//   {
//     defaultNavigationOptions: ({navigation, screenProps}) => {
//       console.log('screenProps', navigation.state.routeName);
//       return {
//         headerRight: () => (
//           <HeaderRight
//             image={images.notificationIcon_dashboard}
//             navigation={navigation}
//             name={navigation.state.routeName}
//           />
//         ),

//         headerLeft: () => (
//           <HeaderLeft
//             image={images.arrowLeft}
//             name={navigation.state.routeName}
//             width={21}
//             height={19}
//             navigation={navigation}
//           />
//         ),
//         headerTitleStyle: {marginTop: hp(1)},
//         title: '',
//         headerStyle: {
//           height: Platform.OS === 'android' ? hp(8) : hp(10),
//           // borderBottomColor: Colors.line,
//           backgroundColor: Colors.backgroundMainLogin,
//           // borderBottomWidth: 1,
//         },
//       };
//     },

//     // headerMode: global.isPatientTouch === true ? 'screen' : 'none',
//   },
// );
// if (MyCareStack) {
//   MyCareStack.navigationOptions = ({navigation}) => {
//     let tabBarVisible = true;

//     let routeName = navigation.state.routes[navigation.state.index].routeName;
//     if (routeName == 'Vitals') {
//       tabBarVisible = false;
//     } else if (routeName == 'Medication') {
//       tabBarVisible = false;
//     } else if (routeName == 'Assessment') {
//       tabBarVisible = false;
//     } else if (routeName == 'AssessmentDetail') {
//       tabBarVisible = false;
//     } else if (routeName == 'AssessmentSummary') {
//       tabBarVisible = false;
//     } else if (routeName == 'AddNewMedication') {
//       tabBarVisible = false;
//     } else if (routeName == 'EditMedication') {
//       tabBarVisible = false;
//     } else if (routeName == 'Pharmacies') {
//       tabBarVisible = false;
//     } else if (routeName == 'Coupon') {
//       tabBarVisible = false;
//     } else if (routeName == 'AllMedication') {
//       tabBarVisible = false;
//     } else if (routeName == 'MedicationDetail') {
//       tabBarVisible = false;
//     } else if (routeName == 'MeasureVitals') {
//       tabBarVisible = false;
//     } else if (routeName == 'VitalHistory') {
//       tabBarVisible = false;
//     } else if (routeName == 'AssessmentParentQuestions') {
//       tabBarVisible = false;
//     } else if (routeName == 'AssessmentParentQuestionsUnComplete') {
//       tabBarVisible = false;
//     }
//     return {
//       tabBarVisible,
//     };
//   };
// }
// export default MyCareStack;
