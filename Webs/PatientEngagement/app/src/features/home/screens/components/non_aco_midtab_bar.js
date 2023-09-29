import {StyleSheet, Image, Text, View, Platform, Pressable} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {Colors, Images} from '../../../../../config';
import {Fonts} from '../../../../../config/AppConfig';

// import {Image} from 'react-native-svg';
import colors from '../../../../../config/Colors';
import {TouchableOpacity} from 'react-native';
import images from '../../../../../config/Images';
// import images from '../../../../../config/Images';

const NonAcoMidTabBar = ({navigation}) => {
  return (
    <>
      {/* Vitals Tab */}
      <Pressable
        onPress={() => {
          navigation.navigate('VitalsStack');
        }}>
        <View
          style={
            Platform.OS === 'ios' ? styles.isIosNonAco : styles.isAndroidNonAco
          }>
          <View
            style={{
              marginBottom: hp(1),
              flexDirection: 'row',
            }}>
            <FastImage
              style={{
                width: 20,
                height: 20,
                // marginLeft: hp(2),
                // marginTop: hp(1.5),
                resizeMode: 'contain',
              }}
              source={Images.vitals_heart_dashboard}
            />
            <View style={{width: hp(20)}}>
              <Text
                style={{
                  paddingHorizontal: hp(0.5),
                  // marginTop: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.black,
                  fontSize: hp(2),
                }}>
                {'Vitals'}
              </Text>
            </View>

            <Text
              style={{
                paddingLeft: hp(10),
                paddingRight: hp(0.5),
                // marginHorizontal: hp(0),
                // marginLeft: 0,
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.blueGrayDisableText,
                fontSize: hp(1.9),
              }}>
              {'Today'}
            </Text>
            <Image
              style={{
                transform: [{rotate: '180deg'}],
                width: hp(1.5),
                height: hp(1.5),
                alignContent: 'center',
                alignSelf: 'center',
                // marginHorizontal: hp(0),
                // marginTop: hp(0.7),
                // fontFamily: Fonts.SourceSansRegular,
                // color: Colors.blueGrayDisableText,
              }}
              source={Images.arrowLeft}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <FastImage
              style={{
                width: 20,
                height: 20,
                // marginLeft: hp(2),
                // marginTop: hp(1.5),
                resizeMode: 'contain',
              }}
              source={Images.bp_dashboard}
            />
            <Text
              style={{
                marginLeft: hp(0.5),
                marginTop: hp(0),
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(2),
                color: Colors.red3,
              }}>
              {'180/80'}
            </Text>
            <Text
              style={{
                marginLeft: hp(0.6),
                // marginTop: hp(0),
                alignSelf: 'center',
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(1.5),
                color: Colors.blueGrayDisableText,
              }}>
              {'mm/hg'}
            </Text>

            <View
              style={{
                alignSelf: 'center',
                // backgroundColor: '#00B8D4',
                marginHorizontal: 6,
                width: 1,
                height: hp(1.6),
                borderLeftColor: '#D9D9D9',
                borderLeftWidth: 1,
                justifyContent: 'center',
              }}></View>

            <FastImage
              style={{
                width: 20,
                height: 20,
                // marginLeft: hp(2),
                // marginTop: hp(1.5),
                resizeMode: 'contain',
              }}
              source={Images.pulse_dashboard}
            />
            <Text
              style={{
                marginLeft: hp(0.5),
                marginTop: hp(0),
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(2),
                color: Colors.red3,
              }}>
              {'60'}
            </Text>
            <Text
              style={{
                marginLeft: hp(0.6),
                // marginTop: hp(0),
                alignSelf: 'center',
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(1.5),
                color: Colors.blueGrayDisableText,
              }}>
              {'bpm'}
            </Text>

            <View
              style={{
                alignSelf: 'center',
                // backgroundColor: '#00B8D4',
                marginHorizontal: 6,
                width: 1,
                height: hp(1.6),
                borderLeftColor: '#D9D9D9',
                borderLeftWidth: 1,
                justifyContent: 'center',
              }}></View>
            <Image
              style={{
                width: 18,
                height: 18,
                resizeMode: 'contain',
                // marginLeft: hp(2),
                marginTop: hp(0.15),
              }}
              source={Images.o2Icon_dashboard}
            />
            <Text
              style={{
                marginLeft: hp(0.5),
                marginTop: hp(0),
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(2),
                color: Colors.red3,
              }}>
              {'60'}
            </Text>
            <Text
              style={{
                marginLeft: hp(0.6),
                // marginTop: hp(0),
                alignSelf: 'center',
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(1.5),
                color: Colors.blueGrayDisableText,
              }}>
              {'SpO2'}
            </Text>

            {/* <View
          style={{
            width: '25%',
            backgroundColor: colors.blueRxColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: hp(7),
            borderRadius: 30,
            elevation: 10,
            height: hp(2.5),
          }}>
          <Text style={{color: Colors.white, fontSize: hp(1.5)}}>
            {'log as Taken'}
          </Text>
        </View> */}
          </View>
        </View>
      </Pressable>
      {/* Medications Tab */}
      <Pressable
        onPress={() => {
          navigation.navigate('MedicationStack');
        }}>
        <View
          style={
            Platform.OS === 'ios' ? styles.isIosNonAco : styles.isAndroidNonAco
          }>
          <View
            style={{
              marginBottom: hp(1),
              flexDirection: 'row',
            }}>
            <FastImage
              style={{
                width: 20,
                height: 20,
                // marginLeft: hp(2),
                // marginTop: hp(1.5),
                resizeMode: 'contain',
              }}
              source={Images.medicationMid_dashboard}
            />
            <View style={{width: hp(20)}}>
              <Text
                style={{
                  paddingHorizontal: hp(0.5),
                  // marginTop: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.black,
                  fontSize: hp(2),
                }}>
                {'Medications'}
              </Text>
            </View>

            <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
                paddingLeft: hp(6),
              }}>
              <Image
                style={{
                  marginHorizontal: hp(0.4),
                  transform: [{rotate: '180deg'}],
                  width: hp(1.5),
                  height: hp(1.5),
                  // alignContent: 'center',
                  // alignSelf: 'center',
                  // marginHorizontal: hp(0),
                  // marginLeft: hp(0.7),
                  // fontFamily: Fonts.SourceSansRegular,
                  // color: Colors.blueGrayDisableText,
                }}
                source={Images.sunIcon_dashboard}
              />
              <Text
                style={{
                  marginHorizontal: hp(0.4),
                  // paddingLeft: hp(9.2),
                  // paddingRight: hp(0.5),
                  // marginHorizontal: hp(0),
                  // marginLeft: 0,
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.blueGrayDisableText,
                  fontSize: hp(1.9),
                }}>
                {'8:00am'}
              </Text>
              <Image
                style={{
                  marginHorizontal: hp(0.4),
                  transform: [{rotate: '180deg'}],
                  width: hp(1.5),
                  height: hp(1.5),
                  alignContent: 'center',
                  alignSelf: 'center',
                  // marginHorizontal: hp(0),
                  // marginTop: hp(0.7),
                  // fontFamily: Fonts.SourceSansRegular,
                  // color: Colors.blueGrayDisableText,
                }}
                source={Images.arrowLeft}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                marginLeft: hp(0.5),
                marginTop: hp(0),
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(1.8),
                color: '#3EAAAB',
              }}>
              {'Aggralise Caffeipen, Neproxin'}
            </Text>

            <View
              style={{
                marginLeft: hp(5),
                paddingLeft: 9,
                paddingRight: 8,
                paddingVertical: 2,
                backgroundColor: colors.bleLayer2,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                // marginLeft: hp(7),
                borderRadius: 20,
                elevation: 1,

                // paddingLeft:
                // height: hp(2.5),
              }}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: hp(1.5),
                  fontWeight: '300',
                  // fontFamily: Fonts.SourceSansRegular,
                }}>
                {'Log as Taken'}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
      {/* FAV BUTTON Tab */}
      <View>
        <View
          style={{
            backgroundColor: Colors.blueTextColor,
            width: 55,
            height: 55,
            borderRadius: 30,
            alignContent: 'flex-end',
            alignSelf: 'flex-end',
            marginRight: hp(2),
            marginTop: hp(-1),
            // alignItems: 'center',
          }}>
          <TouchableOpacity>
            <Image
              style={{
                marginTop: hp(1),
                marginLeft: hp(0.35),
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                width: 35,
                height: 35,
                resizeMode: 'contain',
              }}
              source={images.medication_FabButton}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default NonAcoMidTabBar;

const styles = StyleSheet.create({
  isIosNonAco: {
    flexDirection: 'column',
    padding: hp(2),
    backgroundColor: Colors.white,
    marginTop: hp(3),
    marginLeft: hp(1.7),
    marginRight: hp(1.7),
    borderRadius: hp(1),
    borderColor: Colors.line,
    borderWidth: 0.3,
    elevation: 1,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  isAndroidNonAco: {
    flexDirection: 'column',
    padding: hp(2),
    backgroundColor: Colors.white,
    marginTop: hp(3),
    marginLeft: hp(1.7),
    marginRight: hp(1.7),
    borderRadius: hp(1),
    borderColor: Colors.line,
    borderWidth: 0.3,
    elevation: 2,
  },
});
