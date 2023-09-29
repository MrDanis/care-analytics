/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import MyIcon from '../../../../../assets/svg/illustration_Prescription_mega.svg';
import {getAllMedication, getLookUpMedication} from '../actions';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
// import allMedicationData from '../reducers';
import {Fonts} from '../../../../config/AppConfig';
import MedicationItem from '../components/MedicationItem';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import MedicationService from '../../../api/medication';
import images from '../../../../../app/config/Images';
import MainHeader from '../../mycare/components/MainHeader';
import {Modalize} from 'react-native-modalize';
import Images from '../../../../config/Images';
import SvgNoImageFoundIcon from '../../../../../assets/svg/noMedImage.svg';
import DropDownPicker from 'react-native-dropdown-picker';
import {TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';

// import {showMessage} from 'react-native-flash-message';

var instance = null;
class AllMedicationScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      takenColor: Colors.fontGrey,
      refreshing: false,
      currentItem: {},
      delieveryBtn: true,
      pickupBtn: false,
      pharmacies: [],
      openDropper: false,
      selectedValue: '',
      userData: this.props.userProfileData,
      description: '',
      phone: this.props.userProfileData.phone,
      address: this.props.userProfileData.address,
      // image: {uri: item.fdaMedicine.imagePath},
    };
  }
  getAllMedicationData() {
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
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  getAllPharmacies() {
    this.setState({showLoader: true});
    MedicationService.getPharmacies()
      .then(response => {
        this.setState({showLoader: false});
        console.log('get all Pharmacies for drop');
        console.log(response.data);
        if (response && response.statusCode === 200) {
          this.setState({pharmacies: response.data});
          // this.props.dispatch(getAllMedication(response.data));
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({showLoader: false});
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  componentDidMount(): void {
    instance = this;
    instance.onAddNewButtonPress.bind(this);
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        console.log('come here to foucs');
        this.getAllMedicationData();
      },
    );
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        console.log('come here to foucs');
        this.getAllPharmacies();
      },
    );
  }
  // componentWillUnmount(): void {
  //   this.willFocusSubscription.remove();
  // }
  /* istanbul ignore next */
  onRefresh() {
    // this.getMedications();
  }
  /* istanbul ignore next */
  onAddNewButtonPress() {
    global.selectedData = null;
    this.props.navigation.navigate('AddNewMedication');
  }
  onOpen(item) {
    this.setState({currentItem: item});
    this.refs.modalize.open();
    console.log('====================================');
    console.log('here in open', item);
    console.log('====================================');
  }
  setOpenDropper() {
    this.setState({openDropper: !this.state.openDropper});
  }
  onClose() {
    this.refs.modalize.close();
  }
  showFrequencyDays = Days => {
    const Frequency = Days;
    // console.log('====================================');
    // console.log('Frequency', Frequency);
    // console.log('====================================');
    if (Frequency === 1) {
      return 'Daily';
    } else if (Frequency === 7) {
      return 'Weekly';
    } else if (Frequency === 30) {
      return 'Monthly';
    } else {
      return 'Every ' + Frequency + ' Days';
    }
  };
  setValue = callback => {
    console.log('setValue', callback());
    const value = callback();

    this.setState({selectedValue: value});
  };
  MedicationChild(item, index) {
    // console.log("this is the item that's being passed", item);
    return (
      <Pressable
        onPress={() => {
          this.props.navigation.navigate('MedicationDetail', {
            data: item,
          });
        }}
        style={{
          borderRadius: 10,
          height: hp(10),
          width: '90%',
          marginTop: hp(2),
          marginBottom:hp(2),
          shadowOffset: {width: 0.1, height: 0.1},
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 3,
          backgroundColor: Colors.white,
          flexDirection: 'row',
          alignItems: 'center',
          padding:Platform.OS==='android'? hp(2) : hp(2),
          alignSelf: 'center',
          borderColor:'red',
          borderWidth:0
        }}>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            alignSelf: 'center',
            marginRight: hp(1),
          }}
          source={Images.medIcon4x}
          // onError={this.onError.bind(this)}
        />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{marginLeft: hp(2)}}>
            <View style={{flexDirection: 'row',borderColor:'red',borderWidth:0}}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansSemibold,

                  fontSize: hp(2),
                  flex: 1,
                  color: Colors.black1,
                  textTransform: 'capitalize',
                }}>
                {item.fdaMedicine.proprietaryname}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  marginRight: hp(0.5),
                  color: Colors.black3,
                }}>
                {this.showFrequencyDays(item.frequencyInDays)}
              </Text>
              <View
                style={{
                  height: 8,
                  width: 8,
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
                  fontSize: hp(2),
                  color: Colors.black3,
                }}>
                {item.mealStatus === false ? 'Before Meal' : 'After Meal'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              console.log('refill please');
              this.onOpen(item);
            }}
            style={{justifyContent: 'center'}}>
            {item.time === false ? null : (
              <Image
                source={Images.refillIcon}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            )}
          </Pressable>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'WisemanPTSymbols',
                fontSize: hp(3),
                color: Colors.black1,
                alignSelf: 'center',
              }}>
              X
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }
  /* istanbul ignore next */

  render() {
    return (
      <Fragment>
        <View style={{flex: 1, backgroundColor: Colors.BgColor}}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Loading...'}
            textStyle={{color: '#FFF'}}
          />
          {this.props.allMedicationData &&
          this.props.allMedicationData.length ? (
            <View
              style={{
                flex: 1,
                marginTop: hp(5),
              }}>
              <MainHeader
                name="Prescriptions"
                navigation={this.props.navigation}>
                <View style={{flex: 1, marginTop: hp(3)}}>
                  <FlatList
                    data={this.props.allMedicationData}
                    onEndReached={({distanceFromEnd}) => {
                      console.log('====================================');
                      console.log(
                        'On Reach End distanceFromEnd',
                        distanceFromEnd,
                      );
                      console.log('====================================');
                    }}
                    renderItem={({item, index}) => {
                      return this.MedicationChild(item, index);
                    }}
                    keyExtractor={item => item.id}
                    refreshControl={
                      <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                      />
                    }
                  />
                </View>
              </MainHeader>
              <Modalize
                ref="modalize"
                // adjustToContentHeight={true}
                modalHeight={hp(75)}
                onClosed={() => {
                  this.setState({
                    address: this.props.userProfileData.address,
                    phone: this.props.userProfileData.phone,
                    description: '',
                  });
                }}
                modalStyle={{
                  paddingTop: 5,
                  borderTopRightRadius: 25,
                  borderTopLeftRadius: 25,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: hp(2),
                        fontFamily: Fonts.SourceSansSemibold,
                        marginVertical: hp(2.5),
                      }}>
                      Refill Medication{' '}
                    </Text>
                  </View>
                  <KeyboardAwareScrollView
                    contentContainerStyle={{width: '95%'}}
                    style={{flex: 1}}>
                    <View style={{width: '95%'}}>
                      <Text
                        style={{
                          color: Colors.darkgrey,
                          marginTop: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Select Pharmacy
                      </Text>
                      <DropDownPicker
                        schema={{
                          label: 'pharmacyName',
                          value: 'id',
                        }}
                        open={this.state.openDropper}
                        items={this.state.pharmacies}
                        // defaultIndex={0}
                        value={this.state.selectedValue}
                        // setValue={value => {
                        //   console.log('Value on set', value);
                        //   this.setState({selectedValue: value});
                        // }}
                        setValue={this.setValue}
                        // containerStyle={{height: 200}}
                        setOpen={() =>
                          this.setState({openDropper: !this.state.openDropper})
                        }
                        // defaultValue={this.selectedValue}
                        dropDownDirection="BOTTOM"
                        placeholder="Pharmacy Name"
                        placeholderStyle={{
                          color: Colors.label,
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2),
                        }}
                        textStyle={{
                          color: Colors.black,
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2),
                        }}
                        style={{
                          borderRadius: 8,
                          marginTop: hp(0.8),
                          marginBottom: hp(1.5),
                          borderColor: Colors.line,
                          paddingHorizontal: hp(2),
                        }}
                      />
                      <Text
                        style={{
                          color: Colors.darkgrey,
                          marginTop: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Medication Name
                      </Text>
                      <View
                        style={{
                          backgroundColor: Colors.superLightPurple,
                          borderRadius: 10,
                          marginTop: hp(0.8),
                          marginBottom: hp(1.5),
                        }}>
                        <Text
                          style={{
                            // backgroundColor: Colors.superLightPurple,
                            paddingTop: 15,
                            paddingBottom: 15,
                            marginLeft: hp(2),
                          }}>
                          {this.state.currentItem?.fdaMedicine?.proprietaryname}
                        </Text>
                      </View>
                      {/* <DropDownPicker
                      // open={this.state.open}
                      // items={this.options}
                      // defaultIndex={0}
                      // value={this.selectedValue}
                      // setValue={value =>
                      // {
                      //   console.log('Value on set' , value)
                      //   this.setState({selectedValue : value})
                      //
                      // }}
                      // setValue={this.setValue}
                      // containerStyle={{height: 200}}
                      // setOpen={() => this.setState({open: !this.state.open})}
                      // defaultValue={this.selectedValue}
                      dropDownDirection="BOTTOM"
                      placeholder=" + Add other Medicine"
                      placeholderStyle={{
                        color: Colors.label,
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2),
                      }}
                      textStyle={{
                        color: Colors.black,
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2),
                      }}
                      style={{
                        borderRadius: 8,
                        marginTop: hp(1.4),
                        borderColor: Colors.line,
                        paddingHorizontal: hp(2),
                        marginTop: hp(1),
                      }}
                    /> */}

                      <Text
                        style={{
                          color: Colors.darkgrey,
                          marginTop: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Delivery Methods
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          backgroundColor: Colors.bleLayer4,
                          width: Platform.OS === 'ios' ? '100%' : '100%',
                          borderColor:'red',
                          borderWidth:0,
                          borderRadius: hp(1),
                          marginTop: hp(0.8),
                          marginBottom: hp(1.5),
                        }}>
                        <TouchableOpacity
                          style={{
                            // paddingHorizontal: hp(8),
                            // paddingVertical: hp(1.7),
                            minWidth: Platform.OS === 'ios' ? '50%' : '50%',
                            height: Platform.OS === 'android' ? hp(6) : hp(5.5),
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.state.delieveryBtn
                              ? Colors.blueTextColor
                              : Colors.bleLayer4,
                            borderRadius: hp(1),
                          }}
                          onPress={() => {
                            this.setState({
                              delieveryBtn: true,
                              pickupBtn: false,
                            });
                          }}>
                          <Text
                            style={{
                              color: this.state.delieveryBtn
                                ? Colors.white
                                : Colors.noRecordFound,
                            }}>
                            Deliver
                          </Text>
                        </TouchableOpacity>
                        {/* {
                          Platform.OS === 'android'?<View style={{width:'10%'}}></View>:null
                        } */}
                        <TouchableOpacity
                          style={{
                            minWidth: Platform.OS === 'ios' ? '50%' : '50%',
                            height: Platform.OS === 'android' ? hp(6) : hp(5.5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.state.pickupBtn
                              ? Colors.blueTextColor
                              : Colors.bleLayer4,
                            borderRadius: hp(1),
                            shadowRadius: 5,
                            // marginLeft: Platform.OS === 'ios' ? hp(0.1) : hp(0),
                          }}
                          onPress={() => {
                            this.setState({
                              delieveryBtn: false,
                              pickupBtn: true,
                            });
                          }}>
                          <Text
                            style={{
                              color: this.state.pickupBtn
                                ? Colors.white
                                : Colors.noRecordFound,
                            }}>
                            Pickup
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={{
                          color: Colors.darkgrey,
                          marginTop: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Phone Number
                      </Text>
                      <View
                        style={{
                          width: '100%',

                          alignItems: 'center',

                          justifyContent: 'center',

                          borderWidth: 1,

                          height: hp(7),

                          borderColor: Colors.circleBackground,

                          borderRadius: 5,

                          marginTop: hp(0.8),
                          marginBottom: hp(1.5),
                        }}>
                        <TextInput
                          style={{
                            paddingTop: 10,

                            paddingBottom: 10,
                            paddingLeft: 10,

                            color: '#424242',

                            borderRadius: 8,

                            borderColor: Colors.line,

                            flexDirection: 'row',

                            minWidth: '100%',

                            height: hp(10),

                            alignSelf: 'center',

                            fontSize: hp(2.2),

                            fontFamily: Fonts.SourceSansRegular,
                          }}
                          value={this.state.phone}
                          onChangeText={text => {
                            this.setState({phone: text});
                          }}
                          placeholder={'Phone Number'}
                          placeholderTextColor={Colors.blueGrayDisableText}
                        />
                      </View>
                      <Text
                        style={{
                          color: Colors.darkgrey,
                          marginTop: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Delivery Address
                      </Text>
                      <View
                        style={{
                          width: '100%',

                          alignItems: 'center',

                          justifyContent: 'center',

                          borderWidth: 1,

                          height: hp(7),

                          borderColor: Colors.circleBackground,

                          borderRadius: 5,

                          marginTop: hp(0.8),
                          marginBottom: hp(1.5),
                        }}>
                        <TextInput
                          style={{
                            paddingTop: 10,

                            paddingBottom: 10,
                            paddingLeft: 10,

                            color: '#424242',

                            borderRadius: 8,

                            borderColor: Colors.line,

                            flexDirection: 'row',

                            minWidth: '100%',

                            height: hp(10),

                            alignSelf: 'center',

                            fontSize: hp(2.2),

                            fontFamily: Fonts.SourceSansRegular,
                          }}
                          value={this.state.address}
                          onChangeText={text => {
                            this.setState({address: text});
                          }}
                          placeholder={'Address'}
                          placeholderTextColor={Colors.blueGrayDisableText}
                        />
                      </View>
                      <Text
                        style={{
                          color: Colors.darkgrey,
                          marginTop: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Email Address
                      </Text>
                      <View
                        style={{
                          width: '100%',

                          alignItems: 'center',

                          justifyContent: 'center',

                          borderWidth: 1,

                          height: hp(7),

                          borderColor: Colors.circleBackground,

                          borderRadius: 5,

                          marginTop: hp(0.8),
                          marginBottom: hp(1.5),
                        }}>
                        <TextInput
                          style={{
                            paddingTop: 10,

                            paddingBottom: 10,
                            paddingLeft: 10,

                            color: '#424242',

                            borderRadius: 8,

                            borderColor: Colors.line,

                            flexDirection: 'row',

                            minWidth: '100%',

                            height: hp(10),

                            alignSelf: 'center',

                            fontSize: hp(2.2),

                            fontFamily: Fonts.SourceSansRegular,
                          }}
                          value={this.state.userData.email}
                          // onChangeText={text => {
                          //   props.setTestName(text);
                          // }}
                          placeholder={'Email'}
                          placeholderTextColor={Colors.blueGrayDisableText}
                        />
                      </View>
                      <Text
                        style={{
                          color: Colors.darkgrey,
                          marginTop: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        Description
                      </Text>
                      <View
                        style={{
                          width: '100%',

                          borderWidth: 1,

                          height: hp(11),

                          borderColor: Colors.circleBackground,

                          borderRadius: 5,

                          marginTop: hp(0.8),
                          marginBottom: hp(1.5),
                        }}>
                          {
                            Platform.OS !== 'android'?
                            <TextInput
                          multiline={true}
                          style={{
                            paddingTop: 10,

                            paddingBottom: 10,
                            paddingLeft: 10,

                            color: '#424242',

                            borderRadius: 8,
                            
                            borderWidth:2,

                            borderColor: Colors.line,

                            // flexDirection: 'row',

                            minWidth: '100%',

                            height: hp(11),

                            alignSelf: 'center',

                            fontSize: hp(2.2),
                            fontFamily: Fonts.SourceSansRegular,
                          }}
                          // value={props.testName}
                          onChangeText={text => {
                            this.setState({description: text});
                          }}
                          placeholder={'Description'}
                          placeholderTextColor={Colors.blueGrayDisableText}
                        />:
                        <TextInput
                          multiline={true}
                          style={{
                           

                            color: '#424242',

                            borderRadius: 8,
                            
                            // borderWidth:2,

                            borderColor: Colors.line,

                            // flexDirection: 'row',

                            minWidth: '100%',

                            // height: hp(11),

                            // alignSelf: 'center',

                            fontSize: hp(2.2),
                            fontFamily: Fonts.SourceSansRegular,
                          }}
                          // value={props.testName}
                          onChangeText={text => {
                            this.setState({description: text});
                          }}
                          placeholder={'Description'}
                          placeholderTextColor={Colors.blueGrayDisableText}
                        />
                          }
                        
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: Platform.OS === 'ios' ? '100%' : '100%',
                          borderRadius: hp(1),
                          marginTop: hp(2.5),
                          marginBottom: hp(3.5),
                          borderColor:'red',
                          borderWidth:0
                        }}>
                        <TouchableOpacity
                          style={{
                            // paddingHorizontal: hp(8),
                            // paddingVertical: hp(1.7),
                            minWidth: Platform.OS === 'ios' ? '48%' : '45%',
                            height: Platform.OS === 'android' ? hp(6) : hp(5.5),
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.bleLayer3,
                            borderRadius: hp(1),
                          }}
                          onPress={() => {
                            this.setState({description: ''});
                            this.onClose();
                          }}>
                          <Text
                            style={{
                              color: Colors.blueTextColor,
                            }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        {
                          Platform.OS === 'android'?
                          <View style={{width:'10%'}}> 
                          </View>:null
                        }
                        <TouchableOpacity
                          style={{
                            minWidth: Platform.OS === 'ios' ? '48%' : '45%',
                            height: Platform.OS === 'android' ? hp(6) : hp(5.5),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.blueTextColor,

                            borderRadius: hp(1),
                            shadowRadius: 5,
                            // marginLeft: Platform.OS === 'ios' ? hp(0.1) : hp(0),
                          }}
                          onPress={() => {
                            this.onClose();
                            // alert('success');
                            showMessage({
                              message: 'Success',
                              description:
                                'Refill request has been sent successfully',
                              type: 'default',
                              icon: {icon: 'success', position: 'left'},
                              backgroundColor: Colors.green,
                            });
                          }}>
                          <Text
                            style={{
                              color: Colors.white,
                            }}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </Modalize>
            </View>
          ) : (
            <>
              <SafeAreaView />
              <MainHeader
                name="Prescriptions"
                navigation={this.props.navigation}>
                <View style={{flex: 1}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp(7),
                    }}>
                    <MyIcon
                      width={heightPercentageToDP(50)}
                      height={heightPercentageToDP(25)}
                      fill="#000"
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansLight,
                      marginTop: heightPercentageToDP(5),
                      fontSize: 16,
                      color: Colors.black3,
                    }}>
                    Never miss your medicine again!
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansBold,
                      marginTop: heightPercentageToDP(2),
                      fontSize: 20,
                      color: Colors.black1,
                    }}>
                    Nothing in prescriptions.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('AddNewMedication');
                    }}
                    style={{
                      width: '65%',
                      marginTop: hp(5),
                      marginBottom: hp(2),
                      height: hp(7),
                      alignSelf: 'center',
                      borderRadius: 5,
                      borderColor: Colors.cyan,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.blueTextColor,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.6),
                        color: Colors.white,
                      }}>
                      Add Medication
                    </Text>
                  </TouchableOpacity>
                </View>
              </MainHeader>
            </>
          )}
        </View>
      </Fragment>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = ({allMedicationData, userProfileData}) => ({
  allMedicationData,
  userProfileData,
});
export default connect(mapStateToProps)(AllMedicationScreen);
