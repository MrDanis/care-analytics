/* istanbul ignore file */
import {Platform, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../config/Colors';
import React from 'react';
import ProfileScreen from '../../features/profile/screens/ProfileScreen';
import MainDashboardScreen from '../../features/bluebutton/screens/MainDashboard';
import HeaderRight from './HeaderRight';
import images from '../../../config/Images';
import HeaderLeft from './HeaderLeft';
import MedicationScreen from '../../features/bluebutton/screens/Medication/MedicationScreen';
import DiseasesScreen from '../../features/bluebutton/screens/DiseasesScreen';
import AllergiesScreen from '../../features/bluebutton/screens/AllergiesScreen';
import ShareHistory from '../../features/bluebutton/screens/ShareHistory';
import ACOUserLogin from '../../features/bluebutton/screens/ACOUserLogin';
import CoverageScreen from '../../features/bluebutton/screens/CoverageScreen';
import Providers from '../../features/bluebutton/screens/Providers';
import ProceduresScreen from '../../features/bluebutton/screens/ProceduresScreen';
import HospitalVisits from '../../features/bluebutton/screens/HospitalVisits';
import ProfileInfoScreen from '../../features/profile/screens/ProfileInfoScreen';
import AppointmentScreen from '../../features/bluebutton/screens/AppointmentScreen';
import InteractionScreen from '../../features/bluebutton/screens/Medication/Interaction';
import InteractionDetailScreen from '../../features/bluebutton/screens/Medication/InteractionDetails';
// import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WellnessScreen from '../../features/wellness/screen/WellnessScreen';

const Stack = createNativeStackNavigator();
const WellnessStack = () => {
  return (
    <Stack.Navigator screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="WellnessStack"
        component={WellnessScreen}
        options={{headerShown: false}}
      />

      {/* <Stack.Screen name="ProfileInfoScreen" component={ProfileInfoScreen} /> */}
    </Stack.Navigator>
  );
};
export default WellnessStack;
