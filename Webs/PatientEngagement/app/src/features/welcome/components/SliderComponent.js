import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Colors from '../../../../config/Colors';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MyIcon from '../../../../../assets/svg/illustration_health_mate.svg';

export class SliderComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.slideContainer}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={this.props.data.image}
            style={{
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 24,
            padding: 5,
            marginBottom: heightPercentageToDP(3),
            marginTop: heightPercentageToDP(3),
            color: Colors.colorPrimary,
          }}>
          {this.props.data.title}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.SourceSansRegular,
            marginBottom: heightPercentageToDP(3),
            fontSize: 17,
            marginLeft: wp(3),
            marginRight: wp(3),
            textAlign: 'center',
            color: Colors.lineGrey,
          }}>
          {this.props.data.text}
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
