import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {Fonts} from '../../../../../config/AppConfig';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import {MedicationIndicator} from '../MedicationIndicator';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {MedicationType} from '../../constants';
import SvgNoImageFoundIcon from '../../../../../../assets/svg/noMedImage.svg';
import images from '../../../../../config/Images';
import MedicationService from '../../../../api/medication';
import {showMessage} from 'react-native-flash-message';
import {TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';

global.timeArray = [];
global.selectedIndex = 0;
global.quantityIndex = 0;
global.quantity = -1;
global.stopIndex = 1;
global.frequencyIndex = 1;
global.date = null;
global.cardIndex = 1;

export class Step3 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cardIndex: 1,
      selectedIndex: 0,
      time: '',
      date: new Date(),
      selectedDate: new Date(),
      showTimePicker: false,
      startDate: '',
      timeArray: [],
      selectedTimeIndex: 0,
      selectedTimeArray: [],
      // timeSelectedArray: [new Date()],
      timeSelectedArray: [new Date()],
      tabletQuantity: ['1', '2', '3'],
      injectionQuantity: ['1', '2', '3', '4'],
      syrupQuantity: ['1', '2', '3', '4'],
      capsuleQuantity: ['1', '2', '3'],
      quantity: ['1', '2', '3'],
      quantityIndex: 0,
      selectedDose: '',
      selectedQuantity: [],
      replaceIndex: -1,
      quantityText: '',
      quantityUnit: '',
      dateSelectedIndex: 1,
      stopDate: null,
      count: 2,
      selectButtonOnIncrementDecrement: false,
      frequSelectedIndex: 0,
      morning: true,
      noon: false,
      evening: false,
      timeArrNew: [],
      doseTextInput: '',
      isDatePickerVisible:false
    };
    var d1 = new Date(),
      d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 30);
    this.setTime(d1);
  }
  componentDidMount(): void {
    console.log('Is datepicker visible check ....',this.state.isDatePickerVisible)
    global.selectedData.mealStatus = false;
    global.selectedData.doseTimings = this.state.timeArray;
    var dummyTimeArr = [];
    var data = {};
    this.state.timeArray.map((time, index) => {
      data = {time: time, selected: true};
      dummyTimeArr.push(data);
    });
    this.selectDoseQuantity();
    if (global.timeArray.length) {
      global.timeArray.map((time, index) => {
        data = {time: time, selected: true};
        dummyTimeArr.push(data);
      });
      global.selectedData.doseTimings = global.timeArray;
      global.selectedData.mealStatus =
        global.selectedIndex === 0 ? false : true;
      if (global.quantity !== -1) {
        global.selectedData.quantity = global.quantity;
      }
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
      this.setState({
        timeArray: global.timeArray,
        selectedIndex: global.selectedIndex,
        quantityIndex: global.quantityIndex,
        selectedTimeIndex: this.state.timeArray.length - 1,
        selectedTimeArray: dummyTimeArr,
      });
    }
    if (global.frequencyIndex === 1) {
      global.selectedData.frequencyLabel = 'Daily';
      global.selectedData.frequencyInDays = 1;
    } else if (global.frequencyIndex === 2) {
      global.selectedData.frequencyLabel = '2 Days';
      global.selectedData.frequencyInDays = 1;
    } else if (global.frequencyIndex === 3) {
      global.selectedData.frequencyLabel = 'Weekly';
      global.selectedData.frequencyInDays = 7;
    } else if (global.frequencyIndex === 4) {
      global.selectedData.frequencyLabel = 'Monthly';
      global.selectedData.frequencyInDays = 30;
    }

    this.setState({frequSelectedIndex: global.frequencyIndex});
    //step4 init
    global.selectedData.endDate = null;
    this.setState({
      dateSelectedIndex: global.stopIndex,
      stopDate: global.date,
    });
    global.selectedData.endDate = global.date;
    var todayDate = new Date();
    var numberOfDaysToAdd = 7;
    todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
    console.log('todayDate');
    console.log(todayDate.toLocaleDateString());
  }
  selectDoseQuantity() {
    if (
      global.selectedData.fdaMedicine.dosageformname.includes(
        MedicationType.TABLET,
      )
    ) {
      global.selectedData.quantity = parseFloat(this.state.tabletQuantity[0]);
      this.setState({
        selectedQuantity: this.state.tabletQuantity,
        quantityText: 'Tablet Quantity',
        quantityUnit: '',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} tablets`,
      });
    } else if (
      global.selectedData.fdaMedicine.dosageformname.includes(
        MedicationType.CAPSULE,
      )
    ) {
      global.selectedData.quantity = parseFloat(this.state.capsuleQuantity[0]);
      this.setState({
        selectedQuantity: this.state.capsuleQuantity,
        quantityText: 'Capsule Quantity',
        quantityUnit: '',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} capsules`,
      });
    } else if (
      global.selectedData.fdaMedicine.dosageformname.includes(
        MedicationType.INJECTION1,
      )
    ) {
      console.log('come herewewe');
      global.selectedData.quantity = parseFloat(
        this.state.injectionQuantity[0],
      );
      this.setState({
        selectedQuantity: this.state.injectionQuantity,
        quantityText: 'Injection Quantity',
        quantityUnit: 'mL',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} mL`,
      });
    } else if (
      global.selectedData.fdaMedicine.dosageformname.includes(
        MedicationType.INJECTION2,
      )
    ) {
      console.log('come herewewe');
      global.selectedData.quantity = parseFloat(
        this.state.injectionQuantity[0],
      );
      this.setState({
        selectedQuantity: this.state.injectionQuantity,
        quantityText: 'Injection Quantity',
        quantityUnit: 'mL',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} mL`,
      });
    } else if (
      global.selectedData.fdaMedicine.dosageformname.includes(
        MedicationType.SYRUP1,
      )
    ) {
      global.selectedData.quantity = parseFloat(this.state.syrupQuantity[0]);
      this.setState({
        selectedQuantity: this.state.syrupQuantity,
        quantityText: 'Syrup Quantity',
        quantityUnit: 'mL',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} mL`,
      });
    } else if (
      global.selectedData.fdaMedicine.dosageformname.includes(
        MedicationType.SYRUP2,
      )
    ) {
      global.selectedData.quantity = parseFloat(this.state.syrupQuantity[0]);
      this.setState({
        selectedQuantity: this.state.syrupQuantity,
        quantityText: 'Syrup Quantity',
        quantityUnit: 'mL',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} mL`,
      });
    } else if (
      global.selectedData.fdaMedicine.dosageformname.includes(
        MedicationType.EYEDROPS,
      )
    ) {
      global.selectedData.quantity = parseFloat(this.state.capsuleQuantity[0]);
      this.setState({
        selectedQuantity: this.state.capsuleQuantity,
        quantityText: 'Drops Quantity',
        quantityUnit: '',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} mL`,
      });
    } else {
      global.selectedData.quantity = parseFloat(this.state.quantity[0]);
      this.setState({
        selectedQuantity: this.state.quantity,
        quantityText: 'Quantity',
        quantityUnit: '',
        stripSize: `${global.selectedData.fdaMedicine.packageSize} tablets`,
      });
    }
  }

  //step 4 function

  /* istanbul ignore next */
  setDate(date) {
    this.setState({stopDate: date, dateSelectedIndex: 4}, () => {
      this.hideDatePicker();
      global.selectedData.endDate = date;
      global.stopIndex = 4;
      global.date = date;
    });
  }
  /* istanbul ignore next */
  startDatePicker() {
    this.setState({
      isDatePickerVisible: true,
    });
  }
  /* istanbul ignore next */
  hideDatePicker() {
    this.setState({isDatePickerVisible: false});
  }

  /* istanbul ignore next */
  hideDateTimePicker() {
    this.setState({
      isDateTimePickerVisible: false,
      replaceIndex: -1,
      selectedTimeIndex: this.state.timeArray.length - 1,
    });
  }
  /* istanbul ignore next */
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
    // global.selectedData.doseTimings = newTimeArr;
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
  renderDoseArray() {
    // if (this.state.selectedQuantity.length) {
    //   global.selectedData.Quantity = parseFloat(this.state.selectedQuantity[0]);
    // }

    return this.state.selectedQuantity.map((dose, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log('selectedQuantity');
            console.log(dose);
            console.log(index);
            console.log('index');
            this.setState({
              quantityIndex: index,
            });
            global.selectedData.quantity = parseFloat(dose);
            global.quantityIndex = index;
            global.quantity = parseFloat(dose);
          }}
          key={Math.random().toString(36).substr(2, 9)}
          style={{
            width: 72,
            height: 42,
            marginTop: hp(1.5),
            marginRight: hp(1.5),
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            backgroundColor:
              this.state.quantityIndex === index
                ? Colors.blueTextColor
                : Colors.bleLayer4,
            borderColor:
              this.state.quantityIndex === index
                ? Colors.blueTextColor
                : Colors.bleLayer3,
          }}>
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              color:
                this.state.quantityIndex === index
                  ? Colors.white
                  : Colors.TextColor,
              fontSize: hp(2),
            }}>
            {dose + this.state.quantityUnit}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    var minDate = new Date();
    minDate.setDate(minDate.getDate());
    var minimumDate = minDate.setHours(0, 0, 0, 0);
    console.log('Is datepicker visible check ....',this.state.isDatePickerVisible)
   
    return (
      <Fragment>
        <View>
          {
            this.state.isDatePickerVisible?
            
              <DatePicker
               modal
               open={true}
               date={minDate}
               maximumDate={minDate}
               mode='date'
               onCancel={() => this.hideDatePicker()}
               onConfirm={(date) => {
                this.setDate(date);
              }}
            />
            :null
          }
          {/* <DateTimePicker
            isVisible={this.state.isDatePickerVisible}
            onCancel={() => this.hideDatePicker()}
            mode={'date'}
            minimumDate={minimumDate}
            titleIOS={'Pick a Date'}
            titleStyle={{fontSize: hp(3)}}
            onConfirm={date => {
              this.setDate(date);
            }}
          /> */}
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onCancel={() => this.hideDateTimePicker()}
            mode={'time'}
            date={this.state.date}
            titleIOS={'Pick a Time'}
            titleStyle={{fontSize: hp(3)}}
            is24Hour={false}
            onConfirm={date => {
              this.setTime(date);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              height: hp(7.5),
              borderBottomWidth: 1,
              borderColor: Colors.BgColor,
              // marginBottom: hp(2),
              backgroundColor: Colors.BgColor,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Text
                style={{
                  fontFamily: 'WisemanPTSymbols',
                  marginLeft: hp(2),
                  marginRight: hp(1),
                  fontSize: hp(5),
                  color: Colors.black1,
                }}>
                W
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(2.5),
                color: Colors.black1,
                flex: 1,
                textTransform: 'capitalize',
                textAlign: 'center',
              }}>
              Add New Medication
            </Text>
            <View style={{marginRight: hp(2)}}></View>

            <TouchableOpacity
              onPress={async () => {}}
              style={{
                alignSelf: 'center',
                marginRight: hp(3),
              }}>
              <Image source={images.hamburgIcon} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: hp(2),
              height: '40%',
              minHeight: '35%',
              maxHeight: '35%',

              backgroundColor: Colors.BgColor,
            }}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                height: '100%',
                alignItems: 'center',
                alignSelf: 'center',
                paddingBottom: Platform.OS === 'ios' ? hp(19) : hp(19),
                paddingTop: hp(1),
                minWidth: '90%',
                // display: 'flex',
                borderColor:'red',
                borderWidth:0
              }}>
              <View style={{paddingTop: hp(3)}}>
                <Image
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    alignSelf: 'center',
                    marginRight: hp(1),
                    borderColor:'red',
                    borderWidth:0
                  }}
                  source={images.medIcon4x}
                />
              </View>
              {/* )} */}
              <Text
                style={{
                  paddingTop: hp(1),
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.5),
                  color: Colors.black,
                  textTransform: 'capitalize',
                  marginTop: hp(2),
                }}>
                {global.selectedData.fdaMedicine.proprietaryname}
              </Text>
              <View style={{marginTop: hp(1.5)}}>
                {global.selectedData.fdaMedicine?.strength !== '' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(1.7),
                        marginLeft: hp(2),
                        color: Colors.noRecordFound,
                        lineHeight: hp(3),
                      }}>
                      {'Strenght - ' +
                        global.selectedData.fdaMedicine?.strength}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: hp(0.5),
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      height: 8,
                      width: 8,
                      alignSelf: 'center',
                      marginLeft: hp(0.5),
                      backgroundColor: Colors.border,
                      borderRadius: 4,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(1.7),
                      marginLeft: hp(0.5),
                      color: Colors.noRecordFound,
                    }}>
                    {'Strip Size - '}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(1.7),
                      marginLeft: hp(0.5),
                      color: Colors.noRecordFound,
                    }}>
                    {this.state.stripSize}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: hp(0.5),
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      height: 8,
                      width: 8,
                      alignSelf: 'center',
                      backgroundColor: Colors.border,
                      borderRadius: 4,
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(1.7),
                      color: Colors.noRecordFound,
                      textTransform: 'capitalize',
                    }}>
                    {'  Mfr. by: ' +
                      global.selectedData.fdaMedicine?.manufacturer?.toLowerCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* <Text
           style={{
           fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(2.2),
             color: Colors.black2,
           }}>
            {global.selectedData.frequencyLabel}
          </Text> */}
          {/* <View style={{height: '20%' ,   backgroundColor: Colors.homeYellow}}>  */}
          {this.state.cardIndex === 1 ? (
            <View
              style={{
                margin: hp(2),
                backgroundColor: Colors.white,
                borderRadius: 10,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                flexDirection: 'column',
                // alignItems: 'center',
                alignSelf: 'center',
                // height: hp(25),
                width: '90%',
                paddingBottom: hp(1.5),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: Colors.black,
                  marginTop: hp(3),
                  marginLeft: hp(2),
                }}>
                How will you take it?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  padding: hp(2),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 1;
                    this.setState({
                      frequSelectedIndex: 1,
                      selectButtonOnIncrementDecrement: false,
                    });
                    global.selectedData.frequencyLabel = 'Daily';
                    global.selectedData.frequencyInDays = 1;
                  }}
                  style={{
                    width: 80,
                    height: 42,
                    borderWidth: 1,
                    marginRight: hp(2),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor:
                      this.state.frequSelectedIndex === 1
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.frequSelectedIndex === 1
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.frequSelectedIndex === 1
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    Daily
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 3;
                    this.setState({
                      frequSelectedIndex: 3,
                      selectButtonOnIncrementDecrement: false,
                    });
                    global.selectedData.frequencyLabel = 'Weekly';
                    global.selectedData.frequencyInDays = 7;
                  }}
                  style={{
                    width: 80,
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(1.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginRight: hp(2),
                    backgroundColor:
                      this.state.frequSelectedIndex === 3
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.frequSelectedIndex === 3
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.frequSelectedIndex === 3
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    Weekly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 4;
                    this.setState({frequSelectedIndex: 4});
                    global.selectedData.frequencyLabel = 'Monthly';
                    global.selectedData.frequencyInDays = 30;
                  }}
                  style={{
                    width: 80,
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(1.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: hp(2),
                    borderRadius: 5,
                    backgroundColor:
                      this.state.frequSelectedIndex === 4
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.frequSelectedIndex === 4
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.frequSelectedIndex === 4
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2.2),
                    }}>
                    Monthly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 2;
                    this.setState({
                      frequSelectedIndex: 2,
                      selectButtonOnIncrementDecrement: true,
                    });
                    global.selectedData.frequencyLabel =
                      this.state.count + ' Day';
                    global.selectedData.frequencyInDays = this.state.count;
                  }}
                  style={{
                    width: 150,
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(3),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    borderRadius: 5,
                    backgroundColor:
                      this.state.frequSelectedIndex === 2
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.frequSelectedIndex === 2
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.count > 2) {
                        this.setState({
                          count: this.state.count - 1,
                          selectButtonOnIncrementDecrement: true,
                          frequSelectedIndex: 2,
                        });
                        global.selectedData.frequencyLabel =
                          this.state.count - 1 + ' Day';
                        global.selectedData.frequencyInDays = this.state.count;
                      }
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        color:
                          this.state.frequSelectedIndex === 2
                            ? Colors.white
                            : Colors.TextColor,
                        fontSize: hp(5),
                        marginTop: hp(-1.5),
                        marginLeft: hp(3),
                      }}>
                      -
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.frequSelectedIndex === 2
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    {this.state.count} Days
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        count: this.state.count + 1,
                        selectButtonOnIncrementDecrement: true,
                        frequSelectedIndex: 2,
                      });
                      global.selectedData.frequencyLabel =
                        this.state.count + 1 + ' Day';
                      global.selectedData.frequencyInDays =
                        this.state.count + 1;
                    }}>
                    <Text
                      style={{
                        fontFamily: 'WisemanPTSymbols',
                        marginRight: hp(3),
                        color:
                          this.state.frequSelectedIndex === 2
                            ? Colors.white
                            : Colors.TextColor,
                        fontSize: hp(3),
                      }}>
                      T
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => {
                    // global.frequencyIndex = 4;
                    // this.setState({frequSelectedIndex: 4});
                    // global.selectedData.frequencyLabel = 'Monthly';
                    // global.selectedData.frequencyInDays = 30;
                  }}
                  style={{
                    width: '43%',
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(1.5),
                    marginLeft: hp(1.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: hp(2),
                    borderRadius: 5,
                    backgroundColor: Colors.white,
                    // opacity: 0.5,
                    borderColor: Colors.line,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color: Colors.headingColor,
                      opacity: 0.5,
                      fontSize: hp(2.2),
                    }}>
                    Add Dose
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          ) : null}
          {this.state.cardIndex === 2 ? (
            <View
              style={{
                margin: hp(2),
                backgroundColor: Colors.white,
                borderRadius: 10,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                flexDirection: 'column',

                alignSelf: 'center',

                width: '90%',

                paddingBottom: hp(1.5),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  marginTop: hp(3),
                  marginLeft: hp(2),
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
                  padding: hp(2),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 1;
                    this.setState({
                      frequSelectedIndex: 1,
                      selectButtonOnIncrementDecrement: false,
                      morning: !this.state.morning,
                    });
                    global.selectedData.frequencyLabel = 'Daily';
                    global.selectedData.frequencyInDays = 1;
                  }}
                  style={{
                    width: 80,
                    height: 42,
                    borderWidth: 1,
                    marginRight: hp(2),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor:
                      this.state.morning === true
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.morning === true
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.morning === true
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    Morning
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 3;
                    this.setState({
                      frequSelectedIndex: 3,
                      selectButtonOnIncrementDecrement: false,
                      noon: !this.state.noon,
                    });
                    global.selectedData.frequencyLabel = 'Weekly';
                    global.selectedData.frequencyInDays = 7;
                  }}
                  style={{
                    width: 80,
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(1.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginRight: hp(2),
                    backgroundColor:
                      this.state.noon === true
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.noon === true
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.noon === true
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    Noon
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 4;
                    this.setState({
                      frequSelectedIndex: 4,
                      evening: !this.state.evening,
                    });
                    global.selectedData.frequencyLabel = 'Monthly';
                    global.selectedData.frequencyInDays = 30;
                  }}
                  style={{
                    width: 80,
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(1.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: hp(2),
                    borderRadius: 5,
                    backgroundColor:
                      this.state.evening === true
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.evening === true
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.evening === true
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2.2),
                    }}>
                    Evening
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => {
                    global.frequencyIndex = 2;
                    this.setState({
                      frequSelectedIndex: 2,
                      selectButtonOnIncrementDecrement: true,
                    });
                    global.selectedData.frequencyLabel =
                      this.state.count + ' Day';
                    global.selectedData.frequencyInDays = this.state.count;
                  }}
                  style={{
                    width: 80,
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(1.5),
                    alignItems: 'center',
                    justifyContent: 'center',

                    borderRadius: 5,
                    backgroundColor:
                      this.state.frequSelectedIndex === 2
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.frequSelectedIndex === 2
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.frequSelectedIndex === 2
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    4
                  </Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  onPress={() => {
                    // global.frequencyIndex = 4;
                    // this.setState({frequSelectedIndex: 4});
                    // global.selectedData.frequencyLabel = 'Monthly';
                    // global.selectedData.frequencyInDays = 30;
                  }}
                  style={{
                    width: 110,
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(1.5),
                    marginLeft: hp(1.5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: hp(2),
                    borderRadius: 5,
                    backgroundColor: Colors.white,
                    // opacity: 0.5,
                    borderColor: Colors.line,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color: Colors.headingColor,
                      opacity: 0.5,
                      fontSize: hp(2.2),
                    }}>
                    Add Dose
                  </Text>
                </TouchableOpacity> */}
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  marginTop: hp(1.5),
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
              </View> */}
            </View>
          ) : null}
          {this.state.cardIndex === 3 ? (
            <View
              style={{
                margin: Platform.OS==='ios'?hp(2):hp(4),
                backgroundColor: Colors.white,
                borderRadius: 10,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                flexDirection: 'column',
                // alignItems: 'center',
                alignSelf: 'center',
                // height: Platform.OS === 'ios' ? '36%' : '43%',
                width: '90%',
                padding: hp(2),
                paddingBottom: hp(2.5),
                borderColor:'red',
                borderWidth:0
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: Colors.black,
                  marginTop: hp(1),
                }}>
                Have you got any intake advice?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(3),
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    global.selectedIndex = 0;
                    this.setState({selectedIndex: 0});
                    global.selectedData.mealStatus = false;
                  }}
                  style={{
                    flex: 1,
                    height: 42,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor:
                      this.state.selectedIndex === 0
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.selectedIndex === 0
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.NunitoBold,
                      color:
                        this.state.selectedIndex === 0
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    Before Meal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.selectedIndex = 1;
                    this.setState({selectedIndex: 1});
                    global.selectedData.mealStatus = true;
                  }}
                  style={{
                    flex: 1,
                    height: 42,
                    borderWidth: 1,
                    marginLeft: hp(1),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor:
                      this.state.selectedIndex === 1
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.selectedIndex === 1
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.NunitoBold,
                      color:
                        this.state.selectedIndex === 1
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    After Meal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {this.state.cardIndex === 4 ? (
            <Fragment>

            <View
              style={{
                margin: hp(2),
                backgroundColor: Colors.white,
                borderRadius: 10,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                flexDirection: 'column',
                // alignItems: 'center',
                alignSelf: 'center',
                // height: hp(25),
                width: '90%',
                padding: hp(2),
                borderColor:'green',
                borderWidth:0
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: Colors.black,
                }}>
                Quantity?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: hp(1),
                }}>
                {this.renderDoseArray()}
              </View>
              
            </View>
            <View
                  style={{
                    width: '52%',
                    height: 42,
                    marginTop: hp(1.5),
                  
                  }}>
                  {/* <TextInput
                    style={{
                      height: '100%',
                      textAlign: 'center',
                      borderWidth: 1,
                      borderColor:
                        this.state.quantityIndex === 77
                          ? Colors.blueTextColor
                          : Colors.line,
                      borderRadius: 5,
                      visibility:'hidden'
                    }}

                    placeholder="Add Dose"
                    placeholderTextColor={Colors.noRecordFound}
                    returnKeyType={'done'}
                    onChangeText={val => {
                      console.log('====================================');
                      console.log('value', val);
                      console.log('====================================');
                      this.setState({
                        quantityIndex: 77,
                        doseTextInput: val,
                      });
                      if (val < 7) {
                        this.setState({
                          doseTextInput: val,
                        });
                        global.selectedData.quantity = parseFloat(val);
                        global.quantityIndex = 77;
                        global.quantity = parseFloat(val);
                      } else {
                        this.setState({
                          doseTextInput: '',
                        });
                      }
                    }}
                    value={this.state.doseTextInput}
                    keyboardType={'numeric'}
                  /> */}
                </View>
            </Fragment>
          ) : null}
          {this.state.cardIndex >= 5 ? (
            <View
              style={{
                margin: hp(2),
                backgroundColor: Colors.white,
                borderRadius: 10,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                flexDirection: 'column',
                // alignItems: 'center',
                alignSelf: 'center',
                height: hp(25),
                width: '90%',
                padding: hp(2),
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,

                  fontSize: hp(2),
                  color: Colors.black,
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
                    this.setState({dateSelectedIndex: 1});
                    global.selectedData.endDate = null;
                  }}
                  style={{
                    height: 42,
                    borderWidth: 1,
                    paddingHorizontal: hp(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: hp(2),
                    borderRadius: 5,
                    backgroundColor:
                      this.state.dateSelectedIndex === 1
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.dateSelectedIndex === 1
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.dateSelectedIndex === 1
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    Never
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.stopIndex = 2;
                    this.setState({dateSelectedIndex: 2});
                    var todayDate = new Date();
                    var numberOfDaysToAdd = 7;
                    todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
                    console.log('todayDate');
                    console.log(todayDate);
                    global.selectedData.endDate = todayDate;
                  }}
                  style={{
                    height: 42,
                    borderWidth: 1,
                    paddingHorizontal: hp(1.5),
                    marginLeft: hp(1),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: hp(2),
                    borderRadius: 5,
                    backgroundColor:
                      this.state.dateSelectedIndex === 2
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.dateSelectedIndex === 2
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.dateSelectedIndex === 2
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    After a Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    global.stopIndex = 3;
                    this.setState({dateSelectedIndex: 3});
                    var todayDate = new Date();
                    var numberOfDaysToAdd = 30;
                    todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
                    console.log('aftermonthDate');
                    console.log(todayDate);
                    global.selectedData.endDate = todayDate;
                  }}
                  style={{
                    height: 42,
                    borderWidth: 1,
                    marginTop: hp(2),
                    paddingHorizontal: hp(1.5),
                    marginRight: hp(1),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: hp(2),
                    borderRadius: 5,
                    backgroundColor:
                      this.state.dateSelectedIndex === 3
                        ? Colors.blueTextColor
                        : Colors.bleLayer4,
                    borderColor:
                      this.state.dateSelectedIndex === 3
                        ? Colors.blueTextColor
                        : Colors.bleLayer3,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      color:
                        this.state.dateSelectedIndex === 3
                          ? Colors.white
                          : Colors.TextColor,
                      fontSize: hp(2),
                    }}>
                    After a Month
                  </Text>
                </TouchableOpacity>
                {this.state.stopDate !== null ? (
                  <TouchableOpacity
                    onPress={() => {
                      global.stopIndex = 4;
                      this.setState({dateSelectedIndex: 4});
                      var todayDate = new Date();
                      var numberOfDaysToAdd = 30;
                      todayDate.setDate(
                        todayDate.getDate() + numberOfDaysToAdd,
                      );
                      console.log('aftermonthDate');
                      console.log(todayDate);
                      global.selectedData.endDate = todayDate;
                      this.startDatePicker();
                    }}
                    style={{
                      height: 40,
                      borderWidth: 1,
                      marginTop: hp(1.5),
                      marginRight: hp(1),
                      paddingHorizontal: hp(2),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      backgroundColor:
                        this.state.dateSelectedIndex === 4
                          ? Colors.blueTextColor
                          : Colors.medicalHistoryBg,
                      borderColor:
                        this.state.dateSelectedIndex === 4
                          ? Colors.blueTextColor
                          : Colors.border,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        color:
                          this.state.dateSelectedIndex === 4
                            ? Colors.white
                            : Colors.buttonLabel,
                        fontSize: hp(2.2),
                      }}>
                      {new Date(this.state.stopDate).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                ) : 
                // changin it because of hanan request (START)
                <TouchableOpacity
                  onPress={() => {
                    this.startDatePicker();
                  }}
                  style={{
                    width: 150,
                    height: 42,
                    marginTop: hp(1),

                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: hp(1.3),
                    paddingLeft: hp(1),
                    paddingRight: hp(1),
                    borderColor: Colors.headingColor,
                    opacity: 0.3,
                    borderRadius: 5,
                    borderWidth: 2,
                    backgroundColor: Colors.white,
                  }}>
                  <Text
                    style={{
                      // fontFamily: 'WisemanPTSymbols',
                      fontSize: hp(2),
                      color: Colors.headingColor,

                      // justifyContent: 'center',
                      // alignItems: 'center',
                      // alignSelf: 'center',
                      ...Platform.select({
                        android: {},
                      }),
                    }}>
                    By Date
                  </Text>

                  <Image
                    source={images.calenderIcon}
                    style={{justifyContent: 'flex-end'}}
                  />
                </TouchableOpacity>
                // changin it because of hanan request (END)

                }
                {/* <TouchableOpacity
                  onPress={() => {
                    this.startDatePicker();
                  }}
                  style={{
                    width: 150,
                    height: 42,
                    marginTop: hp(1),

                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: hp(1.3),
                    paddingLeft: hp(1),
                    paddingRight: hp(1),
                    borderColor: Colors.headingColor,
                    opacity: 0.3,
                    borderRadius: 5,
                    borderWidth: 2,
                    backgroundColor: Colors.white,
                  }}>
                  <Text
                    style={{
                      // fontFamily: 'WisemanPTSymbols',
                      fontSize: hp(2),
                      color: Colors.headingColor,

                      // justifyContent: 'center',
                      // alignItems: 'center',
                      // alignSelf: 'center',
                      ...Platform.select({
                        android: {},
                      }),
                    }}>
                    By Date
                  </Text>

                  <Image
                    source={images.calenderIcon}
                    style={{justifyContent: 'flex-end'}}
                  />
                </TouchableOpacity>
              */}
            
                </View>
            </View> 
          ) : null}
          {/* </View> */}
          <View
            style={{
              // marginTop: hp(10),
              height: hp(25),
              backgroundColor: Colors.BgColor,
              paddingTop: hp(0),
              paddingHorizontal: hp(2),
              flexDirection: 'row',
              // margin: hp(3),
              justifyContent: 'space-around',
              //backgroundColor: Colors.green,
            }}>
            {this.state.cardIndex === 1 ? null : (
              <TouchableOpacity
                onPress={() => {
                  global.frequencyIndex = 1;
                  global.timeArray = [];
                  this.state.timeArrNew = [];

                  global.selectedIndex = 0;
                  global.quantityIndex = 0;
                  global.stopIndex = 1;
                  global.date = null;
                  console.log(global.selectedData);

                  this.setState({cardIndex: this.state.cardIndex - 1});
                  console.log(this.state.cardIndex);
                  console.log('checking global card index value');
                  if (this.state.index > 1) {
                    this.setState({index: this.state.index - 1});
                  }
                }}
                style={{
                  // flex: 1,
                  height: 57,
                  width: '45%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderRadius: 10,
                  backgroundColor: Colors.bleLayer3,
                  borderColor: Colors.bleLayer3,
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.blueTextColor,
                    fontSize: hp(2.6),
                  }}>
                  Back
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
              //  Dose Check by danish
              //  if((this.state.cardIndex === 4) && ((this.state.doseTextInput.length ===0)||(this.state.doseTextInput.charCodeAt(0) === 48)) ){
              //   showMessage({
              //     message: 'Information',
              //     description: 'Please enter a valid dose',
              //     type: 'default',
              //     icon: {icon: 'info', position: 'left'},
              //     backgroundColor: Colors.red,
              //   });
              //     // console.log('Current dose is ',this.state.doseTextInput,'Integer value is : ',((this.state.doseTextInput.length ===0)||(this.state.doseTextInput.charCodeAt(0) === 48)),'Current Index is ',this.state.cardIndex)
              //  }  //  Dose Check by danish
              //  else
              //  {
                // Else case start
                 if (this.state.cardIndex <= 4) {
                   this.setState({cardIndex: this.state.cardIndex + 1});
                 } else {
                   console.log('done increment', this.state.cardIndex);
                 }
 
                 console.log(this.state.cardIndex);
                 console.log('checking global card index value');
                 if (this.state.index < 2) {
                   this.setState({index: this.state.index + 1});
                 } else {
                   console.log(
                     'done called',
                     global.selectedData.doseTimings.length,
                   );
                   console.log(
                     'this is the logger checker',
                     this.state.timeArrNew,
                   );
                   if (this.state.cardIndex >= 5) {
                     this.setState({showLoader: true});
                     this.state.timeArrNew = [];
                     if (this.state.morning === true) {
                       this.state.timeArrNew.push('08:05 AM');
                     }
                     if (this.state.evening === true) {
                       this.state.timeArrNew.push('05:05 PM');
                     }
                     if (this.state.noon === true) {
                       this.state.timeArrNew.push('12:05 PM');
                     }
                     if (global.selectedData.doseTimings.length === 0) {
                       alert('Please add Time');
                     }
                     global.selectedData.doseTimings = this.state.timeArrNew;
                     global.selectedData.utcOffsetInMinutes =
                       this.state.timeOffest;
                     console.log(
                       'Add Medication Data',
                       '==================',
                       'Add Medication Data',
                       global.selectedData,
                     );
                     MedicationService.addMedication(global.selectedData)
                       .then(response => {
                         this.setState({showLoader: false});
 
                         console.log('response in add med');
                         console.log(response);
                         if (response.statusCode === 200) {
                           // Successfully Added Medication. Schedule Reminders for it now.
                           // createOrUpdateReminderForMedication(
                           //   global.selectedData,
                           //   response.Data.UserMedId,
                           //   false,
                           // );
                           global.frequencyIndex = 1;
                           global.timeArray = [];
                           this.state.timeArrNew = [];
                           global.selectedIndex = 0;
                           global.quantityIndex = 0;
                           global.stopIndex = 1;
                           global.date = null;
 
                           this.props.navigation.goBack();
                         }
                       })
                       .catch(err => {
                         this.setState({showLoader: false});
 
                         console.log('error');
                         console.log(err);
                         showMessage({
                           message: 'Unable to add requested medicine',
                           description: err.detail,
                           type: 'default',
                           icon: {icon: 'info', position: 'left'},
                           backgroundColor: Colors.homeYellow,
                         });
                       });
                   }
                 }
                 // Else case (END)
              //  } 
              }}
              style={{
                // flex: 1,
                height: 57,
                width: this.state.cardIndex === 1 ? '95%' : '45%',
                marginLeft: hp(1),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: Colors.blueTextColor,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansBold,
                  color: Colors.white,
                  fontSize: hp(2.6),
                }}>
                {this.state.cardIndex >= 2 && this.state.cardIndex >= 5
                  ? 'Add Medicine'
                  : 'Next' //+`${this.state.doseTextInput}`
                  }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Fragment>
    );
  }
}
