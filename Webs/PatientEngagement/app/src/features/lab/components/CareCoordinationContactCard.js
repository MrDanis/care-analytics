import {View, Text, Image} from 'react-native';
import React, {Fragment} from 'react';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import Images from '../../../../config/Images';

import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import colors from '../../../../config/Colors';
import images from '../../../../config/Images';

class CareCoordinationContactCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <View
          style={{
            backgroundColor: colors.white,
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 50,
              height: 50,
              marginLeft: hp(2),
              // marginTop: hp(1.5),
              resizeMode: 'contain',
            }}
            source={this.props.iconimage}
          />
          <View>
            <Text
              style={{
                marginHorizontal: hp(2),
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.black,
                fontSize: hp(2),
              }}>
              {this.props.name}
            </Text>
            <Text
              style={{
                marginHorizontal: hp(2),
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.blueGrayDisableText,
                fontSize: hp(2),
              }}>
              {this.props.roleName}
            </Text>
          </View>
        </View>
      </>
    );
  }
}

export default CareCoordinationContactCard;
