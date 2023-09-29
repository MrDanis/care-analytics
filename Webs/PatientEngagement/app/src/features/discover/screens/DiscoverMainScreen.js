import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  BackHandler,
  Alert,
  TextInput,
  Switch,
  DevSettings,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Colors, Svgs} from '../../../../config';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {baseUrl, CURRENT_TARGET, Fonts} from '../../../../config/AppConfig';
import ToggleSwitch from 'toggle-switch-react-native';
import {showMessage} from 'react-native-flash-message';
import {connect, useDispatch, useSelector} from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../../../config/Colors';
import IconSearch from '../../../../../assets/svg/icon_search.svg';
import IconBody from '../../../../../assets/svg/icon_body.svg';
import {useCallback} from 'react';
import DiscoverService from '../../../api/discover';
import {getDiscoverData} from '../action';
import Images from '../../../../config/Images';
import ActivityIcon from '../../home/screens/components/activityIcon';
import MainHeader from '../../mycare/components/MainHeader';
import {SvgCss, SvgCssUri} from 'react-native-svg';

const Modules = [
  {
    title: 'Body Measurement',
    icon: <IconBody />,
    color: '#208AEB',
    tileColor: 'hsla(209, 84%, 52%, 0.2)',
  },
  {
    title: 'Sleep Monitor',
    icon: <IconBody />,
    color: '#208AEB',
    tileColor: 'hsla(209, 84%, 52%, 0.2)',
  },
  {
    title: 'Running',
    icon: <IconBody />,
    color: '#208AEB',
    tileColor: 'hsla(209, 84%, 52%, 0.2)',
  },
];

