/* istanbul ignore file */
import React, {Fragment} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';
import {bSheet} from '../screens/VitalTypeOneScreen';
import {bottomSheet} from '../screens/VitalMeasureScreen';
import {SvgBluetoothIconWhite} from '../constants';
import {Fonts} from '../../../../config/AppConfig';

export class BleCirculerView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: hp(3),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.bleLayer1,
            }}>
            Searching...
          </Text>
          <Text
            style={{
              fontSize: hp(2.5),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.gray,
              marginBottom: hp(2),
            }}>
            Looking for nearby devices
          </Text>
          <View style={styles.layer1}>
            <View style={styles.layer2}>
              <View style={styles.layer3}>
                <View style={styles.layer4}>
                  <View>
                    <SvgBluetoothIconWhite />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Text
            onPress={() => {
              this.props.type === 'one' ? bSheet.close() : bottomSheet.close();
              this.props.navigation.navigate('DevicesList');
            }}
            style={{
              fontSize: hp(2.5),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.red,
              marginTop: hp(2),
            }}>
            CANCEL
          </Text>
        </View>
      </Fragment>
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
    width: '60%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 400,
    borderColor: Colors.bleLayer4,
    borderWidth: 1,
  },
  layer2: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 400,
    borderColor: Colors.bleLayer3,
    borderWidth: 1,
  },
  layer3: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 400,
    borderColor: Colors.bleLayer2,
    borderWidth: 1,
  },
  layer4: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bleLayer1,
    width: '80%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 400,
  },
});
