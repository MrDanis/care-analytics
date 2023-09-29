import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useState, useEffect, Fragment} from 'react';

import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors, Images, Svgs} from '../../../../config';
import React from 'react';
import {SvgCss} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../config/AppConfig';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {propTypes} from 'reinput';

import MainHeader from '../../mycare/components/MainHeader';
import FastImage from 'react-native-fast-image';

const MedicationEssentialScreen = ({navigation}) => {
  return (
    <Fragment>
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.backgroundMainLogin}}>
        <MainHeader navigation={navigation} name={'Meditation Essentials'}>
          <View
            style={{
              paddingVertical: hp(1),
            }}></View>
          {/* Body */}

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              flex: 1,
              backgroundColor: Colors.backgroundMainLogin,
            }}>
            <ScrollView>
              {/* /// Top Heading SVG */}

              <View
                style={{
                  marginTop: hp(-5),
                }}>
                <SvgCss
                  style={{
                    marginBottom: hp(-6),
                  }}
                  xml={Svgs.wellnes_meditation_eseential_icon}
                  width={hp(42)}
                  height={hp(42)}
                  fill={Colors.black}
                  onPress={() => navigation.pop()}
                />
              </View>

              {/* /// Guide for beginners */}
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(2.5),
                    fontWeight: '600',
                    fontFamily: Fonts.SourceSansPro,
                    marginBottom: hp(1),
                  }}>
                  Guide for beginners
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.5),
                    fontWeight: '400',
                    fontFamily: Fonts.SourceSansPro,
                    marginBottom: hp(1.7),
                  }}>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using 'Content
                  here, content here', making it look like readable English.
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(2),
                    fontWeight: '600',
                    fontFamily: Fonts.SourceSansPro,
                    marginBottom: hp(2),
                  }}>
                  Health Benefits of Meditation
                </Text>
              </View>
              {/* /// Health Benefits Grid Box */}

              {/* // Top Boxes */}
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                }}>
                {/* First Box */}
                <View
                  style={{
                    backgroundColor: Colors.white,
                    width: hp(20),
                    height: hp(13),
                    shadowOffset: {width: 0.5, height: 0.5},
                    shadowOpacity: 0.2,
                    shadowRadius: 0.4,
                    elevation: 1,
                    // borderColor: Colors.darkGrey1,
                    // borderColor: Colors.black,
                    borderRadius: 10,
                    // borderTopRightRadius: 10,
                    // borderTopLeftRadius: 10,
                    flexDirection: 'column',
                  }}>
                  <SvgCss
                    style={{
                      marginTop: hp(-6.5),
                      // marginLeft:hp(2.3)
                    }}
                    xml={Svgs.wellnes_meditation_healthintersect1_icon}
                    width={hp(27)}
                    height={hp(20)}
                    fill={Colors.black}
                    // onPress={() => navigation.pop()}
                  />
                  <View
                    style={{
                      marginTop: hp(-5),
                      // marginLeft:hp(2.3)
                    }}>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Meditation
                    </Text>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Techniques
                    </Text>
                  </View>
                </View>

                {/* Second box */}
                <View
                  style={{
                    padding: hp(0.8),
                  }}
                />
                <View
                  style={{
                    backgroundColor: Colors.white,
                    width: hp(20),
                    height: hp(13),
                    shadowOffset: {width: 0.5, height: 0.5},
                    shadowOpacity: 0.2,
                    shadowRadius: 0.4,
                    elevation: 1,
                    // borderColor: Colors.darkGrey1,
                    // borderColor: Colors.black,
                    borderRadius: 10,
                    // borderTopRightRadius: 10,
                    // borderTopLeftRadius: 10,
                    flexDirection: 'column',
                  }}>
                  <SvgCss
                    style={{
                      marginTop: hp(-6.5),
                      // marginLeft:hp(2.3)
                    }}
                    xml={Svgs.wellnes_meditation_healthintersect1_icon}
                    width={hp(27)}
                    height={hp(20)}
                    fill={Colors.black}
                    // onPress={() => navigation.pop()}
                  />
                  <View
                    style={{
                      marginTop: hp(-5),
                      // marginLeft:hp(2.3)
                    }}>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Meditation
                    </Text>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Techniques
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  padding: hp(2),
                }}
              />

              {/* // Bottom Boxes */}
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                }}>
                {/* Third Box */}
                <View
                  style={{
                    backgroundColor: Colors.white,
                    width: hp(20),
                    height: hp(13),
                    shadowOffset: {width: 0.5, height: 0.5},
                    shadowOpacity: 0.2,
                    shadowRadius: 0.4,
                    elevation: 1,
                    // borderColor: Colors.darkGrey1,
                    // borderColor: Colors.black,
                    borderRadius: 10,
                    // borderTopRightRadius: 10,
                    // borderTopLeftRadius: 10,
                    flexDirection: 'column',
                  }}>
                  <SvgCss
                    style={{
                      marginTop: hp(-8.5),
                      // marginLeft:hp(2.3)
                    }}
                    xml={Svgs.wellnes_meditation_healthintersect2_icon}
                    width={hp(27.3)}
                    height={hp(24)}
                    fill={Colors.black}
                    onPress={() => navigation.pop()}
                  />
                  <View
                    style={{
                      marginTop: hp(-7),
                      // marginLeft:hp(2.3)
                    }}>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Meditation
                    </Text>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Techniques
                    </Text>
                  </View>
                </View>

                {/* Fourth Box */}
                <View
                  style={{
                    padding: hp(0.8),
                  }}
                />
                <View
                  style={{
                    backgroundColor: Colors.white,
                    width: hp(20),
                    height: hp(13),
                    shadowOffset: {width: 0.5, height: 0.5},
                    shadowOpacity: 0.2,
                    shadowRadius: 0.4,
                    elevation: 1,
                    // borderColor: Colors.darkGrey1,
                    // borderColor: Colors.black,
                    borderRadius: 10,
                    // borderTopRightRadius: 10,
                    // borderTopLeftRadius: 10,
                    flexDirection: 'column',
                  }}>
                  <SvgCss
                    style={{
                      marginTop: hp(-8),
                      marginLeft: hp(0.1),
                    }}
                    xml={Svgs.wellnes_meditation_healthintersect3_icon}
                    width={hp(22.5)}
                    height={hp(23)}
                    fill={Colors.black}
                    // onPress={() => navigation.pop()}
                  />
                  <View
                    style={{
                      marginTop: hp(-6.5),
                      // marginLeft:hp(2.3)
                    }}>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Meditation
                    </Text>
                    <Text
                      style={{
                        marginLeft: hp(1.2),
                        color: 'black',
                        fontSize: hp(1.7),
                        fontWeight: '500',
                        fontFamily: Fonts.SourceSansPro,
                      }}>
                      Benefits
                    </Text>
                  </View>
                </View>
              </View>

              {/* Meditation Tip of The Day */}
              <View>
                <SvgCss
                  style={{
                    marginTop: hp(-6),
                    marginLeft: hp(0.1),
                  }}
                  xml={Svgs.wellnes_meditation_tipday_icon}
                  width={hp(43)}
                  height={hp(33)}
                  fill={Colors.black}
                  onPress={() => navigation.pop()}
                />
              </View>

              {/* Try a free guide */}
              <View>
                <Text
                  style={{
                    marginTop: hp(-8),
                    color: 'black',
                    fontSize: hp(2),
                    fontWeight: '600',
                    fontFamily: Fonts.SourceSansPro,
                    marginBottom: hp(2),
                  }}>
                  Try a free guide of Meditation
                </Text>
              </View>
            </ScrollView>
          </View>
        </MainHeader>
      </SafeAreaView>
    </Fragment>
  );
};

export default MedicationEssentialScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: Colors.BgColor,
  },
});
