import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Colors, Images, Svgs} from '../../../config';
import {Fonts} from '../../../config/AppConfig';
import {useDispatch, useSelector} from 'react-redux';
import {modalHanlder} from '../../features/medication/actions';
import {SvgCss} from 'react-native-svg';

const HeaderRight = ({image, name, navigation}) => {
  const homeApiData = useSelector(state => state.homeApiData);
  console.log('====================================');
  console.log('homeApiData in header', homeApiData);
  console.log('====================================');
  const dispatch = useDispatch();
  return (
    <View
      style={{width: '100%', alignItems: 'flex-end', justifyContent: 'center'}}>
      {name === 'Contacts' || name === 'Home' ? (
        <View>
          {/* <TouchableOpacity onPress={() => navigation.navigate('ChatMain')}> */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              flex: 1,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationStack')}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  alignContent: 'center',
                  marginRight: hp(2),
                }}>
                <FastImage
                  style={{
                    width: hp(2),
                    height: hp(2.5),
                  }}
                  source={Images.notification_dashboard}
                />
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity>
              <SvgCss
                xml={Svgs.settings_Icon}
                width={hp(2.4)}
                height={hp(2.5)}
                fill={Colors.black}
                // onPress={() => navigation.pop()}
                style={{marginHorizontal: hp(1.5)}}
              />
            </TouchableOpacity> */}
          </View>
        </View>
      ) : (
        name === 'Notifications' && (
          <View
            style={{
              flex: 1,
              marginHorizontal: hp(2),
            }}>
            {/* <TouchableOpacity>
              <SvgCss
                xml={Svgs.settings_Icon}
                width={hp(2.4)}
                height={hp(2.5)}
                fill={Colors.black}
                onPress={() => navigation.pop()}
                style={{marginHorizontal: hp(1.5)}}
              />
            </TouchableOpacity> */}
          </View>
        )
        // (name === 'Medications' || name === 'Medication') && (
        //   <TouchableOpacity
        //     style={{
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       marginRight: hp(1),
        //     }}
        //     onPress={() => {
        //       global.selectedData = null;
        //       navigation.navigate('AddNewMedication');
        //       dispatch(modalHanlder({isModalOpen: false}));
        //     }}>
        //     <Text
        //       style={{
        //         color: Colors.blueTextColor,
        //         justifyContent: 'center',
        //         fontFamily: 'WisemanPTSymbols',
        //         fontSize: hp(4),
        //         ...Platform.select({
        //           android: {
        //             marginTop: hp(2),
        //             marginLeft: hp(0.8),
        //           },
        //         }),
        //         width: hp(4),
        //         height: hp(4),
        //       }}>
        //       T
        //     </Text>
        //   </TouchableOpacity>
        // )
      )}
    </View>
  );
};

export default HeaderRight;
