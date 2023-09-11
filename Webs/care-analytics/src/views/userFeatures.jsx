import React,{useState} from 'react'
import {Container,Row,Stack,Dropdown} from 'react-bootstrap'
import MainHome from '../Layout/MainHome'
import {FaUserCircle} from 'react-icons/fa'
import {BsFillCalendarFill} from 'react-icons/bs'
import { userFeatureData } from '../data/userFeatureData'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { colors } from '../assets/colors'

const userFeatures = () => {
  console.log('Data of the user feature is : ',userFeatureData);
  const [chartOptions,setchartOptions] = useState({
    chart: {
        type: 'column',
        height:250
    },
    title: {
        text: ''
    },
    subtitle: {
        // text: 'Source: WorldClimate.com'
    },
    xAxis: {
        categories: [
            'Catherine',
            'Harlod',
            'Victoria Daigle',
            'Thelma Paschall',
            'Howard Cleaves',
            'Clifton Merritt',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Complete Tasks',
        data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]

    }, {
        name: 'Completed Appointment',
        data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]

    }]
});
const [chartOptionsEnrollment,setchartOptionsEnrollment] = useState({
  chart: {
      type: 'spline'
  },
  title: {
      text: ''
  },
  subtitle: {
      // text: 'Source: WorldClimate.com'
  },
  xAxis: {
      categories: [
          'Catherine',
          'Harlod',
          'Victoria Daigle',
          'Thelma Paschall',
          'Howard Cleaves',
          'Clifton Merritt',
          'Willie Pope',
          'Willie Pope',
          'Willie Pope',
          'Willie Pope',
          'Willie Pope',
          'Willie Pope',
      ],
      crosshair: true
  },
  yAxis: {
      min: 0,
      title: {
          text: ''
      }
  },
  tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  series: [{
      name: 'Complete Tasks',
      data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]

  }, {
      name: 'Completed Appointment',
      data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]

  }]
})
  return (
   <MainHome>
      <Container className='m-0 p-0 border border-0 border-success' fluid style={{backgroundColor:'#f5f7fe'}}>
        <Row className='m-0 px-3 p-0 border border-0 border-danger' style={{backgroundColor:'#5e62e8',minHeight:'250px'}}>
          <div className='m-0 px-0 border border-0 border-dark d-flex flex-column align-items-center justify-content-between' style={{flex:1,paddingBottom:'2.5rem'}}>
              <div className='w-100 d-flex align-items-start justify-content-between mt-2 m-0 p-2 border border-0 border-success'>
                  <div className='d-flex border border-0 border-danger'>
                         <p className='text-light d-flex flex-column fs-2 fw-bold'>
                           <span>
                              Care Team
                           </span> 
                           <span>
                              Performance
                           </span> 
                         </p>
                  </div>
                  <div className='d-flex border border-0 border-warning'>
                  <Stack gap={3} direction="horizontal">
                    <div className="px-0 p-2 border border-0 border-success" style={{minWidth:'170px'}}>
                    <Dropdown>
                      <Dropdown.Toggle className='bg-transparent d-flex align-items-center justify-content-between outline-none border-0 shadow fs-6 w-100' id="dropdown-basic">
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
              <div className='w-100 d-flex align-items-center justify-content-end p-2 border border-0 border-warning' style={{marginTop:'-2.5rem'}}>
              <BsFillCalendarFill fill='white' size={25} className='p-0 mx-4'/>
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
        </Row>
        <Row className='mx-0 px-4 py-0 border border-0 border-warning' style={{marginTop:'-2rem'}}>
          <div className='conatiner-fluid m-0 p-0 border border-0 border-success'>
             <div className='row m-0 p-0'>
             <Stack className='m-0 p-0 border border-0 border-success align-items-start mb-4' direction="horizontal" gap={3}>
               <div className="m-0 p-3 m-0 border border-1 rounded bg-white" style={{flex:1}}>
                  {/* All Stats Component Start*/}
                   <div className='container-fluid m-0 p-0 border border-0 border-success'>
                        <div className='row m-0 p-0'>
                             <div className='col-12 mb-4 m-0 p-0'>
                                 <span className='fw-bold text-wrap'>
                                     All Stats
                                 </span>
                             </div>
                             {/* stats card common component START */}
                             {
                              userFeatureData?.allStat.map((item,index)=>{
                                return(
                                   <div key={index} className={index%2!==0?'col-12 col-md-6 mb-1 mt-4 m-0 pb-2 p-0 d-flex border border-0 align-items-start justify-content-end':'col-12 col-md-6 mb-1 mt-4 m-0 pb-2 p-0 d-flex border border-0 align-items-start justify-content-start'}>
                                     <div className='d-flex align-items-start mt-1 pt-2 border border-0 border-success'>
                                      <BsFillCalendarFill fill='#5e62e8' size={30} className='mt-0 m-0 p-0'/>
                                      <p className='text-muted mx-3 m-0 p-0'>
                                         <small className='m-0 p-0 text-muted'>
                                           {item?.statLable}
                                         </small>
                                        <p className='text-dark fw-bold fs-4 mt-2 m-0 p-0'>
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
                  {/* All Stats Component END*/}
               </div>
               <div className="m-0 p-3 border border-1 rounded bg-white" style={{flex:3}}>
                 <div className='container-fluid m-0 p-0 border border-0 border-success'>
                   <div className='row m-0 p-0'>
                      <div className='col-12 m-0 p-0'>
                      <span className='fw-bold text-wrap'>
                        All Stats
                      </span>
                      </div>
                      <div className='col-12 mt-2 m-0 p-0'>
                        <Stack className='border border-0 border-danger' direction="horizontal" gap={3}>
                        {/* Stats card bord START */}
                           {
                              userFeatureData.allStats.map((item,index)=>{
                                return(
                                    <div key={index} className="border border-0 border-danger m-0 pt-0 p-2 d-flex flex-column justify-content-center flex-wrap rounded" style={{flex:1}}>
                                        <span className='text-muted m-0 mb-3 p-0 text-center'>
                                             {item?.statText}
                                        </span>
                                        <div className='border border-0 border-danger d-flex flex-wrap'>
                                           <CircularProgressbarWithChildren styles={buildStyles({
                                            pathColor:index===0?'rgb(0 198 249)':index===1?'rgb(166 166 255)':index===2?'rgb(220 189 92)':'rgb(88 92 229)',
                                            trailColor:'rgb(245 247 254)',
                                            height:'100px'
                                           })} value={parseInt(item?.statValue)}>
                                           <div className='m-0 p-0 border border-0 border-dark' style={{ marginTop: -5 }}>
                                                 <p className='m-0 p-0 text-center text-dark fw-bold fs-2'>
                                                   {item?.statValue}
                                                 </p>
                                                 <p className='m-0 p-0 text-muted text-center'>
                                                    {item.statFill}
                                                 </p>
                                           </div>
                                           </CircularProgressbarWithChildren>

                                        </div>
                                    </div>
                                )
                              })
                           }
                        {/* Stats card bord END */}
                        </Stack>
                      </div>
                   </div>
                 </div>
               </div>
             </Stack>
             <Stack className="mb-4 m-0 p-0 border border-0 border-success align-items-start" direction="horizontal" gap={3}>
               <div className="m-0 p-3 border border-0 h-100 border-dark rounded bg-white" style={{flex:3}}>
                 {/* Task component Start*/}
                    <div className='container-fluid m-0 p-0 border border-0 border-success'>
                      <div className='row m-0 p-0 border border-0 border-danger' style={{height:'270px',overflow:'hidden',overflowY:'scroll'}}>
                        <div className='d-flex align-items-center justify-content-between'>
                        <span className='fw-bold text-wrap'>
                          Tasks
                        </span>
                          <Stack className='border border-1 rounded' direction="horizontal" gap={0}>
                            <div className="px-2 p-1 border border-1" style={{backgroundColor:'transparent',borderTopLeftRadius:'.25rem',borderBottomLeftRadius:'.25rem'}}>
                             <small className='text-dark'>Last 3 Years</small>
                             </div>
                            <div className="px-2 p-1 border-1 text-dark" style={{backgroundColor:'transparent'}}>
                            <small>Year to Date</small>
                            </div>
                            <div className="px-2 p-1 text-light" style={{backgroundColor:'#494bbb',borderTopRightRadius:'.25rem',borderBottomRightRadius:'.25rem'}}>
                            <small>Last 12 months</small>
                            </div>
                          </Stack>
                        </div>
                        {/* Task Report START */}
                        <div className='row mt-1 m-0 p-0 border border-0 border-dark'>
                        <div className='col-11 d-flex flex-wrap m-0 p-2 border border-0 border-danger'>
                          {
                             userFeatureData?.tasksChartStatsData.map((item,index)=>{
                              return(
                                <div className='d-flex flex-column flex-wrap p-2 ' key={index} style={{flex:1}}>
                                     <p className='mt-2 m-0 p-0 text-muted'>
                                        {item?.taskStatLabel}
                                     </p>  
                                     <p className='p-0 mt-2 m-0 text-dark fw-bold fs-5'>
                                        {item?.taskStatValue}
                                     </p>  
                                </div>
                              )
                             })
                          }
                        </div>
                        <div className='col-12 m-0 p-0'>
                        <div className=''>
                          <HighchartsReact  highcharts={Highcharts} options={chartOptions}/>
                        </div>
                        </div>
                        </div>
                        {/* Task Report END */}
                      </div>
                    </div>
                 {/* Task component End*/}

               </div>
               <div className="d-flex flex-wrap  m-0 p-0 border border-0 border-danger rounded bg-transparent h-100" style={{flex:1}}>
                  {/* Task Stats cards (START) */}
                  {
                    userFeatureData.tasksStatsData.map((item,index)=>{
                      return(
                        
                          <div className='d-flex flex-column justify-content-between  m-2 p-2 rounded bg-white gutter-2' style={{flex:1,borderLeft:index===0?'4px solid rgb(0 198 249)':index===1?'4px solid rgb(166 166 255)':index===2?'4px solid rgb(220 189 92)':index===3?'4px solid rgb(88 92 229)':index===4?'4px solid rgb(88 92 229)':'4px solid rgb(88 92 229)'}}>
                            <p className='m-0 p-0 text-muted' style={{fontSize:'.85rem'}}>{
                              item?.taskRecordLabel
                            }</p>
                            <p className='m-0 p-0' >
                            <span className='text-dark fw-bold fs-6'>
                              {item?.taskRecordAchiveValue}
                            </span>/
                            <small className='text-muted mb-3'>
                              {item?.taskRecordTotalValue}
                            </small>
                            </p>

                          </div>
                         
                        
                      )
                    })
                  }
                  {/* Task Stats cards (END) */}
               </div>
             </Stack>
             {/* Team Member component (START) */}
             <div className='container-fluid m-0 p-0'>

             </div>
             {/* Team Member component (END) */}
             {/* Hospital report component (START) */}
             <div className='container-fluid m-0 p-3 border border-0 border-success bg-white rounded'>
                      <div className='row m-0 p-0 border border-0 border-danger'>
                        <div className='d-flex align-items-center justify-content-between'>
                        <span className='fw-bold text-wrap'>
                          Hospital Visits
                        </span>
                        <div className='d-flex border border-0 border-danger'>
                        <Dropdown className='mx-3'>
                      <Dropdown.Toggle className='bg-transparent text-dark d-flex align-items-center justify-content-between outline-none border-0 fs-6 w-100' id="dropdown-basic">
                        enable
                      </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                          <Stack className='border border-1 rounded' direction="horizontal" gap={0}>
                            <div className="px-2 p-1 border border-1" style={{backgroundColor:'transparent',borderTopLeftRadius:'.25rem',borderBottomLeftRadius:'.25rem'}}>
                             <small className='text-dark'>Last 3 Years</small>
                             </div>
                            <div className="px-2 p-1 border-1 text-dark" style={{backgroundColor:'transparent'}}>
                            <small>Year to Date</small>
                            </div>
                            <div className="px-2 p-1 text-light" style={{backgroundColor:'#494bbb',borderTopRightRadius:'.25rem',borderBottomRightRadius:'.25rem'}}>
                            <small>Last 12 months</small>
                            </div>
                          </Stack>

                        </div>
                        </div>
                        {/* Task Report START */}
                        <div className='row mt-3 m-0 p-0 border border-0 border-dark'>
                        <div className='col-11 d-flex flex-wrap m-0 p-2 border border-0 border-danger'>
                          {
                             userFeatureData?.hospitalVisitReport.map((item,index)=>{
                              return(
                                <div className='d-flex flex-column flex-wrap p-2 border border-0 border-dark' key={index} style={{flex:1}}>
                                     <p className='mt-2 m-0 p-0 text-muted'>
                                        {item?.hospitalTextLabel}
                                     </p>  
                                     <p className='p-0 mt-2 m-0 text-dark fw-bold fs-5'>
                                        {item?.hospitalTestvelue}
                                     </p>  
                                </div>
                              )
                             })
                          }
                        </div>
                        <div className='col-12 mt-4 m-0 p-0'>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions}/>
                        </div>
                        </div>
                        {/* Task Report END */}
                      </div>
                    </div>
             {/* Hospital report component (END) */}
             {/* Enrollment Trend Report START */}
             <div className='container-fluid mt-4 m-0 p-3 border border-0 border-success bg-white rounded'>
                      <div className='row m-0 p-0 border border-0 border-danger'>
                        <div className='d-flex align-items-center justify-content-between'>
                        <span className='fw-bold text-wrap'>
                          Enrollment Trend
                        </span>
                        <div className='d-flex border border-0 border-danger'>
                        <Dropdown className='mx-3 d-none'>
                      <Dropdown.Toggle className='bg-transparent text-dark d-flex align-items-center justify-content-between outline-none border-0 fs-6 w-100' id="dropdown-basic">
                        enable
                      </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                          <Stack className='border border-1 rounded ' direction="horizontal" gap={0}>
                            <div className="px-2 p-1 border border-1" style={{backgroundColor:'transparent',borderTopLeftRadius:'.25rem',borderBottomLeftRadius:'.25rem'}}>
                             <small className='text-dark'>Last 3 Years</small>
                             </div>
                            <div className="px-2 p-1 border-1 text-dark" style={{backgroundColor:'transparent'}}>
                            <small>Year to Date</small>
                            </div>
                            <div className="px-2 p-1 text-light" style={{backgroundColor:'#494bbb',borderTopRightRadius:'.25rem',borderBottomRightRadius:'.25rem'}}>
                            <small>Last 12 months</small>
                            </div>
                          </Stack>

                        </div>
                        </div>
                        {/* Task Report START */}
                        <div className='row mt-3 m-0 p-0 border border-0 border-dark'>
                        <div className='col-11 d-flex flex-wrap m-0 p-2 border border-0 border-danger'>
                          {
                             userFeatureData?.tasksChartStatsData.map((item,index)=>{
                              return(
                                <div className='d-flex flex-column flex-wrap p-2 border border-0 border-dark' key={index} style={{flex:1}}>
                                     <p className='mt-2 m-0 p-0 text-muted'>
                                        {item?.taskStatLabel}
                                     </p>  
                                     <p className='p-0 mt-2 m-0 text-dark fw-bold fs-5'>
                                        {item?.taskStatValue}
                                     </p>  
                                </div>
                              )
                             })
                          }
                        </div>
                        <div className='col-12 mt-4 m-0 p-0'>
                        <HighchartsReact highcharts={Highcharts} options={chartOptionsEnrollment}/>
                        </div>
                        </div>
                        {/* Task Report END */}
                      </div>
                    </div>
             {/* Enrollment Trend Report END */}
             </div>
          </div>
        </Row>
      </Container>
   </MainHome>
  )
}

export default userFeatures
