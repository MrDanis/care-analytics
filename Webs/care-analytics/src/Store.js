import { configureStore } from '@reduxjs/toolkit'
import AutheReducer from './Features/UserClice'
import ProgrameReducer from './Features/ProgrameClice'
import AuthReducer from './Features/AuthClise'
export const Store = configureStore({
  reducer: {
   authUser:AutheReducer,
   userPrograme:ProgrameReducer,
   AuthUser:AuthReducer
  },
})