// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {connect, useDispatch, useSelector} from 'react-redux';
// import Slider from 'react-native-slider';
// import {Colors} from '../../../../config';
// import {SvgCss, SvgCssUri} from 'react-native-svg';
// import {
//   heightPercentageToDP as hp,
//   heightPercentageToDP,
// } from 'react-native-responsive-screen';
// import {Fonts, OSSource} from '../../../../config/AppConfig';
// import VitalsService from '../../../api/vitals';
// import {getVitalSubTypesData} from '../action/index';
// import moment from 'moment';
// import {showMessage} from 'react-native-flash-message';

// const VitalsMeasureCard = ({vitalData, setLoader, navigation, openModal}) => {
//   const [systolic, setSystolic] = useState(null);
//   const [diastolic, setDiastolic] = useState(null);
//   const [vitalSubTypeValue, setvitalSubTypeValue] = useState('');
//   const [textFieldValue, setTextFieldValue] = useState(null);
//   const [vitalSubTypes, setVitalSubTypes] = useState([]);
//   const [outOfRange, setOutOfRange] = useState(false);
//   const [outOfRangeError, setOutOfRangeError] = useState('');
//   const userProfileData = useSelector(state => state.userProfileData);
//   var outRange = false;

//   const dispatch = useDispatch();
//   useEffect(() => {
//     setLoader(true);
//     VitalsService.getVitalSubTypeData(vitalData.id)
//       .then(res => {
//         console.log('Vitals SubType Data');
//         console.log(res);
//         setLoader(false);
//         if (res.statusCode === 200) {
//           let sysVal = null;
//           let diasVal = null;
//           let val = null;
//           res.data.map(subType => {
//             if (vitalData.id === 1) {
//               if (subType.name.toLowerCase() === 'systolic') {
//                 setSystolic(subType.defaultValue);
//                 sysVal = subType.defaultValue;
//               } else if (subType.name.toLowerCase() === 'diastolic') {
//                 setDiastolic(subType.defaultValue);
//                 diasVal = subType.defaultValue;
//               }
//             } else {
//               val = subType.value === null ? subType.minRange : subType.value;
//               setTextFieldValue(subType.defaultValue);
//             }
//           });
//           if (vitalData.id === 1) {
//             setvitalSubTypeValue(`${sysVal}/${diasVal}`);
//           } else setvitalSubTypeValue(val);
//           setVitalSubTypes(res.data);
//           dispatch(getVitalSubTypesData(res.data));
//         }
//       })
//       .catch(err => {
//         setLoader(false);
//         console.log('Vitals Error');
//         showMessage({
//           message: 'Information',
//           description: err.message,
//           type: 'default',
//           icon: {icon: 'info', position: 'left'},
//           backgroundColor: Colors.red,
//         });
//       });
//   }, []);

//   const changeValue = value => {
//     console.log('====================================');
//     console.log('value', value);
//     console.log('====================================');
//   };

//   const onChangeTextFieldValue = (focuedField, value) => {
//     if (vitalData.id === 1) {
//       if (focuedField.name.toLowerCase() === 'systolic') {
//         setSystolic(value);
//         vitalSubTypes?.map(obj => {
//           if (obj.name === 'Systolic') {
//             if (
//               (value > obj.minRange && value <= obj.criticalMinRange) ||
//               (value < obj.maxRange && value > obj.criticalMaxRange)
//             ) {
//               obj.outOfRange = true;
//               setOutOfRange(true);
//               outRange = true;
//               console.log('====================================');
//               console.log('here in out Range', outRange);
//               console.log('====================================');

