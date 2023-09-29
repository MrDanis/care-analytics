import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {Colors, Svgs} from '../../../../config';
import {Fonts} from '../../../../config/AppConfig';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import VitalsHeader from '../components/VitalsHeader';
import CalendarStrip from 'react-native-calendar-strip';
import Moment from 'moment';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import VitalsService from '../../../api/vitals';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import Images from '../../../../config/Images';
import {Rect, Text as TextSVG, Svg, Circle} from 'react-native-svg';
// import PureChart from '../components/pure-chart';
import LegendComponent from '../components/CustomComponents';
import CustomTestChart from '../../home/screens/custom_chart';
import MainHeader from '../components/MainHeader';
// const screenWidth = Dimensions.get('window').width;
// import {BarChart} from 'react-native-gifted-charts';

const VitalHistory = props => {
  const {vitalData} = props.route.params;
  const [vitalsData, setvitalData] = useState(
    vitalData,
    // '',
  );

  const [date, setDate] = useState(
    Moment(new Date()).format('yyyy-MM-DDThh:mm:ss'),
  );
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [loader, setLoader] = useState(false);
  const [isCritical, setCritical] = useState(false);
  const [systolicValues, setSystolicValues] = useState([]);
  const [diastolicValues, setDiastolicValues] = useState([]);
  const [vitalValues, setVitalValues] = useState([]);
  const [dateValues, setDateValues] = useState([]);
  const [vitalHistory, setVitalHistory] = useState([]);
  const [finalVitalHistory, setFinalVitalHistory] = useState([]);
  const [barData, setbarData] = useState([]);
  const renderTitle = () => {
    return (
      <View style={{marginVertical: 14}}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Weight
        </Text>
        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            // justifyContent: 'space-evenly',
            // marginTop: 10,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              paddingHorizontal: hp(1.3),
            }}
            onPress={() => {
              console.log('Pressed');
            }}
            // hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
          >
            <View
              style={{
                // flexDirection: 'column',
                // alignItems: 'center',
                // alignContent: 'center',

                alignSelf: 'center',
                // justifyContent: 'center',
              }}>
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'black',
                  marginBottom: 5,
                }}>
                Day
              </Text>
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: 'blue',
                  marginHorizontal: hp(0.8),
                  // alignContent: 'center',
                  // alignSelf: 'center',
                  // justifyContent: 'center',
                  // marginRight: 8,
                  // marginBottom:1,
                }}
              />
            </View>
          </TouchableOpacity>
          <View padding={10}></View>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              paddingHorizontal: hp(1.3),
            }}
            onPress={() => {
              console.log('Pressed Week');
            }}>
            <View style={{alignSelf: 'center'}}>
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'lightgray',
                  marginBottom: 5,
                }}>
                Week
              </Text>
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: 'blue',
                  marginHorizontal: hp(1.4),
                  // marginRight: 8,
                  // marginBottom:1,
                }}
              />
            </View>
          </TouchableOpacity>
          <View padding={20}></View>
          <TouchableOpacity
            style={{
              backgroundColor: 'purple',
              paddingHorizontal: hp(1.3),
            }}
            onPress={() => {
              console.log('Pressed');
            }}>
            <View
              style={{
                alignItems: 'center',
                // alignContent: 'center',
                // alignSelf: 'center',
              }}>
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'lightgray',
                  marginBottom: 5,
                }}>
                Month
              </Text>
              <View
                style={{
                  height: 12,
                  width: 12,
                  // alignContent: 'center',
                  borderRadius: 6,
                  backgroundColor: 'blue',
                  marginRight: hp(1.3),
                  // marginRight: 8,
                  // marginBottom:1,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // const opacity = 0.5;

  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  function getDataSetValues(data) {
    let systolicVal = [];
    let diastolicVal = [];
    let vitalVal = [];
    if (data.length > 0) {
      if (vitalsData.id === 1) {
        Object.keys(data).map(valAtIndex => {
          systolicVal.push(data[valAtIndex].vitalsData[0].value);
          diastolicVal.push(data[valAtIndex].vitalsData[1].value);
        });
      } else {
        Object.keys(data).map(valAtIndex => {
          vitalVal.push(data[valAtIndex].vitalsData[0].value);
        });
      }
    }
    setSystolicValues(systolicVal);
    setDiastolicValues(diastolicVal);
    setVitalValues(vitalVal);
  }

  // function getvitalDataForChart(listData) {
  //   let list = [];
  //   console.debug('Just Inside');
  //   if (data.length > 0) {
  //     Object.keys(listData).map(index => {
  //       console.debug('This is the upper list');
  //       console.debug(index);
  //       data[index].vitalData.map(actualData => {
  //         console.debug('This is the lower list');
  //         console.debug(actualData);
  //         list.push({
  //           value: actualData.value,
  //           label: actualData.name,
  //           spacing: 30,
  //         });
  //       });
  //     });
  //   }
  // }

  // const mappedData = vitalData.vitalData.map(bar => {
  //   console.log('This is the mapped Data before');
  //   console.log(mappedData);

  //   return {value: bar.value, label: bar.name, spacing: 30};
  // });

  function getDateValues(data) {
    let dateSet = [];
    if (data.length > 0) {
      Object.keys(data).map(valAtIndex => {
        dateSet.push(
          convertUTCDateToLocalDate(new Date(data[valAtIndex].createdDate)) +
            convertUTCDateToAMPM(new Date(data[valAtIndex].createdDate)),
        );
      });
    }
    setDateValues(dateSet);
  }

  useEffect(() => {
    // getDataSetValues(vitalHistory);
    // getDateValues(vitalHistory);
    getVitalHistory(date);
    // setCategoryDataForGraph(vitalHistory)
  }, []);

  function getVitalHistory(date) {
    setLoader(true);
    console.log(
      'Data',
      `/api/Vitals/VitalHistory?VitalTypeId=${vitalsData.id}&date=${Moment(
        new Date(date),
      ).format('YYYY-MM-DD')}`,
      date,
    );
    VitalsService.getVitalCategoryHistory(
      vitalsData.id,
      Moment(new Date(date)).format('YYYY-MM-DD'),
    )
      .then(response => {
        setLoader(false);
        console.log('getVitalCategoryHistory');
        console.log(JSON.stringify(response));
        if (response && response.statusCode === 200) {
          getDataSetValues(response.data);
          getDateValues(response.data);
          setVitalHistory(response.data);
          setCategoryDataForGraph(response.data);
          getvitalDataForChart(response.data);
        } else {
          showMessage({
            message: 'Information',
            description:
              'Authentication Failed. Provided information is not verified.',
            type: 'default',
            icon: {icon: 'info', position: 'left'},
            backgroundColor: Colors.red,
          });
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('error');
        console.log(err);
        showMessage({
          message: 'Info',
          description: 'Internal Server Error',
          type: 'default',
          icon: {icon: 'info', position: 'left'},
          backgroundColor: Colors.red,
        });
      });
  }
  function getvitalDataForChart(listData) {
    let newVitallist = [
      {
        value: 40,
        label: 'Jan',
        spacing: 30,
        // labelWidth: 300,
        labelTextStyle: {color: 'gray'},
        frontColor: '#177AD5',
        topLabelComponent: () => (
          <Text style={{color: 'black', fontSize: 10}}>50</Text>
        ),
      },
    ];
    console.debug('Just Inside');
    // console.debug(vitalValues);
    Object.keys(listData).map(valAtIndex => {
      newVitallist.push({
        value: listData[valAtIndex].vitalsData[0].value,
        label: listData[valAtIndex].vitalsData[0].name,
      });
    });
    console.log('The new newVitallist is');
    console.log(newVitallist);
    setbarData(newVitallist);
    console.log('The new barData');
    console.log(barData);
  }

  const convertUTCDateToAMPM = date => {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    );
    const dateTimeAndroid = moment(new Date(date)).format('A');

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);

    const dateTimeIos = moment(new Date(newDate)).format('A');

    return Platform.OS === 'ios' ? dateTimeIos : dateTimeAndroid;
  };
  const convertUTCDateToLocalDate = date => {
    var newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    );
    const dateTimeAndroid = moment(new Date(date)).format('h:mm');

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);

    const dateTimeIos = moment(new Date(newDate)).format('h:mm');

    return Platform.OS === 'ios' ? dateTimeIos : dateTimeAndroid;
  };

  /* istanbul ignore next */
  function setCategoryDataForGraph(historyData) {
    console.log();
    if (vitalsData.id === 1) {
      var xyDataSystolic = [];
      var row = {};
      row.x = ' ';
      row.y = 0;
      xyDataSystolic.push(row);
      historyData.map(item => {
        var row = {};
        var time = convertUTCDateToLocalDate(new Date(item.createdDate));
        var timeInAMPM = convertUTCDateToAMPM(new Date(item.createdDate));
        row.x = time + ' ' + timeInAMPM;
        row.y = parseInt(item.vitalsData[0].value);
        xyDataSystolic.push(row);
      });
      console.log('xyDataSystolic', xyDataSystolic);
      var xyDataDiastolic = [];
      var row = {};
      row.x = ' ';
      row.y = 0;
      xyDataDiastolic.push(row);
      historyData.map(item => {
        var row = {};
        var time = convertUTCDateToLocalDate(new Date(item.createdDate));
        var timeInAMPM = convertUTCDateToAMPM(new Date(item.createdDate));
        row.x = time + ' ' + timeInAMPM;
        row.y = parseInt(item.vitalsData[1].value);
        xyDataDiastolic.push(row);
      });
      console.log('xyDataDiastolic', xyDataDiastolic);

      var finalData = [
        {
          seriesName: 'Sys',
          data: xyDataSystolic,
          color: '#297AB1',
        },
        {
          seriesName: 'Dia',
          data: xyDataDiastolic,
          color: 'green',
        },
      ];
      console.log('final data', finalData);
      setFinalVitalHistory(finalData);
    } else {
      var xyData = [];
      var row = {};
      row.x = ' ';
      row.y = 0;
      xyData.push(row);
      historyData.map(item => {
        var row = {};
        var time = convertUTCDateToLocalDate(new Date(item.createdDate));
        var timeInAMPM = convertUTCDateToAMPM(new Date(item.createdDate));
        row.x = time + ' ' + timeInAMPM;
        row.y = parseFloat(item.vitalsData[0].value);
        row.name = parseFloat(item.name);
        xyData.push(row);
      });
      console.log('xyData', xyData);
      setFinalVitalHistory(xyData);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <MainHeader navigation={props.navigation} name={vitalsData.name}>
        <Spinner
          visible={loader}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />

        {/* Measure & History Card */}
        <View style={{width: '100%', alignSelf: 'center', flex: 1}}>
          <View style={{backgroundColor: 'white', marginTop: hp(0.2)}}>
            <CalendarStrip
              scrollable
              calendarAnimation={{type: 'sequence', duration: 2}}
              daySelectionAnimation={{
                type: 'background',
                duration: 200,
                borderWidth: 1,
                highlightColor: Colors.bleLayer4,
                borderHighlightColor: Colors.bleLayer4,
              }}
              style={{
                height: 130,
                paddingTop: 20,
                backgroundColor: 'transparent',
              }}
              calendarHeaderStyle={{color: Colors.regularLabel}}
              calendarColor={Colors.white}
              dateNumberStyle={{color: Colors.regularLabel}}
              dateNameStyle={{color: Colors.regularLabel}}
              highlightDateNumberStyle={{color: Colors.blueRxColor}}
              highlightDateNameStyle={{color: Colors.blueRxColor}}
              iconContainer={{flex: 0.1}}
              selectedDate={date}
              onDateSelected={date => {
                setDate(date);
                getVitalHistory(date);
              }}
            />
          </View>

          {vitalHistory.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: 'column',
                  // flex: 1,
                  marginVertical: hp(2),
                  width: '92%',
                  alignSelf: 'center',
                  borderRadius: 10,
                  backgroundColor: 'white',
                }}>
                <LegendComponent id={vitalsData.id} />

                {barData.length > 0 ? (
                  <View>
                    {/* {renderTitle()} */}
                    <CustomTestChart barDataRetrived={barData} />
                  </View>
                ) : (
                  <View />
                )}

                {/* <BarChart data={JSON.stringify(barData)} />; */}
                {/* <PureChart
                  type={'bar'}
                  data={finalVitalHistory}
                  // item={Object.keys(vitalHistory).map(valueAtIndex =>{
                  //     return vitalHistory[valueAtIndex]
                  // })}
                  item={vitalData}
                  width={'10%'}
                  height={hp(28)}
                  onPress={a => {
                    setSelectedIndex(a);
                    console.log('onPress', a);
                  }}
                  // totalLength={this.state.data[0].data.length}

                  // style={graphStyle}
                  // data={data}
                  // width={screenWidth}
                  height={220}
                  yAxisLabel="$"
                  chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  verticalLabelRotation={30}

                  // xAxisColor={Colors.lightGrey1}
                  // yAxisColor={Colors.lightGrey1}
                  // xAxisGridLineColor={Colors.lightGrey1}
                  // yAxisGridLineColor={Colors.lightGrey1}
                  // labelColor={Colors.fontGrey}
                  // showEvenNumberXaxisLabel={false}

                  // customValueRenderer={(index, point) => {
                  //   if (index < 3) {
                  //     return null;
                  //   }
                  //   return <Text style={{textAlign: 'center'}}>{point.y}</Text>;
                  // }} */}
                {/* /> */}
              </View>

              {/*<View style={{*/}
              {/*    width: '90%',*/}
              {/*    marginTop: hp(2),*/}
              {/*    alignSelf: 'center',*/}
              {/*    alignItems: 'center',*/}
              {/*    justifyContent: 'center'*/}
              {/*}}>*/}

              {/*</View>*/}
            </>
          ) : (
            <View
              style={{
                width: '100%',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: hp(6),
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
          )}
        </View>
      </MainHeader>
    </SafeAreaView>
  );
};
VitalHistory.navigationOptions = {
  headerShown: false,
};

export default connect()(VitalHistory);
