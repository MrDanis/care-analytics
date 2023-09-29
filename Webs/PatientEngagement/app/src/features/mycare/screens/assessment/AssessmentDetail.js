import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
  BackHandler,
  Image,
} from 'react-native';
import Colors from '../../../../../config/Colors';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import AssessmentService from '../../../../api/assesment';
import {SafeAreaView} from 'react-navigation';
// import {getAssessmentDetailData} from '../actions';
import {connect} from 'react-redux';
import {CustomProgressBar} from '../../components/CustomProgressBar';
import {QuestionRenderer} from '../../components/assessmentQuestions/QuestionRenderer';
import {AssessmentNavigator} from '../../../../helpers/Assessment/AssessmentNavigator';
import {showMessage} from 'react-native-flash-message';
import {
  OfflineAssessment,
  retrieveItem,
  storeItem,
} from '../../../../helpers/LocalStorage';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import SeriousCondition from '../../../../../../assets/svg/seriousCondition.svg';
import {Fonts} from '../../../../../config/AppConfig';
import {Modalize} from 'react-native-modalize';
import MedTakenIcon from '../../../../../../assets/svg/takenMedIcon.svg';
import Images from '../../../../../config/Images';
import VitalsHeader from '../../components/VitalsHeader';
import MainHeader from '../../components/MainHeader';
import HeaderAssessment from '../../components/HeaderAssessment';
import {modalHanlder} from '../../../medication/actions';
// import {SvgWhiteTickIcon} from '../constants';
export var finalAssessmentData = null;
class AssessmentDetail extends React.PureComponent {
  /* istanbul ignore next */
  
