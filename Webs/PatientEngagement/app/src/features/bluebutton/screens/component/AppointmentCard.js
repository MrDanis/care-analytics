import React, {useState, useRef} from 'react';
import {Text, View, Dimensions, Image, StyleSheet} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Colors, Images} from '../../../../../config';
import Swiper from 'react-native-swiper';
import {Fonts} from '../../../../../config/AppConfig';
import FastImage from 'react-native-fast-image';
export const SLIDER_WIDTH = Dimensions.get('window').width + 50;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

const data = [
  {
    title: 'Today, 30 August',
    text: "Let's check your schedule today!",
    name: 'Dr.Lawerence',
    time: '10:00am - 11:00am',
  },
  {
    title: 'Today, 30 August',
    text: "Let's check your schedule today!",

    name: 'Dr.Lawerence',
    time: '10:00am - 11:00am',
  },
  {
    title: 'Today, 30 August',
    text: "Let's check your schedule today!",

    name: 'Dr.Lawerence',
    time: '10:00am - 11:00am',
  },
  {
    title: 'Today, 30 August',
    text: "Let's check                 your schedule today!",

    name: 'Dr.Lawerence',
    time: '10:00am - 11:00am',
  },
];

const renderItem = item => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        paddingRight: 15,
        borderRadius: 10,
        // height: heightPercentageToDP(20),
        backgroundColor: Colors.bleLayer2,
      }}>
      <View style={{flex: 3.5}}>
        <Text
          style={{
            marginVertical: 0,
            fontSize: hp(2),
            color: Colors.black,
            fontFamily: Fonts.SourceSansRegular,
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            marginVertical: 10,
            fontSize: hp(3),
            fontFamily: Fonts.SourceSansSemibold,
            lineHeight: hp(3.8),
            color: Colors.black,
            // maxWidth: '90%',
          }}>
          {item.text}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <FastImage
              style={{
                width: hp(5),
                height: hp(5),
                // marginRight:-20,
                // marginHorizontal: hp(3),
                // marginTop:10,
              }}
              source={Images.appointmentImage}
            />
          </View>
          <View style={{marginLeft: hp(1)}}>
            <Text
              style={{
                // marginVertical: 0,
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(2),
                color: Colors.black,
              }}>
              {item.name}
            </Text>
            <Text
              style={{
                // marginVertical: hp(0.3),
                fontFamily: Fonts.SourceSansRegular,
                fontSize: hp(2.1),
                color: Colors.black,
              }}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1}}>
        <FastImage
          style={{
            width: hp(10),
            height: hp(10),
            // marginRight:-20,
            // marginHorizontal: hp(3),
            // marginTop:10,
          }}
          source={Images.locationAppointment}
        />
      </View>
    </View>
  );
};

const AppointmentSlideComponent = () => {
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  return (
    <View
      style={{
        paddingTop: 0,
        height: '50%',
        maxWidth: '92%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bleLayer2,
        borderRadius: 10,
      }}>
      <Swiper
        style={{}}
        paginationStyle={{
          bottom: 15,
        }}
        activeDotColor={Colors.blueTextColor}
        dotColor={Colors.bleLayer4}
        showsButtons={false}>
        {data.map(item => {
          return renderItem(item);
        })}
      </Swiper>
    </View>
  );
};

export default AppointmentSlideComponent;
