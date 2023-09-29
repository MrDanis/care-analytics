import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Colors} from '../../../../../config';
import StepFeetIcon from '../../../../../../assets/svg/stepFeetIcon';
import {Fonts} from '../../../../../config/AppConfig';
const ActivitiesHeadingComponent = ({stepsTaken, distanceWalked,stepHealth}) => {
  return (
    <View
      style={{
        marginHorizontal: hp(1.6),
        marginTop: hp(2.5),
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: Colors.black,
        }}>
        Activities
      </Text>
      <View
        style={{
          marginTop: hp(1),
          marginBottom: hp(1.5),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <View
          style={{
            flex: 0.43,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <StepFeetIcon />
            <Text
              style={{
                fontSize: hp(1.8),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.black,
              }}>
              {'  '}
              {stepHealth}
            </Text>
            <Text
              style={{
                fontSize: hp(1.4),
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.stepsGrey,
              }}>
              {' '}
              Steps
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: hp(1.8),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.black,
                marginLeft: hp(3),
              }}>
              {parseFloat(distanceWalked.toFixed(1))}{' '}
            </Text>
            <Text
              style={{
                fontSize: hp(1.4),
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.stepsGrey,
              }}>
              Miles
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: hp(1.4),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.noRecordFound,
            }}>
            3 Min ago
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center',
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <View
            style={{
              // backgroundColor: '#00B8D4',
              marginHorizontal: 4,
              width: 1,
              height: hp(1.4),
              borderLeftColor: '#D9D9D9',
              borderLeftWidth: 1,
              justifyContent: 'center',
            }}></View>
        </View> */}
      </View>
    </View>
  );
};

export default ActivitiesHeadingComponent;

const styles = StyleSheet.create({});
