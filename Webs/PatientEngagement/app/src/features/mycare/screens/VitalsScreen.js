import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  Linking,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors} from '../../../../config';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import AllVitals from '../components/AllVitals';
import VitalsService from '../../../api/vitals';
import {getVitalCategoryData} from '../action';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import Images from '../../../../config/Images';
import {Fonts} from '../../../../config/AppConfig';
import MainHeader from '../components/MainHeader';
import {useFocusEffect} from '@react-navigation/native';
import { getBloodPressureHK } from '../../../helpers/HealthKit/HealthKitHandler';

let willFocusSubscription = null;

const VitalsScreen = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [vitalsList, setVitalList] = useState([]);
  const [bloodPressure, setBloodPressure] = useState();

  const vitalsData = useSelector(state => state.vitalCategoryData);
  console.log('====================================');
  console.log('vitalCategoryData', vitalsData);
  console.log('====================================');

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      vitalService();
      getBloodPressureHK()
        .then(results => {
          // Handle the resolved results here
          console.log('Received results vitals screen for bp:', results);
          // dispatch(setStepsLive(results.value));
          setBloodPressure(results);
          console.log('Setting the steps COMPLETED CHECK NOW');
          console.log(
            'This is the default of healthKitData',
            // healthKitData.stepsTakenToday,
          );

          // Do something with the results in your homeScreen component
        })
        .catch(error => {
          // Handle any errors that occurred during the execution of x() here
          console.error('Error calling x:', error);
        });
    }, []),
  );

  const vitalService = () => {
    setLoader(true);
    setIsRefreshing(false);
    VitalsService.getVitalCategoryData()
      .then(res => {
        console.log('Vitals');
        console.log(res);
        if (res.statusCode === 200) {
          setVitalList(res.data);
          dispatch(getVitalCategoryData(res.data));
          setLoader(false);
        }
      })
      .catch(err => {
        setLoader(false);
        setVitalList([]);
        dispatch(getVitalCategoryData([]));
        console.log('Vitals Error', vitalsData.length);
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

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    vitalService();
    // and set isRefreshing to false at the end of your callApiMethod()
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: Colors.backgroundMainLogin,
        borderColor:'red',
        borderWidth:0
      }}>
      <MainHeader navigation={navigation} name={'My Vitals'}>
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />

        <View
          style={{
            width: '94%',
            alignSelf: 'center',
            flex: 1,
            borderColor:'green',
            borderWidth:0
            // alignItems:'center',
            //    justifyContent:'center',
          }}>
          {/*{vitalsData.length > 0 ?*/}
          {/*    (*/}
          <FlatList
            style={{marginBottom: hp(2),borderColor:'green',borderWidth:0,backgroundColor:'transparent'}}
            data={vitalsList}
            keyExtractor={item => item.id}
            // numColumns={2}
            // columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <AllVitals
                  navigation={navigation}
                  vitalData={item}
                  openModal={() => onOpen()}
                  bpReadingsHealthKit={bloodPressure}
                />
              );
            }}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            ListFooterComponent={() =>
              loader === false &&
              vitalsData.length === 0 && (
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
              )
            }
          />
          {/*// )*/}
          {/*  //     :*/}
          {/*  //     (*/}
          {/*  //         loader === false && vitalsData.length === 0 &&*/}
          {/*  //         (*/}
          {/*  //         <View*/}
          {/*  //             style={{*/}
          {/*  //                 width: '100%',*/}
          {/*  //                 flex: 1,*/}
          {/*  //                 flexDirection: 'column',*/}
          {/*  //                 justifyContent: 'center',*/}
          {/*  //                 marginBottom: hp(6),*/}
          {/*  //                 alignSelf: 'center',*/}
          {/*  //                 height: '100%'*/}
          {/*  //             }}>*/}
          {/*  //             <Image*/}
          {/*  //                 source={Images.emptyIcon}*/}
          {/*  //                 style={{*/}
          {/*  //                     alignSelf: 'center',*/}
          {/*  //                     height: hp(16),*/}
          {/*  //                     width: hp(18),*/}
          {/*  //                 }}*/}
          {/*  //             />*/}
          {/*  //             <Text*/}
          {/*  //                 style={{*/}
          {/*  //                     fontSize: hp(2.5),*/}
          {/*  //                     fontFamily: Fonts.SourceSansSemibold,*/}
          {/*  //                     color: Colors.regularLabel,*/}
          {/*  //                     marginTop: hp(4),*/}
          {/*  //                     marginRight: hp(10),*/}
          {/*  //                     marginLeft: hp(10),*/}
          {/*  //                     textAlign: 'center',*/}
          {/*  //                 }}>*/}
          {/*  //                 No Record Found*/}
          {/*  //             </Text>*/}
          {/*  //         </View>*/}
          {/*  //         )*/}
          {/*  //     )*/}
          {/*  // }*/}
        </View>
      </MainHeader>
    </SafeAreaView>
  );
};
export default connect()(VitalsScreen);
