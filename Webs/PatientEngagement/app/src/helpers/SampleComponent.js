/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text} from 'react-native';

export class SampleComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <Text>Sample</Text>
      </Fragment>
    );
  }
}
