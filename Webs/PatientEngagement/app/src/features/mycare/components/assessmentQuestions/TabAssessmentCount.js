/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../../config/Colors';
import {Fonts} from "../../../../../config/AppConfig";

class TabAssessmentCount extends React.PureComponent {
  /* istanbul ignore next */
  constructor(props) {
    super(props);
  }
  /* istanbul ignore next */
  componentDidMount(): void {
    console.log('TabAssessmentCount');
  }
  /* istanbul ignore next */
  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    console.log('TabAssessmentCount componentWillReceiveProps');
  }
  /* istanbul ignore next */
  render() {
    return (
      <Fragment>
        <Text
          style={{
            fontSize: hp(1.8),
            fontFamily: Fonts.SourceSansRegular,
            color: Colors.white,
          }}>
          {global.newAssessmentCount}
        </Text>
      </Fragment>
    );
  }
}
/* istanbul ignore next */
const mapStateToProps = ({assessmentsList}) => ({
  assessmentsList,
});
/* istanbul ignore next */
export default connect(mapStateToProps)(TabAssessmentCount);
