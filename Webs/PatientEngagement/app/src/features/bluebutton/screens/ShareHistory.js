/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Alert,
  Image,
  Platform,
  PanResponder,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts} from '../../../../config/AppConfig';
import Spinner from 'react-native-loading-spinner-overlay';
import HistoryIcon from '../../../../../assets/svg/icon_share_history.svg';
import BlueButtonService from '../../../api/bluebutton';
import IconInfoGrey from '../../../../../assets/svg/icon_info_grey.svg';
import {Modalize} from 'react-native-modalize';
import Moment from 'moment';
import {BlurView} from '@react-native-community/blur';
import IconInfo from '../../../../../assets/svg/icon_info_green.svg';
import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  IsAcoUserLogin,
  storeItem,
} from '../../../helpers/LocalStorage';
import {isACOUserLogin, isBlueButtonToken} from '../../../helpers/Common';
import {connect} from 'react-redux';
import Images from '../../../../config/Images';
import {showMessage} from 'react-native-flash-message';
import ShareGrey from '../../../../../assets/svg/ShareGrey.svg';
import Dot from '../../../../../assets/svg/Dot.svg';

const data = [
  {key: 'A', name: 'Coverage'},
  {key: 'B', name: 'Medication'},
  {key: 'C', name: 'Appointments'},
  {key: 'D', name: 'My Providers'},
  {key: 'E', name: 'Diseases'},
  {key: 'F', name: 'Allergies'},
  {key: 'G', name: 'Procedures'},
  {key: 'H', name: 'Hospital Visits'},
];
class ShareHistory extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      emailHistoryList: [],
      pageNumber: 0,
      moduleID: this.props.moduleID,
      // moduleID: this.props.navigation.getParam('moduleID', 'default value'),
      selectedItemID: 0,
      historyList: [],
      sessionModal: false,
      timeNoAction: this.props.appLogoutTime,
    };
  }

  setSessionModalVisible() {
    this.setState({sessionModal: !this.state.sessionModal});
  }

  componentWillMount(): void {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('event');
        this.setState({scroll: true});
        this.resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gesture) => {
        // if (gesture?.moveX > gesture?.moveY) {
        //   this.resetTimer();
        //   return false;
        // }
        // this.resetTimer();
        return gesture.dx != 0 && gesture.dy != 0;
      },
      onStartShouldSetPanResponderCapture: () => {
        console.log('aaaaaaaaaaß');
        this.resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => {
        console.log('in onPanResponderTerminationRequest');
        return true;
      },
      onShouldBlockNativeResponder: () => false,
      // onPanResponderGrant: () => {
      //     console.log('in onPanResponderGrant')
      //     this.setState({scroll: false})
      // },
      // onPanResponderMove: () => {
      //     console.log('in onPanResponderMove',)
      //     this.setState({scroll: true})
      // },
      // onPanResponderRelease: () => {
      //     console.log('in onPanResponderRelease')
      //     this.setState({scroll: true})
      // },
      // onPanResponderEnd: (e, gestureState) => {
      //     console.log('onPanResponderEnd')
      //     this.setState({scroll: true})
      // }
    });
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }

  componentDidMount(): void {
    this.getModuleHistory('get',1);
  }

  state = {
    show: true,
  };
  _panResponder = {};
  timer = 0;

  resetTimer() {
    console.log('reset');
    clearTimeout(this.timer);
    if (this.state.show) {
      this.setState({show: false}, async () => {
        this.setSessionModalVisible();
      });
    }
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }

  getModuleHistory(type,subtype) {
    console.log('Subtype is  : ',subtype)
    if (type === 'revoke') {
      this.setState({pageNumber: 0, emailHistoryList: [], historyList: []});
    }
    this.setState({showLoader: true});
    BlueButtonService.getModuleShareHistory(
      this.props.moduleID,
      this.state.pageNumber,
    )
      .then(response => {
        this.setState({showLoader: false});
        console.log('getShareHistory');
        console.log(JSON.stringify(response.data.length));
        console.log(response.data);
        if (response.data.length > 0) {
          if (response.statusCode) {
            // var dummyArr = this.state.emailHistoryList.concat(response.data);
            const groupedData = this.state.emailHistoryList
              .concat(response.data)
              .reduce((acc, cur) => {
                const createdDate = cur.createdDate.split('T')[0];
                const existingGroup = acc.find(
                  group => group.createdDate === createdDate,
                );
                if (existingGroup) {
                  existingGroup.objects.push(cur);
                } else {
                  acc.push({createdDate, objects: [cur]});
                }
                return acc;
              }, []);
            // console.log('====================================');
            // console.log('grouped', groupedData);
            // console.log('====================================');
            if(subtype === 1)
            {
              for(let i=0;i<groupedData.length;i++)
              {
                // console.log('Refreshing data at 0 index : ',groupedData[i].objects)
                groupedData[i].objects=groupedData[i].objects.slice(1);
              }
            }
            this.setState({
              emailHistoryList: groupedData,
              pageNumber: this.state.pageNumber + 1,
              historyList: response.data,
            });
          } else {
            this.setState({emailHistoryList: []});
          }
        } else {
          this.setState({historyList: []});
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getShareHistory Error');
        console.log(error);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  onOpen(id) {
    this.refs.modalize.open();
    this.setState({selectedItemID: id});
  }

  onClose() {
    this.refs.modalize.close();
  }
  // dateUpdater(date) {
  //   console.log('date recieved', date);
  //   let formatDate = date.split('T')[0];
  //   if (temp === '') {
  //     temp = formatDate;
  //     // this.setState({cDate: formatDate});
  //     // this.setState({dateFlag:true});
  //     return temp;
  //   } else if (formatDate === temp) {
  //     return '';
  //   } else {
  //     this.setState({temp: formatDate});
  //     // this.setState({dateFlag:true});
  //     return temp;
  //   }
  // }
  // convertUTCDateToLocalDate(date) {
  //   date = new Date(date);
  //   var newDate = new Date(
  //     date.getTime() + date.getTimezoneOffset() * 60 * 1000,
  //   );
  //   var offset = date.getTimezoneOffset() / 60;
  //   var hours = date.getHours();
  //
  //   newDate.setHours(hours - offset);
  //   return Moment(newDate).local().format('MM/DD/yyyy hh:mm A');
  // }
  getFormattedDateTime(date) {
    let formattedTime = Moment(new Date(date))
      .local()
      .utc()
      .format('MM/DD/yyyy hh:mm A');
    return formattedTime;
  }
  isTodayYesterday = date => {
    console.log('this is the date thats being recieved in is today', date);
    let today = Moment().format('YYYY-MM-DD');
    console.log('this is todays result', today);
    let yesterday = Moment().subtract(1, 'day').format('YYYY-MM-DD');
    console.log('this is yesterday result', yesterday);

    const formattedDate = Moment(date).format('YYYY-MM-DD');
    console.log('this is formated result', formattedDate);

    if (Moment(formattedDate).isSame(today, 'day')) {
      return 'Today';
    } else if (Moment(formattedDate).isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return Moment(new Date(formattedDate)).format('M/D/YYYY').toUpperCase();
    }
  };
  convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    );
    const dateTimeAndroid = Moment(new Date(date)).format('MM/DD/yyyy hh:mm A');

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);

    const dateTimeIos = Moment(new Date(newDate)).format('MM/DD/yyyy hh:mm A');

    return Platform.OS === 'ios' ? dateTimeIos : dateTimeAndroid;
  }
  revokeEmail() {
    this.setState({showLoader: true});
    console.log('Selected Item ID', this.state.selectedItemID);
    BlueButtonService.revokeSentEmail(this.state.selectedItemID)
      .then(response => {
        this.setState({showLoader: false});
        console.log('getShareHistory');
        console.log(JSON.stringify(response));
        if (response.statusCode === 200) {
          this.setState({selectedItemID: 0});
          this.getModuleHistory('revoke');
        } else {
          alert(response.Exception[0].Message);
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getShareHistory Error');
        console.log(error);
      });
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: Colors.lightGrey,
          marginLeft: hp(2),
          marginRight: hp(2),
          marginTop: hp(1),
          marginBottom: hp(1),
        }}
      />
    );
  };
  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1}}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Please Wait....'}
            textStyle={{color: '#FFF'}}
          />
          <Modalize
            ref="modalize"
            adjustToContentHeight={true}
            modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
            <View style={{padding: hp(3)}}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.2),
                  flex: 1,

                  color: Colors.black1,
                }}>
                Confirmation
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: hp(1),
                }}>
                <Image
                  style={{
                    width: 68,
                    height: 60,
                    alignSelf: 'center',
                    marginLeft: hp(1),
                  }}
                  source={require('../../../../../assets/images/icon_unlink.png')}
                />
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2.2),
                    flex: 1,
                    color: Colors.red,
                    marginTop: hp(2),
                    marginLeft: hp(2),
                  }}>
                  Are you sure you want to remove access?
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: hp(4),
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.onClose();
                  }}
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginBottom: hp(2),
                    marginRight: hp(3),
                    width: 150,
                    borderWidth: 1,
                    borderColor: Colors.blueTextColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.blueTextColor,
                      textAlign: 'center',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/*<View*/}
                {/*  style={{*/}
                {/*    height: 1,*/}
                {/*    backgroundColor: Colors.line,*/}
                {/*    width: '90%',*/}
                {/*    alignSelf: 'center',*/}
                {/*  }}*/}
                {/*/>*/}
                <TouchableOpacity
                  onPress={() => {
                    this.onClose();
                    this.revokeEmail(this.state.selectedItemID);
                  }}
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginBottom: hp(2),
                    marginLeft: hp(3),
                    width: 150,
                    height: 50,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.white,
                      textAlign: 'center',
                    }}>
                    Remove access
                  </Text>
                </TouchableOpacity>
                {/*<View*/}
                {/*  style={{*/}
                {/*    height: 1,*/}
                {/*    backgroundColor: Colors.line,*/}
                {/*    width: '90%',*/}
                {/*    alignSelf: 'center',*/}
                {/*  }}*/}
                {/*/>*/}
              </View>
            </View>
          </Modalize>
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.sessionModal}>
            <BlurView
              blurType="light"
              blurAmount={10}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.transparent,
                  flex: 1,
                  width: '100%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    height: 200,
                    width: '80%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 10,
                  }}>
                  <IconInfo width={hp(35)} height={hp(10)} />
                  <Text
                    style={{
                      fontSize: hp(2.2),
                      fontFamily: Fonts.SourceSansBold,
                      textAlign: 'center',
                      marginBottom: hp(1),
                    }}>
                    {' '}
                    {'Session has expired.\n' + 'Please login again.'}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: '65%',
                      marginBottom: hp(1.5),
                      height: hp(7),
                      alignSelf: 'center',
                      borderRadius: 5,
                      borderColor: Colors.cyan,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.green_50,
                    }}
                    onPress={() => {
                      this.setState({
                        modalVisible: false,
                        sessionModal: false,
                        show: false,
                      });
                      storeItem(BlueButtonAccessToken, '');
                      storeItem(BlueButtonRefreshToken, '');
                      storeItem(IsAcoUserLogin, 'false');
                      clearTimeout(this.timer);
                      // this.props.navigation.navigate('MainDashboard', {
                      //   screenName: 'Profile',
                      // });
                      this.props.navigation.navigate('AuthenticationType');
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.6),
                        color: Colors.green,
                      }}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>
          <View
            style={{
              flex: 1,

              backgroundColor: Colors.white,

              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 8,
              // paddingTop: hp(2),
            }}>
            {/* here starts the list */}
            {this.state.emailHistoryList.length ? (
              <FlatList
                contentContainerStyle={{marginHorizontal: hp(1)}}
                data={this.state.emailHistoryList}
                onEndReached={({distanceFromEnd}) => {
                  console.log('Distance', distanceFromEnd);
                  if (
                    !this.state.showLoader &&
                    this.state.pageNumber !== 0 &&
                    parseInt(distanceFromEnd) >= 0
                  ) {
                    this.state.historyList.length > 0 &&
                      this.getModuleHistory('get');
                  }
                }}
                onEndReachedThreshold={0.05}
                renderItem={({item}) => {
                  return (
                    <View style={{paddingTop: hp(1)}}>
                      {/* {console.log('item being recivede', item)} */}
                      <Text
                        style={{
                          marginHorizontal: hp(2),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansSemibold,
                          color: Colors.black4,
                        }}>
                        {this.isTodayYesterday(
                          Moment(item.createdDate).format('L'),
                        )}
                      </Text>
                      {item.objects && item.objects.length
                        ? item.objects.map((data, index) => {
                            // console.log('item.Valueeee', data);
                            return (
                              <View style={{}}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    // marginVertical: hp(1),
                                    alignItems: 'center',
                                    // borderWidth: 1,
                                    marginTop: hp(1.5),
                                  }}>
                                  <View
                                    style={{
                                      borderRadius: hp(1),
                                      backgroundColor: Colors.bleLayer4,
                                      marginHorizontal: hp(2),
                                      paddingVertical: hp(1.5),
                                      width:
                                        Platform.OS === 'ios' ? hp(6.5) : hp(7),
                                      height:
                                        Platform.OS === 'android'
                                          ? hp(7)
                                          : hp(6.5),
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <ShareGrey
                                      height="25"
                                      width="25"
                                      style={{marginHorizontal: hp(2)}}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      width: '75%',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-around',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: hp(2.2),
                                        fontFamily: Fonts.SourceSansRegular,
                                        color: Colors.black4,
                                        marginTop: hp(0.3),
                                        textDecorationLine: data.isDeleted === true?'line-through':'none',
                                      }}>
                                      {data.emailAddress}
                                    </Text>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: hp(2),
                                          fontFamily: Fonts.SourceSansRegular,
                                          color: Colors.noRecordFound,
                                          // marginTop:
                                          //   Platform.OS === 'ios' ? hp(0.5) : hp(0),
                                        }}>
                                        {Moment(data.createdDate).format('LT')}
                                      </Text>
                                      <View
                                        style={{
                                          // marginTop: hp(0.5),
                                          marginLeft: hp(1),
                                        }}>
                                        <Dot />
                                      </View>
                                      <TouchableOpacity
                                        {...this._panResponder.panHandlers}
                                        activeOpacity={
                                          data.isDeleted === true ? 1 : 0
                                        }
                                        onPress={() =>
                                          data.isDeleted === false &&
                                          this.onOpen(data.id)
                                        }>
                                        <Text
                                          style={{
                                            fontFamily: Fonts.SourceSansRegular,
                                            color:
                                              data.isDeleted === true
                                                ? Colors.black3
                                                : Colors.blueTextColor,
                                            // marginLeft: hp(2),
                                            fontSize: hp(2),
                                            padding: hp(1),
                                          }}>
                                          {data.isDeleted === false
                                            ? 'Recall'
                                            : 'Link expired'}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                  }}>
                                  <View
                                    style={{
                                      borderWidth: 0.5,
                                      borderColor: Colors.line,
                                      width:
                                        Platform.OS === 'ios' ? '76%' : '77%',
                                    }}
                                  />
                                </View>
                              </View>
                            );
                          })
                        : null}
                    </View>
                    // <View>
                    //   <Text
                    //     style={{
                    //       marginLeft: hp(2),
                    //       fontSize: hp(2),
                    //       fontFamily: Fonts.SourceSansSemibold,
                    //       color: Colors.black4,
                    //     }}>
                    //     asad
                    //   </Text>
                    //   <View
                    //     style={{
                    //       borderRadius: 4,
                    //       flex: 1,
                    //       padding: hp(2),
                    //       borderWidth: 1,
                    //     }}>
                    //     <View
                    //       style={{
                    //         flexDirection: 'row',
                    //         justifyContent: 'space-between',
                    //         borderWidth: 1,
                    //       }}>
                    //       <View style={{flexDirection: 'column', width: '70%'}}>
                    //         {item.isDeleted === false ? (
                    //           <Text
                    //             style={{
                    //               fontFamily: Fonts.SourceSansSemibold,
                    //               color: Colors.black1,
                    //               fontSize: hp(2),
                    //             }}>
                    //             {item.emailAddress}
                    //           </Text>
                    //         ) : (
                    //           <Text
                    //             style={{
                    //               fontFamily: Fonts.SourceSansSemibold,
                    //               color: Colors.black3,
                    //               fontSize: hp(2),
                    //               textDecorationLine: 'line-through',
                    //               textDecorationStyle: 'solid',
                    //             }}>
                    //             {item.emailAddress}
                    //           </Text>
                    //         )}
                    //         <Text
                    //           style={{
                    //             fontFamily: Fonts.SourceSansBold,
                    //             fontSize: hp(1.5),
                    //             flex: 1,
                    //             color: Colors.black3,
                    //           }}>
                    //           {'Sent at: ' +
                    //             this.convertUTCDateToLocalDate(
                    //               new Date(item.createdDate),
                    //             )}
                    //         </Text>
                    //       </View>
                    //       <TouchableOpacity
                    //         {...this._panResponder.panHandlers}
                    //         activeOpacity={item.isDeleted === true ? 1 : 0}
                    //         onPress={() =>
                    //           item.isDeleted === false && this.onOpen(item.id)
                    //         }>
                    //         <Text
                    //           style={{
                    //             fontFamily: Fonts.SourceSansSemibold,
                    //             color:
                    //               item.isDeleted === true
                    //                 ? Colors.black3
                    //                 : Colors.blueTextColor,
                    //             // marginLeft: hp(2),
                    //             fontSize: hp(2),
                    //             padding: hp(1),
                    //           }}>
                    //           {item.isDeleted === false
                    //             ? 'Recall'
                    //             : 'Link expired'}
                    //         </Text>
                    //       </TouchableOpacity>
                    //     </View>
                    //   </View>
                    // </View>
                  );
                }}
              />
            ) : (
              this.state.showLoader === false &&
              this.state.emailHistoryList.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: hp(10),
                  }}
                  {...this._panResponder.panHandlers}>
                  <Image
                    source={Images.emptyIcon}
                    style={{
                      alignSelf: 'center',
                      height: hp(16),
                      width: hp(18),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: hp(2.5),
                      fontFamily: Fonts.SourceSansBold,
                      color: Colors.black4,
                      marginTop: hp(4),
                      marginRight: hp(10),
                      marginLeft: hp(10),
                      textAlign: 'center',
                    }}>
                    No records found
                  </Text>
                </View>
              )
            )}
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({appLogoutTime}) => ({appLogoutTime});

export default connect(mapStateToProps)(ShareHistory);
