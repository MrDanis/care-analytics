/* istanbul ignore file */
import React from 'react';
import SplashScreen from '../../features/welcome/screens/SplashScreen';
import Login from '../../features/welcome/screens/LoginScreen';
import InputEmailScreen from '../../features/welcome/screens/InputEmailScreen';
import InputPhoneScreen from '../../features/welcome/screens/InputPhoneScreen';
import OTPScreen from '../../features/welcome/screens/OTPScreen';
// import EditProfileScreen from '../../features/profile/screens/EditProfileScreen';
import HomeTabNavigation from '../containers/HomeTabNavigation';

import ChatStack from '../containers/ChatStack';
import IncomingVideoCallScreen from '../../features/telehealth/screens/IncomingVideoCallScreen';
import TwilioCallScreen from '../../features/telehealth/screens/TwilioCallScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {Colors, Svgs} from '../../../config';
import ProfileStack from '../containers/ProfileStack';
import MedicalHistoryStack from '../containers/MedicalHistoryStack';
import Notification from '../../features/notifications/Notification';
import HeaderRight from '../containers/HeaderRight';
import NotificationStack from '../containers/NotificationStack';
import EditProfileScreen from '../../features/profile/screens/EditProfileScreen';
import AssessmentStack from '../containers/AssessmentStack';
import MedicationStack from '../containers/MedicationStack';
import {SvgCss} from 'react-native-svg';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Platform, TouchableOpacity} from 'react-native';
import VitalsStack from '../containers/VitalsStack';
import DiscoverStack from '../containers/DiscoverStack';
import HomeScreen from '../../features/home/screens/HomeScreen';
import HomeStack from '../containers/HomeStack';
import StepCounterScreen from '../../features/home/screens/components/activities_screen_components.js/step_counter_screen';

import HealthCategoriesEditValuesScreen from '../../features/home/screens/components/activities_screen_components.js/health_activities_edit_values';
import SleepCounterScreen from '../../features/home/screens/components/activities_screen_components.js/sleep_counter_screen';
import SymptomTrackerScreen from '../../features/home/screens/components/activities_screen_components.js/symptoms_tracker_screen';
import DepressiveScreen from '../../features/home/screens/components/symptoms_components.js/depressive_screen';
import SymptomSliderScreen from '../../features/home/screens/components/symptoms_components.js/symptoms_slider_component';
import WellnessStack from '../containers/WellnessStack';
import CameraScreen from '../../features/home/screens/components/CameraScreen';
import ChatScreen from '../../features/chat/screens/ChatScreen';
import HeartCounterScreen from '../../features/home/screens/components/activities_screen_components.js/heart_counter_screen';
import MedicationEssentialScreen from '../../features/wellness/screen/medication_essentials_screen';
import AssessmentSummary from '../../features/mycare/screens/assessment/AssessmentSummary';
import PulseRateEditScreen from '../../features/mycare/components/Pulse_Rate_Edit_Screen';
import FindDocStack from '../containers/FindDocStack';
const Stack = createNativeStackNavigator();

export default function AppContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='AuthLoading'
        screenOptions={{
          gestureEnabled: Platform.OS === 'android' ? false : true,
          animation: 'fade',
          
        }}>
        <Stack.Screen
          name="AuthLoading"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginScreen"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmailScreen"
          component={InputEmailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PhoneScreen"
          component={InputPhoneScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeStack"
          component={HomeStack}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="FindDocStack"
          component={FindDocStack}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StepCounter"
          component={StepCounterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HeartCounter"
          component={HeartCounterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SleepCounter"
          component={SleepCounterScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
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
        /> */}
        <Stack.Screen
          name="HealthCategoriesEditValuesScreen"
          options={{headerShown: false}}
          component={HealthCategoriesEditValuesScreen}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="PulseRateEditScreen"
          options={{headerShown: false}}
          component={PulseRateEditScreen}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeTab"
          component={HomeTabNavigation}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="DiscoverScreen"
          component={DiscoverStack}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ChatMain" component={ChatStack} />
        <Stack.Screen
          name="IncomingCallScreen"
          component={IncomingVideoCallScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CallUI"
          component={TwilioCallScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WellnessStack"
          component={WellnessStack}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MedicationEssentialScreen"
          component={MedicationEssentialScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationStack"
          component={NotificationStack}
          options={({navigation}) => ({
            headerShadowVisible: false,
            headerStyle: {backgroundColor: Colors.BgColor},
            title: 'Notifications',
            headerLeft: () => (
              <SvgCss
                xml={Svgs.arrowHeadLeft}
                width={hp(5)}
                height={hp(5)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
              />
            ),
            headerRight: () => (
              <TouchableOpacity>
                {/* <SvgCss
                  xml={Svgs.settings_Icon}
                  width={hp(2.4)}
                  height={hp(2.5)}
                  fill={Colors.black}
                  onPress={() => navigation.pop()}
                /> */}
              </TouchableOpacity>
            ),
            headerTitleAlign: 'center',
          })}
        />

        <Stack.Screen
          name="AssessmentSummary"
          component={AssessmentSummary}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
