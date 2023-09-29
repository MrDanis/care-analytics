import MedicationService from '../api/medication';
import {getTodayMedication} from '../features/medication/actions';
import {store} from '../../../App';

export function getTodayMedicationData() {
  store.dispatch(getTodayMedication([]));
  MedicationService.getTodayMedication()
    .then(response => {
      console.log('getTodayMedication');
      console.log(JSON.stringify(response));
      if (
        response &&
        response.statusCode === 200 &&
        response.data.length > 0
      ) {
        store.dispatch(getTodayMedication(response.data));
      }
    })
    .catch(error => {
      console.log(error);
    });
}
