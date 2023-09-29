/* istanbul ignore file */
import * as React from 'react';
import {Animated, Easing, Text, View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';

export class CallCircularView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }
  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 0,
      easing: Easing.linear,
    }).start();
  }

  render() {
    return (
      <View style={styles.layer1}>
        <View style={styles.layer2}>
          <View style={styles.layer3}>
            <LottieView
              resizeMode="cover"
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                width: '100%',
              }}
              source={require('../../../../../assets/call-ringer.json')}
              colorFilters={[
                {
                  keypath: 'button',
                  color: '#F00000',
                },
                {
                  keypath: 'Sending Loader',
                  color: '#F00000',
                },
              ]}
              autoPlay
              loop
            />
            <Text style={styles.durationText}>{this.props.textLabel}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  durationText: {
    alignSelf: 'center',
    fontFamily: Fonts.SourceSansRegular,
    color: 'white',
    fontSize: hp(2.5),
    marginTop: 10,
  },
  layer1: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.noRecordFound,
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 400,
  },
  layer2: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.noRecordFound,
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 400,
  },
  layer3: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.noRecordFound,
    width: '75%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 400,
    opacity: 0.5,
  },
});
