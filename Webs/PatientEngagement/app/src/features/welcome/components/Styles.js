/* istanbul ignore file */
import {StyleSheet} from 'react-native';
import Colors from '../../../../config/Colors';
import {Fonts} from '../../../../config/AppConfig';
import {Platform} from 'react-native';

// eslint-disable-next-line no-undef
export default (styles = StyleSheet.create({
  defaultTextFieldStyle: {
    width: 45,
    height: 65,
    borderColor: 'rgba(226, 226, 226, 1)',
    borderWidth: 5,
    fontSize: Platform.OS === 'ios' ? 18 : 30,
    textAlign: 'center',
  },
  borderStyleBase: {
    width: 30,
    height: 65,
  },

  borderStyleHighLighted: {
    borderColor: Colors.colorPrimary,
  },

  underlineStyleBase: {
    width: 35,
    height: 65,
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? 18 : 30,
    fontFamily: Fonts.RobotoBold,
    borderWidth: 0,
    // color: Colors.colorPrimary,
    borderBottomWidth: 2,
    borderColor: Colors.lightGrey,
  },
}));
