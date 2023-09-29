/* istanbul ignore file */
import React, {Fragment} from 'react';
import {Text, TextInput, View,TouchableOpacity} from 'react-native';
import Colors from '../../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';
import {NavigationEvents} from 'react-navigation';
import {Fonts} from "../../../../../config/AppConfig";
import DropDownPicker from "react-native-dropdown-picker";
import {Images} from "../../../../../config";
export class QuestionTypeDropDown extends React.PureComponent {
  /* istanbul ignore next */
  options = [];
  /* istanbul ignore next */
  selectedValue = '';
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.dropdownRef = React.createRef();
    // console.log('props.item');
    // console.log(props.item);
    this.state = {selectedValue: '', open: false , isSelected:false};
    let array = [];
    props.item.options.map(row => {
      let object = {label: row.text, value: row.text};
      array.push(object);
    });
    this.options = array;
    const {SavedAnswers: answers} = props.item;
    if (props.item.savedAnswers.length > 0) {
      console.log(props.item.savedAnswers[0]);
      this.selectedValue = props.item.savedAnswers[0];
      this.setState({selectedValue: props.item.savedAnswers[0]});
    }
  }
  /* istanbul ignore next */
  onValueSelected = (value, index, data) => {
    
    this.props.onAnswer([value]);
    this.setState({selectedValue : value})
  };
  setValue = (callback) => {
    console.log('setValue', typeof callback);
    if(typeof callback === 'function')
    { 
    const value = callback()
    this.props.onAnswer([value]);
    console.log('Value we get before saving the value : ',value);
    this.selectedValue= value
    this.setState({ selectedValue: value })
    }
    else
    {
      // const value = callback()
      let selectedAnswer = [callback];
      console.log('Value we get before saving the value : ',selectedAnswer)
      this.props.onAnswer(selectedAnswer);
      this.selectedValue= callback
      this.setState({ selectedValue: callback })
      this.setOpen();
    }
    // const value = callback()
    // this.props.onAnswer([value]);
    // console.log('Value we get before saving the value : ',value);
    // this.selectedValue= value
    // this.setState({ selectedValue: value })
  }
  /* istanbul ignore next */
  UNSAFE_componentWillReceiveProps(
    nextProps: Readonly<P>,
    nextContext: any,
  ): void {
    // console.log('nextProps.item');
    // console.log(nextProps.item);
    let array = [];
    nextProps.item.options.map(row => {
      console.log('Row for the last one is : ',row);
      // Change by danish because the assesment is showing the ids in the dropdowns 
      // let object = {label: row.id, value: row.text};
      let object = {label: row.text, value: row.text};
      // Change by danish because the assesment is showing the ids in the dropdowns 
      array.push(object);
    });
    this.options = array;
    const {SavedAnswers: answers} = nextProps.item;
    if (nextProps.item.savedAnswers.length > 0) {
      this.selectedValue = nextProps.item.savedAnswers[0];
      this.setState({selectedValue: nextProps.item.savedAnswers[0]});
    }
  }
  componentDidMount(): void {
  }
  // renderCustomLabel(item){
  //   <View style={{flex: 1, padding: 8}}>
  //   <Text style={{fontSize: 16,color: 'blue',}}>{item?.label}</Text>
  // </View>
  // }
  setOpen(){
    this.setState({open: !this.state.open});
  };
  handleSelectedPress(value){
    // if (this.dropdownRef.current) {
    // console.log('Here in the ref if ',this.dropdownRef);
    // }
    this.setValue(value)
   console.log('Comming from the dropdown icon is : ',value);
    // this.setState({isSelected:false});
  }
  /* istanbul ignore next */
  render() {
    console.log('Options', this.options)
    return (
      <Fragment>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: hp(3),
              marginLeft: hp(3),
              marginRight: hp(3),
            }}>
            {/*<Dropdown*/}
            {/*  label="Choose"*/}
            {/*  icon={Images.downArrowIcon}*/}
            {/*  iconColor= { Colors.regularLabel}*/}
            {/*  value={this.selectedValue}*/}
            {/*  data={this.options}*/}
            {/*  fontSize={18}*/}
            {/*  animationDuration={0}*/}
            {/*  textColor={Colors.darkGrey}*/}
            {/*  // containerStyle={{margin: hp(4)}}*/}
            {/*  onChangeText={this.onValueSelected}*/}
            {/*  baseColor={'transparent'}*/}
            {/*  overlayStyle={{*/}
            {/*        borderRadius: 8,*/}
            {/*        marginTop: hp(6),*/}
            {/*        borderColor: Colors.line,*/}
            {/*        paddingHorizontal: hp(6),*/}
            {/*    // backgroundColor:'red',*/}
            {/*    width:'90%',*/}
            {/*    alignItems:'center',*/}
            {/*    justifyItems:'center'*/}
            {/*      }}*/}
            {/*  inputContainerStyle={{ borderBottomColor: Colors.line, borderBottomWidth: 1 }}*/}
            {/*/>*/}
            <DropDownPicker
                // defaultIndex={0}
                // setValue={value =>
                // {
                  //   console.log('Value on set' , value)
                  //   this.setState({selectedValue : value})
                  //
                  // }}
                
                open={this.state.open}
                items={this.options}
                value={this.selectedValue}
                setValue={this.setValue}
                containerStyle={{height: 200}}
                setOpen={()=>this.setState({open: !this.state.open})}
                defaultValue={this.selectedValue}
                placeholder="Choose"
                placeholderStyle={{
                  color: Colors.label,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                }}
                textStyle={{
                  color: Colors.black,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                }}
                style={{
                  borderRadius: 8,
                  marginTop: hp(0.2),
                  borderColor: Colors.line,
                  paddingHorizontal: hp(2),
                }} 
                controller={(instance) => (this.dropdownRef.current = instance)} 
                renderListItem={(props)=> {
                  return (
                    <TouchableOpacity onPress={()=>{this.handleSelectedPress(props.label)}}>
                      <View style={{borderWidth:0,borderColor:'red',paddingLeft:hp(2),paddingVertical:hp(1),overflow:'visible'}}>
                        <Text 
                        style={{ color: Colors.black,
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: hp(2)}}>
                          {props.label}
                          {console.log('Props are : ',props)}</Text>
                      </View>     
                    </TouchableOpacity>
                  )
                }}
                
                
                // dropDownDirection="BOTTOM"
                // showTickIcon={isSelected}
                // =listIte
                //labelStyle={{color:'green'}}
                // customLabelRenderer={this.renderCustomLabel}
                // labelProps={{
                //   numberOfLines:2
                // }}
                // itemProps={{
                //  style:{}
                // }}        
                // listMessageTextStyle={{coloe:'red'}}  
                // labelStyle={{coloe:'red'}}
               
            />
          </View>
        </View>
      </Fragment>
    );
  }
}
