/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CardView from 'react-native-cardview';
import {Fonts} from '../../../../../config/AppConfig';

export class QuestionTypeDateTime extends React.PureComponent {
  /* istanbul ignore next */
  constructor(props) {
    super(props);

    let currentAnswer = null;

    const {SavedAnswers: answers} = props.item;
    if (props.item.savedAnswers.length > 0) {
      currentAnswer = new Date(props.item.savedAnswers[0]);
    }

    this.state = {
      isFocused: false,
      isDateTimePickerVisible: false,
      selectedDateTime: currentAnswer,
    };
  }
  /* istanbul ignore next */
  UNSAFE_componentWillReceiveProps(
    nextProps: Readonly<P>,
    nextContext: any,
  ): void {
    // console.log('this.props.item');
    // console.log(nextProps.item);
    let currentAnswer = null;

    const {SavedAnswers: answers} = nextProps.item;
    if (nextProps.item.savedAnswers.length > 0) {
      currentAnswer = new Date(nextProps.item.savedAnswers[0]);
    }
    this.setState({
      isFocused: false,
      isDateTimePickerVisible: false,
      selectedDateTime: currentAnswer,
    });
  }
  /* istanbul ignore next */
  handleFocus = event => {
    this.setState({isFocused: true});
  };
  /* istanbul ignore next */
  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };
  /* istanbul ignore next */
  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };
  /* istanbul ignore next */
  getDateTimeValue = () => {
    var value = '';
    if (this.state.selectedDateTime !== null) {
      if (this.props.mode === 'datetime') {
        value = moment(this.state.selectedDateTime).format('LLL');
      } else {
        value = moment(this.state.selectedDateTime).format('LL');
      }
    } else {
      value = this.props.mode === 'date' ? 'Pick Date' : 'Pick Date & Time';
    }
    return value;
  };
  /* istanbul ignore next */
  onConfirm = pickedDateTime => {
    let date = pickedDateTime;
    this.setState({selectedDateTime: new Date(date)});
    if (this.props.mode === 'date') {
      let myDateString =
        new Date(date).getFullYear() +
        '-' +
        ('0' + (new Date(date).getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + new Date(date).getDate()).slice(-2);
      date = myDateString;
    } else {
      date = new Date(date);
    }
    console.log('date');
    console.log(date);

    console.log('Date:', moment(date).format('LLL'));
    this.props.onAnswer([date]);
    this.hideDateTimePicker();
  };
  /* istanbul ignore next */
  render() {
    const {isFocused} = this.state;
    return (
      <Fragment>
        <View style={{flex: 1, marginBottom: hp(1)}}>
          <CardView
            style={{
              backgroundColor: 'white',
              marginTop: hp(3),
              marginHorizontal: hp(1),
            }}
            cardElevation={3}
            cardMaxElevation={4}
            cornerRadius={8}>
            <View
              onTouchStart={this.showDateTimePicker}
              style={{
                flexDirection: 'row',
                padding: hp(2),
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...Platform.select({
                    ios: {
                      width: hp(5),
                      height: hp(5),
                    },
                    android: {},
                  }),
                  fontFamily: 'WisemanPTSymbols',
                  fontSize: hp(7),
                  color: Colors.label,
                }}>
                '
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.5),
                  flex: 1,
                  marginLeft: hp(1),
                  color: Colors.fontGrey,
                }}>
                {this.getDateTimeValue()}
              </Text>
              <View
                style={{
                  height: hp(3),
                  width: hp(3),
                  alignSelf: 'center',
                }}>
                <Image
                  source={require('../../../../../../assets/images/edit_assessment.png')}
                  style={{
                    alignSelf: 'center',
                    marginLeft: hp(2),
                    height: hp(3),
                    width: hp(3),
                  }}
                />
              </View>
            </View>
          </CardView>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onCancel={() => this.hideDateTimePicker()}
            date={new Date()}
            mode={this.props.mode}
            titleIOS={'Pick a Date'}
            titleStyle={{fontSize: hp(3)}}
            is24Hour={false}
            onConfirm={this.onConfirm}
          />
        </View>
      </Fragment>
    );
  }
}
