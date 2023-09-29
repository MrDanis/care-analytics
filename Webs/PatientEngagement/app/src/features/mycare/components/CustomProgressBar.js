/* istanbul ignore file */
import React, {Fragment} from 'react';
import {View} from 'react-native';
import {LoadingView} from '../../../helpers/LoadingView';

export class CustomProgressBar extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.5)',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          <LoadingView style={{height: 100, width: 100}} />
        </View>
      </Fragment>
    );
  }
}