//               obj.outOfRangeError = 'This is critical value';
//               setOutOfRangeError('This is critical value');
//             } else {
//               obj.outOfRange = false;
//               setOutOfRange(false);
//               outRange = false;
//               obj.outOfRangeError = '';
//               setOutOfRangeError('');
//             }
//           }
//         });
//         setVitalSubTypes(vitalSubTypes);
//       } else if (focuedField.name.toLowerCase() === 'diastolic') {
//         setDiastolic(value);
//         vitalSubTypes.map(obj => {
//           if (obj.name === 'Diastolic') {
//             if (
//               (value > obj.minRange && value <= obj.criticalMinRange) ||
//               (value <= obj.maxRange && value >= obj.criticalMaxRange)
//             ) {
//               obj.outOfRange = true;
//               setOutOfRange(true);
//               outRange = true;
//               obj.outOfRangeError = 'This is critical value';
//               setOutOfRangeError('This is critical value');
//             } else {
//               obj.outOfRange = false;
//               setOutOfRange(false);
//               outRange = false;
//               obj.outOfRangeError = '';
//               setOutOfRangeError('');
//             }
//           }
//         });
//       }
//     } else {
//       setTextFieldValue(value);
//       vitalSubTypes.map(obj => {
//         if (
//           obj.criticalMinRange === obj.minRange &&
//           obj.criticalMaxRange === obj.maxRange
//         ) {
//           obj.outOfRange = false;
//           setOutOfRange(false);
//           outRange = false;
//           obj.outOfRangeError = '';
//           setOutOfRangeError('');
//         } else {
//           if (
//             (value > obj.minRange && value <= obj.criticalMinRange) ||
//             (value < obj.maxRange && value > obj.criticalMaxRange)
//           ) {
//             obj.outOfRange = true;
//             setOutOfRange(true);
//             outRange = true;
//             obj.outOfRangeError = 'This is critical value';
//             setOutOfRangeError('This is critical value');
//           } else {
//             obj.outOfRange = false;
//             setOutOfRange(false);
//             outRange = false;
//             obj.outOfRangeError = '';
//             setOutOfRangeError('');
//           }
//         }
//       });

//       setValueOfVitalSubType(vitalSubTypes);
//     }
//   };

//   const setValueOfVitalSubType = subType => {
//     if (vitalData.id === 1) {
//       if (subType.name.toLowerCase() === 'systolic') {
//         return systolic;
//       } else {
//         return diastolic;
//       }
//     } else {
//       return textFieldValue;
//     }
//   };

//   function getTypeValueWithID() {
//     const listObj = [];
//     if (vitalData.id === 1) {
//       if (
//         systolic === 0 ||
//         systolic === '0' ||
//         systolic === '' ||
//         diastolic === 0 ||
//         diastolic === '0' ||
//         diastolic === ''
//       ) {
//         showMessage({
//           message: 'Information',
//           description: 'Please enter value between range',
//           type: 'default',
//           icon: {icon: 'info', position: 'left'},
//           backgroundColor: Colors.red,
//         });
//       } else {
//         vitalSubTypes.map(obj => {
//           if (obj.id === 1 || obj.id === 2) {
//             console.log('if Executed', obj);
//             if (obj.name === 'Systolic') {
//               if (systolic < obj.minRange || systolic > obj.maxRange) {
//                 showMessage({
//                   message: 'Information',
//                   description: 'Please enter value between range',
//                   type: 'default',
//                   icon: {icon: 'info', position: 'left'},
//                   backgroundColor: Colors.red,
//                 });
//               } else {
//                 console.log('systolic else executed', obj);
//                 const data = {
//                   vitalSubTypeId: obj.id,
//                   value: String(systolic),
//                 };
//                 listObj.push(data);
//               }
//             } else if (obj.name === 'Diastolic') {
//               if (diastolic < obj.minRange || diastolic > obj.maxRange) {
//                 showMessage({
//                   message: 'Information',
//                   description: 'Please enter value between range',
//                   type: 'default',
//                   icon: {icon: 'info', position: 'left'},
//                   backgroundColor: Colors.red,
//                 });
//               } else {
//                 console.log('systolic else executed', obj);
//                 const data = {
//                   vitalSubTypeId: obj.id,
//                   value: String(diastolic),
//                 };
//                 listObj.push(data);
//               }
//             }
//             // else {
//             //         console.log('else executed', obj)
//             //         const data = {
//             //             vitalSubTypeId: obj.id,
//             //             value: obj.id === 1 ? String(systolic) : String(diastolic),
//             //         };
//             //         listObj.push(data);
//             //     }
//           }
//         });
//       }
//     } else {
//       if (
//         textFieldValue === 0 ||
//         textFieldValue === '0' ||
//         textFieldValue === ''
//       ) {
//         showMessage({
//           message: 'Information',
//           description: 'Please enter value between range',
//           type: 'default',
//           icon: {icon: 'info', position: 'left'},
//           backgroundColor: Colors.red,
//         });
//       } else {
//         vitalSubTypes.map(obj => {
//           if (textFieldValue < obj.minRange || textFieldValue > obj.maxRange) {
//             showMessage({
//               message: 'Information',
//               description: 'Please enter value between range',
//               type: 'default',
//               icon: {icon: 'info', position: 'left'},
//               backgroundColor: Colors.red,
//             });
//           } else {
//             const data = {
//               vitalSubTypeId: obj.id,
//               value: String(textFieldValue),
//             };
//             listObj.push(data);
//           }
//         });
//       }
//     }

