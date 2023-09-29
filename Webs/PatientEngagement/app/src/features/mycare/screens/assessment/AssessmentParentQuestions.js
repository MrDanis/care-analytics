import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
  Dimensions,
  useWindowDimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import {color} from 'react-native-reanimated';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import Colors from '../../../../../config/Colors';
import HeaderAssessment from '../../components/HeaderAssessment';
import AssessmentService from '../../../../api/assesment';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
const AssessmentParentQuestions = ({navigation, route}) => {
  const [showLoader, setShowLoader] = useState(false);
  const [assessmentParentQuestions, setAssessmentParentQuestions] =
    useState(null);
  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const {itemData, index, title} = route.params;

  useEffect(() => {
    console.log('Item data before starting the assesment is : ',itemData)
    getAssessmentDetailData(itemData, index);
  }, []);

  function getAssessmentDetailData(itemData, index) {
    setShowLoader(true);
    AssessmentService.getAssessmentsDetails(itemData)
      .then(res => {
        setAssessmentDetail(res.data);
        console.log('Server-Response', res);
        setShowLoader(false);
        console.log('Server-index', index);
        setUpParentQuestion(res.data);
      })
      .catch(error => {
        setShowLoader(false);
        console.log('error data');
        console.log(JSON.stringify(error));
        showMessage({
          message: 'Information',
          description: error?.detail,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }

  function setUpParentQuestion(data) {
    let arrayData = [];
    arrayData = data?.questions.filter(item => item.parentQuestionId === 0);
    console.log('====================================');
    console.log('array', arrayData);
    console.log('====================================');

    setAssessmentParentQuestions(arrayData);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.BgColor,
      }}>
      <StatusBar backgroundColor={Colors.BgColor} barStyle="dark-content" />
      <Spinner
        visible={showLoader}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      {/* main container */}
      <HeaderAssessment navigation={navigation}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignContent: 'space-between',
              backgroundColor: Colors.BgColor,
              padding: hp(2.5),
            }}>
            {/* first light blue con */}
            <View
              style={{
                backgroundColor: Colors.superLightBlue,
                padding: hp(3),
                borderRadius: hp(1.5),
                shadowOffset: {width: 0, height: 2},
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
                <View style={{display: 'flex'}}>
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: hp(1.9),
                      fontFamily: Fonts.SourceSansRegular,
                    }}>
                  {moment(new Date(itemData?.modifiedDate)).format('MMMM') +
                    ' ' +
                    moment(new Date(itemData?.modifiedDate)).format('MM/DD/yyyy')}
                  </Text>
                  <Text
                    style={{
                      color: Colors.black,
                      marginTop: hp(2.2),
                      fontSize: 25,
                      fontFamily: Fonts.SourceSansSemibold,
                    }}>
                    {assessmentDetail?.title}
                  </Text>
                </View>
                {/* <View
              style={{
                borderRadius: hp(12),
                backgroundColor: Colors.blueTextColor,
              }}>
              <Text
                style={{
                  fontSize: hp(1.9),
                  paddingHorizontal: hp(1.2),
                  paddingVertical: hp(0.5),
                  color: Colors.white,
                  fontFamily: Fonts.SourceSansSemibold,
                }}>
                Not completed
              </Text>
            </View> */}
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
                    Total Questions: {assessmentParentQuestions?.length}
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
                      {itemData?.completionPercentage}
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
            {/* Questions Container */}
            <View style={{}}>
              <Text
                style={{
                  fontSize: hp(2.2),
                  fontFamily: Fonts.SourceSansSemibold,
                  color: Colors.black,
                  marginTop: hp(4),
                  marginBottom: hp(1),
                }}>
                Questions
              </Text>
              {assessmentParentQuestions?.map((item, index) => (
                <View
                  key={index}
                  style={{
                    borderRadius: hp(1.5),
                    paddingHorizontal: hp(2),
                    paddingVertical: hp(1.9),
                    borderRadius: hp(1.5),
                    backgroundColor: Colors.white,
                    marginTop: hp(2),
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    shadowRadius: hp(0.5),
                    elevation: hp(0.5),
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
                    {item?.questionText}
                  </Text>
                </View>
              ))}
            </View>
            {/* submit button */}
            <View style={{}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AssessmentDetail', {
                    itemData: itemData,
                    fromPending: true,
                    index: index,
                    title: title,
                  });
                }}
                style={{
                  backgroundColor: Colors.blueTextColor,
                  borderRadius: hp(1.5),
                  height: hp(7),
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: hp(3),
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.SourceSansSemibold,
                    fontSize: hp(2.2),
                    textAlign: 'center',
                  }}>
                  Start Assessment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </HeaderAssessment>
    </SafeAreaView>
  );
};

export default AssessmentParentQuestions;
