import React,{useState} from 'react'
import {Stack} from 'react-bootstrap'

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const pcpVisitsReport = ({title,data,xAxisLabels,type}) => {
    const [chartOptions,setchartOptions] = useState({
        chart: {
            type: type,
            height:350
        },
        title: {
            text: ''
        },
        subtitle: {
            // text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: xAxisLabels,
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
        series: data
    });
  return (
    <div className='col-12 m-0 p-2 bg-white commonBorder'>
            <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-2 m-0 p-0 fw-bold text-justify text-wrap px-2'>
                   {title}
                </p>
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
      <HighchartsReact highcharts={Highcharts} options={chartOptions}/>
   </div>
  )
}

export default pcpVisitsReport
