/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  InteractionManager,
  Linking,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import Reinput from 'reinput';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
import CrossIcon from '../../../../../assets/svg/cross.svg';
import ArrowIcon from '../../../../../assets/svg/arrow_left.svg';
import {MedicationIndicator} from '../components/MedicationIndicator';

import {Step2} from '../components/AddMedicationSteps/Step2';
import {Step3} from '../components/AddMedicationSteps/Step3';
import {Step4} from '../components/AddMedicationSteps/Step4';
import {Step5} from '../components/AddMedicationSteps/Step5';
import Step1 from '../components/AddMedicationSteps/Step1';
import MedicationService from '../../../api/medication';
import Spinner from 'react-native-loading-spinner-overlay';
import {getLookUpMedication} from '../actions';
import {scheduleLocalNotification} from '../../../helpers/NotificationHandler';
import {createOrUpdateReminderForMedication} from '../../../helpers/MedicationReminderHelper';
import {convertUTCDateToLocalDate} from '../../../helpers/Common';
import {showMessage} from 'react-native-flash-message';
import {Images} from '../../../../config';

var instance = null;
global.cardIndex = 1;
class AddNewMedicationScreen extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    cardIndex = 1;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    instance = this;
    this.state = {index: 1, showLoader: false, timeOffest: 0};
  }

  componentDidMount(): void {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    this.state.timeOffest = convertUTCDateToLocalDate(
      new Date(),
    ).getTimezoneOffset();
  }

  handleBackButtonClick() {
    global.frequencyIndex = 1;
    global.timeArray = [];
    global.selectedIndex = 0;
    global.quantityIndex = 0;
    global.stopIndex = 1;
    global.date = null;
    console.log(global.selectedData);
    if (this.state.index > 1) {
      this.setState({index: this.state.index - 1});
    } else {
      this.props.navigation.pop();
    }
    return true;
  }

  renderSteps(index) {
    switch (index) {
      case 1:
        return (
          <Step1
            nextStep={this.goToNextStep}
            navigation={this.props.navigation}
          />
        );
      case 2:
        return (
          <Step3
            cardindex={global.cardIndex}
            nextStep={this.goToNextStep}
            navigation={this.props.navigation}
          />
        );
      // case 3:
      //   return <Step4 nextStep={this.goToNextStep} />;
      // case 4:
      //   return <Step5 nextStep={this.goToNextStep} />;
      // case 5:
      //   return <Step5 nextStep={this.goToNextStep} />;
    }
    console.log('index');
    console.log(index);
  }
  goToNextStep() {
    if (instance.state.index < 2) {
      instance.setState({index: instance.state.index + 1});
    }
  }
  render() {
    return (
      <Fragment>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
          }}>
          <View style={{flex: 1, backgroundColor: Colors.BgColor}}>
            <Spinner
              visible={this.state.showLoader}
              textContent={'Loading...'}
              textStyle={{color: '#FFF'}}
            />

            <View
              style={{
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%',
                backgroundColor: Colors.white,
                borderRadius: 10,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  borderRadius: 5,
                  flex: 1,
                  width: '100%',
                  //padding: hp(3),
                  alignSelf: 'center',
                  backgroundColor: Colors.BgColor,
                }}>
                <View style={{flex: 1, backgroundColor: Colors.BgColor,borderColor:'red',borderWidth:0}}>
                  {this.renderSteps(this.state.index)}
                </View>
                {this.state.index > 1 ? null : null}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
export default AddNewMedicationScreen;
