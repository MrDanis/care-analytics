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
import Notification from '../../features/notifications/Notification';

const Stack = createNativeStackNavigator();
const NotificationStack = ({navigation}) => {
  return (
    <Stack.Navigator screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="Notifications"
        component={Notification}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default NotificationStack;
