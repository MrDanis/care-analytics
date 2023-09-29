/* istanbul ignore file */
import React, {
  Component,
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {baseUrl, CURRENT_TARGET, Fonts} from '../../../../config/AppConfig';
import Colors from '../../../../config/Colors';
import IconProfile from '../../../../../assets/svg/icon_profile_profile_info.svg';
import {connect} from 'react-redux';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {NavigationActions} from 'react-navigation';

const ProfileInfoScreen = props => {
  const userProfileData = useSelector(state => state.userProfileData);
  const [gender, setGender] = useState(null);
  const [imageObject, setImageObject] = useState(null);
  useEffect(() => {
    let gender = '';
    if (userProfileData.gender !== null && userProfileData.gender === '1') {
      setGender('Male');
    } else if (
      userProfileData.gender !== null &&
      userProfileData.gender === '2'
    ) {
      setGender('Female');
    } else {
      setGender(null);
    }
    if (
      userProfileData.imagePath !== null &&
      userProfileData.imagePath !== ''
    ) {
      let imageData = {};
      imageData.uri = CURRENT_TARGET + '/' + userProfileData.imagePath;
      setImageObject(imageData);
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{backgroundColor: Colors.backgroundMain}}>
        <Fragment>
          <View style={{flex: 1, backgroundColor: Colors.backgroundMain}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                height: hp(7.5),
                borderBottomWidth: 0.5,
                borderColor: Colors.lightGrey,
              }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.goBack();
                }}>
                <Text
                  style={{
                    fontFamily: 'WisemanPTSymbols',
                    marginLeft: heightPercentageToDP(2),
                    marginRight: heightPercentageToDP(1),
                    fontSize: hp(5),
                    color: Colors.black1,
                  }}>
                  W
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: Fonts.SourceSansBold,
                  marginLeft: hp(2),
                  fontSize: hp(2.5),
                  color: Colors.black1,
                  flex: 1,
                  textTransform: 'capitalize',
                }}>
                Personal Information
              </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('EditProfile', {
                    profileDetails: userProfileData,
                    screenName: 'profile',
                  });
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    marginRight: hp(2),
                    fontSize: hp(2.5),
                    color: Colors.blueHeadingColor,
                    textTransform: 'capitalize',
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            {userProfileData.imagePath !== null &&
            userProfileData.imagePath !== '' ? (
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: hp(6),
                }}>
                <FastImage
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
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
              </View>
            ) : (
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: hp(6),
                }}>
                <FastImage
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    marginVertical: hp(1),
                  }}
                  source={require('../../../../../assets/images/user_logo.png')}
                />
              </View>
            )}
            <View style={{paddingHorizontal: hp(2)}}>
              {userProfileData.lastName !== '' &&
                userProfileData.lastName !== null && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: hp(3),
                      marginBottom: hp(3),
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.2),
                        flex: 1,
                        color: Colors.black1,
                      }}>
                      First Name
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        marginLeft: heightPercentageToDP(5),
                        fontSize: hp(2.2),
                        color: Colors.black2,
                        textTransform: 'capitalize',
                      }}>
                      {userProfileData.firstName.toLowerCase()}
                    </Text>
                  </View>
                )}
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.line,
                  marginRight: hp(2),
                }}
              />
              {userProfileData.lastName !== '' &&
                userProfileData.lastName !== null && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: hp(3),
                      marginBottom: hp(3),
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.2),
                        flex: 1,
                        color: Colors.black1,
                      }}>
                      Last Name
                    </Text>
                    <Text
                      key={Math.random().toString(36).substr(2, 9)}
                      style={{
                        marginRight: hp(0.5),
                        fontFamily: Fonts.SourceSansRegular,
                        fontSize: hp(2.2),
                        color: Colors.black2,
                        textTransform: 'capitalize',
                      }}>
                      {userProfileData.lastName.toLowerCase()}
                    </Text>
                  </View>
                )}
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.line,
                  marginRight: hp(2),
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(3),
                  marginBottom: hp(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    fontSize: hp(2.2),
                    flex: 1,
                    color: Colors.black1,
                  }}>
                  Email
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    marginLeft: heightPercentageToDP(5),
                    fontSize: hp(2.2),
                    color: Colors.black2,
                  }}>
                  {userProfileData.email}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.line,
                  marginRight: hp(2),
                }}
              />
              {userProfileData.phone !== '' &&
                userProfileData.phone !== null && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: hp(3),
                      marginBottom: hp(3),
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.2),
                        flex: 1,
                        color: Colors.black1,
                      }}>
                      Phone Number
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        marginLeft: heightPercentageToDP(5),
                        fontSize: hp(2.2), 
                        color: Colors.black2,
                      }}>
                      {userProfileData.phone}
                    </Text>
                  </View>
                )}
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.line,
                  marginRight: hp(2),
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(3),
                  marginBottom: hp(3),
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansBold,
                    fontSize: hp(2.2),
                    flex: 1,
                    color: Colors.black1,
                  }}>
                  D.O.B
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.SourceSansRegular,
                    marginLeft: heightPercentageToDP(5),
                    fontSize: hp(2.2),
                    color: Colors.black2,
                  }}>
                  {userProfileData.dateOfBirth === null ||
                  userProfileData.dateOfBirth === ''
                    ? ''
                    : moment(new Date(userProfileData.dateOfBirth)).format('L')}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.line,
                  marginRight: hp(2),
                }}
              />
              {gender !== null && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(3),
                    marginBottom: hp(3),
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansBold,
                      fontSize: hp(2.2),
                      flex: 1,
                      color: Colors.black1,
                    }}>
                    Gender
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      marginLeft: heightPercentageToDP(5),
                      fontSize: hp(2.2),
                      color: Colors.black2,
                    }}>
                    {gender}
                  </Text>
                </View>
              )}
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.line,
                  marginRight: hp(2),
                }}
              />
              {userProfileData.address !== '' &&
                userProfileData.address !== null && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: hp(3),
                      marginBottom: hp(3),
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.2),
                        flex: 1,
                        color: Colors.black1,
                      }}>
                      Address
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        marginLeft: heightPercentageToDP(1),
                        fontSize: hp(2.2),
                        color: Colors.black2,
                        textAlign: 'right',
                        flex: 1,
                      }}>
                      {userProfileData.address}
                    </Text>
                  </View>
                )}
              {userProfileData.referenceNumber !== '' &&
                userProfileData.referenceNumber !== null && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: hp(3),
                      marginBottom: hp(3),
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(2.2),
                        flex: 1,
                        color: Colors.black1,
                      }}>
                      Reference Number
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansRegular,
                        marginLeft: heightPercentageToDP(1),
                        fontSize: hp(2.2),
                        color: Colors.black2,
                        textAlign: 'right',
                        flex: 1,
                      }}>
                      {userProfileData.referenceNumber}
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </Fragment>
      </ScrollView>
    </SafeAreaView>
  );
};
ProfileInfoScreen.navigationOptions = {
  headerShown: false,
};
const mapStateToProps = ({userProfileData}) => ({
  userProfileData,
});
export default connect(mapStateToProps)(ProfileInfoScreen);
