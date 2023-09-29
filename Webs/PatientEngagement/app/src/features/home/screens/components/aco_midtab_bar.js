import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import MiddleTabIcon from './middle_tab_icon';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../../../config';

const AcoMidTabBar = ({navigation}) => {
  return Platform.OS === 'ios' ? (
    <View style={{alignItems: 'center'}}>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <View
          style={{
            marginTop: hp(6),
            flexDirection: 'row',
          }}>
          <Pressable
            onPress={() => {
              // Medications
              navigation.navigate('VitalsStack');
              // navigation.navigate('StepCounter');
            }}>
            <MiddleTabIcon
              imageSource={Images.heart_dashboard}
              text={'Vitals'}
            />
          </Pressable>

          <FastImage
            style={{
              width: hp(0.12),
              height: hp(25),
            }}
            source={Images.straightLine_dashboard}
          />
          <Pressable
            onPress={() => {
              // Assessment
              navigation.navigate('MedicationStack');
            }}>
            <MiddleTabIcon
              imageSource={Images.medicine_dashboard}
              text={'Medications'}
            />
          </Pressable>
          <FastImage
            style={{
              width: 0.7,
              height: hp(27),
            }}
            source={Images.straightLine_dashboard}
          />
          {/* <View
              style={{
                paddingRight:10,
              }}>

              </View> */}
          <Pressable onPress={() => navigation.navigate('AppointmentScreen')}>
            <MiddleTabIcon
              imageSource={Images.appointment_dashboard}
              text={'Appointments'}
            />
          </Pressable>
        </View>
        <View style={{marginTop: hp(-14), marginLeft: hp(1.7)}}>
          <FastImage
            style={{
              width: '94%',
              height: hp(0.2),
            }}
            source={Images.horizontalLine_dashboard}
          />
        </View>
      </View>

      <View
        style={{
          marginTop: hp(-2),
          flexDirection: 'column',
        }}>
        <View
          style={{
            // marginLeft: hp(1.7),
            // marginRight: hp(1.7),
            marginTop: hp(5),
            flexDirection: 'row',
            // justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => {
              // Lab
              navigation.navigate('Lab');
            }}>
            <MiddleTabIcon imageSource={Images.lab_dashboard} text={'Labs'} />
          </Pressable>

          <Pressable
            onPress={() => {
              // Assessment
              // navigation.navigate('AssessmentStack');
              navigation.navigate('FindDocStack');
            }}>
            <MiddleTabIcon
              imageSource={Images.assessment_dashboard}
              text={'FindDoc'}
            />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Imaging')}
            style={{
              marginLeft: hp(1.7),
            }}>
            <MiddleTabIcon
              imageSource={Images.body_scan_dashboard}
              text={'Imaging'}
            />
          </Pressable>
        </View>
      </View>
    </View>
  ) : (
    <View style={{borderColor: 'red', borderWidth: 0, marginTop: hp(-2.5)}}>
      <View
        style={{
          flexDirection: 'column',
          borderColor: 'red',
          borderWidth: 0,
        }}>
        <View
          style={{
            // marginLeft: hp(1.7),
            // marginRight: hp(1.7),

            marginTop: hp(6),
            flexDirection: 'row',
            // justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => {
              // Medications
              navigation.navigate('VitalsStack');
              // navigation.navigate('StepCounter');
            }}>
            <MiddleTabIcon
              imageSource={Images.heart_dashboard}
              text={'Vitals'}
            />
          </Pressable>

          <FastImage
            style={{
              width: 1.09,
              height: hp(27),
            }}
            source={Images.straightLine_dashboard}
          />
          <Pressable
            onPress={() => {
              // Assessment
              navigation.navigate('MedicationStack');
            }}>
            <MiddleTabIcon
              imageSource={Images.medicine_dashboard}
              text={'Medications'}
            />
          </Pressable>
          <FastImage
            style={{
              width: 0.7,
              height: hp(25),
              borderColor: 'blue',
              borderWidth: 0,
            }}
            source={Images.straightLine_dashboard}
          />
          {/* <View
            style={{
              paddingRight:10,
            }}>

            </View> */}
          <Pressable
            style={{borderColor: 'pink', borderWidth: 0}}
            onPress={() => navigation.navigate('AppointmentScreen')}>
            <MiddleTabIcon
              imageSource={Images.appointment_dashboard}
              text={'Appointments'}
            />
          </Pressable>
        </View>
        <View
          style={{
            marginTop: hp(-13),
            marginLeft: hp(0.5),
            marginRight: hp(1),
          }}>
          <FastImage
            style={{
              width: hp(50),
              height: hp(0.2),
            }}
            source={Images.horizontalLine_dashboard}
          />
        </View>
      </View>

      <View
        style={{
          marginTop: hp(-2),
          flexDirection: 'column',
        }}>
        <View
          style={{
            // marginLeft: hp(1.7),
            // marginRight: hp(1.7),
            marginTop: hp(5),
            flexDirection: 'row',
            // justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => {
              // Lab
              navigation.navigate('Lab');
            }}>
            <MiddleTabIcon imageSource={Images.lab_dashboard} text={'Labs'} />
          </Pressable>
          <Pressable
            onPress={() => {
              // Assessment
              navigation.navigate('AssessmentStack');
            }}>
            <MiddleTabIcon
              imageSource={Images.assessment_dashboard}
              text={'Screening'}
            />
          </Pressable>
          {/* Hidden by Danish Start */}
          {/* <Pressable
            style={{
              marginLeft: hp(1.7),
            }}>
            <MiddleTabIcon
              imageSource={Images.body_scan_dashboard}
              text={'Imaging'}
            />
          </Pressable> */}
          {/* Hidden by Danish End */}
          <Pressable
            onPress={() => navigation.navigate('Imaging')}
            style={{
              marginLeft: hp(1.7),
            }}>
            <MiddleTabIcon
              imageSource={Images.body_scan_dashboard}
              text={'Imaging'}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AcoMidTabBar;

const styles = StyleSheet.create({});
