//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';

// create a component
const FlatlistFooter = () => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <TextInput
          placeholder="Send message to John Doe..."
          placeholderTextColor={Colors.blueGrayDisableText}
          style={{fontFamily: Fonts.SourceSansRegular}}
        />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 1,
    borderTopColor: Colors.line,
    height: hp(10),
  },
});

//make this component available to the app
export default FlatlistFooter;
