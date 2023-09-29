/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  BackHandler,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {showMessage} from 'react-native-flash-message';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import Colors from '../../../../../config/Colors';
import Images from '../../../../../config/Images';
import Spinner from 'react-native-loading-spinner-overlay';
import {SvgDirectionIconWhite} from '../../constants';
var instance = null;
class CouponScreen extends React.PureComponent {
  /* istanbul ignore next */
  static navigationOptions = {
    title: 'Coupon',
    headerStyle: {
      backgroundColor: Colors.blueBackground,
    },
    headerTintColor: Colors.white,
    headerLeft: (
      <TouchableOpacity
        hitSlop={{
          top: 30,
          right: 10,
          bottom: 10,
          left: 10,
        }}
        onPress={() => {
          instance.onBackButton();
        }}
        style={{alignSelf: 'center'}}>
        <Text
          style={{
            fontFamily: 'WisemanPTSymbols',
            fontSize: hp(4),
            marginLeft: hp(2),
            marginRight: hp(2),
            color: Colors.white,
            alignSelf: 'center',
          }}>
          W
        </Text>
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={{
          marginRight: hp(2),
          width: hp(4),
          height: hp(4),
        }}
        onPress={() => {
          if (instance !== null) {
            instance.onAddNewButtonPress();
          }
        }}>
        <SvgDirectionIconWhite />
      </TouchableOpacity>
    ),
  };
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {showLoader: false, url: '', item: null};
  }
  componentDidMount(): void {
    instance = this;
    instance.onAddNewButtonPress.bind(this);
    instance.onBackButton.bind(this);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
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
  /* istanbul ignore next */
  onAddNewButtonPress() {
    let url = `https://www.google.com/maps/search/?api=1&query=${this.state.item.pharmacy}, ${this.props.userLocationData.principalSubdivision} ${this.props.userLocationData.postcode}, ${this.props.userLocationData.countryCode}`;
    Linking.openURL(url);
  }
  onBackButton() {
    console.log('flkdsjlfsdj');
    this.props.navigation.goBack();
  }

  /* istanbul ignore next */
  willFocusAction = payload => {
    let params = payload.state.params;
    this.setState({item: params.item});
    console.log(params.item);
  };
  render() {
    return (
      <Fragment>
        <Spinner
          visible={this.state.showLoader}
          textContent={'Loading....'}
          textStyle={{color: '#FFF'}}
        />
        <NavigationEvents onWillFocus={this.willFocusAction} />
        <View style={{flex: 1}}>
          <WebView
            onLoadStart={() => {
              this.setState({showLoader: true});
            }}
            onLoadEnd={() => {
              this.setState({showLoader: false});
            }}
            source={{
              uri: this.state.item !== null ? this.state.item.coupon_url : '',
            }}
          />
        </View>
        <TouchableOpacity
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
        </TouchableOpacity>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({userLocationData}) => ({
  userLocationData,
});
export default connect(mapStateToProps)(CouponScreen);
