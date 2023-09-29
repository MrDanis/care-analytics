export const setStepsLive = stepsLive => ({
  type: 'SET_STEPS_LIVE',
  stepsLive,
});
export const setDistanceLive = distanceLive => ({
  type: 'SET_DISTANCE_LIVE',
  distanceLive,
});
export const setSpeedLive = speedLive => (
  {
    type:'SET_SPEED_LIVE',
    speedLive,
  }
)
export const isAuthorizedFromGoogleFit = isAuth =>({
  type: 'IS_AUTH_FROM_FIT',
  isAuth
})
export const setHeartLive = heartLive => (
  {
    type:'SET_HEART_LIVE',
    heartLive,
  }
)
