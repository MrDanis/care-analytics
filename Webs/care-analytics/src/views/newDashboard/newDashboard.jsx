import React,{useState} from 'react'
import {Container,Row,Dropdown,Stack} from 'react-bootstrap'
import {FaUserCircle,FaStarOfLife} from 'react-icons/fa'
import {BsFillCalendarFill,BsCircleFill} from 'react-icons/bs'
import AnalysisForEnrolledPopulation from './dashboardReports/analysisForEnrolledPopulation'
import PmpCostAnalysisReport from './dashboardReports/pmpCostAnalysisReport'
import PcpVisitsReport from './dashboardReports/pcpVisitsReport'
import TransitionalCareManagementReport from './dashboardReports/transitionalCareManagementReport'
import EnrollmentCountReport from './dashboardReports/enrollmentCountReport'
import EnrollmentTrendReport from './dashboardReports/enrollmentTrendReport'
import HospitalizationReport from './dashboardReports/hospitalizationReport'
import AvgHospitalizationReport from './dashboardReports/avgHospitalizationReport'
import ReadmissionAnalysis from './dashboardReports/readmissionAnalysis'
import ReadmissionPercentage from './dashboardReports/readmissionPercentage'
import MainHome from '../../Layout/MainHome'
import { newdashboardData } from '../../data/newDashboardData'
import './newDashboard.css'
const newDashboard = () => {
  return (
    <MainHome>
      <Container className='m-0 p-0 border border-0 border-success' fluid style={{backgroundColor:'#f5f7fe'}}>
        <Row className='m-0 px-3 p-0 border border-0 border-danger' style={{backgroundColor:'#5e62e8',minHeight:'250px'}}>
          <div className='m-0 px-0 border border-0 border-dark d-flex flex-column align-items-center justify-content-between' style={{flex:1,paddingBottom:'2.5rem'}}>
              <div className='w-100 d-flex align-items-start justify-content-between mt-2 m-0 p-2 border border-0 border-success'>
                  <div className='d-flex border border-0 border-danger'>
                         <p className='text-light d-flex flex-column fs-2 fw-bold'>
                           <span>
                              Wellcome to 
                           </span> 
                           <span>
                              360 Care Analytics
                           </span> 
                         </p>
                  </div>
                  <div className='d-flex border border-0 border-warning'>
                  <Stack className='align-items-center' gap={3} direction="horizontal">
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
                    <FaUserCircle fill='white' size={40} className='p-0 m-0  headerHumberger'/>
                    </div>
                  </Stack>
                  </div>
              </div>
              <div className='w-100 d-flex align-items-end justify-content-between p-2 border border-0 border-warning' style={{marginTop:'-2.5rem'}}>
                <div className='d-flex w-50 m-0 p-0 border border-0 border-success'>
                <Stack direction='horizontal' gap={3}>
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
          <Container className='m-0 p-0 border border-0 border-danger'>
             <Row className='m-0 p-0'>
            
               <Stack className='m-0 p-0 align-items-start mainDashboardStatsBox' direction="horizontal" gap={5}>
                <div className="p-2 border border-0 border-danger bg-white rounded" style={{flex:2.5}}>
                <Stack direction="horizontal" gap={3}>
                   <div className="d-flex flex-wrap  p-2 border border-0 justify-content-center" style={{flex:1}}>
                   <div>
                     <p className='d-flex align-items-center mt-3 m-0 p-0 text-wrap'>
                        <BsCircleFill className='border border-1' size={10} fill='#f5f7fe' style={{borderRadius:'50%'}}/>
                        <small className='text-muted mx-1' style={{fontSize:'.75rem'}}>Patient</small>
                     </p>
                     <p className='mt-3 m-0 p-0 fw-bold fs-5'>4,253</p>
                   </div>
                   </div>
                   <div className="vr align-self-center" style={{minHeight:'3rem'}}/>
                   <div className="d-flex flex-wrap  p-2 border border-0 justify-content-center" style={{flex:1}}>
                   <div>
                     <p className='d-flex align-items-center mt-3 m-0 p-0 text-wrap'>
                        <BsCircleFill className='border border-1' size={10} fill='#f5f7fe' style={{borderRadius:'50%'}}/>
                        <small className='text-muted mx-1' style={{fontSize:'.75rem'}}>Patient</small>
                     </p>
                     <p className='mt-3 m-0 p-0 fw-bold fs-5'>4,253</p>
                   </div>
                   </div>
                   <div className="vr align-self-center" style={{minHeight:'3rem'}}/>
                   <div className="d-flex flex-wrap  p-2 border border-0 justify-content-center" style={{flex:1}}>
                   <div>
                     <p className='d-flex align-items-center mt-3 m-0 p-0 text-wrap'>
                        <BsCircleFill className='border border-1' size={10} fill='#f5f7fe' style={{borderRadius:'50%'}}/>
                        <small className='text-muted mx-1' style={{fontSize:'.75rem'}}>Patient</small>
                     </p>
                     <p className='mt-3 m-0 p-0 fw-bold fs-5'>4,253</p>
                   </div>
                   </div>
                </Stack>
                </div>
                <div className="p-3 border border-0 border-danger rounded" style={{flex:1.5,backgroundColor:'#03c3f9'}}>
                    <Stack  className='border border-0 border-success align-items-center' direction='horizontal'>
                      <div className="d-flex flex-column jsutify-content-center p-0 text-light" style={{flex:1}}>
                             <small className='p-0 mb-0 text-center' style={{fontSize:'.75rem',fontWeight:'350'}}>Readmisison</small>
                             <small className='m-0 p-0 text-center' style={{fontSize:'.75rem',fontWeight:'350'}}>Avoided</small>
                             <p className='d-flex flex-column fw-bold mt-1 fs-5 m-0 p-0 text-center'>Upto 0%
                                <small className='mx-3 m-0 p-0 ' style={{ fontSize:'.5rem',fontWeight:'300'}}>In last 12 Months</small>
                             </p>
                      </div>
                      <div className="vr h-100 align-self-center" style={{minHeight:'3rem',color:'grey',width:'1px'}}/>
                      <div className="d-flex flex-column jsutify-content-center p-0 text-light" style={{flex:1}}>
                             <small className='p-0 mb-0 text-center'  style={{fontSize:'.75rem',fontWeight:'350'}}>Approx. Cost</small>
                             <small className='m-0 p-0 text-center' style={{fontSize:'.75rem',fontWeight:'350'}}>Savings PMPM</small>
                             <p className='d-flex flex-column fw-bold mt-1 fs-5 m-0 p-0 text-center'>Upto 0%
                                <small className='mx-3 m-0 p-0 ' style={{ fontSize:'.5rem',fontWeight:'300'}}>In last 12 Months</small>
                             </p>
                      </div>
                    </Stack>
                </div>
               </Stack>
               <Stack className='mt-4 m-0 p-0 align-items-start enrollmentMainBox' direction='horizontal' gap={3}>
                  {/* Cost Benifite Analysis Report (Start)*/}
                   <AnalysisForEnrolledPopulation
                    colors={newdashboardData?.analysisPopulationColors}
                    type={newdashboardData?.analysisPopulationType} 
                    data={newdashboardData?.analysisPopulationData}
                    title={newdashboardData?.analysisPopulationTitle}
                    discription={newdashboardData.analysisDiscriptions}
                    />
                  {/* Cost Benifite Analysis Report (END)*/}
                  {/* PMPM Cost Analysis Report (START) */}
                <PmpCostAnalysisReport
                   title={newdashboardData?.pmpCostAnalysis?.title}
                   data={newdashboardData?.pmpCostAnalysis?.data}
                   xAxisLabels={newdashboardData?.pmpCostAnalysis?.xAxisLabels}
                   type={newdashboardData?.pmpCostAnalysis?.type}
                />
                  {/* PMPM Cost Analysis Report (END) */}
               </Stack>
               <Stack className='mt-4 m-0 p-0' direction='horizontal'>
                 {/* PCP Visits report (START) */}
                 <PcpVisitsReport
                  title={newdashboardData?.pcpVisits?.title}
                  data={newdashboardData?.pcpVisits?.data}
                  xAxisLabels={newdashboardData?.pcpVisits?.xAxisLabels}
                  type={newdashboardData?.pcpVisits?.type}
                 />
                 {/* PCP Visits report (END) */}
               </Stack>
               <Stack className='mt-4 m-0 p-0' direction='horizontal' gap={3}>
                 {/* Transitional Care Management Report (START) */}
                 <TransitionalCareManagementReport
                  title={newdashboardData?.transitionalCareManagement?.title}
                  data={newdashboardData?.transitionalCareManagement.data}
                  xAxisLabels={newdashboardData?.transitionalCareManagement?.xAxisLabels}
                  type={newdashboardData?.transitionalCareManagement?.type}
                 />
                 {/* Transitional Care Management Report (START) */}
                 <div className='h-100 p-0  border-0 border-danger' style={{flex:1.5}}>
                    <Stack className='m-0 p-0 h-100 border border-0 border-danger' direction='vertical' gap={3}> 
                      {/* Enrollment Count Report (START) */}
                      <EnrollmentCountReport
                       title={newdashboardData?.enrolmentCount?.title}
                       data={newdashboardData?.enrolmentCount?.data}
                       xAxisLabels={newdashboardData?.enrolmentCount?.xAxisLabels}
                       type={newdashboardData?.enrolmentCount?.type}
                      />
                      {/* Enrollment Count Report (END) */}
                      {/* Enrollment Trend Report (START) */}
                      <EnrollmentTrendReport
                       title=      {newdashboardData?.enrolmentTrend?.title}
                       data=       {newdashboardData?.enrolmentTrend?.data}
                       xAxisLabels={newdashboardData?.enrolmentTrend?.xAxisLabels}
                       type=       {newdashboardData?.enrolmentTrend?.type}
                      />
                      {/* Enrollment Trend Report (END) */}
                    </Stack>
                 </div>
               </Stack>
               {/* Hospitalization and AVG Hospitalization (START)*/}
               <Stack className='mt-4 m-0 p-0 align-items-start bg-white rounded commonBorder' direction='horizontal' gap={3}>
                {/* Avg Hospitalization (START) */}
                <AvgHospitalizationReport
                   colors={newdashboardData?.avgHospitalization?.colors}
                    type={newdashboardData?.avgHospitalization?.type} 
                    data={newdashboardData?.avgHospitalization?.data}
                    title={newdashboardData?.avgHospitalization?.title}
                    discription={newdashboardData?.avgHospitalization?.discription}
                />
                
                {/* Avg Hospitalization (End) */}
                {/* Hospitalization Report (START) */}
                <HospitalizationReport
                  title=      {newdashboardData?.hospitalization?.title}
                  data=       {newdashboardData?.hospitalization?.data}
                  xAxisLabels={newdashboardData?.hospitalization?.xAxisLabels}
                  type=       {newdashboardData?.hospitalization?.type}
                />
                {/* Hospitalization Report (END) */}
                
               </Stack>
               {/* Hospitalization and AVG Hospitalization (END)*/}
               {/* Re-Admission and Readmission analysis (START)*/}
               <Stack className='mt-4 m-0 p-0 align-items-start bg-white rounded commonBorder' direction='horizontal' gap={3}>
                {/* Re-admission Analysis report START */}
                <ReadmissionPercentage
                  title=      {newdashboardData?.reAdmission?.title}
                  data=       {newdashboardData?.reAdmission?.data}
                  xAxisLabels={newdashboardData?.reAdmission?.xAxisLabels}
                  type=       {newdashboardData?.reAdmission?.type}
                />
                {/* Re-admission Analysis report END */}
                {/* Re-admission percentage report start */}
                <ReadmissionAnalysis
                    colors={newdashboardData?.reAdmissionPercentage?.colors}
                    type={newdashboardData?.reAdmissionPercentage?.type} 
                    data={newdashboardData?.reAdmissionPercentage?.data}
                    title={newdashboardData?.reAdmissionPercentage?.title}
                    discription={newdashboardData?.reAdmissionPercentage?.discription}
                />
                {/* Re-admission percentage report end */}
               </Stack>
               {/* Re-Admission and Readmission analysis (END)*/}
            
             </Row>
          </Container> 
        </Row>
      </Container>
   </MainHome>
  )
}

export default newDashboard
