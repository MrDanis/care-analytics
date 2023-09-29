
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
import {Colors, Images} from '../../../../config';
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
import CustomSliderWeight from '../../discover/screens/components/customSliderWeight';
import LineGaugeVertical from '../../discover/screens/components/src_ruler_gauge/LineGuageVertical';

const VitalsMeasureCardBloodPressure = ({
  vitalData,
  setLoader,
  navigation,
  openModal,
  sliderValueParent,
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
  // const [LoaderSlider, setLoaderSlider] = useState(false);
  var outRange = false;
  const [date, setdate] = useState(new Date());

  const [customValue, setCustomValue] = useState(0);

  const tempValue = 85;
  // const [tempValue, settempValue] = useState(85);
  function onValueChanged(value) {
    console.log('Outside');
    setCustomValue(value);
  }
  // const RNSliderRuler = Platform.OS === 'ios' ? RNScrollRuler : RNScrollRuler;

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
    // const categoryMeasurement = getTypeValueWithID();
    const listObj = [];
    const catData = {
      vitalSubTypeId: vitalSubTypes[0].id,
      value: String(customValue),
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
  return (
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
      {!isEditable ? (
        <TouchableOpacity
          onPress={() => setIsEditable(true)}
          style={{
            width: '100%',
            alignSelf: 'center',
            marginVertical: hp(1),
            marginRight: hp(2.5),
            alignItems: 'flex-end',
          }}>
          <Image
            source={Images.edit_assessment}
            style={{width: hp(2.5), height: hp(2.5)}}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            addVitalHandler();
          }}
          style={{
            width: '100%',
            alignSelf: 'center',
            marginVertical: hp(1),
            marginRight: hp(2.5),
            alignItems: 'flex-end',
          }}>
          <Text
            style={{
              fontSize: hp(2),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.blueTextColor,
            }}>
            Save
          </Text>
        </TouchableOpacity>
      )}

      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: hp(2),
          paddingTop: hp(2),
          paddingBottom: hp(2),
          width: '100%',
        }}>
        <LineGaugeVertical
          min={0}
          max={250}
          // value={sliderValue}
          // onChange={setSliderValue}
          isEditable={isEditable}
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
              {customValue === 50 ? 50 : customValue}
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

export default VitalsMeasureCardBloodPressure;
