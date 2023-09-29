// import {View, Text} from 'react-native';
import {useState, useEffect, Fragment} from 'react';

import CalendarStrip from 'react-native-calendar-strip';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
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
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
// import Slider from '@react-native-community/slider';

// import styled from 'styled-components/native';
// import AnalogClock from 'react-native-clock-analog';
import colors from '../../../../../../config/Colors';

// import CircularProgress from 'react-native-circular-progress-indicator';

const SymptomSliderScreen = ({navigation, route}) => {
  const buttonName = route.params.buttonName;
  // const {navigationObject} = props.route.params;
  // const [navigation, setnavigation] = useState(navigationObject);
  const [sliderText, setSliderText] = useState('Low');

  const [isModalVisible, setModalVisible] = useState(false);
  const gradientColors = ['#DE445D', '#2962FF'];
  const [date, setDate] = useState(
    moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );

  const [loader, setloader] = useState(false);
  useEffect(() => {
    const defaultValueFromApi = 0;
    setDefaultValue(defaultValueFromApi);
    setSliderValue(defaultValueFromApi);
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
  enableScroll = () => this.setState({scrollEnabled: true});
  disableScroll = () => this.setState({scrollEnabled: false});
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animateTextChange = newText => {
    const shouldSlideDown = sliderValue < 50; // Check if slider is moving down

    translateY.value = withTiming(shouldSlideDown ? -30 : 30, {
      duration: 300,
      easing: Easing.linear,
    });
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.linear,
    });

    setTimeout(() => {
      translateY.value = withSpring(0, {damping: 10, stiffness: 80});
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.linear,
      });

      setSliderText(newText); // Update the new text
    }, 300);
  };

  // Animated style for the text
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    };
  });
  const multiSliderValuesChange = values => {
    console.log('====================================');
    console.log('here i will set that state ', values);
    console.log('====================================');
    const newVal = values[0];
    setSliderValue(newVal);
    let newSliderText = 'Low';
    if (newVal > 25 && newVal <= 50) {
      newSliderText = 'Moderate';
    } else if (newVal > 50 && newVal <= 75) {
      newSliderText = 'Somewhat Low';
    } else if (newVal > 75 && newVal <= 99) {
      newSliderText = 'Moderately High';
    } else if (newVal > 99) {
      newSliderText = 'High';
    }
    animateTextChange(newSliderText);
    if (newVal !== defaultValue) {
      console.log('Slider value is over 50%');
      setshowSave('yes');
      // add your logic here to update the text below the slider
    } else {
      console.log('Slider value is the same as API');
      setshowSave('no');
    }
  };

  const [showSave, setshowSave] = useState('no');

  const [defaultValue, setDefaultValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(defaultValue);
  const renderMarker = ({currentValue}) => {
    const markerColor =
      currentValue > 50 ? Colors.sliderBlueColor : Colors.sliderRedColor;
    const markerStyle = {
      backgroundColor: markerColor,
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    };
    return (
      <View style={markerStyle}>
        <View style={styles.markerText}></View>
      </View>
    );
  };

  return (
    <Fragment>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundMainLogin,
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
          }}>
          <View
            style={{
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              backgroundColor: Colors.white,
              width: '100%',
              paddingLeft: hp(0.5),
              paddingRight: hp(0.5),
              alignSelf: 'center',
            }}
            contentContainerStyle={
              {
                // width: '90%',
                // alignSelf: 'center',
              }
            }>
            <View
              style={{
                width: '100%',
                //   alignItems: 'center',
                // paddingLeft: hp(1),
                height: '100%',
                borderTopRightRadius: 24,
                borderTopLeftRadius: 24,
                backgroundColor: Colors.white,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View>
                <View>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansPro,
                      fontSize: hp(2.6),
                      fontWeight: '700',
                      marginTop: hp(4),
                      color: Colors.TextColor,
                      alignSelf: 'center',
                    }}>
                    Depressive
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansPro,
                      fontSize: hp(3.6),
                      fontWeight: '700',
                      marginTop: hp(4),
                      //   marginBottom: hp(0.4),
                      color: Colors.black,
                      //   alignContent:'center',
                      //   alignItems:'center',
                      alignSelf: 'center',
                    }}>
                    {'Measure your'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansPro,
                      fontSize: hp(3.6),
                      fontWeight: '700',
                      color: Colors.black,
                      marginTop: hp(-4),
                      alignSelf: 'center',
                      //   alignContent: 'flex-start',
                      //   alignItems: 'flex-start',
                      //   justifyContent: 'flex-start',
                    }}>
                    {'\nselected Symptom'}
                  </Text>
                </View>
                <View
                  style={{
                    paddingBottom: hp(2),
                  }}></View>
                {/* <View
                  style={{
                    flexDirection: 'column',
                  }}></View> */}
                {/* <View style={styles.app}>
                  <FlatList
                    ItemSeparatorComponent={() => (
                      <View style={{padding: 20}} />
                    )}
                    data={itemData}
                    numColumns={2}
                    renderItem={Item}
                    keyExtractor={item => item.alt}
                  />
                </View>
                 */}
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(2.6),
                    fontWeight: '700',
                    marginTop: hp(4),
                    color: Colors.greenTextColor,
                    alignSelf: 'center',
                  }}>
                  {buttonName}
                </Text>

                {/* <Slider
                  style={{width: 200, height: 40}}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#2962FF"
                /> */}
                {/* <ScrollView scrollEnabled={this.state.scrollEnabled}> */}
                <View style={styles.sliderContainer}>
                  <LinearGradient
                    colors={gradientColors}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.gradientOverlay}
                  />
                  <MultiSlider
                    customMarker={renderMarker}
                    onValuesChange={multiSliderValuesChange}
                    sliderLength={hp(39.5)}
                    values={[sliderValue]}
                    min={0}
                    // step={25}
                    max={100}
                    containerStyle={{
                      height: 100,
                      marginLeft: hp(4),
                      marginRight: hp(4),
                      maxWidth: '90%',
                      alignSelf: 'center',
                    }}
                    //   markerContainerStyle={{width:100}}
                    trackStyle={{
                      height: hp(1),
                      backgroundColor: 'transparent',
                      maxWidth: '90%',
                      // backgroundColor: 'red',
                    }}
                    //   width={hp(10)}
                    unselectedStyle={{
                      containerColor: 'red',
                    }}
                    selectedStyle={{
                      backgroundColor: 'transparent',
                    }}

                    //   onValuesChangeStart={this.disableScroll}
                    //   onValuesChangeFinish={this.enableScroll}
                  />
                </View>
                <Text style={styles.sliderText}>{sliderText}</Text>
                {/* {sliderValue > 50 ? (
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansPro,
                      fontSize: hp(3.6),
                      fontWeight: '700',
                      marginTop: hp(4),
                      //   marginBottom: hp(0.4),
                      color: Colors.black,
                      //   alignContent:'center',
                      //   alignItems:'center',
                      alignSelf: 'center',
                    }}>
                    {'High'}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansPro,
                      fontSize: hp(3.6),
                      fontWeight: '700',
                      marginTop: hp(4),
                      //   marginBottom: hp(0.4),
                      color: Colors.black,
                      //   alignContent:'center',
                      //   alignItems:'center',
                      alignSelf: 'center',
                    }}>
                    {'Low'}
                  </Text>
                )} */}
              </View>
              <View
                style={{
                  marginBottom: hp(1),
                  width: '90%',
                  alignSelf: 'center',
                }}>
                {showSave === 'yes' ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Symptoms')}
                    style={{
                      paddingTop: hp(8),
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        padding: 20,
                        borderRadius: hp(1),
                        backgroundColor: Colors.blueBackground,
                      }}>
                      <Text
                        style={{
                          color: Colors.white,
                          fontFamily: Fonts.SourceSansPro,
                          fontWeight: '600',
                          fontSize: hp(2),
                        }}>
                        Save
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      paddingTop: hp(8),
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        padding: 20,
                        borderRadius: hp(1),
                        backgroundColor: Colors.bgGrey,
                      }}>
                      <Text
                        style={{
                          color: Colors.darkgrey,
                          fontFamily: Fonts.SourceSansPro,
                          fontWeight: '600',
                          fontSize: hp(2),
                        }}>
                        Save
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Fragment>
  );
};
// Styles
const styles = StyleSheet.create({
  markerText: {
    borderWidth: 1,
    borderColor: Colors.white,
    padding: hp(1),
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  item: {
    flex: 1,
    maxWidth: '50%', // 100% devided by the number of rows you want
    alignItems: 'center',
    // marginRight: index % 2 !== 0 ? 0 : 10,
    padding: 20,
    backgroundColor: 'rgba(249, 180, 45, 0.25)',
    borderWidth: 1,

    // borderColor:Colors.blueBackground,
    backgroundColor: Colors.blueBackground,
  },
  sliderContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: '42%',
    height: hp(1),
    left: 0,
    right: 0,
    borderRadius: 10,
    marginLeft: hp(1.5),
    marginRight: hp(1.5),
  },
  sliderText: {
    fontFamily: Fonts.SourceSansPro,
    fontSize: hp(3.6),
    fontWeight: '700',
    color: Colors.black,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: Colors.BgColor,
    marginTop: hp(1),
  },
});

export default SymptomSliderScreen;
