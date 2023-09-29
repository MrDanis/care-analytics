/* istanbul ignore file */
import wakeUpApp from 'react-native-wakeup-screen';

export default async data => {
  // Your background task
  console.log('coimg in service');
  wakeUpApp();
};
