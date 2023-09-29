/* istanbul ignore file */
import {Platform, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../config/Colors';
import React from 'react';
import MainDashboardScreen from '../../features/bluebutton/screens/MainDashboard';
import HeaderRight from './HeaderRight';
import images from '../../../config/Images';
import HeaderLeft from './HeaderLeft';
import ProviderHistory from '../../features/bluebutton/screens/component/ProviderHistory';
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
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {connect, useSelector} from 'react-redux';
import AuthenticationType from '../../features/bluebutton/screens/AuthenticationTypeACOLogin';
const Stack = createNativeStackNavigator();
const MedicalHistoryStack = ({route}) => {
  const userProfileData = route.params;
  console.log('user profile data in medical history ', userProfileData);
  return (
    <Stack.Navigator
      screenOptions={{gestureEnabled: false, headerShown: false}}
      initialRouteName={
        userProfileData && userProfileData?.isAcoPatient
          ? AuthenticationType
          : MainDashboardScreen
      }>
      <Stack.Screen
        name="AuthenticationType"
        component={AuthenticationType}
        options={{
          headerTitle: 'Authentication',
          headerStyle: {backgroundColor: Colors.BgColor},
        }}
      />
      <Stack.Screen
        name="MainDashboard"
        component={MainDashboardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Medication"
        component={MedicationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Diseases"
        component={DiseasesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllergiesScreen"
        component={AllergiesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CoverageScreen"
        component={CoverageScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProviderScreen"
        component={Providers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Procedure"
        component={ProceduresScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HospitalVisitScreen"
        component={HospitalVisits}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShareHistoryScreen"
        component={ShareHistory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InteractionScreen"
        component={InteractionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InteractionDetailScreen"
        component={InteractionDetailScreen}
      />
      <Stack.Screen name="ProviderHistoryScreen" component={ProviderHistory} />
    </Stack.Navigator>
  );
};

// const mapStateToProps = ({homeApiData, userProfileData}) => ({
//   homeApiData,
//   userProfileData,
// });

export default MedicalHistoryStack;
