/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {DayTime} from '../constants';
import MorningIcon from '../../../../../assets/svg/illustration_morning.svg';
import {Fonts} from '../../../../config/AppConfig';
import {MedicationItem} from '../components/MedicationItem';
import NoonIcon2 from '../../../../../assets/svg/illustration_Noon.svg';
import EveningIcon2 from '../../../../../assets/svg/illustration_Evening.svg';
import NightIcon2 from '../../../../../assets/svg/illustration_Night.svg';
import {connect} from 'react-redux';
import {convertUTCDateToLocalDate, getDayTime} from '../../../helpers/Common';
import {Modalize} from 'react-native-modalize';
import SvgNoImageFoundIcon from '../../../../../assets/svg/noMedImage.svg';
import MedicationService from '../../../api/medication';
import Spinner from 'react-native-loading-spinner-overlay';

class AllTodayMedicationScreen extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };
  constructor(props) {
    super(props);
    // const {
    //   morningData,
    //   noonData,
    //   eveningData,
    //   nightData,
    // } = this.props.navigation.state.params;
    // this.state = {
    //   morningArray: morningData,
    //   noonArray: noonData,
    //   eveningArray: eveningData,
    //   nightArray: nightData,
    // };
    this.state = {
      morningArray: [],
      noonArray: [],
      eveningArray: [],
      nightArray: [],
      currentItem: {},
      showLoader: false,
    };
  }
  componentDidMount(): void {
    // this.getAllMedicationData()
    this.getTodayMedicationData(this.props.allTodayMedicationData);
  }
  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    this.getTodayMedicationData(this.props.allTodayMedicationData);
    // this.getAllMedicationData()
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
    if (
      prevProps.allTodayMedicationData.length !==
      this.props.allTodayMedicationData.length
    ) {
      this.getTodayMedicationData(this.props.allTodayMedicationData);
      // this.getAllMedicationData()
    }
  }
  getAllMedicationData() {
    MedicationService.getTodayMedication()
      .then(response => {
        this.setState({showLoader: false});
        console.log('getTodayMedication');
        console.log(JSON.stringify(response));
        console.log('medicine length', JSON.stringify(response.data.length));
        if (
          response &&
          response.statusCode === 200 &&
          response.data.length > 0
        ) {
          this.getTodayMedicationData(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({showLoader: false});
      });
  }
  getTodayMedicationData(data) {
    var date = convertUTCDateToLocalDate(new Date());
    console.log('time local********');
    console.log(date.getUTCHours(), date.getUTCMinutes());
    console.log(getDayTime(date.getUTCHours() + ':' + date.getUTCMinutes()));
    this.setState({
      dayTime: getDayTime(date.getUTCHours() + ':' + date.getUTCMinutes()),
    });
    var morningData = [];
    var noonData = [];
    var eveningData = [];
    var nightData = [];
    this.setState({showLoader: false});
    console.log('allGetTodayMedication');
    console.log(JSON.stringify(data));
    if (data.length > 0) {
      console.log('this.props.data.length');
      console.log(data.length);
      for (var i = 0; i < data.length; i++) {
        var medicationItem = data[i];
        var timings = medicationItem.doseTimings;
        for (var j = 0; j < timings.length; j++) {
          let time = timings[j];
          if (getDayTime(time) === DayTime.MORNING) {
            let obj = JSON.parse(JSON.stringify(medicationItem));
            obj.time = time;
            morningData.push(obj);
          } else if (getDayTime(time) === DayTime.NOON) {
            let obj = JSON.parse(JSON.stringify(medicationItem));
            obj.time = time;
            noonData.push(obj);
          } else if (getDayTime(time) === DayTime.EVENING) {
            let obj = JSON.parse(JSON.stringify(medicationItem));
            obj.time = time;
            eveningData.push(obj);
            console.log(time);
          } else if (getDayTime(time) === DayTime.NIGHT) {
            let obj = JSON.parse(JSON.stringify(medicationItem));
            obj.time = time;
            nightData.push(obj);
          }
        }
      }
      console.log('morningData');
      console.log(morningData);
      console.log('noonData');
      console.log(noonData);
      console.log('eveningData');
      console.log(eveningData);
      console.log('nightData');
      console.log(nightData);
      this.setState({
        morningArray: morningData,
        noonArray: noonData,
        eveningArray: eveningData,
        nightArray: nightData,
      });
    }
  }

  onOpen(item) {
    this.setState({currentItem: item});
    this.refs.modalize.open();
    console.log('====================================');
    console.log('here in open', item);
    console.log('====================================');
  }

  onClose() {
    this.refs.modalize.close();
  }

  showFrequencyDays(Days) {
    const Frequency = Days;
    console.log('====================================');
    console.log('Frequency', Frequency);
    console.log('====================================');
    if (Frequency === 1) {
      return 'Daily';
    } else if (Frequency === 7) {
      return 'Weekly';
    } else if (Frequency === 30) {
      return 'Monthly';
    } else {
      return 'Every ' + Frequency + ' Days';
    }
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.white,
          }}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Loading....'}
            textStyle={{color: '#FFF'}}
          />
          <ScrollView style={{flex: 1, backgroundColor: Colors.white}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                height: hp(8),
                backgroundColor: Colors.white,
                borderBottomWidth: 0.2,
                borderColor: Colors.lightGrey,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{alignSelf: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'WisemanPTSymbols',
                    fontSize: hp(4),
                    marginLeft: hp(2),
                    marginRight: hp(2),
                    color: Colors.black1,
                    alignSelf: 'center',
                  }}>
                  W
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontFamily: Fonts.SourceSansMedium,
                  color: Colors.black1,
                  alignSelf: 'center',
                }}>
                All for today
              </Text>
            </View>
            {this.state.morningArray.length ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginHorizontal: hp(2),
                    alignItems: 'center',
                  }}>
                  <MorningIcon width={30} height={30} fill="#000" />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansBold,
                      marginLeft: heightPercentageToDP(2),
                      marginRight: heightPercentageToDP(5),
                      fontSize: hp(2.6),
                      color: Colors.morningHeadingColor,
                    }}>
                    Morning
                  </Text>
                </View>
                <View style={{}}>
                  <FlatList
                    data={this.state.morningArray}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({item, index}) => (
                      <MedicationItem
                        key={Math.random().toString(36).substr(2, 9)}
                        item={item}
                        index={index}
                        onStatusChange={() => this.getAllMedicationData()}
                        myProps={this.props}
                        onClick={() => this.onOpen(item)}
                      />
                    )}
                    keyExtractor={item =>
                      Math.random().toString(36).substr(2, 9)
                    }
                  />
                </View>
              </View>
            ) : null}

            {this.state.noonArray.length ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginHorizontal: hp(2),
                    alignItems: 'center',
                  }}>
                  <NoonIcon2 width={30} height={30} fill="#000" />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansBold,
                      marginLeft: heightPercentageToDP(2),
                      marginRight: heightPercentageToDP(5),
                      fontSize: hp(2.6),
                      color: Colors.afternoonHeadingColor,
                    }}>
                    Afternoon
                  </Text>
                </View>
                <View style={{}}>
                  <FlatList
                    data={this.state.noonArray}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({item, index}) => (
                      <MedicationItem
                        key={Math.random().toString(36).substr(2, 9)}
                        item={item}
                        index={index}
                        myProps={this.props}
                        onClick={() => this.onOpen(item)}
                        onStatusChange={() => this.getAllMedicationData()}
                      />
                    )}
                    keyExtractor={item =>
                      Math.random().toString(36).substr(2, 9)
                    }
                  />
                </View>
              </View>
            ) : null}

            {this.state.eveningArray.length ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginHorizontal: hp(2),
                    alignItems: 'center',
                  }}>
                  <EveningIcon2 width={30} height={30} fill="#000" />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansBold,
                      marginLeft: heightPercentageToDP(2),
                      marginRight: heightPercentageToDP(5),
                      fontSize: hp(2.6),
                      color: Colors.eveningHeadingColor,
                    }}>
                    Evening
                  </Text>
                </View>
                <View style={{}}>
                  <FlatList
                    data={this.state.eveningArray}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({item, index}) => (
                      <MedicationItem
                        key={Math.random().toString(36).substr(2, 9)}
                        item={item}
                        index={index}
                        myProps={this.props}
                        onClick={() => this.onOpen(item)}
                        onStatusChange={() => this.getAllMedicationData()}
                      />
                    )}
                    keyExtractor={item =>
                      Math.random().toString(36).substr(2, 9)
                    }
                  />
                </View>
              </View>
            ) : null}

            {this.state.nightArray.length ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginHorizontal: hp(2),
                    alignItems: 'center',
                  }}>
                  <NightIcon2 width={30} height={30} fill="#000" />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansBold,
                      marginLeft: heightPercentageToDP(2),
                      marginRight: heightPercentageToDP(5),
                      fontSize: hp(2.6),
                      color: Colors.nightHeadingColor,
                    }}>
                    Night
                  </Text>
                </View>
                <View style={{}}>
                  <FlatList
                    data={this.state.nightArray}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({item, index}) => (
                      <MedicationItem
                        key={Math.random().toString(36).substr(2, 9)}
                        item={item}
                        index={index}
                        myProps={this.props}
                        onClick={() => this.onOpen(item)}
                        onStatusChange={() => this.getAllMedicationData()}
                      />
                    )}
                    keyExtractor={item =>
                      Math.random().toString(36).substr(2, 9)
                    }
                  />
                </View>
              </View>
            ) : null}
          </ScrollView>
          <Modalize
            ref="modalize"
            adjustToContentHeight={true}
            modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
            <View
              style={{
                padding: hp(2),
                width: '90%',
                alignSelf: 'center',
                borderRadius: 3,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.onClose();
                }}>
                <Text
                  style={{
                    fontFamily: 'WisemanPTSymbols',
                    marginLeft: heightPercentageToDP(1),
                    marginTop: hp(1),
                    marginRight: heightPercentageToDP(1),
                    fontSize: hp(4),
                    color: Colors.black1,
                  }}>
                  U
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '90%',
                  backgroundColor: Colors.white,
                }}>
                {this.state.currentItem?.fdaMedicine?.imagePath ? (
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 80 / 2,
                      alignSelf: 'center',
                      marginRight: hp(1),
                    }}
                    source={this.state.currentItem?.fdaMedicine?.imagePath}
                    onError={this.onError.bind(this)}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 100 / 2,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <SvgNoImageFoundIcon width={80} height={80} />
                  </View>
                )}
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.SourceSansBold,
                    marginTop: hp(5),
                    marginLeft: heightPercentageToDP(5),
                    marginRight: heightPercentageToDP(5),
                    fontSize: 24,
                    color: Colors.blueTextColor,
                  }}>
                  {this.state.currentItem?.fdaMedicine?.proprietaryname}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: heightPercentageToDP(2),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(1.9),
                      marginRight: hp(0.5),
                      color: Colors.noRecordFound,
                    }}>
                    {this.showFrequencyDays(
                      this.state.currentItem?.frequencyInDays,
                    )}
                  </Text>
                  <View
                    style={{
                      height: 5,
                      width: 5,
                      alignSelf: 'center',
                      marginHorizontal: hp(0.5),
                      backgroundColor: Colors.border,
                      borderRadius: 4,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: hp(0.5),
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(1.9),
                      color: Colors.noRecordFound,
                    }}>
                    {this.state.currentItem?.mealStatus === false
                      ? 'Before Meal'
                      : 'After Meal'}
                  </Text>
                </View>
                {/* <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.SourceSansRegular,
                    marginTop: hp(2),
                    marginLeft: heightPercentageToDP(5),
                    marginRight: heightPercentageToDP(5),
                    fontSize: 18,
                    color: Colors.label,
                  }}>
                  {'Have you take it at ' + this.state.currentItem?.time + '?'}
                </Text> */}
                <TouchableOpacity
                  onPress={() => {
                    this.onClose();
                    this.setState({showLoader: true});
                    var data = {};
                    data.id = this.state.currentItem?.id;
                    data.taken = true;
                    data.mealStatus = this.state.currentItem?.mealStatus;
                    data.doseTime = this.state.currentItem?.time;
                    // this.setState({showLoader: true});

                    MedicationService.UpdateTakenMedication(data)
                      .then(response => {
                        console.log('UpdateTakenMedication response');
                        // this.getTodayMedicationData(this.props.allTodayMedicationData)
                        this.setState({
                          dataArrayLength:
                            this.props.allTodayMedicationData.length,
                        });
                        // this.props.todayMedication();
                        this.getAllMedicationData();

                        // this.setState({showLoader: false});
                        console.log(response);
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  }}
                  style={{
                    width: '100%',
                    marginTop: hp(3),
                    marginBottom: hp(2),
                    height: hp(7),
                    alignSelf: 'center',
                    borderRadius: 8,
                    borderColor: Colors.cyan,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.blueBackground,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: 18,
                      color: Colors.white,
                    }}>
                    Taken
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.onClose();
                    this.setState({showLoader: true});
                    var data = {};
                    data.id = this.state.currentItem?.id;
                    data.taken = false;
                    data.mealStatus = this.state.currentItem?.mealStatus;
                    data.doseTime = this.state.currentItem?.time;
                    MedicationService.UpdateTakenMedication(data)
                      .then(response => {
                        console.log('UpdateTakenMedication');
                        console.log(response);
                        // this.getTodayMedicationData(this.props.allTodayMedicationData)

                        this.setState({
                          dataArrayLength:
                            this.props.allTodayMedicationData.length,
                        });
                        this.getAllMedicationData();

                        // this.props.todayMedication();
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  }}
                  style={{
                    width: '100%',
                    marginBottom: hp(2),
                    height: hp(7),
                    alignSelf: 'center',
                    borderRadius: 8,
                    // borderColor: Colors.greenButtonBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.lightRed,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: 18,
                      color: Colors.red3,
                    }}>
                    Not Taken
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modalize>
        </SafeAreaView>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({allTodayMedicationData}) => ({
  allTodayMedicationData,
});
export default connect(mapStateToProps)(AllTodayMedicationScreen);
