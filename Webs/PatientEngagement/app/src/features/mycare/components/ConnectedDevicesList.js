/* istanbul ignore file */
import React, {Component, Fragment} from 'react';
import {Text, TouchableOpacity, View, FlatList} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Colors from '../../../../config/Colors';
import moment from 'moment';
import {retrieveSavedVitalValuesWithDevicesForVital} from '../../../helpers/BLEHelper/BLEVitalStorage';
import {GATServices} from '../../../helpers/BLEHelper/BLEConstants';
import {Fonts} from '../../../../config/AppConfig';
function Item({
  item,
  index,
  navigation,
  callFunction,
  callHistoryFunction,
  data,
}) {
  let lastRecordedVital = null;
  if (item.vitals.length > 0) {
    lastRecordedVital = item.vitals[0];
  }
  console.log('Last REcorded Vital', lastRecordedVital);
  return (
    <View
      style={{
        flexDirection: 'column',
        backgroundColor: Colors.white,
        paddingLeft: hp(2),
        paddingRight: hp(2),
        paddingTop: hp(2),
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.white,
        }}>
        <Text
          style={{
            fontSize: hp(2.5),
            flex: 1,
            fontFamily: 'Roboto-Bold',
            color: Colors.black,
          }}>
          {item.name}
        </Text>
        {lastRecordedVital !== null && (
          <TouchableOpacity
            onPress={() => {
              callHistoryFunction(item, data);
            }}>
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Roboto-Bold',
                color: Colors.bleLayer1,
                padding: hp(1),
              }}>
              View History
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {lastRecordedVital !== null ? (
        <View style={{flexDirection: 'row', marginTop: hp(0.5)}}>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: hp(2),
                marginTop: hp(0.5),
                fontFamily: 'Roboto-Bold',
                color: Colors.black,
              }}>
              {lastRecordedVital.description()}
            </Text>
            <Text
              style={{
                fontSize: hp(2),
                marginTop: hp(0.5),
                fontFamily: Fonts.SourceSansRegular,
                color: Colors.notificationGray,
              }}>
              {moment(lastRecordedVital.dateTime).format('LLL')}
            </Text>
          </View>
          {lastRecordedVital.synchronized === false ? (
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                callFunction(item, lastRecordedVital, data, navigation);
              }}>
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: 'Roboto-Bold',
                  color: Colors.bleLayer1,
                  padding: hp(1),
                  marginTop: hp(2),
                }}>
                Select
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Roboto-Medium',
                padding: hp(1),
                marginTop: hp(2),
                color: Colors.green,
              }}>
              Saved
            </Text>
          )}
        </View>
      ) : (
        <View style={{flex: 1, margin: 20}}>
          <Text style={{textAlign: 'center'}}>No Data</Text>
        </View>
      )}
      <View
        style={{
          height: 1,
          marginTop: hp(2),
          backgroundColor: Colors.lightGrey,
        }}
      />
    </View>
  );
}
export class ConnectedDevicesList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      connectedDevice: null,
      devices: null,
      supportedVitals: '--',
      vitalValue: null,
      vitalSaved: false,
      showLoader: false,
    };
  }
  componentDidMount() {
    this.populateComponentData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refreshCount !== this.props.refreshCount) {
      this.populateComponentData();
    }
  }

  populateComponentData() {
    var vitalName = this.props.vitalName;
    console.log('Selected Vital:', vitalName);
    vitalName = vitalName.trim();
    if (vitalName === 'Pulse Rate') {
      vitalName = GATServices.HeartRateServiceUUID;
    }
    retrieveSavedVitalValuesWithDevicesForVital(vitalName, false)
      .then(result => {
        let devices = [];
        let vital = null;
        let firstDevice = null;
        if (result.length > 0) {
          devices = Array.from(result);
          firstDevice = devices[0];
          if (firstDevice.vitals.length > 0) {
            vital = firstDevice.vitals[0];
          }
        }
        this.setState({
          devices: devices,
          connectedDevice: firstDevice,
          vitalValue: vital,
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  render() {
    console.log('Rendering CAlled');
    console.log('Devices:', this.state.devices);

    return (
      <Fragment>
        {this.props.data ? (
          <FlatList
            data={this.state.devices}
            renderItem={({item}) => (
              <Item
                item={item}
                navigation={this.props.navigation}
                callFunction={this.props.callParentFunction}
                callHistoryFunction={this.props.callHistoryFunction}
                data={this.props.data}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : null}
      </Fragment>
    );
  }
}
