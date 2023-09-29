import {NativeEventEmitter, NativeModules} from 'react-native';
import BleManager from 'react-native-ble-manager';
import ConnectivityManager from 'react-native-connectivity-status';

export default function BleConnector() {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  // Permission Check
  isBTConnected().then(status => {
    console.log('BT Status:', status);
    if (status) {
      if (Platform.OS === 'ios') {
        // BLuetooth ON, iOS
        console.log('====================================');
        console.log('here in Ble start status');
        console.log('====================================');
        startBle();
      } else {
        // Bluetooth ON, Android
        checkBTPermissionsOnAndroid();
      }
    } else if (Platform.OS === 'ios') {
      // Bluetooth OFF, iOS
      st();
    } else {
      // Bluetooth OFF, Android
      this.enableBluetoothOnAndroid();
      this.startBTStatusListener();
    }
  });

  function checkBTPermissionsOnAndroid() {
    requestBluetoothPermission().then(statuses => {
      console.log('Bluetooth Permission:', statuses);
      if (statuses.bluetoothPermission === 'granted') {
        this._startManager();
      } else {
        console.log('Bluetooth Permission - NOT GRANTED');
        checkBluetoothPermission();
      }
    });
  }

  function startBle() {
    console.log('====================================');
    console.log('here in Ble start');
    console.log('====================================');
    BleManager.start({showAlert: false});
  }
  bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', peripheral => {
    console.log('Discovered', peripheral);
  });
  BleManager.scan([], 5, true)
    .then(() => {
      console.log('Scan started');
    })
    .catch(error => {
      console.error('Scan failed', error);
    });

  async function isBTConnected() {
    let isBluetoothEnabled = await ConnectivityManager.isBluetoothEnabled();
    return isBluetoothEnabled;
  }
}
