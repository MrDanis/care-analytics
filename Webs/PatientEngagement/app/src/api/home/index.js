import request from '../NetworkHelper';

function getHomeApi() {
  return request(true, {
    url: '/360PatientEngagement/api/Configuration/GetConfiguration',
    method: 'GET',
  });
}
const HomeService = {
  getHomeApi,
};

export default HomeService;
