import React,{ useState } from "react"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const readmissionAnalysis = ({colors,type,data,title,discription}) => {
    const [pieChartOptions,setpieChartOptions] = useState({
        chart: {
          type: type,
          height:250
          },
          legend: {
            enabled: false
        },
        title:'',
        plotOptions:{
          pie: {
            innerSize: '75%', // Set the inner size to create a donut chart
            dataLabels: {
              enabled: false, // Show data labels inside the donut chart
              // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
          }
        },
        legend:{
              enabled:true
        },
        colors: colors,
        series:[{
          data: data,
        }]
      })
  return (
    <div className='d-flex flex-column justify-content-center p-3 m-0 border border-0 border-success ' style={{flex:.95}}>
    {/* Cost Benifite Card (Start)*/}
    <p className='mb-2 m-0 p-0 fw-bold text-justify text-wrap px-2' style={{fontSize:'.85rem'}}>
    {title}
    </p>
    <div className='container-fluid m-0 p-0 border border-0 border-success'>
    <HighchartsReact highcharts={Highcharts} options={pieChartOptions}/>
    </div>
    <p className='mt-3 m-0 p-0' style={{fontSize:'.85rem',fontWeight:300}}>
        Analysis preformed on
          <span className='mx-1 m-0 p-0 text-dark fw-bold'>
            {discription?.enrolledPatient}
          </span> 
        Patients who are Enrolled between  
          <span className='text-dark fw-bold m-0 p-0'>
          {discription?.startDate+' '}
          </span>
           and
          <span className='text-dark fw-bold  m-0 p-0'>
           {discription?.endDate+' '}
          </span> 
           for atlest 3 months</p>
    {/* Cost Benifite Card (END)*/}
  </div>
  )
}

export default readmissionAnalysis
