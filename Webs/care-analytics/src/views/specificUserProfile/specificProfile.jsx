import React from 'react'
import MainHome from '../../Layout/MainHome'
import {Row,Dropdown,Stack} from 'react-bootstrap'
import {FaUserCircle,FaStarOfLife,FaBed,FaBell} from 'react-icons/fa'
import {BiArrowBack} from 'react-icons/bi'
import {BsFillHospitalFill,BsFillPersonVcardFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {profileScreenData} from '../../data/userProfileData.js'
import UserTasksReport from './reports/userTasksReport'
import UserEnrollmentTrendReport from './reports/userEnrollmentTrendReport'
import UserHospitalVisitsReport from './reports/userHospitalVisitsReport'
const specificProfile = () => {
   console.log('Profile Screen Data is : ',profileScreenData);
  return (
  <MainHome>
    <div className='conatiner-fluid m-0 p-0'>
    <Row className='m-0 px-3 p-0 border border-0 border-danger' style={{backgroundColor:'#5e62e8',minHeight:'250px'}}>
          <div className='m-0 px-0 border border-0 border-dark d-flex flex-column align-items-center justify-content-between' style={{flex:1,paddingBottom:'2.5rem'}}>
              <div className='w-100 d-flex align-items-start justify-content-between mt-2 m-0 p-2 border border-0 border-success'>
                  <div className='d-flex border border-0 border-danger'>
                     
                         <p className='text-light d-flex flex-column fs-2 fw-bold'>
                         <small className='fw-light fs-6 text-light text-decoration-none'>
                           <Link className='text-decoration-none' to={'/user-features'}>
                            <small className='text-decoration-none text-light'>
                              <BiArrowBack fill='#ffffff' size={20}/>
                            </small>
                           </Link>
                           </small>
                           <span>
                            User Profile
                           </span> 
                           <small className='fw-light mt-1' style={{fontSize:'1rem'}}>
                            User based stats specific to user performance
                           </small> 
                         </p>
                  </div>
                  <div className='d-flex border border-0 border-warning'>
                  <Stack gap={3} direction="horizontal">
                    <div className="px-0 p-2 border border-0 border-success" style={{minWidth:'170px'}}>
                    <Dropdown>
                      <Dropdown.Toggle className='d-flex align-items-center justify-content-between outline-none border-0 shadow fs-6 w-100' style={{backgroundColor:'#7a7cec'}} id="dropdown-basic">
                        23 Contracts
                      </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="pt-0 p-2 border border-0 border-danger">
                    <FaUserCircle fill='white' size={40} className='p-0 mx-0  headerHumberger' style={{}}/>
                    </div>
                  </Stack>
                  </div>
              </div>
              <div className='w-100 d-flex align-items-end justify-content-between p-2 border border-0 border-warning' style={{marginTop:'-2.5rem'}}>
                <div className='d-flex w-50 m-0 p-0 border border-0 border-success'>
                <Stack className='d-none' direction='horizontal' gap={3}>
                      <div className='d-flex flex-column text-light'>
                        <p className='mb-2 m-0 p-0' style={{fontWeight:'400'}}>Program <FaStarOfLife className='mx-1' size={8} fill='red'/></p>
                         <Dropdown className='rounded'>
                          <Dropdown.Toggle className='d-flex align-items-center justify-content-between outline-none border-0 shadow fs-6 w-100 fw-normal' style={{backgroundColor:'#7a7cec'}} id="dropdown-basic">
                            <small className='text-wrap' style={{fontWeight:'300'}}>
                            Chronic Care Management
                            </small> 
                          </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                      </div>
                      <div className='d-flex flex-column text-light'>
                        <p className='mb-2 m-0 p-0' style={{fontWeight:'400'}}>ACO <FaStarOfLife className='mx-1' size={8} fill='red'/></p>
                         <Dropdown className='rounded'>
                          <Dropdown.Toggle className='d-flex align-items-center justify-content-between outline-none border-0 shadow fs-6 w-100 fw-normal' style={{backgroundColor:'#7a7cec'}} id="dropdown-basic">
                            <small className='text-wrap' style={{fontWeight:'300'}}>
                            Chronic Care Management
                            </small> 
                          </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                      </div>    
                </Stack>
                </div>
                <div className='d-flex m-0 p-0 border border-0 border-danger'>
                  {/* <BsFillCalendarFill fill='white' size={25} className='p-0 mx-4'/> */}
                  <Stack direction="horizontal" gap={0}>
                     <div className="px-2 p-1" style={{backgroundColor:'#7a7cec',borderTopLeftRadius:'.25rem',borderBottomLeftRadius:'.25rem'}}>
                      <small className='text-light'>Last 3 Years</small>
                      </div>
                     <div className="px-2 p-1 text-light" style={{backgroundColor:'#7a7cec'}}>
                     <small>Year to Date</small>
                     </div>
                     <div className="px-2 p-1 text-light" style={{backgroundColor:'#494bbb',borderTopRightRadius:'.25rem',borderBottomRightRadius:'.25rem'}}>
                     <small>Last 12 months</small>
                     </div>
                  </Stack>
                </div>
              </div>
          </div>
        </Row>
       <Row className='mx-0 px-4 py-0 border border-0 border-warning' style={{marginTop:'-2rem'}}>
            <Stack className='m-0 p-0 border border-0 border-success align-items-start mb-4' direction="horizontal" gap={2}>
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
                              <div className="w-100 d-flex justify-content-between  mt-1 m-0 px-2 p-0 border border-0 border-danger">
                                 {
                                  profileScreenData?.genralStatsData?.totalCounts.map((item,index)=>{
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
                             {/* stats card common component START */}
                             {
                             profileScreenData?.genralStatsData?.allStats.map((item,index)=>{
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
                <div className="d-flex flex-wrap justify-content-between m-0 p-0 border border-0 border-success" style={{flex:1}}>
                  {console.log('Genral Stats Count to be map : ',profileScreenData?.genralStatsData?.allStats)}
                  {
                    profileScreenData?.genralStatsData?.genralCounts.map((item,index)=>{
                        return(
                         <div className="d-flex flex-column m-0 py-0 p-2  w-50">
                         <div className="d-flex flex-column justify-content-between border border-1 bg-white rounded h-100 mb-3" style={{padding:'1.5rem',boxShadow:'0px 3px 1px #EBECF0',opacity:1}}>
                          <p className="text-muted text-wrap fw-light" style={{fontSize:'1rem'}}>
                             {item?.genralCountText}
                          </p>
                          <p className="mb-1">
                            <span className="text-dark fw-bold">
                                 {item?.genralCountAchive}
                            </span>/<small className="text-muted fw-light">
                                 {item?.genralCountTotall}
                            </small>
                          </p> 
                         </div>
                        </div>
                        )
                    })
                  }
                </div>
                <div className="border border-1 bg-white p-2 rounded" style={{flex:1}}>
                   <p className="fw-bold">
                      All Stats
                   </p>
                </div>
            </Stack>
            <Stack className='m-0 p-0 border border-0 border-success align-items-start mb-4' direction='vertical' gap={3}>
                <UserTasksReport 
                  taskStatsData={profileScreenData?.userReports?.tasksReport?.taskStats}
                  taskData={profileScreenData?.userReports?.tasksReport?.taskChartData}
                />
                <UserEnrollmentTrendReport
                  enrollemetData={profileScreenData?.userReports?.tasksReport?.enrollmentTrendChartData}
                />
                <UserHospitalVisitsReport
                  hospitalVisitStats={profileScreenData?.userReports.tasksReport.hospitalVisitsChartData}
                />
            </Stack>
       </Row>
    </div>
  </MainHome>
  )
}

export default specificProfile
