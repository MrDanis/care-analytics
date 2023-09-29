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
import ContactTab from '../components/contactTab';
import colors from '../../../../config/Colors';
import ProvidersContactCard from '../components/ProvidersContactCard';
import PharmacyContactCard from '../components/PharmacyContactCard';

import ChatService from '../../../api/chat';
import CareCoordinationContactCard from '../components/CareCoordinationContactCard';
import MedicationService from '../../../api/medication';
import LabService from '../../../api/lab';

const data = [
  {
    name: 'James Strauss',
    icon: require('../../../../../assets/images/user_logo.png'),
    time: 'Thu,sep 15,2022',
    physicianSpeciality: 'Facial Plastic Surgeon',
  },
  {
    name: 'IDC',
    icon: require('../../../../../assets/images/user_logo.png'),
    time: 'Thu,sep 15,2022',
    physicianSpeciality: 'Facial Plastic Surgeon',
  },
  {
    name: 'Baham',
    icon: require('../../../../../assets/images/user_logo.png'),
    time: 'Thu,sep 15,2022',
    physicianSpeciality: 'Facial Plastic Surgeon',
  },
];

const Contacts = ({navigation}) => {
  const [provider, setProvider] = useState(true);
  const [pharmacy, setPharmacy] = useState(false);
  const [lab, setLab] = useState(false);
  const [careCoordinator, setcCreCoordinator] = useState(false);
  const [careCoordinatorConatctList, setCareCoordinatorConatctList] =
    useState(null);
  const [providerContactList, setProviderContactList] = useState(null);
  const [pharmaciesContactList, setPharmaciesContactList] = useState(null);
  const [labsContactList, setLabsContactList] = useState(null);

  useEffect(() => {
    ChatService.getPhysicianContacts().then(response => {
      console.log('====================================');
      console.log('getPhysicianContacts', response);
      console.log('====================================');
      setProviderContactList(response.data);
    });
    ChatService.getCareCoordinationContacts().then(response => {
      console.log('====================================');
      console.log('getCareCoordinationContacts', response);
      console.log('====================================');
      setCareCoordinatorConatctList(response.data);
    });
    MedicationService.getPatientPharmacy().then(response => {
      console.log('====================================');
      console.log('getCarePharmaciesContacts', response);
      console.log('====================================');
      setPharmaciesContactList(response.data);
    });
    LabService.getLabsContactData().then(response => {
      console.log('====================================');
      console.log('getCareLabsContacts', response);
      console.log('====================================');
      setLabsContactList(response.data);
    });
  }, []);

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '75%',
          backgroundColor: Colors.lightGrey,
          // marginLeft: hp(8),
          alignSelf: 'flex-end',
          marginVertical: hp(1),
        }}
      />
    );
  };
  return (
    <SafeAreaView style={{backgroundColor: Colors.BgColor}}>
      <View style={{backgroundColor: Colors.BgColor}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.BgColor,
            width: '95%',
            height: hp(12),
            marginLeft: hp(1.5),
            paddingTop: hp(3),
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              setLab(false);
              setPharmacy(false);
              setProvider(true);
              setcCreCoordinator(false);
            }}>
            <View
              style={{
                flexDirection: 'column',
                height: hp(20),
                alignItems: 'center',
              }}>
              <Image
                source={images.providerIcon}
                style={{
                  tintColor:
                    provider === true ? colors.blueBackground : colors.black2,
                }}
              />
              <Text
                style={{
                  color:
                    provider === true ? colors.blueBackground : colors.black2,
                  fontSize: hp(1.9),
                }}>
                {'Provider'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLab(false);
              setPharmacy(true);
              setProvider(false);
              setcCreCoordinator(false);
            }}>
            <View
              style={{
                flexDirection: 'column',
                height: hp(20),
                alignItems: 'center',
              }}>
              <Image
                source={images.pharmacyIcon}
                style={{
                  tintColor:
                    pharmacy === true ? colors.blueBackground : colors.black2,
                }}
              />
              <Text
                style={{
                  color:
                    pharmacy === true ? colors.blueBackground : colors.black2,
                  fontSize: hp(1.9),
                }}>
                {'Pharmacy'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLab(true);
              setPharmacy(false);
              setProvider(false);
              setcCreCoordinator(false);
            }}>
            <View
              style={{
                flexDirection: 'column',
                height: hp(20),
                alignItems: 'center',
              }}>
              <Image
                source={images.labIcon}
                past-1707
                style={{
                  tintColor:
                    lab === true ? colors.blueBackground : colors.black2,
                }}
              />
              <Text
                style={{
                  color: lab === true ? colors.blueBackground : colors.black2,
                  fontSize: hp(1.9),
                }}>
                {'Labs'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLab(false);
              setPharmacy(false);
              setProvider(false);
              setcCreCoordinator(true);
            }}>
            <View
              style={{
                flexDirection: 'column',
                height: hp(20),
                alignItems: 'center',
              }}>
              <Image
                source={images.careCoordinatorIcon}
                style={{
                  tintColor:
                    careCoordinator === true
                      ? colors.blueBackground
                      : colors.black2,
                }}
              />
              <Text
                style={{
                  paddingTop: hp(1.3),
                  color:
                    careCoordinator === true
                      ? colors.blueBackground
                      : colors.black2,
                  fontSize: hp(1.9),
                }}>
                {'Care Coordinator'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor: Colors.BgColor, height: '90%'}}>
          <View
            style={{
              backgroundColor: Colors.white,
              height: '90%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.1,
              shadowRadius: 8,
              paddingTop: hp(2),
            }}>
            <FlatList
              contentContainerStyle={{ backgroundColor: Colors.white}}
              contentInset={{ bottom: 25 }} // Add some bottom inset
              contentOffset={{ x: 0, y:-25 }}
              ItemSeparatorComponent={renderSeparator}
              data={
                careCoordinator
                  ? careCoordinatorConatctList
                  : pharmacy
                  ? pharmaciesContactList
                  : lab
                  ? labsContactList
                  : providerContactList
              }
              renderItem={({item}) => {
                // console.log('thid kinfs tem being reviecned', item);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      {
                        careCoordinator
                          ? navigation.navigate('Chat', {
                              data: item,
                              care: careCoordinator,
                            })
                          : '';
                      }
                    }}
                    style={{
                      flex: 1,
                      height: hp(9),
                      justifyContent: 'space-evenly',
                      marginHorizontal: hp(2),
                      // marginBottom: hp(2),
                    }}>
                    {careCoordinator ? (
                      <CareCoordinationContactCard
                        name={item.name}
                        roleName={item.roleName}
                        iconimage={require('../../../../../assets/images/avatar_contacts.png')}
                        phoneNumber={item.phone}
                      />
                    ) : provider ? (
                      <ProvidersContactCard
                        iconimage={require('../../../../../assets/images/avatar_contacts.png')}
                        name={item.physicianName}
                        physicianSpeciality={item.physicianSpeciality}
                        phoneNumber={item.phoneNo}
                      />
                    ) : (
                      <PharmacyContactCard
                        item={item}
                        type={pharmacy ? 'ph' : 'lab'}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Contacts;
