import React,{useState,useRef,useEffect} from 'react';
import {View,Text,Button,Linking,BackHandler,Platform,StyleSheet,TouchableOpacity,Image,ActivityIndicator, PermissionsAndroid, Alert} from 'react-native';
import { Camera,useCameraDevices} from 'react-native-vision-camera';

import {Colors, Images, Svgs} from '../../../../../config';
import {SvgCss} from 'react-native-svg';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {modalHanlder} from '../../../medication/actions';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import * as ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageResizer from 'react-native-image-resizer';
// import { useIsFocused } from '@react-navigation/native';
const CameraScreen =({navigation,isCamera,setIsCamera,dispatch,setImageObject,onOpenTakePic}) => {
  // const { camera:camraCheck, status } = useCamera();
  // const { camera:pictureCheck, status } = useCamera();
  const camera = useRef(null);
  const [isCameraOpen,setisCameraOpen] = useState(true);
  const [imageSource, setImageSource] = useState('');
  const [lastPhoto,setLastPhoto] = useState()
  const [isImagePreview,setisImagePreview] = useState(false);
  const devices = useCameraDevices('wide-angle-camera');
  console.log('Device is : ',device);
  const device = devices.back;
  const handleTakePicture = async () => {
    console.log('Called to take the picture .......');  
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({quality:1,base64:true});
      console.log('Path of the photo is : ',photo.path,'and extension is',photo.path.split('.')[2]);
      let imageData ={};
      if(Platform.OS==='ios')
      {
        const extensionFile = photo.path.split('.');
        imageData.uri = photo.path;
        imageData.name = `Mobile_Upload_${moment().unix()}.${extensionFile[1]}`;
        imageData.type = `image/${extensionFile[1]}`;
        console.log('====================================');
        console.log('imageData is : ', imageData);
        console.log('====================================');
        console.log('Image URI before posting the data : ',imageData.uri,' and extension of the file is ',extensionFile)
      }
      else
      {
          //kl idr sy hi a k kam start krna hai or abhi k lia jo if main likha hua hai woi id paste kr reha hu 
          //Marey khiyal sy masla is ki picture main hai jo hum vision camera sy laty hain android main issue kr reha hai lakin 
          // IOS main theek hai 'image/jpeg',//`image/${extensionFile[2]}`;
          //=====================================(START)================================
          const extensionFile = photo.path.split('.');
          imageData.uri = `file://${photo.path}`;
          imageData.name = `Mobile_Upload_${moment().unix()}.${extensionFile[1]}.${extensionFile[2]}`;
          imageData.type = `image/${extensionFile[2]}`;
          console.log('====================================');
          console.log('imageData is : ', imageData);
          console.log('====================================');
          console.log('Image URI before posting the data : ',imageData.uri,' and extension of the file is ',extensionFile)
        
          //=====================================(END)================================== 
      }

      setImageObject(imageData);
      setImageSource(photo.path);
      setisImagePreview(true);
      setisCameraOpen(false);
      // setShowCamera(false);
    }
  }
  const handleShowLastPicture = async() =>{
    // console.log('I am called to get the last taken picture : ',Platform.OS);
    const permission = await Camera.requestCameraPermission();
    if(permission === 'denied')
    {
        await Linking.openSettings();
    }
    if(Platform.OS === 'android')
    {
      // get the permission from the gallery and show the last taken picture 
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Gallery Permission',
            message: 'App needs access to your gallery',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Gallery permission granted');
          // Proceed with accessing the gallery
          CameraRoll.getPhotos({first: 20, assetType: 'Photos'})
         .then(res => {
        console.log('Last image from the gallery is ',res)
        if (res.edges.length > 0) {
          console.log('Last image uri is : ',res?.edges[0]?.node?.image?.uri);
          setLastPhoto(res.edges[0].node.image.uri);
        }
      })
      .catch(err => console.log('err', err));
        } else {
          console.log('Gallery permission denied');
          // Handle permission denied
        }
      } catch (error) {
        console.warn('Error requesting gallery permission:', error);
      }
    }
    else
    {
      CameraRoll.getPhotos({first: 20, assetType: 'Photos'})
      .then(res => {
        console.log('Last image from the gallery is ',res)
        if (res.edges.length > 0) {
          console.log('Last image uri is : ',res?.edges[0]?.node?.image?.uri);
          setLastPhoto(res.edges[0].node.image.uri);
        }
      })
      .catch(err => console.log('err', err));
    } 
  }
  const singleFilePicker = async ()=>{
    // let options = {
    //   mediaType: 'photo',
    //   includeBase64: false,
    //   // maxWidth: 300,
    //   // maxHeight: 400,
    //   cropping: false,
    //   // cameraType: 'back',
    // };
    console.log('====================================');
    console.log('gallery');
    console.log('====================================');
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
          console.log('Filse recieve from the gallery is ,',fileData)
          setIsCamera(!isCamera);
          onOpenTakePic();
          ImageResizer.createResizedImage(
            fileData.assets[0].uri,
            fileData.assets[0].width,
            fileData.assets[0].height,
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
              imageData.name = `Mobile_Upload_${moment().unix()}.${fileExtension}`;
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
          imageData.name = `Mobile_Upload_${moment().unix()}.${fileExtension}`;
          imageData.type = fileData.assets[0].type;
          setImageObject(imageData);
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  }
  const  handleSavePictureToGallery = () => {
    console.log('Save the image to the gallery :',imageSource)
    CameraRoll.save(imageSource).then((res)=>{
       if(res)
       {
        setisImagePreview(false);
        // dispatch(modalHanlder(true));
        setIsCamera(!isCamera);
        onOpenTakePic();
       }
      console.log('Response getting back after the image is saved ',res)
    
    }).catch((err)=>{console.log('Error in saving the image to gallery : ',err)});
  }
  const handleGoBack = ()=>{
    dispatch(modalHanlder(true));
    setIsCamera(!isCamera);
  }
   useEffect(()=>{
     console.log('Came to camera screen.....',device);
    //  {text: 'YES', onPress: () => BackHandler.exitApp()},   
     handleShowLastPicture();
     const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
       backAction,
    );

    return () => backHandler.remove();
  },[isCamera])
  if (device == null) return <ActivityIndicator />
  return (

    <View style={{flex:1,borderColor:'red',borderWidth:0,position:'relative'}}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraOpen}
        photo={true}
        
      />
      {
        !isImagePreview?
      <SafeAreaView style={{flex:1}}>
          <View style={{width:'100%',paddingVertical:hp(2),borderColor:'green',borderWidth:0,height:'10%',alignItems: 'flex-end'}}>
            {/* <Button>Go Back</Button> */}
            {/* Header Row will be here Start */}
            <SvgCss
                  xml={Svgs.cross}
                  width={hp(4)}
                  height={hp(4)}
                  fill={Colors.white}
                  onPress={() => {
                    dispatch(modalHanlder(true));
                    setIsCamera(!isCamera);
                  }}
                  style={{marginHorizontal: hp(1),borderColor:'red',borderWidth:0}}
                />
          </View>
      </SafeAreaView>:null
      }
      <View style={{position:'absolute',width:'100%',paddingVertical:hp(2),bottom:0,left:0,borderColor:'blue',borderWidth:0,height:'15%'}}>
         <View style={{width:'90%',borderColor:'yellow',borderWidth:0,alignSelf:'center',height:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
           <View style={{borderColor:'red',borderWidth:0}}>
           <TouchableOpacity
               onPress={singleFilePicker}
               style={{
                 borderRadius: 5,
                 alignSelf: 'center',
               
               }}>
                {
                  imageSource.length<=0?
                  <Image
                  source={{uri: lastPhoto}}
                  style={{
                    height: hp(6),
                    width: hp(6),
                    alignSelf: 'center',
                    borderRadius:5
                  }}
                />:
                <Image
                source={{
                  uri: `file://'${imageSource}`,
                }}
                style={{
                  height: hp(8),
                  width: hp(8),
                  borderRadius:5,
                 //  marginRight: hp(1),
                  alignSelf: 'center',
                }}
               />
             }
              
            </TouchableOpacity>
           </View>
           <View style={{borderColor:'green',borderWidth:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
           <TouchableOpacity
               onPress={handleTakePicture}
               style={{
                 borderRadius: 5,
                 alignSelf: 'center',
               }}>
               <Image
                 source={Images.camera_icon}
                 style={{
                   height: hp(8),
                   width: hp(8),
                   marginRight: hp(2),
                   alignSelf: 'center',
                 }}
            />
            </TouchableOpacity>
           </View>
           <View style={{borderColor:'blue',borderWidth:0}}>
           <TouchableOpacity
              //  onPress={handleTakePicture}
               style={{
                 borderRadius: 5,
                 alignSelf: 'center',
                 
                //  marginBottom: hp(3),
                //  marginTop: hp(3),
               }}>
               <Image
                 source={Images.camera_icon}
                 style={{
                   height: hp(8),
                   width: hp(8),
                  //  marginRight: hp(1),
                  display:'none',
                   alignSelf: 'center',
              
                 }}
            />
            </TouchableOpacity>
           </View>         
         </View>   
      </View>
     {/* Image preview component Start*/}
     {
      isImagePreview?
      <View style={{backgroundColor:'transparent',position:'absolute',left:0,top:0,width:'100%',height:'100%',zIndex:1,borderColor:'red',borderWidth:0}}>
        <SafeAreaView
         style={{flex:1}}>
       
       <View style={{flex:1,borderColor:'green',borderWidth:0,position:'relative'}}>
        <View style={{paddingHorizontal:hp(2),flex:.075,borderColor:'red',borderWidth:0,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <SvgCss
              xml={Svgs.cross}
              width={hp(4)}
              height={hp(4)}
              fill={Colors.white}
              onPress={() => {
              setisImagePreview(false)
              setisCameraOpen(true)
              }}
            />
            <TouchableOpacity onPress={handleSavePictureToGallery} 
             style={{borderRadius:hp(5),borderColor:'red',display:'flex',alignItems:'center',justifyContent:'center',borderWidth:0,height: hp(6),width: hp(6)}}>
              <SvgCss
              xml={Svgs.tick}
              width={hp(4)}
              height={hp(4)}
              fill={Colors.white}
            />
            </TouchableOpacity>
        </View>
       </View>   
       </SafeAreaView>
        <Image
                source={{
                  uri: `file://'${imageSource}`,
                }}
                style={{
                 borderColor:'purple',
                 borderWidth:0,
                 position:'absolute',
                 top:0,
                 left:0,
                 height:'100%',
                 width:'100%',
                 zIndex:-1
                }}
               />
      </View>
   
      :null
     }
      
     {/* Image preview component End*/}
    </View>
  )
};

export default CameraScreen;