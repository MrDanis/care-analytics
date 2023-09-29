/* istanbul ignore file */
// import {createStackNavigator, HeaderBackground} from 'react-navigation-stack';
// import {Platform, Text, TouchableOpacity} from 'react-native';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import React from 'react';
// import HeaderRight from './HeaderRight';
// import HeaderLeft from './HeaderLeft';
// import images from '../../../config/Images';
// import DiscoverMainScreen from '../../features/discover/screens/DiscoverMainScreen';
// import CustomSliderWeight from '../../features/discover/screens/components/customSliderWeight';

// import {Colors} from '../../../config';

// const DiscoverStack = createStackNavigator(
//   {
//     Discover: DiscoverMainScreen,
//     // Discover: CustomSliderWeight,
//   },
//   {
//     defaultNavigationOptions: ({navigation, screenProps}) => {
//       return {
//         headerRight: () => (
//           <HeaderRight
//             image={images.notificationIcon_dashboard}
//             navigation={navigation}
//             // name={navigation.state.routeName}
//             name={'Discover'}
//           />
//         ),

//         headerLeft: () => (
//           <HeaderLeft
//             image={images.userLogoDemo}
//             // name={navigation.state.routeName}
//             name={'Discover'}
//             width={33}
//             height={33}
//             navigation={navigation}
//           />
//         ),
//         title: <Text>Discover</Text>,
//         headerStyle: {
//           height: Platform.OS === 'android' ? hp(8) : hp(10),
//           backgroundColor: Colors.backgroundMainLogin,
//           // marginBottom: hp(1000),
//           // borderBottomColor: Colors.line,
//           // borderBottomWidth: 1,
//         },
//         headerTitleStyle: {marginTop: hp(1)},
//         // HeaderBackground = {Colors.black}
//         // headerBackground:Colors.backgroundMainLogin,
//       };
//     },
//   },
// );
// if (DiscoverStack) {
//   DiscoverStack.navigationOptions = ({navigation}) => {
//     let tabBarVisible = true;

//     let routeName = navigation.state.routes[navigation.state.index].routeName;

//     if (routeName == 'DiscoverDetail') {
//       tabBarVisible = false;
//     }

//     return {
//       tabBarVisible,
//     };
//   };
// }

// export default DiscoverStack;

/* istanbul ignore file */

import React from 'react';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DiscoverMainScreen from '../../features/discover/screens/DiscoverMainScreen';

const Stack = createNativeStackNavigator();
const DiscoverStack = () => {
  return (
    <Stack.Navigator screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="Discover"
        component={DiscoverMainScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export default DiscoverStack;
