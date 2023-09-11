import { configureStore } from '@reduxjs/toolkit'
import AutheReducer from './Features/UserClice'
import ProgrameReducer from './Features/ProgrameClice'
export const Store = configureStore({
  reducer: {
   authUser:AutheReducer,
   userPrograme:ProgrameReducer
  },
})