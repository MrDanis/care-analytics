//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';

// create a component
const messages = [
  {
    image: require('../../../../../assets/images/user_logo.png'),
    name: 'John Doe',
    subText:
      'Lorem ipsum dolor sit amet,coment here Lorem ipsum dolor sit amet,coment here',
    time: '11:24 PM',
  },
  {
    image: require('../../../../../assets/images/user_logo.png'),
    name: 'John Doe',
    subText: 'Lorem ipsum dolor sit amet,coment here',
    time: '11:24 PM',
  },
  {
    image: require('../../../../../assets/images/user_logo.png'),
    name: 'John Doe',
    subText: 'Lorem ipsum dolor sit amet,coment here',
    time: '11:24 PM',
  },
  {
    image: require('../../../../../assets/images/user_logo.png'),
    name: 'John Doe',
    subText: 'Lorem ipsum dolor sit amet,coment here',
    time: '11:24 PM',
  },
];
const MessagesScreen = ({navigation}) => {
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '80%',
          backgroundColor: Colors.line,
          alignSelf: 'flex-end',
        }}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.line,
        }}>
        <FlatList
          data={messages}
          renderItem={({item, index}) => (
            <>
              <TouchableOpacity
                // onPress={() => navigation.navigate('Chat')}
                style={{
                  marginVertical: hp(1.5),
                  marginHorizontal: hp(1),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image source={item.image} style={{width: 55, height: 55}} />
                <View style={{marginLeft: hp(2), marginRight: hp(1)}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.black4,
                        fontSize: hp(1.7),
                        fontFamily: Fonts.SourceSansSemibold,
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: Colors.noRecordFound,
                        fontSize: hp(1.4),
                        fontFamily: Fonts.SourceSansSemibold,
                      }}>
                      {item.time}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: Colors.noRecordFound,
                      fontSize: hp(1.5),
                      fontFamily: Fonts.SourceSansSemibold,
                      maxWidth: '85%',
                      minWidth: '85%',
                    }}>
                    {item.subText}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <View
                style={{
                  height: 1,
                  width: '80%',
                  backgroundColor: Colors.line,
                  alignSelf: 'flex-end',
                }}
              /> */}
            </>
          )}
          ItemSeparatorComponent={renderSeparator}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={this.state.refreshing}
          //     onRefresh={this._onRefresh}
          //   />
          // }
          keyExtractor={item => Math.random().toString(36).substr(2, 9)}
        />
      </View>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.medicalHistoryBg,
  },
});

//make this component available to the app
export default MessagesScreen;
