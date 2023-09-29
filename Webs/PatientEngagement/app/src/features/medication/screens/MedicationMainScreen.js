/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  RefreshControl,
  StatusBar,
  BackHandler,
  Image,
  SafeAreaView,
} from 'react-native';
import {NoMedication} from '../components/NoMedication';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';
import {MedicationTargetCompleted} from '../components/MedicationTargetCompleted';
import {Fonts} from '../../../../config/AppConfig';
import PillIcon from '../../../../../assets/svg/icon_pill.svg';
import TrendsIcon from '../../../../../assets/svg/icon_trends.svg';
import MedicationService from '../../../api/medication';
import {convertUTCDateToLocalDate, getDayTime} from '../../../helpers/Common';
import {DayTime} from '../constants';
import Spinner from 'react-native-loading-spinner-overlay';
import MedicationDashboard from '../components/MedicationDashboard';
import ShareIcon from '../../../../../assets/svg/icon_share.svg';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import images from '../../../../../app/config/Images';
import {
  getLookUpMedication,
  getTodayMedication,
  getUserLocation,
} from '../actions';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {connect} from 'react-redux';
import MainHeader from '../../mycare/components/MainHeader';
var instance = null;
class MedicationMainScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {dataArray: [], refreshing: false};
  }

  componentDidMount(): void {
    instance = this;
    instance.onAddNewButtonPress.bind(this);
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        console.log('come here to foucs');
        this.getTodayMedicationData();
        // BackHandler.addEventListener(
        //   'hardwareBackPress',
        //   this.handleBackButtonClick,
        // );
      },
    );
  }

  // handleBackButtonClick() {
  //   this.props.navigation.pop();
  //   return true;
  // }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
    if (
      prevProps.allTodayMedicationData.length !==
      this.props.allTodayMedicationData.length
    ) {
      this.props.dispatch(
        getTodayMedication(this.props.allTodayMedicationData),
      );
      this.setState({
        dataArray: this.props.allTodayMedicationData,
      });
    }
  }

  // componentWillUnmount(): void {
  //   this.willFocusSubscription.remove();
  // }

  getTodayMedicationData() {
    this.setState({showLoader: true});
    MedicationService.getTodayMedication()
      .then(response => {
        this.setState({showLoader: false});
        console.log('getTodayMedication');
        console.log(JSON.stringify(response));
        console.log('medicine length', JSON.stringify(response.data.length));
        if (
          response &&
          response.statusCode === 200 &&
          response.data.length > 0
        ) {
          this.setState({showLoader: false});
          this.props.dispatch(getTodayMedication(response.data));
          this.setState({
            dataArray: response.data,
          });
        } else {
          this.setState({showLoader: false});
          this.props.dispatch(getTodayMedication([]));
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({showLoader: false});
      });
  }

  /* istanbul ignore next */
  onAddNewButtonPress() {
    global.selectedData = null;
    this.props.navigation.navigate('AddNewMedication');
  }
  _onRefresh = () => {
    this.getTodayMedicationData();
  };
  render() {
    return (
      <Fragment>
        <Spinner
          visible={this.state.showLoader}
          textContent={'Loading....'}
          textStyle={{color: '#FFF'}}
        />
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.BgColor}}>
          <MainHeader name={'Medication'} navigation={this.props.navigation}>
            <MedicationDashboard
              myProps={this.props}
              todayMedication={() => this.getTodayMedicationData()}
            />
          </MainHeader>
        </SafeAreaView>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({
  allTodayMedicationData,
  homeApiData,
  modalHandler,
}) => ({
  allTodayMedicationData,
  homeApiData,
  modalHandler,
});
export default connect(mapStateToProps)(MedicationMainScreen);
