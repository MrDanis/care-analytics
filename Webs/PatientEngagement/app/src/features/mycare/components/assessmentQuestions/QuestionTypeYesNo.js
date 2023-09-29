/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RadioButtonRN from 'radio-buttons-react-native';
import CardView from 'react-native-cardview';
import {SvgCrossIcon, SvgTickIcon, SvgWhiteTickIcon} from '../../constants';
import {Fonts} from '../../../../../config/AppConfig';
export class QuestionTypeYesNo extends React.PureComponent {
  /* istanbul ignore next */
  options = [];
  /* istanbul ignore next */
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      dictionary: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],
    };
    console.log(props.item);
    // let array = [];
    // props.item.Options.map(row => {
    //   let object = {label: row.Text};
    //   array.push(object);
    // });
    // this.options = array;
    // const {SavedAnswers: answers} = props.item;
    // if (answers.length > 0) {
    //   const selectedAnswer = answers[0];
    //   this.selectedIndex = props.item.Options.findIndex(item => {
    //     return item.Text === selectedAnswer;
    //   });
    // }
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    const {SavedAnswers: answers} = this.props.item;
    if (
      this.props.item.savedAnswers.length > 0 &&
      this.props.item.options.length
    ) {
      const selectedAnswer = this.props.item.savedAnswers[0];
      console.log('selectedAnswer');
      console.log(selectedAnswer);
      if (
        this.props.item.options[0].state === false &&
        this.props.item.options[0].text === selectedAnswer
      ) {
        this.setState({selectedIndex: 0}, () => {
          console.log('selectedIndex');
          console.log(this.state.selectedIndex);
        });
      } else if (
        this.props.item.options[1].state === false &&
        this.props.item.options[1].text === selectedAnswer
      ) {
        this.setState({selectedIndex: 0}, () => {
          console.log('selectedIndex');
          console.log(this.state.selectedIndex);
        });
      } else if (
        this.props.item.options[0].state === true &&
        this.props.item.options[0].text === selectedAnswer
      ) {
        this.setState({selectedIndex: 1}, () => {
          console.log('selectedIndex');
          console.log(this.state.selectedIndex);
        });
      } else if (
        this.props.item.options[1].state === true &&
        this.props.item.options[1].text === selectedAnswer
      ) {
        this.setState({selectedIndex: 1}, () => {
          console.log('selectedIndex');
          console.log(this.state.selectedIndex);
        });
      }
    }
    console.log('selectedIndex');
    console.log(this.state.selectedIndex);
  }
  /* istanbul ignore next */
  onValueSelected = obj => {
    const {label} = obj;
    this.props.onAnswer([label]);
  };
  renderNo(text) {
    return (
      <TouchableOpacity
        style={{
          marginLeft: hp(2),
          marginVertical: hp(1),
          flex: 1,
          width: '90%',
          // borderWidth: 1,
          borderColor: Colors.noRecordFound,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor:
            this.state.selectedIndex === 0
              ? Colors.blueTextColor
              : Colors.white,
          borderRadius: 4,
          shadowOffset: {width: 0.5, height: 0.5},
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
        onPress={() => {
          this.setState({selectedIndex: 0});
          this.props.onAnswer([text]);
        }}>
        <Text
          style={{
            fontSize: hp(3),
            alignSelf: 'flex-start',
            fontFamily: Fonts.SourceSansRegular,
            color:
              this.state.selectedIndex === 0
                ? Colors.white
                : Colors.blueGrayDisableText,
            marginLeft: hp(2),
            marginVertical: hp(1),
          }}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
  renderYes(text) {
    return (
      <TouchableOpacity
        style={{
          marginLeft: hp(2),
          marginVertical: hp(1),
          flex: 1,
          width: '90%',
          // borderWidth: 1,
          borderColor: Colors.noRecordFound,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor:
            this.state.selectedIndex === 1
              ? Colors.blueTextColor
              : Colors.white,
          borderRadius: 4,
          shadowOffset: {width: 0.5, height: 0.5},
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
        onPress={() => {
          this.setState({selectedIndex: 1});
          this.props.onAnswer([text]);
        }}>
        <Text
          style={{
            fontSize: hp(3),
            alignSelf: 'flex-start',
            fontFamily: Fonts.SourceSansRegular,
            color:
              this.state.selectedIndex === 1
                ? Colors.white
                : Colors.blueGrayDisableText,
            marginLeft: hp(2),
            marginVertical: hp(1),
          }}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        <View style={{flex: 1}}>
          {this.props.item.options && this.props.item.options.length ? (
            <View
              style={{
                marginTop: hp(3),
                marginBottom: hp(1),
                marginRight: hp(1.5),
                alignItems: 'center',
                justifyContent: 'space-between',
                // flexDirection: 'row',
              }}>
              {this.props.item.options[0].state === false
                ? this.renderNo(this.props.item.options[0].text)
                : this.renderYes(this.props.item.options[0].text)}
              {this.props.item.options[1].state === false
                ? this.renderNo(this.props.item.options[1].text)
                : this.renderYes(this.props.item.options[1].text)}
            </View>
          ) : null}
        </View>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const styles = StyleSheet.create({
  activeCrossStyle: {
    backgroundColor: Colors.white,
    height: hp(26),
    borderRadius: 13,
    borderWidth: 1,
    elevation: 5,
    borderColor: Colors.assessment_red,
  },
  inActiveCrossStyle: {
    borderRadius: 13,
    elevation: 5,
    backgroundColor: Colors.white,
    height: hp(26),
  },
  activeTickStyle: {
    backgroundColor: Colors.white,
    height: hp(26),
    borderRadius: 13,
    borderWidth: 1,
    elevation: 5,
    borderColor: Colors.assessment_blue_500,
  },
  inActiveTickStyle: {
    backgroundColor: Colors.white,
    height: hp(26),
    borderRadius: 13,
    elevation: 5,
  },
});
