

export const userProfileData = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_PROFILE':
      return action.userDetail;
    default:
      return state;
  }
};
