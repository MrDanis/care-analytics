import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import { baseUrl,apiProgram,loadingEnum } from '../assets/config'
import axios from 'axios'
// Create the api for checking weather the user is Authorize or not

// Initializing state
const initialState = {
    loading:'idle',
    userObj:{
        isLogin:false,
        userToken:'',
        role:'user',
        user:{}
    }
}
export const AuthUser =  createSlice({
    name:'Auth',
    initialState:initialState,
    reducers:{
        getUser:()=>{},
        updateUserStatus:()=>{}

    },

    // extrareducers in case of when we need to call the api 
}) 
// Exporting the functions along with the reducer
export const {getUser,updateUserStatus} = AuthUser.actions
export default AuthUser.reducer