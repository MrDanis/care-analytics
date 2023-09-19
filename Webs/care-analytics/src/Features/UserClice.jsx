import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { multiSelectData } from '../data/MultiSellectData';
const initialState = {
  isLogin: false,//localStorage.getItem('JwtToken')===null?false:true,
  userJWTToken:localStorage.getItem('JwtToken')===null?'':localStorage.getItem('JwtToken'),
  userRole:localStorage.getItem('userRole')=== null?'Public':localStorage.getItem('userRole'),
  user:localStorage.getItem('user')===null?'':JSON.parse(localStorage.getItem('user')),
  multiSelectData:multiSelectData,
  loading:'idle',
  socket:null,
  userName:''
}
// Creating the thunk for login the user
 export const UserLogin = createAsyncThunk('user/login',async(userCredentials)=>{
  console.log('data before sending the api request is : ',userCredentials);
 })
export const authenticateUse = createSlice({
  name: 'UserAuth',
  initialState:initialState,
  reducers: {
    updateUser:(state,action)=>{
      console.log('user request comming form the login is : ',action?.payload?.isLogin);
       state.userName = action?.payload?.userName;
       state.isLogin = action?.payload?.isLogin;
    },
    getSocket:(state,action)=>{
       state.socket = action?.payload?.socket;
       console.log('Socket is : ',action?.payload)
    },
    senMessageToUser:(state,action)=>{
      // console.log('Message from the user is  : ',userMessage);
      let userMessage = action?.payload?.message;
      console.log('user message is : ',action?.payload?.message);
      state.socket.emit('send-message',userMessage); 
    },
    UpdateMultiSelectData:(state,action)=>{
       console.log('action is : ',action?.payload);
       let currentActiveIndex = state.multiSelectData.findIndex(obj => obj?.parentId === action?.payload?.parentId);
       if(currentActiveIndex !==-1)
       {
         for(let i=0; i<state.multiSelectData?.length;i++)
         {

             if(currentActiveIndex===i)
             {
                let changeChildStatus = state.multiSelectData[currentActiveIndex].child.findIndex(obj => obj?.childId === action?.payload?.childId);
                state.multiSelectData[currentActiveIndex].child[changeChildStatus].isChildActive= state.multiSelectData[currentActiveIndex].child[changeChildStatus].isChildActive? false : true ;
             }
             else
             {
                for(let j=0; j<state?.multiSelectData[i]?.child?.length;j++)
                { 
                    state.multiSelectData[i].child[j].isChildActive=false;
                }
             }
         }
       }
       else
       {
          console.log('No record is found ....');
       }
       console.log('Multiselect data after changing the data is : ',state.multiSelectData);
    }
  }
})

// Public Action creators are generated for each case reducer function
export const { UpdateMultiSelectData,updateUser,getSocket,senMessageToUser } = authenticateUse.actions

export default authenticateUse.reducer