import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  BackHandler,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../../../config';
import {connect, useDispatch, useSelector} from 'react-redux';
import ProfileService from '../../../api/profile';
import {getUserProfile} from '../../profile/action';
import MyCareModules from '../components/MyCareModules';
import HeaderImage from '../components/HeaderImage';
import FooterModules from '../components/FooterModules';

const Modules = [
  {
    name: 'My Vitals',
    key: 'V',
    image: require('../../../../../assets/images/Vital_color.png'),
  },
  {
    name: 'Assessments',
    key: 'A',
    image: require('../../../../../assets/images/assessment_color.png'),
  },
];
console.log('====================================');
console.log('Modules', Modules);
console.log('====================================');

const 
MyCareScreen = props => {
  const userProfileData = useSelector(state => state.userProfileData);
  const dispatch = useDispatch();
  useEffect(() => {
    // BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    ProfileService.getUserProfile()
      .then(response => {
        console.log('getUserProfile');
        console.log(response);
        if (response && response.statusCode === 200) {
          // setPatientData(response.data);
          dispatch(getUserProfile(response.data));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // const handleBackButtonClick = () => {
  //   console.log('====================================');
  //   console.log('here in MyCare');
  //   console.log('====================================');
  //   props.navigation.navigate('HomeTab');
  // };

  return (
    <SafeAreaView
      style={{flex: 1, height: '100%', backgroundColor: Colors.backgroundMainLogin}}>
      {/* <ScrollView style={{flex: 1}} nestedScrollEnabled={true}> */}
      <View
        style={{
          flex: 1,
          maxWidth: '90%',
          minWidth: '90%',
          alignSelf: 'center',
        }}>
        <FlatList
          nestedScrollEnabled={true}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          ListHeaderComponent={
            <HeaderImage userProfileData={userProfileData} />
          }
          ListFooterComponent={<FooterModules navigation={props.navigation} />}
          data={Modules}
          numColumns={2}
          renderItem={({item}) => {
            console.log('====================================');
            console.log('item', item);
            console.log('====================================');
            return (
              <MyCareModules
                name={item.name}
                image={item.image}
                navigation={props.navigation}
                Module={item.key}
              />
            );
          }}
        />
        {/* <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {Modules.map((item, index) => {
              console.log('====================================');
              console.log('item', item);
              console.log('====================================');
              return (
                <MyCareModules
                  name={item.name}
                  image={item.image}
                  key={index}
                />
              );
            })}
          </View> */}
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default connect()(MyCareScreen);
