import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  PanResponder,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Colors, Images, Svgs} from '../../../../config';
import {SvgCss} from 'react-native-svg';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Fonts, OSSource} from '../../../../config/AppConfig';
import VitalsService from '../../../api/vitals';
import {getVitalSubTypesData} from '../action/index';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import svgs from '../../../../config/Svgs';
import CalendarStrip from 'react-native-calendar-strip';
import images from '../../../../config/Images';

import CustomSliderWeight from '../../discover/screens/components/customSliderWeight';
import CustomSliderTemperature from '../../discover/screens/components/customSliderTemperature';
import CustomSliderHeight from '../../discover/screens/components/customSliderHeight';
import HeightTab from '../sub_components/vitals_height_tabs';
// import CustomHeightSlider from '../../discover/screens/components/customSliderHeight';
import CustomSliderBPSystolic from '../../discover/screens/components/customSliderBPSystolic';
import CustomSliderBPDiastolic from '../../discover/screens/components/customSliderBPDiastolic';
import CustomSliderHeightLeft from '../../discover/screens/components/customSliderHeightLeft';
import CustomSliderHeightCm from '../../discover/screens/components/customSliderHeightCm';
import CustomSliderWeightInLbs from '../../discover/screens/components/CustomSliderWeightInLbs';

const VitalsMeasureCard = ({
  vitalData,
  setLoader,
  navigation,
  openModal,
  sliderValueParent,
  sliderValueDiastolic,
  sliderValueSystolic,
  showLine,
  setIsScrollable,
  isScrollable,
}) => {
  const [systolic, setSystolic] = useState(null);
  const [diastolic, setDiastolic] = useState(null);
  const [vitalSubTypeValue, setvitalSubTypeValue] = useState('');
  const [textFieldValue, setTextFieldValue] = useState(null);
  const [vitalSubTypes, setVitalSubTypes] = useState([]);
  const [outOfRange, setOutOfRange] = useState(false);
  const [outOfRangeError, setOutOfRangeError] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const userProfileData = useSelector(state => state.userProfileData);
  const [index, setIndex] = useState(0);
  const [cmBtn, SetCmBtn] = useState(true);
  const [ftBtn, setFtBtn] = useState(false);
  const [kgBtn, SetKgBtn] = useState(true);
  const [lbsBtn, setLbsBtn] = useState(false);
  // const [LoaderSlider, setLoaderSlider] = useState(false);
  var outRange = false;
  const [date, setdate] = useState(new Date());
  console.log('====================================');
  console.log('sliderValueParent', sliderValueParent);
  console.log('====================================');

  const [customValue, setCustomValue] = useState();
  const [valueLbs, setValueLbs] = useState(sliderValueParent * 2.20462);
  console.log('====================================');
  console.log('valueLbs', valueLbs);
  console.log('====================================');

  /// States for Temperature
  const [temperatureValue, settemperatureValue] = useState();

  /// States for Height
  const [cmValue, setcmValue] = useState();
  const [feetValue, setfeetValue] = useState(getDecimalValuesBeforeDot());
  const [inchesValue, setinchesValue] = useState(getDecimalValues());

  const [sysValue, setSysValue] = useState(sliderValueSystolic);
  const [diastolicValue, setDiastolicValue] = useState(sliderValueDiastolic);
  // const [panResponder, setPanResponder] = useState(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: (event, gestureState) => {
  //       console.log('====================================');
  //       console.log('here in move responder list', gestureState);
  //       console.log('====================================');
  //       setIsScrollable(false);
  //       // Handle the dragging/panning here
  //     },
  //     onPanResponderGrant: (evt, gestureState) => {
  //       // The gesture has started. Show visual feedback so the user knows
  //       // what is happening!
  //       // gestureState.d{x,y} will be set to zero now
  //       setIsScrollable(false);
  //       console.log('====================================');
  //       console.log('here in grant list');
  //       console.log('====================================');
  //     },
  //     onPanResponderRelease: () => {
  //       console.log('====================================');
  //       console.log('in release list');
  //       console.log('====================================');
  //       // Handle the gesture release
  //       // setIsScrollable(true);
  //     },
  //   }),
  // );
  const tempValue = 85;
  const [selectedButton, setSelectedButton] = useState('left');

  // const [tempValue, settempValue] = useState(85);

  function getDecimalValuesBeforeDot(decimalValue) {
    // Convert decimalValue to a string to ensure consistency
    const decimalString = String(decimalValue);

    // Find the index of the decimal point
    const decimalIndex = decimalString.indexOf('.');

    // If decimal point exists
    if (decimalIndex !== -1) {
      // Extract the decimal values before the decimal point
      const decimalValues = decimalString.substring(0, decimalIndex);

      // Return the decimal values as a string
      return decimalValues;
    }

    // If no decimal point exists, return an empty string
    return '';
  }

  function getDecimalValues(decimalValue) {
    // Convert decimalValue to a string to ensure consistency
    const decimalString = String(decimalValue);

    // Find the index of the decimal point
    const decimalIndex = decimalString.indexOf('.');

    // If decimal point exists
    if (decimalIndex !== -1) {
      // Extract the decimal values after the decimal point
      const decimalValues = decimalString.slice(decimalIndex + 1);

      // Return the decimal values as a string
      return decimalValues;
    }

    // If no decimal point exists, return an empty string
    return '';
  }

  function onValueChanged(value) {
    console.log('Outside');
    console.log('setting Temp');
    setCustomValue(value);
    setValueLbs(value);
  }

  function onValueChangedTemperature(value) {
    console.log('Outside');
    console.log('setting Temp');
    settemperatureValue(value);
  }

  function onValueChangedCm(value) {
    console.log('Outside');
    console.log('setting Temp');
    setcmValue(value);
  }
  function onValueChangedFeet(value) {
    console.log('Outside');
    console.log('feet', value);
    setfeetValue(value);
  }
  function onValueChangedInches(value) {
    console.log('Outside');
    console.log('inches', value);
    setinchesValue(value);
  }

  function onValueChangedSystolic(value) {
    setSysValue(value);
  }
  function onValueChangedDiastolic(value) {
    setDiastolicValue(value);
  }

  const dispatch = useDispatch();
  useEffect(() => {
    setLoader(true);
    // setLoaderSlider(true);
    VitalsService.getVitalSubTypeData(vitalData.id)
      .then(res => {
        console.log('Vitals SubType Data');
        console.log(res);
        // LoaderSlider(false);
        if (res.statusCode === 200) {
          let sysVal = null;
          let diasVal = null;
          let val = null;
          setLoader(false);
          res.data.map(subType => {
            if (vitalData.id === 1) {
              if (subType.name.toLowerCase() === 'systolic') {
                setSystolic(subType.defaultValue);
                setSysValue(subType.defaultValue);
                sysVal = subType.defaultValue;
              } else if (subType.name.toLowerCase() === 'diastolic') {
                setDiastolic(subType.defaultValue);
                setDiastolicValue(subType.defaultValue);
                diasVal = subType.defaultValue;
              }
            } else {
              val = subType.value === null ? subType.minRange : subType.value;
              console.debug('This is the subtype Value');
              console.debug(subType.value);
              setTextFieldValue(subType.defaultValue);
              //Settings the vlaue for the slider
              // onValueChanged(subType.value);
              convertFeetToCm(parseFloat(subType.defaultValue));
              onValueChanged(subType.defaultValue);
              settemperatureValue(subType.defaultValue);
              let feetInches = parseFloat(subType.defaultValue).toFixed(1);
              console.log('====================================');
              console.log('feetInches', feetInches);
              console.log('====================================');
              feetInches = feetInches.split('.');
              console.log('====================================');
              console.log('feetInches after split', feetInches);
              console.log('====================================');
              setfeetValue(feetInches[0]);
              setinchesValue(feetInches[1]);
              // LoaderSlider(false);
              // setCustomValue(subType.value);
            }
          });
          if (vitalData.id === 1) {
            setvitalSubTypeValue(`${sysVal}/${diasVal}`);
          } else setvitalSubTypeValue(val);
          setVitalSubTypes(res.data);
          // setCustomValue(res.data[0].defaultValue);
          dispatch(getVitalSubTypesData(res.data));
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('Vitals Error');
        showMessage({
          message: 'Information',
          description: err.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }, []);

  function getTypeValueWithID() {
    const listObj = [];
    if (vitalData.id === 1) {
      if (
        systolic === 0 ||
        systolic === '0' ||
        systolic === '' ||
        diastolic === 0 ||
        diastolic === '0' ||
        diastolic === ''
      ) {
        showMessage({
          message: 'Information',
          description: 'Please enter value between range',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      } else {
        vitalSubTypes.map(obj => {
          if (obj.id === 1 || obj.id === 2) {
            console.log('if Executed', obj);
            if (obj.name === 'Systolic') {
              if (systolic < obj.minRange || systolic > obj.maxRange) {
                showMessage({
                  message: 'Information',
                  description: 'Please enter value between range',
                  type: 'default',
                  icon: {icon: 'info', position: 'left'},
                  backgroundColor: Colors.red,
                });
              } else {
                console.log('systolic else executed', obj);
                const data = {
                  vitalSubTypeId: obj.id,
                  value: String(systolic),
                };
                listObj.push(data);
              }
            } else if (obj.name === 'Diastolic') {
              if (diastolic < obj.minRange || diastolic > obj.maxRange) {
                showMessage({
                  message: 'Information',
                  description: 'Please enter value between range',
                  type: 'default',
                  icon: {icon: 'info', position: 'left'},
                  backgroundColor: Colors.red,
                });
              } else {
                console.log('systolic else executed', obj);
                const data = {
                  vitalSubTypeId: obj.id,
                  value: String(diastolic),
                };
                listObj.push(data);
              }
            }
            // else {
            //         console.log('else executed', obj)
            //         const data = {
            //             vitalSubTypeId: obj.id,
            //             value: obj.id === 1 ? String(systolic) : String(diastolic),
            //         };
            //         listObj.push(data);
            //     }
          }
        });
      }
    } else {
      if (
        textFieldValue === 0 ||
        textFieldValue === '0' ||
        textFieldValue === ''
      ) {
        showMessage({
          message: 'Information',
          description: 'Please enter value between range',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      } else {
        vitalSubTypes.map(obj => {
          if (textFieldValue < obj.minRange || textFieldValue > obj.maxRange) {
            showMessage({
              message: 'Information',
              description: 'Please enter value between range',
              type: 'default',
              icon: {icon: 'info', position: 'left'},
              backgroundColor: Colors.red,
            });
          } else {
            const data = {
              vitalSubTypeId: obj.id,
              value: String(textFieldValue),
            };
            listObj.push(data);
          }
        });
      }
    }

    return vitalData.id === 1 ? (listObj.length > 1 ? listObj : []) : listObj;
  }

  const addVitalHandler = () => {
    if (vitalData.id !== 10) {
      setIsScrollable(true);
    }
    console.log('====================================');
    console.log('outOfRange', outOfRange);
    console.log('====================================');
    console.log('====================================');
    console.log('out Range', outRange);
    console.log('====================================');
    measureVitalCall();
  };
  const addVitalHandlerLbs = () => {
    measureVitalCallLbs();
  };

  const addHeightHanlderCm = () => {
    measureVitalCallHeight();
  };

  function measureVitalCallHeight() {
    console.log('====================================');
    console.log(
      'decimal value',
      feetValue.toString() + '.' + inchesValue.toString(),
    );
    console.log('====================================');
    console.log('====================================');
    console.log('cmvalue', cmValue);
    console.log('====================================');
    ///IS Height
    if (vitalData.id === 9) {
      const listObj = [];
      const catData = {
        vitalSubTypeId: vitalSubTypes[0].id,
        value: cmBtn
          ? String(convertCmToFeet(cmValue))
          : feetValue.toString() + '.' + inchesValue.toString(),
      };
      console.log('This is the ');
      console.log(
        'This is the Height Data & vitalSubTypes' +
          catData.vitalSubTypeId +
          catData.value,
      );
      listObj.push(catData);
      setLoader(true);
      const data = {
        vitalTypeId: vitalData.id,
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
            setIsEditable(false);
            if (outOfRange) {
              openModal();
            } else {
              navigation.pop();
            }
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
            description: 'Out of range',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    }
  }

  function measureVitalCall() {
    if (vitalData.id === 1) {
      const listObj = [];
      const systolicData = {
        vitalSubTypeId: vitalSubTypes[1].id,
        value: String(diastolicValue),
      };
      const diastolicData = {
        vitalSubTypeId: vitalSubTypes[2].id,
        value: String(sysValue),
      };
      listObj.push(systolicData);
      listObj.push(diastolicData);
      setLoader(true);
      const data = {
        vitalTypeId: vitalData.id,
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
            setIsEditable(false);
            if (outOfRange) {
              openModal();
            } else {
              navigation.pop();
            }
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
            description: 'Out of range',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    }

    ///IS Temperature
    else if (vitalData.id === 4) {
      const listObj = [];
      const catData = {
        vitalSubTypeId: vitalSubTypes[0].id,
        value: String(temperatureValue),
      };
      listObj.push(catData);
      setLoader(true);
      const data = {
        vitalTypeId: vitalData.id,
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
            setIsEditable(false);
            if (outOfRange) {
              openModal();
            } else {
              navigation.pop();
            }
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
            description: err.message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    }
    ///IS Height
    else if (vitalData.id === 9) {
      const listObj = [];
      const catData = {
        vitalSubTypeId: vitalSubTypes[0].id,
        value: String(feetValue + '.' + inchesValue),
      };
      console.log(
        'This is the Cat Data & vitalSubTypes' + catData.vitalSubTypeId,
      );
      listObj.push(catData);
      setLoader(true);
      const data = {
        vitalTypeId: vitalData.id,
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
            setIsEditable(false);
            if (outOfRange) {
              openModal();
            } else {
              navigation.pop();
            }
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
            description: err.message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    } else if (vitalData.id === 10) {
      const listObj = [];
      const catData = {
        vitalSubTypeId: vitalSubTypes[0]?.id,
        value: String(customValue),
      };
      console.log(
        'This is the Cat Data & vitalSubTypes' + catData.vitalSubTypeId,
      );
      listObj.push(catData);
      setLoader(true);
      const data = {
        vitalTypeId: vitalData.id,
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
            setIsEditable(false);
            if (outOfRange) {
              openModal();
            } else {
              navigation.pop();
            }
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
            description: err.message,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    }
  }
  function measureVitalCallLbs() {
    const listObj = [];
    const catData = {
      vitalSubTypeId: vitalSubTypes[0].id,
      value: String(parseInt(valueLbs / 2.205)),
    };
    console.log(
      'This is the Cat Data & vitalSubTypes' + catData.vitalSubTypeId,
    );
    listObj.push(catData);
    setLoader(true);
    const data = {
      vitalTypeId: vitalData.id,
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
          setIsEditable(false);
          if (outOfRange) {
            openModal();
          } else {
            navigation.pop();
          }
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
          description: err.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  const TemperatureMeasureCard = (
    <View
      style={{
        backgroundColor: Colors.white,
        // alignItems: 'center',
        marginTop: hp(5),
        marginBottom: hp(3),
        borderRadius: 8,
        width: '100%',
        // paddingVertical: hp(5.5),
        // alignSelf: 'center',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
      }}>
      {/* Cm Ft and Edit Button */}
      <View
        style={{
          // zIndex: 1,
          // width: '100%',
          // alignSelf: 'center',
          flexDirection: 'row',
          // alignItems: 'stretch',
          // alignContent: 'space-between',
        }}>
        {/* Range and Degree Top Heading */}
        <View
          style={{
            // zIndex: 1,
            // width: '100%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2.5),
            marginLeft: hp(2),
            marginBottom: hp(1),
            flex: 0.5,
            // marginVertical: hp(1),
            // position: 'absolute',
            // flexDirection: 'row',
            // alignContent: 'center',
            // alignSelf: 'center',
            // alignItems: 'flex-start',
            // marginTop: hp(-48.5),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.7),
              // marginLeft: hp(2),
              alignContent: 'center',
              alignSelf: 'center',
              color: Colors.darkgrey,
              fontWeight: '400',
              marginRight: hp(0.5),
            }}>
            Range
          </Text>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2),
              alignContent: 'center',
              alignSelf: 'center',
              fontWeight: '600',
              marginRight: hp(0.5),
              color: Colors.black4,
            }}>
            {temperatureValue}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.8),
              marginLeft: hp(0),
              color: Colors.darkgrey,
              fontWeight: '400',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            °F
          </Text>
        </View>
        {/* Edite Button and Save */}
        <View
          style={{
            // transform: [{rotate: '90deg'}],

            // backgroundColor: Colors.white,
            alignItems: 'flex-end',
            // marginTop: hp(0),
            // marginBottom: hp(3),
            borderRadius: 8,
            // width: '100%',
            // paddingVertical: hp(14),
            alignSelf: 'center',
            flex: 0.5,
            // paddingLeft:hp(-10),
            // shadowOffset: {width: 0.5, height: 0.5},
            // shadowOpacity: 0.05,
            // shadowRadius: 8,
            // elevation: 10,
            // marginTop: hp(-10.5),
            // marginLeft: hp(8),
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                isScrollable ? setIsScrollable(false) : addVitalHandler();
              }}
              style={{
                width: '100%',
                alignSelf: 'center',
                marginVertical: hp(1),
                marginRight: hp(2.5),
                alignItems: 'flex-end',
              }}>
              {Platform.OS === 'android' ? (
                <Text
                  style={{
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.blueTextColor,
                  }}>
                  {isScrollable ? 'Edit' : 'Save'}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.blueTextColor,
                  }}>
                  {'Save'}
                </Text>
              )}
            </TouchableOpacity>
            {Platform.OS === 'android' && !isScrollable && (
              <TouchableOpacity
                onPress={() => {
                  setIsScrollable(true);
                }}
                style={{
                  marginVertical: hp(1),
                  marginRight: hp(2.5),
                }}>
                {Platform.OS === 'android' && (
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontFamily: Fonts.SourceSansRegular,
                      color: Colors.blueTextColor,
                    }}>
                    {!isScrollable && 'Cancel'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {/* )} */}
        </View>
      </View>

      {/* Height Guy & Slider */}
      <View
        style={{
          flexDirection: 'row',
          marginLeft: hp(2),
        }}>
        {/* SVG Height Guy */}
        <View>
          <SvgCss
            xml={Svgs.temperature_svg}
            width={hp(14.2)}
            height={hp(40)}
            fill={Colors.white}
            style={{
              marginTop: hp(3),
              // marginLeft: hp(-20),
              // marginBottom: hp(-20),
            }}
          />
        </View>
        {/* Custom Slider View */}
        <View
          style={{
            transform: [{rotate: '90deg'}],
            // backgroundColor: Colors.white,
            borderRadius: hp(2),
            ///This is actually RIGHT PADDING
            paddingTop: hp(20),
            ///This is actually RIGHT LEFT
            paddingLeft: hp(4),
            // paddingRight: hp(10),
            // marginTop:hp(-3),
            marginBottom: hp(2),
            width: '100%',
          }}>
          <CustomSliderTemperature
            sliderValue={temperatureValue}
            setSliderValue={onValueChangedTemperature}
            vitalsSubTypesData={vitalSubTypes}
            isEditable={true}
          />
        </View>
      </View>
      {/* F Bottom Button */}
      <View
        style={{
          // flexDirection: 'column',
          paddingBottom: hp(4),
          alignContent: 'flex-end',
          alignSelf: 'flex-end',
          paddingRight: hp(14),
          paddingTop: hp(1),
        }}>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.7),
            color: Colors.darkGrey,
            fontWeight: '600',
          }}>
          {temperatureValue} °F
        </Text>
      </View>
    </View>
  );

  const BloodPressureMeasureCard = (
    <View
      style={{
        backgroundColor: Colors.white,
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
        borderRadius: 8,
      }}>
      <View style={{alignItems: 'flex-end'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              isScrollable ? setIsScrollable(false) : addVitalHandler();
            }}
            style={{
              width: '100%',
              alignSelf: 'center',
              marginVertical: hp(1),
              marginRight: hp(2.5),
              alignItems: 'flex-end',
            }}>
            {Platform.OS === 'android' ? (
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.blueTextColor,
                }}>
                {isScrollable ? 'Edit' : 'Save'}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.blueTextColor,
                }}>
                {'Save'}
              </Text>
            )}
          </TouchableOpacity>
          {Platform.OS === 'android' && !isScrollable && (
            <TouchableOpacity
              onPress={() => {
                setIsScrollable(true);
              }}
              style={{
                marginVertical: hp(1),
                marginRight: hp(2.5),
              }}>
              {Platform.OS === 'android' && (
                <Text
                  style={{
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.blueTextColor,
                  }}>
                  {!isScrollable && 'Cancel'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        {/* )} */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '30%',
            marginLeft: hp(3),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: hp(1.5),
              height: hp(1.5),
              borderRadius: hp(2),
              backgroundColor: Colors.blueTextColor,
            }}
          />
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2),
              color: Colors.black,
              marginLeft: hp(1),
            }}>
            Systolic
          </Text>
        </View>
        <View
          style={{
            width: '30%',
            marginLeft: hp(3),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: hp(1.5),
              height: hp(1.5),
              borderRadius: hp(2),
              backgroundColor: Colors.red3,
            }}
          />
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2),
              color: Colors.black,
              marginLeft: hp(1),
            }}>
            Diastolic
          </Text>
        </View>
      </View>
      <View
        style={{
          // transform: [{rotate: '90deg'}],
          backgroundColor: Colors.white,
          // alignItems: 'center',
          width: '100%',
          paddingVertical: hp(5.5),
          flexDirection: 'row',
        }}>
        <View
          style={{
            transform: [{rotate: '-90deg'}],
            borderRadius: 8,
            width: '90%',
            paddingTop: hp(10),
            marginLeft: hp(-15),
            marginBottom: hp(-1),
          }}>
          <View
            style={{
              backgroundColor: Colors.white,
              width: '100%',
              marginTop: hp(10),
            }}>
            <CustomSliderBPSystolic
              sliderValue={sysValue}
              setSliderValue={onValueChangedSystolic}
              vitalsSubTypesData={vitalSubTypes}
              isEditable={true}
            />
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            marginLeft: hp(-2),
            borderColor: Colors.line,
            height: hp(36),
          }}
        />
        <View
          style={{
            transform: [{rotate: '90deg'}],
            borderRadius: 8,
            width: '90%',
            paddingTop: hp(22),
            marginBottom: hp(-1),
            paddingLeft: hp(-10),
          }}>
          <View
            style={{
              backgroundColor: Colors.white,
              width: '100%',
              // paddingLeft: hp(2),
            }}>
            <CustomSliderBPDiastolic
              sliderValue={diastolicValue}
              setSliderValue={onValueChangedDiastolic}
              vitalsSubTypesData={vitalSubTypes}
              isEditable={true}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          paddingHorizontal: hp(1),
          marginTop: hp(-2),
          marginBottom: hp(1),
        }}>
        <Text
          style={{
            fontFamily: Fonts.SourceSansBold,
            fontSize: hp(3),
            color: Colors.black,
          }}>
          {sysValue}/{diastolicValue}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(2),
            color: Colors.noRecordFound,
          }}>
          mm/hg
        </Text>
      </View>
    </View>
  );
  const WeightMeasureCard = (
    <View
      style={{
        backgroundColor: Colors.white,
        // alignItems: 'center',
        marginTop: hp(2),
        marginBottom: hp(3),
        borderRadius: 8,
        width: '100%',
        alignSelf: 'center',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 0,
      }}>
      <View
        style={{
          // zIndex: 1,
          // width: '100%',
          // alignSelf: 'center',
          flexDirection: 'row',
          // alignItems: 'stretch',
          alignContent: 'space-between',
          borderColor: 'red',
          borderWidth: 0,
        }}>
        {/* Range and Degree Top Heading */}
        {/* Buttons For the Android Start */}
        <View
          style={{
            // zIndex: 1,
            // width: '100%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            display: Platform.OS === 'ios' ? 'none' : 'flex',
            // marginVertical: hp(1),
            // position: 'absolute',
            // flexDirection: 'row',
            // alignContent: 'center',
            // alignSelf: 'center',
            // alignItems: 'flex-start',
            // marginTop: hp(-48.5),
          }}>
          {/* The CM and Feet buttons */}
          <View
            style={{
              width: '65%',
            }}>
            <View>
              <View
                style={{
                  // marginTop: hp(2),
                  alignItems: 'center',
                  marginVertical: hp(2),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: Colors.bleLayer4,
                    width: Platform.OS === 'ios' ? '67%' : hp(20),
                    borderRadius: hp(4),
                    borderColor: 'red',
                    borderWidth: 0,
                    marginLeft: hp(5),
                  }}>
                  <TouchableOpacity
                    style={{
                      // paddingHorizontal: hp(8),
                      // paddingVertical: hp(1.7),
                      minWidth: Platform.OS === 'ios' ? '40%' : '50%',
                      height: Platform.OS === 'android' ? hp(4) : hp(4),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: kgBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(4),
                      borderColor: 'green',
                      borderWidth: 0,
                    }}
                    onPress={() => {
                      SetKgBtn(true);
                      setLbsBtn(false);
                    }}>
                    <Text
                      style={{
                        color: kgBtn ? Colors.white : Colors.noRecordFound,
                      }}>
                      kg
                    </Text>
                    <View
                      style={{
                        position: 'absolute',
                        right: Platform.OS === 'ios' ? '30%' : '30%',
                        top: '20%',
                        // backgroundColor: colors.badgeGreen,
                        borderRadius: hp(4),
                        width: 5,
                        height: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* <TabAssessmentCount tintColor={Colors.redBorder} /> */}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      minWidth: Platform.OS === 'ios' ? '40%' : '50%',
                      height: Platform.OS === 'android' ? hp(4) : hp(4),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: lbsBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(4),
                      shadowRadius: 5,
                      marginLeft: Platform.OS === 'ios' ? hp(0) : hp(0),
                      borderWidth: 0,
                      borderColor: 'blue',
                    }}
                    onPress={() => {
                      SetKgBtn(false);
                      setLbsBtn(true);
                    }}>
                    <Text
                      style={{
                        color: lbsBtn ? Colors.white : Colors.noRecordFound,
                      }}>
                      lbs
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View
                style={{
                  //   height: Platform.OS === 'ios' ? '83.5%' : '84.5%',
                  marginTop: hp(2),
                }}>
                {cmBtn ? <View></View> : <View></View>}
              </View> */}
            </View>
            {/* <HeightTab navigation={navigation} /> */}
          </View>

          {/* ------------ */}
        </View>
        {/* Buttons For the Android End */}
        <View
          style={{
            // zIndex: 1,
            // width: '100%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            display: Platform.OS === 'ios' ? 'flex' : 'none',
            // marginVertical: hp(1),
            // position: 'absolute',
            // flexDirection: 'row',
            // alignContent: 'center',
            // alignSelf: 'center',
            // alignItems: 'flex-start',
            // marginTop: hp(-48.5),
          }}>
          {/* The CM and Feet buttons */}
          <View
            style={{
              width: '65%',
            }}>
            <View>
              <View
                style={{
                  // marginTop: hp(2),
                  alignItems: 'center',
                  marginVertical: hp(2),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: Colors.bleLayer4,
                    width: Platform.OS === 'ios' ? '67%' : hp(20),
                    borderRadius: hp(4),
                  }}>
                  <TouchableOpacity
                    style={{
                      // paddingHorizontal: hp(8),
                      // paddingVertical: hp(1.7),
                      minWidth: Platform.OS === 'ios' ? '40%' : hp('23%'),
                      height: Platform.OS === 'android' ? hp(4) : hp(4),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: kgBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(4),
                    }}
                    onPress={() => {
                      SetKgBtn(true);
                      setLbsBtn(false);
                    }}>
                    <Text
                      style={{
                        color: kgBtn ? Colors.white : Colors.noRecordFound,
                      }}>
                      kg
                    </Text>
                    <View
                      style={{
                        position: 'absolute',
                        right: Platform.OS === 'ios' ? '30%' : '30%',
                        top: '20%',
                        // backgroundColor: colors.badgeGreen,
                        borderRadius: hp(4),
                        width: 5,
                        height: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* <TabAssessmentCount tintColor={Colors.redBorder} /> */}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      minWidth: Platform.OS === 'ios' ? '40%' : hp('23%'),
                      height: Platform.OS === 'android' ? hp(4) : hp(4),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: lbsBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(4),
                      shadowRadius: 5,
                      marginLeft: Platform.OS === 'ios' ? hp(0) : hp(0),
                    }}
                    onPress={() => {
                      SetKgBtn(false);
                      setLbsBtn(true);
                    }}>
                    <Text
                      style={{
                        color: lbsBtn ? Colors.white : Colors.noRecordFound,
                      }}>
                      lbs
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View
                style={{
                  //   height: Platform.OS === 'ios' ? '83.5%' : '84.5%',
                  marginTop: hp(2),
                }}>
                {cmBtn ? <View></View> : <View></View>}
              </View> */}
            </View>
            {/* <HeightTab navigation={navigation} /> */}
          </View>

          {/* ------------ */}
        </View>
        {/* Edite Button and Save */}
        <View
          style={{
            // transform: [{rotate: '90deg'}],

            // backgroundColor: Colors.white,
            alignItems: 'center',
            // marginTop: hp(0),
            // marginBottom: hp(3),
            borderRadius: 8,
            width: '50%',
            marginLeft: hp(0),
            // paddingVertical: hp(14),
            alignSelf: 'center',
            // paddingLeft:hp(-10),
            // shadowOffset: {width: 0.5, height: 0.5},
            // shadowOpacity: 0.05,
            // shadowRadius: 8,
            // elevation: 10,
            // marginTop: hp(-10.5),
            // marginLeft: hp(8),
          }}>
          <TouchableOpacity
            onPress={() => {
              if (kgBtn) {
                addVitalHandler();
              } else {
                addVitalHandlerLbs();
              }
            }}
            style={
              {
                // transform: [{rotate: '270deg'}],
                // width: '100%',
                // alignSelf: 'center',
                // marginVertical: hp(1),
                // marginRight: hp(2.5),
                // alignItems: 'flex-end',
              }
            }>
            <Text
              style={{
                fontSize: hp(2),

                // position: 'absolute',
                // zIndex:1,
                // marginTop: hp(-20.5),
                // marginLeft: hp(0.2),
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.blueTextColor,
              }}>
              Save
            </Text>
          </TouchableOpacity>
          {/* )} */}
        </View>
      </View>
      {kgBtn ? (
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: hp(2),
            paddingTop: hp(2),
            paddingBottom: hp(2),
            width: '100%',
          }}>
          <CustomSliderWeight
            sliderValue={customValue}
            setSliderValue={onValueChanged}
            vitalsSubTypesData={vitalSubTypes}
            isEditable={true}
            kgBtn={true}
          />

          <View
            style={{
              // backgroundColor: Colors.white,
              // marginLeft: hp(1),
              marginTop: hp(2.5),
              // marginRight: hp(1),
              borderWidth: 0.5,
              borderColor: Colors.line,
              width: '100%',
              shadowOffset: {width: 0.1, height: 3},
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 20,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              // height: '20%',
              // width: '100%',
            }}>
            <TouchableOpacity
            // style={{flex: 0.5, alignItems: 'center'}}
            // onPress={() =>
            //   navigation.navigate('VitalHistory', {vitalData: vitalData})
            // }
            >
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.8),
                  marginTop: hp(2),
                  color: Colors.black,
                  fontWeight: 'bold',
                }}>
                {/* {customValue === 50 ? tempValue : customValue} */}
                {/* {customValue === 1 ? 85 : customValue === 50 ? 50 : customValue} */}
                {customValue}
              </Text>
            </TouchableOpacity>
            {/*<View style={{height:'100%', width:1, backgroundColor: Colors.lineGreyLight}}></View>*/}
            <TouchableOpacity
              // onPress={() => addVitalHandler()}
              // onPress={() =>
              //   navigation.navigate('VitalHistory', {vitalData: vitalData})
              // }
              style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.2),
                  // marginVertical: hp(2),
                  color: Colors.blueGrayDisableText,
                }}>
                Kilogram
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: hp(2),
            paddingTop: hp(2),
            paddingBottom: hp(2),
            width: '100%',
          }}>
          <CustomSliderWeightInLbs
            sliderValue={valueLbs}
            setSliderValue={onValueChanged}
            vitalsSubTypesData={vitalSubTypes}
            isEditable={true}
            kgBtn={false}
          />

          <View
            style={{
              // backgroundColor: Colors.white,
              // marginLeft: hp(1),
              marginTop: hp(2.5),
              // marginRight: hp(1),
              borderWidth: 0.5,
              borderColor: Colors.line,
              width: '100%',
              shadowOffset: {width: 0.1, height: 3},
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 20,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              // height: '20%',
              // width: '100%',
            }}>
            <TouchableOpacity
            // style={{flex: 0.5, alignItems: 'center'}}
            // onPress={() =>
            //   navigation.navigate('VitalHistory', {vitalData: vitalData})
            // }
            >
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.8),
                  marginTop: hp(2),
                  color: Colors.black,
                  fontWeight: 'bold',
                }}>
                {/* {customValue === 50 ? tempValue : customValue} */}
                {/* {customValue === 1 ? 85 : customValue === 50 ? 50 : customValue} */}
                {valueLbs}
              </Text>
            </TouchableOpacity>
            {/*<View style={{height:'100%', width:1, backgroundColor: Colors.lineGreyLight}}></View>*/}
            <TouchableOpacity
              // onPress={() => addVitalHandler()}
              // onPress={() =>
              //   navigation.navigate('VitalHistory', {vitalData: vitalData})
              // }
              style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.2),
                  // marginVertical: hp(2),
                  color: Colors.blueGrayDisableText,
                }}>
                lbs
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const handleLeftButtonPress = () => {
    setSelectedButton('left');
    onLeftButtonPress();
  };

  const handleRightButtonPress = () => {
    setSelectedButton('right');
    onRightButtonPress();
  };
  const convertCmToFeet = cm => {
    const feetPerCm = 0.0328084; // 1 cm = 0.0328084 feet
    const feet = cm * feetPerCm;
    return parseFloat(feet.toFixed(2));
  };

  const convertFeetToCm = feet => {
    const cmPerFeet = 30.48; // 1 foot = 30.48 cm
    let cm = feet * cmPerFeet;
    cm = cm + 1;
    setcmValue(cm.toFixed(0));
    console.log('====================================');
    console.log('cm in Height', parseFloat(cm.toFixed(1)));
    console.log('====================================');
    return parseFloat(cm.toFixed(1));
  };

  const HeightCard = (
    <View
      style={{
        backgroundColor: Colors.white,
        // alignItems: 'center',
        marginTop: hp(5),
        marginBottom: hp(3),
        borderRadius: 8,
        width: '100%',
        // paddingVertical: hp(5.5),
        // alignSelf: 'center',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
      }}>
      {/* Cm Ft and Edit Button */}
      <View
        style={{
          // zIndex: 1,
          // width: '100%',
          // alignSelf: 'center',
          flexDirection: 'row',
          paddingTop: Platform.OS === 'ios' ? hp(0) : hp(2.5),
        }}>
        {/* ======================= Feet and CM Selection for android(Danish) =========================== */}
        <View
          style={{
            display: Platform.OS === 'ios' ? 'none' : 'flex',
            alignItems: 'flex-start',
            paddingLeft: hp(2.5),
            paddingRight: hp(2),
            flex: 0.5,
          }}>
          {/* Wrapper View Start */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              borderColor: 'green',
              borderWidth: 0,
              backgroundColor: Colors.bleLayer4,
              borderRadius: hp(4),
            }}>
            <TouchableOpacity
              onPress={() => {
                SetCmBtn(true);
                setFtBtn(false);
              }}
              style={{
                paddingVertical: hp(0.65),
                width: '50%',
                borderColor: 'blue',
                borderWidth: 0,
                borderRadius: hp(4),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: cmBtn
                  ? Colors.blueTextColor
                  : Colors.bleLayer4,
              }}>
              <Text
                style={{color: cmBtn ? Colors.white : Colors.noRecordFound}}>
                cm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFtBtn(true);
                SetCmBtn(false);
              }}
              style={{
                paddingVertical: hp(0.65),
                width: '50%',
                borderColor: 'green',
                borderWidth: 0,
                borderRadius: hp(4),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: ftBtn
                  ? Colors.blueTextColor
                  : Colors.bleLayer4,
              }}>
              <Text
                style={{color: ftBtn ? Colors.white : Colors.noRecordFound}}>
                ft
              </Text>
            </TouchableOpacity>
          </View>
          {/* Wrapper View End */}
        </View>
        {/* ======================= Feet and CM Selection for android (Danish) =========================== */}
        {/* ======================================== Component for IOS ========================*/}
        {/* Range and Degree Top Heading */}
        <View
          style={{
            // zIndex: 1,
            // width: '100%',
            display: Platform.OS === 'ios' ? 'flex' : 'none',
            justifyContent: 'space-between',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2.5),
            marginLeft: hp(2),
            marginBottom: hp(1),
            borderColor: 'blue',

            // marginVertical: hp(1),
            // position: 'absolute',
            // flexDirection: 'row',
            // alignContent: 'center',
            // alignSelf: 'center',
            // alignItems: 'flex-start',
            // marginTop: hp(-48.5),
          }}>
          {/* The CM and Feet buttons */}
          <View
            style={{
              width: '65%',
              borderColor: 'red',
              borderWidth: 0,
            }}>
            <View>
              <View
                style={{
                  // marginTop: hp(2),
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: Colors.bleLayer4,
                    width: Platform.OS === 'ios' ? '67%' : hp(20),
                    borderRadius: hp(4),
                  }}>
                  <TouchableOpacity
                    style={{
                      // paddingHorizontal: hp(8),
                      // paddingVertical: hp(1.7),
                      minWidth: Platform.OS === 'ios' ? '50%' : hp('23%'),
                      height: Platform.OS === 'android' ? hp(4) : hp(4),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: cmBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(4),
                    }}
                    onPress={() => {
                      SetCmBtn(true);
                      setFtBtn(false);
                    }}>
                    <Text
                      style={{
                        color: cmBtn ? Colors.white : Colors.noRecordFound,
                      }}>
                      cm
                    </Text>
                    <View
                      style={{
                        position: 'absolute',
                        right: Platform.OS === 'ios' ? '30%' : '30%',
                        top: '20%',
                        // backgroundColor: colors.badgeGreen,
                        borderRadius: hp(4),
                        width: 5,
                        height: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* <TabAssessmentCount tintColor={Colors.redBorder} /> */}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      minWidth: Platform.OS === 'ios' ? '48%' : hp('23%'),
                      height: Platform.OS === 'android' ? hp(4) : hp(4),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: ftBtn
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                      borderRadius: hp(4),
                      shadowRadius: 5,
                      marginLeft: Platform.OS === 'ios' ? hp(0) : hp(0),
                    }}
                    onPress={() => {
                      setFtBtn(true);
                      SetCmBtn(false);
                    }}>
                    <Text
                      style={{
                        color: ftBtn ? Colors.white : Colors.noRecordFound,
                      }}>
                      ft
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View
                style={{
                  //   height: Platform.OS === 'ios' ? '83.5%' : '84.5%',
                  marginTop: hp(2),
                }}>
                {cmBtn ? <View></View> : <View></View>}
              </View> */}
            </View>
            {/* <HeightTab navigation={navigation} /> */}
          </View>

          {/* ------------ */}
        </View>
        {/* ==================================================== Component For IOS End ================= */}
        {/* Edite Button and Save */}
        <View
          style={{
            // transform: [{rotate: '90deg'}],

            // backgroundColor: Colors.white,
            alignItems: 'flex-end',
            // marginTop: hp(0),
            // marginBottom: hp(3),
            borderRadius: 8,
            flex: 0.5,
            // paddingVertical: hp(14),
            alignSelf: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                isScrollable ? setIsScrollable(false) : addHeightHanlderCm();
              }}
              style={{
                width: '100%',
                alignSelf: 'center',
                marginVertical: hp(1),
                marginRight: hp(2.5),
                alignItems: 'flex-end',
              }}>
              {Platform.OS === 'android' ? (
                <Text
                  style={{
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.blueTextColor,
                  }}>
                  {isScrollable ? 'Edit' : 'Save'}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.blueTextColor,
                  }}>
                  {'Save'}
                </Text>
              )}
            </TouchableOpacity>
            {Platform.OS === 'android' && !isScrollable && (
              <TouchableOpacity
                onPress={() => {
                  setIsScrollable(true);
                }}
                style={{
                  marginVertical: hp(1),
                  marginRight: hp(2.5),
                }}>
                {Platform.OS === 'android' && (
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontFamily: Fonts.SourceSansRegular,
                      color: Colors.blueTextColor,
                    }}>
                    {!isScrollable && 'Cancel'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {/* )} */}
        </View>
      </View>

      {/* HEIGHT SLIDER AND BOTTOM FEET TEXT PUT CONDITION */}
      {cmBtn ? (
        <View
          style={{
            borderColor: 'green',
            borderWidth: 0,
          }}>
          {/* Height Guy & Slider */}
          <View
            style={{
              flexDirection: 'row',
              marginLeft: hp(2),
              borderColor: 'red',
              borderWidth: 0,
            }}>
            {/* SVG Height Guy */}
            <View
              style={{borderColor: 'blue', borderWidth: 0}}
              onTouchCancel={() => {
                console.log('====================================');
                console.log('on Touch cancel');
                console.log('====================================');
              }}
              onTouchMove={() => {
                console.log('====================================');
                console.log('on Touch Move');
                console.log('====================================');
              }}>
              <SvgCss
                xml={Svgs.man_vector}
                width={hp(14.2)}
                height={hp(40)}
                fill={Colors.white}
                style={{
                  marginTop: hp(3),
                  // marginLeft: hp(-20),
                  // marginBottom: hp(-20),
                }}
              />
            </View>
            {/* Custom Slider View */}
            <View
              style={{
                transform: [{rotate: '90deg'}],
                // backgroundColor: Colors.white,
                borderRadius: hp(2),
                ///This is actually RIGHT PADDING
                paddingTop: hp(20),
                ///This is actually RIGHT LEFT
                paddingLeft: hp(4),
                // paddingRight: hp(10),
                // marginTop:hp(-3),
                marginBottom: hp(2),
                width: '100%',
                borderColor: 'green',
                borderWidth: 0,
              }}>
              <CustomSliderHeightCm
                sliderValue={
                  cmValue === sliderValueParent
                    ? convertFeetToCm(cmValue)
                    : cmValue
                }
                setSliderValue={onValueChangedCm}
                vitalsSubTypesData={vitalSubTypes}
                isEditable={true}
              />
            </View>
          </View>
          {/* F Bottom Button */}
          <View
            style={{
              // flexDirection: 'column',
              alignContent: 'center',
              alignSelf: 'center',
              paddingTop: hp(2),
              paddingBottom: hp(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.7),
                alignSelf: 'center',
                // marginLeft: hp(3.9),
                color: Colors.black,
                fontWeight: '600',
                // marginTop: hp(-11),
              }}>
              {cmValue === sliderValueParent
                ? convertFeetToCm(cmValue)
                : cmValue}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(1.7),
                color: Colors.blueGrayDisableText,
                alignSelf: 'center',
                fontWeight: '600',
                // marginTop: hp(-11),
              }}>
              cm
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            zIndex: 1,
          }}>
          <View
            style={{
              transform: [{rotate: '270deg'}],
              position: 'absolute',
              // width: '100%',
              marginTop: hp(20),
              marginLeft: hp(-12),

              // marginTop: hp(5),
            }}>
            <CustomSliderHeightLeft
              sliderValue={feetValue}
              setSliderValue={onValueChangedFeet}
              vitalsSubTypesData={vitalSubTypes}
              isEditable={true}
            />
          </View>

          {/* Height Guy & Slider */}
          <View
            style={{
              flexDirection: 'row',
              marginLeft: hp(13),
            }}>
            {/* SVG Height Guy */}
            <View>
              <SvgCss
                xml={Svgs.man_vector}
                width={hp(14.2)}
                height={hp(40)}
                fill={Colors.white}
                style={{
                  marginTop: hp(3),
                }}
              />
            </View>
            {/* Custom Slider View */}
            <View
              style={{
                transform: [{rotate: '90deg'}],
                // backgroundColor: Colors.white,
                borderRadius: hp(2),
                ///This is actually RIGHT PADDING
                paddingTop: hp(22),
                ///This is actually RIGHT LEFT
                // paddingLeft: hp(0),
                // paddingRight: hp(10),
                // marginTop:hp(-3),
                marginBottom: hp(2),
                width: '100%',
              }}>
              <CustomSliderHeight
                sliderValue={inchesValue}
                setSliderValue={onValueChangedInches}
                vitalsSubTypesData={vitalSubTypes}
                isEditable={true}
              />
            </View>
          </View>
          {/* F Bottom Button */}
          <View
            style={{
              // flexDirection: 'column',
              alignContent: 'center',
              alignSelf: 'center',
              paddingTop: hp(2),
              paddingBottom: hp(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.7),
                alignSelf: 'center',
                // marginLeft: hp(3.9),
                color: Colors.black,
                fontWeight: '600',
                // marginTop: hp(-11),
              }}>
              {feetValue}.{inchesValue}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.7),
                alignSelf: 'center',
                // marginLeft: hp(3.9),
                color: Colors.black,
                fontWeight: '600',
                // marginTop: hp(-11),
              }}></Text>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(1.7),
                color: Colors.blueGrayDisableText,
                alignSelf: 'center',
                fontWeight: '600',
                // marginTop: hp(-11),
              }}>
              Feet/Inch
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  ////////////////////////
  return vitalData.id === 4
    ? // It IS Temperature
      TemperatureMeasureCard
    : vitalData.id === 9
    ? // It IS Height
      HeightCard
    : vitalData.id === 10
    ? WeightMeasureCard
    : BloodPressureMeasureCard;
};
const styles = StyleSheet.create({
  thumb: {
    width: 20,
    height: 10,
    transform: [{rotate: '360deg'}],
    // padding: hp(14),
    // marginBottom:100,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35 / 2,
    elevation: 5,
    color: Colors.transparent,
  },
  track: {
    height: hp(0),
    borderRadius: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'white',
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: 'blue',
  },
  unselectedButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#369',
    overflow: 'hidden',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  indicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0084ff',
    margin: 6,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default VitalsMeasureCard;
