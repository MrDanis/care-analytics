import React, {useState,useEffect,Fragment} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet,DatePickerIOS, Modal,Platform, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler'; // Update the import statement
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
// import DatePicker from 'react-native-date-picker'
import moment from 'moment';
const CustomDatePicker = ({isVisible, onDateChange, onCancel,time}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log('default date is : ',selectedDate,'Time comming from the parent is : ',time,'Visibility Status is : ',isVisible);
  const handleDateChange = (data) => {
    // console.log('Get the sleepTime : ',newDate);
    console.log("Time from the package is : ",data,'time from the parent is : ',time);
  
    setSelectedDate(data);
  };

  const handleCancel = () => {
    onCancel();
  };
  useEffect(()=>{
    console.log('Here in useEffect : ',time,'Visibility status is : ',isVisible)
    if(isVisible)
    {
      let dateIs = moment(time, 'h:mm A').format('HH:mm:ss');
      let sampleDate = new Date();
      sampleDate.setHours(parseInt(dateIs.split(':')[0]));
      sampleDate.setMinutes(parseInt(dateIs.split(':')[1]));
      sampleDate.setSeconds(parseInt(dateIs.split(':')[2]))
      setSelectedDate(sampleDate);
      //====================================================================================
      // sampleDate.setHours(22);
      // sampleDate.setMinutes(0);
      // sampleDate.setSeconds(0)
      // console.log('Hours are : ',parseInt(dateIs.split(':')[0]))
      // console.log('mints are : ',parseInt(dateIs.split(':')[1]))
      // console.log('seconds are : ',parseInt(dateIs.split(':')[2]))
      // console.log('Date to format is : ',dateIs,'and sample date is : ',sampleDate);
      //==================================================================================== 
    }
  },[isVisible])
  return (
    <Fragment>
       <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            {
              Platform.OS === 'ios'?
              <>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDateChange(selectedDate)}
              style={styles.doneButton}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>  
              </>
            :
            <>
             <Pressable
               onPress={handleCancel}
               style={styles.cancelButton}>
               <Text style={styles.buttonText}>Cancel</Text>
             </Pressable>
             <Pressable
               onPress={() => onDateChange(selectedDate)}
               style={styles.doneButton}>
               <Text style={styles.buttonText}>Done</Text>
             </Pressable>
            </>
            }
          </View>
          <DatePicker
           date={selectedDate}
           onDateChange={handleDateChange}
           mode='time'
           androidVariant='iosClone'
           textColor='#000000'
          />
        </View>
      </View>
    </Modal>
       {/* {
        Platform.OS==='ios'?
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDateChange(selectedDate)}
              style={styles.doneButton}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <DatePicker
           date={selectedDate}
           onDateChange={handleDateChange}
           mode='time'
           androidVariant='iosClone'
           textColor='#000000'
          />
        </View>
      </View>
    </Modal>:
  
    <Modal visible={isVisible} animationType="slide" transparent>
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerHeader}>
          <Pressable
            onPress={handleCancel}
            style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => onDateChange(selectedDate)}
            style={styles.doneButton}>
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View> 
      <DatePicker
         date={selectedDate}
         onDateChange={handleDateChange}
         mode='time'
         androidVariant='iosClone'
         textColor='#000000'
        />
       
      
      </View>
    </View>
  </Modal>
   
       } */}
    </Fragment>
  );
};

CustomDatePicker.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cancelButton: {},
  doneButton: {
    marginLeft: 8,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 18,
  },
});

export default CustomDatePicker;