//     return vitalData.id === 1 ? (listObj.length > 1 ? listObj : []) : listObj;
//   }

//   const addVitalHandler = () => {
//     console.log('====================================');
//     console.log('outOfRange', outOfRange);
//     console.log('====================================');
//     console.log('====================================');
//     console.log('out Range', outRange);
//     console.log('====================================');
//     // if (outOfRange === true) {
//     //     // showMessage({
//     //     //     message: 'Information',
//     //     //     description: outOfRangeError,
//     //     //     type: 'default',
//     //     //     icon: {icon: 'info', position: 'left'},
//     //     //     backgroundColor: Colors.red,
//     //     // });
//     //     Alert.alert(
//     //         outOfRangeError,
//     //         'Do you want to measure value',
//     //         [
//     //             {
//     //                 text: 'Ok',
//     //                 onPress: ()=> measureVitalCall(),
//     //             },
//     //             {
//     //                 text: 'Cancel',
//     //                 onPress: null,
//     //             },
//     //         ], // open store if update is needed.
//     //         {cancelable: false},
//     //     );
//     // } else {
//     measureVitalCall();
//     // }
//   };

//   function measureVitalCall() {
//     const categoryMeasurement = getTypeValueWithID();
//     if (categoryMeasurement.length) {
//       setLoader(true);
//       const data = {
//         vitalTypeId: vitalData.id,
//         source: OSSource,
//         categoryData: categoryMeasurement,
//         createdSource: userProfileData.role === 'Patient' ? 1 : 2,
//         dateCreated: moment(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss.SSS'),
//       };
//       console.log('addVitalDetails Data', data);
//       VitalsService.addVital(data)
//         .then(response => {
//           setLoader(false);
//           console.log('response');
//           console.log(response);
//           if (response && response.statusCode === 200) {
//             if (outOfRange) {
//               openModal();
//             } else {
//               navigation.pop();
//             }
//           } else {
//             showMessage({
//               message: 'Information',
//               description:
//                 'Authentication Failed. Provided information is not verified.',
//               type: 'default',
//               icon: {icon: 'info', position: 'left'},
//               backgroundColor: Colors.red,
//             });
//           }
//         })
//         .catch(err => {
//           setLoader(false);
//           console.log('error');
//           console.log(err);
//           showMessage({
//             message: 'Info',
//             description: err.message,
//             type: 'default',
//             icon: {icon: 'info', position: 'left'},
//             backgroundColor: Colors.red,
//           });
//         });
//     }
//   }

