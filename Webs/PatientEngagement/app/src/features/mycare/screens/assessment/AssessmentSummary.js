/* istanbul ignore file */
import React, { Component, Fragment } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import { NavigationEvents, SafeAreaView, withNavigation } from 'react-navigation';
import Colors from '../../../../../config/Colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { AssessmentNavigator } from '../../../../helpers/Assessment/AssessmentNavigator';
import { QuestionType, SvgCrossIcon, SvgTickIcon } from '../../constants';
import AssessmentService from '../../../../api/assesment';
import { showMessage } from 'react-native-flash-message';
// import {SvgEditIcon} from '../../profile/constants';
import Modal from 'react-native-modal';
import {
  OfflineAssessment,
  retrieveItem,
  storeItem,
} from '../../../../helpers/LocalStorage';
import Spinner from 'react-native-loading-spinner-overlay';
import { Fonts } from '../../../../../config/AppConfig';
import Images from '../../../../../config/Images';
import VitalsHeader from '../../components/VitalsHeader';
import { useNavigation } from '@react-navigation/native';

class AssessmentSummary extends React.PureComponent {
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      data: null,
      progress: 1,
      isCompleted: false,
      completedListItem: null,
      modalVisible: false,
      selectedIndex: 0,
      totallCount:0
    };
  }
  static navigationOptions = ({ navigation }) => ({
    // title: (navigation.state.params || {}).title || 'Chat! ',
    header: null,
  });
  /* istanbul ignore next */
  willFocusAction = payload => {
    let params = payload.state.params;
    console.log('====================================');
    console.log('params', params);
    console.log('====================================');
    let { data, progress, isCompleted } = params;
    if (isCompleted) {
      this.setState({
        completedListItem: data,
        isCompleted: isCompleted,
        progress: progress,
      });
      this.getCompetedDetailsFromServer(data);
    } else {
      this.setState({ data: data, isCompleted: isCompleted, progress: progress });
    }
  };

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        const { route } = this.props;
        const { data, progress, isCompleted, dateOfCompletion } = route.params;
        console.log('====================================');
        console.log('data in Summary', data, 'and modified date is : ',dateOfCompletion);
        console.log('====================================');
        if (isCompleted) {
          this.setState({
            completedListItem: data,
            isCompleted: isCompleted,
            progress: progress,
          });
          this.getCompetedDetailsFromServer(data);
        } else {
          this.setState({
            data: data,
            isCompleted: isCompleted,
            progress: progress,
          });
        }
      },
    );
  }

  //  navigation = useNavigation()

  /* istanbul ignore next */
  getCompetedDetailsFromServer(data) {
    this.setState({ showLoader: true });
    AssessmentService.getAssessmentsDetails(data).then(res => {


      console.log('=========================');
      console.log('Response of the server for the completed assesment ...', res);
      console.log('=========================');
      console.log('completed assesmnet');
      console.log((res.data));
      this.setState({ showLoader: false, data: res.data });
    }).catch(e => {
      console.log('====================================');
      console.log('error in completed',e);
      this.setState({ showLoader: false});
      
      
      console.log('====================================');
    })
  }

  /* istanbul ignore next */
  setModalVisible(visible, index) {
    this.setState({ modalVisible: visible, selectedIndex: index });
  }

  callReopenAssessmentApi() {
    let currentIndex = this.state.selectedIndex;
    let formData = {};
    formData.id = this.state.data.id;
    formData.formSubId = this.state.data.formSubId;
    AssessmentService.reOpenAssessment(formData)
      .then(response => {
        console.log('response');
        console.log(response);
        console.log('this.state.selectedIndex');

        console.log(currentIndex);
        if (response) {
          retrieveItem(OfflineAssessment).then(response => {
            console.log('current assessment id');
            console.log(this.state.data.id);
            console.log('OfflineAssessment');
            console.log(response);
            if (response && response.length) {
              let localArray = [];
              localArray = JSON.parse(response);
              if (localArray && localArray.length) {
                let findIndex = localArray.findIndex(item => {
                  return item.id === this.state.data.id;
                });
                console.log('findIndex');
                console.log(findIndex);
                if (findIndex !== -1) {
                  localArray[findIndex].reOpen = true;
                } else {
                  let data = {};
                  data.id = this.state.data.id;
                  data.reOpen = true;
                  localArray.push(data);
                }
                console.log('final array 23423423243');
                console.log(localArray);
                storeItem(OfflineAssessment, JSON.stringify(localArray));
              }
            }
          });
          this.props.navigation.navigate('AssDetail', {
            itemData: this.state.completedListItem,
            fromSummary: true,
            dataObj: this.state.data,
            index: currentIndex,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  /* istanbul ignore next */
  renderAllQuestions() {
    console.log('This is the render data', (this.state.data));
    let navigator = new AssessmentNavigator(this.state.data, 0);
    console.log('All the questions in navigator : ',navigator?.allProcessedQuestions);
    const questionsToRender = navigator.allProcessedQuestions;
    // Parent and child logic should be implemented here (DANISH-START)
    //Algo of displaying in sequence is 
    //Step(1) Get the Childs of the current parent Question
    //Step(2) Figure Out if child question have a child answer
    //Step(3) Repeat this process for the whole array 
    let textObject ={}
    // Parent and child logic should be implemented here (DANISH-END)
    // const questionsToRender = navigator.questionsToAsk;
     console.log('Questions to renders are : ',questionsToRender);
     this.setState({totallCount:questionsToRender?.length})
    return questionsToRender.filter((question)=> question?.savedAnswers?.length>0).map((question, index) => {
      let defaultValue = '';
      if (question.type === QuestionType.DATETIME) {
        if (question.savedAnswers.length > 0) {
          defaultValue = moment(question.savedAnswers[0]).format('LLL');
        }
      } else if (question.type === QuestionType.DATE) {
        if (question.savedAnswers.length > 0) {
          defaultValue = moment(question.savedAnswers[0]).format('LL');
        }
      } else if (question.savedAnswers.length > 0) {
        defaultValue = question.savedAnswers.join(' , ');
      }
      return (
        <>
        {
          question?.savedAnswers?.length===0?null:
        <View style={{ flex: 1, backgroundColor: Colors.white, borderColor: 'green', borderWidth: 0 }}>
          <TouchableOpacity
            activeOpacity={1.0}
            // onPress={() => {
            //   if (this.state.data.isEditable) {
            //     this.setModalVisible(true, index);
            //   } else {
            //     showMessage({
            //       message: 'Info',
            //       description: 'Assessment is not editable',
            //       type: 'default',
            //       icon: {icon: 'info', position: 'left'},
            //       backgroundColor: Colors.red,
            //     });
            //   }
            // }}
            style={{
              width: '100%',
              marginTop: hp(1),
              flex: 1,
              borderColor: 'red',
              borderWidth: 0,
              paddingHorizontal: hp(2),
              paddingBottom:hp(1)
            }}>
            {/*=====================================Using below view because of change in design START===================================*/}
            
            <View
              key={index}
              style={{
                borderRadius: hp(1.5),
                paddingHorizontal: hp(2),
                paddingVertical: hp(1.9),
                borderRadius: hp(1.5),
                backgroundColor: Colors.white,
                marginTop: hp(2),
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: hp(0.5),
                elevation: hp(0.5),
                borderColor:'red',
                boderWidth:0
              }}>
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: Fonts.SourceSansSemibold,
                  color: Colors.black,
                }}>
                Question {index + 1}
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.2),
                  maxWidth: hp(32),
                  marginTop: hp(1.5),
                }}>
                {question.questionText}
              </Text>
              <View style={{ flex: 1, borderColor: 'blue', borderWidth: 0, marginTop: hp(1.5), alignItems: 'flex-start', flexDirection: 'row' }}>
                <Text
                  style={{
                    color: Colors.blueGrayDisableText,
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2.2),
                    maxWidth: hp(32),
                  }}>
                  {'Answer: '}
                </Text>
                <Text
                  style={{
                    color: Colors.blueTextColor,
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2.2),
                    maxWidth: hp(32),
                  }}>
                  {question?.savedAnswers[0]?.length>0?question?.savedAnswers[0]:'Not answered yet'}
                </Text>

              </View>
            </View>
            {/*=========================================================Hide this  below view because of change in design============================================ */}


            {/*=========================================================Hide this  above view because of change in design ============================================ */}

            {/*=========================================================Hide this  below text because of change in design ============================================ */}

            {/*=========================================================Hide this  above text because of change in design ============================================ */}
            {/*<TextInput*/}
            {/*  selectionColor={Colors.red}*/}
            {/*  underlineColorAndroid={Colors.lightGrey}*/}
            {/*  multiline={true}*/}
            {/*  editable={false}*/}
            {/*  numberOfLines={3}*/}
            {/*  style={{*/}
            {/*    marginLeft: hp(12),*/}
            {/*    marginRight: hp(3),*/}
            {/*    marginTop: hp(1),*/}
            {/*    color: Colors.darkGrey,*/}
            {/*    fontSize: hp(2.5),*/}
            {/*    fontFamily: Fonts.SourceSansRegular,*/}
            {/*  }}*/}
            {/*  defaultValue={'Answer: ' + defaultValue}*/}
            {/*/>*/}
          </TouchableOpacity>
        </View>
        }
        </>
      );
    });
  }

  /* istanbul ignore next */
  markCompletedAssessmentOnServer(data) {
    console.log('filleddata');
    console.log(data);
    this.setState({ showLoader: true });
    AssessmentService.markCompletedAssessment(data)
      .then(res => {
        console.log('Response', res);
        this.setState({ showLoader: false });
        if (res.data === true) {
          console.log('Assessment Filled Successfully');
          showMessage({
            message: 'Great!',
            description: 'ASSESSMENT COMPLETED',
            type: 'default',
            icon: { icon: 'success', position: 'left' },
            backgroundColor: 'green',
            duration: 3 * 1000,
          });
          this.props.navigation.navigate('AssessmentStack');
        } else {
          showMessage({
            message: 'Error',
            description: 'Assessment is not completely filled',
            type: 'default',
            icon: { icon: 'info', position: 'left' },
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(error => {
        console.log('error data', error);
        showMessage({
          message: 'Error',
          description: 'Assessment is not completely filled',
          type: 'default',
          icon: { icon: 'info', position: 'left' },
          backgroundColor: Colors.red,
        });
      });
  }

  /* istanbul ignore next */
  saveAssessmentOnServer(filledAssessment) {
    this.setState({ showLoader: true });
    AssessmentService.saveAssessmentAnswers(filledAssessment)
      .then(res => {
        console.log('Response', res);
        this.setState({ showLoader: false });
        if (res) {
          console.log(res);
          console.log('Assessment mark completed Successfully');
          showMessage({
            message: 'Great!',
            description: 'ASSESSMENT SAVED',
            type: 'default',
            icon: { icon: 'success', position: 'left' },
            backgroundColor: 'green',
            duration: 3 * 1000,
          });
          // this.props.navigation.navigate('AssessmentStack');
        } else {
          showMessage({
            message: 'Error',
            description: 'Something Went Wrong.',
            type: 'default',
            icon: { icon: 'info', position: 'left' },
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(error => {
        console.log('error data', error);
        showMessage({
          message: 'Error',
          description: 'Something Went Wrong.',
          type: 'default',
          icon: { icon: 'info', position: 'left' },
          backgroundColor: Colors.red,
        });
      });
  }

  /* istanbul ignore next */
  render() {
    console.log('Assessment Data', this.state.data);
    const { route } = this.props;
    const { data, progress, isCompleted } = route.params;
    console.log('====================================');
    console.log('data in render', data);
    console.log('====================================');
    return (
    <>
      <SafeAreaView
            style={{ flex: 1, backgroundColor:'transparent',borderWidth: 0, borderColor: 'blue' }}>
        <VitalsHeader
          navigation={this.props.navigation}
          headerName={'Screenings'}>
            <Fragment>
              <Modal
                isVisible={this.state.modalVisible}
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View
                  style={{
                    justifyContent: 'center',
                    backgroundColor: Colors.white,
                    width: '90%',
                    borderRadius: 3,
                  }}>
                  <View style={{ padding: hp(2) }}>
                    <Text
                      style={{
                        fontSize: hp(3),
                        textAlign: 'center',
                        fontFamily: Fonts.SourceSansBold,
                        marginTop: hp(2),
                        marginBottom: hp(2),
                        color: Colors.heading,
                      }}>
                      Change Answer ?
                    </Text>
                    <Text
                      style={{
                        fontSize: hp(3),
                        textAlign: 'center',
                        fontFamily: Fonts.SourceSansRegular,
                        marginBottom: hp(4),
                        color: Colors.label,
                      }}>
                      This survey will be moved from Completed to Pending.
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
                            this.setModalVisible(false);
                          }}
                          style={{
                            width: hp(12),
                            marginRight: hp(2),
                            backgroundColor: Colors.label,
                            borderRadius: hp(1),
                            padding: hp(2),
                          }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              fontSize: hp(2),
                              fontFamily: Fonts.SourceSansRegular,
                              color: Colors.white,
                            }}>
                            No
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.setModalVisible(false);
                            this.callReopenAssessmentApi();
                          }}
                          style={{
                            width: hp(13),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: hp(2),
                            backgroundColor: Colors.assessment_lightgreen_500,
                            borderRadius: hp(1),
                            padding: hp(2),
                          }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              fontSize: hp(2),
                              fontFamily: Fonts.SourceSansRegular,
                              color: Colors.white,
                            }}>
                            Continue
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
              {this.state.data !== null ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: Colors.white,
                  }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    {/* <NavigationEvents onWillFocus={this.willFocusAction} /> */}
                    <ScrollView contentContainerStyle={{ paddingBottom: hp(2) }}>
                      {/*=====================================================================This is the test box view Start (KL SUBHA IS KO A K SET KRNA HAI )=========================== */}
                      <View style={{ borderColor: 'black', borderWidth: 0, paddingHorizontal: hp(2) }}>
                        <View
                          style={{
                            backgroundColor: Colors.superLightBlue,
                            padding: hp(3),
                            borderRadius: hp(1.5),
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: hp(0.5),
                            elevation: hp(0.5),
                          }}>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <View style={{ display: 'flex' }}>
                              <Text
                                style={{
                                  color: Colors.black,
                                  fontSize: hp(1.9),
                                  fontFamily: Fonts.SourceSansRegular,
                                }}>
                               {moment(route?.params?.dateOfCompletion).format('MMMM DD/MM/YYYY')}
                              </Text>
                              <Text
                                style={{
                                  color: Colors.black,
                                  marginTop: hp(2.2),
                                  fontSize: 25,
                                  fontFamily: Fonts.SourceSansSemibold,
                                }}>
                                {this.state.data !== null
                                  ? this.state.data?.title
                                  : ''}
                              </Text>
                            </View>

                          </View>

                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'flex-end',
                              marginTop: hp(2),
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: Colors.black,
                                  fontSize: hp(1.9),
                                  fontFamily: Fonts.SourceSansRegular,
                                }}>
                                Total Questions: {this.state.totallCount}
                              </Text>
                            </View>
                            <View
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: Colors.black,
                                    fontSize: hp(3.6),
                                    fontWeight: '600',
                                    fontFamily: Fonts.SourceSansSemibold,
                                  }}>
                                  {data?.completionPercentage}
                                </Text>
                                <Text
                                  style={{
                                    color: Colors.black,
                                    marginLeft: hp(0.2),
                                    fontSize: hp(1.9),
                                    fontFamily: Fonts.SourceSansRegular,
                                  }}>
                                  %
                                </Text>
                              </View>
                              <Text
                                style={{
                                  color: Colors.black,
                                  fontSize: hp(1.9),
                                  fontFamily: Fonts.SourceSansRegular,
                                }}>
                                Score
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      {/*==================================================This is the test box view Start (KL SUBHA IS KO A K SET KRNA HAI )======================================= */}

                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: Colors.line,
                          alignSelf: 'flex-end',
                          marginTop: hp(3),
                          borderColor:'white',
                          borderWidth:1
                        }}
                      />
                       <Text
                style={{
                  fontSize: hp(2.2),
                  fontFamily: Fonts.SourceSansSemibold,
                  color: Colors.black,
                  marginTop: hp(2.5),
                  marginBottom: hp(.5),
                  marginLeft:hp(2.5)
                }}>
                Questions
              </Text>
                      {this.state.data !== null
                        ? this.renderAllQuestions()
                        : null}
                    </ScrollView>
                    {this.state.isCompleted === false ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          width: '100%',
                          alignItems: 'center',
                          paddingRight: hp(2),
                          paddingBottom: hp(2),
                          paddingTop: hp(2),
                          backgroundColor: Colors.white,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            this.saveAssessmentOnServer(this.state.data);
                          }}>
                          <Text
                            style={{
                              fontSize: hp(2.5),
                              color: Colors.homePurple,
                              fontFamily: Fonts.SourceSansRegular,
                              marginRight: hp(2),
                            }}>
                            SAVE
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            if (this.state.data.formSubId !== 0) {
                              let data = {};
                              data.id = this.state.data.id;
                              data.title = this.state.data.title;
                              data.formSubId = this.state.data.formSubId;
                              data.program = this.state.data.program;
                              data.completionPercentage =
                                this.state.data.completionPercentage;
                              this.markCompletedAssessmentOnServer(data);
                            } else {
                              showMessage({
                                message: 'Assessment',
                                description: 'Please save the assessment first',
                                type: 'default',
                                icon: { icon: 'info', position: 'left' },
                                backgroundColor: Colors.red,
                              });
                            }
                          }}>
                          <Text
                            style={{
                              fontSize: hp(2.5),
                              alignSelf: 'flex-end',
                              color: Colors.homePurple,
                              fontFamily: Fonts.SourceSansRegular,
                            }}>
                            COMPLETE
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                  {this.state.showLoader === true ? (
                    <Spinner
                      visible={this.state.showLoader}
                      textContent={'Loading...'}
                      textStyle={{ color: '#FFF' }}
                    />
                  ) : null}
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={{
                    flex: 1,
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {this.state.showLoader === true ? (
                    <Spinner
                      visible={this.state.showLoader}
                      textContent={'Loading...'}
                      textStyle={{ color: '#FFF' }}
                    />
                  ) : null}
                  <Text
                    style={{
                      fontSize: hp(2),
                      color: Colors.fontGrey,
                      fontFamily: Fonts.SourceSansRegular,
                    }}>
                    No Screening Available.
                  </Text>
                </ScrollView>
              )}
            </Fragment>
        </VitalsHeader>
      </SafeAreaView>
      </>
    );
  }
}

export default AssessmentSummary;
