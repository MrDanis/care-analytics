/* istanbul ignore file */
import {createStackNavigator} from 'react-navigation-stack';
import {Platform, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React from 'react';
import HeaderRight from './HeaderRight';
import HeaderLeft from './HeaderLeft';
import images from '../../../config/Images';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AssessmentDashboard from '../../features/mycare/screens/assessment/AssessmentDashboard';
import AssessmentDetail from '../../features/mycare/screens/assessment/AssessmentDetail';
import AssessmentSummary from '../../features/mycare/screens/assessment/AssessmentSummary';
import AssessmentParentQuestions from '../../features/mycare/screens/assessment/AssessmentParentQuestions';
import AssessmentParentQuestionsUnComplete from '../../features/mycare/screens/assessment/AssessmentParentQuestionsUnComplete';
import AssessmentChildQuestions from '../../features/mycare/screens/assessment/AssessmentChildQuestions';
const Stack = createNativeStackNavigator();
const AssessmentStack = () => {
  return (
    <Stack.Navigator screenOptions={{gestureEnabled: true}}>
      <Stack.Screen
        name="AssessmentDashboard"
        component={AssessmentDashboard}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AssessmentDetail"
        component={AssessmentDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssessmentParentQuestions"
        component={AssessmentParentQuestions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssessmentParentQuestionsUnComplete"
        component={AssessmentParentQuestionsUnComplete}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssessmentChildQuestions"
        component={AssessmentChildQuestions}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export default AssessmentStack;
