/* istanbul ignore file */
import {Image, Platform, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React, {useEffect, useState} from 'react';
import Colors from '../../../config/Colors';
import HomeScreen from '../../features/home/screens/HomeScreen';
import images from '../../../config/Images';

import {connect,useDispatch} from 'react-redux';
import HomeStack from './HomeStack';
import DiscoverMainScreen from '../../features/discover/screens/DiscoverMainScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HeaderRight from './HeaderRight';
import HeaderLeft from './HeaderLeft';
import {showMessage} from 'react-native-flash-message';
import {isACOUserLogin} from '../../helpers/Common';
import MedicalHistoryStack from './MedicalHistoryStack';
import {useFocusEffect} from '@react-navigation/native';
import ChatStack from './ChatStack';
import {Images} from '../../../config';
import WellnessStack from './WellnessStack';
// import {connect, useSelector} from 'react-redux';
const Tab = createBottomTabNavigator();

console.log('====================================');
console.log('here in tab');
console.log('====================================');
const HomeTabNavigation = function ({
  navigation,
  route,
  homeApiData,
  userProfileData,
  modalHandlerReducer,
}) {
  const [isModalVisible, setIsModalVisible] = useState(modalHandlerReducer);
  const dispatch = useDispatch();
  // console.log('====================================');
  // console.log('homeApiData in tab', homeApiData);
  // console.log('====================================');
  // console.log('====================================');
  // console.log('userProfileData in tab', userProfileData);
  // console.log('====================================');
  // if(!userProfileData?.isUserAuthenticate)
  // {
  //   navigation.navigate('LoginScreen')
  // }
  console.log('====================================');
  console.log('User profile : ',userProfileData, ' Home Api : ',homeApiData);
  console.log('====================================');
  console.log('====================================');
  console.log('modalHandler', modalHandlerReducer);
  console.log('====================================');

  var isLogin = false;
  // useEffect(() => {
  //   const login = async () => {
  //     isLogin = await isACOUserLogin();
  //   };
  // }, []);

  // ////////
  
  // ///////

  useFocusEffect(
    React.useCallback(() => {
      console.log('Going into FetchData');
      // fetchData();
      console.log('Coming out of  FetchData');
      navigation.setOptions({tabBarVisible: false});
      const login = async () => {
        isLogin = await isACOUserLogin();
        console.log('====================================');
        console.log('isLogin in medical', isLogin);
        console.log('====================================');
        setIsModalVisible(modalHandlerReducer);
        console.log('====================================');
        console.log('here again in tab');
        console.log('====================================');
      };
    }, [modalHandlerReducer]),
  );

  const goToMedicalHistoryAco = async () => {
    if (
      userProfileData &&
      userProfileData.firstName !== '' &&
      userProfileData.lastName !== '' &&
      userProfileData.dateOfBirth !== '' &&
      userProfileData.gender !== ''
    ) {
      navigation.navigate('ACOLogin', {
        screenName: 'HomeTab',
      });
      // if (userProfileData && userProfileData.isAcoPatient) {
      //   var isLogin = await isACOUserLogin();
      //   console.log('testing', isLogin);
      //   if (isLogin) {
      //     navigation.navigate('MainDashboard', {
      //       screen: 'Profile',
      //     });
      //   } else {
      //     navigation.navigate('HomeTab', {
      //       screen: 'Medical History',
      //     });
      //   }
      // }
    } else {
      showMessage({
        message: 'Information',
        description: 'Please complete your profile',
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: Colors.red,
      });
    }
  };

  return (
    <Tab.Navigator
      gestureEnabled={false}
      screenOptions={{
        tabBarActiveTintColor: Colors.blueTextColor,
        tabBarStyle: {
          backgroundColor: Colors.white,
          minHeight: Platform.OS === 'ios' ? 90 : 70,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveBackgroundColor: Colors.backgroundGrey,
        tabBarIconStyle: {width: '100%'},
      }}>
      {((homeApiData?.common?.isPatientTouchEnabled || userProfileData?.isAcoPatient)) ? (
        <>
          <Tab.Screen
            name="Home"
            options={{
              tabBarLabel: '',
              tabBarIcon: ({color, size, focused}) => {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      minHeight: '100%',
                      width: '100%',
                      borderTopWidth: focused ? 1.5 : 0,
                      borderTopColor: Colors.blueTextColor,
                    }}>
                    <Image
                      style={{
                        width: 21,
                        height: 21,
                        marginTop: hp(1),
                      }}
                      source={focused ? images.IconHomeBlue : images.IconHome}
                    />
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 10,
                        marginTop: hp(1),
                      }}>
                      Home
                    </Text>
                  </View>
                );
              },
              headerShown: false,
              gestureEnabled: true,
              headerShadowVisible: false,
              headerTitle: '',
              tabBarStyle: {
                display: modalHandlerReducer?'flex':'none',
                height: 90,
              },
            }}
            component={HomeStack}
          />

          {/* {userProfileData && !userProfileData.isAcoPatient ? (
            <Tab.Screen
              name="Medical History"
              options={{
                tabBarLabel: '',
                tabBarIcon: ({color, size, focused}) => (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      minHeight: '100%',
                      width: '100%',
                      borderTopWidth: focused ? 1.5 : 0,
                      borderTopColor: Colors.blueTextColor,
                    }}>
                    <Image
                      style={{
                        width: 21,
                        height: 21,
                      }}
                      source={
                        focused
                          ? images.medical_history_colored
                          : images.medical_history_grey
                      }
                    />
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 10,
                      }}>
                      Medical History
                    </Text>
                  </View>
                ),
                headerShown: false,
              }}
              component={MedicalHistoryStack}
            />
          ) : ( */}
          <Tab.Screen
            name="Medical History"
            options={{
              tabBarLabel: '',
              tabBarIcon: ({color, size, focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    minHeight: '100%',
                    width: '100%',
                    borderTopWidth: focused ? 1.5 : 0,
                    borderTopColor: Colors.blueTextColor,
                  }}>
                  <Image
                    style={{
                      width: 21,
                      height: 21,
                      marginTop: hp(1),
                    }}
                    source={
                      focused
                        ? images.medical_history_colored
                        : images.medical_history_grey
                    }
                  />
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 10,
                      marginTop: hp(1),
                    }}>
                    Medical History
                  </Text>
                </View>
              ),
              headerShown: false,
              tabBarStyle: {
                display: modalHandlerReducer?'flex':'none',
                height: 90,
              },
            }}
            component={MedicalHistoryStack}
            initialParams={userProfileData}
          />
          {/* )} */}

          <Tab.Screen
            name="Contacts"
            options={{
              tabBarLabel: '',    
              tabBarIcon: ({color, size, focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    minHeight: '100%',
                    width: '100%',
                    borderTopWidth: focused ? 1.5 : 0,
                    borderTopColor: Colors.blueTextColor,
                  }}>
                  <Image
                    style={{
                      width: 15,
                      height: 19,
                      marginTop: hp(1),
                    }}
                    source={
                      focused
                        ? images.contatcs_icon_colored
                        : images.contatcs_icon
                    }
                  />
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 10,
                      marginTop: hp(1),
                    }}>
                    Contact
                  </Text>
                </View>
              ),
              headerRight: () => (
                <HeaderRight name="Contacts" navigation={navigation} />
              ),
              headerLeft: () => (
                <HeaderLeft
                  image={userProfileData?.imagePath}
                  name="Home"
                  width={30}
                  height={30}
                  navigation={navigation}
                />
              ),
              headerStyle: {
                backgroundColor: Colors.BgColor,
              },
              headerShadowVisible: false,
            }}
            component={ChatStack}
          />
          <Tab.Screen
            name="Wellnesss"
            options={{
              tabBarLabel: '',
              tabBarIcon: ({color, size, focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    minHeight: '100%',
                    width: '100%',
                    borderTopWidth: focused ? 1.5 : 0,
                    borderTopColor: Colors.blueTextColor,
                  }}>
                  <Image
                    style={{
                      width: 15,
                      height: 19,
                      marginTop: hp(1),
                    }}
                    source={
                      focused
                        ? images.wellness_icon_colored
                        : images.wellness_icon
                    }
                  />
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 10,
                      marginTop: hp(1),
                    }}>
                    Wellness
                  </Text>
                </View>
              ),
              headerRight: () => (
                <HeaderRight name="Contacts" navigation={navigation} />
              ),
              headerLeft: () => (
                <HeaderLeft
                  image={userProfileData?.imagePath}
                  name="Home"
                  width={hp(5)}
                  height={hp(5)}
                  navigation={navigation}
                />
                // width: hp(5),
                //     height: hp(5),
                //     marginLeft: hp(1),
                //     borderRadius: 10,
              ),
              headerStyle: {
                backgroundColor: Colors.BgColor,
              },
              headerShadowVisible: false,
            }}
            component={WellnessStack}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            options={{
              tabBarLabel: '',
              tabBarIcon: ({color, size, focused}) => {
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      minHeight: '100%',
                      width: '100%',
                      borderTopWidth: focused ? 1.5 : 0,
                      borderTopColor: Colors.blueTextColor,
                    }}>
                    <Image
                      style={{
                        width: 21,
                        height: 21,
                        marginTop: hp(1),
                      }}
                      source={focused ? images.IconHomeBlue : images.IconHome}
                    />
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 10,
                        marginTop: hp(1),
                      }}>
                      Home
                    </Text>
                  </View>
                );
              },
              headerShown: false,
              gestureEnabled: true,
              headerShadowVisible: false,
              headerTitle: '',
              tabBarStyle: {
                display: modalHandlerReducer?'flex': 'none',
                height: 90,
              },
            }}
            component={HomeStack}
          />

          <Tab.Screen
            name="Medical History"
            options={{
              tabBarLabel: '',
              tabBarIcon: ({color, size, focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    minHeight: '100%',
                    width: '100%',
                    borderTopWidth: focused ? 1.5 : 0,
                    borderTopColor: Colors.blueTextColor,
                  }}>
                  <Image
                    style={{
                      width: 21,
                      height: 21,
                    }}
                    source={
                      focused
                        ? images.medical_history_colored
                        : images.medical_history_grey
                    }
                  />
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 10,
                    }}>
                    Medical History
                  </Text>
                </View>
              ),
              headerShown: false,
            }}
            component={MedicalHistoryStack}
          />

          <Tab.Screen
            name="Discover"
            options={{
              tabBarLabel: '',
              tabBarIcon: ({color, size, focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    minHeight: '100%',
                    width: '100%',
                    borderTopWidth: focused ? 1.5 : 0,
                    borderTopColor: Colors.blueTextColor,
                  }}>
                  <Image
                    style={{
                      width: 21,
                      height: 21,
                    }}
                    source={
                      focused ? images.IconDiscoverBlue : images.IconDiscover
                    }
                  />
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 10,
                    }}>
                    Discover
                  </Text>
                </View>
              ),
              headerShown: false,
            }}
            component={DiscoverMainScreen}
          />
        </>
      )}
    </Tab.Navigator>
  );
};
const mapStateToProps = ({
  homeApiData,
  userProfileData,
  modalHandlerReducer,
}) => ({
  homeApiData,
  userProfileData,
  modalHandlerReducer,
});

export default connect(mapStateToProps)(HomeTabNavigation);
