import request from '../NetworkHelper';
import AuthService from '../auth';
import {convertUTCDateToLocalDate} from '../../helpers/Common';
import {AuthToken, retrieveItem} from '../../helpers/LocalStorage';

function getMedicationLookUp(keywords) {
  return request(true, {
    url:
      '/360PatientEngagement/api/Medication/SearchMedication?keyword=' +
      keywords +
      '&Start=0&End=10',
    method: 'GET',
  });
}
function addMedication(data) {
  return request(true, {
    url: '/360PatientEngagement/api/Medication/AddMedication',
    method: 'POST',
    data: data,
  });
}
function getAllMedication() {
  return request(true, {
    url:
      '/360PatientEngagement/api/Medication/GetAllMedications?start=0&length=50&offset=' +
      convertUTCDateToLocalDate(new Date()).getTimezoneOffset(),
    method: 'GET',
  });
}
function getTodayMedication() {
  console.log('current Date');
  console.log(convertUTCDateToLocalDate(new Date()).getTimezoneOffset());
  return request(true, {
    url:
      '/360PatientEngagement/api/Medication/GetTodaysMedications?offset=' +
      convertUTCDateToLocalDate(new Date()).getTimezoneOffset(),
    method: 'GET',
  });
}

function getMedicationById(medId) {
  console.log('Med Id', medId);
  return request(true, {
    url:
      '/360PatientEngagement/api/Medication/GetMedicationsById?userMedId=' +
      medId,
    method: 'GET',
  });
}
function UpdateTakenMedication(data) {
  console.log('UpdateTakenMedication');
  console.log(JSON.stringify(data));
  return request(true, {
    url: '/360PatientEngagement/api/Medication/UpdateTakenStatus',
    method: 'POST',
    data: data,
  });
}
function deleteMedication(id) {
  return request(true, {
    url:
      '/360PatientEngagement/api/Medication/DeleteMedication?userMedId=' + id,
    method: 'GET',
  });
}
function updateActiveStatus(id, isActive) {
  return request(true, {
    url:
      '/360PatientEngagement/api/Medication/UpdateActiveStatus?userMedId=' +
      id +
      '&isActive=' +
      isActive,
    method: 'GET',
  });
}
function updateMedication(data) {
  return request(true, {
    url: '/360PatientEngagement/api/Medication/UpdateMedication',
    method: 'POST',
    data: data,
  });
}
async function getMedicineImage(productId, ndc) {
  let authToken = await retrieveItem(AuthToken);
  return new Promise((resolve, reject) => {
    fetch(
      'https://qa.wmi360.com/360BigFootWebapi/Medication/FdaImage?productId=' +
        productId +
        '&Ndc=' +
        ndc,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'image/png,image/jpeg',
          Authorization: 'Bearer ' + authToken,
          Accept: 'image/png, image/jpeg',
        },
      },
    )
      .then(response => {
        console.log('FdaImage');
        console.log(response.url);
        resolve(response.url);
      })
      .catch(err => {
        reject(false);
      });
  });
}
function getNearByPharmacies(dataObject) {
  console.log(dataObject);
  return request(true, {
    url: '/360PatientEngagement/api/GoodRx/Compare',
    method: 'POST',
    data: dataObject,
  });
}
function getMedicationHistory(start, length) {
  return request(true, {
    url: `/360PatientEngagement/api/PatientHistory/Medications?start=${start}&length=${length}`,
    method: 'GET',
  });
}
function getDiseasesHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/Diseases',
    method: 'GET',
  });
}
function getProceduresHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/Procedures',
    method: 'GET',
  });
}

function getInteractionHistory(dataObject) {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/Interaction',
    method: 'POST',
    data: dataObject,
  });
}
function getPharmacies() {
  return request(true, {
    url: '/360PatientEngagement/api/Shortcuts/GetPharmacies',
    method: 'GET',
  });
}
function getPatientPharmacy() {
  return request(true, {
    url: '/360PatientEngagement/api/Contact/GetPatientPharmacy',
    method: 'GET',
  });
}
function GetAllHistory() {
  return request(true, {
    url: '/360PatientEngagement/api/PatientHistory/GetAllHistory',
    method: 'GET',
  });
}
const MedicationService = {
  getMedicationLookUp,
  addMedication,
  getAllMedication,
  getTodayMedication,
  getMedicationById,
  UpdateTakenMedication,
  deleteMedication,
  updateActiveStatus,
  updateMedication,
  getMedicineImage,
  getNearByPharmacies,
  getMedicationHistory,
  getDiseasesHistory,
  getProceduresHistory,
  getInteractionHistory,
  getPharmacies,
  GetAllHistory,
  getPatientPharmacy,
};
export default MedicationService;
