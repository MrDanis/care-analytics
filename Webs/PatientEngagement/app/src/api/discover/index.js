import request from '../NetworkHelper';

function changeCatStatus(id, isActive) {
  return request(true, {
    url: `/360PatientEngagement/api/Dashboard/HealthCategoryStatus?categoryId=${id}&status=${isActive}`,
    method: 'PUT',
  });
}
function changeCatgoalStatus(id, goal) {
  return request(true, {
    url: `/360PatientEngagement/api/Dashboard/UpdatePatientGoal?categoryId=${id}&patientGoal=${goal}`,
    method: 'PUT',
  });
}

function getCategories() {
  return request(true, {
    url: `/360PatientEngagement/api/Dashboard/HealthCategories`,
    method: 'GET',
  });
}

// url: `/360PatientEngagement/api/Dashboard/GetHistoryPatientHealthCategory?categoryId=${id}&value=${date}`,
function getHealthCategoryById(id, date,type) {
  return request(true, {
    url: `/360PatientEngagement/api/Dashboard/GetHistoryPatientHealthCategory?categoryId=${id}&date=${date}&type=${type}`,
    method: 'GET',
  });
}    //url: `/360PatientEngagement/api/Dashboard/SaveUserHealthActivity?categoryId=${id}&startTime=${startDate}&endTime=${endDate}`,
function postHealthCategoryById(dataObject) {
  console.log('data before sending to api is : ',dataObject);
  return request(true, {
    url: `/360PatientEngagement/api/Dashboard/HealthCategoryData`,
    method: 'POST',
    data:dataObject
  });
}

const DiscoverService = {
  changeCatStatus,
  getCategories,
  getHealthCategoryById,
  postHealthCategoryById,
  changeCatgoalStatus
};

export default DiscoverService;
