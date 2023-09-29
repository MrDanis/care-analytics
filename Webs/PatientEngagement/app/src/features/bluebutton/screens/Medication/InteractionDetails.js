/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  PanResponder,
} from 'react-native';
import {Colors} from '../../../../../config';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Fonts} from '../../../../../config/AppConfig';
import ShareIcon from '../../../../../../assets/svg/icon_share.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import Share from 'react-native-share';
import MedicationService from '../../../../api/medication';
import InteractionDetailItem from '../component/InteractionDetailItem';
import InteractionIcon from '../../../../../../assets/svg/interaction.svg';
import Collapsible from 'react-native-collapsible';
import Images from '../../../../../config/Images';
import InteractionItem from '../component/InteractionItem';

class InteractionDetails extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    // console.log('=========== tihs is the second detail', props);
    this.state = {
      showLoader: false,
      interactionDetails: this.props.route.params.details,
      rowDetails:
        this.props.route.params.details[this.props.route.params.indexOfItem]
          .interactions,
      indexOfItem: this.props.route.params.indexOfItem,
      typeOfInteraction: this.props.route.params.typeOfInteraction,
    };
  }

  componentDidMount(): void {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        this.resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (gesture?.moveX > gesture?.moveY) {
          this.resetTimer();
          return false;
        }
        this.resetTimer();
        return true;
      },
      onStartShouldSetPanResponderCapture: () => {
        this.resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  resetTimer() {
    console.log('====================================');
    console.log('reset');
    console.log('====================================');
    clearTimeout(this.timer);
    if (this.state.show) {
      this.setState({show: false});
    }
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  componentWillMount(): void {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        this.resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: (_, gesture) => {
        if (gesture?.moveX > gesture?.moveY) {
          this.resetTimer();
          return false;
        }
        this.resetTimer();
        return true;
      },
      onStartShouldSetPanResponderCapture: () => {
        this.resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
    this.timer = setTimeout(
      () => this.setState({show: true}),
      this.state.timeNoAction,
    );
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: Colors.lightGrey,
          marginLeft: hp(2),
          marginRight: hp(2),
          marginTop: hp(1),
          marginBottom: hp(1),
        }}
      />
    );
  };
  state = {
    show: true,
  };
  _panResponder = {};
  timer = 0;

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
          {/*<LinearGradient*/}
          {/*  colors={['#E0E0E0', '#FFFFFF']}*/}
          {/*  style={{flex: 1, backgroundColor:Colors.medicalHistoryBg}}>*/}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              height: hp(7.5),
              borderBottomWidth: 1,
              borderColor: Colors.line,
              // marginBottom: hp(2),
              backgroundColor: Colors.white,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
                this.resetTimer();
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
                fontFamily: Fonts.SourceSansSemibold,
                textAlign: 'center',
                fontSize: hp(2.5),
                color: Colors.black1,
                flex: 0.85,
              }}>
              Interaction(s)
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'column',
              margin: hp(1),
            }}
            {...this._panResponder.panHandlers}>
            <Image
              style={{
                width: 70,
                height: 70,
                marginLeft: hp(2),
                marginRight: hp(1),
                marginTop: hp(2),
                resizeMode: 'contain',
              }}
              source={Images.medicineListIcon}
            />
            <Text
              style={{
                fontFamily: Fonts.SourceSansBold,
                fontSize: hp(3),
                paddingVertical: hp(2),
                color: Colors.black,
                textAlign: 'center',
                textTransform: 'capitalize',
              }}>
              {
                this.state.interactionDetails[this.state.indexOfItem]
                  .interactionOneName
              }
            </Text>
            <InteractionIcon style={{marginHorizontal: hp(1)}} />
            <Text
              style={{
                fontFamily: Fonts.SourceSansBold,
                paddingVertical: hp(2),
                fontSize: hp(3),
                color: Colors.black,
                textAlign: 'center',
                textTransform: 'capitalize',
              }}>
              {
                this.state.interactionDetails[this.state.indexOfItem]
                  .interactionTwoName
              }
            </Text>
          </View>
          <FlatList
            style={{margin: hp(2), flex: 1}}
            data={this.state.rowDetails}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={({item, index}) => {
              return (
                <InteractionDetailItem
                  item={item}
                  index={index + 1}
                  typeOfInteraction={this.state.typeOfInteraction}
                  action={() => this.resetTimer()}
                />
              );
            }}
            keyExtractor={item => item.id}
          />
          {/*</LinearGradient>*/}
        </SafeAreaView>
      </Fragment>
    );
  }
}

export default InteractionDetails;
