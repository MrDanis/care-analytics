/* istanbul ignore file */
import {Platform} from 'react-native';
export const PasscodeVerificationTimeOut = 1 * 60 * 1000; // Show Passcode after 3 minutes of inactivity
export const Fonts = {
  RobotoRegular: 'Roboto-Regular',
  RobotoLight: 'Roboto-Light',
  RobotoMedium: 'Roboto-Medium',
  RobotoBold: 'Roboto-Bold',

  SourceSansRegular: 'SourceSansPro-Regular',
  SourceSansLight: 'SourceSansPro-Light',
  // SourceSansMedium: 'SourceSansPro-Medium',
  SourceSansSemibold: 'SourceSansPro-Semibold',
  SourceSansBold: 'SourceSansPro-Bold',

  SFProRegular: 'SF-Pro-Text-Regular',
  SFProSemibold: 'SFProText-Semibold',
  SFProBold: 'SF-Pro-Text-Bold',
  SFProHeavy: 'SF-Pro-Text-Heavy',
  SFProMedium: 'SF-Pro-Text-Medium',
};
export const ApplicationSource = {
  CareManager: 1,
  PCPPortal: 6,
};

export const OSSource = Platform.OS === 'ios' ? 1 : 0;

export const GenderEnum = {
  Male: '1',
  Female: '2',
};
export const HospitalVisitsEnum = {
  Emergency: 0,
  InPatient: 1,
  OutPatient: 2,
};
export const QuestionType = {
  TEXT: 0,
  DATE: 1,
  YESNO: 2,
  NUMBER: 3,
  DROPDOWN: 4,
  CHECKBOX: 5,
  RADIO: 6,
  MULTILINE: 7,
  DATETIME: 12,
};
export const ApiKeyWeather = '9641c0edd2359a79f9b71dcd63a06087';
export const DEV = 'http://172.16.10.117:8085/';
export const QA = 'https://qa.wmi360.com/360PatientEngagement';
export const PRE_RELEASE = 'https://pre-release.wmi360.com';
export const DEMO = 'https://ddm.wmi360.com/360BigFootWebApi';
// '//'https://demo.wmi360.com/';
export const STAGING = 'https://staging.wmi360.com/';
export const LIVE = 'https://www.wmi360.com/360BigFootWebApi';

export const CURRENT_TARGET = PRE_RELEASE;
export const baseUrl = 'https://pre-release.wmi360.com/360PatientEngagement';

const CP_STAGING_KEY =
  Platform.OS === 'ios'
    ? 'K26HGrC9V6c67iKUWInUCLX4HIZlyyD6ml0oo'
    : 'R4Jxvp91GoLdA1h8G_aZFG9vyo7gg9ClkgYny';

const CP_PRODUCTION_KEY =
  Platform.OS === 'ios'
    ? '5W-3CqgJemlQ52KPa3-Z8cokTw8YenzkAeiqn'
    : 'e1Xxt7OVvaTHQngTNzI4v019oXtijcnJSpbhL';

export const CURRENT_CP_TARGET_KEY =
  CURRENT_TARGET === LIVE ? CP_PRODUCTION_KEY : CP_STAGING_KEY;

global.DEMO_PATIENT = false;
