/* istanbul ignore file */
import React, {Fragment, useEffect, useState, useCallback, useRef} from 'react';
import {
  Text,
  Keyboard,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  SafeAreaView,
  BackHandler,
  Alert,
  StyleSheet,
  Image,
  PermissionsAndroid,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import ArrowHeadLeft from '../../../../../assets/svg/icon_arrow_left.svg';
import {baseUrl, CURRENT_TARGET, Fonts} from '../../../../config/AppConfig';
// import { Avatar } from "@rneui/themed";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import FastImage from 'react-native-fast-image';
import images from '../../../../config/Images';
import svgs from '../../../../config/Svgs';
import {SvgCss} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import Images from '../../../../config/Images';
import {AttachmentHelper} from '../../../helpers/AttachmentHelper';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {Modalize} from 'react-native-modalize';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {getUserProfile} from '../action';
import {connect, useDispatch, useSelector} from 'react-redux';
import ProfileService from '../../../api/profile';
import {NavigationActions} from 'react-navigation';
import DatePicker from 'react-native-date-picker'
import {
  checkCameraPermission,
  requestMicCameraPermission,
} from '../../../helpers/Common';
import {TextInputMask} from 'react-native-masked-text';
const EditProfileScreen = ({navigation, route}) => {
  // const patientData = '';
  // const screenName = '';
  const {profileDetails, screenName} = route.params;
  console.log('====================================');
  console.log('screenName', screenName);
  console.log('====================================');
  const [isStartDate, setIsStartDate] = useState(false);
  const [patientData, setPatientData] = useState(profileDetails);
  const [screenname, setScreenName] = useState(screenName);
  const [isCamera, setIsCamera] = useState(false);
  const [androidDate, setandroidDate] = useState(false);
  const modalizeRef = useRef();
  const dispatch = useDispatch();
  let attachmentHelper = AttachmentHelper.sharedInstance();
  const [email, set_email] = useState(
    Object.keys(patientData).length > 0
      ? patientData.email !== ''
        ? patientData.email
        : ''
      : '',
  );
  const [firstName, set_FirstName] = useState(
    Object.keys(patientData).length > 0
      ? patientData.firstName !== ''
        ? patientData.firstName
        : ''
      : '',
  );
  const [lastName, set_lastName] = useState(
    Object.keys(patientData).length > 0
      ? patientData.lastName !== ''
        ? patientData.lastName
        : ''
      : '',
  );
  const [mrn, set_mrn] = useState(
    Object.keys(patientData).length > 0
      ? patientData.referenceNumber !== ''
        ? patientData.referenceNumber
        : ''
      : '',
  );
  const [open, set_open] = useState(null);
  const [address, set_address] = useState(
    Object.keys(patientData).length > 0
      ? patientData.address !== ''
        ? patientData.address
        : ''
      : '',
  );
  const [value, setValue] = useState(
    Object.keys(patientData).length > 0
      ? patientData.gender !== ''
        ? patientData.gender
        : null
      : null,
  );
  const [phone, setPhone] = useState(
    Object.keys(patientData).length > 0
      ? patientData.phone !== ''
        ? patientData.phone
        : ''
      : '',
  );
  const [items, setItems] = useState([
    {label: 'Male', value: '1'},
    {label: 'Female', value: '2'},
  ]);

  // const [gender, setGender] = useState('female');
  const [gender, setGender] = useState(
    Object.keys(patientData).length > 0
      ? patientData.gender !== ''
        ? patientData.gender
        : null
      : null,
  );

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const forceUpdate = useCallback(() => setIsDatePickerVisible({}), []);
  const [date, setDate] = useState(
    Object.keys(patientData).length > 0
      ? patientData.dateOfBirth !== '01/01/1900 00:00:00' &&
        patientData.dateOfBirth !== ''
        ? Moment(new Date(patientData.dateOfBirth)).format('MM/DD/yyyy')
        : Moment(new Date()).format('MM/DD/yyyy')
      : Moment(new Date()).format('MM/DD/yyyy'),
  );
  const [startDate, setStartDate] = useState(
    Object.keys(patientData).length > 0
      ? patientData.startDate !== '01/01/1900 00:00:00' ||
        patientData.startDate !== '' ||
        patientData.startDate !== null
        ? Moment(new Date(patientData.startDate)).format('MM/DD/yyyy')
        : Moment(new Date()).format('MM/DD/yyyy')
      : Moment(new Date()).format('MM/DD/yyyy'),
  );
  const [referenceNumber, setReferenceNumber] = useState(
    Object.keys(patientData).length > 0
      ? patientData.referenceNumber !== ''
        ? patientData.referenceNumber
        : ''
      : '',
  );
  const [imageObject, setImageObject] = useState(
    Object.keys(patientData).length > 0
      ? patientData.imagePath !== ''
        ? patientData.imagePath
        : ''
      : '',
  );
  const [enableSaveButton, setEnableSaveButton] = useState(false);
  const [emailError, set_emailError] = useState('');
  const [emailValidation, setEmailValidation] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneValidation, setPhoneValidation] = useState(false);
  const [loader, showLoader] = useState(false);

  const [isPressedFemale, setIsPressedFemale] = useState(false);
  const [isPressedMale, setIsPressedMale] = useState(false);

  useEffect(() => {
    console.log('will focus called screenName', screenName);
    console.log('will focus called profileDetails', profileDetails);

    if (patientData.imagePath !== null && patientData.imagePath !== '') {
      let imageData = {};
      imageData.uri = CURRENT_TARGET + '/' + patientData.imagePath;
      setImageObject(imageData);
    }
    let willFocusSubscription = navigation.addListener('willFocus', () => {
      console.log('will focus called');
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return;
    });
    let unsubscribe2 = navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      console.log('Screen is unfocused');
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      // unsubscribe2.remove();
      // willFocusSubscription.remove();
    };
  }, []);
  const singleFilePicker = async () => {
    let options = {
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 300,
      maxHeight: 400,
      cropping: true,
      cameraType: 'back',
    };
    ImagePicker.launchImageLibrary(options)
      .then(fileData => {
        console.log('data received');
        console.log(fileData);
        if (fileData && fileData.didCancel !== true) {
          console.log('====================================');
          console.log('in picker');
          console.log('====================================');
          setIsCamera(true);
          ImageResizer.createResizedImage(
            fileData.assets[0].uri,
            180,
            180,
            'JPEG',
            100,
          )
            .then(({uri}) => {
              fileData.path = uri;
              let imageData = {};
              const fileExtension = String(fileData.assets[0].type).substr(
                String(fileData.assets[0].type).indexOf('/') + 1,
              );
              imageData.uri = fileData.path;
              imageData.name = `Mobile_Upload_${Moment().unix()}.${fileExtension}`;
              imageData.type = fileData.assets[0].type;
              console.log('====================================');
              console.log('imageData', imageData);
              console.log('====================================');
              setImageObject(imageData);
            })
            .catch(err => {
              console.log(err);
              return Alert.alert(
                'Unable to resize the photo',
                'Check the console for full the error message',
              );
            });
          let imageData = {};
          const fileExtension = String(fileData.assets[0].type).substr(
            String(fileData.assets[0].type).indexOf('/') + 1,
          );
          imageData.uri = fileData.assets[0].uri;
          imageData.name = `Mobile_Upload_${Moment().unix()}.${fileExtension}`;
          imageData.type = fileData.assets[0].type;
          setImageObject(imageData);
        } else {
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  };
  const openCamera = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(
        async response => {
          console.log('====================================');
          console.log('camera permission', response);
          console.log('====================================');
          if (response === true) {
            console.log('open camera');
            let options = {
              mediaType: 'photo',
              includeBase64: false,
              maxWidth: 300,
              maxHeight: 400,
              cropping: true,
              cameraType: 'back',
            };
            ImagePicker.launchCamera(options).then(result => {
              if (result && result.didCancel !== true) {
                setIsCamera(true);
                console.log(' camera result');
                console.log(result);
                let image = result.assets[0];
                ImageResizer.createResizedImage(
                  image.uri,
                  180,
                  180,
                  'JPEG',
                  100,
                )
                  .then(({uri}) => {
                    image.uri = uri;
                    if (image) {
                      let imageData = {};
                      imageData.uri = image.uri;
                      imageData.name = image.fileName;
                      imageData.type = image.type;
                      imageData.size = image.fileSize;
                      console.log(imageData);
                      setImageObject(imageData);

                      // navigation.navigate('SaveDocument', {
                      //     dacument: imageData,
                      // });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                    return Alert.alert(
                      'Unable to resize the photo',
                      'Check the console for full the error message',
                    );
                  });
              }
            });
          } else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: '360PatientEngagement App Camera Permission',
                message:
                  '360PatientEngagement App needs access to your camera ' +
                  'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            console.log('====================================');
            console.log('granted', granted);
            console.log('====================================');
            if (granted === 'granted') {
              console.log('open camera');
              let options = {
                mediaType: 'photo',
                includeBase64: false,
                maxWidth: 300,
                maxHeight: 400,
                cropping: true,
                cameraType: 'back',
              };
              ImagePicker.launchCamera(options).then(result => {
                if (result && result.didCancel !== true) {
                  setIsCamera(true);
                  console.log(' camera result');
                  console.log(result);
                  let image = result.assets[0];
                  ImageResizer.createResizedImage(
                    image.uri,
                    180,
                    180,
                    'JPEG',
                    100,
                  )
                    .then(({uri}) => {
                      console.log('====================================');
                      console.log('uri of image', uri);
                      console.log('====================================');
                      image.uri = uri;
                      if (image) {
                        let imageData = {};
                        imageData.uri = image.uri;
                        imageData.name = image.fileName;
                        imageData.type = image.type;
                        imageData.size = image.fileSize;
                        console.log(imageData);
                        setImageObject(imageData);

                        // navigation.navigate('SaveDocument', {
                        //     dacument: imageData,
                        // });
                      }
                    })
                    .catch(err => {
                      console.log(err);
                      return Alert.alert(
                        'Unable to resize the photo',
                        'Check the console for full the error message',
                      );
                    });
                }
              });
            }
          }
        },
      );
    } else {
      requestMicCameraPermission().then(statuses => {
        console.log('====================================');
        console.log('statuses', statuses);
        console.log('====================================');
        if (statuses.cameraPermission !== 'granted') {
          checkCameraPermission();
        } else {
          console.log('open camera');
          let options = {
            mediaType: 'photo',
            includeBase64: false,
            maxWidth: 300,
            maxHeight: 400,
            cropping: true,
            cameraType: 'front',
          };
          ImagePicker.launchCamera(options).then(result => {
            if (result && result.didCancel !== true) {
              setIsCamera(true);
              console.log(' camera result');
              console.log(result);
              let image = result.assets[0];
              ImageResizer.createResizedImage(image.uri, 180, 180, 'JPEG', 100)
                .then(({uri}) => {
                  console.log('====================================');
                  console.log('uri of image', uri);
                  console.log('====================================');
                  image.uri = uri;
                  if (image) {
                    let imageData = {};
                    imageData.uri = image.uri;
                    imageData.name = image.fileName;
                    imageData.type = image.type;
                    imageData.size = image.fileSize;
                    console.log(imageData);
                    setImageObject(imageData);

                    // navigation.navigate('SaveDocument', {
                    //     dacument: imageData,
                    // });
                  }
                })
                .catch(err => {
                  console.log(err);
                  return Alert.alert(
                    'Unable to resize the photo',
                    'Check the console for full the error message',
                  );
                });
            }
          });
        }
      });
    }
  };

  function handleBackButtonClick() {
    if (screenname === 'profile') {
      // resetProfieStack()
      navigation.pop();
    } else {
      navigation.navigate('LoginScreen');
    }

    return true;
  }

  const setOpen = () => {
    set_open(!open);
  };

  function hideDatePicker() {
    setIsDatePickerVisible(false);
  }

  function startDatePicker() {
    if(Platform.OS==='ios')
    {
      setIsDatePickerVisible(true);
      forceUpdate();
    }
    else
    {
      setandroidDate(true)
    }
  }

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onClose = () => {
    modalizeRef.current?.close();
  };

  function resetProfieStack() {
    navigation.reset([NavigationActions.navigate({routeName: 'Profile'})], 0);
  }

  const onSubmitProfileDataCall = () => {
    if (emailError !== '') {
      showMessage({
        message: 'Error',
        description: 'Please enter valid email address',
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.red,
      });
    } else if (phoneError !== '' && phone !== '') {
      showMessage({
        message: 'Error',
        description: 'Please enter valid phone number',
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.red,
      });
    } else if (
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      emailError === '' &&
      phone !== '' &&
      phoneError === '' &&
      gender !== '' &&
      gender !== null &&
      gender !== 0 &&
      gender !== "0"&&
      value !== null
    ) {
      console.log('This is gender test  : ',gender);
      console.log('====================================');
      console.log('start date', startDate);
      console.log('====================================');
      let data = {};
      data.FirstName = firstName;
      data.LastName = lastName;
      data.Email = email;
      data.Phone = phone;
      data.Gender = gender;
      data.Address = address;
      data.DateOfBirth = Moment(date).add(1, 'days').utc().format('MM/DD/yyyy');
      data.ReferenceNumber = referenceNumber === null ? '' : referenceNumber;
      data.StartDate = Moment(startDate).format('MM/DD/yyyy');
      console.log('this is the aquired data', data);
      console.log('Data before sending the to edit profile is : ',JSON.stringify(data))
      showLoader(true);
      ProfileService.updateProfileData(data, imageObject)
        .then(response => {
          console.log('response from api here after updating the user profile');
          console.log(response);
          showLoader(false);
          if (response && response.statusCode === 200 && response.data) {
            dispatch(getUserProfile(response.data));
            // resetProfieStack()
            if (screenName === 'otp' || screenName === 'splash') {

              navigation.navigate('HomeTab');

              //let {firstName,lastName,email,phone,dateOfBirth,gender} = response.data;

              // if(
              //   firstName !== null &&
              //   firstName !== '' &&
              //   lastName !== null &&
              //   lastName !== '' &&
              //   email !== null &&
              //   email !== '' &&
              //   phone !== null &&
              //   phone !== '' &&
              //   dateOfBirth !== null &&
              //   dateOfBirth !== '' &&
              //   gender !== null &&
              //   gender !== ''||0||"0"
              // )
              // {
              //   console.log('Here it comes to the new check by danish...');
              //   navigation.navigate('HomeTab');
              // }
              // else{
              //   navigation.navigate('ProfileStack');
              // }
            } else {
              navigation.navigate('ProfileStack');
            }
            showMessage({
              message: 'Success',
              description: 'Profile has been updated successfully',
              type: 'default',
              icon: {icon: 'success', position: 'left'},
              backgroundColor: Colors.green,
            });
            // removeEventListener();
            // if (this.state.screenName === 'Home') {
            //     this.resetProfieStack();
            //     this.props.navigation.navigate(this.state.screenName);
            // } else {
            //     this.props.navigation.goBack();
            // }
          } else {
            console.log('====================================');
            console.log('response error', response);
            console.log('====================================');
            alert(response.Error.ErrorMessage);
          }
        })
        .catch(err => {
          showLoader(false);
          console.log('error from api error');
          console.log(err);
          showMessage({
            message: err.title,
            description: err.detail,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    } else {
      showLoader(false);
      showMessage({
        message: 'Error',
        description: 'Please fill required fields.',
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.red,
      });
    }
  };
  const onSubmitEmail = email => {
    if (email === '' || email === null) {
      set_emailError('Please fill required fields.');
    } else {
      if (validateEmail(email)) {
        set_emailError('');
        console.log('====================================');
        console.log('true');
        console.log('====================================');
      } else {
        set_emailError('Enter valid email address');
        validateEmail(email);
      }
    }
  };
  const validateEmail = text => {
    var reg = new RegExp(
      '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
    );
    if (reg.test(text) === false) {
      setEmailValidation(false);
      return false;
    } else {
      console.log('email true');
      setEmailValidation(true);
      return true;
    }
  };

  /* istanbul ignore next */
  function validatePhone(text) {
    var regex = new RegExp('(d{3})sd{3}sd{4}');
    if (regex.test(text) === false) {
      // setPhoneValidation(false);
      // setPhoneError('Please enter valid Phone number.');
      // console.log('phone false');
      return false;
    } else {
      // console.log('phone true');

      setPhoneValidation(true);
      setPhoneError('');
      return true;
    }
  }

  const onChangeLastName = e => {
    if (e !== ' ') {
      set_lastName(e);
    }
  };
  const onChangeFirstName = e => {
    if (e !== ' ') {
      set_FirstName(e);
    }
  };
  // const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  // const [loader, showLoader] = useState(false);

  return (
    <Fragment>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
        <View style={{padding: hp(3)}}>
          <TouchableOpacity
            onPress={() => {
              onClose();
              openCamera();
            }}
            style={{
              flexDirection: 'row',
              marginTop: hp(4),
              marginBottom: hp(2),
              marginLeft: hp(3),
              marginRight: hp(3),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.2),
                flex: 1,
                color: Colors.black1,
              }}>
              Take Photo
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.line,
              width: '90%',
              alignSelf: 'center',
            }}
          />
          <TouchableOpacity
            onPress={() => {
              onClose();
              singleFilePicker();
            }}
            style={{
              flexDirection: 'row',
              marginTop: hp(2),
              marginBottom: hp(2),
              marginLeft: hp(3),
              marginRight: hp(3),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.2),
                flex: 1,
                color: Colors.black1,
              }}>
              Choose Photo
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.line,
              width: '90%',
              alignSelf: 'center',
            }}
          />
        </View>
      </Modalize>
      {
        Platform.OS === 'ios'?
        <DateTimePicker
        isVisible={isDatePickerVisible}
        onCancel={() => hideDatePicker()}
        mode={'date'}
        titleIOS={'Pick a Date'}
        // value={new Date(date)}
        date={isStartDate ? new Date(startDate) : new Date(date)}
        maximumDate={new Date()}
        titleStyle={{fontSize: hp(2)}}
        onConfirm={date => {
          if (isStartDate === true) {
            setStartDate(date);
            hideDatePicker();
          } else {
            setDate(date);
            hideDatePicker();
          }
        }}
      />
        :
        <DatePicker
        modal
        open={androidDate}
        date={isStartDate ? new Date(startDate) : new Date(date)}
        mode='date'
        onConfirm={(date) => {
          if (isStartDate === true) {
            setStartDate(date);
            setandroidDate(false)
          } else {
            setDate(date);
            setandroidDate(false)
          }
          // setStartDate(date);
          // setandroidDate(false)
        }}
        onCancel={() => {
          setandroidDate(false)
        }}
      />
      }
      
      <SafeAreaView
        style={{
          backgroundColor: Colors.backgroundMainLogin,
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundMainLogin,
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.BgColor,
          }}>
          {screenName === 'profile' && (
            <TouchableOpacity
              onPress={() => {
                // navigation.goBack();
                if (screenName === 'profile') {
                  navigation.pop();
                } else {
                  navigation.navigate('LoginScreen');
                }
              }}
              style={{padding: hp(2), maxWidth: '15%'}}>
              <SvgCss
                xml={svgs.arrowHeadLeft}
                width={hp(4)}
                height={hp(4)}
                fill={Colors.black}
              />
            </TouchableOpacity>
          )}
          <View
            style={{
              maxWidth: screenname === 'profile' ? '65%' : '100%',
              flex: 1,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.SourceSansBold,
                // marginTop: heightPercentageToDP(2),
                marginLeft: heightPercentageToDP(8.8),
                marginRight: heightPercentageToDP(5),
                fontSize: heightPercentageToDP(2.5),
                color: Colors.notificationGray,
                fontWeight: '600',
              }}>
              Edit Profile
            </Text>
          </View>
          <View style={{maxWidth: '15%', flex: 1}}></View>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: Colors.backgroundMainLogin,
          }}>
          <ScrollView
            style={{
              marginTop: hp(3),
              width: '100%',
              // alignItems: 'center',
              // borderTopEndRadius: 30,
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              backgroundColor: Colors.white,
            }}
            contentContainerStyle={{
              // backgroundColor: Colors.black,
              alignItems: 'center',
              alignSelf: 'center',
              alignContent: 'center',
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 24,
              elevation: 3,
            }}>
            <KeyboardAwareScrollView
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                flex: 1,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
                width: '100%',
              }}
              nestedScrollEnabled={true}
              enableAutomaticScroll>
              {/* /Header Image and Pen */}
              <View
                style={{
                  justifyContent: 'center',
                  marginVertical: hp(1.5),
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}>
                {/* Change imageObject !== null to make it work with navigation state props */}

                {imageObject !== null && imageObject !== '' ? (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      // marginTop:hp(1),
                      marginBottom: hp(1),
                      marginRight: hp(-2),
                      borderRadius: 10,
                    }}
                    source={{
                      uri: isCamera
                        ? imageObject.uri + '?' + new Date()
                        : baseUrl +
                          '/' +
                          patientData.imagePath +
                          '?' +
                          new Date(),
                    }}
                  />
                ) : (
                  <FastImage
                    style={{
                      width: 100,
                      height: 100,
                      // marginTop:hp(1),
                      marginBottom: hp(1),
                      marginRight: hp(-2),
                      borderRadius: 10,
                    }}
                    source={Images.userLogoDemo}
                  />
                )}

                <TouchableOpacity onPress={() => onOpen()}>
                  <View
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: Colors.blueBackground,
                        color: Colors.blueBackground,
                        borderRadius: 30,
                        borderColor: Colors.white,
                        borderWidth: 2,
                        width: 30,
                        height: 30,
                        paddingTop: 5,
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <FastImage
                        style={{
                          zIndex: 10,

                          width: 13,
                          height: 15,
                          // borderRadius: 10,
                        }}
                        source={require('../../../../../assets/images/edit_profile_pen.png')}></FastImage>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  maxWidth: '85%',
                  minWidth: '85%',
                  alignSelf: 'center',
                  marginBottom: hp(5),
                  zIndex: Platform.OS === 'ios' ? 100 : 100,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2),
                    color: Colors.noRecordFound,
                    marginBottom: hp(0.5),
                  }}>
                  First Name<Text style={{color: 'red'}}>*</Text>
                </Text>
                {/*Custom TextField Name */}
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: Colors.line,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                  }}>
                  <FastImage
                    style={{
                      width: 16,
                      height: 16,
                      marginLeft: hp(1),
                      marginRight: hp(1),
                      // marginTop:hp(1),
                      // marginBottom: hp(1),
                      // marginRight: hp(-2),
                      // borderRadius: 10,
                    }}
                    source={Images.personIconPlaceHolder}
                  />

                  <TextInput
                    onChangeText={e => onChangeFirstName(e)}
                    value={firstName}
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      paddingVertical: hp(1.35),
                      flex: 1,
                      // paddingHorizontal: hp(1.3),
                      fontSize: hp(2),
                      marginTop: hp(0.2),
                      color: Colors.black4,
                      // borderColor:Colors.black,
                      // borderWidth:1,
                    }}
                    keyboardType="email-address"
                    selectionColor={Colors.blueTextColor}
                    placeholder="First Name"
                    placeholderTextColor={Colors.placeHoldaerColor}
                    maxLength={50}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2),
                    color: Colors.noRecordFound,
                    marginTop: hp(2),
                    marginBottom: hp(0.5),
                  }}>
                  Last Name<Text style={{color: 'red'}}>*</Text>
                </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: Colors.line,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                  }}>
                  <FastImage
                    style={{
                      width: 16,
                      height: 16,
                      marginLeft: hp(1),
                      marginRight: hp(1),
                      // marginTop:hp(1),
                      // marginBottom: hp(1),
                      // marginRight: hp(-2),
                      // borderRadius: 10,
                    }}
                    source={Images.personIconPlaceHolder}
                  />

                  <TextInput
                    onChangeText={e => onChangeLastName(e)}
                    value={lastName}
                    style={{
                      flex: 1,
                      // borderWidth: 1,
                      // borderColor: Colors.line,
                      // borderRadius: 8,
                      // backgroundColor: Colors.white,
                      fontFamily: Fonts.SourceSansRegular,
                      paddingVertical: hp(1.35),
                      // paddingHorizontal: hp(15),
                      fontSize: hp(2),
                      marginTop: hp(0.2),
                      color: Colors.black4,
                    }}
                    keyboardType="email-address"
                    selectionColor={Colors.blueTextColor}
                    placeholder="Last Name"
                    placeholderTextColor={Colors.placeHoldaerColor}
                    maxLength={25}
                    // onChangeText={searchString => {
                    //   this.setState({searchString});
                    // }}
                    // underlineColorAndroid="transparent"
                  />
                </View>

                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2),
                    color: Colors.noRecordFound,
                    marginTop: hp(2),
                    marginBottom: hp(0.5),
                  }}>
                  Email Address
                  <Text style={{color: 'red'}}>*</Text>
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: Colors.line,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                  }}>
                  <FastImage
                    style={{
                      width: 20,
                      height: 20,
                      paddingLeft: hp(2),
                      marginLeft: hp(1),
                      // marginRight: hp(1),
                      // marginTop:hp(1),
                      // marginBottom: hp(1),
                      // marginRight: hp(-2),
                      // borderRadius: 10,
                    }}
                    source={Images.emailIconProfileSignUp}
                  />
                  <View style={{paddingRight: hp(0.8)}}></View>
                  <TextInput
                    onChangeText={text => {
                      set_email(text);
                      onSubmitEmail(text);
                    }}
                    value={email}
                    editable={Platform.OS === 'ios'? false : true} 
                    style={{
                      // borderWidth: 1,
                      // borderColor: Colors.line,
                      // borderRadius: 8,
                      // backgroundColor: Colors.white,
                      fontFamily: Fonts.SourceSansRegular,
                      flex: 1,
                      paddingVertical: hp(1.35),
                      // paddingHorizontal: hp(15),
                      fontSize: hp(2),
                      marginTop: hp(0.2),
                      color: Colors.black4,
                    }}
                    keyboardType="email-address"
                    selectionColor={Colors.blueTextColor}
                    placeholder="xyz@gmail.com"
                    // onChangeText={searchString => {
                    //   this.setState({searchString});
                    // }}
                    // underlineColorAndroid="transparent"
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      marginTop: hp(2),
                      // marginTop: hp(1),
                      marginBottom: hp(0.5),
                    }}>
                    Phone Number<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <View
                    style={{
                      // flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      alignContent: 'center',
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: Colors.line,
                      borderRadius: 8,
                      backgroundColor: Colors.white,
                      marginBottom: hp(1),
                    }}>
                    <FastImage
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: hp(1),
                        marginRight: hp(1),
                        // marginTop:hp(1),
                        // marginBottom: hp(1),
                        // marginRight: hp(-2),
                        // borderRadius: 10,
                      }}
                      source={Images.call_Icon_Black}
                    />
                    <TextInputMask
                      type={'custom'}
                      options={{
                        mask: '(999) 999 9999',
                      }}
                      onChangeText={text => {
                        setPhone(text);
                        // validatePhone(text);
                      }}
                      value={phone}
                      style={{
                        flex: 1,
                        // borderWidth: 1,
                        // borderColor: Colors.line,
                        // borderRadius: 8,
                        // backgroundColor: Colors.white,
                        fontFamily: Fonts.SourceSansRegular,
                        paddingVertical: hp(1.35),
                        // paddingHorizontal: hp(15),
                        fontSize: hp(2),
                        marginTop: hp(0.2),
                        color: Colors.black4,
                      }}
                      placeholderTextColor={Colors.placeHoldaerColor}
                      placeholder={'(999) 999-9999'}
                      keyboardType="phone-pad"
                      selectionColor={Colors.blueTextColor}

                      // onChangeText={searchString => {
                      //   this.setState({searchString});
                      // }}
                      // underlineColorAndroid="transparent"
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2),
                        color: Colors.noRecordFound,
                        // marginTop: hp(1),
                        marginBottom: hp(0.5),
                      }}>
                      DOB<Text style={{color: 'red'}}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={{
                        width: '100%',
                        borderRadius: 10,
                        // height: 48,
                        paddingVertical: hp(0.35),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,

                        borderColor: Colors.lightGrey,
                      }}
                      onPress={() => {
                        startDatePicker();
                        setIsStartDate(false);
                      }}
                      // onPress={() => startDatePicker()}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          // justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: hp(1),
                          flex: 1,
                          width: '100%',
                          borderRadius: 10,
                          backgroundColor: Colors.white,
                        }}>
                        <Image
                          source={Images.calenderBlack}
                          style={{
                            tintColor: Colors.black,
                            height: hp(2.5),
                            width: hp(2.5),
                            marginRight: hp(1),
                            alignSelf: 'center',
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2.2),
                            color: Colors.black,
                            justifyContent: 'center',
                            // placeholder: '01/2/1965'
                            // placeholderTextColor: Colors.black,
                          }}>
                          {Moment(date).format('MM/DD/yyyy')}

                          {/* {Moment(date).format('MM/DD/yyyy')} */}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      marginTop: hp(1),
                      marginBottom: hp(0.5),
                    }}>
                    Address
                    {/* <Text style={{color: 'red'}}>*</Text> */}
                  </Text>
                  <View
                    style={{
                      // width:hp(35),
                      // flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      alignContent: 'center',
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: Colors.line,
                      borderRadius: 8,
                      backgroundColor: Colors.white,
                      marginBottom: hp(0.5),
                    }}>
                    <FastImage
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: hp(1),
                        marginRight: hp(1),
                      }}
                      source={Images.homeIconProfileSignUp}
                    />

                    <TextInput
                      onChangeText={set_address}
                      value={address}
                      style={{
                        flex: 1,
                        fontFamily: Fonts.SourceSansRegular,
                        paddingVertical: hp(1.35),
                        fontSize: hp(2),
                        marginTop: hp(0.2),
                        color: Colors.black4,
                      }}
                      keyboardType="email-address"
                      selectionColor={Colors.blueTextColor}
                      placeholder="Address"
                      placeholderTextColor={Colors.placeHoldaerColor}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2),
                    color: Colors.noRecordFound,
                    marginTop: hp(2),
                  }}>
                  Gender<Text style={{color: 'red'}}>*</Text>
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-around',
                    paddingTop: 12,
                  }}>
                  <TouchableOpacity
                    onPress={
                      () => {
                        // console.log(isPressedFemale);
                        setGender('2');

                        console.log(isPressedFemale);
                        // setIsPressedMale(false);
                        // isPressedFemaleColor = Colors.Pink;
                      }
                      // setIsPressedFemale(true)
                    }>
                    <View
                      style={{
                        // marginRight: hp(13),
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: Colors.line,
                        borderRadius: 8,
                        borderColor:
                          gender === '2' ? Colors.homePink : Colors.line,
                        backgroundColor: Colors.white,
                        paddingVertical: hp(2.5),
                        paddingHorizontal: hp(5),
                      }}>
                      <Image
                        source={Images.femaleIcon}
                        style={{width: 22, height: 34, marginBottom: 10}}
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.black4,
                        }}>
                        Female
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{paddingHorizontal: 10}}></View>
                  <TouchableOpacity
                    onPress={() => {
                      setGender('1');
                      // console.log(isPressedMale);
                      // setIsPressedFemale(false);
                      // setIsPressedMale(true);
                      // setIsPressedFemale(false);
                      // console.log(isPressedMale);
                      // setIsPressedMale(false);
                      // isPressedFemaleColor = Colors.Pink;
                    }}>
                    <View
                      style={{
                        // marginRight: hp(10),
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor:
                          gender === '1' ? Colors.bluetoothColor : Colors.line,
                        borderRadius: 8,
                        backgroundColor: Colors.white,
                        paddingVertical: hp(2.5),
                        paddingHorizontal: hp(5),
                      }}>
                      <Image
                        source={Images.maleIcon}
                        style={{width: 34, height: 34, marginBottom: 10}}
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.black4,
                        }}>
                        Male
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* here */}

                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      marginTop: hp(2),
                      marginBottom: hp(0.5),
                    }}>
                    Medicare Number(Optional-Add for medical history)
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      alignContent: 'center',
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: Colors.line,
                      borderRadius: 8,
                      backgroundColor: Colors.white,
                    }}>
                    <FastImage
                      style={{
                        width: 21,
                        height: 23,
                        marginLeft: hp(1),
                        marginRight: hp(1),
                        // marginTop:hp(1),
                        // marginBottom: hp(1),
                        // marginRight: hp(-2),
                        // borderRadius: 10,
                      }}
                      source={Images.mrnIconProfileSignUp}
                    />

                    <TextInput
                      onChangeText={text => {
                        setReferenceNumber(text);
                      }}
                      value={referenceNumber}
                      style={{
                        flex: 1,
                        fontFamily: Fonts.SourceSansRegular,
                        paddingVertical: hp(1.35),
                        fontSize: hp(2),
                        marginTop: hp(0.2),
                        color: Colors.black4,
                      }}
                      keyboardType="email-address"
                      selectionColor={Colors.blueTextColor}
                      placeholder="44678"
                      placeholderTextColor={Colors.placeHoldaerColor}
                      // onChangeText={searchString => {
                      //   this.setState({searchString});
                      // }}
                      // underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
                {/* <View>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      marginTop: hp(1),
                      marginBottom: hp(0.5),
                    }}>
                    Start Date<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      // height: 58,
                      paddingVertical: hp(0.35),

                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: Colors.lightGrey,
                    }}
                    onPress={() => {
                      startDatePicker();
                      setIsStartDate(true);
                      // console.log(
                      //   'this is the data that im printing',
                      //   profileDetails,
                      // );
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: hp(1),
                        flex: 1,
                        width: '100%',
                        borderRadius: 10,
                        backgroundColor: Colors.white,
                      }}>
                      <Image
                        source={Images.calenderBlack}
                        style={{
                          tintColor: Colors.black,
                          height: hp(3),
                          width: hp(3),
                          marginRight: hp(1),
                          alignSelf: 'center',
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2.2),
                          color: Colors.black,
                          justifyContent: 'center',
                          // placeholder: '01/2/1965'
                          // placeholderTextColor: Colors.black,
                        }}>
                        {Moment(startDate).format('MM/DD/yyyy')}

                      </Text>
                    </View>
                  </TouchableOpacity>
                </View> */}
              </View>
              <TouchableOpacity
                onPress={() => {
                  console.log('Submit Tapped');
                  onSubmitProfileDataCall();
                  // navigation.navigate('HomeTab')
                }}
                style={{
                  backgroundColor: Colors.blueTextColor,
                  minHeight: hp(6),
                  borderRadius: 8,
                  justifyContent: 'center',
                  maxWidth: '85%',
                  minWidth: '85%',
                  alignSelf: 'center',
                }}>
                {loader ? (
                  <Spinner
                    visible={loader}
                    textContent={'Loading...'}
                    textStyle={{color: '#FFF'}}
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: heightPercentageToDP(2.2),
                      color: Colors.white,
                    }}>
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
              <View
                style={{
                  height: hp(10),
                  minHeight: hp(6),
                }}
              />
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = ({userProfileData}) => ({
  userProfileData,
});

export default connect(mapStateToProps)(EditProfileScreen);
