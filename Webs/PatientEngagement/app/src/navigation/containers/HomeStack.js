/* istanbul ignore file */
import {createStackNavigator} from 'react-navigation-stack';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React from 'react';
import HomeScreen from '../../features/home/screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Labs from '../../features/lab/screens/labScreen';
import ImagingRadiology from '../../features/imaging&Radiology/screens/ImagingScreen';
import MedicationStack from './MedicationStack';
import CameraScreen from '../../features/home/screens/components/CameraScreen';
import VitalsStack from './VitalsStack';
import AppointmentScreen from '../../features/bluebutton/screens/AppointmentScreen';
import ScheduleAppointment from '../../features/bluebutton/screens/component/ScheduleAppointment';
import AssessmentStack from './AssessmentStack';
import SymptomsStack from './SymptomsStack';
import FindDocStack from './FindDocStack';
const Stack = createNativeStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="Lab"
        component={Labs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Imaging"
        component={ImagingRadiology}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MedicationStack"
        component={MedicationStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VitalsStack"
        component={VitalsStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="AssessmentStack"
        component={AssessmentStack}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="AssessmentStack"
        component={AssessmentStack}
        options={{headerShown: false}}
      />
       <Stack.Screen
          name="FindDocStack"
          component={FindDocStack}
          options={{headerShown: false}}
        />
      <Stack.Screen
        name="ScheduleAppointment"
        component={ScheduleAppointment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SymptomsStack"
        component={SymptomsStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export default HomeStack;
