/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Image,
  BackHandler,
  Linking,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
// import {NavigationEvents} from 'react-navigation';
import MedicationService from '../../../../api/medication';
import Colors from '../../../../../config/Colors';
import {
  SvgMedicationIcon,
  SvgNoImageFoundIcon,
  SvgSortIconBlack,
} from '../../constants';
import Images from '../../../../../config/Images';
import Spinner from 'react-native-loading-spinner-overlay';
import MyIcon from '../../../../../../assets/svg/illustration_Prescription_mega.svg';
import PricesItem from '../../components/PricesItem';
import {Menu} from 'react-native-material-menu';
import {MenuItem} from 'react-native-material-menu';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GetLocation from 'react-native-get-location';
import {getUserLocation} from '../../actions';
import {Fonts} from '../../../../../config/AppConfig';
import images from '../../../../../config/Images';

let dropDownData = [
  {
    value: 'Sort By Location',
  },
  {
    value: 'Sort By Discounts',
  },
];
class NearPharmacies extends React.PureComponent {
  /* istanbul ignore next */

  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      image: null,
      medicineName: '',
      dosage: '',
      quantity: 0,
      pricesArray: [],
      index: 0,
      medicineDetailData: {},
      isLocationEnabled: false,
    };
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  forceUpdateHandler() {
    this.forceUpdate();
  }
  componentDidMount(): void {
    console.log('====================================');
    console.log('this.props.route.params', this.props.route.params);
    console.log('====================================');
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.getMedicineDetaildata();
    this.getUserLocation();
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        let params = this.props.route.params;
        console.log('Params:', this.props.route.params);
        let splitItems = params.name.split(' ');
        let dosage = splitItems[splitItems?.length - 1];
        // let name = splitItems[0];
        let ndc = params.ndc;
        const {quantity} = params;
        this.setState({
          image: params.image,
          ndc: params.ndc,
          dosage: dosage,
          quantity: quantity,
          medicineName: params.name,
        });
      },
    );
  }
  componentWillUnmount(): void {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  /* istanbul ignore next */
  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
  getMedicineDetaildata(ndc) {
    this.setState({showLoader: true});
    console.log('this.props.userLocationData');
    console.log('Location Data,', this.props.userLocationData);
    let dataObject = {
      ndc: this.props.route.params.ndc,
    };
    console.log('====================================');
    console.log('property name', this.props.route.params.name);
    console.log('====================================');
    // {
    //   Name: null,
    //   NDC: ndc,
    //   Location: this.props.userLocationData.postcode,
    // };
    console.log('getNearByPharmacies dataObject', dataObject);
    MedicationService.getNearByPharmacies(dataObject)
      .then(res => {
        console.log('getNearByPharmacies');
        console.log(res);
        this.setState({showLoader: false});
        if (res) {
          const pricesData = res.data.prices;
          pricesData?.map((item, index) => {
            return (item.sortNo = index);
          });

          this.setState({
            pricesArray: pricesData,
            medicineDetailData: res.data,
          });
        }
      })
      .catch(err => {
        this.setState({showLoader: false});
        console.log('err', err);
      });
  }
  /* istanbul ignore next */
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: Colors.lightGrey,
        }}
      />
    );
  };
  /* istanbul ignore next */
  willFocusAction = payload => {
    let params = payload.state.params;
    console.log('Params:', payload.state.params);
    let splitItems = params.name.split(' ');
    let dosage = splitItems[splitItems?.length - 1];
    // let name = splitItems[0];
    let ndc = params.ndc;
    const {quantity} = params;
    this.setState({
      image: params.image,
      ndc: params.ndc,
      dosage: dosage,
      quantity: quantity,
      medicineName: params.name,
    });

    // this.getMedicineDetaildata(ndc);
  };
  sortByPrice(index) {
    this.setState({index: index});
    if (index === 0) {
      this.state.pricesArray.sort((a, b) => {
        return a.sortNo - b.sortNo;
      });
      this.setState({...this.state.pricesArray});
    } else if (index === 1) {
      this.state.pricesArray.sort((a, b) => {
        if (a.pharmacy < b.pharmacy) {
          return -1;
        }
        if (a.pharmacy > b.pharmacy) {
          return 1;
        }
        return 0;
      });

      this.setState({...this.state.pricesArray});
    } else if (index === 2) {
      this.state.pricesArray.sort((a, b) => {
        return (b.coupon_url != null) - (a.coupon_url != null) || a - b;
      });

      this.setState({...this.state.pricesArray});
    }
  }
  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  onPriceClick() {
    this.hideMenu();
    this.sortByPrice(0);
  }

  onLocationClick() {
    this.hideMenu();
    this.sortByPrice(1);
  }

  onCouponClick() {
    this.hideMenu();
    this.sortByPrice(2);
  }

  getUserLocation() {
    if (Platform.OS === 'android' && RNAndroidLocationEnabler) {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          console.log('====================================');
          console.log('data location', data);
          console.log('====================================');
          this.setState({isLocationEnabled: true});
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
            .then(location => {
              console.log('User Location Data');
              console.log(location);
              console.log(
                'HomeApi Google Key',
                this.props.homeApiData.apiAuth.googleMapsApiKey,
              );
              let LONGITUDE = location.longitude;
              let LATITUDE = location.latitude;
              // let LATITUDE = 36.778259;
              // let LONGITUDE = -119.4179;
              console.log(
                'Urlll',
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LATITUDE},${LONGITUDE}&radius=1500&type=pharmacy|drugstore&key=${this.props.homeApiData.apiAuth.googleMapsApiKey}`,
              );
              https: fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LATITUDE},${LONGITUDE}&radius=1500&type=pharmacy|drugstore&key=${this.props.homeApiData.apiAuth.googleMapsApiKey}`,
                // `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${LATITUDE}&longitude=${LONGITUDE}&localityLanguage=en`,
              )
                .then(res => res.json())
                .then(res => {
                  console.log('maps.googleapis.com response if condition');
                  console.log(JSON.stringify(res));
                  console.log(
                    'HomeApi Google Key',
                    this.props.homeApiData.apiAuth.googleMapsApiKey,
                  );

                  this.props.dispatch(getUserLocation(res));
                });
            })
            .catch(error => {
              const {code, message} = error;
              console.log('location error');
              console.log(error);
              console.warn(code, message);
            });
        })
        .catch(err => {
          console.log('====================================');
          console.log('err in loc', err);
          console.log('====================================');
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        });
    } else {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          console.log('geocode data');
          console.log(location);
          // let LONGITUDE = location.longitude;
          // let LATITUDE = location.latitude;
          let LATITUDE = 36.778259;
          let LONGITUDE = -119.4179;
          https: fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LATITUDE},${LONGITUDE}&radius=1500&type=pharmacy|drugstore&key=${this.props.homeApiData.apiAuth.googleMapsApiKey}`,
          )
            .then(res => res.json())
            .then(res => {
              console.log('geocode data');
              console.log(JSON.stringify(res));
              this.props.dispatch(getUserLocation(res));
            });
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });
    }
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
          }}>
          {/* <NavigationEvents onWillFocus={this.willFocusAction} /> */}
          <Spinner
            visible={this.state.showLoader}
            textContent={'Loading....'}
            textStyle={{color: '#FFF'}}
          />
          {this.state.pricesArray?.length ? (
            <View style={{flex: 1, backgroundColor: Colors.BgColor}}>
              <ScrollView>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    alignContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      height: hp(8),
                      backgroundColor: Colors.BgColor,
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
                          color: Colors.black,
                          alignSelf: 'center',
                        }}>
                        W
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        flex: 1,
                        // marginRight: hp(3),
                        fontSize: hp(2.5),
                        paddingLeft: hp(9),
                        fontFamily: Fonts.SourceSansRegular,
                        color: Colors.black,
                        alignSelf: 'center',
                      }}>
                      Pharmacies
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    {this.state.image !== null ? (
                      (console.log(this.state.image),
                      console.log('check image'),
                      (
                        <Image
                          style={{
                            width: hp(10),
                            height: hp(10),
                            alignSelf: 'center',
                            borderRadius: 20,
                          }}
                          source={{uri: this.state.image}}
                        />
                      ))
                    ) : (
                      <Image
                        style={{
                          width: '100%',
                          height: hp(10),
                          resizeMode: 'contain',
                          alignSelf: 'center',
                        }}
                        source={images.AdMedIcon}
                      />
                    )}
                    <View
                      style={{
                        marginTop: hp(1),
                        width: '100%',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <Text
                        // numberOfLines={1}
                        // ellipsizeMode="tail"
                        style={{
                          fontSize: hp(2.8),
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.black,
                          //  marginLeft: hp(17),
                          flex: 1,
                        }}>
                        {this.props.route.params.name}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingVertical: hp(2),
                      paddingHorizontal: hp(0),
                      flex: 1,
                    }}>
                    <View
                      style={{width: '100%', flex: 1, marginBottom: hp(1.5)}}>
                      <FlatList
                        data={this.state.pricesArray}
                        // ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={({item, index}) => (
                          <PricesItem
                            item={item}
                            index={index}
                            navigation={this.props.navigation}
                            locationData={this.props.userLocationData}
                            locationEnabled={this.state.isLocationEnabled}
                          />
                        )}
                        keyExtractor={(item, index) => index}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
              {/* <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://www.goodrx.com/');
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: hp(1),
                  marginBottom: hp(1),
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: hp(5),
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                  source={Images.goodRx_logo}
                />
              </TouchableOpacity> */}
            </View>
          ) : (
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: hp(8),
                  backgroundColor: Colors.BgColor,
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
                      color: Colors.black,
                      alignSelf: 'center',
                    }}>
                    W
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: hp(2.2),
                    paddingLeft: hp(9),
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.black,
                    alignSelf: 'center',
                  }}>
                  Pharmacies
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MyIcon
                  width={heightPercentageToDP(50)}
                  height={heightPercentageToDP(25)}
                  fill="#000"
                />
                <Text
                  style={{
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    color: Colors.fontGrey,
                    marginTop: hp(2),
                    marginRight: hp(10),
                    marginLeft: hp(10),
                    textAlign: 'center',
                  }}>
                  No Data Available against this medicine
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({userLocationData, homeApiData}) => ({
  userLocationData,
  homeApiData,
});

export default connect(mapStateToProps)(NearPharmacies);
