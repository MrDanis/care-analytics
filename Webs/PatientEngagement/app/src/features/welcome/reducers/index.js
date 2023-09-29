export const liveStepsData = (state = 0, action) => {
  switch (action.type) {
    case 'SET_STEPS_LIVE':
      return action.stepsLive;

    default:
      return state;
  }
};
export const liveDistanceData = (state = 0, action) => {
  switch (action.type) {
    case 'SET_DISTANCE_LIVE':
      return action.distanceLive;

    default:
      return state;
  }
};
export const  liveSpeedData = (state = 0, action ) =>{
  switch(action.type){
    case 'SET_SPEED_LIVE':
      return action.speedLive;

      default: 
      return state;
  }
}
export const  liveHeartData = (state = 0, action ) =>{
  switch(action.type){
    case 'SET_HEART_LIVE':
      return action.heartLive;

      default: 
      return state;
  }
}