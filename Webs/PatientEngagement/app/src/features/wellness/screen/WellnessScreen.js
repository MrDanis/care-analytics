import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  getWeather,
  dailyForecast,
  showWeather,
  getLocation,
} from 'react-native-weather-api';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import {Colors, Images, Svgs} from '../../../../config';
import {ApiKeyWeather} from '../../../../config/AppConfig';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {Fonts} from '../../../../config/AppConfig';
import colors from '../../../../config/Colors';
import {SvgCss} from 'react-native-svg';
import MeditationCardComponent from './components/meditation_card_component';
import {useFocusEffect} from '@react-navigation/native';

const WellnessScreen = ({navigation}) => {
  let temp;
  let wind;
  const [currentWeather, setCurrentWeather] = useState(0);
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      getWeatherUpdate();
    }, []),
  );
  const getWeatherUpdate = () => {
    getLocation().then(location => {
      console.log('====================================');
      console.log('logger loc', location);
      console.log('====================================');
      getWeather({
        key: ApiKeyWeather,
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        unit: 'metric',
      }).then(() => {
        let data = new showWeather();
        setData(data);
        temp = Math.floor(data.temp);
        wind = data.wind;
        console.log('====================================');
        console.log(data, 'temp', temp, 'wind', wind);
        console.log('====================================');
        setCurrentWeather(temp);
      });
    });
  };
  // const [shortCutsItem, setshortCutsItem] = useState([
  //   {
  //     svg: Svgs.wellness_meditation_icon,
  //     intersection: Svgs.wellness_meditation_icon_intersection,
  //     name: 'Meditation Essentials',
  //     id: 0,
  //   },
  //   {
  //     svg: Svgs.wellness_stress_icon,
  //     intersection: Svgs.wellness_stress_icon_intersection,
  //     name: 'Discounts',
  //     id: 1,
  //   },
  //   {
  //     svg: Svgs.wellness_sleep_icon,
  //     intersection: Svgs.wellness_sleep_icon_intersection,
  //     name: 'Take Pic',
  //     id: 2,
  //   },
  //   {
  //     svg: Svgs.wellness_meditation_icon_intersection,
  //     intersection: Svgs.wellness_stress_icon,
  //     name: 'Urgent Care',
  //     id: 3,
  //   },
  // ]);
  const StormCloud = (
    <View
      style={{
        marginTop: hp(1),
        backgroundColor: 'white',
        paddingHorizontal: hp(1),
        borderTopLeftRadius: hp(3),
        borderBottomLeftRadius: hp(3),
        paddingVertical: hp(0.5),
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        elevation: 2,
        backgroundColor: colors.white,
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.05,
        shadowRadius: 5,
      }}>
      {/* <SvgCss
        xml={Svgs.wellness_drizling_cloud}
        width={hp(3.5)}
        height={hp(3.5)}
        fill={Colors.black}
        onPress={() => navigation.pop()}
      /> */}

      <FastImage
        style={{
          width: hp(3.5),
          height: hp(5.5),
        }}
        source={{
          uri: data?.icon, // Pass the image URL as the source
          priority: FastImage.priority.normal,
        }}
      />
      <View
        style={{
          flexDirection: 'column',
        }}>
        <Text
          style={{
            alignSelf: 'flex-end',
            paddingRight: hp(0.1),
            fontFamily: Fonts.SourceSansPro,
            fontSize: hp(2),
            fontWeight: '400',
            color: Colors.black,
          }}>
          {currentWeather}°
        </Text>
        <Text
          style={{
            fontFamily: Fonts.SourceSansPro,
            fontSize: hp(1.6),
            fontWeight: '400',
            color: Colors.black,
          }}>
          {data?.description}
        </Text>
      </View>
    </View>
  );
  // const MeditationCard = (props = (
  //   <View
  //     style={{
  //       width: '90%',
  //       alignSelf: 'center',
  //       // marginLeft: hp(1.7),
  //       // marginRight: hp(1.7),
  //       marginTop: hp(2),
  //       borderColor: colors.line,
  //       borderRadius: hp(1),
  //       paddingVertical: hp(0.8),
  //       // paddingLeft: hp(4.0),
  //       // borderTopColor: colors.line,
  //       borderWidth: 0.3,
  //       elevation: 20,
  //       borderBottomWidth: 1,
  //       backgroundColor: colors.white,
  //       shadowOffset: {width: 0.5, height: 0.5},
  //       shadowOpacity: 0.1,
  //       shadowRadius: 8,
  //     }}>
  //     <View
  //       style={{
  //         width: '90%',
  //         alignSelf: 'center',
  //         flexDirection: 'row',
  //       }}>
  //       <View
  //         style={{
  //           alignSelf: 'center',
  //         }}>
  //         <Text
  //           style={{
  //             fontFamily: Fonts.SourceSansPro,
  //             fontSize: hp(2),
  //             fontWeight: '400',
  //             color: Colors.black,
  //           }}>
  //           {props.name}
  //         </Text>
  //       </View>
  //       <View>
  //         <SvgCss
  //           xml={Svgs.wellness_meditation_icon}
  //           width={hp(10.5)}
  //           height={hp(10.5)}
  //           fill={Colors.black}
  //           onPress={() => navigation.pop()}
  //           style={{
  //             zIndex: 1,
  //             marginLeft: hp(10),
  //             marginBottom: hp(-13.4),
  //           }}
  //         />
  //         <SvgCss
  //           xml={Svgs.wellness_meditation_icon_intersection}
  //           width={hp(14.5)}
  //           height={hp(16.5)}
  //           fill={Colors.black}
  //           onPress={() => navigation.pop()}
  //           style={{
  //             marginLeft: hp(6),
  //             marginBottom: hp(-4.5),
  //           }}
  //         />
  //       </View>
  //     </View>
  //   </View>
  // ));
  return (
    <ScrollView
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: Colors.backgroundMainLogin,
      }}>
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <ScrollView>
        {StormCloud}

        <ScrollView
          contentContainerStyle={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
          }}>
          <Pressable
            style={{
              // alignSelf: 'center',
              width: '100%',
              // alignContent: 'center',
              alignItems: 'center',
              
            }}
            onPress={() => {
              console.log('MedicationEssentialScreen Screen');
              navigation.navigate(
                'MedicationEssentialScreen',
                // {navigation: navigation},
                // buttonName: item.text,
              );
            }}>
            <View
              style={{
                // height: hp(10.5),
                width: '90%',
                // alignSelf: 'center',
                // marginLeft: hp(1.7),
                // marginRight: hp(1.7),
                marginTop: hp(2),
                borderColor: colors.line,
                borderRadius: hp(1),
                paddingVertical: hp(0.8),
                // paddingLeft: hp(4.0),
                // borderTopColor: colors.line,
                borderWidth: 0.3,
                elevation: 20,
                borderBottomWidth: 1,
                backgroundColor: Colors.white,
                shadowOffset: {width: 0.5, height: 0.5},
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}>
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  // alignContent: 'flex-end',
                  // alignSelf: 'flex-end',
                  // alignItems: 'stretch',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansPro,
                      fontSize: hp(2),
                      fontWeight: '400',
                      color: Colors.black,
                    }}>
                    Meditation Essentials
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: hp(3),
                    marginBottom: hp(-4.5),
                    marginTop: hp(-4.5),
                  }}>
                  <SvgCss
                    xml={Svgs.wellness_meditation_icon_full}
                    width={hp(17.5)}
                    height={hp(18)}
                    fill={Colors.black}
                    // onPress={() => {
                    //   console.log('MedicationEssentialScreen Screen');
                    //   navigation.navigate('MedicationEssentialScreen', {
                    //     // navigation: navigation,
                    //     // buttonName: item.text,
                    //   });
                    // }}
                  />
                  {/* <SvgCss
              xml={Svgs.wellness_meditation_icon_intersection}
              width={hp(14.5)}
              height={hp(16.5)}
              fill={Colors.black}
              onPress={() => navigation.pop()}
              style={{
                marginLeft: hp(6),
                marginBottom: hp(-4.5),
              }}
            /> */}
                </View>
              </View>
            </View>
          </Pressable>

          <Pressable
          
            style={{
              // height: hp(1),
              width: '90%',
              // alignSelf: 'center',
              // marginLeft: hp(1.7),
              // marginRight: hp(1.7),
              marginTop: hp(2),
              borderColor: colors.line,
              borderRadius: hp(1),
              paddingVertical: hp(0.8),
              // paddingLeft: hp(4.0),
              // borderTopColor: colors.line,
              borderWidth: 0.3,
              elevation: 20,
              borderBottomWidth: 1,
              backgroundColor: Colors.white,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
            onPress={() => {
              console.log('MedicationEssentialScreen Screen');
              navigation.navigate(
                'MedicationEssentialScreen',
                // {navigation: navigation},
                // buttonName: item.text,
              )}}>
            <View
              style={{
                width: '90%',
                // height: hp(8.5),

                alignSelf: 'center',
                // alignContent: 'flex-end',
                // alignSelf: 'flex-end',
                // alignItems: 'stretch',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(2),
                    fontWeight: '400',
                    color: Colors.black,
                  }}>
                  Stress & Anxiety
                </Text>
              </View>
              <View>
                {/* <View
              style={{
                zIndex: 1,
                marginTop: hp(0.5),
                marginLeft: hp(11),
                marginBottom: hp(2),
              }}>
              <SvgCss
                xml={Svgs.wellness_stress_icon}
                width={hp(12.5)}
                height={hp(9.7)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
              />
            </View>  */}
                <View
                  style={{
                    marginTop: hp(-5.4),
                    marginLeft: hp(4.8),
                    marginBottom: hp(-5.2),
                  }}>
                  <SvgCss
                    xml={Svgs.wellness_stress_icon_full}
                    width={hp(20)}
                    height={hp(20)}
                    fill={Colors.black}
                    // onPress={() => navigation.pop()}
                    // style={{
                    //   marginTop: hp(-15.6),
                    //   marginLeft: hp(6.2),
                    //   marginBottom: hp(-3.9),
                    // }}
                  />
                </View>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={{
              // height: hp(1),
              width: '90%',
              // alignSelf: 'center',
              // marginLeft: hp(1.7),
              // marginRight: hp(1.7),
              marginTop: hp(2),
              borderColor: colors.line,
              borderRadius: hp(1),
              paddingVertical: hp(0.8),
              // paddingLeft: hp(4.0),
              // borderTopColor: colors.line,
              borderWidth: 0.3,
              elevation: 20,
              borderBottomWidth: 1,
              backgroundColor: Colors.white,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
            onPress={() => {
              console.log('MedicationEssentialScreen Screen');
              navigation.navigate(
                'MedicationEssentialScreen',
                // {navigation: navigation},
                // buttonName: item.text,
              )}}>
            <View
              style={{
                width: '90%',
                // height: hp(8.5),

                alignSelf: 'center',
                // alignContent: 'flex-end',
                // alignSelf: 'flex-end',
                // alignItems: 'stretch',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  zIndex: 1,
                }}>
                <Text
                  style={{
                    zIndex: -1,
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(2),
                    fontWeight: '400',
                    color: Colors.black,
                  }}>
                  Falling a sleep & waking up
                </Text>
              </View>
              <View>
                {/* <View
              style={{
                zIndex: 1,
                marginTop: hp(0.5),
                marginLeft: hp(11),
                marginBottom: hp(2),
              }}>
              <SvgCss
                xml={Svgs.wellness_stress_icon}
                width={hp(12.5)}
                height={hp(9.7)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
              />
            </View>  */}
                <View
                  style={{
                    marginTop: hp(-4.7),
                    marginLeft: hp(-1),
                    marginBottom: hp(-4.6),
                  }}>
                  <SvgCss
                    xml={Svgs.wellness_sleep_icon_full}
                    width={hp(16.5)}
                    height={hp(18)}
                    fill={Colors.black}
                    // onPress={() => navigation.pop()}
                    // style={{
                    //   marginTop: hp(-15.6),
                    //   marginLeft: hp(6.2),
                    //   marginBottom: hp(-3.9),
                    // }}
                  />
                </View>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={{
              // height: hp(1),
              width: '90%',
              // alignSelf: 'center',
              // marginLeft: hp(1.7),
              // marginRight: hp(1.7),
              marginTop: hp(2),
              borderColor: colors.line,
              borderRadius: hp(1),
              paddingVertical: hp(0.8),
              // paddingLeft: hp(4.0),
              // borderTopColor: colors.line,
              borderWidth: 0.3,
              elevation: 20,
              borderBottomWidth: 1,
              backgroundColor: Colors.white,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
            onPress={() => {
              console.log('MedicationEssentialScreen Screen');
              navigation.navigate(
                'MedicationEssentialScreen',
                // {navigation: navigation},
                // buttonName: item.text,
              );}}
            >
            <View
              style={{
                width: '90%',
                // height: hp(8.5),

                alignSelf: 'center',
                // alignContent: 'flex-end',
                // alignSelf: 'flex-end',
                // alignItems: 'stretch',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(2),
                    fontWeight: '400',
                    color: Colors.black,
                  }}>
                  Personal Growth
                </Text>
              </View>
              <View>
                {/* <View
              style={{
                zIndex: 1,
                marginTop: hp(0.5),
                marginLeft: hp(11),
                marginBottom: hp(2),
              }}>
              <SvgCss
                xml={Svgs.wellness_stress_icon}
                width={hp(12.5)}
                height={hp(9.7)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
              />
            </View>  */}
                <View
                  style={{
                    marginTop: hp(-5),
                    marginLeft: hp(7.2),
                    marginBottom: hp(-4.9),
                    
                  }}>
                  <SvgCss
                    xml={Svgs.wellnes_personalGrowth_icon_full}
                    width={hp(17.5)}
                    height={hp(18.5)}
                    fill={Colors.black}
                    // onPress={() => navigation.pop()}
                    // style={{
                    //   marginTop: hp(-15.6),
                    //   marginLeft: hp(6.2),
                    //   marginBottom: hp(-3.9),
                    // }}
                  />
                </View>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={{
              // height: hp(1),
              width: '90%',
              // alignSelf: 'center',
              // marginLeft: hp(1.7),
              // marginRight: hp(1.7),
              marginTop: hp(2),
              borderColor: colors.line,
              borderRadius: hp(1),
              paddingVertical: hp(0.8),
              // paddingLeft: hp(4.0),
              // borderTopColor: colors.line,
              borderWidth: 0.3,
              elevation: 20,
              borderBottomWidth: 1,
              backgroundColor: Colors.white,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
            onPress={() => {
              console.log('MedicationEssentialScreen Screen');
              navigation.navigate(
                'MedicationEssentialScreen',
                // {navigation: navigation},
                // buttonName: item.text,
              );}}
            >
            <View
              style={{
                width: '90%',
                // height: hp(8.5),

                alignSelf: 'center',
                // alignContent: 'flex-end',
                // alignSelf: 'flex-end',
                // alignItems: 'stretch',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansPro,
                    fontSize: hp(2),
                    fontWeight: '400',
                    color: Colors.black,
                  }}>
                  Healthy Eating
                </Text>
              </View>
              <View>
                {/* <View
              style={{
                zIndex: 1,
                marginTop: hp(0.5),
                marginLeft: hp(11),
                marginBottom: hp(2),
              }}>
              <SvgCss
                xml={Svgs.wellness_stress_icon}
                width={hp(12.5)}
                height={hp(9.7)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
              />
            </View>  */}
                <View
                  style={{
                    marginTop: hp(-5.5),
                    marginLeft: hp(6.7),
                    marginBottom: hp(-5.5),
                  }}>
                  <SvgCss
                    xml={Svgs.wellnes_healthyEating_icon}
                    width={hp(20)}
                    height={hp(20)}
                    fill={Colors.black}
                    // onPress={() => navigation.pop()}
                    // style={{
                    //   marginTop: hp(-15.6),
                    //   marginLeft: hp(6.2),
                    //   marginBottom: hp(-3.9),
                    // }}
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </ScrollView>
        {/* <MeditationCardComponent
          navigation={navigation}
        /> */}
        {/* </ScrollView> */}
      </ScrollView>
    </ScrollView>
  );
};

export default WellnessScreen;

const styles = StyleSheet.create({});
