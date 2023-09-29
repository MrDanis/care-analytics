/* istanbul ignore file */
import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import {Platform, TouchableOpacity} from 'react-native';

import SymptomTrackerScreen from '../../features/home/screens/components/activities_screen_components.js/symptoms_tracker_screen';
import DepressiveScreen from '../../features/home/screens/components/symptoms_components.js/depressive_screen';
import SymptomSliderScreen from '../../features/home/screens/components/symptoms_components.js/symptoms_slider_component';

const Stack = createNativeStackNavigator();
const SymptomsStack = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Symptoms"
        component={SymptomTrackerScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DepressiveScreen"
        component={DepressiveScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SymptomSliderScreen"
        component={SymptomSliderScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export default SymptomsStack;
