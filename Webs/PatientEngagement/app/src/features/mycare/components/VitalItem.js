/* istanbul ignore file */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Image,
  Easing,
  Platform,
} from 'react-native';
import Colors from '../../../../config/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RoundedBtn} from '../../welcome/components/RoundedBtn';
import {Fonts} from '../../../../config/AppConfig';

export class VitalItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animated: new Animated.Value(0),
      opacityA: new Animated.Value(1),
    };
  }
  componentDidMount(): void {
    const {animated, opacityA} = this.state;

    Animated.loop(
      Animated.parallel([
        Animated.timing(animated, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
        }),
        Animated.timing(opacityA, {
          toValue: 0,
          duration: 2000,
        }),
      ]),
    ).start();
  }
  goToVitalMeasureScreen() {
    if (this.props.item.Id === 1) {
      console.log(this.props.item.Name);
      this.props.navigation.navigate('MeasureVital', {
        VitalId: this.props.item.Id,
        Name: this.props.item.Name,
      });
    } else {
      console.log('come in type one');
      (global.VitalId = this.props.item.Id),
        this.props.navigation.navigate('MeasureTypeOne', {
          VitalId: this.props.item.Id,
          Name: this.props.item.Name,
        });
    }
  }
  goToVitalHistoryScreen() {
    this.props.navigation.navigate('VitalHistory', {
      item: this.props.item,
    });
  }

  render() {
    const {animated, opacityA} = this.state;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.white,
          margin: 0.5,
          flex: 0.5,
          flexDirection: 'column',
        }}
        onPress={() => this.goToVitalHistoryScreen()}>
        {this.props.item && this.props.item.IsCritical ? (
          <View style={{marginTop: 5, marginLeft: 5}}>
            <Animated.View
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: 'rgba(122,0,0,0.9)',
                opacity: opacityA,
                transform: [{scale: animated}],
              }}
            />
            <Text
              style={{
                width: 30,
                height: 30,
                marginLeft: 8,
                marginTop: 7,
                borderRadius: 15,
                position: 'absolute',
                overflow: 'hidden',
                left: 0,
                top: 0,
                backgroundColor: Colors.red,
                fontFamily: 'WisemanPTSymbols',
                fontSize: 30,
                paddingTop: Platform.OS === 'ios' ? hp(0) : hp(0.7),
                color: Colors.white,
                textAlign: 'center',
              }}>
              -
            </Text>
          </View>
        ) : null}

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', width: 90, paddingTop: hp(5)}}>
            <View style={{flex: 1}} />
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2),
                color: Colors.fontGrey,
              }}>
              {this.props.item.Unit}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image style={styles.image} source={{uri: this.props.item.Icon}} />
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                fontSize: hp(4),
                color: Colors.black,
              }}>
              {this.props.item.Value}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              marginTop: hp(1),
              marginBottom: hp(1),
              fontSize: hp(2.5),
              color: Colors.fontGrey,
            }}>
            {this.props.item.Name}
          </Text>
          <RoundedBtn
            title="Measure"
            onPress={() => this.goToVitalMeasureScreen()}
            style={{
              width: 100,
              height: 35,
              marginBottom: hp(2),
              borderRadius: 25,
              borderWidth: 2,
              borderColor: this.props.item.Color,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.white,
            }}
            textStyle={{
              fontSize: 15,
              color: this.props.item.Color,
              fontFamily: Fonts.SourceSansRegular,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
    flexDirection: 'column',
  },
  image: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginRight: hp(1),
  },
});
