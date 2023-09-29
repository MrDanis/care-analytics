import React,{Fragment} from 'react'
import {
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
  } from 'react-native';
import Colors from '../../../../config/Colors';
import FindDocMainHeader from './components/findDocMainHeader';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
const FindDoctorDashboard = ({navigation}) => {
  const handleGoBack = ()=>{
    console.log('Handling go back navigation : ',navigation)
    navigation.navigate('FindDocSearch');
    // navigation.pop();
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
                {/* <Text>This is the content box</Text> */}
            </View>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonContainerButton} onPress={handleGoBack}>
              <Text style={styles.buttonContainerButtonText}>
                  Submit Assesment
              </Text>
           </TouchableOpacity>
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
    // borderColor:'red',
    // borderWidth:2,
    // height:hp(1)
  },
  
});

export default FindDoctorDashboard
