import React, {Component, Fragment} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../../../../config/Colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CustomProgressBar} from '../../components/CustomProgressBar';
import AssessmentService from '../../../../api/assesment';
import moment from 'moment';
import PendingAssessment from './PendingAssessment';
import Images from '../../../../../config/Images';
import AssessmentItem from '../../components/AssessmentItem';
import Spinner from 'react-native-loading-spinner-overlay';
import {Fonts} from '../../../../../config/AppConfig';

export class CompletedAssessment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showLoader: false,
      assessmentsList: [],
    };
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    this.getAllCompletedAssessmentsFromServer();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        console.log('come here to foucs');
        //Call Compliance Alert Api
        this.getAllCompletedAssessmentsFromServer();
      },
    );
  }
  /* istanbul ignore next */
  componentWillUnmount(): void {
    // this.willFocusSubscription.remove();
  }
  /* istanbul ignore next */
  getAllCompletedAssessmentsFromServer() {
    this.setState({showLoader: true});
    AssessmentService.getCompletedAssessmentsList()
      .then(res => {
        console.log('getCompletedAssessmentsList');
        console.log('Results of the complete assesment are ',res);
        this.setState({assessmentsList: res.data, showLoader: false});
        // if (res.length) {
        //     this.setState({
        //         assessmentsList: res.data,
        //     });
        //   // this.props.dispatch(getCompletedAssessmentsList(res));
        // } else {
        //   // this.props.dispatch(getCompletedAssessmentsList([]));
        // }
      })
      .catch(err => {
        console.log('error');
        // this.setState({showLoader: false});
        console.log(err);
      });
  }
  /* istanbul ignore next */
  onRefresh() {
    this.getAllCompletedAssessmentsFromServer();
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
            borderColor:'red',
            borderWidth:0
          }}>
          <View style={{flex: 1,borderColor:'red',borderWidth:0}}>
            {this.state.assessmentsList?.length ? (
              <FlatList
                data={this.state.assessmentsList}
                style={{paddingTop: hp(1.5),borderColor:'red',borderWidth:0}}
                renderItem={({item}) => (
                  <AssessmentItem
                    item={item}
                    navigation={this.props.navigation}
                    completed={true}
                    titleDate={item?.modifiedDate}
                  />

                  // <TouchableOpacity
                  //   style={{
                  //     backgroundColor: Colors.white,
                  //     paddingVertical: hp(3),
                  //     flex: 1,
                  //     alignItems: 'center',
                  //     justifyContent: 'center',
                  //     flexDirection: 'row',
                  //   }}
                  //   onPress={() => {
                  //     this.props.navigation.navigate('AssessmentSummary', {
                  //       data: item,
                  //       progress: 1,
                  //       isCompleted: true,
                  //     });
                  //   }}>
                  //   <View
                  //     style={{
                  //       alignSelf: 'center',
                  //       marginLeft: hp(2),
                  //       marginRight: hp(2),
                  //       height: 76,
                  //       width: 76,
                  //     }}>
                  //     <Image
                  //         source={Images.completeAssessment}
                  //         style={{
                  //           alignSelf: 'center',
                  //           height: hp(6),
                  //           width: hp(6),
                  //         }}
                  //     />
                  //   </View>
                  //
                  //   <View
                  //     style={{
                  //       flexDirection: 'column',
                  //       flex: 1,
                  //       alignSelf: 'center',
                  //     }}>
                  //     <Text
                  //       style={{
                  //         fontSize: hp(3),
                  //         fontFamily: 'Roboto-Medium',
                  //         color: Colors.assessment_blue_700,
                  //       }}>
                  //       {item.title}
                  //     </Text>
                  //     <View style={{flexDirection: 'row'}}>
                  //       <Text
                  //         style={{
                  //           fontSize: 12,
                  //           marginTop: hp(1),
                  //           marginRight: hp(0.5),
                  //           fontFamily: 'Roboto-Light',
                  //           color: Colors.fontGrey,
                  //         }}>
                  //         Completed Date:
                  //       </Text>
                  //       <Text
                  //         style={{
                  //           fontSize: 14,
                  //           marginTop: hp(1),
                  //           fontFamily: 'Roboto-Regular',
                  //           color: Colors.label,
                  //         }}>
                  //         {moment(new Date(item.modifiedDate)).format('LL') ===
                  //         '01 January 2020'
                  //           ? 'N/A'
                  //           : moment(new Date(item.modifiedDate)).format('LLL')}
                  //       </Text>
                  //     </View>
                  //   </View>
                  //   <View
                  //     style={{
                  //       alignItems: 'center',
                  //       justifyContent: 'center',
                  //       flexDirection: 'row',
                  //     }}>
                  //     <Text
                  //       style={{
                  //         fontFamily: 'WisemanPTSymbols',
                  //         fontSize: hp(4),
                  //         marginLeft: hp(1),
                  //         marginRight: hp(1),
                  //         color: Colors.darkGrey,
                  //         alignSelf: 'center',
                  //       }}>
                  //       X
                  //     </Text>
                  //   </View>
                  // </TouchableOpacity>
                )}
                // renderItem={({item}) => (
                //   <Item item={item} navigation={this.props.navigation} />
                // )}
                keyExtractor={item => item.id}
                // ItemSeparatorComponent={this.renderSeparator}
                refreshControl={
                  <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                  />
                }
              />
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
          </View>

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
export default CompletedAssessment;
