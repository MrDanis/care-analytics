import {StyleSheet, Text, View, DatePickerIOS, Keyboard} from 'react-native';
import React from 'react';
import {useState, useEffect, Fragment} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import MainHeader from './MainHeader';
import CustomDatePicker from '../../home/screens/components/activities_screen_components.js/sub_components/custom_date_picker';
import {Colors} from '../../../../config';
import {Fonts, OSSource} from '../../../../config/AppConfig';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSelector} from 'react-redux';
import moment from 'moment';
import VitalsService from '../../../api/vitals';

const PulseRateEditScreen = ({route, navigation}) => {
  const [number, onChangeNumber] = React.useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDatePickerVisibleWakeTime, setIsDatePickerVisibleWakeTime] =
    useState(false);
  const [selectedSleepTime, setselectedSleepTime] = useState(new Date());
  const [selectedWakeTime, setselectedWakeTime] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const [wakeupTime, setwakeupTime] = React.useState('');
  const {onChangValue, value, vitalSubType, vitalsData} = route.params;
  const userProfileData = useSelector(state => state.userProfileData);
  const getCurrentDate = date => {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    // You can turn it into your desired format
    return day + '-' + month + '-' + year; // format: d-m-y;
  };

  console.log('====================================');
  console.log('sub type ', route.params.vitalSubType);
  console.log('====================================');

  useEffect(() => {
    onChangValue(route.params.value);
    // onChangeNumber(route.params.value.toString());
    console.log('====================================');
    console.log('route.params', route.params.value);
    console.log('====================================');
    console.log('====================================');
    console.log('route.params', route.params.maxRange);
    console.log('====================================');
  }, []);

  const handleTextChange = text => {
    // If the input value is empty, update the state with an empty string
    if (text === '') {
      onChangValue('');
      onChangeNumber('');
      return;
    }

    // Remove any non-digit characters from the input value
    const filteredText = text.replace(/[^0-9]/g, '');

    // If the filtered input value is "0", update the state with an empty string
    if (filteredText > route.params.maxRange) {
      onChangValue('');
      onChangeNumber('');
      return;
    }

    if (filteredText === '0') {
      onChangValue('');
      onChangeNumber('');
      return;
    }

    // If the filtered input value starts with "0", remove the leading "0"
    if (filteredText.startsWith('0')) {
      onChangValue(filteredText.substring(1));
      onChangeNumber(filteredText.substring(1));
    } else {
      // Otherwise, update the state with the filtered input value
      onChangValue(filteredText);
      onChangeNumber(filteredText);
    }
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };
  const showDatePickerWake = () => {
    setIsDatePickerVisibleWakeTime(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };
  const hideDatePickerWake = () => {
    setIsDatePickerVisibleWakeTime(false);
  };

  const handleDateChange = newDate => {
    setselectedSleepTime(newDate);
    hideDatePicker();
  };
  const handleDateChangeWakeTime = newDate => {
    setselectedWakeTime(newDate);
    hideDatePickerWake();
  };

  const handleCancel = () => {
    hideDatePicker();
  };
  const handleCancelWake = () => {
    hideDatePickerWake();
  };

  function measureVitalCall() {
    Keyboard.dismiss();
    const listObj = [];
    const catData = {
      vitalSubTypeId: vitalSubType.id,
      value: String(number),
    };
    listObj.push(catData);
    setLoader(true);
    const data = {
      vitalTypeId: vitalsData.id,
      source: OSSource,
      categoryData: listObj,
      createdSource: userProfileData.role === 'Patient' ? 1 : 2,
      dateCreated: moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss.SSS'),
    };
    console.log('addVitalDetails Data', data);
    VitalsService.addVital(data)
      .then(response => {
        setLoader(false);
        console.log('response');
        console.log(response);
        if (response && response.statusCode === 200) {
          navigation.pop();
        } else {
          showMessage({
            message: 'Information',
            description:
              'Authentication Failed. Provided information is not verified.',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('error');
        console.log(err);
        showMessage({
          message: 'Info',
          description: `value should be in the range of ${route.params.minRange} - ${route.params.maxRange}`,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }

  // const [wakeupTime, setwakeupTime] = React.useState('');
  // const [chosenDate, setChosenDate] = useState(new Date());

  return (
    // <View>
    //   <Text
    //     style={{
    //       alignSelf: 'center',
    //     }}>
    //     {route.params.heading}
    //   </Text>
    // </View>
    // <VitalsHeader
    //   navigation={navigation}
    //   headerName={route.params.heading}></VitalsHeader>
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <MainHeader navigation={navigation} name={route.params.heading}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.backgroundMainLogin,
            width: '90%',
            alignSelf: 'center',
          }}>
          {route.params.changeTextTitle === 'Sleep Time' ? (
            <View
              style={{
                marginTop: hp(5),
                flexDirection: 'column',
                // alignContent: 'space-between',
                // alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'row',
                  // alignContent: 'space-between',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {/* ///Uncomment this */}
                <Text>{route.params.changeTextTitle}</Text>
                <View>
                  <TouchableOpacity onPress={showDatePicker}>
                    <Text>{getCurrentDate(selectedSleepTime)}</Text>
                  </TouchableOpacity>
                  <CustomDatePicker
                    isVisible={isDatePickerVisible}
                    onDateChange={handleDateChange}
                    onCancel={handleCancel}
                  />
                </View>
              </View>
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'row',
                  // alignContent: 'space-between',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text>Wakeup Time</Text>
                {/* <TextInput
                  onChangeText={setwakeupTime}
                  value={wakeupTime}
                  placeholder="----"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.black}
                /> */}

                <View>
                  <TouchableOpacity onPress={showDatePickerWake}>
                    <Text>{getCurrentDate(selectedWakeTime)}</Text>
                  </TouchableOpacity>
                  <CustomDatePicker
                    isVisible={isDatePickerVisibleWakeTime}
                    onDateChange={handleDateChangeWakeTime}
                    onCancel={handleCancelWake}
                  />
                </View>
              </View>
            </View>
          ) : (
            <>
              <View
                style={{
                  marginTop: hp(5),
                  flexDirection: 'row',
                  // alignContent: 'space-between',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.noRecordFound,
                  }}>
                  {route.params.changeTextTitle}{' '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <TextInput
                    onChangeText={e => {
                      console.log('====================================');
                      console.log('e', e);
                      console.log('====================================');
                      handleTextChange(e);
                    }}
                    style={{
                      width: '60%',
                      textAlign: 'right',
                      color: Colors.noRecordFound,
                    }}
                    value={number}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.noRecordFound}
                  />
                  <Text
                    style={{
                      color: Colors.noRecordFound,
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2),
                      marginLeft: hp(0.5),
                    }}>
                    {route.params.unit}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  measureVitalCall();
                }}
                style={{
                  width: '100%',
                  backgroundColor: Colors.blueTextColor,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: hp(5),
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.5),
                    paddingVertical: hp(2),
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </MainHeader>
    </SafeAreaView>
  );
};

export default PulseRateEditScreen;

const styles = StyleSheet.create({});
