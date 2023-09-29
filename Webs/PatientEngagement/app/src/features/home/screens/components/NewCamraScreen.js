import React,{useState,useRef,useEffect} from 'react';
import {View,Text,Button,Linking,BackHandler,Platform,StyleSheet,TouchableOpacity,Image,ActivityIndicator, PermissionsAndroid, Alert} from 'react-native';
import { Camera,useCameraDevices} from 'react-native-vision-camera';
import { useCamera } from 'react-native-vision-camera';
import {Colors, Images, Svgs} from '../../../../../config';
import {SvgCss} from 'react-native-svg';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {modalHanlder} from '../../../medication/actions';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import * as ImagePicker from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/native';
const NewCamraScreen =({navigation,isCamera,setIsCamera,dispatch}) => {
  // const { camera:camraCheck, status } = useCamera();
  // const { camera:pictureCheck, status } = useCamera();
  const camera = useRef(null);
  const [imageSource, setImageSource] = useState('');
  const [lastPhoto,setLastPhoto] = useState()
  const [isImagePreview,setisImagePreview] = useState(false);
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;

  const handleTakePicture = async () => {
    console.log('Called to take the picture .......');  
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      console.log('Path of the photo is : ',photo.path);
      setImageSource(photo.path);
      setisImagePreview(true);
      // setShowCamera(false);
    }
  }
  const handleShowLastPicture = async() =>{
    // console.log('I am called to get the last taken picture : ',Platform.OS);
    
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
  const handleOpenGalleryAndSelectImage = ()=>{
    const options = {
      mediaType: 'photo', // Set the media type to 'photo' to select only photos
    };
    ImagePicker.launchImageLibrary(options).then((res)=>{console.log('Library response is : ',res)})
  }
  const  handleSavePictureToGallery = () => {
    console.log('Save the image to the gallery :',imageSource)
    CameraRoll.save(imageSource).then((res)=>{
       if(res)
       {
        setisImagePreview(false);
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
        isActive={true}
        photo={true}
        
      />
      <View style={{position:'absolute',width:'100%',paddingVertical:hp(2),top:0,left:0,borderColor:'green',borderWidth:0,height:'10%',alignItems: 'flex-end'}}>
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
      <View style={{position:'absolute',width:'100%',paddingVertical:hp(2),bottom:0,left:0,borderColor:'blue',borderWidth:0,height:'15%'}}>
         <View style={{width:'90%',borderColor:'yellow',borderWidth:0,alignSelf:'center',height:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
           <View style={{borderColor:'red',borderWidth:0}}>
           <TouchableOpacity
               onPress={handleOpenGalleryAndSelectImage}
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
       <View style={{flex:1,borderColor:'green',borderWidth:0,position:'relative'}}>
        <View style={{paddingHorizontal:hp(2),flex:.075,borderColor:'red',borderWidth:0,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <SvgCss
              xml={Svgs.cross}
              width={hp(4)}
              height={hp(4)}
              fill={Colors.white}
              onPress={() => {
              setisImagePreview(false)
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
      </View>
      :null
     }
      
     {/* Image preview component End*/}
    </View>
  )
};

export default NewCamraScreen;



// <>
// {
//     showCam?(
//         <>
//     <Camera
//     ref={camera}
//     style={StyleSheet.absoluteFill}
//     device={device}
//     isActive={true}
//     photo={true}
//   />
//   <View style={{
//    backgroundColor: 'rgba(0,0,0,0.2)',
//    position: 'absolute',
//    display:'flex',
//    flexDirection:'row',
// //    justifyContent: 'center',
// //    alignItems: 'center',
//    width: '100%',
//    bottom: 0,
//    padding: 20,
//    borderColor:'red',
//    borderWidth:0
//    }}>
//     <View style={{width:'20%',borderColor:'red',borderWidth:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
//     <TouchableOpacity
//         // onPress={() => singleFilePicker()}
//         style={{
//           width: hp(6),
//           height: hp(6),
//           borderRadius: 10,
//               //   marginLeft: hp(3),  source={{uri:imageSource}}
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         {
//              imageSource.length===0?
//              <Image
//              source={{uri:imageSource}}
//                style={{
//                   height: hp(6),
//                   width: hp(6),
//                   alignSelf: 'center',
//                   borderColor:'red',
//                   borderWidth:2,
//                   borderRadius:50
//                 }}
//             />
//             :
//             <Image
//             source={{
//                 uri: `file://'${imageSource}`,
//               }}
//             style={{
//                 height: hp(6),
//                 width: hp(6),
//                 alignSelf: 'center',
//               }}
//         />
//         }
       
//     </TouchableOpacity>
//     </View>
//     <View style={{width:'80%',borderColor:'green',borderWidth:2}}>
//     <TouchableOpacity
//         onPress={handleTakePicture}
//         style={{
//           borderRadius: 5,
//           alignSelf: 'center',
//           marginBottom: hp(3),
//           marginTop: hp(3),
//         }}>
//         <Image
//           source={Images.camera_icon}
//           style={{
//             height: hp(10),
//             width: hp(10),
//             marginRight: hp(1),
//             alignSelf: 'center',
//           }}
//         />
//       </TouchableOpacity>
//     </View>


//     {/* <Button 
//      style={{
//         height: 80,
//         width: 80,
//         borderRadius: 40,
//         backgroundColor: '#B2BEB5',
//         alignSelf: 'center',
//         borderWidth: 4,
//         borderColor: 'white',
//      }}
//     title='Take Picture'
//     onPress={handleTakePicture}></Button> */}
//     {/* <TouchableOpacity
//       style={{height: 80,
//         width: 80,
//         borderRadius: 40,
//         backgroundColor: '#B2BEB5',
//         alignSelf: 'center',
//         borderWidth: 4,
//         borderColor: 'white',}}
//     //   onPress={() => capturePhoto()}
//     /> */}

//   </View>
//   </>
//     ):        
// <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
//     <Text>This is my Custom Camra</Text>
//     <Button onPress={handleOpenCamera} title='Open Camera'></Button>   
// </View>
// }

// </>