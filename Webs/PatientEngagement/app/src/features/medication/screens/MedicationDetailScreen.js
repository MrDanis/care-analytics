/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgNoImageFoundIcon} from '../constants';
import {Fonts} from '../../../../config/AppConfig';
import moment from 'moment';
import EditIcon from '../../../../../assets/svg/icon_edit.svg';
import MedicationService from '../../../api/medication';
import {cancelLocalNotificationWithTag} from '../../../helpers/NotificationHandler';
import DeleteIcon from '../../../../../assets/svg/icon_delete.svg';
import Images from '../../../../config/Images';
import {getAllMedication, getTodayMedication} from '../actions';
import {BlurView} from '@react-native-community/blur';
import {ActivityIndicator} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import images from '../../../../../app/config/Images';
import FastImage from 'react-native-fast-image';

class MedicationDetailScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const {data} = this.props.route.params;
    this.state = {
      item: data,
      image: {uri: data.fdaMedicine.imagePath},
      isEnabled: data.isActive,
      modalVisible: false,
      showLoader: false,
    };
  }
  onError(error) {
    console.log(error);
    this.setState({image: Images.noImageFound});
  }

  // componentDidMount(): void {
  //   console.log('Detailscreen param', this.props.navigation.state.params.data);
  // }

  setIsEnable(enable) {
    this.setState({isEnabled: enable});
    MedicationService.updateActiveStatus(this.state.item.id, enable)
      .then(res => {
        console.log('updateActiveStatus');
        console.log(res);
      })
      .catch(error => {
        console.log('updateActiveStatus');
        console.log(error);
      });
  }
  getAllMedicationData() {
    console.log('====================================');
    console.log('this.state.item', this.state.item);
    console.log('====================================');
    this.setState({showLoader: true});
    MedicationService.getAllMedication()
      .then(response => {
        this.setState({showLoader: false});
        console.log('getAllMedication');
        console.log(JSON.stringify(response));
        if (response && response.statusCode === 200) {
          this.props.dispatch(getAllMedication(response.data));
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({showLoader: false});
      });
  }
  getTodayMedicationData() {
    MedicationService.getTodayMedication()
      .then(response => {
        console.log('after delete getTodayMedication');
        console.log(JSON.stringify(response));
        if (
          response &&
          response.statusCode === 200 &&
          response.data.length > 0
        ) {
          this.props.dispatch(getTodayMedication(response.data));
        } else {
          this.props.dispatch(getTodayMedication([]));
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({showLoader: false});
      });
  }

  showFrequencyDays(Days) {
    console.log('====================================');
    console.log('item', this.state.item);
    console.log('====================================');
    const Frequency = Days;
    console.log('====================================');
    console.log('this.state.item', this.state.item);
    console.log('====================================');
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
  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
    // this.getRecipientText();
  }
  render() {
    return (
      <Fragment>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
          }}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Please Wait....'}
            textStyle={{color: '#000'}}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            // onRequestClose={() => {
            //   this.setModalVisible();
            // }}
            backdropOpacity={0.3}>
            {/*<View*/}
            {/*  style={{*/}
            {/*    flex: 1,*/}
            {/*    justifyContent: 'center',*/}
            {/*    alignItems: 'center',*/}
            {/*    borderRadius: 10,*/}
            {/*    borderWidth: 1,*/}
            {/*  }}>*/}
            <BlurView
              blurType="prominent"
              // blurAmount={8}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'space-around',
                  backgroundColor: Colors.transparent,
                  flex: 1,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: Colors.lightGrey1,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    // height: 150,
                    width: '80%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2.6),
                      color: Colors.black,
                      // backgroundColor: Colors.lightGrey1,
                      // textAlign: 'flex-start',
                      marginVertical: hp(1),
                      marginLeft: hp(1),
                      alignSelf: 'flex-start',
                      paddingHorizontal: hp(1),
                    }}>
                    Confirmation
                  </Text>

                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.black,
                      paddingHorizontal: hp(1),
                    }}>
                    Are you sure you want to delete this Medication
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      alignSelf: 'flex-end',
                    }}>
                    {!this.state.showLoader ? (
                      <TouchableOpacity
                        style={{
                          width: '25%',
                          height: hp(4),
                          marginTop: hp(1),
                          marginBottom: hp(1),
                          alignSelf: 'center',
                          borderRadius: 5,
                          borderColor: Colors.cyan,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          this.setState({showLoader: true});
                          MedicationService.deleteMedication(this.state.item.id)
                            .then(res => {
                              console.log('deleteMedication');
                              console.log(res);
                              this.props.navigation.goBack();
                              this.setState({showLoader: false});
                              if (res && res.Status === true) {
                                this.getTodayMedicationData();
                                this.getAllMedicationData();
                              }
                            })
                            .catch(err => {
                              this.setState({showLoader: false});
                              console.log('deleteMedicationerror');
                              console.log(err);
                            });
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansBold,
                            fontSize: hp(2.2),
                            color: Colors.black,
                          }}>
                          Yes
                        </Text>
                      </TouchableOpacity>
                    ) : Platform.OS === 'ios' ? (
                      <ActivityIndicator size={'small'} color={Colors.black} />
                    ) : (
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansBold,
                          fontSize: hp(2.2),
                          color: Colors.black,
                        }}>
                        Yes
                      </Text>
                    )}
                    <TouchableOpacity
                      style={{
                        width: '25%',
                        marginTop: hp(1),
                        marginBottom: hp(1),
                        height: hp(4),
                        alignSelf: 'center',
                        borderRadius: 5,
                        borderColor: Colors.cyan,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // backgroundColor: Colors.green_50,
                      }}
                      onPress={() => this.setModalVisible()}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansBold,
                          fontSize: hp(2.2),
                          color: Colors.black,
                        }}>
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </BlurView>
          </Modal>
          <ScrollView>
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.BgColor,
              }}>
              <View
                style={{
                  // paddingTop: hp(7),
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: hp(8),
                  borderBottomWidth: 0.5,
                  borderColor: Colors.BgColor,
                  backgroundColor: Colors.BgColor,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.pop();
                    //  navigation.pop();
                  }}>
                  <Text
                    style={{
                      fontFamily: 'WisemanPTSymbols',
                      marginLeft: heightPercentageToDP(1),
                      marginRight: heightPercentageToDP(1),
                      fontSize: hp(5),
                      color: Colors.black1,
                    }}>
                    W
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    marginLeft: hp(10),
                    fontSize: hp(2.5),
                    color: Colors.black1,
                    flex: 1,
                  }}>
                  Prescriptions
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('NotificationStack')
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginRight: hp(2),
                    }}>
                    <FastImage
                      style={{
                        width: hp(2),
                        height: hp(2.5),
                        // marginRight:-20,
                        // marginHorizontal: hp(3),
                        // marginTop:10,
                      }}
                      source={Images.notification_dashboard}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: Colors.BgColor,
                }}>
                <View style={{backgroundColor: Colors.BgColor}}>
                  <View
                    style={{
                      marginLeft: hp(2),
                      marginTop: hp(6),
                      backgroundColor: Colors.white,
                      width: '90%',
                      height: hp(46),
                      borderRadius: 10,
                      paddingTop: hp(2),
                      shadowOffset: {width: 0.05, height: 0.05},
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 3,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: hp(3),
                        marginLeft: hp(3),
                        marginRight: hp(3),
                        //  alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('EditMedication', {
                            medId: this.state.item.id,
                          });
                          global.selectedData = this.state.item;
                        }}>
                        <Image
                          source={images.editIcon}
                          style={{width: hp(3), height: hp(3)}}
                        />
                      </TouchableOpacity>

                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setModalVisible();
                          }}>
                          <Image
                            source={images.deleteIcon}
                            style={{width: hp(3), height: hp(3)}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingTop: hp(2),
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansBold,
                          fontSize: hp(2.2),
                          color: Colors.black,
                        }}>
                        {this.state.item.fdaMedicine.proprietaryname}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: hp(3),
                        marginBottom: hp(2),
                        marginLeft: hp(3),
                        marginRight: hp(3),
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          color: Colors.black1,
                          flex: 0.3,
                        }}>
                        Name
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.SourceSansRegular,
                            fontSize: hp(2),
                            color: Colors.black2,
                          }}>
                          {this.state.item.fdaMedicine.proprietaryname}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: hp(3),
                        marginBottom: hp(3),
                        marginRight: hp(3),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          flex: 1,
                          color: Colors.black1,
                        }}>
                        Frequency
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          marginLeft: heightPercentageToDP(5),
                          fontSize: hp(2),
                          color: Colors.black2,
                        }}>
                        {this.showFrequencyDays(
                          this.state.item.frequencyInDays,
                        )}
                      </Text>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: 'row',

                        marginBottom: hp(3),
                        marginLeft: hp(3),
                        marginRight: hp(3),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          flex: 1,
                          color: Colors.black1,
                        }}>
                        Timings
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}>
                        {this.state.item.doseTimings.map(time => {
                          return (
                            <Text
                              key={Math.random().toString(36).substr(2, 9)}
                              style={{
                                marginRight: hp(0.1),
                                fontFamily: Fonts.SourceSansRegular,
                                fontSize: hp(2),
                                color: Colors.black2,
                              }}>
                              {time + ' '}
                            </Text>
                          );
                        })}
                      </View>
                    </View> */}

                    <View
                      style={{
                        flexDirection: 'row',

                        marginBottom: hp(3),
                        marginLeft: hp(3),
                        marginRight: hp(3),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          flex: 1,
                          color: Colors.black1,
                        }}>
                        Advice
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          marginLeft: heightPercentageToDP(5),
                          fontSize: hp(2),
                          color: Colors.black2,
                        }}>
                        {this.state.item.mealStatus === false
                          ? 'Before Meal'
                          : 'After Meal'}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',

                        marginBottom: hp(3),
                        marginLeft: hp(3),
                        marginRight: hp(3),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          flex: 1,
                          color: Colors.black1,
                        }}>
                        End Date
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          marginLeft: heightPercentageToDP(5),
                          fontSize: hp(2),
                          color: Colors.black2,
                        }}>
                        {this.state.item.endDate !== null
                          ? moment(this.state.item.endDate).format('MMM Do YY')
                          : 'Never'}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',

                        marginBottom: hp(3),
                        marginLeft: hp(3),
                        marginRight: hp(3),
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(2),
                          flex: 1,
                          color: Colors.black1,
                        }}>
                        Notification
                      </Text>
                      <Switch
                        trackColor={{false: Colors.black3, true: Colors.black3}}
                        thumbColor={
                          this.state.isEnabled
                            ? Colors.blueTextColor
                            : '#f4f3f4'
                        }
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={value => {
                          console.log(value);
                          this.setIsEnable(value);
                        }}
                        value={this.state.isEnabled}
                      />
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Medicien Detail', this.state.item.fdaMedicine);
                    this.props.navigation.navigate('Pharmacies', {
                      image: this.state.item.fdaMedicine.imagePath,
                      name: this.state.item.fdaMedicine.proprietaryname,
                      ndc: this.state.item.fdaMedicine.ndc,
                      quantity: this.state.item.quantity,
                      dosage: this.state.item.fdaMedicine.dosageformname,
                    });
                  }}
                  style={{
                    width: '90%',
                    marginBottom: hp(2),
                    marginTop: hp(3),
                    height: hp(7),
                    alignSelf: 'center',
                    borderRadius: 5,
                    backgroundColor: Colors.blueTextColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2.2),
                      color: Colors.white,
                    }}>
                    Search Low Cost Medication
                  </Text>
                </TouchableOpacity>
                {/* <View
                    style={{
                      width: '86%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('EditMedication');
                        global.selectedData = this.state.item;
                      }}
                      style={{
                        width: '50%',
                        marginBottom: hp(2),
                        height: hp(7),
                        alignSelf: 'center',
                        borderRadius: 5,
                        marginRight: hp(2),
                        borderWidth: 1,
                        borderColor: Colors.blueTextColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansBold,
                          fontSize: hp(2.2),
                          color: Colors.blueTextColor,
                        }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisible();
                      }}
                      style={{
                        width: '50%',
                        marginBottom: hp(2),
                        height: hp(7),
                        alignSelf: 'center',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: Colors.blueTextColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansBold,
                          fontSize: hp(2.2),
                          color: Colors.blueTextColor,
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View> */}

                <View
                  style={{
                    // height: '100%',
                    marginLeft: hp(17),
                    width: hp(12),

                    flexDirection: 'row',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: hp(12),
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                    source={Images.medIcon4x}
                    // onError={this.onError.bind(this)}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}
export default MedicationDetailScreen;
