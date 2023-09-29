/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, View, TouchableOpacity, Platform} from 'react-native';
import {Fonts} from '../../../../../config/AppConfig';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import {MedicationIndicator} from '../MedicationIndicator';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
global.stopIndex = 1;
global.date = null;
export class Step4 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {selectedIndex: 1, date: null};
  }
  componentDidMount(): void {
    global.selectedData.endDate = null;
    this.setState({
      selectedIndex: global.stopIndex,
      date: global.date,
    });
    global.selectedData.endDate = global.date;
    var todayDate = new Date();
    var numberOfDaysToAdd = 7;
    todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
    console.log('todayDate');
    console.log(todayDate.toLocaleDateString());
  }
  /* istanbul ignore next */
  setDate(date) {
    this.setState({date: date, selectedIndex: 4}, () => {
      this.hideDateTimePicker();
      global.selectedData.endDate = date;
      global.stopIndex = 4;
      global.date = date;
    });
  }
  /* istanbul ignore next */
  startDatePicker() {
    this.setState({
      isDateTimePickerVisible: true,
    });
  }
  /* istanbul ignore next */
  hideDateTimePicker() {
    this.setState({isDateTimePickerVisible: false});
  }

  startTimePicker() {
    console.log(this.state.replaceIndex);
    console.log(this.state.timeSelectedArray);
    console.log(
      'this.state.timeSelectedArray.length',
      this.state.timeSelectedArray.length,
    );

    this.setState({
      date:
        this.state.replaceIndex !== -1
          ? this.state.timeSelectedArray[this.state.replaceIndex]
          : new Date(),
      isDateTimePickerVisible: true,
      mode: 'time',
      modeName: 'startTime',
      selectedTimeIndex: this.state.replaceIndex, //while adding new time
    });
  }
  timeConvert24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? '0' + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? ' AM' : ' PM';
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }
  /* istanbul ignore next */
  setTime(date) {
    console.log('time am pm1');
    console.log(date);
    let myDate = new Date(date);
    console.log(myDate);
    var time =
      ('0' + myDate.getHours()).slice(-2) +
      ':' +
      ('0' + myDate.getMinutes()).slice(-2);

    var convertedTime = this.timeConvert24(time);
    console.log('time am pm');
    console.log(convertedTime);
    var preArray = this.state.timeArray;
    var selectedArray = this.state.timeSelectedArray;
    console.log(this.state.replaceIndex);
    let data = this.state.selectedTimeArray;
    if (this.state.replaceIndex === -1) {
      preArray.push(convertedTime.toString());
      // data ={myDate,selected:true}
      selectedArray.push(myDate);
      data.push({time: convertedTime.toString(), selected: true});
    } else {
      preArray[this.state.replaceIndex] = convertedTime.toString();
      selectedArray[this.state.replaceIndex] = myDate;
      data.push({time: convertedTime.toString(), selected: true});
    }
    var dummyTimeArr = [];
    var newTimeArr = [];
    var dataTime = {};
    preArray.map((time, index) => {
      dataTime = {time: time, selected: true};
      dummyTimeArr.push(dataTime);
      newTimeArr.push(time);
    });

    this.setState(
      {
        timeArray: preArray,
        replaceIndex: -1,
        selectedTimeIndex: this.state.timeArray.length - 1,
        selectedTimeArray: dummyTimeArr,
      },
      () => {
        this.hideDateTimePicker();
        global.selectedData.doseTimings = this.state.timeArray;
        // global.timeArray = this.state.timeArray;
        global.timeArray = newTimeArr;
      },
    );
  }

  rerenderGlobalTimeArray(dummyTime) {
    var newTimeArr = [];
    dummyTime.map((time, index) => {
      if (time.selected === true) {
        newTimeArr.push(time.time);
      }
    });
    global.timeArray = newTimeArr;
    global.selectedData.doseTimings = newTimeArr;
  }

  renderTimeArray() {
    var dummyTimeArr = this.state.selectedTimeArray;

    return this.state.selectedTimeArray.map((timeofIndex, indexOftime) => {
      console.log('timeArrayindex and time');
      console.log(indexOftime, timeofIndex);
      return (
        <TouchableOpacity
          onPress={() => {
            var dummyTime = this.state.selectedTimeArray;
            this.state.selectedTimeArray.map((time, index) => {
              if (time.time === timeofIndex.time) {
                dummyTime[indexOftime].selected =
                  !dummyTime[indexOftime].selected;
              }
            });
            this.setState(
              {
                replaceIndex: timeofIndex.selected
                  ? indexOftime
                  : indexOftime - 1,
                selectedTimeIndex: indexOftime,
                selectedTimeArray: dummyTime,
              },
              () => {
                this.rerenderGlobalTimeArray(dummyTime);
              },
            );
          }}
          key={Math.random().toString(36).substr(2, 9)}
          style={{
            width: 80,
            height: 40,
            marginTop: hp(1),
            paddingHorizontal: 5,
            marginRight: hp(1),
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            backgroundColor: timeofIndex.selected
              ? Colors.blueTextColor
              : Colors.medicalHistoryBg,
            borderColor: timeofIndex.selected
              ? Colors.blueTextColor
              : Colors.border,
          }}>
          <Text
            style={{
              fontFamily: Fonts.SourceSansBold,
              color: timeofIndex.selected ? Colors.white : Colors.black1,
            }}>
            {timeofIndex.time}
          </Text>
        </TouchableOpacity>
      );
    });
  }
  render() {
    var minDate = new Date();
    minDate.setDate(minDate.getDate());
    var minimumDate = minDate.setHours(0, 0, 0, 0);
    return (
      <Fragment>
        <View style={{flex: 1}}>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onCancel={() => this.hideDateTimePicker()}
            mode={'date'}
            minimumDate={minimumDate}
            titleIOS={'Pick a Date'}
            titleStyle={{fontSize: hp(3)}}
            onConfirm={date => {
              this.setDate(date);
            }}
          />
          <View
            style={{
              margin: hp(1.5),
              backgroundColor: Colors.white,
              borderRadius: 10,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 8,
              flexDirection: 'column',
              alignItems: 'center',
              alignSelf: 'center',
              height: hp(22),
              width: hp(40),
              padding: hp(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                // marginTop: hp(3),
                // marginLeft: hp(2),
                fontSize: hp(2),
                color: Colors.black,
              }}>
              When and How many time will you take in a day?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginTop: hp(1),
              }}>
              {this.renderTimeArray()}

              <TouchableOpacity
                onPress={() => {
                  this.startTimePicker();
                }}
                style={{
                  width: 55,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: Colors.white,
                  borderRadius: 5,
                  borderColor: Colors.blueTextColor,
                  borderWidth: 2,
                  borderStyle: 'dotted',
                }}>
                <Text
                  style={{
                    fontFamily: 'WisemanPTSymbols',
                    fontSize: hp(4),
                    color: Colors.blueTextColor,
                    justifyContent: 'center',
                    ...Platform.select({
                      android: {
                        marginTop: hp(2),
                        marginLeft: hp(0.8),
                      },
                    }),
                    width: hp(4),
                    height: hp(4),
                  }}>
                  T
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View
            style={{
              marginTop: hp(1),
              marginBottom: hp(2),
              alignSelf: 'center',
            }}>
            <MedicationIndicator index={4} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginRight: hp(1),
            }}>
            <Text
              style={{
                fontFamily: Fonts.NunitoRegular,
                fontSize: hp(2.2),
                color: Colors.black2,
                textTransform: 'capitalize',
              }}>
              {global.selectedData.fdaMedicine.proprietaryname}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.NunitoRegular,
                fontSize: hp(2.2),
                marginLeft: hp(2),
                color: Colors.label,
              }}>
              {global.selectedData.fdaMedicine.strength}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: Fonts.NunitoRegular,
              marginTop: hp(1),
              fontSize: hp(2.2),
              color: Colors.black2,
            }}>
            {global.selectedData.frequencyLabel}
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {global.selectedData.doseTimings.map(time => {
              return (
                <Text
                  key={Math.random().toString(36).substr(2, 9)}
                  style={{
                    marginRight: hp(0.5),
                    fontFamily: Fonts.NunitoRegular,
                    marginTop: hp(1),
                    fontSize: hp(2.2),
                    color: Colors.black2,
                  }}>
                  {time}
                </Text>
              );
            })}
          </View>

          <Text
            style={{
              fontFamily: Fonts.NunitoRegular,
              marginTop: hp(1),
              fontSize: hp(2.2),
              color: Colors.black2,
            }}>
            {global.selectedData.mealStatus === false
              ? 'Before Meal'
              : 'After Meal'}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.NunitoBold,
              marginTop: hp(3),
              fontSize: hp(2.6),
              color: Colors.black1,
            }}>
            When should it stop?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: hp(2),
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                global.stopIndex = 1;
                this.setState({selectedIndex: 1});
                global.selectedData.endDate = null;
              }}
              style={{
                height: 50,
                borderWidth: 1,
                paddingHorizontal: hp(5),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                backgroundColor:
                  this.state.selectedIndex === 1
                    ? Colors.green_50
                    : Colors.white,
                borderColor:
                  this.state.selectedIndex === 1 ? Colors.green : Colors.border,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NunitoBold,
                  color: Colors.buttonLabel,
                  fontSize: hp(2.2),
                }}>
                Never
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                global.stopIndex = 2;
                this.setState({selectedIndex: 2});
                var todayDate = new Date();
                var numberOfDaysToAdd = 7;
                todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
                console.log('todayDate');
                console.log(todayDate);
                global.selectedData.endDate = todayDate;
              }}
              style={{
                height: 50,
                borderWidth: 1,
                paddingHorizontal: hp(3),
                marginLeft: hp(1),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                backgroundColor:
                  this.state.selectedIndex === 2
                    ? Colors.green_50
                    : Colors.white,
                borderColor:
                  this.state.selectedIndex === 2 ? Colors.green : Colors.border,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NunitoBold,
                  color: Colors.buttonLabel,
                  fontSize: hp(2.2),
                }}>
                After a Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                global.stopIndex = 3;
                this.setState({selectedIndex: 3});
                var todayDate = new Date();
                var numberOfDaysToAdd = 30;
                todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
                console.log('aftermonthDate');
                console.log(todayDate);
                global.selectedData.endDate = todayDate;
              }}
              style={{
                height: 50,
                borderWidth: 1,
                marginTop: hp(2),
                paddingHorizontal: hp(1.5),
                marginRight: hp(1),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                backgroundColor:
                  this.state.selectedIndex === 3
                    ? Colors.green_50
                    : Colors.white,
                borderColor:
                  this.state.selectedIndex === 3 ? Colors.green : Colors.border,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NunitoBold,
                  color: Colors.buttonLabel,
                  fontSize: hp(2.2),
                }}>
                After a Month
              </Text>
            </TouchableOpacity>
            {this.state.date !== null ? (
              <TouchableOpacity
                onPress={() => {
                  global.stopIndex = 4;
                  this.setState({selectedIndex: 4});
                  var todayDate = new Date();
                  var numberOfDaysToAdd = 30;
                  todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
                  console.log('aftermonthDate');
                  console.log(todayDate);
                  global.selectedData.endDate = todayDate;
                }}
                style={{
                  height: 50,
                  borderWidth: 1,
                  marginTop: hp(1.5),
                  marginRight: hp(1),
                  paddingHorizontal: hp(2),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor:
                    this.state.selectedIndex === 4
                      ? Colors.green_50
                      : Colors.white,
                  borderColor:
                    this.state.selectedIndex === 4
                      ? Colors.green
                      : Colors.border,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoBold,
                    color: Colors.buttonLabel,
                    fontSize: hp(2.2),
                  }}>
                  {new Date(this.state.date).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                this.startDatePicker();
              }}
              style={{
                width: 55,
                height: 50,
                marginTop: hp(1),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: Colors.green,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'WisemanPTSymbols',
                  fontSize: hp(4),
                  color: Colors.white,
                  justifyContent: 'center',
                  ...Platform.select({
                    android: {
                      marginTop: hp(2),
                      marginLeft: hp(0.8),
                    },
                  }),
                  width: hp(4),
                  height: hp(4),
                }}>
                T
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </Fragment>
    );
  }
}
