import React from 'react'
import {Stack} from 'react-bootstrap'
import {FaBed,FaBell} from 'react-icons/fa'
import {BsFillHospitalFill,BsFillPersonVcardFill} from 'react-icons/bs'
const aboutUserAndStats = ({userData,userStats}) => {
  return (
    <div className="border border-0 border-danger h-100" style={{flex:1}}>
    <Stack className="h-100 border border-0 border-danger" direction="vertical" gap={3}>
        <div className="d-flex flex-column border border-1 p-3 bg-white" style={{borderRadius:'.5rem'}}>
                <div className="w-100 d-flex flex-wrap m-0 p-2 rounded border border-0" style={{background:'transparent linear-gradient(272deg, #573BFF 0%, #00C3F9 100%) 0% 0% no-repeat padding-box'}}>
                    <div className="py-0 p-2 bg-white d-flex align-items-center justify-content-center" style={{borderRadius:'.5rem'}}>
                          <span className="text-wrap m-0 p-0" style={{color:'#573BFF',fontSize:'2rem'}}>VS</span>
                    </div>
                    <p className="mx-3 d-flex flex-column">
                       <span className="fw-bold text-light">Victoria Daigle</span>
                       <small className="mt-2 fw-light text-light">Care Coordinator</small>
                    </p>
                </div>
                {/* {userData} */}
                <div className="w-100 d-flex justify-content-between  mt-1 m-0 px-2 p-0 border border-0 border-danger">
                   {
                    userData&&userData.map((item,index)=>{
                      return(
                        <p className="mt-3 mb-0 d-flex flex-column">
                          <span className="text-muted fw-light" style={{fontSize:'1rem'}}>{item?.totalText}</span>
                          <span className="fw-bold text-dark mb-0" style={{fontSize:'2rem'}}>{item?.totalCountVal}</span>
                        </p>
                      )
                    })  
                   } 
                </div>
        </div>
        <div className="border border-1 p-0 bg-white" style={{borderRadius:'.5rem',padding:'1.5rem',boxShadow:'0px 3px 1px #EBECF0'}}>
         <div className='container-fluid h-100 m-0 p-0 border border-0 border-success'>
          <div className='row m-0 p-0'>
               <div className='col-12 border border-0 border-danger m-0 pt-1 p-0'>
                   <span className='my-2 mx-3 fw-bold text-wrap'>
                       All Stats
                   </span>
               </div>
               {/* stats card common component START userStats */}
               {
                userStats&&userStats.map((item,index)=>{
                  return(
                     <div key={index} className={index%2!==0?'col-12 col-md-6 m-0 pb-2 p-0 d-flex border border-0 align-items-start justify-content-center':'col-12 col-md-6 m-0 pb-2 p-0 d-flex border border-0 align-items-start justify-content-center'}>
                       <div className='d-flex align-items-start mt-1 pt-2 border border-0 border-success'>
                       {
                        index===0?
                        <BsFillPersonVcardFill fill='#7963F9' size={30} className='mt-0 m-0 p-2' style={{borderRadius:'.25rem',backgroundColor:'#AFA1FF40'}}/>
                        :
                        index===1?
                        <BsFillHospitalFill fill='#339B9B' size={30} className='mt-0 m-0 p-2' style={{borderRadius:'.25rem',backgroundColor:'#339B9B40'}}/>
                        :
                        index===2?
                        <FaBed fill='#DCBD5C' size={30} className='mt-0 m-0 p-2' style={{borderRadius:'.25rem',backgroundColor:'#DCBD5C40'}}/>
                        :
                        <FaBell fill='#AFA1FF' size={30} className='mt-0 m-0 p-2' style={{borderRadius:'.25rem',backgroundColor:'#AFA1FF40'}}/>
                       }
                        <p className='text-muted mx-3 m-0 p-0'>
                           <small className='m-0 p-0 fw-light text-muted' style={{fontSize:'1rem'}}>
                             {item?.statText}
                           </small>
                          <p className='text-dark fw-bold fs-4 mt-2 m-0 p-0' style={{fontSize:'2rem'}}>
                            {item?.statValue}
                          </p>
                        </p>
                       </div>
                     </div>
                  )
                })
               }
            </div>
          </div>     
        </div>
    </Stack>
  </div>
  )
}

export default aboutUserAndStats
