import React,{useState} from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const enrollmentCountReport = ({title,data,xAxisLabels,type}) => {
    const [chartOptionsEnrollment,setchartOptionsEnrollment] = useState({
        chart: {
            type: type,
            backgroundColor: 'rgba(0,0,0,0)',
            height:150
        },
        legend: {
            enabled: false, // Disable the legend
          },
        title: {
            text: ''
        },
        subtitle: {
            // text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: xAxisLabels,
            scrollbar: {
                enabled: true, // Enable the scrollbar on the xAxis
                showFull: false, // Show only a portion of the scrollbar initially
                liveRedraw: true, 
              },
              lineWidth: 0,
              lineColor: 'transparent'
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
            },
            series:{
                color:'rgb(190,209,212)'
            }
        },
        series: data,
        scrollablePlotArea: {
            minWidth: 400, // Set the minimum width for the scrollable plot area
          },
      })
  return (
    <div className='m-0 p-0 border border-0 border-warning rounded' style={{flex:1,backgroundColor:'#ddeff8'}}>
    <p className='mb-2 mt-2 m-0 px-3 p-2 fw-bold text-justify text-wrap px-2'>
       {title}
    </p>
     <HighchartsReact highcharts={Highcharts} options={chartOptionsEnrollment}/>
    </div>     
  )
}

export default enrollmentCountReport
