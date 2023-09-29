
/* istanbul ignore file */
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  initData,
  drawYAxis,
  drawGuideLine,
  drawYAxisLabels,
  numberWithCommas,
  drawXAxis,
  drawXAxisLabels,
} from '../common';
import {Colors} from '../../../../../../config';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    let newState = initData(
      this.props.data,
      this.props.height,
      this.props.gap,
      this.props.numberOfYAxisGuideLine,
    );
    this.state = {
      loading: false,
      sortedData: newState.sortedData,
      selectedIndex: 1,
      nowHeight: 200,
      nowWidth: 200,
      scrollPosition: 0,
      nowX: 0,
      nowY: 0,
      max: newState.max,
      fadeAnim: new Animated.Value(0),
      guideArray: newState.guideArray,
      typeOneColor: Colors.green,
    };

    this.drawCoordinates = this.drawCoordinates.bind(this);
    this.drawCoordinate = this.drawCoordinate.bind(this);
    this.drawSelected = this.drawSelected.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.sortedData !== this.state.sortedData ||
      nextState.selectedIndex !== this.state.selectedIndex ||
      nextState.scrollPosition !== this.state.scrollPosition
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      easing: Easing.bounce,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  componentWillReceiveProps(nextProps) {
    console.log('dataaaaaa', nextProps.data);
    if (nextProps.data !== this.props.data) {
      this.setState(
        Object.assign(
          {
            fadeAnim: new Animated.Value(0),
          },
          initData(
            nextProps.data,
            this.props.height,
            this.props.gap,
            this.props.numberOfYAxisGuideLine,
          ),
        ),
        () => {
          Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            easing: Easing.bounce,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        },
      );
    }
  }

  getTransform(rad, width) {
    let x = (0 - width / 2) * Math.cos(rad) - (0 - width / 2) * Math.sin(rad);
    let y = (0 - width / 2) * Math.sin(rad) + (0 - width / 2) * Math.cos(rad);

    return [
      {translateX: -1 * x - width / 2},
      {translateY: -1 * y + width / 2},
      {rotate: rad + 'rad'},
    ];
  }

  drawCoordinate(
    index,
    start,
    end,
    backgroundColor,
    lineStyle,
    isBlank,
    lastCoordinate,
    seriesIndex,
  ) {
    let key = 'line' + index;
    let dx = end.gap - start.gap;
    let dy = end.ratioY - start.ratioY;
    let size = Math.sqrt(dx * dx + dy * dy);
    let angleRad = -1 * Math.atan2(dy, dx);
    let height;
    let top;
    let topMargin = 20;

    if (start.ratioY > end.ratioY) {
      height = start.ratioY;
      top = -1 * size;
    } else {
      height = end.ratioY;
      top = -1 * (size - Math.abs(dy));
    }

    return (
      <View
        key={key}
        style={{
          height: this.props.height + topMargin,
          justifyContent: 'flex-end',
        }}>
        <View
          style={StyleSheet.flatten([
            {
              width: dx,
              height: height,
              marginTop: topMargin,
            },
            styles.coordinateWrapper,
          ])}>
          {/*<View*/}
          {/*  style={StyleSheet.flatten([*/}
          {/*    {*/}
          {/*      top: top,*/}
          {/*      width: size,*/}
          {/*      height: size,*/}
          {/*      borderColor: isBlank*/}
          {/*        ? backgroundColor*/}
          {/*        : this.props.primaryColor,*/}
          {/*      borderTopWidth: 1,*/}
          {/*      transform: this.getTransform(angleRad, size),*/}
          {/*    },*/}
          {/*    styles.lineBox,*/}
          {/*    lineStyle,*/}
          {/*  ])}*/}
          {/*/>*/}
          <View
            style={StyleSheet.flatten([
              styles.absolute,
              {
                height: height - Math.abs(dy) - 2,
                backgroundColor: lastCoordinate ? '#FFFFFF00' : backgroundColor,
                marginTop: Math.abs(dy) + 2,
              },
            ])}
          />
        </View>
        {!lastCoordinate && seriesIndex === 0 ? (
          <View
            style={StyleSheet.flatten([
              styles.guideLine,
              {
                width: dx,
                borderRightColor: this.props.xAxisGridLineColor,
              },
            ])}
          />
        ) : null}
        {seriesIndex === this.state.sortedData.length - 1 && (
          <TouchableWithoutFeedback
            onPress={() => {
              let selectedIndex = lastCoordinate ? index - 1 : index;

              let emptyCount = 0;
              this.state.sortedData.map(series => {
                if (series.data[selectedIndex].isEmpty) {
                  emptyCount++;
                }
              });
              if (emptyCount === this.state.sortedData.length) {
                return null;
              }
              // console.log('point', selectedIndex, point)

              this.setState(
                {
                  selectedIndex: selectedIndex,
                },
                () => {
                  if (typeof this.props.onPress === 'function') {
                    this.props.onPress(selectedIndex);
                  }
                },
              );
            }}>
            <View
              style={{
                width: dx,
                height: '100%',
                position: 'absolute',
                marginLeft: (-1 * dx) / 2,
                backgroundColor: '#FFFFFF01',
              }}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }

  drawPoint(index, point, seriesColor, name) {
    console.log('point', point);
    if (index === 0) {
      return;
    }
    let key = 'point' + index;
    let size = 8;
    let color = !seriesColor ? this.props.primaryColor : seriesColor;

    if (this.state.selectedIndex === index) {
      color = this.props.selectedColor;
    }

    if (point.isEmpty || this.props.hidePoints) {
      return null;
    }
    if (this.props.item.id === 1) {
      if (name === 'Sys') {
        return (
          <TouchableWithoutFeedback
            key={key}
            onPress={() => {
              this.setState({selectedIndex: index});
            }}>
            {this.getCriticalColor(point.y, 'Sys') === Colors.red ? (
              <Text
                style={StyleSheet.flatten([
                  styles.pointWrapper,
                  {
                    fontFamily: 'WisemanPTSymbols',
                    left: point.gap - size / 2,
                    bottom: point.ratioY - size / 2,
                    marginLeft: -3,
                    fontSize: 18,
                    // borderColor: color,
                    // backgroundColor: color
                    color: this.getCriticalColor(point.y, 'Sys'),
                  },
                ])}>
                +
              </Text>
            ) : (
              <Text
                style={StyleSheet.flatten([
                  styles.pointWrapper,
                  {
                    fontFamily: 'WisemanPTSymbols',
                    left: point.gap - size / 2,
                    bottom: point.ratioY - size / 2,
                    marginLeft: -3,
                    fontSize: 18,
                    // borderColor: color,
                    // backgroundColor: color
                    color: this.getCriticalColor(point.y, 'Sys'),
                  },
                ])}>
                {/*Z*/}
                +
              </Text>
            )}
          </TouchableWithoutFeedback>
        );
      } else {
        return (
          <TouchableWithoutFeedback
            key={key}
            onPress={() => {
              this.setState({selectedIndex: index});
            }}>
            {this.getCriticalColor(point.y, 'Dia') === Colors.red ? (
              <Text
                style={StyleSheet.flatten([
                  styles.pointWrapper,
                  {
                    fontFamily: 'WisemanPTSymbols',
                    left: point.gap - size / 2,
                    bottom: point.ratioY - size / 2,
                    marginLeft: -3,
                    fontSize: 18,
                    // borderColor: color,
                    // backgroundColor: color
                    color: this.getCriticalColor(point.y, 'Dia'),
                  },
                ])}>
                +
              </Text>
            ) : (
              <Text
                style={StyleSheet.flatten([
                  styles.pointWrapper,
                  {
                    fontFamily: 'WisemanPTSymbols',
                    left: point.gap - size / 2,
                    bottom: point.ratioY - size / 2,
                    marginLeft: -3,
                    fontSize: 18,
                    // borderColor: color,
                    // backgroundColor: color
                    color: this.getCriticalColor(point.y, 'Dia'),
                  },
                ])}>
                {/*Y*/}
                +
              </Text>
            )}
          </TouchableWithoutFeedback>
        );
      }
    } else {
      return (
        <TouchableWithoutFeedback
          key={key}
          onPress={() => {
            this.setState({selectedIndex: index});
          }}>
          <Text
            style={StyleSheet.flatten([
              styles.pointWrapper,
              {
                fontFamily: 'WisemanPTSymbols',
                left: point.gap - size / 2,
                bottom: point.ratioY - size / 2,
                marginLeft: -3,
                fontSize: 18,
                // borderColor: color,
                // backgroundColor: color
                color: this.getCriticalColor(point.y),
              },
            ])}>
            +
          </Text>
        </TouchableWithoutFeedback>
      );
    }
  }
  drawValue(index, point) {
    let key = 'pointvalue' + index;
    let size = 200;
    return (
      <View
        key={key}
        style={{
          position: 'absolute',
          left: index === 0 ? point.gap : point.gap - size / 2,
          bottom: point.ratioY + 10,
          backgroundColor: 'transparent',
          width: index !== 0 ? 200 : undefined,
        }}>
        {this.drawCustomValue(index, point)}
      </View>
    );
  }

  drawCustomValue(index, point) {
    if (this.props.customValueRenderer) {
      return this.props.customValueRenderer(index, point);
    } else {
      return null;
    }
  }

  drawCoordinates(data, seriesColor, seriesIndex, sName) {
    let result = [];
    let lineStyle = {
      borderColor: !seriesColor ? this.props.primaryColor : seriesColor,
    };
    let dataLength = data.length;

    for (let i = 0; i < dataLength - 1; i++) {
      result.push(
        this.drawCoordinate(
          i,
          data[i],
          data[i + 1],
          '#FFFFFF00',
          lineStyle,
          false,
          false,
          seriesIndex,
        ),
      );
    }

    if (dataLength > 0) {
      result.push(this.drawPoint(0, data[0], seriesColor, sName));
      result.push(this.drawValue(0, data[0], seriesColor));
    }

    for (let i = 0; i < dataLength - 1; i++) {
      result.push(this.drawPoint(i + 1, data[i + 1], seriesColor, sName));
      result.push(this.drawValue(i + 1, data[i + 1], seriesColor));
    }

    let lastData = Object.assign({}, data[dataLength - 1]);
    let lastCoordinate = Object.assign({}, data[dataLength - 1]);
    lastCoordinate.gap = lastCoordinate.gap + this.props.gap;
    result.push(
      this.drawCoordinate(
        dataLength,
        lastData,
        lastCoordinate,
        '#FFFFFF',
        {},
        true,
        true,
        seriesIndex,
      ),
    );

    return result;
  }

  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
  }
  getLineColor(value) {
    console.log('this.props.data[0]', this.props.data);
    console.log('this.props.item', this.props.item);
    if (
        value < parseInt(this.props.item.criticalMinRange) ||
        value > parseInt(this.props.item.criticalMaxRange)
    ) {
      console.log('come here red');
      return Colors.red;
    } else {
      console.log('come here green');
      return Colors.fontGrey;
    }
  }
  getCriticalColor(value, type) {
    console.log('this.props.data[0]', this.props.data);
    console.log('this.props.item', this.props.item);
    console.log('type', type);

    if (this.props.item.id === 1) {
      var criticalMaxArray =this.props.item.criticalMaxRange.split('/');
      var criticalMinArray = this.props.item.criticalMinRange.split('/');
      if (type === 'Sys') {
        if (
          value > parseInt(criticalMaxArray[0]) ||
          value < parseInt(criticalMinArray[0])
        ) {
          return Colors.red;
        } else {
          return Colors.green;
        }
      } else {
        if (
          value > parseInt(criticalMaxArray[1]) ||
          value < parseInt(criticalMinArray[1])
        ) {
          return Colors.red;
        } else {
          return Colors.green;
        }
      }
    } else {
      if (
          value < parseInt(this.props.item.criticalMinRange) ||
          value > parseInt(this.props.item.criticalMaxRange)
      ) {
        return Colors.red;
      } else {
        return Colors.green;
      }
    }
  }

  getVitalName(vitalName) {
    var name = ''
    if(vitalName === 'Repiration Rate'){
      return name = 'RR'
    }else if(vitalName === 'Body Mass Index'){
      return name ='BMI'
    }
    else if(vitalName === '02 Saturation'){
      return name ='Saturation'
    }
  }
  drawSelected(index) {
    if (this.state.sortedData.length === 0) {
      return null;
    }

    let data = this.state.sortedData[0].data;
    let dataObject = data[index];
    if (
      typeof this.state.selectedIndex === 'number' &&
      this.state.selectedIndex >= 0
    ) {
      if (!dataObject) {
        return null;
      }
      let reverse = true;
      let bottom = dataObject.ratioY;

      let left = dataObject.gap;
      let gap = 0;
      if (index === data.length - 1 && index !== 0) {
        left = data[index - 1].gap;
        gap = dataObject.gap - left;
      }
      if (bottom > (this.props.height * 2) / 3) {
        reverse = false;
      }

      if (this.props.item.id === 1) {
        console.log('sdasdasdsads', this.props.data);
        if (this.props.data !== null && this.props.data.length) {
          var lineColor = '';
          var borderColor = '';
          var lineColor1 = this.getCriticalColor(
            this.props.data[0].data[index].y,
            'Sys',
          );
          var lineColor2 = this.getCriticalColor(
            this.props.data[1].data[index].y,
            'Dia',
          );
          if (lineColor1 === Colors.red || lineColor2 === Colors.red) {
            lineColor = Colors.red;
          } else {
            lineColor = Colors.fontGrey;
          }

          var borderColor1 = this.getCriticalColor(
            this.props.data[0].data[index].y,
            'Sys',
          );
          var borderColor2 = this.getCriticalColor(
            this.props.data[1].data[index].y,
            'Dia',
          );
          if (borderColor1 === Colors.red || borderColor2 === Colors.red) {
            borderColor = Colors.red;
          } else {
            borderColor = Colors.green;
          }
        }
        return (
          <View
            style={StyleSheet.flatten([
              styles.selectedWrapper,
              {
                left: left,
                justifyContent: 'center',
              },
            ])}>
            <View
              style={StyleSheet.flatten([
                styles.selectedLine,
                {
                  backgroundColor: lineColor,
                  marginLeft: gap,
                },
              ])}
            />

            <View
              style={{
                position: 'absolute',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: borderColor,
              }}>
              {this.state.sortedData.map(series => {
                let dataObject = series.data[this.state.selectedIndex];
                return (
                  <View
                    key={series.seriesName}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: this.getCriticalColor(
                        dataObject.y,
                        series.seriesName,
                      ),
                      padding: hp(1),
                      justifyContent: 'center',
                    }}>
                    {series.seriesName ? (
                      <Text style={styles.tooltipTitle}>
                        {series.seriesName}
                      </Text>
                    ) : null}
                    {dataObject.y ? (
                      <Text style={styles.tooltipValue}>{dataObject.y}</Text>
                    ) : null}
                    <Text style={styles.tooltipValue}>mmHg</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      } else {
        return (
          <View
            style={StyleSheet.flatten([
              styles.selectedWrapper,
              {
                left: left,
                justifyContent: 'center',
              },
            ])}>
            <View
              style={StyleSheet.flatten([
                styles.selectedLine,
                {
                  backgroundColor: this.getLineColor(dataObject.y),
                  marginLeft: gap,
                },
              ])}
            />

            <View
              style={{
                backgroundColor: this.getCriticalColor(dataObject.y),
                borderRadius: 5,
                borderColor: this.getCriticalColor(dataObject.y),
                borderWidth: 1,
                position: 'absolute',
                padding: hp(1),
                marginLeft:15,
                alignSelf:'center'
                // justifyContent: 'flex-end',
              }}>
              {this.state.sortedData.map(series => {
                let dataObject = series.data[this.state.selectedIndex];
                if (this.props.item.id === 1) {
                  return (
                    <View
                      key={series.seriesName}
                      style={{flexDirection: 'row'}}>
                      {series.seriesName ? (
                        <Text style={styles.tooltipTitle}>
                          {series.seriesName}
                        </Text>
                      ) : null}
                      {dataObject.y ? (
                        <Text style={styles.tooltipValue}>{dataObject.y}</Text>
                      ) : null}
                      <Text style={styles.tooltipValue}>mmHg</Text>
                    </View>
                  );
                } else {
                  return (
                      <View
                          key={series.seriesName}
                          style={{flexDirection: 'row'}}>
                        <Text style={styles.tooltipValue}>
                          {this.props.item.name === 'Body Mass Index'
                              ? 'BMI'
                              : this.props.item.name}
                        </Text>
                        {dataObject.y ? (
                            <Text style={styles.tooltipUnit}>{dataObject.y}</Text>
                        ) : null}
                        <Text style={styles.tooltipUnit}>
                          {this.props.item.unit}
                        </Text>
                      </View>
                  );
                }
              })}
            </View>
          </View>
        );
      }
    } else {
      return null;
    }
  }

  render() {
    let {fadeAnim} = this.state;
    return this.state.sortedData.length > 0 ? (
      <View
        style={StyleSheet.flatten([
          styles.wrapper,
          {
            backgroundColor: this.props.backgroundColor,
          },
        ])}>
        <View style={styles.yAxisLabelsWrapper}>
          {drawYAxisLabels(
            this.state.guideArray,
            this.props.height + 20,
            this.props.minValue,
            this.props.labelColor,
          )}
        </View>

        <View>
          <ScrollView horizontal>
            <View>
              <View ref="chartView" style={styles.chartViewWrapper}>
                {drawYAxis(this.props.yAxisColor)}
                {drawGuideLine(
                  this.state.guideArray,
                  this.props.yAxisGridLineColor,
                )}
                {this.state.sortedData.map((obj, index) => {
                  return (
                    <Animated.View
                      key={'animated_' + index}
                      style={{
                        transform: [{scaleY: fadeAnim}],
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        height: '100%',
                        position: index === 0 ? 'relative' : 'absolute',
                        minWidth: 200,
                        marginBottom:
                          this.props.minValue &&
                          this.state.guideArray &&
                          this.state.guideArray.length > 0
                            ? -1 *
                              this.state.guideArray[0][2] *
                              this.props.minValue
                            : null,
                      }}>
                      {this.drawCoordinates(
                        obj.data,
                        obj.seriesColor,
                        index,
                        obj.seriesName,
                      )}
                    </Animated.View>
                  );
                })}
                {this.drawSelected(this.state.selectedIndex)}
              </View>

              {drawXAxis(this.props.xAxisColor)}
              {drawXAxisLabels(
                this.state.sortedData[0].data,
                this.props.gap,
                this.props.labelColor,
                this.props.showEvenNumberXaxisLabel,
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    ) : null;
  }
}

LineChart.defaultProps = {
  data: [],
  primaryColor: '#297AB1',
  selectedColor: Colors.fontGrey,
  height: 300,
  gap: 70,
  showEvenNumberXaxisLabel: true,
  onPointClick: point => {},
  numberOfYAxisGuideLine: 5,
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  yAxisLabelsWrapper: {
    paddingRight: 5,
  },
  chartViewWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 0,
    paddingRight: 0,
    overflow: 'hidden',
  },
  coordinateWrapper: {
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  lineBox: {
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  guideLine: {
    position: 'absolute',
    height: '100%',
    borderRightColor: '#e0e0e050',
    borderRightWidth: 1,
  },
  absolute: {
    position: 'absolute',
    width: '100%',
  },
  pointWrapper: {
    position: 'absolute',
    // borderRadius: 10,
    // borderWidth: 1
  },
  selectedWrapper: {
    position: 'absolute',
    height: '100%',
    alignItems: 'flex-start',
  },
  selectedLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
  },
  selectedBox: {
    backgroundColor: Colors.homeGreen,
    borderRadius: 5,
    opacity: 0.8,
    borderColor: Colors.homeGreen,
    borderWidth: 1,
    position: 'absolute',
    padding: hp(1),
    marginLeft: 5,
    justifyContent: 'center',
  },
  tooltipTitle: {
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    color: Colors.white,
  },
  tooltipValue: {
    marginLeft: 2,
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  tooltipUnit: {
    marginLeft: 2,
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    color: Colors.white,
  },
});

export default LineChart;