import React,{Fragment,useState,useEffect} from 'react'
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
  import {Colors,Images} from '../../../../config';
  import LottieView from 'lottie-react-native';
  import {
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import FindDocMainHeader from './components/findDocMainHeader';
  import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
const FoundDoctor = ({navigation}) => {
    const [isDoctorFound,setisDoctorFound] = useState(false);
    const [viewType,setviewType] = useState('map');
    const [mapMarkerLocation,setmapMarkerLocation] = useState({
        lat:37.78825,
        lon:-122.4324,
        markersList:[{
            id: 1,
            coordinate: {
              latitude: 37.78825,
              longitude: -122.4324,
            },
            title: 'Marker 1',
            description: 'This is Marker 1',
          },
          {
            id: 2,
            coordinate: {
              latitude: 37.75825,
              longitude: -122.4624,
            },
            title: 'Marker 2',
            description: 'This is Marker 2',
        }]
    });
    useEffect(()=>{
        setisDoctorFound(true);
        setTimeout(()=>{
            setisDoctorFound(false);
        },5000);
    },[])
    return (
        <Fragment>
        <StatusBar backgroundColor={Colors.BgColor} barStyle="dark-content" />
        <SafeAreaView  
        style={{
          flex: 1,
          backgroundColor: Colors.BgColor,
        }} >
        {/* <FindDocMainHeader name={"Find a Doctor"} navigation={navigation}>
        </FindDocMainHeader>    */}
         {
            isDoctorFound?
            <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:hp(-3)}}>
              <LottieView
                  source={require('../../../../../assets/animations/findDocAnimation.json')}
                  autoPlay
                  loop
                />
            </View>:
         <View style={{flex:1,borderColor:'red',borderWidth:0,position:'relative'}} collapsable={false} >
         <View style={{width:'100%',position:'absolute',borderColor:'green',borderWidth:0,zIndex:1}}>
         <FindDocMainHeader name={"Doctor"} navigation={navigation} />
         </View>
            <MapView
            initialCamera={{
                center:{
                    latitude: parseFloat(mapMarkerLocation.lat),
                    longitude:parseFloat(mapMarkerLocation.lon)
                },
                pitch: 45,
                heading: 90,
                altitude: 1000,
                zoom: 17,
            }}
             provider={PROVIDER_GOOGLE}
             style={{flex:1}}
            >
             {
                mapMarkerLocation.markersList.map((item,index)=>{
                    return(
                     <Marker
                     key={item?.id}
                     coordinate={item?.coordinate}
                     title={item?.title}
                     description={item?.description}
        /> 
                    )
                })
             }
            </MapView>
         </View>
         }
         
        </SafeAreaView>

    </Fragment>
  )
}

export default FoundDoctor
