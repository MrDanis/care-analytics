import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {MedicationIndicator} from '../MedicationIndicator';
import Reinput from 'reinput';
import Colors from '../../../../../config/Colors';
import {Fonts} from '../../../../../config/AppConfig';
import ArrowIcon from '../../../../../../assets/svg/arrow_left.svg';
import React from 'react';
import MedicationService from '../../../../api/medication';
import {getLookUpMedication} from '../../actions';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
// import {SvgNoImageFoundIcon} from '../../constants';
import Images from '../../../../../config/Images';
import IconSearch from '../../../../../../assets/svg/icon_search.svg';
import EmptyIcon from '../../../../../../assets/svg/empty_norecords.svg';
import SvgNoImageFoundIcon from '../../../../../../assets/svg/noMedImage.svg';
import {SvgCss} from 'react-native-svg';
import {Svgs} from '../../../../../config';

let PrvProps = null;

class Step1 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.textInputRef = null;
    PrvProps = props;
    this.state = {
      nameVal: '',
      showTick: false,
      snackbarColor: Colors.green,
      bottomLineColor: Colors.darkGrey,
      placeholderTextColor: Colors.label,
      showLoader: false,
      data: [],
      showEmptyMsg: false,
    };
  }

  componentDidMount(): void {
    console.log('this.state.nameVal', this.state.nameVal);
    this.props.dispatch(getLookUpMedication([]));
  }

  getMedicationData(name) {
    this.setState({showLoader: true});
    console.log('getMedicationLookUpData', name);
    MedicationService.getMedicationLookUp(name)
      .then(response => {
        this.setState({showLoader: false});
        console.log('getMedicationLookUp');
        console.log(response);
        if (response && response.statusCode === 200) {
          this.props.dispatch(getLookUpMedication(response.data));
          this.setState({showEmptyMsg: true});
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('Catch Block');
        console.log(error);
      });
  }

  onError(error) {
    this.setState({showLoader: false});
    console.log(error);
    console.log('Error Block');
    this.setState({image: Images.noImageFound});
  }

  render() {
    return (
      <View
        style={{flex: 1, marginTop: hp(2), backgroundColor: Colors.BgColor,borderColor:'red',borderWidth:0}}>
        <Spinner
          visible={this.state.showLoader}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '92%',
            marginLeft: hp(1.6),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            height: hp(8),
            borderColor: Colors.circleBackground,
            borderRadius: 5,
          }}>
          <SvgCss
            xml={Svgs.arrowHeadLeft}
            width={hp(5)}
            height={hp(4)}
            fill={Colors.black}
            onPress={() => this.props.navigation.pop()}
            style={{marginLeft: hp(2)}}
          />
          <TextInput
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: Colors.BgColor,
              color: '#424242',
              borderRadius: 5,
              borderColor: Colors.lightGrey,
              flexDirection: 'row',
              width: '75%',
              height: 50,
              alignSelf: 'center',
              marginRight: hp(1),
              fontSize: hp(2.2),
              fontFamily: Fonts.SourceSansRegular,
            }}
            value={this.state.nameVal}
            keyboardType="email-address"
            onChangeText={text => {
              this.setState({nameVal: text});
              console.log('On change call');
            }}
            onSubmitEditing={() => {
              // this.phone.focus();
              console.log('End Editing Called');
              if (this.state.nameVal.length > 1) {
                if (
                  this.state.nameVal.length >= 3 &&
                  this.state.nameVal.length <= 50
                ) {
                  this.getMedicationData(this.state.nameVal);
                } else {
                  alert('Medicine name must contain at least 3 characters.');
                }
              }
            }}
            placeholder={'Search'}
            placeholderTextColor={Colors.black2}
          />

          <TouchableOpacity
            onPress={() => {
              if (
                this.state.nameVal.length >= 3 &&
                this.state.nameVal.length <= 50
              ) {
                this.getMedicationData(this.state.nameVal);
              } else {
                alert('Medicine name must contain at least 3 characters.');
              }
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 8,
              width: 8,
              marginRight: hp(4),
            }}>
            <IconSearch />
          </TouchableOpacity>
        </View>
        {Object.keys(this.props.medicationLookUpData).length ? (
          <View
            style={{flex: 1, marginVertical: hp(1.5), marginHorizontal: hp(2),borderColor:'red',borderWidth:0}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.props.medicationLookUpData}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    global.selectedData = {};
                    global.selectedData.fdaMedicine = item;
                    global.selectedData.id = 0;
                    this.props.nextStep();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: hp(2),
                  }}>
                  {item.imagePath && item.imagePath !== '' ? (
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        // borderRadius: 50 / 2,
                        alignSelf: 'center',
                        marginRight: hp(1),
                      }}
                      source={Images.medIcon4x}
                    />
                  ) : (
                    // <View
                    //     style={{
                    //         width: 50,
                    //         height: 50,
                    //         borderRadius: 50 / 2,
                    //         alignSelf: 'center',
                    //         marginRight: hp(1),
                    //     }}>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        // borderRadius: 50 / 2,
                        alignSelf: 'center',
                        marginRight: hp(1),
                        // borderColor:'red',
                        // borderWidth:2
                      }}
                      source={Images.medIcon4x}
                    />
                    // </
                  )}
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      marginRight: hp(1.5),
                      borderColor:'red',
                      borderWidth:0
                    }}>
                    <View
                      style={{flex: 1, flexDirection: 'row', height: hp(3.2),borderColor:'red',borderWidth:0}}>
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansBold,
                          fontSize: hp(2.2),
                          flex: 1,
                          color: Colors.black1,
                          textTransform: 'capitalize',
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={1}>
                        {item.proprietaryname}
                        {item.strength !== null && (
                          <Text
                            style={{
                              fontFamily: Fonts.SourceSansBold,
                              fontSize: hp(2.2),
                              flex: 1,
                              color: Colors.black1,
                              textTransform: 'capitalize',
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {'(' + item.strength + ')'}
                          </Text>
                        )}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(1.7),
                        flex: 1,
                        color: Colors.black2,
                        textTransform: 'capitalize',
                      }}>
                      {'Formula: '}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(1.7),
                          flex: 1,
                          color: Colors.black2,
                          textTransform: 'capitalize',
                        }}>
                        {item.nonproprietaryname}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(1.7),
                        flex: 1,
                        color: Colors.black2,
                        textTransform: 'capitalize',
                      }}>
                      {'Mfr. by: '}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(1.7),
                          flex: 1,
                          color: Colors.black2,
                          textTransform: 'capitalize',
                        }}>
                        {item.manufacturer}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.SourceSansBold,
                        fontSize: hp(1.7),
                        flex: 1,
                        color: Colors.black2,
                        textTransform: 'capitalize',
                      }}>
                      {'strip size: '}{' '}
                      <Text
                        style={{
                          fontFamily: Fonts.SourceSansSemibold,
                          fontSize: hp(1.7),
                          flex: 1,
                          color: Colors.black2,
                          textTransform: 'capitalize',
                        }}>
                        {item.packageSize}
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.NDC}
            />
          </View>
        ) : (
          this.state.showEmptyMsg && (
            <View
              style={{
                width: '100%',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                height: '100%',
              }}>
              <Image
                source={Images.emptyIcon}
                style={{
                  alignSelf: 'center',
                  height: hp(16),
                  width: hp(18),
                }}
              />
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontFamily: Fonts.SourceSansSemibold,
                  color: Colors.regularLabel,
                  marginTop: hp(4),
                  marginRight: hp(10),
                  marginLeft: hp(10),
                  textAlign: 'center',
                }}>
                No Record Found
              </Text>
            </View>
          )
        )}
      </View>
    );
  }
}

/* istanbul ignore next */
const mapStateToProps = ({medicationLookUpData}) => ({
  medicationLookUpData,
});
export default connect(mapStateToProps)(Step1);
