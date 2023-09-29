/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, TextInput, View} from 'react-native';
import Colors from '../../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Fonts} from "../../../../../config/AppConfig";

export class QuestionTypeNumber extends React.PureComponent {
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    let answerText = '';
    const {
      SavedAnswers: answers,
      CharLimit: charLimit,
      PlaceHolderText: placeHolder,
    } = props.item;
    if (props.item.savedAnswers.length > 0) {
      answerText = props.item.savedAnswers[0];
    } else {
      answerText = '';
    }
    this.state = {
      isFocused: false,
      answer: answerText,
      currentLength: answerText.length,
      maxLength: 3,
      placeHolder: props.item.placeHolderText ?? 'Please Type Here...',
    };
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    let answerText = '';
    const {
      SavedAnswers: answers,
      CharLimit: charLimit,
      PlaceHolderText: placeHolder,
    } = this.props.item;
    if (this.props.item.savedAnswers.length > 0) {
      answerText = this.props.item.savedAnswers[0];
    } else {
      answerText = '';
    }
    this.setState({
      isFocused: false,
      answer: answerText,
      currentLength: answerText.length,
      maxLength: 20,
      placeHolder: this.props.item.placeHolderText ?? 'Please Type Here...',
    });
  }
  /* istanbul ignore next */
  handleFocus = event => {
    this.setState({isFocused: true});
  };
  /* istanbul ignore next */
  onChangeText(text) {
    this.setState({currentLength: text.length});
    this.props.onAnswer([text]);
  }
  /* istanbul ignore next */
  render() {
    const {isFocused} = this.state;
    return (
      <Fragment>
        <View style={{flex: 1}}>
          <View
            style={{
              borderColor: Colors.lightGrey,
              backgroundColor: Colors.white,
              height: hp(7),
              marginLeft: hp(3),
              marginRight: hp(3),
              borderRadius: 5,
              borderWidth: 1,
            }}>
            <TextInput
              selectionColor={Colors.red}
              // underlineColorAndroid={
              //   isFocused ? Colors.homePurple : Colors.fontGrey
              // }
              onChangeText={text => this.onChangeText(text)}
              // onFocus={this.handleFocus}
              // autoFocus={true}
              keyboardType={'number-pad'}
              maxLength={this.state.maxLength}
              placeholder={this.state.placeHolder}
              style={{
                backgroundColor: Colors.white,
                color: Colors.darkGrey,
                fontSize: hp(2.5),
                fontFamily: Fonts.SourceSansRegular,
              }}
              defaultValue={this.state.answer}
            />
          </View>
        </View>
      </Fragment>
    );
  }
}
