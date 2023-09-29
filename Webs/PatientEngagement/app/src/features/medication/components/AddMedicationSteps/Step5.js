/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, View, TouchableOpacity, Platform} from 'react-native';
import {Fonts} from '../../../../../config/AppConfig';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import {MedicationIndicator} from '../MedicationIndicator';
import MorningIcon from '../../../../../../assets/svg/illustration_morning.svg';
import MedBlueIcon from '../../../../../../assets/svg/illustration_meds_blue_1.svg';
import AlertIcon from '../../../../../../assets/svg/illustration_alert_not_taken.svg';

export class Step5 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {selectedIndex: -1};
  }

  render() {
    return (
      <Fragment>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: hp(1),
              marginBottom: hp(2),
              alignSelf: 'center',
            }}>
            <MedicationIndicator index={5} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MedBlueIcon
              width={heightPercentageToDP(9)}
              height={heightPercentageToDP(9)}
              fill="#000"
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  fontFamily: Fonts.NunitoBold,
                  marginRight: hp(7),
                  marginLeft: hp(2),
                  fontSize: hp(3),
                  color: Colors.black1,
                  textTransform: 'capitalize',
                }}>
                {global.selectedData.fdaMedicine.proprietaryname}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.NunitoRegular,
                  marginLeft: hp(2),
                  fontSize: hp(2.2),
                  color: Colors.black2,
                }}>
                {global.selectedData.fdaMedicine.strength}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(3),
              marginBottom: hp(3),
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoSemiBold,
                fontSize: hp(2.2),
                flex: 1,
                color: Colors.black1,
              }}>
              Frequency
            </Text>
            <Text
              style={{
                fontFamily: Fonts.NunitoRegular,
                marginLeft: heightPercentageToDP(5),
                fontSize: hp(2.2),
                color: Colors.black2,
              }}>
              {global.selectedData.frequencyLabel}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: Colors.line,
              marginRight: hp(2),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(3),
              marginBottom: hp(3),
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoSemiBold,
                fontSize: hp(2.2),
                flex: 1,
                color: Colors.black1,
              }}>
              Timings
            </Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {global.selectedData.doseTimings.map(time => {
                return (
                  <Text
                    key={Math.random().toString(36).substr(2, 9)}
                    style={{
                      marginRight: hp(0.5),
                      fontFamily: Fonts.NunitoRegular,
                      fontSize: hp(2.2),
                      color: Colors.black2,
                    }}>
                    {time}
                  </Text>
                );
              })}
            </View>
          </View>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: Colors.line,
              marginRight: hp(2),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(3),
              marginBottom: hp(3),
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoSemiBold,
                fontSize: hp(2.2),
                flex: 1,
                color: Colors.black1,
              }}>
              Advice
            </Text>
            <Text
              style={{
                fontFamily: Fonts.NunitoRegular,
                marginLeft: heightPercentageToDP(5),
                fontSize: hp(2.2),
                color: Colors.black2,
              }}>
              {global.selectedData.mealStatus === 0
                ? 'Before Meal'
                : 'After Meal'}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: Colors.line,
              marginRight: hp(2),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(3),
              marginBottom: hp(3),
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoSemiBold,
                fontSize: hp(2.2),
                flex: 1,
                color: Colors.black1,
              }}>
              End Date
            </Text>
            <Text
              style={{
                fontFamily: Fonts.NunitoRegular,
                marginLeft: heightPercentageToDP(5),
                fontSize: hp(2.2),
                color: Colors.black2,
              }}>
              {global.selectedData.endDate === null
                ? 'Never'
                : new Date(global.selectedData.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Fragment>
    );
  }
}
