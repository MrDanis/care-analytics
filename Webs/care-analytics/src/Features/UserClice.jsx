import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { multiSelectData } from '../data/MultiSellectData';
const initialState = {
  isLogin: false,//localStorage.getItem('JwtToken')===null?false:true,
  userJWTToken:localStorage.getItem('JwtToken')===null?'':localStorage.getItem('JwtToken'),
  userRole:localStorage.getItem('userRole')=== null?'Public':localStorage.getItem('userRole'),
  user:localStorage.getItem('user')===null?'':JSON.parse(localStorage.getItem('user')),
  multiSelectData:multiSelectData,
  loading:'idle'
}
// Creating the thunk for login the user
 export const UserLogin = createAsyncThunk('user/login',async(userCredentials)=>{
  console.log('data before sending the api request is : ',userCredentials);
  // debugger
  const response = await fetch('http://nodebackend.vetechapp.com/signin/admin',{
    method:"POST",
    headers:{
      'Accept':'application/json',
      'Content-Type':'application/json',
    },
    body:JSON.stringify(userCredentials)
  });
  const data = await response.json();
  return data;
 })
export const authenticateUse = createSlice({
  name: 'UserAuth',
  initialState:initialState,
  reducers: {
    isLogin: (state) => {
      state.isLogin = true;
      state.userRole=state.user.role;
      state.loading='idle';
      // state.userRole='SuperAdmin';
      // localStorage.setItem('userRole','SuperAdmin')
      localStorage.setItem('userRole',state.user.role)
      localStorage.setItem('user',JSON.stringify(state.user));
      localStorage.setItem('JwtToken',state.userJWTToken);
    },
    Logout: (state) => {
      state.isLogin = false
      state.userRole='Public';
      state.userJWTToken=''
      state.user=''
      localStorage.setItem('userRole','Public')
      localStorage.setItem('user',null);
      localStorage.setItem('JwtToken',null);
    }
    ,
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
  },
  extraReducers:(builder)=>{
    builder.addCase(UserLogin.pending,(state)=>{
     state.loading='loading';
    })
    builder.addCase(UserLogin.fulfilled,(state,action)=>{
     state.loading='succeeded';
     console.log('toolkit api response : ',action.payload);
     state.user=action.payload.payload;
     state.userJWTToken=action.payload.token;
    })
    builder.addCase(UserLogin.rejected,(state)=>{
     state.loading='failed';
    })
  }
})

// Public Action creators are generated for each case reducer function
export const { isLogin,Logout,UpdateMultiSelectData } = authenticateUse.actions

export default authenticateUse.reducer