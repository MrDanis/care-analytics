//import liraries
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {Component, useEffect, useMemo, useRef, useState} from 'react';
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
  Animated,
  Pressable,
  Alert,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import {Modalize} from 'react-native-modalize';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import ShareGreyIcon from '../../../../../assets/svg/shareGreyIcon.svg';
import DownloadGreyIcon from '../../../../../assets/svg/DownloadGreyIcon.svg';

import {Colors, Images} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import LabService from '../../../api/lab';
import MainHeader from '../../mycare/components/MainHeader';
import {labsData} from '../reducers';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import UploadResultModal from '../../imaging&Radiology/components/uploadResultModal';
import {modalHanlder} from '../../medication/actions';
import EmailPopover from '../../bluebutton/screens/component/EmailPopover';
import RNFetchBlob from 'rn-fetch-blob';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {showMessage} from 'react-native-flash-message';
import BlueButtonService from '../../../api/bluebutton';
import {getEmailSharingResource} from '../../bluebutton/action';
import {Camera} from 'react-native-vision-camera';
// import BottomSheet from '@gorhom/bottom-sheet';

const Labs = ({navigation, route}) => {
  const [lab, setLab] = useState(false);
  const [testName, setTestName] = useState('');
  const [labName, setLabName] = useState('');
  const [description, setDescription] = useState('');
  const [imageObject, setImageObject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [downloader, setDownloader] = useState(false);

  const dispatch = useDispatch();
  const swipeableRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const modalizeRef = useRef(null);
  const modalizeRefEmail = useRef(null);
  const modalizeShare = useRef(null);
  const cameraRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const [instance, setInstance] = useState();
  useFocusEffect(
    React.useCallback(() => {
      setLoader(true);
      labsGetData();
    }, []),
  );
  useEffect(() => {
    console.log('====================================');
    console.log('ok useeffect ran');
    console.log('====================================');
    getSourceData();
  }, []);
  const onRefresh = () => {
    console.log('====================================');
    console.log('here in refresh');
    console.log('====================================');
    setRefreshing(true);
    labsGetData();
  };
  const getSourceData = () => {
    BlueButtonService.getShareSource()
      .then(response => {
        setLoader(false);
        if (response) {
          if (response.statusCode === 200) {
            const dummyArray = [];
            console.log('api recieved resources', response.data);

            response.data?.map((itemAtIndex, index) => {
              dummyArray.push({
                id: itemAtIndex.id,
                name: itemAtIndex.name,
                url: itemAtIndex.url,
              });
            });
            console.log('DropDown Valuessss', dummyArray);

            dispatch(getEmailSharingResource(dummyArray));
          }
        }
      })
      .catch(error => {
        this.setState({showLoader: false});
        console.log('getSharingResourceDropDown Error', error);
        console.log(error);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  };
  const labsGetData = () => {
    LabService.getLabsData().then(response => {
      console.log('====================================');
      console.log('res', response);
      console.log('====================================');
      if (response && response.statusCode === 200) {
        setLoader(false);
        setRefreshing(false);
        setLab(response.data);
        dispatch(labsData(response.data));
      } else {
        setRefreshing(false);
        setLoader(false);
      }
    });
  };
  const renderRightAction = (x, progress, item) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 1],
    });
    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{translateX: 0}],
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <RectButton
          onPress={() => {
            downloadImage(item);
            console.log('====================================');
            console.log('item in labs', item);
            console.log('====================================');
          }}
          style={[
            styles.rightAction,
            {
              backgroundColor: Colors.bleLayer4,
            },
          ]}>
          {/* <Image
            source={Images.downloadGreyIcon}
            style={{width: hp(3), height: hp(3)}}
          /> */}
          <DownloadGreyIcon />
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.noRecordFound,
              fontSize: hp(1.3),
            }}>
            Download
          </Text>
        </RectButton>
        <RectButton
          onPress={() => {
            // downloadImage(item);
            setInstance(item);
            onOpenShare(item);
            console.log('====================================');
            console.log('item in labs', item);
            console.log('====================================');
          }}
          style={[
            styles.rightAction,
            {
              backgroundColor: Colors.bleLayer4,
            },
          ]}>
          {/* <Image
            source={Images.shareGreyIcon}
            style={{width: hp(3), height: hp(3)}}
          /> */}
          <ShareGreyIcon />
          <Text
            style={{
              fontFamily: Fonts.SourceSansRegular,
              color: Colors.noRecordFound,
              fontSize: hp(1.3),
            }}>
            Share
          </Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress, item) => {
    return (
      <View
        style={{
          width: hp(20),
          marginRight: hp(1),
          height: hp(10),

          // flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}>
        {renderRightAction(150, progress, item)}
        {/* {this.renderRightAction('Flag', '#ffab00', 128, progress)}
       {this.renderRightAction('More', '#dd2c00', 64, progress)} */}
      </View>
    );
  };

  const dateFormat = item => {
    if (item.isCompleted) {
      return (
        <Text
          style={{
            color: Colors.noRecordFound,
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.5),
          }}>
          {moment(item.testDate).format('ddd, MMM DD, YYYY')}
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            color: Colors.noRecordFound,
            fontFamily: Fonts.SourceSansRegular,
            fontSize: hp(1.5),
          }}>
          Pending
        </Text>
      );
    }
  };

  function onOpen() {
    dispatch(modalHanlder(false));
    modalizeRef.current?.open();
  }

  function onClose() {
    labsGetData();
    dispatch(modalHanlder(true));
    modalizeRef.current?.close();
    setTestName('');
    setLabName('');
    setDescription('');
    setImageObject(null);
  }

  function onOpenEmail() {
    dispatch(modalHanlder(false));
    modalizeRefEmail.current?.open();
  }

  function onCloseEmail() {
    dispatch(modalHanlder(true));
    modalizeRefEmail.current?.close();
    // this.setState({autoHeight: true});
  }

  const downloadImage = item => {
    setDownloader(true);
    const replacedString = item.filePath.replace(/\\/g, '/');
    console.log('====================================');
    console.log('replacedString', replacedString);
    console.log('====================================');
    const {fs} = RNFetchBlob;
    const fileUrl = replacedString;
    const fileExt = '.jpg';
    const fileName = item.testName;

    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'Downloading image...',
        mime: `image/${fileExt}`,
        path: `${fs.dirs.DownloadDir}/${fileName}${fileExt}`,
      },
      IOSBackgroundTask: true,
      path: fs.dirs.CacheDir + '/myimage.jpg',
    })
      .fetch('GET', fileUrl)
      .then(res => {
        setDownloader(false);
        console.log('Image downloaded!', res);
        handleSaveToPhotos(fs.dirs.CacheDir + '/myimage.jpg');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const downloadPdf = () => {
    const {dirs} = RNFetchBlob.fs;
    const fileUrl = item.filePath;
    const fileExt = '.pdf';
    const fileName = item.testName;

    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'Downloading document...',
        mime: `application/${fileExt}`,
        path: `${dirs.DownloadDir}/${fileName}${fileExt}`,
      },
    })
      .fetch('GET', fileUrl)
      .then(res => {
        console.log('PDF downloaded!');
      })
      .catch(error => {
        console.log(error);
      });
  };

  function onOpenShare(item) {
    modalizeShare.current?.open();
    dispatch(modalHanlder(false));
  }

  function onCloseShare() {
    modalizeShare.current?.close();
    dispatch(modalHanlder(true));
  }
  const handleSaveToPhotos = imagePath => {
    if (Platform.OS === 'ios') {
      CameraRoll.save(`file://${imagePath}`)
        .then(() => {
          console.log('Image saved to Photos app');
          // Alert.alert('Image Saved Successfully');
          showMessage({
            message: 'File Downloaded',
            description: 'Your file has been downloaded successfully',
            type: 'success',
          });
        })
        .catch(error => {
          console.log('Error saving image to Photos app:', error);
        });
    } else {
      console.log('Now it is comming for the android', imagePath);
      handleSavePictureInAndroid(imagePath);
    }
  };
  const handleSavePictureInAndroid = imgUrl => {
    showMessage({
      message: 'File Downloaded',
      description: 'Your file has been downloaded successfully',
      type: 'success',
    });
  };
  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: Colors.BgColor,
          flex: 1,
          borderColor: 'blue',
          borderWidth: 0,
        }}>
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <Spinner
          visible={downloader}
          textContent={'Downloading...'}
          textStyle={{color: '#FFF'}}
        />
        <Modalize
          ref={modalizeShare}
          backgroundColor={Colors.black2}
          adjustToContentHeight={true}
          // modalHeight={this.state.autoHeight === true ? hp(45) : hp(80)}
          withHandle={false}
          onClosed={() => {
            dispatch(modalHanlder(true));
          }}
          modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
          <View
            style={{
              backgroundColor: Colors.transparent,
              flex: 1,
              width: '100%',
              alignSelf: 'center',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: hp(4),
            }}>
            {/* <KeyboardAwareScrollView
                contentInsetAdjustmentBehavior="always"
                contentContainerStyle={{flex: 1}}
                innerRef={ref => {
                  this.scroll = ref;
                }}> */}

            <EmailPopover
              moduleID={9}
              dismissModal={() => onCloseShare()}
              labItem={instance}
              name={'Lab'}
              // onOpen={() => this.onOpen()}
            />
            {/* </KeyboardAwareScrollView> */}
          </View>
        </Modalize>
        <Modalize
          ref={modalizeRefEmail}
          backgroundColor={Colors.black2}
          onClosed={() => {
            console.log('====================================');
            console.log('onClosed modal');
            console.log('====================================');
            dispatch(modalHanlder(true));
          }}
          adjustToContentHeight={true}
          withHandle={false}
          modalStyle={{borderTopRightRadius: 25, borderTopLeftRadius: 25}}>
          <View
            style={{
              backgroundColor: Colors.transparent,
              flex: 1,
              width: '100%',
              alignSelf: 'center',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: hp(4),
            }}>
            <EmailPopover
              moduleID={9}
              // keyboardFocus={() => heightToggle()}
              dismissModal={() => onCloseEmail()}
              onOpen={() => onOpenEmail('')}
            />
          </View>
        </Modalize>
        <Modalize
          ref={modalizeRef}
          withHandle={false}
          adjustToContentHeight
          onClosed={() => {
            console.log('====================================');
            console.log('onClosed modal');
            console.log('====================================');
            dispatch(modalHanlder(true));
            // imagingGetData();
            setTestName('');
            setDescription('');
            setImageObject(null);
          }}
          modalStyle={{
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            minHeight: '90%',
            backgroundColor: Colors.white,
          }}>
          <UploadResultModal
            onClose={onClose}
            onOpen={onOpen}
            testName={testName}
            labName={labName}
            setLabName={setLabName}
            description={description}
            setTestName={setTestName}
            setDescription={setDescription}
            imageObject={imageObject}
            setImageObject={setImageObject}
            isLab={true}
            setLoader={setLoader}
            labsGetData={labsGetData}
          />
        </Modalize>
        <View style={{flex: 1, borderColor: 'red', borderWidth: 0}}>
          <MainHeader name={'Labs'} navigation={navigation}>
            {lab?.length <= 0 ? (
              <View
                style={{
                  borderColor: 'red',
                  borderWidth: 0,
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
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
                    fontSize: hp(2),
                    fontFamily: Fonts.SourceSansBold,
                    color: Colors.noRecordFound,
                    marginTop: hp(4),
                    marginRight: hp(10),
                    marginLeft: hp(10),
                    textAlign: 'center',
                  }}>
                  No records found
                </Text>
              </View>
            ) : (
              <View style={{flex: 1, alignItems: 'center', paddingTop: hp(3)}}>
                {/* <BottomSheet
                   ref={bottomSheetRef}
                   index={1}
                   snapPoints={snapPoints}
                   // onChange={handleSheetChanges}
                 >
                   <View style={styles.contentContainer}>
                     <Text>Awesome 🎉</Text>
                   </View>
                 </BottomSheet> */}
                {console.log('Lab data is : ', lab)}

                <FlatList
                  data={lab}
                  style={{flex: 1, width: '100%'}}
                  contentContainerStyle={{
                    width: '100%',
                    alignItems: 'center',
                  }}
                  renderItem={({item, index}) => (
                    <>
                      <Swipeable
                        ref={swipeableRef}
                        renderRightActions={progress =>
                          renderRightActions(progress, item)
                        }

                        // friction={2}
                        // leftThreshold={0}
                        // rightThreshold={0}
                      >
                        <View
                          style={{
                            borderRadius: 10,
                            height: hp(10),
                            minWidth: '94%',
                            marginLeft: hp(1),
                            marginRight: hp(1),
                            marginBottom: hp(2),
                            shadowOffset: {width: 0.5, height: 0.5},
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3,
                            backgroundColor: Colors.white,
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: hp(2),
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1,
                            }}>
                            <View
                              style={{
                                width: hp(5.5),
                                height: hp(5.5),
                                backgroundColor: Colors.green_lab,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <FastImage
                                resizeMode="contain"
                                style={{width: hp(3.5), height: hp(3.5)}}
                                source={Images.lab_icon_dashboard}
                              />
                            </View>
                            <View
                              style={{
                                justifyContent: 'center',
                                width: '45%',
                              }}>
                              <View
                                style={{
                                  marginLeft: hp(2),
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    color: Colors.black4,
                                    fontFamily: Fonts.SourceSansRegular,
                                    fontSize: hp(1.8),
                                  }}>
                                  {item.testName}{' '}
                                </Text>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    color: Colors.noRecordFound,
                                    fontFamily: Fonts.SourceSansRegular,
                                    fontSize: hp(1.5),
                                    marginLeft: hp(0.5),
                                  }}>
                                  ({item.labName})
                                </Text>
                              </View>
                              <View
                                style={{
                                  marginLeft: hp(2),
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: Colors.noRecordFound,
                                    fontFamily: Fonts.SourceSansRegular,
                                    fontSize: hp(1.5),
                                  }}>
                                  {moment(item.testDate).format('hh:mm A')}
                                </Text>
                                <View
                                  style={{
                                    width: hp(0.5),
                                    height: hp(0.5),
                                    borderRadius: hp(0.5),
                                    backgroundColor: Colors.textFieldGrey,
                                    marginHorizontal: hp(1),
                                  }}
                                />

                                {dateFormat(item)}
                              </View>
                            </View>
                          </View>
                          {item.isSelf && (
                            <View>
                              <Text
                                style={{
                                  color: Colors.labRed,
                                  fontFamily: Fonts.SourceSansRegular,
                                  fontSize: hp(1.7),
                                  marginTop: hp(-3),
                                }}>
                                Self Upload
                              </Text>
                            </View>
                          )}
                        </View>
                      </Swipeable>
                    </>
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  keyExtractor={item => Math.random().toString(36).substr(2, 9)}
                />
              </View>
            )}

            <View style={{zIndex: 80, display: 'none'}}>
              <TouchableOpacity
                onPress={() => onOpenEmail()}
                style={{
                  position: 'absolute',
                  bottom: Platform.OS === 'ios' ? hp(13) : hp(17),
                  left: hp(37),
                  elevation: 80,
                }}>
                <View
                  style={{
                    backgroundColor: Colors.blueTextColor,
                    width: 55,
                    height: 55,
                    borderRadius: 45,
                    borderColor: 'green',
                    borderWidth: 2,
                    // paddingTop: hp(2),
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={Images.shareIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </MainHeader>
        </View>
        <TouchableOpacity
          onPress={() => onOpen()}
          style={{
            position: 'absolute',
            bottom: route?.params?.previousScreen ? '18%' : '13%', //Platform.OS === 'ios' ? hp(10) : hp(2.5),
            right: 10, //Platform.OS === 'ios' ? hp(37) : hp(40),
            elevation: 80,
            borderWidth: 0,
            borderColor: 'green',
          }}>
          <View
            style={{
              backgroundColor: Colors.green_lab,
              width: 55,
              height: 55,
              borderRadius: 45,
              // paddingTop: hp(2),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.lab_floating_icon}
              style={{width: hp(3), height: hp(4)}}
            />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default Labs;

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: Colors.black,
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
