import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { baseUrl,apiProgram,loadingEnum } from '../assets/config';
import axios from 'axios'
// Calling the api using createAsyncThunk for retriving all the Modules (Start)
export const getAllPrograms = createAsyncThunk('user/getAllprograms',async(data)=>{
  const getPrograms = await axios.get(`${baseUrl}/${apiProgram}/${data?.endPoint}`);
  return getPrograms.data;
})
// Calling the api using createAsyncThunk for retriving all the Modules(End)
export const saveUpdatedPrograms = createAsyncThunk('user/updateModule',async(data)=>{
  const payload = {
    updatedList:data.list
  }
  const updatePrograme = await axios.post(`${baseUrl}/${apiProgram}/${data?.endPoint}`,payload)
  return updatePrograme.data;
})
// Initializing State
const initialState = {
    loading:'idle',
    updateLoading:'idle',
    programeInfo:[],//ProgrameData,
    serverRsponse:null,
    moduleStatusUpdateList:[],
    accessType:'analytics'
}
// Creating Slice and action that are preformed by the user
export const UserPrograms = createSlice({
    name:'UserPrograme',
    initialState:initialState,
    reducers:{
        assignedModule: (state,action)=>{
          let parentIndex = state.programeInfo?.findIndex(obj => obj?.programeId === action?.payload?.parentId);
          let childIndex = state.programeInfo[parentIndex]?.programeModules?.findIndex(obj => obj?.moduleId === action?.payload?.childId);
          let changeStatus = !(state.programeInfo[parentIndex]?.programeModules[childIndex]?.isModuleAssigned);
          state.programeInfo[parentIndex].programeModules[childIndex].isModuleAssigned = changeStatus;
          state.moduleStatusUpdateList.push(state.programeInfo[parentIndex].programeModules[childIndex]);
        },
        unAssignmedModule:(state,action)=>{
          console.log('User request for the action is : ',action?.payload)
          state.moduleStatusUpdateList=[];
        },
        updateRole:(state,action)=>{
          console.log('Action of the data is : ',action?.payload);
          state.accessType=action?.payload;
        }
    },
    extraReducers: (builder)=>{
       builder.addCase(getAllPrograms.pending,(state,action)=>{
        state.loading = loadingEnum.pen;
       })
       builder.addCase(getAllPrograms.fulfilled,(state,action)=>{
        state.loading = loadingEnum.suces;
        state.programeInfo= action?.payload
        // console.log('Data comming from the api is : ',action.payload);
          })
       builder.addCase(getAllPrograms.rejected,(state,action)=>{
         state.loading = loadingEnum.rejec;
         state.serverRsponse = 'Server is busy now';
        })
        builder.addCase(saveUpdatedPrograms.pending,(state)=>{
          state.updateLoading = loadingEnum.pen;
        })
        builder.addCase(saveUpdatedPrograms.fulfilled,(state,action)=>{
          state.updateLoading = loadingEnum.suces;
          
          state.moduleStatusUpdateList=[];
          console.log('Response after updating the list is : ',action.payload,'And request status is : ',action?.meta?.requestStatus);
        })
        builder.addCase(saveUpdatedPrograms.rejected,(state,action)=>{
          state.updateLoading = loadingEnum.rejec 
          state.serverRsponse = 'Server is busy now';
       })
    }
    
})
// Exporting the functions along with the reducer
export const {assignedModule,unAssignmedModule,updateRole} = UserPrograms.actions

export default UserPrograms.reducer