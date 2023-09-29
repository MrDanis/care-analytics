//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LabService from '../../../api/lab';
import ImagingService from '../../../api/imaging';
import FastImage from 'react-native-fast-image';
// create a component
const UploadResultModal = props => {
  console.log('image object is : ',props?.imageObject)
  console.log('All the props are : ',props);
  const singleFilePicker = async () => {
    // let options = {
    //   mediaType: 'photo',
    //   includeBase64: false,
    //   maxWidth: 300,
    //   maxHeight: 400,
    //   cropping: true,
    //   cameraType: 'back',
    //};
    let options = {
      mediaType: 'photo',
      includeBase64: false,
      cropping: false,
      mode: 'contain'
    };
    ImagePicker.launchImageLibrary(options)
      .then(fileData => {
        console.log('data received');
        console.log(fileData);
        if (fileData) {
          ImageResizer.createResizedImage(
            fileData.assets[0].uri,
            fileData.assets[0].width,
            fileData.assets[0].height,
            'JPEG',
            100,
          )
            .then(({uri}) => {
              console.log('====================================');
              console.log('resize file uri', uri);
              console.log('====================================');
              fileData.path = uri;
              let imageData = {};
              const fileExtension = String(fileData.assets[0].type).substr(
                String(fileData.assets[0].type).indexOf('/') + 1,
              );
              imageData.uri = fileData.path;
              imageData.name = `Mobile_Upload_${moment().unix()}.${fileExtension}`;
              imageData.type = fileData.assets[0].type;
              console.log('====================================');
              console.log('ImageData', imageData);
              console.log('====================================');
              props.setImageObject(imageData);
            })
            .catch(err => {
              console.log(err);
              return Alert.alert(
                'Unable to resize the photo',
                'Check the console for full the error message',
              );
            });
          // let imageData = {};
          // const fileExtension = String(fileData.assets[0].type).substr(
          //   String(fileData.assets[0].type).indexOf('/') + 1,
          // );
          // imageData.uri = fileData.assets[0].uri;
          // imageData.name = `Mobile_Upload_${moment().unix()}.${fileExtension}`;
          // imageData.type = fileData.assets[0].type;
          // props.setImageObject(imageData);
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  };

  const onUploadResult = () => {
     
    if(props?.isLab)
    {
      console.log('This is the test upload function ....');
      let data = {};
      data.TestName = props.testName;
      data.LabName = props.labName;
      data.Description = props.description;
      console.log('Upload the result data is : ',data,' Image object is : ',props?.imageObject);
      //====================================================================(Below portion is commented because of checking the uploading issue on android)================================================
         props.setLoader(true)
         LabService.uploadLabData(data, props.imageObject).then((res)=>{
          console.log('server response  :  ',res)
         if(res && res.statusCode === 200)
         {
            console.log('Data is submited to the backend');
            props.setLoader(false);
            props.onClose();
            if(props?.navigation)
            {
              props.navigation.navigate('Lab',{ previousScreen: 'Home' });
            }
         } 
        }).catch((error)=>{
           console.log('Error in uploading the result by the picture taken from camera : ',error);
           props.setLoader(false);
           showMessage({
            message: 'Something went wrongssss!',
            description: error?.response?.data?.detail,
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        })
      //====================================================================(Below portion is commented because of checking the uploading issue on android)================================================
    }
    else
    {
      let data = {};
      data.Name = props.testName;
      data.Description = props.description;
      props.setLoader(true);
      ImagingService.uploadimagingData(data, props?.imageObject).then(res => {
        console.log('====================================');
        console.log('res', res);
        console.log('====================================');
        if (res && res.statusCode === 200) {
          props.setLoader(false);
          props.onClose();
          if(props?.navigation)
          {
            props.navigation.navigate('Imaging',{ previousScreen: 'Home' });
          }
          // props.navigation.navigate('Imaging');
          props.imagingGetData();
        } else {
          props.setLoader(false);
        }
      }).catch((err)=>{
        props.setLoader(false);
      });
    // }
      console.log('Data comming from the lab is.... ',{data:data,img:props?.imageObject});
    }

    // props.setLoader(true);
    // if (props.isLab) {
    //   let data = {};
    //   data.TestName = props.testName;
    //   data.LabName = props.labName;
    //   data.Description = props.description;
    //   console.log('Upload the result is : ',data,props?.imageObject)
    //   LabService.uploadLabData(data, props.imageObject).then(res => {
    //     console.log('====================================');
    //     console.log('res', res);
    //     console.log('====================================');
    //     if (res && res.statusCode === 200) {
    //       props.setLoader(false);
    //       props.onClose();
    //       props.navigation.navigate('Lab');
    //       props?.labsGetData();
    //     } else {
    //       props.setLoader(false);
    //     }
    //   });
    // } else {
    //   let data = {};
    //   data.Name = props.testName;
    //   data.Description = props.description;
    //   ImagingService.uploadimagingData(data, props.imageObject).then(res => {
    //     console.log('====================================');
    //     console.log('res', res);
    //     console.log('====================================');
    //     if (res && res.statusCode === 200) {
    //       props.setLoader(false);
    //       props.onClose();
    //       props.navigation.navigate('Imaging');
    //       props.imagingGetData();
    //     } else {
    //       props.setLoader(false);
    //     }
    //   });
    // }
  };

  return (
    <>
      <View style={{alignItems: 'center', flex: 1}}>
        <Text
          style={{
            color: Colors.black4,
            fontFamily: Fonts.SourceSansSemibold,
            fontSize: hp(2.2),
            marginVertical: hp(3),
          }}>
          Upload Result
        </Text>
      </View>
      <KeyboardAwareScrollView style={{flex: 1}}>
        <View style={{width: '90%', alignSelf: 'center'}}>
          <Text
            style={{
              color: Colors.noRecordFound,
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2.2),
            }}>
            Test Name
          </Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              height: hp(7),
              borderColor: Colors.circleBackground,
              borderRadius: 5,
              marginTop: hp(0.5),
            }}>
            <TextInput
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                color: '#424242',
                borderRadius: 8,
                borderColor: Colors.line,
                flexDirection: 'row',
                width: '90%',
                height: hp(10),
                alignSelf: 'center',
                fontSize: hp(2.2),
                fontFamily: Fonts.SourceSansRegular,
              }}
              maxLength={20}
              value={props.testName}
              onChangeText={text => {
                props.setTestName(text);
              }}
              placeholder={'Test Name'}
              placeholderTextColor={Colors.blueGrayDisableText}
            />
          </View>
        </View>
        {props.isLab ? (
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginVertical: hp(3),
            }}>
            <Text
              style={{
                color: Colors.noRecordFound,
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.2),
              }}>
              Lab Name
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                height: hp(7),
                borderColor: Colors.circleBackground,
                borderRadius: 5,
                marginTop: hp(0.5),
              }}>
              <TextInput
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  color: '#424242',
                  borderRadius: 8,
                  borderColor: Colors.line,
                  flexDirection: 'row',
                  width: '90%',
                  height: hp(10),
                  alignSelf: 'center',
                  fontSize: hp(2.2),
                  fontFamily: Fonts.SourceSansRegular,
                }}
                value={props.labName}
                onChangeText={text => {
                  props.setLabName(text);
                }}
                maxLength={20}
                placeholder={'Lab Name'}
                placeholderTextColor={Colors.blueGrayDisableText}
              />
            </View>
          </View>
        ) : null}
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginBottom: hp(3),
            marginTop: !props.isLab ? hp(3) : 0,
          }}>
          <Text
            style={{
              color: Colors.noRecordFound,
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2.2),
            }}>
            Description
          </Text>
          {
            Platform.OS === 'ios'?
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              height: hp(10),
              borderColor: Colors.circleBackground,
              borderRadius: 5,
              marginTop: hp(0.5),
            }}>
             <TextInput
              style={{
                paddingTop: 10,
                color: '#424242',
                borderRadius: 8,
                borderColor: Colors.line,
                flexDirection: 'row',
                width: '90%',
                height: hp(10),
                alignSelf: 'center',
                fontSize: hp(2.2),
                fontFamily: Fonts.SourceSansRegular,
              }}
              value={props.description}
              maxLength={50}
              // onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={text => {
                props.setDescription(text);
              }}
              enablesReturnKeyAutomatically={true}
              placeholder={'Test Description'}
              placeholderTextColor={Colors.blueGrayDisableText}
              multiline
              numberOfLines={5}
            />
          </View>
          :
          <View
            style={{
              width: '100%',
              // alignItems: 'center',
              // justifyContent: 'center',
              borderWidth: 1,
              height: hp(10),
              borderColor: Colors.circleBackground,
              borderRadius: 5,
              marginTop: hp(0.5),
            }}>
             <TextInput
              style={{
                paddingLeft: 10,
                color: '#424242',
                borderRadius: 8,
                borderColor: Colors.line,
                minWidth: '100%',
                // flexDirection: 'row',
                // width: '90%',
                // height: hp(10),
                // alignSelf: 'center',
                fontSize: hp(2.2),
                fontFamily: Fonts.SourceSansRegular,
              }}
              value={props.description}
              maxLength={50}
              // onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={text => {
                props.setDescription(text);
              }}
              enablesReturnKeyAutomatically={true}
              placeholder={'Test Description'}
              placeholderTextColor={Colors.blueGrayDisableText}
              multiline={true}
              // numberOfLines={5}
            />
          </View>
          }
        </View>
        <View style={{width: '90%', alignSelf: 'center', marginBottom: hp(3)}}>
          <Text
            style={{
              color: Colors.noRecordFound,
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2.2),
            }}>
            Upload Picture
          </Text>
          <Pressable
            onPress={() => singleFilePicker()}
            style={{
              width: hp(15),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              height: hp(12),
              borderColor: Colors.circleBackground,
              borderRadius: 8,
              marginTop: hp(0.5),
            }}>
            {props.imageObject === null ? (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    fontSize: hp(2.5),
                    color: Colors.noRecordFound,
                  }}>
                  +
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2),
                    color: Colors.noRecordFound,
                  }}>
                  Image
                </Text>
              </View>
            ) : (
              <FastImage
              source={{ uri: `file://${props?.imageObject?.uri}` }}
              style={{
                width: hp(15),
                height: hp(12),
                borderRadius: 8,
                borderColor:'red',
                borderWidth:0,
                
              
              }}
              
            />
              // <Image
              //   style={{
              //     width: hp(15),
              //     height: hp(12),
              //     borderRadius: 8,
              //     borderColor:'red',
              //     borderWidth:4
              //   }}
              //   source={{
              //     uri: props.imageObject.uri + '?' + new Date(),
              //   }}
              // />
            )}
          </Pressable>
        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginBottom: hp(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Pressable
            onPress={() => props.onClose()}
            style={{
              width: '47%',
              alignItems: 'center',
              justifyContent: 'center',
              height: hp(7),
              borderRadius: 8,
              backgroundColor: Colors.blueTextColorDisabled,
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.blueTextColor,
                fontSize: hp(2),
              }}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onUploadResult()}
            disabled={
              props.testName === '' ||
              props.labName === '' ||
              props.imageObject === null
                ? true
                : false
            }
            style={{
              width: '47%',
              alignItems: 'center',
              justifyContent: 'center',
              height: hp(7),
              borderRadius: 8,
              backgroundColor: Colors.blueTextColor,
              opacity:
                props.testName === '' ||
                props.labName === '' ||
                props.imageObject === null
                  ? 0.3
                  : 1,
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.white,
                fontSize: hp(2),
              }}>
              Upload
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default UploadResultModal;
