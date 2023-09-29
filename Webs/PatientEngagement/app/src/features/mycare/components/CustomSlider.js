/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import Colors from '../../../../config/Colors';
import SmoothPicker from 'react-native-smooth-picker';
import CustomThumb from '../components/CustomThumb';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export class CustomSlider extends React.PureComponent {
  constructor(props) {
    super(props);
    // console.log('comeeeeeeeee in constuctor');
    this.state = {
      selected: 0,
      index: 0,
      startValue: 85,
      endValue: 161,
      data: [],
      dataArray: [],
      criticalColour: Colors.green,
    };
  }
  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (global.fromDevice) {
      this.showSliderValue();
    }
  }

  handleChange = (index, item) => {
    this.setState(
      {
        selected: item,
      },
      () => {
        this.getCriticalColor();
      },
    );
    if (this.props.data.Id === 1) {
      global.Value1 = item.toString();
    } else if (this.props.data.Id === 2) {
      global.Value2 = item.toString();
    } else {
      global.Value1 = item.toString();
    }
  };
  onChangeText = text => {
    // console.log(this.props.data);
    // console.log('values changed', text);
    this.setState({
      selected: text,
    });
    var selectedIndex = this.state.dataArray.indexOf(parseInt(text));
    // console.log('selectedIndex' + selectedIndex);
    if (selectedIndex !== -1) {
      // console.log('selectedtext' + text.toString());
      if (this.props.data.Id == 1) {
        global.Value1 = text.toString();
      } else if (this.props.data.Id == 2) {
        global.Value2 = text.toString();
      } else {
        global.Value1 = text.toString();
      }
      // console.log('selectedtextfhdkjhfkjsdhfkhd' + global.Value1);
      // console.log('selectedtext2dbfmsdmfb' + global.Value2);
      this.setState(
        {
          selected: parseInt(text),
          index: selectedIndex,
        },
        () => {
          this.getCriticalColor();
        },
      );

      this.refList.refs.smoothPicker.scrollToIndex({
        animated: true,
        index: selectedIndex,
        viewOffset: -35,
      });
      Keyboard.dismiss();
    } else {
      this.refList.refs.smoothPicker.scrollToIndex({
        animated: true,
        index: 0,
        viewOffset: -25,
      });
    }
  };

  goToSelectedValue() {
    let value;
    if (this.props.data.Value !== null) {
      value = this.props.data.Value;
    } else {
      if (this.props.data.DefaultValue === 0) {
        value = this.props.data.MinRange;
      } else {
        value = this.props.data.DefaultValue;
      }
    }
    if (value) {
      if (this.props.data.Id === 1) {
        global.Value1 = value;
      } else if (this.props.data.Id === 2) {
        global.Value2 = value;
      } else {
        global.Value1 = value;
      }

      var selectedIndex = this.state.dataArray.indexOf(parseInt(value));
      console.log('selectedIndex' + selectedIndex);

      if (selectedIndex !== -1) {
        this.setState(
          {
            selected: this.state.dataArray[selectedIndex],
            index: selectedIndex,
          },
          () => {
            this.getCriticalColor();
          },
        );

        if (this.refList && this.refList.refs) {
          this.refList.refs.smoothPicker.scrollToIndex({
            animated: true,
            index: selectedIndex,
            viewOffset: -25,
          });
        }
      }
    }
  }

  componentDidMount(): void {
    this.setState({data: this.props.data});
    this.showSliderValue();
  }
  showSliderValue() {
    var data = [];
    if (this.props.data) {
      if (this.props.data.Id === 6) {
        var i = this.props.data.MinRange;
        while (i <= this.props.data.MaxRange) {
          data.push(i);
          i = parseFloat((i + 0.1).toFixed(1));
        }
      } else {
        data = Array.from(
          {
            length: this.props.data.MaxRange + 1 - this.props.data.MinRange,
          },
          (_, i) => this.props.data.MinRange + i,
        );
      }

      this.setState(
        {
          dataArray: data,
        },
        () => {
          setTimeout(() => {
            this.goToSelectedValue();
          }, 500);
        },
      );
    }
  }

  getItemLayout = (data, index) => ({length: 20, offset: 20 * index, index});

  getCriticalColor() {
    console.log('valueeee' + parseInt(this.state.selected));
    if (
      parseInt(this.state.selected) < this.props.data.CriticalMinRange ||
      parseInt(this.state.selected) > this.props.data.CriticalMaxRange
    ) {
      console.log('come here red');
      this.setState({
        criticalColour: Colors.red,
      });
    } else {
      console.log('come here green');
      this.setState({
        criticalColour: Colors.green,
      });
    }
  }

  render() {
    return this.state.dataArray.length ? (
      <Fragment>
        <View style={styles.container}>
          <TextInput
            style={{
              borderWidth: 2,
              borderColor: Colors.fontGrey,
              fontFamily: 'Roboto-Medium',
              color: Colors.black,
              fontSize: hp(2.5),
              paddingTop: hp(0.5),
              paddingBottom: hp(0.5),
              paddingRight: hp(3),
              paddingLeft: hp(3),
              textAlign: 'center',
            }}
            returnKeyType={'done'}
            onChangeText={text => this.onChangeText(text)}
            value={this.state.selected.toString()}
            maxLength={5}
            keyboardType={'numeric'}
          />
          <View style={styles.TriangleShape} />
          <View style={styles.wrapperHorizontal}>
            <SmoothPicker
              onScrollToIndexFailed={() => {
                console.log('failed');
              }}
              initialScrollToIndex={this.state.index}
              ref={ref => (this.refList = ref)}
              keyExtractor={(_, index) => index.toString()}
              offsetSelection={0}
              magnet={true}
              scrollAnimation={true}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.state.dataArray}
              onSelected={({item, index}) => this.handleChange(index, item)}
              renderItem={({item, index}) => (
                <CustomThumb
                  horizontal
                  selected={index}
                  item={item}
                  length={this.state.dataArray.length}>
                  {item}
                </CustomThumb>
              )}
            />
            <View
              pointerEvents="none"
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                position: 'absolute',
              }}>
              <View
                style={{
                  flex: 1,
                  height: 0.5,
                  backgroundColor: Colors.darkGrey,
                  alignSelf: 'center',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  width: hp(6),
                  height: hp(6),
                  backgroundColor: this.state.criticalColour,
                  borderRadius: hp(3),
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: hp(1.15),
                    marginBottom: Platform.OS === 'ios' ? hp(0.3) : hp(0.3),
                    paddingLeft: Platform.OS === 'ios' ? hp(0.4) : hp(0.5),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'WisemanPTSymbols',
                      fontSize: hp(3.5),
                      color: Colors.white,
                    }}>
                    .
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  height: 0.5,
                  backgroundColor: Colors.darkGrey,
                  alignSelf: 'center',
                }}
              />
            </View>
          </View>
        </View>
      </Fragment>
    ) : null;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  wrapperHorizontal: {
    width: '100%',
    height: 90,
    marginTop: Platform.isPad ? -hp(1) : -hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    color: 'black',
  },
  itemStyleSelected: {
    flexDirection: 'row',
    width: 40,
    height: 40,
    alignItems: 'center',
    backgroundColor: Colors.green,
    borderRadius: 20,
    alignSelf: 'center',
  },
  itemStyleNormal: {
    width: 8,
    height: 8,
    paddingTop: 5,
    backgroundColor: Colors.darkGrey,
    borderRadius: 4,
    alignSelf: 'center',
  },
  TriangleShape: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.fontGrey,
  },
});
