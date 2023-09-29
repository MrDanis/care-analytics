/* istanbul ignore file */
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';

export class CircleText extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let textColor = this.props.textColor ? this.props.textColor : 'white';
    let fillColor = this.props.fillColor
      ? this.props.fillColor
      : 'rgba(120,142,197,1)';

    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: fillColor,
          width: '95%',
          aspectRatio: 1,
          alignSelf: 'center',
          borderRadius: 400,
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: hp(3.5),
            color: textColor,
            fontFamily: 'Roboto-Medium',
            alignSelf: 'center',
            padding: hp(0.1),
          }}>
          {this.props.textLabel}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textLabel: {
    fontSize: hp(2),
    color: Colors.white,
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    padding: 15,
  },
});
