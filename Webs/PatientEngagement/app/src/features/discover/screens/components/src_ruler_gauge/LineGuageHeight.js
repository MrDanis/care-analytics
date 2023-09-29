import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, ScrollView, Dimensions, Text, View} from 'react-native';
import times from 'lodash.times';
import {Colors} from '../../../../../../config';

const GAUGE_WIDTH = Math.floor(Dimensions.get('window').width) * 0.8;
const INTERVAL_WIDTH = 18;

const scale = (v, inputMin, inputMax, outputMin, outputMax) => {
  return Math.round(
    ((v - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
      outputMin,
  );
};

export default class LineGaugeHeight extends React.Component {
  constructor(props) {
    super(props);

    this._handleScroll = this._handleScroll.bind(this);
    this._handleScrollEnd = this._handleScrollEnd.bind(this);
    this._handleContentSizeChange = this._handleContentSizeChange.bind(this);

    this.scrollMin = 0;
    this.scrollMax = this._getScrollMax(props);
    this._scrollQueue = null;
    this._value = props.value || props.min;

    this.state = {
      contentOffset: this._scaleValue(this._value),
    };
  }

  _contentSizeWillChange(nextProps) {
    let {min, max} = nextProps;
    if (min !== this.props.min || max !== this.props.max) {
      return true;
    }

    return false;
  }

  _getScrollMax(props = this.props) {
    return (props.max - props.min) * INTERVAL_WIDTH;
  }

  _scaleScroll(x, props = this.props) {
    let {min, max} = props;
    return scale(x, this.scrollMin, this.scrollMax, min, max);
  }

  _scaleValue(v, props = this.props) {
    let {min, max} = props;
    return scale(v, min, max, this.scrollMin, this.scrollMax);
  }

  _setScrollQueue(scrollTo) {
    this._scrollQueue = scrollTo;
  }

  _resolveScrollQueue() {
    if (this._scrollQueue !== null) {
      this._scrollView && this._scrollView.scrollTo(this._scrollQueue);
      this._handleScrollEnd();
    }
  }

  _handleContentSizeChange() {
    this._resolveScrollQueue();
  }

  _handleScroll(event) {
    if (this._scrollQueue) return;

    let offset = event.nativeEvent.contentOffset.x;
    let {min, max} = this.props;

    let val = this._scaleScroll(offset);

    if (val !== this._value) {
      this._value = val;
      this.props.onChange(val);
    }
    console.log('====================================');
    console.log('scroll value', val);
    console.log('====================================');
  }

  _handleScrollEnd() {
    this._value = this.props.value;
    this._scrollQueue = null;
  }

  _getIntervalSize(val) {
    let {largeInterval, mediumInterval} = this.props;

    if (val % largeInterval === 0) return 'large';
    if (val === 5) return 'large';
    if (val % mediumInterval === 0) return 'medium';
    if (val >= 1 && val <= 12) return 'large'; // Add this condition for numbers 1-9
    return 'small';
  }

  _renderIntervals() {
    let {min, max} = this.props;
    let range = max - min + 1;

    let values = times(range, i => i + min);

    return values.map((val, i) => {
      let intervalSize = this._getIntervalSize(val);

      return (
        <View key={`val-${i}`} style={[styles.intervalContainer]}>
          {intervalSize === 'large' &&
            (this.props.rotateText === true ? (
              <Text
                style={[
                  styles.intervalValue,
                  this.props.styles.intervalValue,
                  {
                    transform: [
                      {rotate: this.props.type === 1 ? '90deg' : '-90deg'},
                    ],
                  },
                ]}>
                {val}
              </Text>
            ) : (
              <Text
                style={[
                  styles.intervalValue,
                  this.props.styles.intervalValue,
                  // {transform: [{rotate: '-90deg'}]},
                ]}>
                {val}
              </Text>
            ))}

          <View
            style={[
              styles.interval,
              styles[intervalSize],
              this.props.styles.interval,
              this.props.styles[intervalSize],
            ]}
          />
        </View>
      );
    });
  }

  render() {
    return (
      <View style={{}}>
        <View
          style={[
            styles.container,
            this.props.styles.container,
            // styles.giveRightMargin,
          ]}>
          <ScrollView
            ref={r => (this._scrollView = r)}
            automaticallyAdjustInsets={true}
            horizontal
            decelerationRate={0}
            snapToInterval={INTERVAL_WIDTH}
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            onScroll={this._handleScroll}
            scrollEnabled={this.props.isEditable}
            onMomentumScrollEnd={this._handleScrollEnd}
            onContentSizeChange={this._handleContentSizeChange}
            scrollEventThrottle={100}
            contentOffset={{x: this.state.contentOffset}}>
            <View style={[styles.intervals, this.props.styles.intervals]}>
              {this._renderIntervals()}
            </View>
          </ScrollView>
          <View
            style={[
              styles.centerline,
              this.props.styles.centerline,
              {
                backgroundColor: '#607D8B',
                opacity:
                  this.props.type === 1 || this.props.type === 1.5 ? 1 : 0.3,
                width: this.props.type === 1 || this.props.type === 1.5 ? 2 : 3,
              },
            ]}
          />
        </View>
      </View>
    );
  }
}

LineGaugeHeight.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  largeInterval: PropTypes.number,
  mediumInterval: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
  styles: PropTypes.object,
  rotateText: PropTypes.bool,
  renderIntervalOneToNine: PropTypes.bool,
};

LineGaugeHeight.defaultProps = {
  min: 40,
  max: 100,
  mediumInterval: 5,
  largeInterval: 10,
  onChange: () => {},
  styles: {},
  rotateText: false,
  renderIntervalOneToNine: false,
};

var styles = StyleSheet.create({
  giveRightMargin: {
    width: GAUGE_WIDTH * 0.1,
  },
  container: {
    height: 100,
    flex: 2,
    width: GAUGE_WIDTH,
    // marginRight: GAUGE_WIDTH * 0.2,

    // backgroundColor: '#F9F9F9',
  },
  intervals: {
    flexDirection: 'row',
    // height:20,
    alignItems: 'flex-end',
    paddingHorizontal: GAUGE_WIDTH / 2,
    marginHorizontal: (-INTERVAL_WIDTH * 0.8) / 2,
  },
  intervalContainer: {
    // width: INTERVAL_WIDTH,
    // width: INTERVAL_WIDTH * 1,
    width: INTERVAL_WIDTH,
    // marginHorizontal: INTERVAL_WIDTH * 0.1,
    // height:10,
    alignItems: 'center',
  },
  interval: {
    width: 2,
    marginRight: -1,
    backgroundColor: '#B6BCC1',
  },
  intervalValue: {
    fontSize: 12,
    marginBottom: 9,
    fontWeight: 'bold',
    width: 20,
    // paddingLeft: 30,
    // paddingRight: 100,
  },
  small: {
    height: 10,
  },
  medium: {
    height: 15,
  },
  large: {
    backgroundColor: '#B6BCC1',
    width: 3,
    height: 28,
  },
  centerline: {
    height: 55,

    position: 'absolute',
    left: GAUGE_WIDTH / 2,

    // topPadding: 100,
    zIndex: -4,
  },
});
