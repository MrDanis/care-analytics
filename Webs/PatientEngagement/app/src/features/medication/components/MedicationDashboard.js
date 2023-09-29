/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  PixelRatio,
  View,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Moment from 'moment';
import images from '../../../../../app/config/Images';

import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
import moment from 'moment';
import Modal from 'react-native-modal';
import MedicationService from '../../../api/medication';
import {
  getAllMedication,
  getLookUpMedication,
  getTodayMedication,
  modalHanlder,
} from '../actions';
import AddMed from '../../../../../assets/svg/AddMed.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import CalendarStrip from 'react-native-calendar-strip';
import Spinner from 'react-native-loading-spinner-overlay';
import MedicationItem from '../../medication/components/MedicationItem';
import MedicationTabItem from './MedicationTabItem';
import {connect} from 'react-redux';
import {convertUTCDateToLocalDate, getDayTime} from '../../../helpers/Common';
import {DayTime} from '../constants';
import {MedicationTargetCompleted} from './MedicationTargetCompleted';
import {Modalize} from 'react-native-modalize';
import SvgNoImageFoundIcon from '../../../../../assets/svg/noMedImage.svg';
import {BlurView} from '@react-native-community/blur';
import AllMedicationScreen from '../screens/AllMedicationScreen';
import colors from '../../../../config/Colors';
import FastImage from 'react-native-fast-image';
import {RectButton, Swipeable} from 'react-native-gesture-handler';

