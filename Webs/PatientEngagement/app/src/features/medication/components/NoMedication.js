/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import MyIcon from '../../../../../assets/svg/no_medication.svg';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';

export class NoMedication extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: heightPercentageToDP(6),
            }}>
            <MyIcon
              width={heightPercentageToDP(50)}
              height={heightPercentageToDP(25)}
              fill="#000"
            />
          </View>
          <View style={{flex: 1}} />
          <View style={{marginBottom: hp(7)}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.NunitoRegular,
                marginLeft: heightPercentageToDP(5),
                marginRight: heightPercentageToDP(5),
                fontSize: hp(2.2),
                color: Colors.black2,
              }}>
              Keep track your medication
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.NunitoBold,
                marginTop: heightPercentageToDP(2),
                marginLeft: heightPercentageToDP(5),
                marginRight: heightPercentageToDP(5),
                fontSize: hp(2.5),
                color: Colors.black1,
              }}>
              Schedule your medication and track them easily!
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.myProps.navigation.navigate('AddNewMedication');
              }}
              style={{
                width: '65%',
                marginTop: hp(5),
                marginBottom: hp(2),
                height: hp(7),
                alignSelf: 'center',
                borderRadius: 5,
                borderColor: Colors.cyan,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.blueTextColor,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NunitoBold,
                  fontSize: hp(2.6),
                  color: Colors.white,
                }}>
                Add Medication
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Fragment>
    );
  }
}
