import NewAssessment from './NewAssessment';
import PendingAssessment from './PendingAssessment';
import CompletedAssessmentNew from './CompletedAssessmentNew';
import CompletedAssessment from './CompletedAssessment';
import Colors from '../../../../../config/Colors';
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
import TabAssessmentCount from '../../components/assessmentQuestions/TabAssessmentCount';
import {TouchableOpacity} from 'react-native-gesture-handler';
function AssessmentTab({navigation}) {
  const [index, setIndex] = useState(0);
  const [newBtn, SetNewBtn] = useState(true);
  const [completeBtn, setCompleteBtn] = useState(false);
  const [routes] = useState([
    {key: 'first', title: 'New'},
    {key: 'second', title: 'Completed'},
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
            backgroundColor: Colors.bleLayer4,
            width: Platform.OS === 'ios' ? '90%' : hp(44),
            borderRadius: hp(1),
          }}>
          <TouchableOpacity
            style={{
              // paddingHorizontal: hp(8),
              // paddingVertical: hp(1.7),
              minWidth: Platform.OS === 'ios' ? '50%' : hp('23%'),
              height: Platform.OS === 'android' ? hp(6) : hp(7),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: newBtn ? Colors.blueTextColor : Colors.bleLayer4,
              borderRadius: hp(1),
            }}
            onPress={() => {
              SetNewBtn(true);
              setCompleteBtn(false);
            }}>
            <Text style={{color: newBtn ? Colors.white : Colors.noRecordFound}}>
              New
            </Text>
            <View
              style={{
                position: 'absolute',
                right: Platform.OS === 'ios' ? '35%' : '36%',
                top: '20%',
                backgroundColor: Colors.badgeGreen,
                borderRadius: 10,
                width: 10,
                height: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* <TabAssessmentCount tintColor={Colors.redBorder} /> */}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              minWidth: Platform.OS === 'ios' ? '50%' : hp('23%'),
              height: Platform.OS === 'android' ? hp(6) : hp(7),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: completeBtn
                ? Colors.blueTextColor
                : Colors.bleLayer4,
              borderRadius: hp(1),
              shadowRadius: 5,
              marginLeft: Platform.OS === 'ios' ? hp(0.1) : hp(0),
            }}
            onPress={() => {
              setCompleteBtn(true);
              SetNewBtn(false);
            }}>
            <Text
              style={{
                color: completeBtn ? Colors.white : Colors.noRecordFound,
              }}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: Platform.OS === 'ios' ? '83.5%' : '84.5%',
          marginTop: hp(2),
        }}>
        {newBtn ? (
          <PendingAssessment navigation={navigation} />
        ) : (
          <CompletedAssessment navigation={navigation} />
        )}
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

export default AssessmentTab;
