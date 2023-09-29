import {
  Dimensions,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import React, {Fragment, useState} from 'react';
import {SceneMap, TabView, TabBar} from 'react-native-tab-view';

import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../../../config/Colors';
function HeightTab({navigation}) {
  const [index, setIndex] = useState(0);
  const [cmBtn, SetCmBtn] = useState(true);
  const [ftBtn, setFtBtn] = useState(false);
  const [routes] = useState([
    {key: 'first', title: 'cm'},
    {key: 'second', title: 'ft'},
  ]);
  const initialLayout = {width: Dimensions.get('window').width};

  return (
    <View>
      <View
        style={{
          // marginTop: hp(2),
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: colors.bleLayer4,
            width: Platform.OS === 'ios' ? '67%' : hp(20),
            borderRadius: hp(4),
          }}>
          <TouchableOpacity
            style={{
              // paddingHorizontal: hp(8),
              // paddingVertical: hp(1.7),
              minWidth: Platform.OS === 'ios' ? '50%' : hp('23%'),
              height: Platform.OS === 'android' ? hp(4) : hp(4),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: cmBtn ? colors.blueTextColor : colors.bleLayer4,
              borderRadius: hp(4),
            }}
            onPress={() => {
              SetCmBtn(true);
              setFtBtn(false);
            }}>
            <Text style={{color: cmBtn ? colors.white : colors.noRecordFound}}>
              cm
            </Text>
            <View
              style={{
                position: 'absolute',
                right: Platform.OS === 'ios' ? '30%' : '30%',
                top: '20%',
                // backgroundColor: colors.badgeGreen,
                borderRadius: hp(4),
                width: 5,
                height: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* <TabAssessmentCount tintColor={Colors.redBorder} /> */}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              minWidth: Platform.OS === 'ios' ? '48%' : hp('23%'),
              height: Platform.OS === 'android' ? hp(4) : hp(4),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: ftBtn ? colors.blueTextColor : colors.bleLayer4,
              borderRadius: hp(4),
              shadowRadius: 5,
              marginLeft: Platform.OS === 'ios' ? hp(0) : hp(0),
            }}
            onPress={() => {
              setFtBtn(true);
              SetCmBtn(false);
            }}>
            <Text
              style={{
                color: ftBtn ? colors.white : colors.noRecordFound,
              }}>
              ft
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          //   height: Platform.OS === 'ios' ? '83.5%' : '84.5%',
          marginTop: hp(2),
        }}>
        {cmBtn ? <View></View> : <View></View>}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#369',
    overflow: 'hidden',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  indicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0084ff',
    margin: 6,
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default HeightTab;
