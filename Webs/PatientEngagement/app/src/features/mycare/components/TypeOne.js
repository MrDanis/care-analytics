/* istanbul ignore file */
import React, {Fragment} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CardView from 'react-native-cardview';
import {CustomSlider} from './CustomSlider';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';

export class TypeOne extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <View style={styles.container}>
          <View
            style={{
              margin: hp(1),
              backgroundColor: Colors.lightGrey1,
            }}>
            <CardView
              style={{
                backgroundColor: 'white',
              }}
              cardElevation={2}
              cardMaxElevation={2}
              cornerRadius={5}>
              <View
                style={{
                  flexDirection: 'column',
                  padding: hp(2),
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(3),
                      color: Colors.black,
                    }}>
                    Name
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(3),
                      color: Colors.black,
                    }}>
                    Unit
                  </Text>
                </View>

                <View style={{height: hp(17)}}>
                  <CustomSlider index={5} />
                </View>
              </View>
            </CardView>
          </View>
        </View>
      </Fragment>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey1,
    flexDirection: 'column',
  },
});
