/* istanbul ignore file */
import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
  Dimensions,
  useWindowDimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import {Fonts, PatientData} from '../../../../../config/AppConfig';
import AssessmentTab from './AssessmentTab';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import HeaderAssessment from '../../components/HeaderAssessment';
const Assessment = ({navigation}) => {
  // useEffect(() => {
  //     let willFocusSubscription = navigation.addListener('willFocus', () => {
  //         getAllMedicine();
  //     });
  //     return () => willFocusSubscription();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Fragment>
      <StatusBar backgroundColor={Colors.BgColor} barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.BgColor,
        }}>
        <HeaderAssessment navigation={navigation}>
          <AssessmentTab navigation={navigation} />
        </HeaderAssessment>
      </SafeAreaView>
    </Fragment>
  );
};
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonBGColor,
    borderColor: Colors.blueTextColor,
    marginTop: hp(2),
  },
  textFieldCont: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
    marginVertical: hp(1.5),
  },
  textContainer: {
    flexDirection: 'row',
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputStyle: {
    flex: 1,
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    color: '#424242',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    flexDirection: 'row',
  },
});

// Assessment.navigationOptions = {
//     headerShown: false,
// };
export default Assessment;
