import {useState} from 'react';
import {BleManager} from 'react-native-ble-plx';
// import {atob} from 'react-native-quick-base64';

export default function useBle() {
  const [characteristic, setCharacteristic] = useState([]);
  //   const manager = new BleManager();
  const BloodPressureMeasurementCharacteristicUUID =
    '00002a23-0000-1000-8000-00805f9b34fb';
  const BloodPressureServiceUUID = '0000180a-0000-1000-8000-00805f9b34fb';
  const QnScaleServiceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
  const BpDeviceId = '1208F9D3-530B-2783-9C9B-ABE39434B9C9';
  const scanAndConnect = async (manager,setDeviceName) => {
    console.log('====================================');
    console.log('in scan component');
    console.log('====================================');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning:', error);
        return;
      }
      console.log('====================================');
      console.log('devices', device.name, device);
      console.log('====================================');
      if (device.name === 'BP4350' 
        
      ) {
        
        manager.stopDeviceScan();
        console.log('===================logger=================');
        console.log(device);
        setDeviceName(device.name)
        console.log('====================================');
        device
          .connect()
          .then(device => {
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(device => {
            console.log('====================================');
            console.log('discoverAllServicesAndCharacteristics', device);
            console.log('====================================');
            device.isConnected().then(data => {
              console.log('====================================');
              console.log('isConnected', data);
              console.log('====================================');
            });

            // Enable notifications or indications

            device.services().then(services => {
              console.log('Service UUID:', services[0].uuid);
              services[0]
                .readCharacteristic(BloodPressureMeasurementCharacteristicUUID)
                .then(data => {
                  console.log('====================================');
                  console.log('readCharacteristic', data);
                  console.log('====================================');
                });
              services[0].characteristics().then(characteristics => {
                console.log('====================================');
                console.log('chara', characteristics[0]);
                console.log('====================================');
             
              }); // Array of Characteristic objects
            });
            setInterval(() => {
              device
                .readCharacteristicForService(
                  BloodPressureServiceUUID,
                  BloodPressureMeasurementCharacteristicUUID,
                )
                .then(readData => {
                  console.log('====================================');
                  // console.log('read Data', atob(readData.value));
                  console.log('read Data', readData);

                  const decoder = new TextDecoder('utf-8');
                  // const decodedString = decoder.decode(atob(readData.value));
                  // console.log(decodedString);
                  console.log('====================================');
                });
              device.isConnected().then(data => {
                console.log('====================================');
                console.log('isConnected after startup', data);
                console.log('====================================');
              });
            }, 3000);

            // Do work on device with services and characteristics
          })
          .catch(error => {
            // Handle errors
          });

        // Proceed with connection.
      }
    });
   
  };
  return {
    scanAndConnect,
  };
}
   // setCharacteristic(characteristics[0]);
                // characteristics[0].monitor(null, (error, characteristic) => {
                //   //   if (error) {
                //   //     console.log('Error:', error);
                //   //     return;
                //   //   }
                //   console.log('====================================');
                //   console.log('here in monitor');
                //   console.log('====================================');
                //   // Characteristic value has been updated, read the latest value
                //   characteristic
                //     .read()
                //     .then(value => {
                //       console.log('Latest value:', value);
                //     })
                //     .catch(error => {
                //       console.log('Read error:', error);
                //     });
                // });

                 // manager.monitorCharacteristicForDevice(
    //   BpDeviceId,
    //   BloodPressureServiceUUID,
    //   BloodPressureMeasurementCharacteristicUUID,
    //   'monitor_listener', // Optional listener identifier
    //   (error, characteristic) => {
    //     if (error) {
    //       console.log('Monitoring error:', error);
    //       return;
    //     }
    //     console.log('Characteristic value changed:', characteristic.value);
    //   },
    // );