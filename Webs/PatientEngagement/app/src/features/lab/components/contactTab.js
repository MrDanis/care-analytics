//import liraries
import React, {Component, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  StatusBar,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import HistoryIcon from '../../../../../assets/svg/icon_history.svg';
import images from '../../../../../app/config/Images';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import colors from '../../../../config/Colors';
import { ColorSpace } from 'react-native-reanimated';

const ContactTab = props => {
    return (
      <View
        style={{flexDirection: 'column', height: hp(20), alignItems: 'center'}}>
        <Image source={props.iconimage} style={{tintColor: colors.red}} />
        <Text
          style={{
            paddingTop: props.name === 'Care Coordinator' ? hp(1.3) : hp(0),
            color: colors.black2,
            fontSize: hp(1.9),
          }}>
          {props.name}
        </Text>
      </View>
    );
}

export default ContactTab;