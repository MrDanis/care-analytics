/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import Colors from '../../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RadioButtonRN from 'radio-buttons-react-native';
import {Fonts} from '../../../../../config/AppConfig';
import {Images,Svgs} from '../../../../../config';
import {SvgCss} from 'react-native-svg';
export class QuestionTypeRadio extends React.PureComponent {
  /* istanbul ignore next */
  options = [];
  /* istanbul ignore next */
  selectedIndex = -1;
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
    let array = [];
    props.item.options.map(row => {
      let object = {label: row.text};
      array.push(object);
    });
    this.options = array;
    const {SavedAnswers: answers} = props.item;
    if (props.item.savedAnswers.length > 0) {
      const selectedAnswer = props.item.savedAnswers[0];
      this.selectedIndex = props.item.options.findIndex(item => {
        return item.text === selectedAnswer;
      });
    }
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    let array = [];
    this.props.item.options.map(row => {
      let object = {label: row.text};
      array.push(object);
    });
    this.options = array;
    console.log('Optionsss', array);
    const {SavedAnswers: answers} = this.props.item;
    if (this.props.item.savedAnswers.length > 0) {
      const selectedAnswer = this.props.item.savedAnswers[0];
      this.selectedIndex = this.props.item.options.findIndex(item => {
        return item.text === selectedAnswer;
      });
      this.setState({});
    }
  }
  /* istanbul ignore next */
  onValueSelected = callBack => {
    console.log('Obj on ValueChanges', callBack());
    // const {label} = obj;
    // this.props.onAnswer([label]);
  };
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        <View style={{flex: 1, marginBottom: hp(5)}}>
          <View
            style={{
              marginTop: hp(3),
              marginLeft: hp(3),
              marginRight: hp(3),
            }}>
            {this.options.length &&
              this.options.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        this.selectedIndex === index
                          ? Colors.blueTextColor
                          : Colors.white,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: Colors.line,
                      paddingVertical: hp(2),
                      marginTop: hp(1),
                      flexDirection: 'row',
                      justifyItems: 'flex-start',
                      alignItems: 'center',
                      flex: 1,
                    }}
                    onPress={() => {
                      // this.selectedIndex = this.options.findIndex((item, index) => {
                      //    if(item.label === item.label){
                      //      return index;
                      //   }
                      // });
                      this.props.onAnswer([item.label]);
                      this.selectedIndex = index;
                      this.setState({selectedIndex: index});
                      console.log('Selected Index', this.selectedIndex);
                      console.log('Item Index', index);
                    }}>
                    {/* <Text
                      style={{
                        marginLeft: hp(2),
                        fontSize: hp(2.5),
                        fontFamily: Fonts.SourceSansRegular,
                        color:
                          this.selectedIndex === index
                            ? Colors.white
                            : Colors.blueGrayDisableText,
                      }}>
                      {this.state.dictionary[index] + '.'+ this.selectedIndex+' '+ index}
                     
                    </Text> */}
                     {(this.selectedIndex !== index)?
                       <SvgCss
                       xml={Svgs.unSeletedRadioButton}
                       width={hp(3)}
                       height={hp(3)}
                       style={{marginLeft: hp(2)}}
                       />:<SvgCss
                       xml={Svgs.selectedRadioButton}
                       width={hp(3)}
                       height={hp(3)}
                       style={{marginLeft: hp(2)}}
                       />
                    }
                    
                    <Text
                      style={{
                        marginLeft: hp(2),
                        fontSize: hp(2.5),
                        fontFamily: Fonts.SourceSansRegular,
                        color:
                          this.selectedIndex === index
                            ? Colors.white
                            : Colors.heading,
                        flex: 1,
                        marginRight: hp(0.3),
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

            {/*    */}
            {/*<RadioButtonRN*/}
            {/*  data={this.options}*/}
            {/*  initial={this.selectedIndex + 1}*/}
            {/*  duration={0}*/}
            {/*  box={true}*/}
            {/*  circleSize={0}*/}
            {/*  textStyle={{*/}
            {/*    fontSize: hp(2.5),*/}
            {/*    color: Colors.darkGrey,*/}
            {/*    fontFamily: 'Roboto-Medium',*/}
            {/*  }}*/}
            {/*  icon={Images.arrowLeft}*/}
            {/*  style={{paddingTop: 20}}*/}
            {/*  deactiveColor={Colors.lightGrey1}*/}
            {/*  activeColor={Colors.assessment_blue_500}*/}
            {/*  boxDeactiveBgColor={Colors.white}*/}
            {/*  boxStyle={{borderWidth: 2}}*/}
            {/*  boxActiveBgColor={Colors.assessment_blue_100}*/}
            {/*  textColor={Colors.white}*/}
            {/*  selectedBtn={this.onValueSelected}*/}
            {/*/>*/}
          </View>
        </View>
      </Fragment>
    );
  }
}