  navigator: AssessmentNavigator = null;
  static navigationOptions = ({navigation}) => ({
    // title: (navigation.state.params || {}).title || 'Chat! ',
    header: null,
  });
  
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      item: {},
      rootData: [],
      showLoader: false,
      itemData: null,
      selectedIndex: 0,
      currentQuestion: null,
      surveyDetailObj: null,
      fromSummary: false,
      fromPending: false,
      isButtonColor: false,
      buttonText: 'Next',
      modalVisible: false,
      formSubId: 0,
      headerTitle: '',
    };
  }
  /* istanbul ignore next */
  setSelectedIndex(index) {
    this.setState({selectedIndex: index});
  }
  /* istanbul ignore next */
  handleBackButtonClick() {
    if (this.state.fromSummary === true) {
      this.props.navigation.navigate('AssessmentStack');
    } else {
      this.props.navigation.goBack();
    }
    return true;
  }

  /* istanbul ignore next */
  componentDidMount(): void {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  /* istanbul ignore next */
  componentWillUnmount(): void {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  /* istanbul ignore next */
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  componentDidMount(): void {
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        let {route} = this.props;
        let {fromSummary, dataObj, index, fromPending, itemData, title} =
          route.params;
        if (fromSummary) {
          console.log('come here');
          console.log(dataObj);
          console.log('dataObj');
          console.log('index');
          console.log(index);
          this.setUpCurrentQuestion(dataObj, index);
        } else {
          // this.getAssessmentDetailData(itemData, index);
        }
        console.log('itemData123');
        console.log(itemData);
        this.setState({
          fromSummary: fromSummary,
          selectedIndex: index,
          fromPending: fromPending,
          itemData: itemData,
          formSubId: itemData.formSubId,
          headerTitle: title,
        });
        this.setState({itemData: itemData, formSubId: itemData.formSubId});
        this.getAssessmentDetailData(itemData, 0);
      },
    );
    // const {itemData} = this.props.navigation.state.params;
  }
  /* istanbul ignore next */
  getAssessmentDetailData(itemData, index) {
    this.setState({showLoader: true});
    AssessmentService.getAssessmentsDetails(itemData)
      .then(res => {
        console.log('Server-Response', JSON.stringify(res));
        this.setState({showLoader: false});
        console.log('Server-index', index);
        this.setUpCurrentQuestion(res, 0);
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('error data');
        console.log(error);
        showMessage({
          message: 'Information',
          description: error.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  /* istanbul ignore next */
  setUpCurrentQuestion(surveyObj, index) {
    this.navigator = new AssessmentNavigator(surveyObj.data);
    let question = this.navigator.currentQuestion(index);
    console.log('this.navigator.currentQuestion(index)', question);
    console.log('setUpCurrentQuestion', surveyObj.data);
    this.setState({surveyDetailObj: surveyObj.data, currentQuestion: question});
  }
  /* istanbul ignore next */
  setupNavigator(surveyObj) {
    this.navigator = new AssessmentNavigator(surveyObj);
    let question = this.navigator.start();
    this.setState({surveyDetailObj: surveyObj, currentQuestion: question});
  }
  /* istanbul ignore next */
  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    const {assessmentDetailsObj} = nextProps;
    if (assessmentDetailsObj !== null) {
    }
  }
  /* istanbul ignore next */
  onRefresh() {
    console.log('refresh load');
  }
  /* istanbul ignore next */
  willFocusAction = payload => {
    let params = payload.state.params;
    let {fromSummary, dataObj, index, fromPending, itemData, title} = params;
    if (fromSummary) {
      console.log('come here');
      console.log(dataObj);
      console.log('dataObj');
      console.log('index');
      console.log(index);
      this.setUpCurrentQuestion(dataObj, index);
    } else {
      // this.getAssessmentDetailData(itemData, index);
    }
    console.log('itemData123');
    console.log(itemData);
    this.setState({
      fromSummary: fromSummary,
      selectedIndex: index,
      fromPending: fromPending,
      itemData: itemData,
      formSubId: itemData.formSubId,
      headerTitle: title,
    });
  };
  /* istanbul ignore next */
  saveAssessmentOnServer(filledQuestion, isLast) {
    this.onClose();
    this.props.dispatch(modalHanlder(true));
    console.log('Sate data is : ',this.state?.itemData)
    let data = {};
    let currentAssessmentId = this.state.itemData.id;
    data.id = currentAssessmentId;
    data.formSubId =
      this.state.itemData.formSubId === 0 && this.state.formSubId === 0
        ? this.state.itemData.formSubId
        : this.state.formSubId;
    data.question = filledQuestion;
    console.log('saveAssessmentSingleQuestion');
    console.log('FormSubID before submiting is ',data?.formSubId,' all the data is : ',data);
    console.log('Data before submiting the assesment single question answer is : ',JSON.stringify(data),' and props are : ',this.props.navigation,' is last question is : ',isLast);
    // this.props.navigation.popToTop()
    // console.log(JSON.stringify(data));
    AssessmentService.saveAssessmentSingleQuestion(data)
      .then(res => {
        console.log('Response', res);
        console.log('Response after submiting the answer :', JSON.stringify(res))
        if (res) {
          console.log(res);
          console.log('Assessment saved Successfully');
          if (
            this.state.itemData.formSubId === 0 &&
            this.state.formSubId === 0
          ) {
            console.log('Here comes in the if and form submitId is : ',res?.data?.formSubId)
            this.setState({formSubId: res?.data?.formSubId});
          }
          else
          {
            console.log('Comes to else ','Item Data form id is ',this.state.itemData.formSubId,' State form submit ID is : ',this.state.formSubId)
          }
          if (isLast) {
            let data = {};
            data.id = this.state.itemData.id;
            data.formSubId = this.state.itemData.formSubId;
            console.log('markCompletedAssessmentOnServer when all question answer and SEND NOW is press ');
            console.log(JSON.stringify(data));
            this.markCompletedAssessmentOnServer(data);
          }
        } else {
          if (isLast) {
            let data = {};
            data.id = this.state.itemData.id;
            data.formSubId = this.state.itemData.formSubId;
            console.log('markCompletedAssessmentOnServer in else');
            console.log(data);
            this.markCompletedAssessmentOnServer(data);
          } else {
            console.log('some thing went wrong');
          }
        }
      })
      .catch(error => {
        console.log('error data', error);
        showMessage({
          message: 'Error',
          description: error.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  /* istanbul ignore next */
  saveEditAssessmentOnServer(filledQuestion) {
    let data = {};
    data.Id = this.state.itemData.id;
    data.FormSubId = this.state.itemData.formSubId;
    data.Question = filledQuestion;
    console.log('saveEditAssessmentOnServer before submiting question');
    console.log(JSON.stringify(data));
    this.setState({showLoader: true});
    AssessmentService.saveAssessmentSingleQuestion(data)
      .then(res => {
        console.log('Response', res);
        this.setState({showLoader: false});
        if (res) {
          console.log(res);
          console.log('Assessment saved Successfully and response is : ',JSON.stringify(res));
          showMessage({
            message: 'Great!',
            description: 'Survey Saved',
            type: 'default',
            icon: {icon: 'success', position: 'left'},
            backgroundColor: 'green',
            duration: 3 * 1000,
          });
          this.props.navigation.goBack(null);
        }
      })
      .catch(error => {
        console.log('error data', error);
      });
  }
  /* istanbul ignore next */
  markCompletedAssessmentOnServer(data) {
    console.log('filleddata');
    console.log(data);
    console.log('data in string before submiting on server : ',JSON.stringify(data))
    console.log('Form id from the state is : ',this.state.itemData,' and form submit id is : ',this.state.formSubId);
    let palyload ={
      ...data,
      formSubId:this.state.formSubId
    }
    console.log('Payload is : ',palyload);
    // console.log('data in string before submiting on server : ',JSON.stringify(data))  data
    this.setState({showLoader: true});
    AssessmentService.markCompletedAssessment(palyload)
      .then(res => {
        console.log('Response', res);
        console.log('Response of the assesment in JSON',JSON.stringify(res))
        this.setState({showLoader: false});

        if (res.data === true) {
          console.log('Assessment Filled Successfully');
          showMessage({
            message: 'Survey Completed',
            description: 'Survey is successfully completed.',
            type: 'success',
            icon: {icon: 'success', position: 'left'},
            // backgroundColor: 'green',
            duration: 3 * 1000,
          });
          // navigateToStack.navigate('AssessmentStack')
          console.log('Navigation from the component is : ',this.props.navigation);
          this.props.navigation.popToTop();
          // this.props.navigation.navigate('AssessmentStack');
        } else {
          console.log('Response of the server when the assesment is not completly filed : ',res?.data);
          this.setState({showLoader: false});
          showMessage({
            message: 'Survey is not completely filled',
            description: '',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(error => {
        console.log('error data', error);
        this.setState({showLoader: false});
        showMessage({
          message: 'Error',
          description: 'Survey is not completely filled',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  onOpen() {
    console.log('OnOpen Called', this.refs.modalize);
    this.refs.modalize.open();
  }
  onClose() {
    this.refs.modalize.close();
  }
  /* istanbul ignore next */
  render() {
    console.log('this.state.currentQuestion from detail');
    console.log(this.state.currentQuestion);
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
        <MainHeader navigation={this.props.navigation} name={'Screenings'}>
          <Fragment>
            {/* <NavigationEvents onWillFocus={this.willFocusAction} /> */}
            <Modalize
              ref="modalize"
              adjustToContentHeight={true}
              onClosed={() => {
                this.props.dispatch(modalHanlder(true));

              }}
              modalStyle={{
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                minHeight: 250,
                backgroundColor: Colors.white,
              }}>
              <View style={styles.modal}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: hp(1),
                  }}>
                  <Image
                    source={Images.completeAssessment}
                    style={{
                      alignSelf: 'center',
                      height: hp(10),
                      width: hp(10),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(3),
                      flex: 1,
                      color: Colors.black1,
                      marginTop: hp(1),
                      marginLeft: hp(2),
                      textAlign: 'center',
                    }}>
                    Would you like to send the survey now?
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    marginTop: hp(1),
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.saveAssessmentOnServer(
                        this.navigator.currentQuestion,
                        true,
                      );
                    }}
                    style={{
                      flexDirection: 'row',
                      marginTop: hp(2),
                      marginBottom: hp(2),
                      marginRight: hp(3),
                      width: '100%',
                      borderWidth: 1,
                      height: 50,
                      borderColor: Colors.blueTextColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                      backgroundColor: Colors.blueTextColor,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.2),
                        flex: 1,
                        color: Colors.white,
                        textAlign: 'center',
                      }}>
                      Send now
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Cancel is pressed to close the modal...');
                      this.refs.modalize.close();
                      this.onClose();
                      this.props.dispatch(modalHanlder(true));
                      this.props.navigation.popToTop();
                      // this.props.dispatch(modalHanlder(true));
                      // onClose();
                    }}
                    style={{
                      flexDirection: 'row',
                      // marginBottom: hp(2),
                      width: '100%',
                      height: 50,
                      backgroundColor: Colors.lightRed,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                      marginBottom:hp(2)
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansSemibold,
                        fontSize: hp(2.2),
                        flex: 1,
                        color: Colors.red,
                        textAlign: 'center',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modalize>
            <Modal
              isVisible={this.state.modalVisible}
              style={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={styles.modal}>
                <View
                  style={{
                    height: hp(14),
                    backgroundColor: Colors.medicalHistoryBg,
                  }}
                />
                <View
                  style={{
                    alignSelf: 'center',
                    marginTop: hp(-5),
                  }}>
                  {/*<SvgWhiteTickIcon />*/}
                </View>
                <View style={{padding: hp(2)}}>
                  <Text
                    style={{
                      fontSize: hp(3),
                      textAlign: 'center',
                      fontFamily: Fonts.SourceSansRegular,
                      marginTop: hp(3),
                      marginBottom: hp(4),
                      color: Colors.black,
                    }}>
                    Would you like to send the survey now?
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginBottom: hp(1),
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={{
                          marginRight: hp(2),
                          backgroundColor: Colors.label,
                          borderRadius: hp(1),
                          padding: hp(2),
                        }}>
                        <Text
                          style={{
                            fontSize: hp(2),
                            fontFamily: Fonts.SourceSansRegular,
                            color: Colors.white,
                          }}>
                          CANCEL
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisible(!this.state.modalVisible);
                          this.saveAssessmentOnServer(
                            this.navigator.currentQuestion,
                            true,
                          );
                        }}
                        style={{
                          padding: hp(2),
                          backgroundColor: Colors.assessment_blue_500,
                          borderRadius: hp(1),
                        }}>
                        <Text
                          style={{
                            fontSize: hp(2),
                            fontFamily: Fonts.SourceSansRegular,
                            color: Colors.white,
                          }}>
                          Send Now
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: Colors.backgroundMainLogin,
              }}>
              {this.state.surveyDetailObj !== null ? (
                <View style={{flex: 1, flexDirection: 'column'}}>
                  {/*<View*/}
                  {/*  style={{*/}
                  {/*    height: hp(8),*/}
                  {/*    backgroundColor: Colors.assessment_blue_700,*/}
                  {/*    width: '100%',*/}
                  {/*    flexDirection: 'row',*/}
                  {/*  }}>*/}
                  {/*  <TouchableOpacity*/}
                  {/*    onPress={() => {*/}
                  {/*      if (this.state.fromSummary) {*/}
                  {/*        this.props.navigation.navigate('AssessmentStack');*/}
                  {/*      } else {*/}
                  {/*        this.props.navigation.goBack(null);*/}
                  {/*      }*/}
                  {/*    }}*/}
                  {/*    style={{alignSelf: 'center'}}>*/}
                  {/*    <Text*/}
                  {/*      style={{*/}
                  {/*        fontFamily: 'WisemanPTSymbols',*/}
                  {/*        fontSize: hp(5),*/}
                  {/*        marginLeft: hp(3),*/}
                  {/*        marginRight: hp(1),*/}
                  {/*        color: Colors.white,*/}
                  {/*        alignSelf: 'center',*/}
                  {/*      }}>*/}
                  {/*      W*/}
                  {/*    </Text>*/}
                  {/*  </TouchableOpacity>*/}
                  {/*  <Text*/}
                  {/*    numberOfLines={2}*/}
                  {/*    ellipsizeMode={'tail'}*/}
                  {/*    style={{*/}
                  {/*      fontSize: hp(3),*/}
                  {/*      marginLeft: hp(2),*/}
                  {/*      fontFamily: 'Roboto-Medium',*/}
                  {/*      color: Colors.white,*/}
                  {/*      flex: 1,*/}
                  {/*      alignSelf: 'center',*/}
                  {/*    }}>*/}
                  {/*    {this.state.itemData !== null*/}
                  {/*      ? this.state.itemData.Title*/}
                  {/*      : ''}*/}
                  {/*  </Text>*/}
                  {/*  {(this.state.itemData.formSubId !== 0 &&*/}
                  {/*    this.state.itemData.reOpen &&*/}
                  {/*    this.state.itemData.reOpen === true) ||*/}
                  {/*  this.state.fromSummary ? (*/}
                  {/*    <TouchableOpacity*/}
                  {/*      style={{*/}
                  {/*        alignSelf: 'center',*/}
                  {/*        justifyContent: 'center',*/}
                  {/*        alignItems: 'center',*/}
                  {/*        width: hp(10),*/}
                  {/*        height: hp(6),*/}
                  {/*      }}*/}
                  {/*      onPress={() => {*/}
                  {/*        this.saveAssessmentOnServer(*/}
                  {/*          this.navigator.currentQuestion,*/}
                  {/*          true,*/}
                  {/*        );*/}
                  {/*      }}>*/}
                  {/*      <Text*/}
                  {/*        style={{*/}
                  {/*          alignItems: 'center',*/}
                  {/*          justifyContent: 'center',*/}
                  {/*          fontFamily: 'WisemanPTSymbols',*/}
                  {/*          marginRight: hp(2),*/}
                  {/*          marginLeft: hp(2),*/}
                  {/*          fontSize: hp(4),*/}
                  {/*          color: Colors.white,*/}
                  {/*          alignSelf: 'center',*/}
                  {/*        }}>*/}
                  {/*        V*/}
                  {/*      </Text>*/}
                  {/*    </TouchableOpacity>*/}
                  {/*  ) : null}*/}
                  {/*</View>*/}
                  {/* <View
                      style={{
                        backgroundColor: Colors.backgroundMainLogin,
                        height: hp(7),
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: hp(0.5),
                      }}>
                      <Text
                        style={{
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.heading,
                          marginRight: hp(2),
                          marginLeft: hp(1),
                          alignSelf: 'center',
                        }}>
                        {`${this.navigator.currentIndex + 1}/${
                          this.navigator.questionsToAsk.length
                        }`}
                      </Text>
                      <Progress.Bar
                        progress={
                          this.navigator.currentProgress() &&
                          this.navigator.currentProgress() !== null &&
                          this.navigator.currentProgress() !== 'NaN'
                            ? this.navigator.currentProgress()
                            : 0
                        }
                        height={hp(1)}
                        width={hp(32)}
                        borderRadius={10}
                        borderWidth={0}
                        color={Colors.assessment_blue_500}
                        unfilledColor={Colors.line}
                      />
                      <Text
                        style={{
                          marginLeft: hp(2),
                          marginRight: hp(1),
                          fontSize: hp(2),
                          fontFamily: Fonts.SourceSansRegular,
                          color: Colors.heading,
                        }}>
                        {this.navigator.currentProgress() &&
                        this.navigator.currentProgress() !== null &&
                        this.navigator.currentProgress() !== 'NaN'
                          ? parseFloat(
                              this.navigator.currentProgress() * 100,
                            ).toFixed(0) + '%'
                          : 0 + '%'}
                      </Text>
                    </View> */}
{/*===================================== Below code will render when the user start the survey =================================*/}
                  {this.state.currentQuestion ? (
                    <View
                      style={{
                        flex: 1,
                        paddingTop: hp(1),
                        marginLeft: hp(1.5),
                        marginRight: hp(1.5),
                        backgroundColor: Colors.backgroundMainLogin,
                        elevation: 10,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}>
                      <View
                        style={{
                          width: '99%',
                          flex: 1,
                        }}>
                        <Text
                          style={{
                            marginLeft: hp(2),
                            marginRight: hp(1),
                            fontSize: hp(2.2),
                            fontFamily: Fonts.SourceSansRegular,
                            color: Colors.blueTextColor,
                            marginVertical: hp(3),
                          }}>
                          {'Question ' +
                            (this.navigator.currentIndex + 1) +
                            '/' +
                            this.navigator.questionsToAsk.length}
                        </Text>
                        <QuestionRenderer
                          key={`${this.state.currentQuestion.id}-${this.state.currentQuestion.parentQuestionId}`}
                          question={this.state.currentQuestion}
                          onAnswer={(answers: [String]) => {
                            console.log('onAnswer');
                            console.log(answers);
                            this.navigator.saveAnswer(
                              this.state.currentQuestion.id,
                              this.state.currentQuestion.parentQuestionId,
                              answers,
                            );
                            if (this.navigator.isLastQuestion()) {
                              this.setState({
                                isButtonColor: true,
                                buttonText: 'Complete',
                              });
                            } else {
                              this.setState({
                                isButtonColor: false,
                                buttonText: 'Next',
                              });
                            }
                          }}
                        />
                      </View>
                    </View>
                  ) : null}
 {/*===================================== Above code will render when the user start the survey =================================*/}        
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      width: '94%',
                      alignSelf: 'center',
                      paddingBottom: hp(1),
                      backgroundColor: Colors.backgroundMainLogin,
                      borderBottomRightRadius: 10,
                      borderBottomLeftRadius: 10,
                      marginBottom: hp(2),
                      overflow: 'hidden',
                    }}>
                    {/*{this.navigator.canGoPrevious() ? (*/}
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        backgroundColor: Colors.bleLayer3,
                        borderRadius: 8,
                        // borderWidth: 1,
                        // flex: 1,
                        flexDirection: 'row',
                        marginRight: hp(2),
                        alignItems: 'center',
                        paddingLeft: hp(1),
                        paddingRight: hp(1),
                        borderColor: Colors.blueTextColor,
                        height: hp(7.5),
                        width: '45%',
                      }}
                      onPress={() => {
                        this.setState({isButtonColor: false});
                        if (this.navigator.canGoPrevious()) {
                          let prevQuestion =
                            this.navigator.moveToPreviousQuestion();
                          this.setState({currentQuestion: prevQuestion});
                        } else {
                          this.props.navigation.goBack();
                        }
                      }}>
                      <Text
                        style={
                          // this.navigator.canGoPrevious()
                          //   ?
                          styles.backButtonEnable
                          // : styles.backButtonDisable
                        }>
                        Previous
                      </Text>
                    </TouchableOpacity>
                    {/*) : null}*/}

                    <TouchableOpacity
                      style={{
                        // this.navigator.canGoPrevious()
                        //   ? {
                        justifyContent: 'center',
                        backgroundColor: Colors.blueTextColor,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: hp(1),
                        paddingRight: hp(1),
                        // flex: 1,
                        height: hp(7.5),
                        width: '45%',
                        // }
                        //                        : styles.nextButtonLarge
                      }}
                      onPress={() => {
                        console.log('this.navigator.filledSurveyToSave()');
                        console.log(this.navigator.currentQuestion);
                        this.saveAssessmentOnServer(
                          this.navigator.currentQuestion,
                          false,
                        );
                        if (this.navigator.canGoNext()) {
                          let nextQuestion =
                            this.navigator.moveToNextQuestion();
                          if (nextQuestion) {
                            this.setState({currentQuestion: nextQuestion});
                          } else {
                            // Last Question. Proceed to save the form.
                            // Last Question. Go to AssessmentSummary screen.
                            // this.setModalVisible(true);
                            this.refs.modalize.open();
                            this.onOpen();
                            this.props.dispatch(modalHanlder(false));
                          }
                        } else {
                          showMessage({
                            message: 'Message',
                            description: 'Please answer the required question',
                            type: 'warning',
                            icon: {icon: 'info', position: 'left'},
                            duration: 3 * 1000
                            // backgroundColor: Colors.blueTextColor,
                          });
                        }
                      }}>
                      <Text
                        style={{
                          fontSize: hp(2.5),
                          color: Colors.white,
                          marginRight: hp(1),
                          fontFamily: Fonts.SourceSansRegular,
                        }}>
                        {this.navigator.isLastQuestion()
                          ? 'Complete'
                          : this.state.buttonText}
                      </Text>
                      {/* <Text
                          style={{
                            fontFamily: 'WisemanPTSymbols',
                            fontSize: hp(3),
                            color: Colors.blueTextColor,
                            alignSelf: 'center',
                          }}>
                          X
                        </Text> */}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh.bind(this)}
                    />
                  }>
                  <Text
                    style={{
                      fontSize: hp(2),
                      color: Colors.fontGrey,
                      fontFamily: Fonts.SourceSansRegular,
                    }}>
                    No Assessment Question Data Available.
                  </Text>
                </ScrollView>
              )}
              {this.state.showLoader === true ? (
                <Spinner
                  visible={this.state.showLoader}
                  textContent={'Loading...'}
                  textStyle={{color: '#FFF'}}
                />
              ) : null}
            </View>
          </Fragment>
        </MainHeader>
      </SafeAreaView>
    );
  }
}
/* istanbul ignore next */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.medicalHistoryBg,
  },
  slideContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  activeDotStyle: {
    backgroundColor: Colors.green,
    width: 11,
    height: 11,
    borderRadius: 6,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  dotStyle: {
    backgroundColor: Colors.borderColor,
    width: 8,
    height: 8,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  backButtonDisable: {
    fontSize: hp(2.5),
    padding: 13,
    color: Colors.assessment_green_700,
    fontFamily: Fonts.SourceSansRegular,
  },
  backButtonEnable: {
    fontSize: hp(2.5),
    color: Colors.blueTextColor,
    fontFamily: Fonts.SourceSansRegular,
  },
  nextButtonLarge: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '30%',
    alignSelf: 'flex-start',
    marginLeft: '2.5%',
    backgroundColor: Colors.assessment_lightgreen_500,
    borderRadius: 4,
    alignItems: 'center',
    height: hp(7.5),
  },
  nextButtonSmall: {
    justifyContent: 'center',
    backgroundColor: Colors.assessment_lightgreen_500,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(7.5),
    width: hp(22),
  },
  modal: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    width: '90%',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: hp(1.5),
  },
});
/* istanbul ignore next */
// const mapStateToProps = state => {
//   return {assessmentDetailsObj: state.assessmentDetailsObj};
// };
/* istanbul ignore next */
// export default connect(mapStateToProps)(AssessmentDetail);
export default connect()(AssessmentDetail);
