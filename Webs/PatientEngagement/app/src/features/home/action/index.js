/* istanbul ignore file */
export const getHomeApiData = data => ({
  type: 'GET_HOME_API_DATA',
  data,
});
export const getModalData = bool => ({
  type: 'GET_MODAL_HANDLER',
  bool,
});
