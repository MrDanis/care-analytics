//import liraries
import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors, Images} from '../../../../../config';
import {Fonts} from '../../../../../config/AppConfig';

// create a component
const TakePicModalize = ({
  onCloseTakePic,
  onOpenTakePic,
  onOpenLabModal,
  onOpenImagingModal,
}) => {
 
  return (
    <View style={styles.container}>
      <Text
        style={{
          marginVertical: hp(3),
          color: Colors.black,
          fontFamily: Fonts.SourceSansSemibold,
          fontSize: hp(2.2),
        }}>
        Select Type
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: hp(3),
          justifyContent: 'space-evenly',
          width: '80%',
        }}>
        <TouchableOpacity
          onPress={() => {
            onCloseTakePic();
            onOpenLabModal();
          }}
          style={{alignItems: 'center'}}>
          <View
            style={{
              width: hp(6),
              height: hp(6),
              backgroundColor: Colors.green_lab,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FastImage
              resizeMode="contain"
              style={{width: hp(4.5), height: hp(4.5)}}
              source={Images.lab_icon_dashboard}
            />
          </View>
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.7),
              marginVertical: hp(1),
              width: hp(9),
              textAlign: 'center',
            }}>
            Lab Results
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{alignItems: 'center'}}>
          <View
            style={{
              width: hp(6),
              height: hp(6),
              backgroundColor: Colors.blueTextColor,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FastImage
              resizeMode="contain"
              style={{width: hp(4.5), height: hp(4.5)}}
              source={Images.medication_FabButton}
            />
          </View>
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.7),
              marginVertical: hp(1),
              width: hp(9),
              textAlign: 'center',
            }}>
            Add Medication
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            onCloseTakePic();
            onOpenImagingModal();
          }}
          style={{alignItems: 'center'}}>
          <View
            style={{
              width: hp(6),
              height: hp(6),
              backgroundColor: Colors.red_imaging,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FastImage
              resizeMode="contain"
              style={{width: hp(4.5), height: hp(4.5)}}
              source={Images.imaging_icon}
            />
          </View>
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.SourceSansRegular,
              fontSize: hp(1.7),
              marginVertical: hp(1),
              width: hp(9),
              textAlign: 'center',
            }}>
            Radiology & Imaging{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default TakePicModalize;
