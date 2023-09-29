/* istanbul ignore file */
import request from '../NetworkHelper';

function getPendingAssessmentsList() {
  return request(true, {
    url: '/360PatientEngagement/api/Assessment',
    method: 'GET',
  });
}

function getCompletedAssessmentsList() {
  return request(true, {
    url: '/360PatientEngagement/api/Assessment/Completed',
    method: 'GET',
  });
}

function getAssessmentsDetails(itemData) {
  let url =
    '/360PatientEngagement/api/Assessment/GetDetails?id=' +
    itemData.id +
    '&formSubId=' +
    itemData.formSubId;
  return request(true, {
    url: url,
    method: 'Get',
  });
}
function saveAssessmentAnswers(data) {
  return request(true, {
    url: '/360PatientEngagement/api/Assessment/SaveSingleAnswer',
    method: 'POST',
    data: data,
  });
}
function saveAssessmentSingleQuestion(data) {
  return request(true, {
    url: '/360PatientEngagement/api/Assessment/SaveSingleAnswer',
    method: 'POST',
    data: data,
  });
}
function markCompletedAssessment(data) {
  return request(true, {
    url: '/360PatientEngagement/api/Assessment/MarkComplete',
    method: 'POST',
    data: data,
  });
}
function reOpenAssessment(data) {
  return request(true, {
    url: 'PatientTouchService/api/Assessments/ReopenAssessment',
    method: 'POST',
    data: data,
  });
}
const AssessmentService = {
  getPendingAssessmentsList,
  getCompletedAssessmentsList,
  getAssessmentsDetails,
  saveAssessmentAnswers,
  markCompletedAssessment,
  saveAssessmentSingleQuestion,
  reOpenAssessment,
};

export default AssessmentService;
