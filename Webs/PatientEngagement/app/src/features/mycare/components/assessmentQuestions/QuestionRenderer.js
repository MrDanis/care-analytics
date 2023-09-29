/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, TextInput, View} from 'react-native';
import {QuestionTypeRadio} from './QuestionTypeRadio';
import {QuestionTypeCheckBox} from './QuestionTypeCheckBox';
import {QuestionTypeEditText} from './QuestionTypeEditText';
import {QuestionTypeDateTime} from './QuestionTypeDateTime';
import {QuestionTypeDropDown} from './QuestionTypeDropDown';
import {Fonts, QuestionType} from '../../../../../config/AppConfig';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import {QuestionTypeYesNo} from './QuestionTypeYesNo';
import {ScrollView} from 'react-native-gesture-handler';
import {QuestionTypeNumber} from './QuestionTypeNumber';

export class QuestionRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  /* istanbul ignore next */
  showControlBox(data) {
    console.log('Type of the question randred is : ',data?.type);
    switch (data.type) {
      case QuestionType.RADIO:
        return (
          <QuestionTypeRadio
            key={this.props.key}
            item={data}
            onAnswer={this.props.onAnswer}
          />
        );
      case QuestionType.CHECKBOX:
        return (
          <QuestionTypeCheckBox
            key={this.props.key}
            item={data}
            onAnswer={this.props.onAnswer}
          />
        );
      case QuestionType.DROPDOWN:
        return (
          // <QuestionTypeRadio
          //   key={this.props.key}
          //   item={data}
          //   onAnswer={this.props.onAnswer}
          // />
          
          
          <QuestionTypeDropDown
            key={this.props.key}
            item={data}
            onAnswer={this.props.onAnswer}
          />
          
        );
      case QuestionType.TEXT:
      case QuestionType.MULTILINE:
        return (
          <QuestionTypeEditText
            key={this.props.key}
            item={data}
            onAnswer={this.props.onAnswer}
          />
        );
      case QuestionType.DATETIME:
        return (
          <QuestionTypeDateTime
            key={this.props.key}
            item={data}
            mode={'datetime'}
            onAnswer={this.props.onAnswer}
          />
        );
      case QuestionType.DATE:
        return (
          <QuestionTypeDateTime
            key={this.props.key}
            item={data}
            mode={'date'}
            onAnswer={this.props.onAnswer}
          />
        );
      case QuestionType.YESNO:
        return (
          <QuestionTypeRadio 
          key={this.props.key}  
          item={data}
          onAnswer={this.props.onAnswer}/>
          // <QuestionTypeYesNo
          //   key={this.props.key}
          //   item={data}
          //   onAnswer={this.props.onAnswer}
          // />
        );
      case QuestionType.NUMBER:
        return (
          <QuestionTypeNumber
            key={this.props.key}
            item={data}
            onAnswer={this.props.onAnswer}
          />
        );
      default:
        return <QuestionTypeRadio item={data} onAnswer={this.props.onAnswer} />;
    }
  }
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        <ScrollView>
          {/* <View style={{flexDirection: 'column', paddingHorizontal: hp(2)}}>
            {this.props.question.parentQuestionId != 0 && (
              <Text
                style={{
                  fontSize: hp(2.2),
                  marginRight: hp(5),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.fontGrey,
                }}>
                {`${this.props.question.parentQuestion.questionText} (${this.props.question.parentAnswer})`}
              </Text>
            )}
          </View> */}

          <View style={{flexDirection: 'row', paddingHorizontal: hp(2)}}>
            {this.props.question.isRequired && (
              <Text
                style={{
                  fontSize: hp(3),
                  marginRight: hp(1),
                  fontFamily: Fonts.SourceSansSemibold,
                  color: Colors.red,
                }}>
                {'*'}
              </Text>
            )}
            <Text
              style={{
                fontSize: hp(2.5),
                marginRight: hp(5),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.heading,
              }}>
              {this.props.question.questionText}
            </Text>
          </View>
          <View style={{flex: 1, marginTop: 10}}>
            {this.showControlBox(this.props.question)}
          </View>
        </ScrollView>
      </Fragment>
    );
  }
}
