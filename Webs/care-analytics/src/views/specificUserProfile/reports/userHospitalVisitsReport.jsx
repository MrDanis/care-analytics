import React,{useState} from 'react'
import {Dropdown,Stack} from 'react-bootstrap'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const userHospitalVisitsReport = ({hospitalVisitStats}) => {
  const [chartOptions,setchartOptions] = useState({
    chart: {
        type: hospitalVisitStats[0].type,
        height:350
    },
    title: {
        text: ''
    },
    subtitle: {
        // text: 'Source: WorldClimate.com'
    },
    xAxis: {
        categories: hospitalVisitStats[0]?.labels,
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
    series: hospitalVisitStats[0]?.data
});
  return (
    <div className='container-fluid m-0 p-0 border border-0 border-success'>
    <div className='row m-0 p-2 border border-1 rounded bg-white'>
      <div className='col-12 d-flex align-items-center justify-content-between  m-0 p-0'>
          <p className="fw-bold">
             Hospital Visits
          </p>
          <Stack direction="horizontal" gap={0}>
          <Dropdown>
                      <Dropdown.Toggle className='text-dark d-flex align-items-center justify-content-between bg-transparent outline-none border-0 fs-6 w-100' id="dropdown-basic">
                        Enrolled
                      </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                   <div className="px-2 p-1 border border-1" style={{backgroundColor:'#ffffff',borderTopLeftRadius:'.25rem',borderBottomLeftRadius:'.25rem'}}>
                    <small className='text-dark'>Last 3 Years</small>
                    </div>
                   <div className="px-2 p-1 text-dark border border-1" style={{backgroundColor:'#ffffff'}}>
                   <small>Year to Date</small>
                   </div>
                   <div className="px-2 p-1 text-light" style={{backgroundColor:'#494bbb',borderTopRightRadius:'.25rem',borderBottomRightRadius:'.25rem'}}>
                   <small>Last 12 months</small>
                   </div>
          </Stack>
      </div>
      <div className='col-12 m-0 p-0'>
              {console.log('Hospitalization visit data : ',hospitalVisitStats)}
      </div>
      <div className='col-12 m-0 p-2'>
              <div className='d-flex align-items-center m-0 p-0'>
                 {
                  hospitalVisitStats[0]?.hospitalVisitsStats
?.map((item,index)=>{
                        return(
                            <p key={index} className='text-muted mx-4 fw-light'>
                                    {item?.taskStatsLabel}
                                 <p className='text-dark m-0 p-0 fw-bold'> 
                                    {item?.taskStatsValue}
                                </p>
                            </p>
                        )
                      })
                    }
              </div>
        </div>
      <div className='col-12 m-0 p-0'>
        <HighchartsReact highcharts={Highcharts} options={chartOptions}/>
      </div>
    </div>
  </div>
  )
}

export default userHospitalVisitsReport
