import React, {PureComponent} from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  View,
  PanResponder,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import ProfileService from '../api/profile';
import {removeItemValue} from './LocalStorage';

export default class UserInactivity extends React.PureComponent {
  static propTypes = {
    timeForInactivity: PropTypes.number,
    checkInterval: PropTypes.number,
    children: PropTypes.node.isRequired,
    style: ViewPropTypes.style,
    onAction: PropTypes.func.isRequired,
    navigation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeForInactivity: 10000,
    checkInterval: 2000,
    style: {
      flex: 1,
    },
  };

  state = {
    active: true,
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.resetTimeout,
      onMoveShouldSetPanResponderCapture: this
        .onMoveShouldSetPanResponderCapture,
      onStartShouldSetPanResponderCapture: this
        .onMoveShouldSetPanResponderCapture,
      onResponderTerminationRequest: this.handleInactivity,
    });
    this.handleInactivity();
  }

  componentWillUnmount() {
    clearInterval(this.inactivityTimer);
  }

  /**
   * This method is called whenever a touch is detected. If no touch is
   * detected after `this.props.timeForInactivity` milliseconds, then
   * `this.state.inactive` turns to true.
   */
  handleInactivity = () => {
    clearTimeout(this.timeout);
    // this.setState(
    //   {
    //     active: true,
    //   },
    //   () => {
    //     this.props.onAction(this.state.active); // true
    //   },
    // );
    this.resetTimeout();
    console.log('Active?', this.state.active);
  };
  /**
   * If more than `this.props.timeForInactivity` milliseconds have passed
   * from the latest touch event, then the current state is set to `inactive`
   * and the `this.props.onInactivity` callback is dispatched.
   */
  timeoutHandler = () => {
    this.setState(
      {
        active: false,
      },
      () => {
        this.props.onAction(this.state.active); // false
      },
    );
  };

  resetTimeout = () => {
    this.timeout = setTimeout(
      this.timeoutHandler,
      this.props.timeForInactivity,
    );
  };

  onMoveShouldSetPanResponderCapture = () => {
    this.handleInactivity();
    /**
     * In order not to steal any touches from the children components, this method
     * must return false.
     */
    return false;
  };

  render() {
    const {style, children} = this.props;
    return (
      <View
        style={style}
        collapsable={false}
        {...this.panResponder.panHandlers}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
