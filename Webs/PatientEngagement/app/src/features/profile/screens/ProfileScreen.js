import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  Share,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../../../config/Colors';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {baseUrl, Fonts} from '../../../../config/AppConfig';
// import {color} from 'react-native-reanimated';
import images from '../../../../config/Images';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect, useDispatch, useSelector} from 'react-redux';
import ProfileService from '../../../api/profile';
import {getUserProfile} from '../action';
import {isACOUserLogin} from '../../../helpers/Common';
import {showMessage} from 'react-native-flash-message';
import {CURRENT_TARGET} from '../../../../config/AppConfig';
import {NavigationActions} from 'react-navigation';
import {signOut} from '../../../helpers/SocailLoginHelper';
import {
  BlueButtonAccessToken,
  BlueButtonRefreshToken,
  removeItemValue,
  storeItem,
} from '../../../helpers/LocalStorage';
import {
  getAllergiesHistory,
  getCoverageHistory,
  getDiseasesHistory,
  getHospitalVisitHistory,
  getMedicationHistory,
  getProceduresHistory,
  getProviderHistory,
} from '../../bluebutton/action';
import {Colors, Images} from '../../../../config';

import moment from 'moment';
import {getHomeApiData} from '../../home/action';
import MainHeader from '../../mycare/components/MainHeader';

