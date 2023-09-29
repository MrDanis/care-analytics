import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

const MyCareModules = ({image, name, navigation, Module}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('====================================');
        console.log('Module', Module);
        console.log('====================================');
        if (Module === 'V') {
          navigation.navigate('Vitals');
        } else {
          navigation.navigate('Assessment');
        }
      }}
      style={{
        backgroundColor: Colors.white,
        borderRadius: 8,
        flex: 1,
        height: hp(17),
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
        justifyContent: 'space-evenly',
        marginHorizontal: hp(1),
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
          source={image}
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
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyCareModules;