//   return (
//     <View
//       style={{
//         backgroundColor: Colors.white,
//         alignItems: 'center',
//         marginVertical: hp(2),
//         borderRadius: 8,
//         width: '100%',
//         alignSelf: 'center',
//         shadowOffset: {width: 0.5, height: 0.5},
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//         elevation: 10,
//       }}>
//       <View
//         style={{
//           width: '90%',
//           alignSelf: 'center',
//           marginVertical: hp(2),
//           flexDirection: 'row',
//           alignItems: 'center',
//         }}>
//         <SvgCssUri
//           width={30}
//           height={30}
//           uri={vitalData.icon + '?' + new Date()}
//           fill={vitalData.color}
//         />
//         <Text
//           style={{
//             fontFamily: Fonts.SourceSansRegular,
//             fontSize: hp(2.5),
//             marginLeft: hp(2),
//             color: Colors.black4,
//           }}>
//           {vitalData.name}
//         </Text>
//         <View
//           style={{
//             alignItems: 'flex-end',
//             flex: 1,
//             justifyContent: 'flex-end',
//           }}>
//           <Text
//             style={{
//               fontFamily: Fonts.SourceSansRegular,
//               fontSize: hp(2.5),
//               marginLeft: hp(2),
//               color: Colors.blueGrayDisableText,
//             }}>
//             {vitalData.unit}
//           </Text>
//           {/*<Text*/}
//           {/*  style={{*/}
//           {/*    fontFamily: Fonts.SourceSansRegular,*/}
//           {/*    fontSize: hp(2.5),*/}
//           {/*    marginLeft: hp(2),*/}
//           {/*  }}>*/}
//           {/*  {vitalSubTypeValue}*/}
//           {/*</Text>*/}
//         </View>
//       </View>
//       <View
//         style={{
//           borderWidth: 0.5,
//           borderColor: Colors.line,
//           width: '100%',
//         }}
//       />
//       <View style={{marginVertical: hp(2), width: '85%'}}>
//         {vitalSubTypes?.map((item, index) => {
//           if (item.name !== 'Medication Status') {
//             if (item.unit !== null) {
//               return (
//                 <>
//                   <View key={index}>
//                     <Text
//                       style={{
//                         fontFamily: Fonts.SourceSansRegular,
//                         fontSize: hp(2.5),
//                         marginBottom: hp(2),
//                         color: Colors.black,
//                       }}>
//                       {item.name}
//                     </Text>
//                     <TextInput
//                       onChangeText={e => onChangeTextFieldValue(item, e)}
//                       value={setValueOfVitalSubType(item).toString()}
//                       // defaultValue={60}
//                       style={{
//                         width: hp(10),
//                         borderWidth: 1,
//                         borderColor: Colors.textFieldGrey,
//                         fontFamily: Fonts.SourceSansRegular,
//                         marginBottom: hp(1),
//                         alignSelf: 'center',
//                         textAlign: 'center',
//                         color: Colors.black,
//                         height: hp(6),
//                       }}
//                       name={item.name}
//                       keyboardType={
//                         item.dataType === 1 ? 'number-pad' : 'decimal-pad'
//                       }
//                     />
//                     <Slider
//                       minimumTrackTintColor={Colors.sliderGrey}
//                       maximumTrackTintColor={Colors.sliderGrey}
//                       thumbImage={require('../../../../../assets/images/icon_slider.png')}
//                       thumbStyle={sliderStyle.thumb}
//                       thumbTintColor="#FFFFFF"
//                       trackStyle={sliderStyle.track}
//                       step={1}
//                       minimumValue={item.minRange}
//                       maximumValue={item.maxRange}
//                       onValueChange={e =>
//                         parseFloat(onChangeTextFieldValue(item, e))
//                       }
//                       style={{height: 30}}
//                       value={
//                         setValueOfVitalSubType(item) < item.minRange
//                           ? item.minRange
//                           : setValueOfVitalSubType(item) > item.maxRange
//                           ? item.maxRange
//                           : parseFloat(setValueOfVitalSubType(item))
//                       }
//                     />
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         width: '99%',
//                         alignSelf: 'center',
//                       }}>
//                       <Text
//                         style={{
//                           fontFamily: Fonts.SourceSansRegular,
//                           fontSize: hp(2),
//                           marginBottom: hp(2),
//                           color: Colors.blueGrayDisableText,
//                         }}>
//                         {item.minRange}
//                       </Text>
//                       <Text
//                         style={{
//                           fontFamily: Fonts.SourceSansRegular,
//                           fontSize: hp(2),
//                           marginBottom: hp(2),
//                           color: Colors.blueGrayDisableText,
//                         }}>
//                         {item.maxRange}
//                       </Text>
//                     </View>
//                   </View>
//                 </>
//               );
//             }
//           }
//         })}
//       </View>
//       <View
//         style={{
//           borderWidth: 0.5,
//           borderColor: Colors.line,
//           width: '100%',
//         }}
//       />
//       <View
//         style={{
//           flexDirection: 'row',
//           width: '100%',
//         }}>
//         <TouchableOpacity
//           style={{flex: 0.5, alignItems: 'center'}}
//           onPress={() =>
//             navigation.navigate('VitalHistory', {vitalData: vitalData})
//           }>
//           <Text
//             style={{
//               fontFamily: Fonts.SourceSansRegular,
//               fontSize: hp(2.5),
//               marginVertical: hp(2),
//               color: Colors.blueGrayDisableText,
//             }}>
//             History
//           </Text>
//         </TouchableOpacity>
//         {/*<View style={{height:'100%', width:1, backgroundColor: Colors.lineGreyLight}}></View>*/}
//         <TouchableOpacity
//           onPress={() => addVitalHandler()}
//           style={{flex: 0.5, alignItems: 'center'}}>
//           <Text
//             style={{
//               fontFamily: Fonts.SourceSansRegular,
//               fontSize: hp(2.5),
//               marginVertical: hp(2),
//               color: Colors.blueTextColor,
//             }}>
//             Measure
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// const sliderStyle = StyleSheet.create({
//   thumb: {
//     width: 30,
//     height: 30,
//     shadowColor: 'black',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.5,
//     shadowRadius: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 35 / 2,
//     elevation: 5,
//   },
//   track: {
//     height: hp(0),
//     borderRadius: 20,
//   },
// });

