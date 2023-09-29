/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import Share from 'react-native-share';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import IconProfile from '../../../../../assets/svg/icon_profile_profile_info.svg';

export class AppointmentDetail extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    this.state = {appointmentData: null};
  }
  componentDidMount(): void {
    this.setState({appointmentData: this.props.navigation.state.params.data});
  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1}}>
          <LinearGradient
            colors={['#E0E0E0', '#FFFFFF']}
            style={{flex: 1, backgroundColor: Colors.gray}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                height: hp(7.5),
                borderBottomWidth: 0.5,
                borderColor: Colors.lightGrey,
                marginBottom: hp(2),
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
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
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: Fonts.NunitoSemiBold,
                  marginLeft: hp(2),
                  fontSize: hp(2.5),
                  color: Colors.black1,
                  flex: 1,
                  textTransform: 'capitalize',
                }}>
                Appointment Detail
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const shareOptions = {
                    title: 'Share Appointments',
                    message: this.state.appointmentData
                      ? JSON.stringify(this.state.appointmentData)
                      : '',
                  };
                  Share.open(shareOptions)
                    .then(res => {
                      console.log(res);
                    })
                    .catch(err => {
                      err && console.log(err);
                    });
                }}
                style={{
                  alignSelf: 'center',
                  marginRight: hp(2),
                }}>
                <ShareIcon />
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: hp(3), flex: 1}}>
              <Text
                style={{
                  fontFamily: Fonts.NunitoSemiBold,
                  fontSize: hp(2),
                  color: Colors.label,
                  textTransform: 'capitalize',
                }}>
                Title
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.NunitoBold,
                  fontSize: hp(3),
                  color: Colors.black,
                  textTransform: 'capitalize',
                }}>
                Session of monthly health checkup
              </Text>
              <View style={{flexDirection: 'row', marginTop: hp(3)}}>
                <View
                  style={{
                    alignSelf: 'center',
                  }}>
                  <IconProfile fill={'#607d8b'} width={hp(8)} height={hp(8)} />
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    marginLeft: hp(1),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.NunitoRegular,
                      fontSize: hp(1.5),
                      color: Colors.label,
                      textTransform: 'capitalize',
                    }}>
                    Physician
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.NunitoSemiBold,
                      fontSize: hp(2),
                      color: Colors.black,
                      textTransform: 'capitalize',
                    }}>
                    {this.state.appointmentData !== null
                      ? this.state.appointmentData.Physician
                      : ''}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: hp(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoRegular,
                    fontSize: hp(1.5),
                    color: Colors.label,
                    textTransform: 'capitalize',
                  }}>
                  Date & Time
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoSemiBold,
                    fontSize: hp(2.5),
                    color: Colors.black,
                    textTransform: 'capitalize',
                  }}>
                  {this.state.appointmentData !== null
                    ? this.state.appointmentData.DateTime
                    : ''}
                </Text>
              </View>
              <View
                style={{
                  marginTop: hp(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoRegular,
                    fontSize: hp(1.5),
                    color: Colors.label,
                    textTransform: 'capitalize',
                  }}>
                  Location
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoSemiBold,
                    fontSize: hp(2.5),
                    color: Colors.black,
                    textTransform: 'capitalize',
                  }}>
                  {this.state.appointmentData !== null
                    ? this.state.appointmentData.Location
                    : ''}
                </Text>
              </View>
              <View
                style={{
                  marginTop: hp(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoRegular,
                    fontSize: hp(1.5),
                    color: Colors.label,
                    textTransform: 'capitalize',
                  }}>
                  Notes
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.NunitoSemiBold,
                    fontSize: hp(2.5),
                    color: Colors.black,
                    textTransform: 'capitalize',
                  }}>
                  {this.state.appointmentData !== null
                    ? this.state.appointmentData.Notes
                    : ''}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </Fragment>
    );
  }
}
