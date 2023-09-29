import React, {Component, Fragment} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CustomProgressBar} from '../../components/CustomProgressBar';
import AssessmentService from '../../../../api/assesment';
import {connect} from 'react-redux';
import {
  OfflineAssessment,
  removeItemValue,
  retrieveItem,
  storeItem,
} from '../../../../helpers/LocalStorage';

import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import AssessmentItem from '../../components/AssessmentItem';
import Spinner from 'react-native-loading-spinner-overlay';
import {Fonts} from '../../../../../config/AppConfig';
/* istanbul ignore next */
function Item({item, navigation}) {
  console.log('item');
  console.log(item);
  const fill = item.completionPercentage;
  return (
    <AssessmentItem item={item} navigation={navigation} completed={false} />
  );
  //   <TouchableOpacity
  //     style={{
  //       backgroundColor: Colors.white,
  //       paddingVertical: hp(3),
  //       flex: 1,
  //       flexDirection: 'row',
  //     }}
  //     onPress={() => {
  //       navigation.navigate('AssessmentDetail', {
  //         itemData: item,
  //         fromPending: true,
  //         index: item.currentIndex ? item.currentIndex : 0,
  //       });
  //     }}>
  //       <AnimatedCircularProgress
  //           size={50}
  //           width={5}
  //           fill={fill}
  //           rotation={0}
  //           tintColor={Colors.blueTextColor}
  //           backgroundColor={Colors.blueGrayDisableBG}
  //       >
  //           {fill => <Text>{fill + '%'}</Text>}
  //       </AnimatedCircularProgress>
  //     {/*<View*/}
  //     {/*  style={{*/}
  //     {/*    marginLeft: 5,*/}
  //     {/*  }}>*/}
  //     {/*  <ProgressCircle*/}
  //     {/*    percent={*/}
  //     {/*      item.Progress && item.Progress !== 'NaN' ? item.Progress * 100 : 0*/}
  //     {/*    }*/}
  //     {/*    radius={40}*/}
  //     {/*    borderWidth={8}*/}
  //     {/*    color={Colors.assessment_blue_700}*/}
  //     {/*    shadowColor={Colors.shadowColor}*/}
  //     {/*    bgColor="#fff">*/}
  //     {/*    {item.Progress && item.Progress !== 'NaN' ? (*/}
  //     {/*      <Text*/}
  //     {/*        style={{*/}
  //     {/*          fontSize: hp(2),*/}
  //     {/*          fontFamily: 'Roboto-Bold',*/}
  //     {/*          color: Colors.assessment_blue_700,*/}
  //     {/*        }}>*/}
  //     {/*        {parseFloat(item.Progress * 100).toFixed(0) + '%'}*/}
  //     {/*      </Text>*/}
  //     {/*    ) : (*/}
  //     {/*      <Text*/}
  //     {/*        style={{*/}
  //     {/*          fontSize: hp(2),*/}
  //     {/*          fontFamily: 'Roboto-Bold',*/}
  //     {/*          color: Colors.assessment_blue_700,*/}
  //     {/*        }}>*/}
  //     {/*        {'0%'}*/}
  //     {/*      </Text>*/}
  //     {/*    )}*/}
  //     {/*  </ProgressCircle>*/}
  //     {/*</View>*/}
  //
  //     <View
  //       style={{
  //         flexDirection: 'column',
  //         flex: 1,
  //         marginLeft: 10,
  //         alignSelf: 'center',
  //       }}>
  //       <Text
  //         style={{
  //           fontSize: hp(3),
  //           fontFamily: 'Roboto-Medium',
  //           color: Colors.assessment_blue_700,
  //         }}>
  //         {item.title}
  //       </Text>
  //       <View style={{flexDirection: 'row'}}>
  //         <Text
  //           style={{
  //             fontSize: 12,
  //             marginTop: hp(1),
  //             marginRight: hp(0.5),
  //             fontFamily: 'Roboto-Light',
  //             color: Colors.fontGrey,
  //           }}>
  //           Publish Date:
  //         </Text>
  //         <Text
  //           style={{
  //             fontSize: 14,
  //             marginTop: hp(1),
  //             fontFamily: 'Roboto-Medium',
  //             color: Colors.label,
  //           }}>
  //           {item.modifiedDate === null ||
  //           moment(new Date(item.modifiedDate)).format('LL') ===
  //             '01 January 2020'
  //             ? 'N/A'
  //             : moment(new Date(item.modifiedDate)).format('LL')}
  //         </Text>
  //       </View>
  //     </View>
  //     <View
  //       style={{
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         flexDirection: 'row',
  //       }}>
  //       <Text
  //         style={{
  //           fontFamily: 'WisemanPTSymbols',
  //           fontSize: hp(4),
  //           marginLeft: hp(1),
  //           marginRight: hp(1),
  //           color: Colors.darkGrey,
  //           alignSelf: 'center',
  //         }}>
  //         X
  //       </Text>
  //     </View>
  //   </TouchableOpacity>
  // );
}
var Ref = null;
export class PendingAssessment extends React.PureComponent {
  /* istanbul ignore next */
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showLoader: false,
      assessmentData: [],
      allAssessmentData: [],
      selectedFilter: 'All Programs',
    };
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    Ref = this;
    // removeItemValue(OfflineAssessment);
    console.log('Component did mount is called....');
    this.callGetAssessmentListApi();
   
  }
  componentWillMount(): void {
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        console.log('This should work when we focus on someting.....');
        //Call Compliance Alert Api
        this.callGetAssessmentListApi();
      },
    );
  }
  /* istanbul ignore next */
  componentWillUnmount(): void {
      // if(this.willFocusSubscription)
      // {
      //   console.log('Focus is subscribed....');
      // }
      // this.willFocusSubscription?.remove();
  }
  /* istanbul ignore next */
  async callGetAssessmentListApi() {
    this.setState({showLoader: true});
    AssessmentService.getPendingAssessmentsList()
      .then(response => {
        console.log('res');
        console.log(response);
        this.setState({showLoader: false});
        if (response.statusCode === 200) {
          global.newAssessmentCount = response.data.length;
          // retrieveItem(OfflineAssessment).then(res => {
          //   console.log('OfflineAssessment');
          //   console.log(res);
          //   if (res && res.data.length) {
          //     let localArray = [];
          //     localArray = JSON.parse(response.data);
          //     localArray.map(rootItem => {
          //       response.data.map(item => {
          //         if (item.id === rootItem.id) {
          //           // item.progress = rootItem.progress;
          //           item.currentIndex = rootItem.currentIndex;
          //           item.reOpen = rootItem.reOpen ? rootItem.reOpen : false;
          //           return item;
          //         }
          //       });
          //     });
          this.setState({
            assessmentData: response.data,
            allAssessmentData: response.data,
          });
          // this.props.dispatch(getAssessmentList(response));
        }
        // else {
        //         this.setState({
        //             assessmentData: [],
        //             allAssessmentData: [],
        //         });
        //       // this.props.dispatch(getAssessmentList(response));
        //     }
        //   // });
        // } else {
        //   global.newAssessmentCount = 0;
        //     this.setState({
        //         assessmentData: [],
        //         allAssessmentData: [],
        //     });
        // this.props.dispatch(getAssessmentList([]));
        // }
      })
      .catch(error => {
        this.setState({showLoader: false});
        global.newAssessmentCount = 0;
        console.log('error');
        console.log(error);
        showMessage({
          message: 'Information',
          description: error.message,
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  /* istanbul ignore next */
  // componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
  //   if (nextProps.assessmentsList && nextProps.assessmentsList.length) {
  //     this.setState({
  //       assessmentData: nextProps.assessmentsList,
  //       allAssessmentData: nextProps.assessmentsList,
  //     });
  //   } else {
  //     this.setState({
  //       assessmentData: [],
  //       allAssessmentData: [],
  //     });
  //   }
  // }
  /* istanbul ignore next */
  onRefresh() {
    this.callGetAssessmentListApi();
  }
  /* istanbul ignore next */
  renderSeparator = () => {
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
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.BgColor,
            flexDirection: 'column',
          }}>
          {this.state.assessmentData.length ? (
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.assessmentData}
                extraData={this.state.refresh}
                renderItem={({item}) => (
                  <Item item={item} navigation={this.props.navigation} />
                )}
                keyExtractor={item => item.assessmentID}
                // ItemSeparatorComponent={this.renderSeparator}
                refreshControl={
                  <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                  />
                }
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }>
              <Text
                style={{
                  fontSize: hp(2),
                  color: Colors.fontGrey,
                  fontFamily: Fonts.SourceSansRegular,
                }}>
                No Screening Available.
              </Text>
            </ScrollView>
          )}
          {this.state.showLoader === true ? (
            <Spinner
              visible={this.state.showLoader}
              textContent={'Loading...'}
              textStyle={{color: '#FFF'}}
            />
          ) : null}
        </View>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
// const mapStateToProps = ({assessmentsList}) => ({
//   assessmentsList,
// });
// /* istanbul ignore next */
// export default connect(mapStateToProps)(PendingAssessment);

export default PendingAssessment;
