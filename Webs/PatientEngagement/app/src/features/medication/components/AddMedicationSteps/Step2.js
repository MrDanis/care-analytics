/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Fonts} from '../../../../../config/AppConfig';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import {MedicationIndicator} from '../MedicationIndicator';
global.frequencyIndex = 1;
export class Step2 extends React.PureComponent {
  state = {selectedIndex: 1, count: 2, selectButtonOnIncrementDecrement: false};
  constructor(props) {
    super(props);
    console.log('this.state.selectedIndex');
    console.log(this.state.selectedIndex);
  }
  componentDidMount(): void {
    if (global.frequencyIndex === 1) {
      global.selectedData.frequencyLabel = 'Every Day';
      global.selectedData.frequencyInDays = 1;
    } else if (global.frequencyIndex === 2) {
      global.selectedData.frequencyLabel = 'Every 1 Day';
      global.selectedData.frequencyInDays = 1;
    } else if (global.frequencyIndex === 3) {
      global.selectedData.frequencyLabel = 'Every Week';
      global.selectedData.frequencyInDays = 7;
    } else if (global.frequencyIndex === 4) {
      global.selectedData.frequencyLabel = 'Every Week';
      global.selectedData.frequencyInDays = 30;
    }

    this.setState({selectedIndex: global.frequencyIndex});
  }
  componentWillUnmount(): void {
    console.log('componentWillUnmount');
  }

  render() {
    return (
      <Fragment>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontFamily: Fonts.NunitoBold,
              marginTop: hp(3),
              fontSize: hp(2.6),
              color: Colors.black1,
            }}>
            How often will you take it?
          </Text>
          <TouchableOpacity
            onPress={() => {
              global.frequencyIndex = 1;
              this.setState({
                selectedIndex: 1,
                selectButtonOnIncrementDecrement: false,
              });
              global.selectedData.frequencyLabel = 'Every Day';
              global.selectedData.frequencyInDays = 1;
            }}
            style={{
              width: '100%',
              height: 60,
              borderWidth: 2,
              marginTop: hp(2),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              backgroundColor:
                this.state.selectedIndex === 1 ? Colors.lightGrey2 : Colors.white,
              borderColor:
                this.state.selectedIndex === 1 ? Colors.blueTextColor : Colors.border,
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                color: Colors.black1,
                fontSize: hp(2.2),
              }}>
              Every Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              global.frequencyIndex = 2;
              this.setState({
                selectedIndex: 2,
                selectButtonOnIncrementDecrement: true,
              });
              global.selectedData.frequencyLabel =
                'Every ' + this.state.count + ' Day';
              global.selectedData.frequencyInDays = this.state.count;
            }}
            style={{
              width: '100%',
              height: 60,
              borderWidth: 2,
              marginTop: hp(1.5),
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderRadius: 5,
                backgroundColor:
                    this.state.selectedIndex === 2 ? Colors.lightGrey2 : Colors.white,
                borderColor:
                    this.state.selectedIndex === 2 ? Colors.blueTextColor : Colors.border,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (this.state.count > 2) {
                  this.setState({
                    count: this.state.count - 1,
                    selectButtonOnIncrementDecrement: true,
                    selectedIndex: 2,
                  });
                  global.selectedData.frequencyLabel =
                    'Every ' + this.state.count - 1 + ' Day';
                  global.selectedData.frequencyInDays = this.state.count;
                }
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NunitoLight,
                  color: Colors.blueTextColor,
                  fontSize: hp(7),
                  marginTop: hp(-2),
                  marginLeft: hp(3),
                }}>
                -
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                color: Colors.buttonLabel,
                fontSize: hp(2.2),
              }}>
              Every {this.state.count} Day
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  count: this.state.count + 1,
                  selectButtonOnIncrementDecrement: true,
                  selectedIndex: 2,
                });
                global.selectedData.frequencyLabel =
                  'Every ' + (this.state.count + 1) + ' Day';
                global.selectedData.frequencyInDays = this.state.count + 1;
              }}>
              <Text
                style={{
                  fontFamily: 'WisemanPTSymbols',
                  marginRight: hp(3),
                  color: Colors.blueTextColor,
                  fontSize: hp(4),
                }}>
                T
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              global.frequencyIndex = 3;
              this.setState({
                selectedIndex: 3,
                selectButtonOnIncrementDecrement: false,
              });
              global.selectedData.frequencyLabel = 'Every Week';
              global.selectedData.frequencyInDays = 7;
            }}
            style={{
              width: '100%',
              height: 60,
              borderWidth: 2,
              marginTop: hp(1.5),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              backgroundColor:
                this.state.selectedIndex === 3 ? Colors.lightGrey2 : Colors.white,
              borderColor:
                this.state.selectedIndex === 3 ? Colors.blueTextColor : Colors.border,
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                color: Colors.buttonLabel,
                fontSize: hp(2.2),
              }}>
              Every Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              global.frequencyIndex = 4;
              this.setState({selectedIndex: 4});
              global.selectedData.frequencyLabel = 'Every Month';
              global.selectedData.frequencyInDays = 30;
            }}
            style={{
              width: '100%',
              height: 60,
              borderWidth: 2,
              marginTop: hp(1.5),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
                backgroundColor:
                    this.state.selectedIndex === 4 ? Colors.lightGrey2 : Colors.white,
                borderColor:
                    this.state.selectedIndex === 4 ? Colors.blueTextColor : Colors.border,
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoBold,
                color: Colors.buttonLabel,
                fontSize: hp(2.2),
              }}>
              Every Month
            </Text>
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  }
}
