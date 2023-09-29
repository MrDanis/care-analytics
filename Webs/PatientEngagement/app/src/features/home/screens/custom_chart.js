import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';

import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../../../../config/Colors';
import {color} from 'react-native-reanimated';
import {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {PanResponder} from 'react-native';
const renderTitle = (
  setDateType,
  getVitalHistory,
  date,
  setisSelectedDay,
  isSelectedDay,
  handleChartScroll,
) => {
  const [showBottomColor, setshowBottomColor] = useState(true);

  return (
    <View
      style={{
        marginHorizontal: hp(6.5),
        marginTop: hp(2),
        borderColor: 'blue',
        borderWidth: 0,
      }}>
      <View
        style={{
          flexDirection: 'row',
          borderColor: 'red',
          borderWidth: 0,
        }}>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            console.log('Pressed Day');
            setisSelectedDay('Day');
            setDateType(0);
            handleChartScroll(0);
            getVitalHistory(date);
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignSelf: 'center',
              paddingLeft: 0,
              paddingRight: 20,
              borderColor: 'red',
              borderWidth: 0,
            }}>
            {isSelectedDay === 'Day' ? (
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'black',
                  marginBottom: 5,
                  height: Platform.OS === 'ios' ? hp(2) : hp(2.95),
                }}>
                Day
              </Text>
            ) : (
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'black',
                  marginBottom: 5,
                  height: Platform.OS === 'ios' ? hp(2) : hp(2.95),
                }}>
                Day
              </Text>
            )}
            {showBottomColor === true && isSelectedDay === 'Day' ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: 'blue',
                  marginHorizontal: hp(0.8),
                }}
              />
            ) : (
              <View />
            )}
          </View>
        </TouchableOpacity>
        <View padding={10}></View>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            console.log('Pressed Week');
            setisSelectedDay('Week');
            setDateType(1);
            handleChartScroll(1);
            getVitalHistory(date);
          }}>
          <View style={{alignSelf: 'center'}}>
            {isSelectedDay === 'Week' ? (
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'black',
                  marginBottom: 5,
                  height: Platform.OS === 'ios' ? hp(2) : hp(2.95),
                }}>
                Week
              </Text>
            ) : (
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'black',
                  marginBottom: 5,
                  height: Platform.OS === 'ios' ? hp(2) : hp(2.95),
                }}>
                Week
              </Text>
            )}
            {showBottomColor === true && isSelectedDay === 'Week' ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: 'blue',
                  marginHorizontal: hp(1.6),
                }}
              />
            ) : (
              <View />
            )}
          </View>
        </TouchableOpacity>
        <View padding={20}></View>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            console.log('Pressed Month');
            setisSelectedDay('Month');
            setDateType(2);
            handleChartScroll(2);
            getVitalHistory(date);
          }}>
          <View style={{alignItems: 'center'}}>
            {isSelectedDay === 'Month' ? (
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'black',
                  marginBottom: 5,
                  height: Platform.OS === 'ios' ? hp(2) : hp(2.95),
                }}>
                Month
              </Text>
            ) : (
              <Text
                style={{
                  width: 60,
                  height: 16,
                  color: 'black',
                  marginBottom: 5,
                  height: Platform.OS === 'ios' ? hp(2) : hp(2.95),
                }}>
                Month
              </Text>
            )}
            {showBottomColor === true && isSelectedDay === 'Month' ? (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: 'blue',
                  marginRight: hp(1.2),
                }}
              />
            ) : (
              <View />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const CustomTestChart = ({
  barDataRetrived,
  setDateType,
  getVitalHistory,
  date,
  setisSelectedDay,
  isSelectedDay,
  maxValue,
  isstackData,
}) => {
  // const [selectedColor, setselectedColor] = useState(0);
  const [chartScrollType, setchartScrollType] = useState(0);
  // const [panResponder, setPanResponder] = useState(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: (event, gestureState) => {
  //       console.log('====================================');
  //       console.log('here in move responder', gestureState);
  //       console.log('====================================');
  //       // Handle the dragging/panning here
  //       setIsScrollable(true);
  //     },
  //     // onPanResponderGrant: (evt, gestureState) => {
  //     //   // The gesture has started. Show visual feedback so the user knows
  //     //   // what is happening!
  //     //   // gestureState.d{x,y} will be set to zero now
  //     //   console.log('====================================');
  //     //   console.log('here in grant');
  //     //   console.log('====================================');
  //     // },
  //     onPanResponderRelease: () => {
  //       console.log('====================================');
  //       console.log('in release');
  //       console.log('====================================');
  //       // Handle the gesture release
  //       setIsScrollable(true);
  //     },
  //   }),
  // );
  const handleChartScroll = num => {
    console.log('Number to reset the scroll is : ', num);
    setchartScrollType(num);
  };
  console.log(
    'Retrived bar chart data is : ',
    barDataRetrived,
    'and Stack check is : ',
    isstackData,
  );
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        margin: hp(2),
        borderRadius: hp(1),
        elevation: hp(5),
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 0,
        borderColor: 'red',
      }}>
      {renderTitle(
        setDateType,
        getVitalHistory,
        date,
        setisSelectedDay,
        isSelectedDay,
        handleChartScroll,
      )}
      <View
        style={{
          // backgroundColor: '#333340',
          backgroundColor: 'white',
          paddingBottom: hp(6),
          borderRadius: 10,
          padding: 10,
          // transform: [{rotate: '180deg'}],
          // marginLeft: hp(1.5),
          // marginRight: hp(1.5),
          // marginBottom: hp(1.5),
          marginTop: hp(3),
          // margin: hp(51),
          // alignItems: 'center',
          borderColor: 'green',
          borderWidth: 0,
        }}>
        {/* ///I MADE IT LESS TO TEST */}
        {/* {barDataRetrived.length > 0 ? ( */}
        {isstackData ? (
          <View>
            <BarChart
              width={285}
              renderTooltip={(data, index) => (
                <View
                  style={{
                    marginLeft: index === barDataRetrived?.length - 1 ? -15 : 0,
                    marginRight: index === 0 ? -15 : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: hp(1),
                    borderWidth: 0,
                    shadowOffset: {width: 0.5, height: 0.5},
                    shadowOpacity: 0.1,
                    borderWidth: 1,
                    borderRadius: hp(1),
                    borderColor: 'silver',
                    alignItems: 'flex-start',
                    shadowRadius: 8,
                    shadowOffset: {width: 0.5, height: 0.5},
                    backgroundColor: 'white',
                    paddingVertical: hp(1),
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: 'blue',
                      borderWidth: 0,
                    }}>
                    <View
                      style={{
                        marginHorizontal: hp(1),
                        borderColor: 'orange',
                        borderWidth: 0,
                        height: hp(1),
                        width: hp(1),
                        backgroundColor: '#2962FF',
                        borderRadius: 50,
                      }}></View>
                    <Text style={{marginRight: hp(0.6)}}>
                      {data?.stacks[0]?.value}
                    </Text>
                    {console.log(
                      'data of the stack is : ',
                      data,
                      'and index is : ',
                      index,
                    )}
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: 'blue',
                      borderWidth: 0,
                    }}>
                    <View
                      style={{
                        marginHorizontal: hp(1),
                        borderColor: 'orange',
                        borderWidth: 0,
                        height: hp(1),
                        width: hp(1),
                        backgroundColor: '#F44336',
                        borderRadius: 50,
                      }}></View>
                    <Text>{data?.stacks[1]?.value}</Text>
                  </View>
                </View>
              )}
              // Check this unCheck it!!1
              // height={hp * 0.5}
              // xAxisLabelTexts={['12:00 am','06:00 am','12:00pm','06:00pm']}

              stackData={barDataRetrived}
              barWidth={17}
              spacing={20}
              initialSpacing={hp(3)}
              height={hp * 0.3}
              roundedTop
              // stepHeight={hp(4.5)}
              // roundedBottom
              hideRules
              // yAxisLabelTexts={['30', '40', '50', '6k', '4k', '5k', '6k']}
              stepValue={0}
              xAxisColor={colors.line}
              yAxisThickness={0}
              yAxisTextStyle={{color: 'gray'}}
              xAxisLabelTextStyle={{color: 'gray'}}
              noOfSections={7}
              yAxisSide="right"
              scrollToEnd={
                chartScrollType && chartScrollType === 0 ? false : true
              }
              // showGradient
              isAnimated
              rulesLength={hp(35)}
              // hideRules={true}
              maxValue={maxValue}
              xAxisLength={hp(35)}
              referenceLine1Position={260}
              referenceLine1Config={{
                color: 'blue',
                // dashWidth: 2,
                dashGap: 2,
              }}
              referenceLine2Config={{
                color: 'red',
                dashWidth: 2,
                dashGap: 2,
              }}
              referenceLine2Position={260}
              // barBorderRadius={6}
              // maxValue={barDataRetrived.length}
              // minValue={20}
              // dashes={10}
              // showLine
              // lineConfig={{
              //   color: colors.blueRxColor,
              //   thickness: 2,
              //   curved: false,
              //   hideDataPoints: true,
              //   shiftY: 10,
              //   initialSpacing: 2,
              // }}
              // rulesType={dashed}
            />
          </View>
        ) : (
          <BarChart
            width={285}
            // Check this unCheck it!!1
            // height={hp * 0.5}
            // xAxisLabelTexts={['12:00 am','06:00 am','12:00pm','06:00pm']}

            data={barDataRetrived}
            barWidth={17}
            spacing={hp(5)}
            initialSpacing={hp(3)}
            height={hp * 0.3}
            roundedTop
            // stepHeight={hp(4.5)}
            // roundedBottom
            hideRules
            // yAxisLabelTexts={['30', '40', '50', '6k', '4k', '5k', '6k']}
            stepValue={0}
            xAxisColor={colors.line}
            yAxisThickness={0}
            yAxisTextStyle={{color: 'gray'}}
            xAxisLabelTextStyle={{color: 'gray'}}
            noOfSections={7}
            yAxisSide="right"
            scrollToEnd={
              chartScrollType && chartScrollType === 0 ? false : true
            }
            // showGradient
            isAnimated
            rulesLength={hp(35)}
            // hideRules={true}
            maxValue={maxValue}
            xAxisLength={hp(35)}
            referenceLine1Position={260}
            referenceLine1Config={{
              color: 'blue',
              // dashWidth: 2,
              dashGap: 2,
            }}
            referenceLine2Config={{
              color: 'red',
              dashWidth: 2,
              dashGap: 2,
            }}
            referenceLine2Position={260}
            // maxValue={barDataRetrived.length}
            // minValue={20}
            // dashes={10}
            // showLine
            // lineConfig={{
            //   color: colors.blueRxColor,
            //   thickness: 2,
            //   curved: false,
            //   hideDataPoints: true,
            //   shiftY: 10,
            //   initialSpacing: 2,
            // }}
            // rulesType={dashed}
          />
        )}

        {/* // ) : (
        //   <BarChart data={barDataRetrived} />
        // )} */}
      </View>
    </View>
  );
};

export default CustomTestChart;

const styles = StyleSheet.create({});
