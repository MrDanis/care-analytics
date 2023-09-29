/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import MyIcon from '../../../../../assets/svg/illustration_group_meds.svg';
import StarIcon from '../../../../../assets/svg/illustration_medal.svg';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
import moment from 'moment';

export class MedicationTargetCompleted extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <View style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              this.props.myProps.navigation.navigate('AllMedication');
            }}
            style={{flexDirection: 'row', marginTop: hp(2)}}>
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                fontSize: hp(2.2),
                marginLeft: hp(2),
                flex: 1,
                color: Colors.black1,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.NunitoSemiBold,
                marginLeft: heightPercentageToDP(2),
                fontSize: hp(2),
                color: Colors.blueHeadingColor,
              }}>
              View All
            </Text>
            <Text
              style={{
                fontFamily: 'WisemanPTSymbols',
                marginLeft: hp(1),
                marginRight: heightPercentageToDP(2),
                fontSize: hp(3),
                color: Colors.black3,
                alignSelf: 'center',
              }}>
              X
            </Text>
          </TouchableOpacity>
          {/*<View*/}
          {/*  style={{*/}
          {/*    justifyContent: 'center',*/}
          {/*    alignItems: 'center',*/}
          {/*    marginTop: heightPercentageToDP(10),*/}
          {/*  }}>*/}
          {/*  <MyIcon*/}
          {/*    width={heightPercentageToDP(51.3)}*/}
          {/*    height={heightPercentageToDP(40)}*/}
          {/*    fill="#000"*/}
          {/*  />*/}
          {/*</View>*/}
          {/*<View*/}
          {/*  style={{*/}
          {/*    position: 'absolute',*/}
          {/*    top: Platform.OS === 'android' ? 220 : 180,*/}
          {/*    left: '30%',*/}
          {/*    zIndex: 1,*/}
          {/*    width: '40%',*/}
          {/*    height: 150,*/}
          {/*  }}>*/}
          {/*  <StarIcon*/}
          {/*    width={heightPercentageToDP(10)}*/}
          {/*    height={heightPercentageToDP(10)}*/}
          {/*    fill="#000"*/}
          {/*    style={{alignSelf: 'center'}}*/}
          {/*  />*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      alignSelf: 'center',*/}
          {/*      fontFamily: Fonts.NunitoBold,*/}
          {/*      marginLeft: heightPercentageToDP(1),*/}
          {/*      fontSize: 18,*/}
          {/*      color: Colors.green,*/}
          {/*    }}>*/}
          {/*    Superb*/}
          {/*  </Text>*/}
          {/*</View>*/}
          <View style={{marginTop: hp(7) , alignSelf:'center', height:400, alignItems:'center', justifyContent:'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.SourceSansBold,
                marginLeft: heightPercentageToDP(5),
                marginRight: heightPercentageToDP(5),
                fontSize: 24,
                color: Colors.blueHeadingColor,
              }}>
              No More Medication for Today
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.NunitoRegular,
                marginTop: heightPercentageToDP(3.5),
                marginLeft: heightPercentageToDP(5),
                marginRight: heightPercentageToDP(5),
                fontSize: 14,
                color: '#BDBDBD',
              }}>
              {moment(new Date()).format('LLLL')}
            </Text>
          </View>
        </View>
      </Fragment>
    );
  }
}
