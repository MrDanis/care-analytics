/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Animated,
  InteractionManager,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
  Modal,
  Linking,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {SvgCssUri} from 'react-native-svg';
import Accordion from 'react-native-collapsible/Accordion';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import {Colors} from '../../../../../config';
import Collapsible from 'react-native-collapsible';
// import Reinput from 'reinput';
import {openSettings} from 'react-native-permissions';
import BlueButtonService from '../../../../api/bluebutton';
import Spinner from 'react-native-loading-spinner-overlay';
import {Modalize} from 'react-native-modalize';
import CrossIcon from '../../../../../../assets/svg/cross.svg';
import DropDownPicker from 'react-native-dropdown-picker';
import {connect} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import {getEmailSharingResource} from '../../action';
import {showMessage} from 'react-native-flash-message';
import SharePopupIcon from '../../../../../../assets/svg/SharePopupIcon.svg';
import ShareSuccess from '../../../../../../assets/svg/ShareSuccess.svg';

import Union from '../../../../../../assets/images/Union.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
class EmailPopover extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailValidation: false,
      emailError: '',
      moduleId: this.props.moduleID,
      showLoader: false,
      nameOfRecipient: '',
      modalVisible: false,
      items: [],
      open: false,
      markCheck: false,
      sourceValue: '1',
      sourceText: 'Physician',
      confirmation: false,
      labelKey: '0',
      close: this.props.dismissModal,
      focusKeyboard: this.props.keyboardFocus,
      getSource: true,
      getMail: false,
      getConfirmation: false,
      labitem: this.props.labItem,
      mailForPop: '',
    };
    this.setValue = this.setValue.bind(this);
    this.setOpen = this.setOpen.bind(this);
  }

  componentDidMount(): void {
    // console.log('====================================');
    // console.log(
    //   'the log wevw been waiting dor ',
    //   this.props.emailSharingResourceData,
    // );
    // console.log('====================================');

    console.log('this is the check', this.state.moduleId,'Props from the parent component is : ',this.props);

    // console.log('====================================');
    // console.log(
    //   'this.props.emailSharingResourceData',
    //   this.props.emailSharingResourceData,
    // );
    // console.log('====================================');
    // console.log('MOdule ID From Props', this.state.moduleId);
    InteractionManager.runAfterInteractions(() => {
      if (this.inputRef) {
        this.inputRef.current.focus();
      }
    });
  }
  setValue(callback) {
    this.setState(
      state => ({
        value: callback(state.value),
        sourceValue: callback(state.value),
      }),
      () => {
        this.getRecipientText();
      },
    );
  }
  getRecipientText() {
    this.state.items.map((itemAtIndex, index) => {
      if (this.state.sourceValue === itemAtIndex.value) {
        this.setState({sourceText: itemAtIndex.label});
        return itemAtIndex.label;
      }
    });
  }
  setOpen() {
    this.setState({open: !this.state.open});
  }
  sendPDF() {
    this.setState({showLoader: true});
    // console.log(
    //   'sendPDFOverEmail Data',
    //   'ModuleID',
    //   this.state.moduleId,
    //   'EmailID',
    //   this.state.mailForPop,
    //   'SourceValue',
    //   this.state.labelKey,
    //   'user id',
    //   this.state.labitem.id,
    // );
    if (this.state.moduleId === 9 || this.state.moduleId === 10) {
      BlueButtonService.sendPDFOverEmailById(
        this.state.moduleId,
        this.state.mailForPop,
        this.state.labitem.id,
        this.state.labelKey,
      )
        .then(response => {
          console.log('share lab Response');
          console.log(response);
          this.props.dismissModal();
          if (response.data === true) {
            this.setModalVisible();
            this.setState({showLoader: false});
            showMessage({
              message: 'Result Shared',
              description: 'Result Shared successfully',
              type: 'success',
            });
          } else {
            alert('Email Sending Failed');
          }
        })
        .catch(error => {
          this.setState({showLoader: false});
          this.setModalVisible();
          console.log('share PDF Error');
          console.log(error);
          showMessage({
            message: 'Info',
            description: 'Internal Server Error',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        });
    } else {

      // console.log('data before sedn the PDF Email is : ',{ModuleId:this.state.moduleId,Mail:this.state.mailForPop,LabelKey:this.state.labelKey})
      BlueButtonService.sendPDFOverEmail(
        this.state.moduleId,
        this.state.mailForPop,
        this.state.labelKey,
      )
        .then(response => {
          console.log('share PDF Response');
          console.log(response);
          // this.props.dismissModal();
          if (response.data === true) {
            this.setModalVisible();
            this.setState({showLoader: false});
            // below line came from line 185
            this.props.dismissModal();
            // below two lines came form yess button press from the bottom
            this.setModalVisible();
            this.state.close();
            if(this.state.moduleId !==8)
            {
              this.props.updateData();
            }
            // this.props.navigation.navigate("MainDashboard");
            console.log('These are the props : ',this.props)
          } else {
            showMessage({
              message:'Email Sending Failed',
              type:'danger'
            });
          }
        })
        .catch(error => {
          this.setState({showLoader: false});
          this.setModalVisible();
          console.log('share PDF Error');
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
  }
  setMarked() {
    this.setState({markCheck: !this.state.markCheck});
  }
  onSubmitEmail(email) {
    if (this.state.email === '' || this.state.email === null) {
      this.setState({
        emailError: 'This field is required',
      });
    } else {
      if (this.validateEmail(email)) {
        this.setState({
          emailError: '',
        });
      } else {
        this.setState({
          emailError: 'Enter valid email address',
        });
        // this.validatePhone(email);
      }
    }
  }
  /* istanbul ignore next */
  validateEmail = text => {
    var reg = new RegExp(
      '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
    );
    if (reg.test(text) === false) {
      this.setState({emailValidation: false});
      return false;
    } else {
      console.log('email true');
      this.setState({emailValidation: true});
      return true;
    }
  };
  setModalVisible() {
    this.setState({confirmation: !this.state.confirmation});
    // this.getRecipientText();
  }
  gotTheLabel(passedObj) {
    this.setState({labelKey: passedObj.id});
  }
  render() {
    // const {showLoader} = this.state.showLoader;
    const {open, value = 1, items} = this.state;
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.showLoader}
          textContent={'Please Wait....'}
          textStyle={{color: '#000'}}
        />
        {/* confirmation modal */}
        {/* //sharing info form ahead */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {/* <TouchableOpacity
              onPress={() => {
                console.log('X is pressed');
                this.state.close();
              }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                width: '100%',
                justifyContent: 'flex-end',
              }}>
              <FastImage
                style={{
                  width: 20,
                  height: 25,
                  // marginRight:-20,
                  // marginHorizontal: hp(3),
                  // marginTop:10,
                }}
                source={Images.union}
              />
            </TouchableOpacity> */}
          <View style={{marginTop: hp(3)}}>
            {this.state.getConfirmation === true ? (
              <ShareSuccess />
            ) : (
              <SharePopupIcon />
            )}
          </View>
          {this.state.getConfirmation === true ? (
            <Text
              style={{
                fontSize: hp(2.3),
                fontFamily: Fonts.SourceSansBold,
                color: Colors.black4,
                textAlign: 'center',
                marginTop: hp(1.8),
              }}>
              Confirmation
            </Text>
          ) : (
            <Text
              style={{
                fontSize: hp(2.3),
                fontFamily: Fonts.SourceSansBold,
                color: Colors.black4,
                textAlign: 'center',
                marginTop: hp(1.8),
              }}>
              Share {this.props.name} document
            </Text>
          )}

          {/* get source ahead */}
          {this.state.getSource && (
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <ScrollView horizontal={true} style={{marginLeft: hp(1)}}>
                {console.log(
                  'this is the check',
                  this.props.emailSharingResourceData,
                )}
                {this.props.emailSharingResourceData?.map(item => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.gotTheLabel(item);

                        this.setState({getMail: true});
                        this.setState({getSource: false});
                      }}
                      style={{
                        // display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: hp(4),
                        marginBottom: hp(3),
                        marginHorizontal: hp(2),
                      }}>
                      <SvgCssUri
                        width={40}
                        height={45}
                        uri={item.url}
                        fill={Colors.yellowHeadingColor}
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(1.8),
                          color: Colors.black4,
                          marginTop: hp(1),
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
          {/* get email in share popup ahead */}
          {this.state.getMail && (
            <Fragment>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  alignContent: 'center',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: Colors.line,
                  borderRadius: 8,
                  backgroundColor: Colors.white,
                  marginTop: hp(2.5),
                }}>
                <FastImage
                  style={{
                    width: Platform.OS === 'ios' ? 20 : 23,
                    height: Platform.OS === 'ios' ? 20 : 23,
                    paddingLeft: hp(2),
                    marginLeft: hp(1),
                    marginRight: hp(1),
                  }}
                  source={Images.emailIconProfileSignUp}
                />
                <View style={{paddingRight: hp(0.8)}}></View>
                <TextInput
                  autoFocus={true}
                  returnKeyType="done"
                  onFocus={this.state.focusKeyboard}
                  onBlur={this.state.focusKeyboard}
                  onChangeText={text => {
                    this.setState({mailForPop: text});
                    console.log('this is the mailstate', this.state.mailForPop);
                  }}
                  value={this.state.mailForPop}
                  editable={true}
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    flex: 1,
                    paddingVertical: hp(1.35),
                    fontSize: hp(2),
                    marginTop: hp(0.2),
                    color: Colors.black4,
                  }}
                  keyboardType="email-address"
                  selectionColor={Colors.blueTextColor}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.black4}
                />
              </View>
              {/* agreement checkbox ahead */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  marginVertical: hp(2),
                }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: hp(1),
                    marginVertical: hp(1),
                    flexDirection: 'row',
                  }}
                  onPress={() => this.setMarked()}>
                  <Image
                    style={{
                      width: 28,
                      height: 28,
                      tintColor:
                        this.state.markCheck === true
                          ? Colors.blueRxColor
                          : Colors.noRecordFound,
                    }}
                    source={
                      this.state.markCheck === true
                        ? require('../../../../../../assets/images/check.png')
                        : require('../../../../../../assets/images/uncheck.png')
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://pre-release.wmi360.com/wl/Legal/TermsAndConditions',
                    )
                  }>
                  <Text
                    style={{
                      marginLeft: hp(0.5),
                      fontFamily: Fonts.SourceSansSemibold,
                      fontSize: hp(2),
                      color: Colors.black,
                      width: '73%',
                    }}>
                    I have read and agreed to the{' '}
                    <Text
                      style={{
                        // textDecorationLine: 'underline',
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2),
                        color: Colors.blueTextColor,
                        marginLeft: hp(1),
                      }}>
                      Terms & Conditions.
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
              {/* submit button ahead */}
              <TouchableOpacity
                disabled={
                  this.validateEmail(this.state.mailForPop) == true &&
                  this.state.markCheck === true
                    ? false
                    : true
                }
                onPress={() => {
                  console.log('Submit Tapped');
                  this.setState({getMail: false});
                  this.setState({getConfirmation: true});

                  // onSubmitProfileDataCall();
                  // navigation.navigate('HomeTab')
                }}
                style={{
                  backgroundColor: Colors.blueTextColor,
                  minHeight: hp(6),
                  borderRadius: 8,
                  justifyContent: 'center',
                  maxWidth: '85%',
                  minWidth: '85%',
                  alignSelf: 'center',
                  opacity:
                    this.validateEmail(this.state.mailForPop) == true &&
                    this.state.markCheck === true
                      ? 10
                      : 0.7,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: heightPercentageToDP(2.2),
                    color: Colors.white,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </Fragment>
          )}
          {this.state.getConfirmation && (
            <View
              style={{
                marginTop: hp(3.5),
                minWidth: '100%',
                maxWidth: '100%',
              }}>
              <Text
                style={{
                  // width: hp(50),
                  color: Colors.black4,
                  fontSize: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                }}>
                You are sharing patient health information with Physician (
                {this.state.mailForPop}), Do you want to proceed ?
              </Text>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: hp(4),
                  marginBottom: hp(2),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible();
                    this.state.close();
                  }}
                  style={{
                    backgroundColor: Colors.bleLayer3,
                    minHeight: hp(6),
                    borderRadius: 8,
                    // display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    maxWidth: '47%',
                    minWidth: '47%',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: Colors.blueTextColor}}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // this.setModalVisible();
                    // this.state.close();
                    this.sendPDF();
                  }}
                  style={{
                    backgroundColor: Colors.blueTextColor,
                    minHeight: hp(6),
                    borderRadius: 8,
                    // display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    maxWidth: '47%',
                    minWidth: '47%',
                    alignItems: 'center',
                    // marginLeft: hp(5),
                  }}>
                  <Text style={{color: Colors.white}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    // height: 340,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    paddingVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerText: {
    textAlign: 'left',
    fontSize: hp(2),
    fontFamily: Fonts.SourceSansBold,
    width: '85%',
    paddingVertical: hp(1),
  },
  content: {
    padding: hp(1.5),
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
});

const mapStateToProps = ({emailSharingResourceData}) => ({
  emailSharingResourceData,
});
export default connect(mapStateToProps)(EmailPopover);
