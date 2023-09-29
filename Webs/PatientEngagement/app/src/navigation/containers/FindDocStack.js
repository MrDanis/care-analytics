/* istanbul ignore file */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FindDoctorDashboard from '../../features/finddoc/screens/FindDoctorDashboard';
import FindDoctorSearch from '../../features/finddoc/screens/FindDoctorSearch';
import FoundDoctor from '../../features/finddoc/screens/FoundDoctor';
const Stack = createNativeStackNavigator();
const FindDocStack = () => {
  return (
    <Stack.Navigator screenOptions={{gestureEnabled: true}}>
      <Stack.Screen
        name="FindDocDashboard"
        component={FindDoctorDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FindDocSearch"
        component={FindDoctorSearch}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoundDoctor"
        component={FoundDoctor}
        options={{headerShown: false}}
      />



    </Stack.Navigator>
  );
};
export default FindDocStack;
// <Stack.Navigator screenOptions={{gestureEnabled: true}}>
//       <Stack.Screen
//         name="AssessmentDashboard"
//         component={AssessmentDashboard}
//         options={{headerShown: false}}
//       />

//     </Stack.Navigator>