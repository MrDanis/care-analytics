import React,{Fragment} from 'react'
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
  import FastImage from 'react-native-fast-image';
  import {Colors,Images} from '../../../../config';

  import FindDocMainHeader from './components/findDocMainHeader';
  import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
const FindDoctorSearch = ({navigation}) => {
  const handleGoTodoctorSearch = () =>{
    navigation.navigate('FoundDoctor');
  }
  return (
    <Fragment>
      <StatusBar backgroundColor={Colors.BgColor} barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.BgColor,
        }}>
        <FindDocMainHeader name={"Find a Doctor"} navigation={navigation}>
          <View style={styles.container}>
            <View style={styles.content}>
            <FastImage
                style={{
                  width: hp(18),
                  height: hp(18),
                  // marginRight:-20,
                  // marginHorizontal: hp(3),
                  // marginTop:10,
                }}
                source={Images.finDoc}
              />
              <View style={{borderColor:'green',borderWidth:0,width:'80%'}}> 
                <Text style={{marginTop:hp(5),fontSize:hp(2.4),fontWeight:'bold'}}>
                    According to our assessment you need a 
                    <Text style={{marginLeft:hp(1.5),color:Colors.blueTextColor}}>
                       {' '}Cardiologist
                    </Text>
                </Text>  
              </View>
              <View style={{width:'100%',marginTop:hp(4)}}>
            <TouchableOpacity style={styles.buttonContainerButton} onPress={handleGoTodoctorSearch}>
              <Text style={styles.buttonContainerButtonText}>
              Let’s find a Doctor
              </Text>
           </TouchableOpacity>
            </View>
            </View>
            <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.buttonContainerButton} onPress={handleGoBack}>
              <Text style={styles.buttonContainerButtonText}>
              Let’s find a Doctor
              </Text>
           </TouchableOpacity> */}
            </View>
          </View>
        </FindDocMainHeader>
      </SafeAreaView>
   </Fragment>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'space-between',
      padding: 16, 
    },
    content: {
      flex: 1,
      alignItems:'center',
      justifyContent:'center' 
    },
    buttonContainer: {
      borderColor:'red',
      borderWidth:0
      
    },
    buttonContainerButton:{
      padding:hp(2),
      borderRadius: hp(1),
      backgroundColor:Colors.blueTextColor,
      
      justifyContent: 'center',
      alignItems: 'center', 
    },
    buttonContainerButtonText: {
      color: 'white', // Text color
      fontSize: 18,
      fontWeight: 'normal',
    }
    
  });
export default FindDoctorSearch
