import {View, Text, Image} from 'react-native';
import React from 'react';
import {Colors} from '../../../../../config';
import {Fonts} from '../../../../../config/AppConfig';
import images from '../../../../../config/Images.js';
import {SvgCssUri} from 'react-native-svg';
import moment from 'moment';

import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';

class MedicalHistoryCard extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(
      'Icon url is : ',
      this.props?.item?.iconUrl,
      ' and the item is : ',
      this.props?.item,
    );
    console.log('prosp are coming in the history task are ', props?.item);
  }
  titleDecider(item) {
    if (item?.moduleId == 1) {
      return 'Disease';
    } else if (item?.moduleId == 2) {
      return 'Allergies';
    } else if (item?.moduleId == 4) {
      return 'Coverage';
    } else if (item?.moduleId == 5) {
      return 'Visits';
    } else if (item?.moduleId == 6) {
      return 'Medications';
    } else if (item?.moduleId == 7) {
      return 'Procedure';
    } else if (item?.moduleId == 8) {
      return 'My PCPs';
    }
  }
  DateDecider(item) {
    if (item?.moduleId == 1) {
      return item?.diagnosisDate
        ? moment(item?.diagnosisDate).format('ddd, MMM D , YYYY')
        : '';
    } else if (item?.moduleId == 2) {
      return '';
    } else if (item?.moduleId == 4) {
      return '';
    } else if (item?.moduleId == 5) {
      return item?.serviceDate
        ? moment(item?.serviceDate).format('ddd, MMM D , YYYY')
        : '';
    } else if (item?.moduleId == 6) {
      return item?.serviceDate
        ? moment(item?.serviceDate).format('ddd, MMM D , YYYY')
        : '';
    } else if (item?.moduleId == 7) {
      return item?.serviceDate
        ? moment(item?.serviceDate).format('ddd, MMM D , YYYY')
        : '';
    } else if (item?.moduleId == 8) {
      return '';
    }
  }
  DescriptionDecider(item) {
    console.log('====================================');
    console.log('item in desc', item);
    console.log('====================================');
    if (item?.moduleId == 1) {
      return item?.code ? 'ICD ' + item?.code : 'No Disease Found';
    } else if (item?.moduleId == 2) {
      return item?.diagnosisCode ? item.diagnosisCode : 'No Allergies Found';
    } else if (item?.moduleId == 4) {
      return item?.monthlyEnrolmentInfo
        ? item?.monthlyEnrolmentInfo
        : 'Not Eligible';
    } else if (item?.moduleId == 5) {
      return item?.physician === null
        ? 'No Visits '
        : item?.lastVisits[0]?.physician;
    } else if (item?.moduleId == 6) {
      return item?.propName ? item?.propName : 'No Medications Found';
    } else if (item?.moduleId == 7) {
      return 'CPT ' + item?.cpt ? 'CPT ' + item?.cpt : 'No Procedures';
    } else if (item?.moduleId == 8) {
      return item?.name?.length > 0 ? item?.name : 'No Providers found';
    }
  }
  TimeDecider(item) {
    if (item?.moduleId == 1) {
      return item?.description;
    } else if (item?.moduleId == 2) {
      return '';
    } else if (item?.moduleId == 4) {
      return item?.referenceNumber;
    } else if (item?.moduleId == 5) {
      return '';
    } else if (item?.moduleId == 6) {
      return item?.prescribedBy;
    } else if (item?.moduleId == 7) {
      return item?.description;
    } else if (item?.moduleId == 8) {
      return item?.facility;
    }
  }
  render() {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginVertical: hp(1.5),
          marginHorizontal: hp(2),
        }}>
        <View
          style={{
            // height: '17%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <SvgCssUri
              width={25}
              height={25}
              // uri={
              //   'https://pre-release.wmi360.com/360PatientEngagement/Assets/PatientHistory/allergy.svg'
              // }
              uri={this.props?.item?.iconUrl}
              fill={Colors.black}
            />
            {/* <Image
              style={{
                width: 25,
                height: 25,
                // marginLeft: hp(2),
                // marginTop: hp(1.5),
                resizeMode: 'contain',
              }}
              source={this.props.iconimage}
            /> */}
            <View style={{width: hp(20)}}>
              <Text
                style={{
                  marginHorizontal: hp(2),
                  // marginTop: hp(2),
                  fontFamily: Fonts.SourceSansRegular,
                  color: Colors.black,
                  fontSize: hp(2),
                }}>
                {this.titleDecider(this.props.item)}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginHorizontal: hp(2),
                marginLeft: 0,
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.blueGrayDisableText,
                fontSize: hp(1.7),
              }}>
              {this.DateDecider(this.props.item)}
            </Text>
            <Image
              style={{
                marginHorizontal: hp(0),
                marginTop: hp(0.7),
                color: Colors.blueGrayDisableText,
              }}
              source={images.arrowRight}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(1.5),
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: 'blue',
            borderWidth: 0,
          }}>
          <Text
            style={{
              // marginHorizontal: hp(2),
              marginTop: hp(0),
              fontFamily: Fonts.SourceSansSemibold,
              fontSize: hp(2),
              color: Colors.black1,
            }}>
            {this.DescriptionDecider(this.props.item)}
          </Text>
          {/* {this.props.medstatus == null ? (
            <View></View>
          ) : ( */}
          {this.props.item?.moduleId === 5 &&
            this.props.item?.visitTypeDesc !== null && (
              <View
                style={{
                  // width: '30%',
                  backgroundColor: Colors.medIconBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: hp(5),
                  borderRadius: 30,
                  elevation: 10,
                  height: hp(2.5),
                  marginTop: hp(-2),
                  paddingHorizontal: hp(1),
                }}>
                <Text style={{color: Colors.white, fontSize: hp(1.5)}}>
                  {this.props.item?.lastVisits[0]?.visitTypeDesc}
                </Text>
              </View>
            )}
          {/* )} */}
        </View>

        <Text
          style={{
            // marginHorizontal: hp(2),
            marginTop: hp(1.7),
            fontFamily: Fonts.SourceSansRegular,
            color: Colors.blueGrayDisableText,
            fontSize: hp(2),
          }}>
          {this.TimeDecider(this.props?.item)}
        </Text>
      </View>
    );
  }
}

export default MedicalHistoryCard;
