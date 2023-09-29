import {View, Text} from 'react-native';
import React from 'react';
import {Colors} from '../../../../../config';
import {Fonts} from '../../../../../config/AppConfig';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CoverageDetailsCard = ({coverageDetailsName, coverageDetailsValue}) => {
  return (
    <>
      <Text
        style={{
          fontFamily: Fonts.SourceSansSemibold,
          color: Colors.noRecordFound,
          fontSize: hp(2),
          marginVertical: hp(2),
          marginHorizontal: hp(1),
        }}>
        {coverageDetailsName}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.SourceSansSemibold,
          color: Colors.black4,
          fontSize: hp(2),
          marginBottom: hp(2),
          marginHorizontal: hp(1),
        }}>
        {coverageDetailsName === 'Consumed Amount (Last 12 Months)' ||
        coverageDetailsName === 'Uncovered Services Amount'
          ? '$' + coverageDetailsValue
          : coverageDetailsValue}
      </Text>
    </>
  );
};

export default CoverageDetailsCard;
