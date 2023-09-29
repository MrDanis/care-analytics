/* istanbul ignore file */
import React, {Component} from 'react';
import {Animated, Easing, StyleSheet, View, Text} from 'react-native';
import Colors from '../../config/Colors';

export class LoadingView extends React.PureComponent {
  constructor() {
    super();
    this.transformView = new Animated.Value(0);
  }
  /* istanbul ignore next */
  componentDidMount() {
    this.StartImageRotateFunction();
  }
  /* istanbul ignore next */
  StartImageRotateFunction() {
    this.transformView.setValue(0);
    Animated.timing(this.transformView, {
      toValue: -5,
      duration: 3000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => this.StartImageRotateFunction());
  }
  /* istanbul ignore next */
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Animated.View
          style={[
            styles.bgViewLayout,
            {
              transform: [
                {
                  rotateY: this.transformView.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}>
          <Text
            style={{
              fontFamily: 'WisemanPTSymbols',
              fontSize: 80,
              color: Colors.white,
            }}>
            C
          </Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgViewLayout: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
