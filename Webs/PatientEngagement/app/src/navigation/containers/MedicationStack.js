// /* istanbul ignore file */
// import MedicationTabNavigation from './MedicationTabNavigation';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddNewMedicationScreen from '../../features/medication/screens/AddNewMedicationScreen';
import EditMedicationScreen from '../../features/medication/screens/EditMedicationScreen';
import NearPharmacies from '../../features/medication/screens/goodRx/NearPharmacies';
import CouponScreen from '../../features/medication/screens/goodRx/CouponScreen';
import AllTodayMedicationScreen from '../../features/medication/screens/AllTodayMedicationScreen';
import MedicationDetailScreen from '../../features/medication/screens/MedicationDetailScreen';
// import HeaderRight from './HeaderRight';
// import HeaderLeft from './HeaderLeft';
// import images from '../../../config/Images';
import AllMedicationScreen from '../../features/medication/screens/AllMedicationScreen';
import MedicationMainScreen from '../../features/medication/screens/MedicationMainScreen';

const Stack = createNativeStackNavigator();
const MedicationStack = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Medications"
        component={MedicationMainScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Prescriptions"
        component={AllMedicationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddNewMedication"
        component={AddNewMedicationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditMedication"
        component={EditMedicationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Pharmacies"
        component={NearPharmacies}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Coupon"
        component={CouponScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllMedication"
        component={AllTodayMedicationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default MedicationStack;