const DiscoverMainScreen = props => {
  const stepsLiveRD = useSelector(state => state.liveStepsData);
  const distanceLiveRD = useSelector(state => state.liveDistanceData);
  const heartLiveRD = useSelector(state => state.liveHeartData);
  const speedLiveRD = useSelector(state => state?.liveSpeedData);
  console.log('====================================');
  console.log('Live steps are : ',stepsLiveRD);
  console.log('====================================');
  console.log('====================================');
  console.log('Live distance are : ',distanceLiveRD);
  console.log('====================================');
  console.log('====================================');
  console.log('Live speed are : ',speedLiveRD);
  console.log('====================================');
  
  console.log('Live heart are : ',heartLiveRD);
  console.log('====================================');
  const [loader, setLoader] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const [active, setActive] = useState({});
  const [activeItems, setactiveItems] = useState([]);
  const [Categories, setCat] = useState({
    commonlyUsedCategories: [
      {
        backgroundColor: colors.superLightYellow,
        imageSource: Images.stepIcon_dashboard,
        text: 'Steps',
      },
      {
        backgroundColor: colors.superLightRed,
        imageSource: Images.sleepIcon_dashboard,
        text: 'Sleep',
      },
      {
        backgroundColor: colors.superLightBlue,
        imageSource: Images.runIcon_dashboard,
        text: 'Running',
      },
      {
        backgroundColor: colors.superLightPurple,
        imageSource: Images.cycleIcon_dashboard,
        text: 'Cycle Tracking',
      },
    ],
  });
  const [filteredData, setFilteredData] = useState([]);
  const forceUpdate = useCallback(() => setCat(), []);
  let tempList = Categories;

  // const [userProfileData, setPatientData] = useState(userProfileData);
  const dispatch = useDispatch();
  useEffect(() => {
    getCategoryData();
  }, []);

  const getCategoryData = () => {
    setLoader(true);
    DiscoverService.getCategories()
      .then(response => {
        setLoader(false);

        console.log('changeCatStatus');
        console.log(response.data);
        if (response && response.statusCode === 200) {
          setCat(response.data);

          // For ActiveItem
          // if (response.data.length >= 1) {
          let dashList = response.data.healthCategories.filter(
            item => item.isActive === true,
          );
          console.log('This is the dashList' + dashList);
          setactiveItems(dashList);
          console.log('This is the Active Items List' + activeItems);
          // setactiveItems()
          // }

          dispatch(getDiscoverData(response.data));
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('getCategories Error');
        console.log(err);
      });
  };
  const searchCategory = searchText => {
    setNameVal(searchText);
    let filteredData = Categories?.healthCategories.filter(function (item) {
      return item.name.includes(searchText);
    });
    console.log('Filtered Data', filteredData);
    setFilteredData(filteredData);
  };
  // Function is responsilbe for disable or enable the activity(START)
  const handleEnableAndDisableActivity = (e, item) => {
    setLoader(true);
    setFilteredData([]);
    DiscoverService.changeCatStatus(item.id, !item.isActive === true ? 1 : 0)
      .then(response => {
        setLoader(false);

        console.log('changeCatStatus');
        console.log(response);
        if (response && response.data === true) {
          getCategoryData();
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('getHomeApi Error');
        console.log(err);
      });
  };
  // Function is responsilbe for disable or enable the activity(END)
  const onItemCheck = (e, item, index) => {
    // check the length of the active list
    // if active list contain's atleast one item then user can not disable that other wise disable it
    if (activeItems?.length > 1 || activeItems?.length < 1) {
      //Function to disable the item
      handleEnableAndDisableActivity(e, item);
    } else {
      if (activeItems?.length === 1 && item.isActive === false) {
        handleEnableAndDisableActivity(e, item);
      } else {
        showMessage({
          message: 'Warning',
          description: 'Cannot disable all the activities',
          type: 'warning',
        });
      }
    }

    console.log(
      'Active Item list count : ',
      activeItems.length,
      ' Value of e : ',
      e,
      'Value of the item is : ',
      item,
      'array index of the item is : ',
      index,
    );
    // tempList.map(cat => {
    //   if (cat.catId === item.catId) {
    //     console.log('====================================');
    //     console.log('new val onItemCheck', e);
    //     console.log('item onItemCheck', !item.isActive);

    //     console.log('====================================');
    //     cat.isActive = !item.isActive;
    //   }
    //   return cat;
    // });
    console.log('temp list', tempList);
    // setCat(tempList);
    // forceUpdate(tempList);
    console.log('cat', Categories);
  };

  return (
    <SafeAreaView
      edges={['right', 'left', 'top']}
      style={{
        flex: 1,
        // height: '100%',
        backgroundColor: Colors.backgroundMainLogin,
      }}>
      <Spinner
        visible={loader}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <View
        style={{
          // width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.25, paddingLeft: hp(1)}}>
          {props.homeApiData?.common?.isPatientTouchEnabled || props.userProfileData?.isAcoPatient ? (
            <SvgCss
              xml={Svgs.arrowHeadLeft}
              width={hp(4)}
              height={hp(4)}
              fill={Colors.black}
              style={{borderColor:'red',borderWidth:0}}
              onPress={() => {
                console.log('Props are : ',props)
                // props.navigation.navigate('HomeStack');
                props.navigation.goBack();
              }}
            />
          ) : props.userProfileData?.imagePath !== null &&
            props.userProfileData?.imagePath !== '' ? (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ProfileStack')}>
              <FastImage
                style={{
                  width: 30,
                  height: 30,
                  marginLeft: hp(2.3),
                  borderRadius: 10,
                }}
                source={{
                  uri:
                    baseUrl +
                    '/' +
                    props.userProfileData?.imagePath +
                    '?' +
                    new Date(),
                  priority: FastImage.priority.high,
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ProfileStack')}>
              <FastImage
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  marginLeft: hp(2.3),
                }}
                resizeMode="contain"
                source={require('../../../../../assets/images/user_logo.png')}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{flex: 0.5, alignItems: 'center'}}>
          <Text
            style={{
              color: Colors.black,
              fontSize: hp(2.5),
              fontFamily: Fonts.SourceSansSemibold,
            }}>
            Discover
          </Text>
        </View>
        <View style={{flex: 0.25, alignItems: 'flex-end'}}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('NotificationStack')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginRight: hp(2),
              }}>
              <FastImage
                style={{
                  width: hp(2),
                  height: hp(2.5),
                  // marginRight:-20,
                  // marginHorizontal: hp(3),
                  // marginTop:10,
                }}
                source={Images.notification_dashboard}
              />
              {/* <TouchableOpacity>
                <SvgCss
                  xml={Svgs.settings_Icon}
                  width={hp(2.2)}
                  height={hp(2.3)}
                  fill={Colors.black}
                  onPress={() => navigation.pop()}
                  style={{ marginHorizontal: hp(1.5) }}
                />
              </TouchableOpacity> */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          height: hp(10),
          marginTop: hp(2),
          marginBottom: hp(1.5),
          backgroundColor: colors.backgroundMainLogin,
          // marginHorizontal: hp(0.4),
          width: '100%',

          // borderBottomWidth: 1,
          borderBottomColor: colors.line,
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            // marginHorizontal: hp(0.4),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 0.5,
            height: hp(6),
            borderColor: Colors.line,
            backgroundColor: Colors.white,
            borderRadius: 10,
          }}>
          <TextInput
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 10,
              backgroundColor: '#ffffff',
              color: '#424242',
              borderRadius: 5,
              borderColor: Colors.lightGrey,
              flexDirection: 'row',
              width: '80%',
              alignSelf: 'center',
              marginRight: hp(4),
              fontSize: hp(2.2),
              fontFamily: Fonts.SourceSansRegular,
            }}
            value={nameVal}
            keyboardType="email-address"
            onChangeText={text => {
              setNameVal(text);
              searchCategory(text);
              console.log('On change call');
            }}
            onSubmitEditing={() => {
              // this.phone.focus();
              console.log('End Editing Called');
              // if (nameVal.length > 1) {
              //   if (nameVal.length >= 3 && nameVal.length <= 50) {
              searchCategory(nameVal);
              // } else {
              //   alert('Medicine name must contain at least 3 characters.');
              // }
              // }
            }}
            placeholder={'Search'}
            placeholderTextColor={colors.black2}
          />

          <TouchableOpacity
            onPress={() => {
              // if (nameVal.length >= 3 && nameVal.length <= 50) {
              searchCategory(nameVal);
              // } else {
              //   alert('Medicine name must contain at least 3 characters.');
              // }
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 8,
              width: 8,
              marginRight: hp(1),
            }}>
            <View
              style={{
                paddingRight: hp(3),
              }}>
              <IconSearch />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}> */}
      {Categories?.length === 0 ? null : (
        <View
          style={{
            height: hp(20),
            width: '94%',
            alignSelf: 'center',

            // marginHorizontal: hp(2),
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.line,
            // marginTop: hp(0.5),
            marginBottom: hp(2.2),
            borderWidth: 0.2,
            elevation: 20,
            borderColor: Colors.line,
            backgroundColor: Colors.white,
            // borderRadiusT: 10,

            borderRadius: 10,
          }}>
          <Text
            style={{
              fontFamily: Fonts.SourceSansSemibold,
              fontSize: 18,
              marginLeft: hp(2),
              marginTop: hp(1),
              marginBottom: hp(2),
            }}>
            Active Items
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginLeft: hp(2),
            }}>
            {/* {Categories?.healthCategories?.map( */}
            {activeItems.map(
              (item, index) => (
                <ActivityIcon
                  navigation={props.navigation}
                  backgroundColor={item.tileColor}
                  id={item.id}
                  key={item.id}
                  healthKitData={stepsLiveRD}
                  activityData={item}
                  // imageSource={item.imageSiconource}
                  imageSource={
                    // CURRENT_TARGET + '/' + item.icon + '?' + new Date(),
                    item.icon
                    // 'https://pre-release.wmi360.com/360PatientEngagement/HealthCategories/body_measurement.png'
                  }
                  text={item.name}
                  distanceWalked={distanceLiveRD}
                  calculatedSpeed={speedLiveRD}
                />
              ),

              /* return (
                <ActivityIcon
                  backgroundColor={data.backgroundColor}
                  imageSource={data.imageSource}
                  text={data.text}
                /> */
              //{
              /* <View
                  style={{
                    height: hp(15),
                    backgroundColor: data.tileColor,
                    width: hp(20),
                    borderRadius: 8,
                    marginRight: hp(2),
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flex: 0.5,
                      alignSelf: 'flex-end',
                      marginRight: hp(1.5),
                      marginTop: hp(1.5),
                    }}>
                    {data.icon}
                  </View>
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        color: data.textColor,
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: 15,
                        marginBottom: hp(1.5),
                        marginHorizontal: hp(1.5),
                      }}>
                      {data.name}
                    </Text>
                  </View>
                </View> */
              //}
            )}
          </ScrollView>
        </View>
      )}

      <>
        <View
          style={{
            // marginHorizontal: hp(2),
            width: '94%',
            alignSelf: 'center',
            // marginLeft:hp(1),
            // alignItems: 'center',
            // justifyContent: 'center',
            borderWidth: 0.2,
            elevation: 20,
            height: hp(60),
            // height: '100%',
            borderColor: Colors.line,
            backgroundColor: Colors.white,
            // borderRadiusT: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingBottom: hp(10),
            // flex: 1,
          }}>
          <Text
            style={{
              marginLeft: hp(2),
              // alignSelf: 'center',
              // justifyContent: 'center',
              fontFamily: Fonts.SourceSansSemibold,
              fontSize: 18,
              // marginLeft: hp(-21.8),
              marginTop: hp(2),
              color: colors.headingColor,
            }}>
            Health Categories
          </Text>
          {/*{filteredData.length < 0 && nameVal.length > 0 && Categories?.healthCategories.length > 0?*/}
          <FlatList
            // marginHorizontal={20}
            horizontal={false}
            marginLeft={hp(1)}
            // contentContainerStyle={{marginHorizontal: hp(0)}}
            data={
              filteredData && filteredData.length > 0
                ? filteredData
                : Categories?.healthCategories
            }
            renderItem={({item, index}) => {
              return (
                <>
                  <View
                    style={{
                      // borderColor:'red',
                      // borderWidth:2,
                      marginLeft: hp(2),
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: hp(2),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '80%',
                      }}>
                      <View
                        style={{
                          height: hp(6),
                          backgroundColor: item.tileColor,
                          width: hp(6),
                          borderRadius: 8,
                          marginRight: hp(2),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <SvgCssUri
                          width={40}
                          height={45}
                          uri={item.icon + '?' + new Date()}
                          fill={item.textColor}
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansRegular,
                          fontSize: 15,
                          // marginLeft: hp(0),
                          marginTop: hp(2),
                          marginBottom: hp(2),
                          color: colors.headingColor,
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <View>
                      <ToggleSwitch
                        isOn={item.isActive}
                        onColor={colors.blueTextColor}
                        offColor={colors.sliderGrey}
                        onToggle={newValue => {
                          onItemCheck(newValue, item, index);
                        }}
                        size="small"
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: hp(10),
                      // marginRight: hp(0.5),
                      // borderBottomWidth: 1,
                      // borderBottomColor: colors.line,
                      // width: hp(100),
                      // width: '100%',
                      // marginLeft: hp(20),

                      // width: '100%',
                      // marginLeft:hp(1),
                      // alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: colors.line,
                        // width: hp(100),
                        width: '100%',
                        // marginLeft: hp(20),
                        // marginRight:hp(10),
                        // width: '100%',
                        // marginLeft:hp(1),
                        alignSelf: 'center',
                      }}></View>
                  </View>
                </>
              );
            }}
          />
        </View>
      </>
    </SafeAreaView>
  );
};

const mapStateToProps = ({homeApiData, userProfileData}) => ({
  homeApiData,
  userProfileData,
});

export default connect(mapStateToProps)(DiscoverMainScreen);
