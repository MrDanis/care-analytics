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
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import {sendMessagetoCM} from '../../../helpers/signalR/SignalRService';
import FlatlistFooter from '../components/FlatListFooter';
import Header from '../components/Header';
import ChatService from '../../../api/chat';
import {clearData, getHistoryData} from '../actions';
import {isSameDay} from '../../../helpers/Common';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

// create a component
var paegNo = 0;
var myRef = null;
var arrHistory = [];
export class ChatScreen extends React.PureComponent {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
    headerBackTitle: 'Messages',
  };
  constructor(props) {
    super(props);
    console.log(
      'this is the data thats being recieved in the chat component',
      props.route.params,
    );
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isLoading: false,
      refreshing: false,
      arrMessage: [],
      currentMessage: '',
      stickyHeaderIndices: [0],
      status: 0,
      showText: false,
      height: 0,
      pageNumber: 0,
      scrolling: true,
      isCareCordinator: props.route.params.care,
      // intervalId: 0,
    };
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    myRef = this;
    this.loadHistory();
    const homeData = {
      patientId: this.props.homeApiData.patientId,
      acoKey: this.props.homeApiData.acoKey,
    };
  }

  /* istanbul ignore next */
  // handleBackButtonClick() {
  //   const screen = this.props.navigation
  //     .dangerouslyGetParent()
  //     .getParam('screen');
  //   console.log(screen);
  //   if (screen === 'call') {
  //     this.props.navigation.navigate('CallUI');
  //   } else {
  //     this.props.navigation.goBack(null);
  //     // clearInterval(this.state.intervalId);
  //   }
  //   return true;
  // }
  /* istanbul ignore next */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.arrMessage !== this.state.arrMessage) {
      // console.log('received status', this.state.arrMessage);
      this.createHistoryList(this.state.arrMessage, true);
    }
  }
  /* istanbul ignore next */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.historyData !== prevState.arrMessage) {
      return {arrMessage: nextProps.historyData};
    } else {
      return null;
    }
  }
  /* istanbul ignore next */
  showText(text) {
    myRef.setState({
      showText: text,
    });
  }
  /* istanbul ignore next */
  onRefresh() {
    console.log('====================================');
    console.log('here in refresh');
    console.log('====================================');
    this.setState({scrolling: false});
    this.loadHistory();
  }

  /* istanbul ignore next */
  loadHistory() {
    this.setState({refreshing: true});
    ChatService.getChatHistoryData(
      this.state.isCareCordinator === true
        ? this.props?.route?.params?.data?.userId
        : this.props?.route?.params?.data?.physicianNPI,

      this.state.pageNumber,
      null,
    )
      .then(response => {
        console.log(response);
        this.setState({refreshing: false});
        if (this.state.pageNumber === 0) {
          this.setState({arrMessage: []});
          arrHistory = [];
          this.props.dispatch(clearData([]));
        }
        var responseData = JSON.parse(JSON.stringify(response));
        console.log('====================================');
        console.log('responseData', responseData);
        console.log('====================================');
        if (responseData.data.length) {
          ``;
          this.setState({pageNumber: this.state.pageNumber + 1});
          // console.log('pagenumber', pageNumber);
        }
        if (responseData.data.length) {
          console.log('====================================');
          console.log('here');
          console.log('====================================');
          this.props.dispatch(getHistoryData(responseData.data));
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({refreshing: false});
      });
    console.log('====================================');
    console.log('page number', this.state.pageNumber);
    console.log('====================================');
  }
  /* istanbul ignore next */
  createHistoryList(data, flag) {
    console.log('====================================');
    console.log('data', data);
    console.log('====================================');
    arrHistory = [];
    data.map(item => {
      if (!arrHistory.length) {
        // item.isDate = true;
        item.showTime = true;
        var date = {};
        date.isDate = true;
        date.timeStamp = item.timeStamp;
        arrHistory.push(date);
      } else if (
        !isSameDay(
          new Date(arrHistory[arrHistory.length - 1].timeStamp),
          new Date(item.timeStamp),
        )
      ) {
        // item.isDate = true;
        arrHistory[arrHistory.length - 1].showTime = true;
        item.showTime = true;
        var date = {};
        date.isDate = true;
        date.timeStamp = item.timeStamp;
        arrHistory.push(date);
      } else {
        arrHistory[arrHistory.length - 1].showTime = true;
        item.showTime = true;
      }
      arrHistory.push(item);
    });
    var arr = [];
    arrHistory.map(obj => {
      if (obj.isDate) {
        arr.push(arrHistory.indexOf(obj));
      }
    });
    this.setState({
      stickyHeaderIndices: arr,
    });
    console.log('history array', arrHistory);
    console.log('Page Number', this.state.pageNumber);
    // console.log('indecies arrray', this.state.stickyHeaderIndices);
  }

  renderItem(item, patientId, careManagerId) {
    return (
      <>
        {item.isDate && item.isDate === true ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: hp(2),
            }}>
            <Text
              style={{
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.noRecordFound,
                fontSize: hp(1.7),
              }}>
              {moment(item.timeStamp).format('MM/DD/YYYY')}
            </Text>
          </View>
        ) : null}
        {item.senderId === careManagerId.toLowerCase() &&
          item.showTime &&
          item.showTime === true && (
            <View
              style={{
                marginVertical: hp(1.5),
                marginHorizontal: hp(2),
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <Image
                source={require('../../../../../assets/images/user_logo.png')}
                style={{width: 35, height: 35}}
              />
              <View
                style={{
                  marginLeft: hp(1.5),
                  // marginRight: hp(2),
                  backgroundColor:
                    item.senderId === careManagerId.toLowerCase()
                      ? Colors.bleLayer4
                      : Colors.blueGrayDisableBG,
                  borderRadius: 8,
                  maxWidth: '85%',
                }}>
                <Text
                  style={{
                    color: Colors.headingColor,
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    paddingHorizontal: hp(2),
                    paddingTop: hp(1),
                  }}>
                  {item.message}
                </Text>
                <Text
                  style={{
                    color: Colors.noRecordFound,
                    fontSize: hp(1.5),
                    fontFamily: Fonts.SourceSansRegular,
                    paddingHorizontal: hp(2),
                    paddingBottom: hp(1),
                    paddingTop: hp(1),
                  }}>
                  {moment(item.timeStamp).format('hh:mm A')}
                </Text>
              </View>
            </View>
          )}
        {parseInt(item.senderId) === patientId &&
          item.showTime &&
          item.showTime === true && (
            <View
              style={{
                marginVertical: hp(1.5),
                marginHorizontal: hp(1.5),
                flexDirection: 'row',
                alignItems: 'flex-end',
                alignSelf: 'flex-end',
              }}>
              <View
                style={{
                  marginLeft: hp(2),
                  marginRight: hp(1),
                  backgroundColor:
                    parseInt(item.senderId) === patientId
                      ? Colors.blueGrayDisableBG
                      : Colors.white,
                  borderRadius: 8,
                  maxWidth: '85%',
                }}>
                <Text
                  style={{
                    color: Colors.headingColor,
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansRegular,
                    paddingHorizontal: hp(2),
                    paddingTop: hp(1),
                  }}>
                  {item.message}
                </Text>
                <Text
                  style={{
                    color: Colors.noRecordFound,
                    fontSize: hp(1.5),
                    fontFamily: Fonts.SourceSansRegular,
                    paddingHorizontal: hp(2),
                    paddingBottom: hp(1),
                    paddingTop: hp(1),
                  }}>
                  {moment(item.timeStamp).format('hh:mm A')}
                </Text>
              </View>
              <Image
                source={require('../../../../../assets/images/user_logo.png')}
                style={{width: 35, height: 35}}
              />
            </View>
          )}
      </>
    );
  }

  renderBody = () => {
    return (
      <View
        style={{
          height: '85%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: Colors.white,
          shadowOffset: {width: 0.5, height: 0.5},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingTop: hp(2),
        }}>
        <FlatList
          inverted={false}
          ref="flatList"
          onContentSizeChange={() => {
            this.state.scrolling ? this.refs.flatList.scrollToEnd() : null;
          }}
          data={arrHistory}
          keyExtractor={(item, index) => index.toString()}
          stickyHeaderIndices={this.state.stickyHeaderIndices}
          contentContainerStyle={{paddingTop: 10, paddingBottom: 10}}
          renderItem={({item, index}) =>
            this.renderItem(
              item,
              this.props.homeApiData.common.patientId,
              this.props.homeApiData.common.careManagerId,
            )
          }
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  };

  changeText(value) {
    // if (
    //   value.includes('[') ||
    //   value.includes(']') ||
    //   value.includes('(') ||
    //   value.includes(')') ||
    //   value.includes('{') ||
    //   value.includes('}') ||
    //   value.includes('^') ||
    //   value.includes("'") ||
    //   value.includes('"') ||
    //   value.includes('<') ||
    //   value.includes('>')
    // ) {
    //   this.setState({currentMessage: ''});
    // } else {
    //   this.setState({currentMessage: value});
    // }
    const result = value.replace(/[^a-zA-Z0-9.,?!@#%&*-=+:; ]/gi, '');

    this.setState({currentMessage: result});
    // var regex = new RegExp('^[a-zA-Z0-9]+$');
    // var key = String.fromCharCode(
    //   !value.charCode ? value.which : value.charCode,
    // );
    // if (!regex.test(key)) {
    //   //  value.preventDefault();
    //   return false;
    // }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={Colors.white}
          barStyle="dark-content"
          hidden={false}
        />

        <Header
          navigation={this.props.navigation}
          careData={this.props.route.params}
          homeApiData={this.props.homeApiData.common}>
          <KeyboardAwareScrollView
            style={{flex: 1}}
            // behavior="padding"
            // resetScrollToCoords={{x: 0, y: 0}}
            contentContainerStyle={{
              flex: 1,
              marginTop: hp(2),
              backgroundColor: Colors.white,
              borderTopLeftRadius: hp(3),
              borderTopRightRadius: hp(3),
              shadowOffset: {width: 0.5, height: 0.5},
              shadowOpacity: 0.15,
              shadowRadius: 5,
              elevation: 5,
            }}
            extraScrollHeight={Platform.isPad ? 100 : 40}
            scrollEnabled={false}
            enableAutomaticScroll={true}
            keyboardShouldPersistTaps="handled">
            {arrHistory.length ? (
              this.renderBody()
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
                    color: Colors.noRecordFound,
                    fontFamily: Fonts.SourceSansRegular,
                  }}>
                  No Message Available.
                </Text>
              </ScrollView>
            )}
            <View
              style={{
                backgroundColor: Colors.white,
                // borderRadius: 1,
                borderTopColor: Colors.transparent,

                height:
                  this.state.currentMessage === ''
                    ? hp(8)
                    : Math.max(1, this.state.height),
                maxHeight: hp(10),
                minHeight: hp(8),
              }}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  // borderRadius: 1,
                  // paddingVertical: hp(-1),
                  borderTopColor: Colors.transparent,
                  margin: hp(1),

                  height:
                    this.state.currentMessage === ''
                      ? hp(8.5)
                      : Math.max(1, this.state.height),
                  maxHeight: hp(10),
                  minHeight: hp(8),
                }}>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    marginBottom: hp(2),
                    height:
                      this.state.currentMessage === ''
                        ? hp(8)
                        : Math.max(2, this.state.height),
                    borderRadius: 10,
                    backgroundColor: Colors.blueGrayDisableBG,
                    alignItems:
                      this.state.currentMessage.length > 60
                        ? 'flex-end'
                        : 'center',
                    flexDirection: 'row',
                    marginHorizontal: hp(0),
                    // marginBottom: hp(5),
                    marginVertical:
                      this.state.currentMessage.length > 60 ? hp(2) : 0,
                  }}>
                  {/* <TouchableOpacity>
                    <Image
                      source={require('../../../../../assets/images/addMediaKeyboardIcon.png')}
                      style={{width: 35, height: 35, marginLeft: hp(1.2)}}
                    />
                  </TouchableOpacity> */}
                  <TextInput
                    placeholder={
                      'Write your message'
                      // 'Send message to ' +
                      // this.props.homeApiData?.common?.careManagerName +
                      // '...'
                    }
                    placeholderTextColor={Colors.blueGrayDisableText}
                    style={{
                      fontFamily: Fonts.SourceSansRegular,
                      fontSize: hp(2),
                      color: Colors.black4,
                      width: '86%',
                      paddingLeft: hp(1),
                      height: Math.max(4, this.state.height),
                      maxHeight: hp(5),
                      flexWrap: 'wrap',
                      minHeight: hp(4),
                    }}
                    multiline={true}
                    onChangeText={value => {
                      this.changeText(value);
                    }}
                    value={this.state.currentMessage}
                    onContentSizeChange={event => {
                      this.setState({
                        height: event.nativeEvent.contentSize.height,
                      });
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      paddingRight: hp(2),
                    }}
                    onPress={() => {
                      if (this.state.currentMessage !== '') {
                        sendMessagetoCM(
                          this.props.homeApiData.common,
                          this.props.homeApiData.common.careManagerId,
                          null,
                          this.state.currentMessage,
                        );
                        this.setState({currentMessage: ''});
                        this.refs.current?.scrollToEnd();
                        Keyboard.dismiss();
                      }
                    }}>
                    <Image
                      source={require('../../../../../assets/images/icon_send_up.png')}
                      style={{width: 35, height: 35}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Header>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BgColor,
  },
});

const mapStateToProps = ({homeApiData, historyData, cmStatusData}) => ({
  homeApiData,
  historyData,
  cmStatusData,
});

//make this component available to the app
export default connect(mapStateToProps)(ChatScreen);
