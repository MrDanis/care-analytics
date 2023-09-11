import React,{useState,Fragment,useEffect} from 'react'
import {Container,Row,Button,Dropdown} from 'react-bootstrap'
import {BiRightArrowAlt,BiLeftArrowAlt} from 'react-icons/bi'
import Swal from 'sweetalert2'
import { assignedModule,updateRole,saveUpdatedPrograms} from '../Features/ProgrameClice'
import { useSelector, useDispatch } from 'react-redux'
import { getAllPrograms } from '../Features/ProgrameClice'
import { loadingEnum } from '../assets/config'
import MainHome from '../Layout/MainHome'
const programe = () => {
    const [menuSelection,setmenuSelection] = useState('Analytics')
    const [activeProgrameIndex,setactiveProgrameIndex] = useState(0);
    const [isApplying,setisApplying] = useState({
      isApply:false,
      message:'Save All'
    });
    const {programeInfo,loading,serverRsponse,accessType,moduleStatusUpdateList,updateLoading } = useSelector((state) => state.userPrograme);
    const dispatch = useDispatch();
    const handleChange = (val)=>{
      switch (val) {
        case 0:
            // setmenuSelection('Analytics')
            dispatch(updateRole('Analytics'))
            break;
            case 1:
              // setmenuSelection('Performance')
              dispatch(updateRole('Performance'))
          break;
      
        default:
          break;
      }
    }
    const handleApplying = async(isAply) =>{
      if(moduleStatusUpdateList.length===0)
      {
        setisApplying({isApply:isAply,message:'Nothing to assign ....'});
        setTimeout(() => {
          setisApplying({isApply:!isAply,message:'Save All'})
       }, 1500);
      }
      else
      {
        setisApplying({isApply:isAply,message:'Assigning modules....'});
        let updateStatus = await dispatch(saveUpdatedPrograms({endPoint:'update-modules',list:moduleStatusUpdateList}));
        if(updateStatus?.payload?.statusCode === 200)
        {
          console.log('data is updating ....');
          setisApplying({isApply:!isAply,message:'Save All'})
          dispatch(getAllPrograms({endPoint:'get-all-modules'})); 
          Swal.fire({
            title: 'success!',
            text: 'Modules are assign successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000
          })
        }
        // if the payload is undefined then the something went wrong on server side...
        if(updateStatus?.payload === undefined)
        {
          setisApplying({isApply:!isAply,message:'Save All'});
          dispatch(getAllPrograms({endPoint:'get-all-modules'}));
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong on server side',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000
          })
          // dispatch a toast
        }
         console.log('This is the testing purpose : ',updateStatus);
        // setTimeout(() => {
        //    setisApplying({isApply:!isAply,message:'Save All'})
        // }, 3000);
      }
    }
    const handleGetModules = (index)=>{
      // Should dispatch the action here to fetch the data from the api
      setactiveProgrameIndex(index)
    }
     console.log("Programs comming from the store of the user are : ",moduleStatusUpdateList);
    // console.log("Programs comming from the store of the user are : ",programeInfo);
   useEffect(()=>{
    dispatch(getAllPrograms({endPoint:'get-all-modules'}));
    //  if(updateLoading === loadingEnum.suces)
    //  {
    //   setisApplying({isApply:false,message:'Save All'})
    //  }
   },[accessType])
  return (
      <MainHome>
      {
        loading===loadingEnum.pen?
        <Container className='mt-5 pt-5 d-flex align-items-center justify-content-center' fluid>
           <p className='mt-5'>Fetching the data from the api</p>
        </Container>
           :loading===loadingEnum.rejec?
        <Container className='mt-5 pt-5 d-flex align-items-center justify-content-center' fluid>
           <p className='mt-5 pt-5'>{serverRsponse}</p>
        </Container>   
        :
        <Container className="border border-0 border-success" fluid>
         <Row className='mb-4 m-0 p-3' style={{borderBottom:'1px solid silver'}}>
           <div className='col-12 m-0 p-0'>
           <Dropdown>
             <Dropdown.Toggle className='border border-1 mb-3' variant="ghost" id="dropdown-basic">
               {accessType}
             </Dropdown.Toggle>
             <Dropdown.Menu>
               <Dropdown.Item onClick={()=>{handleChange(0)}}>Analytics</Dropdown.Item>
               <Dropdown.Item onClick={()=>{handleChange(1)}}>Performance</Dropdown.Item>
             </Dropdown.Menu>
            </Dropdown>
           </div>  
           <div className='col-12 m-0 p-0 d-flex align-items-center justify-content-between'>
             <h4 className='m-0 p-0'>Modules Access</h4>
             <Button variant='primary' disabled={isApplying.isApply} onClick={()=>{handleApplying(true)}}>
               {isApplying.message} 
             </Button>
           </div>  
         </Row>
          <Row className='m-0 p-0 border border-0 border-danger'>
                 <div className='col-12 col-md-4 p-3 border border-0 border-success'>
                    <div className='w-100 d-flex flex-column flex-wrap border border-0 border-warning'>
                        <h5>Programe</h5>
                        <div className='row m-0 border border-1 rounded'>
                          {
                            programeInfo&&programeInfo?.map((item,index)=>{
                                return(
                                  <Fragment key={item?.programeId}>
                                   {
                                    <div className='col-12 m-0 p-0 border border-1'>
                                      <Button  variant='ghost' className='m-0 p-0 outline-none shadow-none border border-0 border-success w-100 d-flex align-items-center justify-content-start' onClick={()=>{handleGetModules(index)}} style={{backgroundColor:activeProgrameIndex===index?'#1876d2':'transparent',color:activeProgrameIndex===index?'#ffffff':'#000000'}} > 
                                         <p className='m-0 px-3 p-2'>
                                            {item?.progeameName}
                                         </p>
                                        </Button>
                                    </div>
                                   }
                                  </Fragment>
                                )
                            })
                          }  
                        </div>
                    </div>
                 </div>
                 <div className='col-12 col-md-4 p-3 border border-0 border-danger'>
                 <div className='w-100 d-flex flex-column flex-wrap border border-0 border-warning'>
                        <h5>Module</h5>
                        <div className='row m-0 p-0 border border-0 rounded'>
                          {
                            programeInfo&&programeInfo[activeProgrameIndex]?.programeModules.map((item,index)=>{
                                return(
                                  <Fragment key={item?.moduleId}>
                                  {
                                    item?.isModuleAssigned === false?
                                    <div className='col-12 m-0 p-0 border border-1'>
                                      <Button variant='ghost' className='m-0 px-3 p-2 outline-none shadow-none w-100 d-flex align-items-center justify-content-between' onClick={()=>{dispatch(assignedModule({parentId:programeInfo[activeProgrameIndex]?.programeId,childId:programeInfo[activeProgrameIndex]?.programeModules[index]?.moduleId}))}}> 
                                        <p className='m-0 p-0'>
                                           {item?.isModuleAssigned === false? item?.moduleName:null}
                                        </p>
                                        <BiRightArrowAlt size={25}/>
                                      </Button>
                                    </div>:null
                                  }
                                  </Fragment>
                                )
                            })
                          }  
                        </div>
                    </div>
                 </div>
                 <div className='col-12 col-md-4 p-3 border border-0 border-primary'>
                 <div className='w-100 d-flex flex-column flex-wrap border border-0 border-warning'>
                        <h5>Assigned Modules</h5>
                        <div className='row m-0 p-0 border border-0 rounded'>
                          {
                            programeInfo&&programeInfo[activeProgrameIndex]?.programeModules.map((item,index)=>{
                                return(
                                  <Fragment key={item?.moduleId}>
                                      {
                                        item?.isModuleAssigned === true?
                                         <div className='col-12 m-0 p-0 border border-1'>
                                          <Button variant='ghost' className='m-0 px-3 p-2 outline-none shadow-none w-100 d-flex align-items-center' onClick={()=>{dispatch(assignedModule({parentId:programeInfo[activeProgrameIndex]?.programeId,childId:programeInfo[activeProgrameIndex]?.programeModules[index]?.moduleId}))}}>
                                          <BiLeftArrowAlt size={25} />
                                           <p className='m-0 p-0'>
                                              {item?.isModuleAssigned === true? item?.moduleName:null}
                                           </p>
                                          </Button>
                                         </div>:null
                                      }
                                  </Fragment>
                                )
                            })
                          }  
                        </div>
                    </div>
                 </div>
              </Row>
         </Container>
      }
      </MainHome>   
  )
}

export default programe
