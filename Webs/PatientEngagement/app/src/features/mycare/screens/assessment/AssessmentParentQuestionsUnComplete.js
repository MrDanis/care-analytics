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
import colors from '../../../../../config/Colors';
import Colors from '../../../../../config/Colors';
import HeaderAssessment from '../../components/HeaderAssessment';
const AssessmentParentQuestionsUnComplete = ({
  itemData,
  index,
  title,
  navigation,
}) => {
  console.log('============================================');
  console.log('thie data coming to the new component', itemData);
  console.log('============================================');
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.BgColor,
      }}>
      <StatusBar backgroundColor={Colors.BgColor} barStyle="dark-content" />
      <HeaderAssessment navigation={navigation}>
        {/* main container */}
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
                  Septermber 10/01/2022
                </Text>
                <Text
                  style={{
                    color: Colors.black,
                    marginTop: hp(2.2),
                    fontSize: hp(3.5),
                    fontFamily: Fonts.SourceSansSemibold,
                  }}>
                  PHQ 9
                </Text>
              </View>
              <View
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
                  Total Questions: 10
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
                    0
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
            <View
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
                Question 1
              </Text>
              <Text
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2.2),
                  maxWidth: hp(32),
                  marginTop: hp(1.5),
                }}>
                Little interest or pleasure in doing things ?
              </Text>
              {/* answer field */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: hp(1),
                }}>
                <Text
                  style={{
                    color: Colors.blueGrayDisableText,
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2.2),
                  }}>
                  Answer:
                </Text>
                <Text
                  style={{
                    color: Colors.blueTextColor,
                    fontFamily: Fonts.SourceSansRegular,
                    fontSize: hp(2.2),
                  }}>
                  Not at all (0 Points)
                </Text>
              </View>
            </View>
          </View>
          {/* submit button */}
          <View style={{}}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.blueTextColor,
                borderRadius: hp(1.5),
                height: hp(7),
                // display: 'flex',
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
      </HeaderAssessment>
    </SafeAreaView>
  );
};

export default AssessmentParentQuestionsUnComplete;
