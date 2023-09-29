/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {FlatList, Text, TouchableOpacity, View, Dimensions} from 'react-native';

import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import {Colors} from '../../../../../config';

class ProviderListItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount(): void {}

  render() {
    return (
      <View
        style={{
          shadowOffset: {width: 0.5, height: 0.5},
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
          backgroundColor: Colors.white,
          paddingTop: hp(1),
          marginTop: hp(3),
          width: 300,
          height: hp(15),
          borderRadius: 10,
        }}>
        <View style={{flexDirection: 'row',}}>
          <Text
            style={{
              fontSize: hp(2.3),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.black,
              marginLeft: hp(1),
              textTransform: 'capitalize',
            }}>
            {this.props.item.name !== '' && this.props.item.name !== null
              ? this.props.item.name
              : 'N/A'}
          </Text>
        </View>
        {this.props.item.facility !== '' &&
          this.props.item.facility !== null && (
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Text
                style={{
                  marginTop: hp(0.5),
                  marginLeft: hp(1),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.noRecordFound,
                  width: hp(8),
                  fontSize: hp(2),
                }}>
                Facility:
              </Text>
              <Text
                style={{
                  marginTop: hp(0.5),
                  marginLeft: hp(0),
                  fontSize: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.black,
                  textTransform: 'capitalize',
                  marginRight: hp(2),
                  width: '55%',
                }}
                numberOfLines={0}
                ellipsizeMode={'tail'}>
                {this.props.item.facility}
              </Text>
            </View>
          )}
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              marginTop: hp(0.5),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.noRecordFound,
              marginLeft: hp(1),
              width: hp(8),
              fontSize: hp(2),
            }}>
            Address:
          </Text>
          <Text
            style={{
              marginTop: hp(0.5),
              marginLeft: hp(0),
              fontSize: hp(1.9),
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.black,
              textTransform: 'capitalize',
              width: '70%',
            }}
            numberOfLines={0}
            ellipsizeMode={'tail'}>
            {this.props.item.address}{' '}
          </Text>
        </View>
      </View>
    );
  }
}

export default ProviderListItem;
