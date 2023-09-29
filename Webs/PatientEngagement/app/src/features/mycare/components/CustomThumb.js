/* istanbul ignore file */
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Colors from '../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';

class CustomThumb extends React.Component {
  render() {
    return (
      <View style={{height: 90, justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: 20,
              height: 0.5,
              backgroundColor: Colors.fontGrey,
              alignSelf: 'center',
            }}
          />
          {this.props.selected % 5 ? (
            <View style={[styles.itemStyleNormal]} />
          ) : (
            <View style={[styles.itemStyleFive]} />
          )}

          <View
            style={{
              width: 20,
              height: 0.5,
              backgroundColor: Colors.fontGrey,
              alignSelf: 'center',
            }}
          />
        </View>
        {this.props.selected === 0 ||
        this.props.selected === this.props.length - 1 ? (
          <View
            style={{
              alignSelf: 'center',
              position: 'absolute',
              bottom: 0,
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                paddingTop: 20,
                fontSize: hp(2),
                color: Colors.fontGrey,
              }}>
              {this.props.item}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 30,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  wrapperHorizontal: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    color: 'black',
  },
  itemStyleFive: {
    width: 10,
    height: 10,
    backgroundColor: Colors.darkGrey,
    borderRadius: 5,
    alignSelf: 'center',
  },
  itemStyleNormal: {
    width: 6,
    height: 6,
    paddingTop: 5,
    backgroundColor: Colors.darkGrey,
    borderRadius: 3,
    alignSelf: 'center',
  },
});

export default CustomThumb;
