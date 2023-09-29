import request from '../NetworkHelper';

function addAppointment(data) {
  return request(true, {
    url: '/360PatientEngagement/api/Appointment/AddAppointment',
    method: 'POST',
    data: data,
  });
}

const AppointmentService = {
  addAppointment,
};

export default AppointmentService;
