import React,{useState} from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const hospitalizationReport = ({title,data,xAxisLabels,type}) => {
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
    <div className='p-3 m-0 border border-0 border-success' style={{flex:3.05}}>
    <p className='mb-2 m-0 p-0 fw-bold text-justify text-wrap px-2' style={{fontSize:'.85rem'}}>
        Hospitalizations
    </p>
      <HighchartsReact highcharts={Highcharts} options={chartOptions}/>

    </div>
  )
}

export default hospitalizationReport
