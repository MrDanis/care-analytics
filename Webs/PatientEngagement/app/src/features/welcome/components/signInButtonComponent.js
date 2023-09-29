import React from 'react';
import {Text, Image, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';

const SignInButton = props => {
  return (
    <View
      style={{
        // height: hp(14.4),
        // width: '100%',
        backgroundColor: Colors.white,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        borderColor: Colors.black,
        borderRadius: Platform.OS == 'ios' ? 20 : 10,
        // borderWidth: 0.166,
        marginTop: hp(2.5),
        elevation: 4,
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.08,
        shadowRadius: 10,
        paddingHorizontal: hp(1.8),
      }}>
      <View
        style={{
          marginVertical: hp(4),
          //   flexDirection: 'column',
          alignItems: 'center',
          // backgroundColor: Colors.white,
          //   width: '92%',
          //   alignContent: 'center',
          //   alignSelf: 'center',
          //   marginBottom:30,
        }}>
        {props.text === 'Email Address' ? (
          <Image
            source={props.image}
            style={{
              height: hp(3.6),
              width: hp(3.5),
              resizeMode: 'contain',
              // marginBottom: hp(1),
            }}
          />
        ) : (
          <Image
            source={props.image}
            style={{
              height: hp(3.6),
              width: hp(3.5),
              resizeMode: 'contain',
            }}
          />
        )}

        {props.text === 'Email Address' ? (
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Fonts.SourceSansSemibold,
              fontSize: hp(2.1),
              color: Colors.black,
            }}>
            {props.text}
          </Text>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Fonts.SourceSansSemibold,
              fontSize: hp(2.1),
              paddingHorizontal: 28,
              paddingTop: 10,
              color: Colors.black,
            }}>
            {props.text}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SignInButton;
