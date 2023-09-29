import {View, Text, Image} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import {Colors} from '../../../../config';

const FooterModules = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          // onPress={() => {
          //   console.log('====================================');
          //   console.log('Module', Module);
          //   console.log('====================================');
          //   if (Module === 'V') {
          //     navigation.navigate('Vitals');
          //   } else {
          //     navigation.navigate('Assessment');
          //   }
          // }}
          style={{
            backgroundColor: Colors.white,
            borderRadius: 8,
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 10,
            marginHorizontal: hp(1),
            marginVertical: hp(2.5),
            minWidth: '46%',
            height: hp(17),
          }}>
          <View
            style={{
              height: '60%',
            }}>
            <Image
              style={{
                width: 32,
                height: 32,
                marginLeft: hp(2.5),
                marginTop: hp(1.5),
                resizeMode: 'contain',
              }}
              source={require('../../../../../assets/images/icon_appointments.png')}
            />
          </View>
          <View
            style={{
              height: '40%',
              justifyContent: 'flex-end',
              flex: 1,
            }}>
            <Text
              style={{
                marginHorizontal: hp(2.5),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.blueGrayDisableText,
                fontSize: hp(2.3),
                marginBottom: hp(2),
              }}>
              Appointments
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Medication')}
          style={{
            backgroundColor: Colors.white,
            borderRadius: 8,
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 10,
            marginHorizontal: hp(1),
            marginVertical: hp(2.5),
            minWidth: '46%',
            height: hp(17),
          }}>
          <View
            style={{
              height: '60%',
            }}>
            <Image
              style={{
                width: 32,
                height: 32,
                marginLeft: hp(2.5),
                marginTop: hp(1.5),
                resizeMode: 'contain',
              }}
              source={require('../../../../../assets/images/Medication_colored.png')}
            />
          </View>
          <View
            style={{
              height: '40%',
              justifyContent: 'flex-end',
              flex: 1,
            }}>
            <Text
              style={{
                marginHorizontal: hp(2.5),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.blueGrayDisableText,
                fontSize: hp(2.3),
                marginBottom: hp(2),
              }}>
              Medication
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FooterModules;
