import request from '../NetworkHelper';
// Sleep Screen Data saving and fetching
function addSleepRoutimeTimes(data, catId) {
  console.log(
    'data before sending to api is  : ',
    data,
    'and catagorey id is : ',
    catId,
  );
  return request(true, {
    url: `360PatientEngagement/api/Dashboard/SaveUserHealthActivity?categoryId=${catId}`,
    method: 'POST',
    data: data,
  });
}
function getCategoryHistoryDataById(catId, data) {
  console.log('Current Catagorey is : ', catId, ' and date is : ', data);
  return request(true, {
    url: `360PatientEngagement/api/Dashboard/GetHistoryPatientHealthCategory?categoryId=${catId}&date=${data}`,
    method: 'GET',
  });
}
function saveActivityRecord(catId, data) {
  const payload = {
    categoryId: catId,
    value: data,
  };
  return request(true, {
    url: '360PatientEngagement/api/Dashboard/HealthCategoryData',
    method: 'POST',
    data: payload,
  });
}
const ActivityService = {
  addSleepRoutimeTimes,
  getCategoryHistoryDataById,
  saveActivityRecord,
};
export default ActivityService;
