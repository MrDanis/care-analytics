// import {View, Text} from 'react-native';
import {useState, useEffect, Fragment} from 'react';

import CalendarStrip from 'react-native-calendar-strip';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import moment from 'moment';

import {StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import React from 'react';
import {Colors, Images, Svgs} from '../../../../../../config';
import {Fonts} from '../../../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';
import images from '../../../../../../config/Images';
import Moment from 'moment';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Image, SvgCss} from 'react-native-svg';
import CustomTestChart from '../../custom_chart';
import Spinner from 'react-native-loading-spinner-overlay';
import VitalsService from '../../../../../api/vitals';
import {TouchableOpacity} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import EmailPopover from '../../../../bluebutton/screens/component/EmailPopover';
import MainHeader from '../../../../mycare/components/MainHeader';
import Modal from 'react-native-modal';
import {Button} from 'react-native-share';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';

// import styled from 'styled-components/native';
// import AnalogClock from 'react-native-clock-analog';
import colors from '../../../../../../config/Colors';
import DepressiveScreen from '../symptoms_components.js/depressive_screen';

// import CircularProgress from 'react-native-circular-progress-indicator';

const SymptomTrackerScreen = ({navigation}) => {
  // const {navigationObject} = props.route.params;
  // const [navigation, setnavigation] = useState(navigationObject);

  const [isModalVisible, setModalVisible] = useState(false);
  const [stepNo, setstepNo] = useState('first');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [date, setDate] = useState(
    moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );
  const [barData, setbarData] = useState([
    {
      value: 40,
      label: 'Jan',
      // spacing: 30,
      labelWidth: 20,
      labelTextStyle: {color: 'gray'},
      frontColor: Colors.purpleBar,
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 10}}>50</Text>
      ),
    },
    {
      value: 60,
      label: 'Feb',
      // spacing: 30,
      labelWidth: 20,
      labelTextStyle: {color: 'gray'},
      frontColor: Colors.purpleBar,
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 10}}>60</Text>
      ),
    },
    {
      value: 80,
      label: 'Mar',
      // spacing: 30,
      labelWidth: 20,
      labelTextStyle: {color: 'gray'},
      frontColor: Colors.purpleBar,
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 10}}>80</Text>
      ),
    },
    {
      value: 100,
      label: 'Apr',
      // spacing: 30,
      labelWidth: 20,
      labelTextStyle: {color: 'gray'},
      frontColor: Colors.purpleBar,
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 7.0}}>100</Text>
      ),
    },
  ]);
  const [loader, setloader] = useState(false);
  // const [modalHeight, setmodalHeight] = useState(0.3);

  useEffect(() => {
    // getChartData(date);
    // pass in the date for the api to Work, for now
    // static looks aesthetic
    getChartData();
  }, []);

  function getChartData(date) {
    setloader(true);
    VitalsService.getVitalCategoryHistory(
      10,
      Moment(new Date(date)).format('YYYY-MM-DD'),
    )
      .then(response => {
        setloader(false);
        console.log('getVitalCategoryHistory');
        console.log(JSON.stringify(response));

        if (response && response.statusCode === 200) {
          getvitalDataForChart(response.data);
        } else {
          showMessage({
            message: 'Information',
            description:
              'Authentication Failed. Provided information is not verified.',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(err => {
        setloader(false);
        console.log('error');
        console.log(err);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  function getvitalDataForChart(listData) {
    let newStepList = [
      {
        value: 40,
        label: 'Jan',
        // spacing: 30,
        labelWidth: 20,
        labelTextStyle: {color: 'gray'},
        frontColor: '#177AD5',
        topLabelComponent: () => (
          <Text style={{color: 'black', fontSize: 10}}>50</Text>
        ),
      },
    ];
    console.debug('Just Inside');
    console.debug('Hitting the api inside heart screen');
    // console.debug(vitalValues);
    Object.keys(listData).map(valAtIndex => {
      newStepList.push({
        value: listData[valAtIndex].vitalData[0].value,
        label: listData[valAtIndex].vitalData[0].name.slice(0, 6),
        labelWidth: 40,
        // topLabelComponent: () => (
        //   <Text style={{color: 'black', fontSize: 10}}>
        //     {listData[valAtIndex].vitalData[0].value}
        //   </Text>
        // ),
        // spacing: 100,
      });
    });
    console.log('The new StepList is');
    console.log(newStepList);
    setbarData(newStepList);
    console.log('The new StepList');
    console.log(barData);
  }

  return (
    <Fragment>
      {/* header */}
      <View
        style={{
          backgroundColor: Colors.backgroundMainLogin,
          flex: 1,
        }}>
        <View style={styles.container}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: hp(6.5),
            }}>
            <View style={{flex: 0.25, paddingLeft: hp(1)}}>
              <SvgCss
                xml={Svgs.arrowHeadLeft}
                width={hp(4)}
                height={hp(4)}
                fill={Colors.black}
                onPress={() => {
                  navigation.pop();
                }}
              />
            </View>
            <View style={{flex: 0.6, alignItems: 'center'}}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: hp(2.5),
                  fontFamily: Fonts.SourceSansSemibold,
                }}>
                Symptom Tracker
              </Text>
            </View>
            <View style={{flex: 0.25, alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('NotificationStack')}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginRight: hp(2),
                  }}>
                  <FastImage
                    style={{
                      width: hp(2),
                      height: hp(2.5),
                      // marginRight:-20,
                      // marginHorizontal: hp(3),
                      // marginTop:10,
                    }}
                    source={Images.notification_dashboard}
                  />
                  {/* <TouchableOpacity>
                <SvgCss
                  xml={Svgs.settings_Icon}
                  width={hp(2.2)}
                  height={hp(2.3)}
                  fill={Colors.black}
                  onPress={() => navigation.pop()}
                  style={{marginHorizontal: hp(1.5)}}
                />
              </TouchableOpacity> */}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* header end */}
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.backgroundMainLogin,
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.5,
            shadowRadius: 1.5,
            elevation: 1,
            borderTopColor: Colors.darkGrey1,
            // borderColor: Colors.black,
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            marginTop: hp(2),
            // height: '100%',

            // borderWidth: 1,
            //want this view to cover whole screen in the bottom side
            // backgroundColor: Colors.white,
          }}>
          <ScrollView
            style={{
              // marginTop: hp(3),

              // width: '90%',
              // alignItems: 'center',
              // borderTopEndRadius: 30,
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              backgroundColor: Colors.white,

              // backgroundColor: Colors.backgroundMainLogin,
            }}
            contentContainerStyle={{
              width: '90%',
              // elevation: 10,
              // flexGrow: 1,
              // alignItems: 'center',
              alignSelf: 'center',

              // alignContent: 'center',
            }}>
            <View
              style={{
                width: '100%',
                //   alignItems: 'center',
                // paddingLeft: hp(1),
                height: '100%',
                borderTopRightRadius: 24,
                borderTopLeftRadius: 24,
                backgroundColor: Colors.white,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(2.6),
                    fontWeight: '700',
                    marginTop: hp(4),
                    marginBottom: hp(0.4),
                    color: Colors.black,
                  }}>
                  Which type of {'\n'}Symptom do you have ?
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(1.7),
                    fontWeight: '400',
                    marginTop: hp(2),
                    marginBottom: hp(0.4),
                    color: Colors.black,
                  }}>
                  Select the option and click on the severity of {'\n'}your
                  feelings.
                </Text>
              </View>
              <View
                style={{
                  paddingBottom: hp(2),
                }}></View>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: Dimensions.get('window').width * 0.45,
                      width: Dimensions.get('window').width * 0.45,
                      borderRadius: Math.round(
                        (Dimensions.get('window').height +
                          Dimensions.get('window').width) /
                          2,
                      ),
                      backgroundColor: Colors.symtomsColorOrange,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    underlayColor="#ccc"
                    onPress={() => {
                      console.log('Symtom Tracker Screen');
                      navigation.navigate('DepressiveScreen', {
                        navigation: navigation,
                        symptomHeading: 'Depressive',
                      });
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontWeight: '600',
                        fontSize: hp(2),
                      }}>
                      {' '}
                      Depressive{' '}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      paddingLeft: hp(1.5),
                      paddingTop: hp(4.7),
                    }}>
                    <TouchableOpacity
                      style={{
                        height: Dimensions.get('window').width * 0.4,
                        width: Dimensions.get('window').width * 0.4,
                        borderRadius: Math.round(
                          (Dimensions.get('window').height +
                            Dimensions.get('window').width) /
                            2,
                        ),
                        backgroundColor: Colors.symtomsColorGreen,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      underlayColor="#ccc"
                      onPress={() => {
                        console.log('Symtom Tracker Screen');
                        navigation.navigate('DepressiveScreen', {
                          navigation: navigation,
                          symptomHeading: 'Anxiety',
                        });
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansPro,
                          fontWeight: '600',
                          fontSize: hp(2),
                        }}>
                        {' '}
                        Anxiety{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    paddingLeft: hp(7),
                    marginTop: hp(-1.5),
                    // marginBottom:hp(2),
                  }}>
                  <TouchableOpacity
                    style={{
                      height: Dimensions.get('window').width * 0.42,
                      width: Dimensions.get('window').width * 0.42,
                      borderRadius: Math.round(
                        (Dimensions.get('window').height +
                          Dimensions.get('window').width) /
                          2,
                      ),
                      backgroundColor: Colors.symtomsColorBlue,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    underlayColor="#ccc"
                    onPress={() => {
                      console.log('Symtom Tracker Screen');
                      navigation.navigate('DepressiveScreen', {
                        navigation: navigation,
                        symptomHeading: 'Manic',
                      });
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansPro,
                        fontWeight: '600',
                        fontSize: hp(2),
                      }}>
                      {' '}
                      Manic{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Fragment>
  );
};

export default SymptomTrackerScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BgColor,
    marginTop: hp(1),
  },
});
