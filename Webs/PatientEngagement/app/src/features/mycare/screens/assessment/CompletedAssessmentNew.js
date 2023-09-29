/* istanbul ignore file */
import React, {Component, Fragment, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
  Dimensions,
  useWindowDimensions,
  Animated,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import Images from '../../../../../config/Images';
import {Fonts} from '../../../../../config/AppConfig';
import AssessmentItem from '../../components/AssessmentItem';
import Spinner from 'react-native-loading-spinner-overlay';
import AssessmentService from '../../../../api/assesment';
import {showMessage} from 'react-native-flash-message';

let willFocusSubscription = null;

const CompletedAssessmentNew = ({navigation}) => {
  const [assessmentData, setAssessmentData] = useState(['1', '2']);
  const [loader, setLoader] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: Colors.red,
          alignSelf: 'flex-end',
        }}
      />
    );
  };
  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    getCompletedAssessment();
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  useEffect(() => {
    getCompletedAssessment();
    willFocusSubscription = navigation.addListener('willFocus', async () => {
      getCompletedAssessment();
    });
  }, []);
  const getCompletedAssessment = () => {
    setLoader(true);
    setIsRefreshing(false);
    AssessmentService.getCompletedAssessmentsList()
      .then(res => {
        console.log('Vitals');
        console.log(res);
        if (res.statusCode === 200) {
          setAssessmentData(res.data);
          global.newAssessmentCount = res.data.length;
          // dispatch(getVitalCategoryData(res.data));
          setLoader(false);
        }
      })
      .catch(err => {
        setLoader(false);
        setAssessmentData([]);
        global.newAssessmentCount = 0;
        // dispatch(getVitalCategoryData([]));
        console.log('getPendingAssessmentsList error');
        console.log(err);
        showMessage({
          message: 'Information',
          description: err.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };
  return (
    <SafeAreaView
      style={{flex: 1, height: '100%', backgroundColor: Colors.backgroundMain}}>
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {assessmentData.length ? (
          <View
            style={{
              margin: hp(1),
              flex: 1,
              width: '100%',
              backgroundColor: Colors.white,
            }}>
            <FlatList
              data={assessmentData}
              // extraData={isRefreshing}
              renderItem={({item}) => (
                <AssessmentItem
                  item={item}
                  navigation={navigation}
                  completed={false}
                />
              )}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              // keyExtractor={item => item.assessmentID}
              ItemSeparatorComponent={renderSeparator}
              refreshControl={
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }>
            <View
              style={{
                width: '100%',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                height: '100%',
              }}>
              <Image
                source={Images.emptyIcon}
                style={{
                  alignSelf: 'center',
                  height: hp(16),
                  width: hp(18),
                }}
              />
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontFamily: Fonts.SourceSansSemibold,
                  color: Colors.regularLabel,
                  marginTop: hp(4),
                  marginRight: hp(10),
                  marginLeft: hp(10),
                  textAlign: 'center',
                }}>
                No Record Found
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonBGColor,
    borderColor: Colors.blueTextColor,
    marginTop: hp(2),
  },
  textFieldCont: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
    marginVertical: hp(1.5),
  },
  textContainer: {
    flexDirection: 'row',
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputStyle: {
    flex: 1,
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    color: '#424242',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    flexDirection: 'row',
  },
});
export default CompletedAssessmentNew;
