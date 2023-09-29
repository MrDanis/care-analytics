/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
  TextInput,
  Image,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors, Images} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import moment from 'moment';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {connect} from 'react-redux';
import AuthService from '../../../api/auth';
import {
  AuthCode,
  BlueButtonAccessToken,
  IsAcoUserLogin,
  removeItemValue,
  storeItem,
} from '../../../helpers/LocalStorage';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {convertUTCDateToLocalDate} from '../../../helpers/Common';
import {configurePushNotification} from '../../../helpers/NotificationHandler';
import {NavigationActions} from 'react-navigation';

var radio_props = [
  {label: 'Part A', value: 0},
  {label: 'Part B', value: 1},
];

class ACOUserLogin extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      referenceNumber: '',
      startDate: moment(new Date()).format('MM/DD/yyyy'),
      planType: -1,
      mrn: '',
      isDatePickerVisible: false,
      referenceError: '',
      dateError: '',
      iSOStartDate: '',
      enableSubmitButton: false,
      // screenName: this.props.route.params.screenName,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  hideDatePicker() {
    this.setState({isDatePickerVisible: false});
  }

  componentDidMount(): void {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    {
      this.props.userProfileData.referenceNumber
        ? this.setState({
            referenceNumber: this.props.userProfileData.referenceNumber,
          })
        : '';
    }
  }

  resetProfieStack() {
    this.props.navigation.reset(
      [NavigationActions.navigate({routeName: 'Profile'})],
      0,
    );
  }

  handleBackButtonClick() {
    // if (this.state.screenName === 'Home') {
    //   this.resetProfieStack();
    //   this.props.navigation.navigate(this.state.screenName);
    // } else {
    //   this.props.navigation.navigate(this.state.screenName);
    // }
    // return true;
  }

  setDate(date) {
    var newDate = new Date(date);
    console.log('hours');
    console.log(newDate.getHours());
    if (newDate.getHours() === 0) {
      newDate.setDate(date.getDate() + 1);
    }

    console.log('newDate');
    console.log(newDate);
    this.setState(
      {
        startDate: moment(date).format('l'),
        dateError: '',
        iSOStartDate: newDate,
      },
      () => {
        this.hideDatePicker();
        this.enableDisbaleSubmitButton();
      },
    );
  }

  componentWillUnmount() {
    this.removeEventListener();
  }
  removeEventListener() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  enableDisbaleSubmitButton() {
    if (this.state.referenceNumber === '') {
      this.setState({enableSubmitButton: false});
    } else {
      this.setState({enableSubmitButton: true});
    }
  }

  render() {
    let gender = '';
    if (
      this.props.userProfileData.gender !== null &&
      this.props.userProfileData.gender === '1'
    ) {
      gender = 'Male';
    } else if (
      this.props.userProfileData.gender !== null &&
      this.props.userProfileData.gender === '2'
    ) {
      gender = 'Female';
    } else {
      gender = '';
    }
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1}}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Please Wait....'}
            textStyle={{color: '#FFF'}}
          />
          <DateTimePicker
            isVisible={this.state.isDatePickerVisible}
            onCancel={() => this.hideDatePicker()}
            mode={'date'}
            maximumDate={new Date()}
            titleIOS={'Pick a Date'}
            value={new Date(this.state.startDate)}
            date={new Date(this.state.startDate)}
            titleStyle={{fontSize: hp(2)}}
            onConfirm={date => {
              console.log('====================================');
              console.log(
                'startDate',
                moment(date).format('YYYY-MM-DDTHH:mm:ss'),
              );
              console.log('====================================');
              this.setState({startDate: date, iSOStartDate: new Date(date)});
              this.hideDatePicker();
            }}
          />
          <ScrollView>
            <View style={{flex: 1}}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: hp(7.5),
                  borderBottomWidth: 0.5,
                  borderColor: Colors.lightGrey,
                }}>
                {/* <TouchableOpacity
                  onPress={() => {
                    this.handleBackButtonClick();
                  }}>
                  <Text
                    style={{
                      fontFamily: 'WisemanPTSymbols',
                      marginLeft: heightPercentageToDP(2),
                      marginRight: heightPercentageToDP(1),
                      fontSize: hp(5),
                      color: Colors.black1,
                    }}>
                    W
                  </Text>
                </TouchableOpacity> */}
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.5),
                    color: Colors.black1,
                    flex: 1,
                    textTransform: 'capitalize',
                  }}>
                  Authorization
                </Text>
              </View>
              <View style={{paddingHorizontal: hp(2)}}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(3),
                    marginBottom: hp(2),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.black1,
                    }}>
                    First Name
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      marginLeft: heightPercentageToDP(5),
                      fontSize: hp(2.2),
                      color: Colors.black2,
                      textTransform: 'capitalize',
                    }}>
                    {this.props.userProfileData.firstName !== null
                      ? this.props.userProfileData.firstName
                      : ''}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: Colors.line,
                    marginRight: hp(2),
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginBottom: hp(2),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.black1,
                    }}>
                    Last Name
                  </Text>
                  <Text
                    key={Math.random().toString(36).substr(2, 9)}
                    style={{
                      marginRight: hp(0.5),
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2.2),
                      color: Colors.black2,
                      textTransform: 'capitalize',
                    }}>
                    {this.props.userProfileData.lastName !== null
                      ? this.props.userProfileData.lastName
                      : ''}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: Colors.line,
                    marginRight: hp(2),
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginBottom: hp(2),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.black1,
                    }}>
                    D.O.B
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      marginLeft: heightPercentageToDP(5),
                      fontSize: hp(2.2),
                      color: Colors.black2,
                    }}>
                    {this.props.userProfileData.dateOfBirth === null ||
                    this.props.userProfileData.dateOfBirth === ''
                      ? ''
                      : moment(
                          new Date(this.props.userProfileData.dateOfBirth),
                        ).format('L')}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: Colors.line,
                    marginRight: hp(2),
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    marginBottom: hp(2),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.black1,
                    }}>
                    Gender
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      marginLeft: heightPercentageToDP(5),
                      fontSize: hp(2.2),
                      color: Colors.black2,
                    }}>
                    {gender}
                  </Text>
                </View>
              </View>
              <View style={{margin: hp(3), flex: 1}}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(3),
                    marginBottom: hp(2),
                    color: Colors.black1,
                  }}>
                  Access
                </Text>
                <View
                  style={[
                    {
                      width: '100%',
                      marginTop: hp(2),
                      alignSelf: 'center',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.noRecordFound,
                      marginTop: hp(2),
                    }}>
                    Start Date
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: Colors.lightGrey,
                    }}
                    onPress={() => {
                      this.setState({isDatePickerVisible: true});
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: hp(1),
                        flex: 1,
                        width: '100%',
                        borderRadius: 10,
                        backgroundColor: Colors.white,
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2.2),
                          color: Colors.black,
                          justifyContent: 'center',
                        }}>
                        {moment(this.state.startDate).format('MM/DD/yyyy')}
                      </Text>
                      <Image
                        source={Images.calenderIcon}
                        style={{
                          tintColor: Colors.forgetColor,
                          height: hp(3),
                          width: hp(3),
                          marginRight: hp(1),
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2),
                    color: Colors.noRecordFound,
                    marginTop: hp(2),
                  }}>
                  MRN
                </Text>
                <TextInput
                  onChangeText={MRN => this.setState({referenceNumber: MRN})}
                  value={this.state.referenceNumber}
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.line,
                    borderRadius: 8,
                    backgroundColor: Colors.white,
                    fontFamily: Fonts.SourceSansRegular,
                    paddingVertical: hp(1.3),
                    paddingHorizontal: hp(2),
                    fontSize: hp(2),
                    marginTop: hp(0.2),
                    height: 50,
                    color: Colors.blueGrayDisableText,
                  }}
                  selectTextOnFocus={false}
                  editable={
                    this.props.userProfileData.referenceNumber !== null &&
                    this.props.userProfileData.referenceNumber !== ''
                      ? false
                      : true
                  }
                  onSubmitEditing={this.enableDisbaleSubmitButton()}
                  selectionColor={Colors.blueTextColor}
                  placeholder=""
                  placeholderTextColor={Colors.blueGrayDisableText}
                />

                {/*<Text*/}
                {/*  style={{*/}
                {/*    fontFamily: Fonts.NunitoSemiBold,*/}
                {/*    fontSize: hp(3),*/}
                {/*    marginBottom: hp(2),*/}
                {/*    color: Colors.black1,*/}
                {/*  }}>*/}
                {/*  Part Selection*/}
                {/*</Text>*/}
                {/*<RadioForm formHorizontal={true} animation={true}>*/}
                {/*  {radio_props.map((obj, i) => {*/}
                {/*    var onPress = (value, index) => {*/}
                {/*        this.setState({*/}
                {/*        planType: value,*/}
                {/*        value3Index: index,*/}
                {/*      });*/}
                {/*        this.enableDisbaleSubmitButton();*/}
                {/*    };*/}
                {/*    return (*/}
                {/*      <RadioButton labelHorizontal={true} key={i}>*/}
                {/*        /!*  You can set RadioButtonLabel before RadioButtonInput *!/*/}
                {/*        <RadioButtonInput*/}
                {/*          obj={obj}*/}
                {/*          index={i}*/}
                {/*          isSelected={this.state.value3Index === i*/}
                {/*          }*/}
                {/*          onPress={onPress}*/}
                {/*          buttonInnerColor={Colors.blueHeadingColor}*/}
                {/*          buttonOuterColor={*/}
                {/*            this.state.value3Index === i*/}
                {/*              ? Colors.blueHeadingColor*/}
                {/*              : Colors.lightGrey*/}
                {/*          }*/}
                {/*          buttonSize={20}*/}
                {/*          buttonStyle={{}}*/}
                {/*          buttonWrapStyle={{marginLeft: 10}}*/}
                {/*        />*/}
                {/*        <RadioButtonLabel*/}
                {/*          obj={obj}*/}
                {/*          index={i}*/}
                {/*          onPress={onPress}*/}
                {/*          labelStyle={{*/}
                {/*            fontWeight: 'light',*/}
                {/*            color: Colors.heading,*/}
                {/*            marginRight: hp(5),*/}
                {/*            marginLeft: hp(1),*/}
                {/*            fontSize: hp(2),*/}
                {/*          }}*/}
                {/*          labelWrapStyle={{}}*/}
                {/*        />*/}
                {/*      </RadioButton>*/}
                {/*    );*/}
                {/*  })}*/}
                {/*</RadioForm>*/}
                <TouchableOpacity
                  disabled={!this.state.enableSubmitButton}
                  onPress={() => {
                    let data = {};
                    data.referenceNumber = this.state.referenceNumber;
                    data.startDate = moment(
                      new Date(this.state.startDate),
                    ).format('YYYY-MM-DDThh:mm:ss.SSS');

                    this.setState({showLoader: true});

                    AuthService.loginACOUser(data)
                      .then(response => {
                        console.log('response');
                        console.log(response);
                        this.setState({showLoader: false});
                        if (response && response.statusCode === 200) {
                          this.removeEventListener();
                          removeItemValue(BlueButtonAccessToken);
                          storeItem(IsAcoUserLogin, 'true').then(login => {
                            console.log(login);
                          });
                          this.props.navigation.navigate('Medical History', {
                            screen: 'MainDashboard',
                          });
                        } else {
                          showMessage({
                            message: 'Information',
                            description:
                              'Authentication Failed. Provided information is not verified.',
                            type: 'default',
                            icon: {icon: 'info', position: 'left'},
                            backgroundColor: Colors.red,
                          });
                        }
                      })
                      .catch(err => {
                        this.setState({showLoader: false});
                        console.log('error');
                        console.log(err);
                        showMessage({
                          message: 'Information',
                          description: 'Server Error',
                          type: 'default',
                          icon: {icon: 'info', position: 'left'},
                          backgroundColor: Colors.red,
                        });
                      });
                  }}
                  style={{
                    width: '100%',
                    marginTop: hp(4),
                    height: hp(7),
                    alignSelf: 'center',
                    borderRadius: 5,
                    marginHorizontal: '5%',
                    borderColor: Colors.cyan,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      this.state.enableSubmitButton === true
                        ? Colors.blueTextColor
                        : Colors.blueGrayDisableBG,
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2),
                      color:
                        this.state.enableSubmitButton === true
                          ? Colors.white
                          : Colors.blueGrayDisableText,
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
                {/*<Text*/}
                {/*  style={{*/}
                {/*    fontFamily: Fonts.NunitoSemiBold,*/}
                {/*    fontSize: hp(2),*/}
                {/*    marginBottom: hp(1),*/}
                {/*    marginTop: hp(2),*/}
                {/*    color: Colors.black1,*/}
                {/*    alignSelf: 'center',*/}
                {/*  }}>*/}
                {/*  OR*/}
                {/*</Text>*/}
                {/*<TouchableOpacity*/}
                {/*  style={{*/}
                {/*    borderRadius: 5,*/}
                {/*    borderWidth: 1,*/}
                {/*    borderColor: Colors.blueTextColor,*/}
                {/*  }}*/}
                {/*  onPress={() => {*/}
                {/*    this.props.navigation.navigate('MainDashboard');*/}
                {/*  }}>*/}
                {/*  <Text*/}
                {/*    style={{*/}
                {/*      fontFamily: Fonts.NunitoBold,*/}
                {/*      fontSize: hp(2),*/}
                {/*      padding: hp(1.8),*/}
                {/*      color: Colors.blueTextColor,*/}
                {/*      alignSelf: 'center',*/}
                {/*    }}>*/}
                {/*    Login with BlueButton*/}
                {/*  </Text>*/}
                {/*</TouchableOpacity>*/}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const mapStateToProps = ({userProfileData}) => ({
  userProfileData,
});
export default connect(mapStateToProps)(ACOUserLogin);
