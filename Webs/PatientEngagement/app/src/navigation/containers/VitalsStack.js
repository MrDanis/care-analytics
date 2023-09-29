// /* istanbul ignore file */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VitalsScreen from '../../features/mycare/screens/VitalsScreen';
import MeasureVitals from '../../features/mycare/screens/MeasureVitals';
import VitalHistory from '../../features/mycare/screens/VitalHistory';
import VitalWeightScreen from '../../features/mycare/screens/VitalWeightScreen';
import VitalTemperatureScreen from '../../features/mycare/screens/VitalTemperatureScreen';
import VitalBloodPressureScreen from '../../features/mycare/screens/VitalBloodPressureScreen';
import VitalHeightScreen from '../../features/mycare/screens/VitalHeightScreen';
import VitalPulseRateScreen from '../../features/mycare/screens/VitalPulseRateScreen';

const Stack = createNativeStackNavigator();
const VitalsStack = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Vitals"
        component={VitalsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MeasureVitals"
        component={MeasureVitals}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VitalHistory"
        component={VitalHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VitalWeight"
        component={VitalWeightScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VitalTemperature"
        component={VitalTemperatureScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VitalBloodPressure"
        component={VitalBloodPressureScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VitalHeight"
        component={VitalHeightScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VitalPulseRate"
        component={VitalPulseRateScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default VitalsStack;
