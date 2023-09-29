import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

import {Svgs, Colors} from '../../../../../config';
import colors from '../../../../../config/Colors';
import {Fonts} from '../../../../../config/AppConfig';
import {SvgCss} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';

const MeditationCardComponent = ({navigation}) => {
  return (
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
            {navigation: navigation},
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

      <View
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
        }}>
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
                onPress={() => navigation.pop()}
                // style={{
                //   marginTop: hp(-15.6),
                //   marginLeft: hp(6.2),
                //   marginBottom: hp(-3.9),
                // }}
              />
            </View>
          </View>
        </View>
      </View>
      <View
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
        }}>
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
                onPress={() => navigation.pop()}
                // style={{
                //   marginTop: hp(-15.6),
                //   marginLeft: hp(6.2),
                //   marginBottom: hp(-3.9),
                // }}
              />
            </View>
          </View>
        </View>
      </View>
      <View
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
        }}>
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
                onPress={() => navigation.pop()}
                // style={{
                //   marginTop: hp(-15.6),
                //   marginLeft: hp(6.2),
                //   marginBottom: hp(-3.9),
                // }}
              />
            </View>
          </View>
        </View>
      </View>
      <View
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
        }}>
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
                onPress={() => navigation.pop()}
                // style={{
                //   marginTop: hp(-15.6),
                //   marginLeft: hp(6.2),
                //   marginBottom: hp(-3.9),
                // }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MeditationCardComponent;

const styles = StyleSheet.create({});
