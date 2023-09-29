/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  SvgDirectionIcon,
  SvgDirectionIconWhite,
  SvgLocationIcon,
  SvgNoImageFoundIcon,
} from '../constants';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
import {showMessage} from 'react-native-flash-message';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import images from '../../../../config/Images';
import GetLocation from 'react-native-get-location';


export default class PricesItem extends React.PureComponent {
  constructor(props) {
    super(props);
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
          let url = `https://www.google.com/maps/search/?api=1&query=${this.props.item.pharmacy}, ${this.props.locationData.principalSubdivision} ${this.props.locationData.postcode}, ${this.props.locationData.countryCode}`;
          Linking.openURL(url);
          // this.setState({isLocationEnabled: true});
          // The user has accepted to enable the location services
          // data can be :
          //  - "already-enabled" if the location services has been already enabled
          //  - "enabled" if user has clicked on OK button in the popup
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
    }
      // else {
      //   GetLocation.getCurrentPosition({
      //     enableHighAccuracy: true,
      //     timeout: 15000,
      //   })
      //     .then(location => {
      //       console.log('geocode data');
      //       console.log(location);
      //       // let LONGITUDE = location.longitude;
      //       // let LATITUDE = location.latitude;
      //       let LATITUDE = 36.778259;
      //       let LONGITUDE = -119.4179;
      //       https: fetch(
      //         `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LATITUDE},${LONGITUDE}&radius=1500&type=pharmacy|drugstore&key=${this.props.homeApiData.apiAuth.googleMapsApiKey}`,
      //       )
      //         .then(res => res.json())
      //         .then(res => {
      //           console.log('geocode data');
      //           console.log(JSON.stringify(res));
      //           this.props.dispatch(getUserLocation(res));
      //         });
      //     })
      //     .catch(error => {
      //       const {code, message} = error;
      //       console.warn(code, message);
      //     });
      // }
  }

  render() {
    return (
      <Fragment>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Image
              source={images.pharmacyIcon}
              style={{width: hp(5), height: hp(5)}}
            />
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                // justifyContent: 'center',
                width: '90%',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: hp(2),
                    marginLeft: hp(1),
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.black,
                  }}>
                  {this.props.item.pharmacy}
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.7),
                    alignSelf: 'center',
                    paddingLeft: hp(1),
                    flex: 1,
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.blueRxColor,
                  }}>
                  {this.props.item.savings} OFF
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: hp(0)}}>
                <Text
                  style={{
                    fontSize: hp(2.2),
                    paddingLeft: hp(1),
                    fontFamily: Fonts.SourceSansSemibold,
                    color: Colors.red2,
                  }}>
                  ${this.props.item.price}
                </Text>
                {this.props.item.retail_price !== null ? (
                  <Text
                    style={{
                      fontSize: hp(2),
                      fontFamily: Fonts.SourceSansSemibold,
                      color: Colors.black3,
                      alignSelf: 'center',
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                      marginLeft: hp(1),
                      marginRight: hp(1),
                    }}>
                    ${this.props.item.retail_price}
                  </Text>
                ) : (
                  <Text style={{flex: 1}} />
                )}

                {/* {this.props.item.savings !== null && (
                  
                    // <Text
                    //   style={{
                    //     fontSize: hp(2),
                    //     alignSelf: 'center',
                    //     flex: 1,
                    //     fontFamily: Fonts.SourceSansBold,
                    //     color: Colors.blueRxColor,
                    //   }}>
                    //   {this.props.item.savings} OFF
                    // </Text>
                  )}
                  {/* <Text
                    style={{
                      fontSize: hp(3),
                      fontFamily: Fonts.SourceSansBold,
                      color: Colors.blueRxColor,
                    }}>
                    ${this.props.item.price}
                  </Text> */}
              </View>
              {/* <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(2),
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.getUserLocation();
                      // if (this.props.locationEnabled === true) {
                      //   let url = `https://www.google.com/maps/search/?api=1&query=${this.props.item.pharmacy}, ${this.props.locationData.principalSubdivision} ${this.props.locationData.postcode}, ${this.props.locationData.countryCode}`;
                      //   Linking.openURL(url);
                      // } else {
                      //   showMessage({
                      //     message: 'Information',
                      //     description: 'Please Enable Location',
                      //     type: 'default',
                      //     icon: {icon: 'info', position: 'left'},
                      //     backgroundColor: Colors.homeYellow,
                      //   });
                      // }
                    }}
                    style={{
                      marginLeft: hp(1),
                      height: hp(5),
                      flex: 1,
                      alignSelf: 'center',
                      borderRadius: hp(0.5),
                      marginRight: hp(2),
                      backgroundColor: '#E9F0FA',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.NunitoBold,
                        fontSize: hp(2.2),
                        color: '#2B70C9',
                      }}>
                      Navigation
                    </Text>
                  </TouchableOpacity>

                  {this.props.item.coupon_url !== null && (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('Coupon', {
                          item: this.props.item,
                        });
                      }}
                      style={{
                        borderRadius: hp(0.5),
                        flex: 1,
                        height: hp(5),
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.blueRxColor,
                      }}>
                      <Text
                        style={{
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansBold,
                          color: Colors.white,
                        }}>
                        FREE Coupon
                      </Text>
                    </TouchableOpacity>
                  )}
                </View> */}
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Coupon', {
                  item: this.props.item,
                });
              }}>
              <Image source={images.couponIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.getUserLocation();
              }}>
              <Image
                source={images.navigationIcon}
                style={{marginLeft: hp(1)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Fragment>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '95%',
    marginTop: hp(2.5),
    marginLeft: hp(1),
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: hp(2),
    shadowOffset: {width: 0.05, height: 0.05},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3 ,
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignSelf: 'center',
    marginRight: hp(1),
  },
  circleShape: {
    width: hp(4),
    height: hp(4),
    borderRadius: hp(4) / 2,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: hp(2),
    width: '90%',
    borderRadius: 3,
  },
});
