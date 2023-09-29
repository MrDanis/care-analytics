/* istanbul ignore file */
import React, {Fragment} from 'react';
import {StyleSheet, Text, View, TextInput, Alert, Keyboard} from 'react-native';
import Colors from '../../../../config/Colors';
import SmoothPicker from 'react-native-smooth-picker';
import CustomThumb from '../components/CustomThumb';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export class CustomSliderOne extends React.PureComponent {
  constructor(props) {
    super(props);
    // console.log('comeeeeeeeee in constuctor');
    this.state = {
      selected: 85,
      index: 9,
      startValue: 85,
      endValue: 161,
      dataArray: [],
    };
  }
  handleChange = (index, item) => {
    this.setState({
      selected: item,
    });
  };
  onChangeText = text => {
    this.setState({
      selected: text,
    });
    var selectedIndex = this.state.dataArray.indexOf(parseInt(text));
    console.log('selectedIndex' + selectedIndex);
    if (selectedIndex !== -1) {
      this.setState({
        selected: parseInt(text),
        index: selectedIndex,
      });

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
        viewOffset: -35,
      });
    }
  };
  // componentDidMount(): void {
  //   var data = Array.from(
  //     { length: this.state.endValue - this.state.startValue },
  //     (_, i) => this.state.startValue + i
  //   );
  //   this.setState(
  //     {
  //       dataArray: data
  //     },
  //     () => {
  //       console.log(this.state.dataArray);
  //     }
  //   );
  // }

  goToSelectedValue() {
    setTimeout(() => {
      let value;
      if (this.props.data.Value !== null) {
        value = this.props.data.Value;
      } else {
        value = this.props.data.DefaultValue;
      }
      if (value) {
        var selectedIndex = this.state.dataArray.indexOf(parseInt(value));
        console.log('selectedIndex' + selectedIndex);

        if (selectedIndex !== -1) {
          this.setState({
            selected: this.state.dataArray[selectedIndex],
            index: selectedIndex,
          });

          this.refList.refs.smoothPicker.scrollToIndex({
            animated: true,
            index: selectedIndex,
            viewOffset: -35,
          });
        }
      }
    }, 1000);
  }

  componentDidMount(): void {
    console.log('called1');
    // this.setState({
    //   selected: 90,
    //   index: 5
    // });
    // this.refList.refs.smoothPicker.scrollToIndex({
    //   animated: true,
    //   index: 5,
    //   viewOffset: -35
    // });
    if (this.props.data) {
      var data = Array.from(
        {length: this.props.data.MaxRange + 1 - this.props.data.MinRange},
        (_, i) => this.props.data.MinRange + i,
      );
      this.setState(
        {
          dataArray: data,
        },
        () => {
          setTimeout(() => {
            // this.setState({
            //   selected: this.state.dataArray[5],
            //   index: 5
            // });
            //
            // this.refList.refs.smoothPicker.scrollToIndex({
            //   animated: true,
            //   index: 5,
            //   viewOffset: -35
            // });
            this.goToSelectedValue();

            // if (this.props.data.Value && this.props.data.Value !== null) {
            //   var selectedIndex = this.state.dataArray.indexOf(
            //     parseInt(this.props.data.Value)
            //   );
            //   console.log('selectedIndex' + selectedIndex);
            //
            //   if (selectedIndex !== -1) {
            //     this.setState({
            //       selected: this.props.data.Value,
            //       index: selectedIndex
            //     });
            //
            //     this.refList.refs.smoothPicker.scrollToIndex({
            //       animated: true,
            //       index: selectedIndex,
            //       viewOffset: -35
            //     });
            //   }
            //   this.onChangeText(this.props.data.Value);
            // } else {
            //   console.log('come inn else');
            // }
          }, 1000);
        },
      );
    }
  }

  getItemLayout = (data, index) => ({length: 20, offset: 20 * index, index});

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
              width: hp(11),
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
            maxLength={3}
            keyboardType={'numeric'}
          />
          <View style={styles.TriangleShape} />
          <View style={styles.wrapperHorizontal}>
            <SmoothPicker
              getItemLayout={this.getItemLayout}
              onScrollToIndexFailed={() => {}}
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
                <CustomThumb horizontal selected={index} item={item}>
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
              <View style={[styles.itemStyleSelected]}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: hp(0.6),
                    paddingLeft: hp(0.3),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'WisemanPTSymbols',
                      fontSize: hp(3.5),
                      marginRight: -hp(0.5),
                      color: Colors.white,
                    }}>
                    W
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'WisemanPTSymbols',
                      fontSize: hp(3.5),
                      marginLeft: -hp(0.5),
                      color: Colors.white,
                    }}>
                    X
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
    marginTop: -hp(3),
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
