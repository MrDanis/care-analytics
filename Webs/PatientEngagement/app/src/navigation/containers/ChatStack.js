/* istanbul ignore file */
import ChatScreen from '../../features/chat/screens/ChatScreen';
import Contacts from '../../features/chat/screens/contacts';

/* istanbul ignore file */
import {Platform, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../config/Colors';
import React from 'react';
import HeaderRight from './HeaderRight';
import images from '../../../config/Images';
import HeaderLeft from './HeaderLeft';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default ChatStack;

// const ChatStack = createStackNavigator(
//   {
//     Chat: Contacts,
//    // Contact: Contacts,
//     // Messages: MessagesScreen,
//   },
//   {
//     defaultNavigationOptions: ({navigation, screenProps}) => {
//       console.log('screenProps', navigation.state.routeName);
//       return {
//         headerRight: () => (
//           <HeaderRight
//             image={images.IconMessage}
//             navigation={navigation}
//             name={navigation.state.routeName}
//           />
//         ),

//         headerLeft: () => (
//           <HeaderLeft
//             image={images.IconMyCareBlack}
//             name={navigation.state.routeName}
//             width={21}
//             height={19}
//             navigation={navigation}
//           />
//         ),
//         title: '',
//         headerStyle: {height: Platform.OS === 'android' ? hp(8) : hp(10)},
//       };
//     },

//     // headerMode: global.isPatientTouch === true ? 'screen' : 'none',
//   },
// );
// if (ChatStack) {
//   ChatStack.navigationOptions = ({navigation}) => {
//     let tabBarVisible = true;

//     let routeName = navigation.state.routes[navigation.state.index].routeName;
//     if (routeName == 'Chat') {
//       tabBarVisible = false;
//     }
//     return {
//       tabBarVisible,
//     };
//   };
// }