const ProfileScreen = props => {
  const [imageObject, setImageObject] = useState(null);
  const userProfileData = useSelector(state => state.userProfileData);
  console.log('====================================');
  console.log('userProfileData in profile screen', userProfileData);
  console.log('====================================');
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('come here to profille foucs', userProfileData);
    if (
      userProfileData.imagePath !== null &&
      userProfileData.imagePath !== ''
    ) {
      let imageData = {};
      imageData.uri = CURRENT_TARGET + '/' + userProfileData.imagePath;
      setImageObject(imageData);
    }
    console.log(
      'ImagePath on Profile SCreen',
      CURRENT_TARGET + '/' + userProfileData.imagePath + '?' + new Date(),
    );
  }, []);

  const goToMedicalHistory = async () => {
    if (
      props.userProfileData &&
      props.userProfileData.firstName !== '' &&
      props.userProfileData.lastName !== '' &&
      props.userProfileData.dateOfBirth !== '' &&
      props.userProfileData.gender !== ''
    ) {
      if (props.userProfileData && !props.userProfileData.isAcoPatient) {
        props.navigation.navigate('MainDashboard', {
          screenName: 'Profile',
        });
      }
      if (props.userProfileData && props.userProfileData.isAcoPatient) {
        var isLogin = await isACOUserLogin();
        console.log('testing', isLogin);
        if (isLogin) {
          props.navigation.navigate('MainDashboard', {
            screenName: 'Profile',
          });
        } else {
          props.navigation.navigate('ACOLogin', {
            screenName: 'Profile',
          });
        }
      }
    } else {
      showMessage({
        message: 'Information',
        description: 'Please complete your profile',
        type: 'default',
        icon: {icon: 'info', position: 'left'},
        backgroundColor: colors.red,
      });
    }
  };
  function getAge(dateString: string) {
    console.log('====================================');
    console.log(
      'date',
      moment(new Date(userProfileData.dateOfBirth)).format('YYYY-MM-DD'),
    );
    console.log('====================================');
    const date = moment(new Date(userProfileData.dateOfBirth)).format(
      'YYYY-MM-DD',
    );
    const years = moment().diff(date, 'years');
    console.log('====================================');
    console.log('years', years);
    console.log('====================================');
    // const days = moment().diff(date.add(years, 'years'), 'days', false);
    // return { years,days }
    return years < 1 ? '' : ', ' + years + 'yrs';
  }
  const clearStoreData = () => {
    props.dispatch(getMedicationHistory([]));
    props.dispatch(getProviderHistory([]));
    props.dispatch(getHospitalVisitHistory([]));
    props.dispatch(getDiseasesHistory([]));
    props.dispatch(getCoverageHistory([]));
    props.dispatch(getAllergiesHistory([]));
    props.dispatch(getProceduresHistory([]));
    props.dispatch(getHomeApiData({}));
  };

  const onShare = async () => {
    let appLink =
      Platform.OS === 'ios'
        ? 'https://testflight.apple.com/join/ldWlg3fY'
        : 'https://play.google.com';
    try {
      const optionMessage =
        Platform.OS === 'ios'
          ? 'Please install 360 Patient Engagement application for your care'
          : 'Please install 360 Patient Engagement application for your care ' +
            '\n' +
            appLink;
      const result = await Share.share({
        title: 'App link',
        message: optionMessage,
        url: appLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: colors.BgColor}} />
      <MainHeader name={'Profile'} navigation={props.navigation}>
        <View
          style={{
            backgroundColor: colors.white,
            marginTop: hp(5),
            flex: 1,
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 3,
          }}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
            }}>
            {userProfileData.imagePath !== null &&
            userProfileData.imagePath !== '' ? (
              <FastImage
                style={{
                  width: 100,
                  height: 100,
                  marginVertical: hp(2),
                  borderRadius: 10,
                }}
                source={{
                  uri:
                    baseUrl +
                    '/' +
                    userProfileData.imagePath +
                    '?' +
                    new Date(),
                  priority: FastImage.priority.high,
                }}
              />
            ) : (
              <FastImage
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  marginVertical: hp(1),
                }}
                resizeMode="contain"
                source={require('../../../../../assets/images/user_logo.png')}
              />
            )}
            <Text
              style={{
                fontFamily: Fonts.SourceSansSemibold,
                fontSize: hp(2),
                color: colors.black4,
                textTransform: 'capitalize',
              }}>
              {userProfileData?.firstName?.toLowerCase() +
                ' ' +
                userProfileData?.lastName?.toLowerCase()}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp(1),
              }}>
              <Image
                source={Images.EmailIconBlack}
                style={{
                  height: hp(1.5),
                  width: hp(1.5),
                  resizeMode: 'contain',
                  marginRight: hp(0.5),
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(1.5),
                  color: colors.noRecordFound,
                }}>
                {userProfileData?.email}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={Images.call_Icon_Black}
                style={{
                  height: hp(1.5),
                  width: hp(1.5),
                  resizeMode: 'contain',
                  marginRight: hp(0.5),
                }}
              />
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(1.5),
                  color: colors.noRecordFound,
                  textTransform: 'capitalize',
                }}>
                {userProfileData?.phone}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                props.navigation.navigate('EditProfile', {
                  profileDetails: userProfileData,
                  screenName: 'profile',
                })
              }
              style={{
                backgroundColor: Colors.regularLabel,
                marginVertical: hp(2),
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansSemibold,
                  fontSize: hp(1.5),
                  color: colors.white,
                  textTransform: 'capitalize',
                  padding: hp(1),
                }}>
                Edit Profile
              </Text>
            </Pressable>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: Colors.line,
                width: '83%',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                marginTop: hp(2),
              }}>
              <View
                style={{
                  width: hp(4),
                  height: hp(4),
                  backgroundColor: colors.bleLayer4,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(2),
                  }}
                  resizeMode="contain"
                  source={images.Icon_medical_history}
                />
              </View>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: colors.black,
                  textTransform: 'capitalize',
                  padding: hp(1),
                  marginLeft: hp(1),
                }}>
                Medical History
              </Text>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(1.7),
                  }}
                  resizeMode="contain"
                  source={images.forwardImage}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                marginTop: hp(2),
              }}>
              <View
                style={{
                  width: hp(4),
                  height: hp(4),
                  backgroundColor: colors.bleLayer4,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(2),
                  }}
                  resizeMode="contain"
                  source={images.connected_devices}
                />
              </View>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: colors.black,
                  textTransform: 'capitalize',
                  padding: hp(1),
                  marginLeft: hp(1),
                }}>
                Linked Devices
              </Text>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(1.7),
                  }}
                  resizeMode="contain"
                  source={images.forwardImage}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                marginTop: hp(2),
              }}>
              <View
                style={{
                  width: hp(4),
                  height: hp(4),
                  backgroundColor: colors.bleLayer4,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(2),
                  }}
                  resizeMode="contain"
                  source={images.icon_help}
                />
              </View>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: colors.black,
                  textTransform: 'capitalize',
                  padding: hp(1),
                  marginLeft: hp(1),
                }}>
                Help
              </Text>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(1.7),
                  }}
                  resizeMode="contain"
                  source={images.forwardImage}
                />
              </View>
            </View>
            <Pressable
              onPress={() => onShare()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                marginTop: hp(2),
              }}>
              <View
                style={{
                  width: hp(4),
                  height: hp(4),
                  backgroundColor: colors.bleLayer4,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(2),
                  }}
                  resizeMode="contain"
                  source={images.icon_share}
                />
              </View>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: colors.black,
                  textTransform: 'capitalize',
                  padding: hp(1),
                  marginLeft: hp(1),
                }}>
                Share with Friends
              </Text>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(1.7),
                  }}
                  resizeMode="contain"
                  source={images.forwardImage}
                />
              </View>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                marginTop: hp(2),
              }}>
              <View
                style={{
                  width: hp(4),
                  height: hp(4),
                  backgroundColor: colors.bleLayer4,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(2),
                  }}
                  resizeMode="contain"
                  source={images.icon_star}
                />
              </View>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansRegular,
                  fontSize: hp(2),
                  color: colors.black,
                  textTransform: 'capitalize',
                  padding: hp(1),
                  marginLeft: hp(1),
                }}>
                Rate Us
              </Text>

              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(1.7),
                  }}
                  resizeMode="contain"
                  source={images.forwardImage}
                />
              </View>
            </View>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: Colors.line,
                width: '100%',
                marginTop: hp(3),
              }}
            />
            <Pressable
              onPress={() => {
                ProfileService.userLogout()
                  .then(res => {
                    clearStoreData();
                    console.log('userLogout');
                    console.log(res);
                  })
                  .catch(err => {
                    console.log('userLogoutError');
                    console.log(err);
                  });
                signOut();
                removeItemValue('isAcoUserLogin');
                removeItemValue('authCode');
                removeItemValue('authToken');
                removeItemValue('userEmail');
                removeItemValue('isEmailORPhone');
                removeItemValue('drawOverlay');
                removeItemValue('refreshToken');
                storeItem(BlueButtonAccessToken, '');
                storeItem(BlueButtonRefreshToken, '');
                props.navigation.navigate('LoginScreen');
              }}
              style={{
                flexDirection: 'row',
                width: '85%',
                marginTop: hp(3),
                alignItems: 'center',
              }}>
              <FastImage
                style={{
                  width: hp(2),
                  height: hp(2),
                }}
                resizeMode="contain"
                source={images.sign_off}
              />
              <Text
                style={{
                  fontFamily: Fonts.SourceSansSemibold,
                  fontSize: hp(2),
                  color: colors.red2,
                  textTransform: 'capitalize',
                  marginLeft: hp(3),
                }}>
                Sign out
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </MainHeader>
    </>
  );
};

const mapStateToProps = ({userProfileData}) => ({
  userProfileData,
});
export default connect(mapStateToProps)(ProfileScreen);
