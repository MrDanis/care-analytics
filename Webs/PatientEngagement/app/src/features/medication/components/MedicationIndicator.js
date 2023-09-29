/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, View} from 'react-native';
import {Colors} from '../../../../config';
import {heightPercentageToDP} from 'react-native-responsive-screen';

export class MedicationIndicator extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: heightPercentageToDP(7),
              height: 5,
              marginRight: heightPercentageToDP(5),
              borderRadius: 5,
              backgroundColor:
                this.props.index >= 1
                  ? Colors.blueTextColor
                  : Colors.lightGrey1,
            }}
          />
          <View
            style={{
              width: heightPercentageToDP(7),
              height: 5,
              marginRight: heightPercentageToDP(5),
              borderRadius: 5,
              backgroundColor:
                this.props.index >= 2
                    ? Colors.blueTextColor
                    : Colors.lightGrey1,
            }}
          />
          <View
            style={{
              width: heightPercentageToDP(7),
              height: 5,
              borderRadius: 5,
              backgroundColor:
                this.props.index >= 3
                    ? Colors.blueTextColor
                    : Colors.lightGrey1,
            }}
          />
          {/*<View*/}
          {/*  style={{*/}
          {/*    width: heightPercentageToDP(7),*/}
          {/*    height: 5,*/}
          {/*    marginLeft: heightPercentageToDP(1),*/}
          {/*    borderRadius: 5,*/}
          {/*    backgroundColor:*/}
          {/*      this.props.index >= 4*/}
          {/*        ? Colors.green*/}
          {/*        : Colors.lightGreenIndicator,*/}
          {/*  }}*/}
          {/*/>*/}
          {/*<View*/}
          {/*  style={{*/}
          {/*    width: heightPercentageToDP(7),*/}
          {/*    height: 5,*/}
          {/*    marginLeft: heightPercentageToDP(1),*/}
          {/*    borderRadius: 5,*/}
          {/*    backgroundColor:*/}
          {/*      this.props.index >= 5*/}
          {/*        ? Colors.green*/}
          {/*        : Colors.lightGreenIndicator,*/}
          {/*  }}*/}
          {/*/>*/}
        </View>
      </Fragment>
    );
  }
}