class MedicationDashboard extends React.PureComponent {
  swipeableRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      morning: true,
      noon: false,
      EVENING: false,
      modalVisible: false,
      morningArray: [],
      noonArray: [],
      eveningArray: [],
      nightArray: [],
      dayTime: DayTime.MORNING,
      dataArrayLength: 0,
      morningPlateCount: [],
      noonPlateCount: [],
      eveningPlateCount: [],
      nightPlateCount: [],
      todayHeading: 'Medicine to take',
      currentTime: new Date(),
      currentItem: {},
      refreshing: false,
      date: new Date(),
      isOpen: false,
    };
  }

  /* istanbul ignore next */

  componentDidMount(): void {
    console.log('====================================');
    console.log(
      'this.props.allTodayMedicationData',
      this.props.allTodayMedicationData,
    );
    console.log('====================================');
    this.getTodayMedicationData(this.props.allTodayMedicationData);
    this.setState({dataArrayLength: this.props.allTodayMedicationData.length});
    // setInterval(() => {
    //   this.setState({
    //     currentTime: new Date(),
    //   });
    // }, 1000);
  }
  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    this.getTodayMedicationData(this.props.allTodayMedicationData);
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
    }
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
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
    console.log('dashboardGetTodayMedication');
    console.log(data);
    data.filter(x => {
      x.medicationSlot.map(slot => {
        console.log('====================================');
        console.log('slot', slot, `${x.id}`);
        console.log('====================================');
        if (slot === 0) {
          morningData.push(x);
        }
        if (slot === 1) {
          noonData.push(x);
        }
        if (slot === 2) {
          eveningData.push(x);
        }
      });
    });
    // data.filter(x => {
    //   noonData = x.medicationSlot.map(slot => {
    //     if (slot === 0) {
    //       noonData = x;
    //     }
    //   });
    // });
    // data.filter(x => {
    //   eveningData = x.medicationSlot.map(slot => {
    //     if (slot === 0) {
    //       eveningData = x;
    //     }
    //   });
    // });
    console.log('====================================');
    console.log('morningData', morningData);
    console.log('====================================');
    console.log('====================================');
    console.log('noonData', noonData);
    console.log('====================================');
    console.log('====================================');
    console.log('eveningData', eveningData);
    console.log('====================================');
    this.setState({
      morningArray: morningData,
      noonArray: noonData,
      eveningArray: eveningData,
    });
  }
  /* istanbul ignore next */

  _onRefresh = () => {
    this.props.todayMedication();
  };
  setDate() {
    this.props.date = Moment(new Date()).format('yyyy-MM-DDThh:mm:ss');
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

  renderRightAction = (x, progress, item, time) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{translateX: 0}],
          flexDirection: 'row',
        }}>
        <RectButton
          style={styles.rightAction}
          onPress={() => {
            this.props.myProps.navigation.navigate('EditMedication', {
              medId: item.id,
            });
            this.setState({isOpen: true});
          }}>
          <Image
            style={{width: hp(3), height: hp(3)}}
            source={images.edit_image_colored}
          />
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.5),
              marginTop: hp(0.5),
              color: Colors.noRecordFound,
            }}>
            Edit
          </Text>
        </RectButton>
        <RectButton
          style={[styles.rightAction, {backgroundColor: Colors.bleLayer4}]}
          onPress={() => {
            //  setmodalVisible({modalVisible: false});
            var data = {};
            data.id = item.id;
            data.taken = true;
            data.mealStatus = item.mealStatus;
            data.doseTime = time;
            MedicationService.UpdateTakenMedication(data)
              .then(response => {
                console.log('UpdateTakenMedication');
                console.log('UpdateTakenMedication respondo', response);

                this.props.todayMedication();
                // this.getTodayMedicationData();
                console.log(response);
                this.swipeableRef.current.close();
              })
              .catch(error => {
                console.log(error);
              });
          }}>
          <Image source={images.TakenIcon} />
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.5),
              marginTop: hp(0.5),
              color: Colors.noRecordFound,
            }}>
            Taken
          </Text>
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress, item, time) => (
    <View
      style={{
        width: '50%',
        height: hp(10),
        marginRight: hp(2),
        marginLeft: -hp(1.5),
        backgroundColor: Colors.bleLayer4,
        borderRadius: 10,
      }}>
      {this.renderRightAction(160, progress, item, time)}
      {/* {this.renderRightAction('Flag', '#ffab00', 128, progress)}
       {this.renderRightAction('More', '#dd2c00', 64, progress)} */}
    </View>
  );

  render() {
    return (
      <Fragment>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
          }}>
          <View style={{backgroundColor: Colors.BgColor}}>
            <CalendarStrip
              scrollable
              calendarAnimation={{type: 'sequence', duration: 2}}
              daySelectionAnimation={{
                type: 'background',
                duration: 200,
                borderWidth: 1,
                highlightColor: Colors.blueHeadingColor,
                borderHighlightColor: Colors.bleLayer4,
              }}
              style={{
                height: hp(10),
                width: '95%',
                marginLeft: hp(1),
                padding: hp(1),
                justifyContent: 'center',
              }}
              innerStyle={{
                flex: 1,
              }}
              calendarHeaderStyle={{color: Colors.transparent}}
              calendarColor={Colors.BgColor}
              dateNumberStyle={{
                color: Colors.black,
                // paddingTop: Platform.OS === 'ios' ? hp(1) : hp(0.8),
                fontSize: hp(1.5),
              }}
              disabledDateNameStyle={{color: 'black'}}
              disabledDateNumberStyle={{color: Colors.black, fontSize: hp(1.3)}}
              dateNameStyle={{color: Colors.black, fontSize: hp(1.3)}}
              highlightDateNumberStyle={{
                color: Colors.white,
                // paddingTop: Platform.OS === 'ios' ? hp(1) : hp(0.8),
                fontSize: hp(1.5),
              }}
              highlightDateContainerStyle={{
                backgroundColor: Colors.blueTextColor,
                borderRadius: 30,
                width: Platform.OS === 'ios' ? hp(5.2) : hp(5.5),
                height: Platform.OS === 'ios' ? hp(5.2) : hp(5.6),
                // marginTop: -hp(0.2),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              highlightDateNameStyle={{
                color: Colors.white,
                fontSize: hp(1.3),
              }}
              maxDate={moment(new Date()).add(7, 'days')}
              datesBlacklist={[
                moment(new Date()).add(1, 'days'),
                moment(new Date()).add(2, 'days'),
                moment(new Date()).add(3, 'days'),
                moment(new Date()).add(4, 'days'),
                moment(new Date()).add(5, 'days'),
                moment(new Date()).add(6, 'days'),
                moment(new Date()).add(7, 'days'),
              ]}
              iconContainer={{flex: 0.02}}
              selectedDate={this.state.date}
              onDateSelected={date => {
                this.setDate(date);
                console.log('the selecto', date);
                // this.getTodayMedicationData(date);
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '95%',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <View style={{flex: 1}}>
              <MedicationTabItem
                iconimage={images.prescriptionIcon}
                name={'Prescription'}
                navigation={() => {
                  this.props.myProps.navigation.navigate('Prescriptions');
                }}
              />
            </View>
            {/* <MedicationTabItem
              iconimage={images.AddMedIcon}
              name={'Add Medication'}
              navigation={() => {
                this.props.myProps.navigation.navigate('AddNewMedication');
              }}
            /> */}
            <View style={{flex: 1}}>
              <MedicationTabItem
                iconimage={images.refillIconDashboard}
                name={'Refill'}
                navigation={() => {
                  this.props.myProps.navigation.navigate('Prescriptions');
                }}
              />
            </View>
          </View>
          <View
            style={{
              height: '14%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '95%',
                height: '60%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                // marginTop: hp(4),
                //  marginRight: hp(2),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    EVENING: false,
                    morning: true,
                    noon: false,
                  });
                }}>
                <View
                  style={{
                    height: hp(7),
                    width: hp(13),
                    borderBottomWidth: 2,
                    borderBottomColor:
                      this.state.morning === true
                        ? Colors.blueTextColor
                        : Colors.transparent,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    justifyContent: 'center',
                    //
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FastImage
                      style={{
                        width: 17,
                        height: 17,
                        // marginLeft: hp(1.5),
                      }}
                      source={images.sunIcon_dashboard}
                    />

                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2),
                        color:
                          this.state.morning === true
                            ? Colors.blueTextColor
                            : Colors.black,
                        marginHorizontal: hp(0.5),
                        marginBottom: hp(0),
                      }}>
                      Morning
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: Colors.label,
                      paddingTop: hp(0.5),
                      paddingBottom: hp(0.5),
                      fontSize: Platform.OS === 'android' ? hp(1.5) : hp(1.5),
                    }}>
                    {this.state.morningArray.length} Medication(s)
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    EVENING: false,
                    morning: false,
                    noon: true,
                  });
                }}>
                <View
                  style={{
                    height: hp(7),
                    marginLeft: hp(2),
                    width: hp(14),
                    borderBottomWidth: 2,
                    borderBottomColor:
                      this.state.noon === true
                        ? Colors.blueTextColor
                        : Colors.transparent,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    justifyContent: 'center',
                    //
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <FastImage
                      style={{
                        width: 19,
                        height: 17,
                        // marginLeft: hp(1.5),
                      }}
                      source={images.noon_icon}
                    />

                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2),
                        color:
                          this.state.noon === true
                            ? Colors.blueTextColor
                            : Colors.black,
                        marginHorizontal: hp(0.5),
                        marginBottom: hp(0),
                      }}>
                      Noon
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: Colors.label,
                      paddingTop: hp(0.5),
                      paddingBottom: hp(0.5),
                      fontSize: Platform.OS === 'android' ? hp(1.5) : hp(1.5),
                    }}>
                    {this.state.noonArray.length} Medication(s)
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    EVENING: true,
                    morning: false,
                    noon: false,
                  });
                }}>
                <View
                  style={{
                    height: hp(7),

                    width: hp(14),
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomWidth: 2,
                    borderBottomColor:
                      this.state.EVENING === true
                        ? Colors.blueTextColor
                        : Colors.transparent,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FastImage
                      style={{
                        width: 15,
                        height: 17,
                        // marginLeft: hp(1.5),
                      }}
                      source={images.evening_icon}
                    />
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2),

                        color:
                          this.state.EVENING === true
                            ? Colors.blueTextColor
                            : Colors.black,
                        marginLeft: hp(1),
                      }}>
                      Evening
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: Colors.label,
                      paddingTop: hp(0.5),
                      paddingBottom: hp(0.5),
                      fontSize: Platform.OS === 'android' ? hp(1.5) : hp(1.55),
                    }}>
                    {this.state.eveningArray.length} Medication(s)
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {
            // this.state.dayTime === DayTime.MORNING &&
            this.state.morning === true ? (
              this.state.morningArray.length ? (
                <View
                  style={{
                    flex: 1,
                    marginLeft: hp(1),
                    marginRight: hp(1),
                    // marginTop: hp(2),
                  }}>
                  <View>
                    <FlatList
                      data={this.state.morningArray}
                      //  ItemSeparatorComponent={this.FlatListItemSeparator}
                      renderItem={({item, index}) => {
                        console.log('====================================');
                        console.log('item in dashboard', item);
                        console.log('====================================');
                        return (
                          <Swipeable
                            onSwipeableWillOpen={() =>
                              this.setState({isOpen: true})
                            }
                            onSwipeableWillClose={() =>
                              this.setState({isOpen: false})
                            }
                            ref={this.swipeableRef}
                            renderRightActions={progress =>
                              this.renderRightActions(
                                progress,
                                item,
                                '08:05 AM',
                              )
                            }>
                            <MedicationItem
                              item={item}
                              index={index}
                              myProps={this.props}
                              navigation={this.props.myProps.navigation}
                              onClick={() => this.onOpen(item)}
                              onStatusChange={() =>
                                this.props.todayMedication()
                              }
                            />
                          </Swipeable>
                        );
                      }}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }
                      keyExtractor={item => item.id}
                      style={{marginBottom: hp(5), height: '100%'}}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.no_result_found}
                    style={{width: hp(18), height: hp(17)}}
                  />
                  <Text
                    style={{
                      marginTop: hp(4),
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2),
                    }}>
                    No Result Found
                  </Text>
                  <Text
                    style={{
                      marginTop: hp(1),
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      width: '90%',
                      textAlign: 'center',
                    }}>
                    Sorry, there are no results for this search.
                  </Text>
                </View>
              )
            ) : null
          }

          {
            // this.state.dayTime === DayTime.MORNING &&
            this.state.noon === true ? (
              this.state.noonArray.length ? (
                <View
                  style={{
                    flex: 1,
                    marginLeft: hp(1),
                    marginRight: hp(1),
                    // marginTop: hp(2),
                  }}>
                  <View>
                    <FlatList
                      data={this.state.noonArray}
                      //  ItemSeparatorComponent={this.FlatListItemSeparator}
                      renderItem={({item, index}) => (
                        <Swipeable
                          // ref={this.ref}
                          renderRightActions={progress =>
                            this.renderRightActions(progress, item, '12:05 PM')
                          }>
                          <MedicationItem
                            item={item}
                            index={index}
                            myProps={this.props}
                            navigation={this.props.myProps.navigation}
                            onClick={() => this.onOpen(item)}
                            onStatusChange={() => this.props.todayMedication()}
                          />
                        </Swipeable>
                      )}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }
                      keyExtractor={item => item.id}
                      style={{marginBottom: hp(5), height: '100%'}}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.no_result_found}
                    style={{width: hp(18), height: hp(17)}}
                  />
                  <Text
                    style={{
                      marginTop: hp(4),
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2),
                    }}>
                    No Result Found
                  </Text>
                  <Text
                    style={{
                      marginTop: hp(1),
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      width: '90%',
                      textAlign: 'center',
                    }}>
                    Sorry, there are no results for this search.
                  </Text>
                </View>
              )
            ) : null
          }

          {
            // this.state.dayTime === DayTime.MORNING &&
            this.state.EVENING === true ? (
              this.state.eveningArray.length ? (
                <View
                  style={{
                    flex: 1,
                    marginLeft: hp(1),
                    marginRight: hp(1),
                    // marginTop: hp(2),
                  }}>
                  <View>
                    <FlatList
                      data={this.state.eveningArray}
                      //  ItemSeparatorComponent={this.FlatListItemSeparator}
                      renderItem={({item, index}) => (
                        <Swipeable
                          // ref={this.ref}
                          renderRightActions={progress =>
                            this.renderRightActions(progress, item, '05:05 PM')
                          }>
                          <MedicationItem
                            item={item}
                            index={index}
                            myProps={this.props}
                            navigation={this.props.myProps.navigation}
                            onClick={() => this.onOpen(item)}
                            onStatusChange={() => this.props.todayMedication()}
                          />
                        </Swipeable>
                      )}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }
                      keyExtractor={item => item.id}
                      style={{marginBottom: hp(5), height: '100%'}}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.no_result_found}
                    style={{width: hp(18), height: hp(17)}}
                  />
                  <Text
                    style={{
                      marginTop: hp(4),
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2),
                    }}>
                    No Result Found
                  </Text>
                  <Text
                    style={{
                      marginTop: hp(1),
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      width: '90%',
                      textAlign: 'center',
                    }}>
                    Sorry, there are no results for this search.
                  </Text>
                </View>
              )
            ) : null
          }
          <Pressable
            onPress={() => {
              this.props.myProps.navigation.navigate('AddNewMedication');
            }}
            style={{
              position: 'absolute',
              bottom:
                this.state.morningArray.length &&
                this.state.noonArray.length &&
                this.state.eveningArray.length
                  ? '13%'
                  : '5%',
              right: '5%',
              zIndex: 111,
            }}>
            <AddMed height="75" width="75" style={{}} />
          </Pressable>
        </View>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({allTodayMedicationData, modalHandler}) => ({
  allTodayMedicationData,
  modalHandler,
});
export default connect(mapStateToProps)(MedicationDashboard);

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: Colors.black,
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.bleLayer4,
  },
});