// export default VitalsMeasureCard;

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import Slider from 'react-native-slider';
import {Colors, Images, Svgs} from '../../../../config';
import {SvgCss, SvgCssUri} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
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

const VitalsMeasureCard = ({
  vitalData,
  setLoader,
  navigation,
  openModal,
  sliderValueParent,
  showLine,
}) => {
  const [systolic, setSystolic] = useState(null);
  const [diastolic, setDiastolic] = useState(null);
  const [vitalSubTypeValue, setvitalSubTypeValue] = useState('');
  const [textFieldValue, setTextFieldValue] = useState(null);
  const [vitalSubTypes, setVitalSubTypes] = useState([]);
  const [outOfRange, setOutOfRange] = useState(false);
  const [outOfRangeError, setOutOfRangeError] = useState('');
  const userProfileData = useSelector(state => state.userProfileData);
  // const [LoaderSlider, setLoaderSlider] = useState(false);
  var outRange = false;
  const [date, setdate] = useState(new Date());

  const [customValue, setCustomValue] = useState(sliderValueParent);

  const tempValue = 85;
  // const [tempValue, settempValue] = useState(85);
  function onValueChanged(value) {
    console.log('Outside');
    console.log('setting Temp');
    setCustomValue(value);
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
                sysVal = subType.defaultValue;
              } else if (subType.name.toLowerCase() === 'diastolic') {
                setDiastolic(subType.defaultValue);
                diasVal = subType.defaultValue;
              }
            } else {
              val = subType.value === null ? subType.minRange : subType.value;
              console.debug('This is the subtype Value');
              console.debug(subType.value);
              setTextFieldValue(subType.defaultValue);
              //Settings the vlaue for the slider
              // onValueChanged(subType.value);
              onValueChanged(subType.value);
              // LoaderSlider(false);
              // setCustomValue(subType.value);
            }
          });
          if (vitalData.id === 1) {
            setvitalSubTypeValue(`${sysVal}/${diasVal}`);
          } else setvitalSubTypeValue(val);
          setVitalSubTypes(res.data);
          setCustomValue(res.data[0].defaultValue);
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
    console.log('====================================');
    console.log('outOfRange', outOfRange);
    console.log('====================================');
    console.log('====================================');
    console.log('out Range', outRange);
    console.log('====================================');
    // if (outOfRange === true) {
    //     // showMessage({
    //     //     message: 'Information',
    //     //     description: outOfRangeError,
    //     //     type: 'default',
    //     //     icon: {icon: 'info', position: 'left'},
    //     //     backgroundColor: Colors.red,
    //     // });
    //     Alert.alert(
    //         outOfRangeError,
    //         'Do you want to measure value',
    //         [
    //             {
    //                 text: 'Ok',
    //                 onPress: ()=> measureVitalCall(),
    //             },
    //             {
    //                 text: 'Cancel',
    //                 onPress: null,
    //             },
    //         ], // open store if update is needed.
    //         {cancelable: false},
    //     );
    // } else {
    measureVitalCall();
    // }
  };

  function measureVitalCall() {
    const categoryMeasurement = getTypeValueWithID();
    if (categoryMeasurement.length) {
      setLoader(true);
      const data = {
        vitalTypeId: vitalData.id,
        source: OSSource,
        categoryData: categoryMeasurement,
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
  const TemperatureMeasureCard = (
    <View
      style={{
        // transform: [{rotate: '90deg'}],
        backgroundColor: Colors.white,
        alignItems: 'center',
        marginTop: hp(5),
        marginBottom: hp(3),
        borderRadius: 8,
        width: '100%',
        paddingVertical: hp(5.5),
        alignSelf: 'center',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
      }}>
      <View
        style={{
          transform: [{rotate: '90deg'}],

          // backgroundColor: Colors.white,
          alignItems: 'center',
          // marginTop: hp(0),
          // marginBottom: hp(3),
          borderRadius: 8,
          width: '100%',
          paddingVertical: hp(14),
          alignSelf: 'center',
          // paddingLeft:hp(-10),
          // shadowOffset: {width: 0.5, height: 0.5},
          // shadowOpacity: 0.05,
          // shadowRadius: 8,
          // elevation: 10,
          marginTop: hp(-10.5),
          marginLeft: hp(8),
        }}>
        <View
          style={{
            width: '100%',
            // paddingTop: -10,
            alignSelf: 'center',
            // marginBottom:-10,
            // marginVertical: hp(1),
            // alignItems: 'flex-start',
          }}>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2.5),
              // marginLeft: hp(2),
              color: Colors.black4,
            }}>
            H
          </Text>
        </View>

        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: hp(2),
            paddingTop: hp(2),
            // marginTop:hp(-3),
            paddingBottom: hp(2),
            width: '100%',
          }}>
          <CustomSliderTemperature
            sliderValue={customValue}
            setSliderValue={onValueChanged}
            vitalsSubTypesData={vitalSubTypes}
          />
          {this.showLine ? (
            <View>
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
                  onPress={() =>
                    navigation.navigate('VitalHistory', {vitalData: vitalData})
                  }>
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
                    {customValue === 50 ? 50 : customValue}
                  </Text>
                </TouchableOpacity>
                {/*<View style={{height:'100%', width:1, backgroundColor: Colors.lineGreyLight}}></View>*/}
                <TouchableOpacity
                  // onPress={() => addVitalHandler()}
                  onPress={() =>
                    navigation.navigate('VitalHistory', {vitalData: vitalData})
                  }
                  style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2.2),
                      // marginVertical: hp(2),
                      color: Colors.blueTextColor,
                    }}>
                    Kilogram
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View
                style={{
                  // backgroundColor: Colors.white,
                  // marginLeft: hp(1),
                  marginTop: hp(2.5),
                  // marginRight: hp(1),
                  borderWidth: 0.5,
                  borderColor: Colors.transparent,
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
                <TouchableOpacity>
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
                    {/* {customValue === 50 ? 50 : customValue} */}
                  </Text>
                </TouchableOpacity>
                {/*<View style={{height:'100%', width:1, backgroundColor: Colors.lineGreyLight}}></View>*/}
                <TouchableOpacity
                  // onPress={() => addVitalHandler()}
                  style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2.2),
                      // marginVertical: hp(2),
                      color: Colors.blueTextColor,
                    }}>
                    {/* Kilogram */}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
      <View>
        <View
          style={{
            zIndex: 1,
            width: '100%',
            alignSelf: 'center',
            marginVertical: hp(1),
            position: 'absolute',
            flexDirection: 'row',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'flex-start',
            marginTop: hp(-48.5),
          }}>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.7),
              marginLeft: hp(2),
              alignContent: 'center',
              alignSelf: 'center',
              color: Colors.darkgrey,
              fontWeight: '400',
              marginRight: hp(0.5),
            }}>
            Range
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
              {92}
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
        </View>
        <View>
          <SvgCss
            xml={Svgs.temperature_svg}
            width={hp(14.2)}
            height={hp(40)}
            fill={Colors.white}
            // onPress={() => this.props.navigation.pop()}
            style={{
              // transform: [{rotate: '0deg'}],
              marginTop: hp(-45),
              marginLeft: hp(-20),
              marginBottom: hp(-20),
            }}
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.7),
              position: 'absolute',
              marginLeft: hp(3.9),
              color: Colors.darkGrey,
              fontWeight: '600',
              // marginRight: hp(-10),
              // marginBottom:hp(-10),
              marginTop: hp(-11),
              // marginRight: hp(0.5),
            }}>
            °F
          </Text>
        </View>
      </View>
    </View>
  );

  return vitalData.id === 4 ? (
    // It IS Temperature
    TemperatureMeasureCard
  ) : (
    <View
      style={{
        backgroundColor: Colors.white,
        alignItems: 'center',
        marginTop: hp(2),
        marginBottom: hp(3),
        borderRadius: 8,
        width: '100%',
        alignSelf: 'center',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
      }}>
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          marginVertical: hp(1),
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(2.5),
            marginLeft: hp(2),
            color: Colors.black4,
          }}>
          H
        </Text>
      </View>

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
            onPress={() =>
              navigation.navigate('VitalHistory', {vitalData: vitalData})
            }>
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
              {customValue === 50 ? 50 : customValue}
            </Text>
          </TouchableOpacity>
          {/*<View style={{height:'100%', width:1, backgroundColor: Colors.lineGreyLight}}></View>*/}
          <TouchableOpacity
            // onPress={() => addVitalHandler()}
            onPress={() =>
              navigation.navigate('VitalHistory', {vitalData: vitalData})
            }
            style={{alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.2),
                // marginVertical: hp(2),
                color: Colors.blueTextColor,
              }}>
              Kilogram
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const sliderStyle = StyleSheet.create({
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
});

export default VitalsMeasureCard;
