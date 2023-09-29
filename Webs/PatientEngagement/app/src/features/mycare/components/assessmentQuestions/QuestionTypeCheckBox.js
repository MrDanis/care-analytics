/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import CheckBox from 'react-native-check-box';
import {Images,Svgs} from '../../../../../config';
import {SvgCss} from 'react-native-svg';
import {Fonts} from '../../../../../config/AppConfig';
import { array } from 'prop-types';
export class QuestionTypeCheckBox extends React.PureComponent {
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.state = {
      checkedId: -1,
      checkBoxArray: props.item.options,
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
    const {SavedAnswers: answers} = props.item;
    let array = props.item.options.map(item => {
      item.isChecked = false;
      if (props.item.savedAnswers.length > 0) {
        if (props.item.savedAnswers.indexOf(item.text) > -1) {
          item.isChecked = true;
        }
      }
      return item;
    });
    this.setState({checkBoxArray: new Array(...array)});
  }

  /* istanbul ignore next */
  UNSAFE_componentWillReceiveProps(
    nextProps: Readonly<P>,
    nextContext: any,
  ): void {
    // console.log('checkBoxArray.item');
    // console.log(nextProps.item);
    let array = nextProps.item.options.map(item => {
      item.isChecked = false;
      const {SavedAnswers: answers} = nextProps.item;
      if (nextProps.item.savedAnswers.length > 0) {
        if (nextProps.item.savedAnswers.indexOf(item.text) > -1) {
          item.isChecked = true;
        }
      }
      return item;
    });
    this.setState({checkBoxArray: new Array(...array)});
  }
  /* istanbul ignore next */
  componentDidMount(): void {}
  /* istanbul ignore next */
  saveAnswer() {
    //getting checked listed
    let checkedItems = this.state.checkBoxArray.filter(item => {
      return item.isChecked;
    });

    let answers = checkedItems.map(item => {
      return item.text;
    });

    this.props.onAnswer(answers);
  }
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        {/*<View style={{flex: 1}}>*/}
        <View
          style={{
            marginTop: hp(1),
            marginBottom: hp(2),
            marginLeft: hp(3),
            marginRight: hp(3),
            backgroundColor: Colors.backgroundMainLogin,
          }}>
          {this.state.checkBoxArray.length
            ? this.state.checkBoxArray.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{
                      backgroundColor: item.isChecked
                        ? Colors.blueTextColor
                        : Colors.white,
                      borderRadius: 5,
                      // borderWidth: 1,
                      borderColor: Colors.line,
                      paddingVertical: hp(2),
                      marginTop: hp(1),
                      flexDirection: 'row',
                      justifyItems: 'flex-start',
                      alignItems: 'center',
                      flex: 1,
                      borderRadius: 4,
                      shadowOffset: {width: 0.5, height: 0.5},
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                    onPress={() => {
                      let array = this.state.checkBoxArray;
                      array[index].isChecked = !item.isChecked;
                      this.setState({checkBoxArray: new Array(...array)});
                      this.saveAnswer();
                    }}>
                    <View style={{borderColor:'red',borderWidth:0,marginLeft:hp(1.5)}}>
                         {item.isChecked? <SvgCss
                         xml={Svgs.checkedCheckBox}
                         width={hp(2.5)}
                         height={hp(2.5)}
                        />: 
                        <SvgCss
                        xml={Svgs.unCheckedCheckBox}
                        width={hp(1.75)}
                        height={hp(1.75)}
                        />
                        }
                    </View>
                      
                   
                    <Text
                      style={{
                        marginLeft: hp(2),
                        fontSize: hp(2.5),
                        fontFamily: Fonts.SourceSansRegular,
                        color: item.isChecked ? Colors.white : Colors.heading,
                        flex: 1,
                        marginRight: hp(0.3),
                      }}
                      // numberOfLines={2}
                      ellipsizeMode="tail">
                      {item.text}
                    </Text>
                    {/*<CheckBox*/}
                    {/*  style={{*/}
                    {/*    flex: 1,*/}
                    {/*    paddingVertical: hp(1),*/}
                    {/*    backgroundColor: 'red',*/}
                    {/*    alignItems:'center' ,*/}
                    {/*    justifyContent:'flex-start'*/}
                    {/*  }}*/}
                    {/*  onClick={() => {*/}
                    {/*    let array = this.state.checkBoxArray;*/}
                    {/*    array[index].isChecked = !item.isChecked;*/}
                    {/*    this.setState({checkBoxArray: new Array(...array)});*/}
                    {/*    this.saveAnswer();*/}
                    {/*  }}*/}
                    {/*  isChecked={item.isChecked}*/}
                    {/*  rightText={item.text}*/}
                    {/*  rightTextStyle={{*/}
                    {/*    fontSize: hp(2.5),*/}
                    {/*    color: item.isChecked ? Colors.white : Colors.heading,*/}
                    {/*    fontFamily: 'Roboto-Regular',*/}
                    {/*    textAlign:'left',*/}
                    {/*  }}*/}
                    {/*  checkedImage={*/}
                    {/*    <Image*/}
                    {/*      source={Images.checkedImage}*/}
                    {/*      style={{width: hp(4), height: hp(4)}}*/}
                    {/*    />*/}
                    {/*  }*/}
                    {/*  unCheckedImage={*/}
                    {/*    <Image*/}
                    {/*      source={Images.unCheckedImage}*/}
                    {/*      style={{width: hp(4), height: hp(4)}}*/}
                    {/*    />*/}
                    {/*  }*/}
                    {/*/>*/}
                  </TouchableOpacity>
                );
              })
            : null}
        </View>
        {/*</View>*/}
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  checkBoxText: {
    fontSize: hp(3),
    color: Colors.heading,
    fontFamily: Fonts.SourceSansRegular,
  },
});
