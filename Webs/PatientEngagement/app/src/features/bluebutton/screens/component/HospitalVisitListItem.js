/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {FlatList, Text, TouchableOpacity, View, Dimensions} from 'react-native';

import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Fonts} from '../../../../../config/AppConfig';
import {Colors} from '../../../../../config';
import moment from 'moment';
import colors from '../../../../../config/Colors';

class HospitalVisitListItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    console.log('Item on Mount', this.props.item);
    console.log('====================================');
    console.log('shower', this.props.shower);
    console.log('====================================');
  }

  changeDateTimeFormat(dateTime) {
    return dateTime !== '' ? moment(dateTime).format('MMM DD yyyy') : 'N/A';
  }

  getVisitType(type) {
    if (type === 0) {
      return 'Emergency';
    } else if (type === 1) {
      return 'InPatient';
    } else if (type === 2) {
      return 'OutPatient';
    }
  }

  getColorOfVisitType(type) {
    if (type === 0) {
      return Colors.red3;
    } else if (type === 1) {
      return Colors.blueHeadingColor;
    } else if (type === 2) {
      return Colors.eveningHeadingColor;
    }
  }
  render() {
    return (
      <View
        style={{
          // marginLeft: hp(1),
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingBottom: hp(1.5),
          paddingtop: hp(1.5),
          marginTop: hp(2),
          paddingHorizontal: hp(1.5),
          // backgroundColor:'red'
        }}>
        <View style={{display: 'flex', alignItems: 'center'}}>
          {this.props.item.visitDateTime !== ' - ' && (
            <>
              <Text
                style={{
                  fontSize: hp(1.7),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.black,
                  marginBottom: this.props.shower ? 0 : hp(2),
                  textTransform: 'capitalize',
                }}>
                {this.changeDateTimeFormat(this.props.item.visitDateTime)}
              </Text>
            </>
          )}
          {this.props.shower && (
            <>
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: this.getColorOfVisitType(
                    this.props.item.visitType,
                  ),
                  borderRadius: 10,
                  marginTop: hp(1),
                  // marginRight: hp(4),
                  marginLeft: hp(0),
                }}
              />

              <View
                style={{
                  borderWidth: 0.5,
                  borderStyle: 'dashed',
                  borderColor: this.getColorOfVisitType(
                    this.props.item.visitType,
                  ),
                  height: hp(6),
                  position: 'absolute',
                  top: hp(3.2),
                }}
              />
            </>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.white,
            borderRadius: 10,
            // height: hp(10),
            width: '70%',
            shadowOffset: {width: 0.5, height: 0.5},
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}>
          <View
            style={{
              backgroundColor: this.getColorOfVisitType(
                this.props.item.visitType,
              ),
              width: hp(0.5),
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              // height: hp(10),
            }}></View>
          <View style={{flexDirection: 'column', padding: hp(1)}}>
            <Text
              style={{
                fontSize: hp(1.8),
                fontFamily: Fonts.SourceSansSemibold,
                color: Colors.headingColor,
                textTransform: 'capitalize',
              }}>
              {this.props.item.physician !== '' &&
              this.props.item.physician !== null
                ? this.props.item.physician
                : 'N/A'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
              }}>
              <Text
                style={{
                  marginTop: hp(0),
                  fontSize: hp(1.7),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.noRecordFound,
                  textTransform: 'capitalize',
                  // width: hp(25),
                }}>
                {this.props.item.facility !== '' &&
                this.props.item.facility !== null
                  ? this.props.item.facility
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default HospitalVisitListItem;
