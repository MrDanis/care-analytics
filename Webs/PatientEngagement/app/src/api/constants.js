/* istanbul ignore file */
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

export const source = Platform.OS === 'ios' ? 1 : 0;
export const HeaderInfo = {
  VersionNumber: DeviceInfo.getReadableVersion(),
  DeviceName: DeviceInfo.getManufacturer() + DeviceInfo.getDeviceId(),
  OSVersion: DeviceInfo.getApiLevel(),
  AppSource: source,
};
