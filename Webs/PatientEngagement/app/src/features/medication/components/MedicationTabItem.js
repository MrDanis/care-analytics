import {View, Text, Image, Platform} from 'react-native';
import React, {navigation} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

import {TouchableOpacity} from 'react-native-gesture-handler';

const MedicationTabItem = props => {
  return (
    <TouchableOpacity onPress={props.navigation}>
      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: 8,
          height: hp(12),
          shadowOffset: {width: 0.5, height: 0.5},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: Platform.OS=== 'ios'?10:0,
          justifyContent: 'flex-start',
          marginHorizontal: hp(1),
          marginVertical: hp(2),
        }}>
        <View style={{marginTop: hp(1.5)}}>
          <Image
            style={{
              width: 40,
              height: 40,
              marginLeft: hp(1.5),
              marginRight: hp(2.5),
            }}
            source={props.iconimage}
          />
        </View>
        <Text
          style={{
            marginLeft: hp(1.5),
            marginRight: hp(2.5),
            marginTop: hp(1),
            fontFamily: Fonts.SourceSansRegular,
            color: Colors.black,
            fontSize: 14,
          }}>
          {props.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default connect()(MedicationTabItem);
