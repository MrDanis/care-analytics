import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HeaderAssessment from '../../components/HeaderAssessment';
import Colors from '../../../../../config/Colors';
import {Fonts} from '../../../../../config/AppConfig';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const AssessmentChildQuestions = ({navigation}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.BgColor,
      }}>
      <StatusBar backgroundColor={Colors.BgColor} barStyle="dark-content" />
      <HeaderAssessment navigation={navigation}>
        {/* main container */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.BgColor,
            padding: hp(2.5),
          }}>
          <Text>Coming soon</Text>
        </View>
      </HeaderAssessment>
    </SafeAreaView>
  );
};

export default AssessmentChildQuestions;

const styles = StyleSheet.create({});
