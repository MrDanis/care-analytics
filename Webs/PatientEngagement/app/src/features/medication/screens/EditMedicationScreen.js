/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {showMessage} from 'react-native-flash-message';
import {Colors, Images} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import MedicationService from '../../../api/medication';
import {MedicationType} from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-date-picker';
export default class EditMedicationScreen extends React.PureComponent {
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
      timeSelectedArray: [new Date()],
      tabletQuantity: ['0.5', '1', '2', '3'],
      injectionQuantity: ['1', '5', '10', '20', '50'],
      syrupQuantity: ['5', '10', '15'],
      capsuleQuantity: ['1', '2', '3'],
      quantityIndex: 0,
      selectedDose: '',
      quantity: ['0.5', '1', '2', '3'],
      selectedQuantity: [],
      replaceIndex: -1,
      quantityText: '',
      quantityUnit: '',
      dateSelectedIndex: 1,
      stopDate: null,
      count: 2,
      selectButtonOnIncrementDecrement: false,
      frequSelectedIndex: 0,
      morning: false,
      noon: false,
      evening: false,
      timeArrNew: [],
      medId: this.props.route.params.medId,
      doseField: '',
      stripSize: null,
    };
    var d1 = new Date(),
      d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 30);
    this.setTime(d1);
  }
  componentDidMount(): void {
    var dummyTimeArr = [];
    var data = {};
    this.state.timeArray.map((time, index) => {
      data = {time: time, selected: true};
      dummyTimeArr.push(data);
    });
    this.getMedicationById();
    // this.selectDoseQuantity();
    console.log('medId in Edit Medication', this.state.medId);
  }

  getMedicationById() {
    this.setState({showLoader: true});
    MedicationService.getMedicationById(this.state.medId).then(response => {
      console.log('====================================');
      console.log('res of med by id', response);
      console.log('====================================');
      if (response && response.statusCode === 200) {
        this.setState({showLoader: false});
        global.selectedData = response.data;
        if (response.data.frequencyInDays === 30) {
          global.frequencyIndex = 4;
          this.setState({
            frequSelectedIndex: 4,
            selectButtonOnIncrementDecrement: false,
          });
          global.selectedData.frequencyLabel = 'Monthly';
          global.selectedData.frequencyInDays = 30;
        } else if (response.data.frequencyInDays === 1) {
          global.frequencyIndex = 1;
          this.setState({
            frequSelectedIndex: 1,
            selectButtonOnIncrementDecrement: false,
          });
          global.selectedData.frequencyLabel = 'Daily';
          global.selectedData.frequencyInDays = 1;
        } else if (response.data.frequencyInDays === 7) {
          global.frequencyIndex = 3;
          this.setState({
            frequSelectedIndex: 3,
            selectButtonOnIncrementDecrement: false,
          });
          global.selectedData.frequencyLabel = 'Weekly';
          global.selectedData.frequencyInDays = 7;
        } else {
          global.frequencyIndex = 2;
          this.setState({
            frequSelectedIndex: 2,
            selectButtonOnIncrementDecrement: true,
          });
          global.selectedData.frequencyLabel =
            response.data.frequencyInDays + ' Day';
          global.selectedData.frequencyInDays = response.data.frequencyInDays;
        }
        response.data.medicationSlot.map(slot => {
          if (slot === 0) {
            this.setState({morning: true});
            this.state.timeArrNew.push('8:05 AM');
          }
          if (slot === 1) {
            this.setState({noon: true});
            this.state.timeArrNew.push('05:05 PM');
          }
          if (slot === 2) {
            this.setState({evening: true});
            this.state.timeArrNew.push('12:05 PM');
          }
          global.selectedData.doseTimings = this.state.timeArrNew;
        });

        if (response.data.mealStatus === false) {
          global.selectedIndex = 0;
          this.setState({selectedIndex: 0});
          global.selectedData.mealStatus = false;
        }
        if (response.data.mealStatus === true) {
          global.selectedIndex = 1;
          this.setState({selectedIndex: 1});
          global.selectedData.mealStatus = true;
        }

        this.geSelectedDoseQuantityIndex(response.data);
        this.selectDoseQuantity(response.data);
      } else {
        this.setState({showLoader: false});
      }
    });
  }
  geSelectedDoseQuantityIndex(data) {
    if (data.fdaMedicine.dosageformname.includes(MedicationType.TABLET)) {
      this.state.tabletQuantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.tableQuantity', this.state.tabletQuantity);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 5) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.CAPSULE)
    ) {
      this.state.capsuleQuantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.capsuleQuantity', this.state.capsuleQuantity);
        console.log('====================================');
        console.log('====================================');
        console.log('index of capsule quantity', index);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 5) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.INJECTION1)
    ) {
      this.state.injectionQuantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.injection', this.state.injectionQuantity);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 50) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.INJECTION2)
    ) {
      this.state.injectionQuantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.injection', this.state.injectionQuantity);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 50) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.SYRUP1)
    ) {
      this.state.syrupQuantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.syrup', this.state.syrupQuantity);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 15) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.SYRUP2)
    ) {
      this.state.syrupQuantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.syrup', this.state.syrupQuantity);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 15) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.EYEDROPS)
    ) {
      this.state.capsuleQuantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.capsule', this.state.capsuleQuantity);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 5) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    } else {
      this.state.quantity.map((dose, index) => {
        console.log('====================================');
        console.log('this.state.quantity', this.state.quantity);
        console.log('====================================');
        if (dose === JSON.stringify(data.quantity)) {
          this.setState({
            quantityIndex: index,
          });
        }
        if (data.quantity > 5) {
          this.setState({
            doseField: JSON.stringify(data.quantity),
            quantityIndex: 77,
          });
        }
        global.selectedData.quantity = parseFloat(data.quantity);

        global.quantity = parseFloat(data.quantity);
      });
    }
  }
  selectDoseQuantity(data) {
    if (data.fdaMedicine.dosageformname.includes(MedicationType.TABLET)) {
      this.setState({
        selectedQuantity: this.state.tabletQuantity,
        quantityText: 'Tablet Quantity',
        quantityUnit: '',
        stripSize: `${data.fdaMedicine.packageSize} tablets`,
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.CAPSULE)
    ) {
      this.setState({
        selectedQuantity: this.state.capsuleQuantity,
        quantityText: 'Capsule Quantity',
        quantityUnit: '',
        stripSize: `${data.fdaMedicine.packageSize} capsules`,
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.INJECTION1)
    ) {
      this.setState({
        selectedQuantity: this.state.injectionQuantity,
        quantityText: 'Injection Quantity',
        quantityUnit: 'mL',
        stripSize: `${data.fdaMedicine.packageSize} mL`,
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.INJECTION2)
    ) {
      this.setState({
        selectedQuantity: this.state.injectionQuantity,
        quantityText: 'Injection Quantity',
        quantityUnit: 'mL',
        stripSize: `${data.fdaMedicine.packageSize} mL`,
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.SYRUP1)
    ) {
      this.setState({
        selectedQuantity: this.state.syrupQuantity,
        quantityText: 'Syrup Quantity',
        quantityUnit: 'mL',
        stripSize: `${data.fdaMedicine.packageSize} mL`,
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.SYRUP2)
    ) {
      this.setState({
        selectedQuantity: this.state.syrupQuantity,
        quantityText: 'Syrup Quantity',
        quantityUnit: 'mL',
        stripSize: `${data.fdaMedicine.packageSize} mL`,
      });
    } else if (
      data.fdaMedicine.dosageformname.includes(MedicationType.EYEDROPS)
    ) {
      this.setState({
        selectedQuantity: this.state.capsuleQuantity,
        quantityText: 'Drops Quantity',
        quantityUnit: '',
        stripSize: `${data.fdaMedicine.packageSize} mL`,
      });
    } else {
      this.setState({
        selectedQuantity: this.state.quantity,
        quantityText: 'Quantity',
        quantityUnit: '',
        stripSize: `${data.fdaMedicine.packageSize} tablets`,
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
      console.log('====================================');
      console.log('index of dose array', index);
      console.log('====================================');
      // below check is added because user can't edit the medicine quantity
      return (
        <>
         {
         index<1?
         null
         :
         <TouchableOpacity
         onPress={() => {
           console.log('selectedQuantity');
           console.log(dose);
           this.setState({
             quantityIndex: index,
           });
           global.selectedData.quantity = parseFloat(dose);
           global.quantityIndex = index;
           global.quantity = parseFloat(dose);
         }}
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
        }
        </>
        
      );
    });
  }

  render() {
    var minDate = new Date();
    minDate.setDate(minDate.getDate());
    var minimumDate = minDate.setHours(0, 0, 0, 0);
    console.log('Is date picker visible is there....',this.state.isDatePickerVisible);
    return (
      <Fragment>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
          }}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Loading...'}
            textStyle={{color: '#FFF'}}
          />
          <View style={{flex: 1, backgroundColor: Colors.BgColor}}>

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
                Edit Medication
              </Text>
              <View style={{marginRight: hp(2)}}>
                {/* <TouchableOpacity>
                  <HistoryIcon />
                </TouchableOpacity> */}
              </View>

              <TouchableOpacity
                onPress={async () => {}}
                style={{
                  alignSelf: 'center',
                  marginRight: hp(3),
                }}>
                <Image source={Images.hamburgIcon} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: hp(2),
                height: '30%',
                minHeight: '40%',
                maxHeight: '40%',
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
                  display: 'flex',
                }}>
                {/* {global.selectedData.fdaMedicine?.imagePath ? (
                  (console.log(global.selectedData.fdaMedicine?.imagePath),
                  console.log('cheking global images datatatatatata'),
                  (
                    <View style={{paddingTop: hp(3)}}>
                      <Image
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 20,
                          alignSelf: 'center',
                          marginRight: hp(1),
                        }}
                        source={{
                          uri: global.selectedData.fdaMedicine?.imagePath,
                        }}
                        //  onError={this.onError.bind(this)}
                      />
                    </View>
                  ))
                ) : ( */}
                <View style={{paddingTop: hp(3)}}>
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 20,
                      alignSelf: 'center',
                      marginRight: hp(1),
                    }}
                    source={Images.medIcon4x} //{Images.generalMedIcon}
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
                  {global.selectedData.fdaMedicine?.proprietaryname}
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
                          global.selectedData.frequencyInDays =
                            this.state.count;
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
                      this.setState({
                        morning: !this.state.morning,
                      });
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
                      this.setState({
                        noon: !this.state.noon,
                      });
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
                      this.setState({
                        evening: !this.state.evening,
                      });
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
                </View>
              </View>
            ) : null}
            {this.state.cardIndex === 3 ? (
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
                  // height: Platform.OS === 'ios' ? '36%' : '43%',
                  width: '90%',
                  padding: hp(2),
                  paddingBottom: hp(2.5),
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
                  {/* <View
                    style={{
                      width: '52%',
                      height: 42,
                      marginTop: hp(1.5),
                      display:'none'
                    }}>
                    <TextInput
                      style={{
                        height: '100%',
                        textAlign: 'center',
                        borderWidth: 1,

                        borderColor:
                          this.state.quantityIndex === 77
                            ? Colors.blueTextColor
                            : Colors.line,
                        borderRadius: 5,
                      }}
                      placeholder="Add Dose"
                      placeholderTextColor={Colors.noRecordFound}
                      returnKeyType={'done'}
                      onChangeText={val => {
                        this.setState({doseField: val});
                        console.log('first', val);
                        this.setState({
                          quantityIndex: 77,
                        });
                        global.selectedData.quantity = parseFloat(val);
                        global.quantityIndex = 77;
                        global.quantity = parseFloat(val);
                      }}
                      keyboardType={'numeric'}
                      value={this.state.doseField}
                    />
                  </View> */}
                </View>
              </View>
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
                      todayDate.setDate(
                        todayDate.getDate() + numberOfDaysToAdd,
                      );
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
                      todayDate.setDate(
                        todayDate.getDate() + numberOfDaysToAdd,
                      );
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
                      source={Images.calenderIcon}
                      style={{justifyContent: 'flex-end'}}
                    />
                </TouchableOpacity>
               // changin it because of hanan request (START)    
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
                      source={Images.calenderIcon}
                      style={{justifyContent: 'flex-end'}}
                    />
                  </TouchableOpacity> */}
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
                    if (this.state.cardIndex >= 5) {
                      let slot = [];
                      this.setState({showLoader: true});
                      this.state.timeArrNew = [];
                      if (this.state.morning === true) {
                        this.state.timeArrNew.push('08:05 AM');
                        slot.push(0);
                      }
                      if (this.state.evening === true) {
                        this.state.timeArrNew.push('05:05 PM');
                        slot.push(2);
                      }
                      if (this.state.noon === true) {
                        this.state.timeArrNew.push('12:05 PM');
                        slot.push(1);
                      }
                      console.log('====================================');
                      console.log('slot', slot);
                      console.log('====================================');
                      if (global.selectedData.doseTimings.length === 0) {
                        alert('Please add Time');
                      }
                      global.selectedData.doseTimings = this.state.timeArrNew;
                      global.selectedData.medicationSlot = slot;
                      global.selectedData.utcOffsetInMinutes =
                        this.state.timeOffest;
                      console.log('====================================');
                      console.log(
                        'global.selectedData in Edit',
                        JSON.stringify(global.selectedData),
                      );
                      console.log('====================================');
                      MedicationService.updateMedication(global.selectedData)
                        .then(response => {
                          this.setState({showLoader: false});
                          console.log('response in update med');
                          console.log(response);
                          if (response.statusCode === 200) {
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
                    ? 'Edit Medicine'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
