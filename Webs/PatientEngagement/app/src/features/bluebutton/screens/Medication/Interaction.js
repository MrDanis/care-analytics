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
import InteractionItem from '../component/InteractionItem';
import {configurePushNotification} from '../../../../helpers/NotificationHandler';
import Images from '../../../../../config/Images';

class Interaction extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: '',
  };

  constructor(props) {
    super(props);
    // console.log('this is the reciever of the medication design ', props);
    this.state = {
      showLoader: false,
      interaction: this.props.route.params.interactionDetails,
      interactionDetails: [],
    };
  }
  state = {
    show: true,
  };
  _panResponder = {};
  timer = 0;
  componentDidMount(): void {
    // console.log(
    //   'Interactionsss on screen',
    //   this.props.route.params.interactionDetails,
    // );
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
    this.setState({showLoader: true});
    let serviceData = {
      ndcs: this.state.interaction.ndcs,
      primaryNDC: this.state.interaction.drugCode,
      type: this.state.interaction.type,
    };
    console.log('Interaction APi data', serviceData);
    MedicationService.getInteractionHistory(serviceData)
      .then(response => {
        this.setState({showLoader: false});
        if (response) {
          if (response.statusCode === 200) {
            let interactionDetailObj = {};
            if (this.state.interaction.type == 0) {
              interactionDetailObj = response.data.drugToDrugInteractions;
            } else if (this.state.interaction.type == 1) {
              interactionDetailObj = response.data.drugToFoodInteractions;
            } else if (this.state.interaction.type == 2) {
              interactionDetailObj = response.data.drugToAllergyInteraction;
            } else if (this.state.interaction.type == 3) {
              interactionDetailObj = response.data.drugToLabInteractions;
            }
            console.log('Get Interaction Response', interactionDetailObj);

            this.setState({
              interactionDetails: interactionDetailObj,
            });
          } else {
            this.setState({
              interactionDetails: [],
            });
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getInteractionHistoryError', error);
        console.log(error);
      });
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
          width: '92%',
          backgroundColor: Colors.lightGrey,
          marginRight: hp(1),
          marginTop: hp(1),
          marginBottom: hp(1),
          alignSelf: 'center',
        }}
      />
    );
  };

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{flex: 1}}>
          <Spinner
            visible={this.state.showLoader}
            textContent={'Please Wait....'}
            textStyle={{color: '#FFF'}}
          />
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
            }}
            {...this._panResponder.panHandlers}>
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');
                this.props.navigation.goBack();
                this.resetTimer();
              }}>
              <Text
                style={{
                  fontFamily: 'WisemanPTSymbols',
                  marginLeft: heightPercentageToDP(2),
                  //   marginRight: heightPercentageToDP(1),
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
            {/*<TouchableOpacity*/}
            {/*    onPress={() => {*/}
            {/*        const shareOptions = {*/}
            {/*            title: 'Share Medicines',*/}
            {/*            message: JSON.stringify(this.props.medicationHistoryData),*/}
            {/*        };*/}
            {/*        Share.open(shareOptions)*/}
            {/*            .then(res => {*/}
            {/*                console.log(res);*/}
            {/*            })*/}
            {/*            .catch(err => {*/}
            {/*                err && console.log(err);*/}
            {/*            });*/}
            {/*    }}*/}
            {/*    style={{*/}
            {/*        alignSelf: 'center',*/}
            {/*        marginRight: hp(2),*/}
            {/*    }}>*/}
            {/*    <ShareIcon/>*/}
            {/*</TouchableOpacity>*/}
          </View>
          {Object.entries(this.state.interaction).length > 0 ? (
            <View
              style={{flex: 1, padding: hp(1), backgroundColor: 'white'}}
              {...this._panResponder.panHandlers}>
              <View
                {...this._panResponder.panHandlers}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: hp(2),
                  paddingVertical: hp(1),
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    marginLeft: hp(2),
                    marginRight: hp(1),
                    resizeMode: 'contain',
                  }}
                  source={Images.medicineListIcon}
                />
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    fontSize: hp(2.5),
                    color: Colors.black1,
                    textAlign: 'left',
                    marginHorizontal: hp(2.5),
                  }}>
                  {`${this.state.interaction.count} ${this.state.interaction.name}`}
                </Text>
              </View>
              <FlatList
                style={{margin: hp(2)}}
                data={this.state.interactionDetails}
                ItemSeparatorComponent={this.renderSeparator}
                renderItem={({item, index}) => {
                  return (
                    <InteractionItem
                      item={item}
                      action={() => {
                        this.resetTimer();
                        this.props.navigation.navigate(
                          'InteractionDetailScreen',
                          {
                            details: this.state.interactionDetails,
                            indexOfItem: index,
                            typeOfInteraction: this.state.interaction.type,
                          },
                        );
                      }}
                    />
                  );
                }}
                keyExtractor={item => item.id}
              />
            </View>
          ) : (
            this.state.showLoader === false &&
            Object.entries(this.state.interaction).length === 0 && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: hp(10),
                }}
                {...this._panResponder.panHandlers}>
                <Image
                  source={Images.emptyIcon}
                  style={{
                    alignSelf: 'center',
                    height: hp(16),
                    width: hp(18),
                  }}
                />
                <Text
                  style={{
                    fontSize: hp(2.5),
                    fontFamily: Fonts.SourceSansBold,
                    color: Colors.black4,
                    marginTop: hp(4),
                    marginRight: hp(10),
                    marginLeft: hp(10),
                    textAlign: 'center',
                  }}>
                  No records found
                </Text>
              </View>
            )
          )}
        </SafeAreaView>
      </Fragment>
    );
  }
}

export default Interaction;
