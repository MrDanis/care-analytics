import React,{useState} from 'react'
import { Row } from 'react-bootstrap'
import { colors } from '../assets/colors'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Swal from 'sweetalert2'
const customChart = ({title,type,data,discription,xAxisLabels,chartColors}) => {
  // console.log('Type of the data is : ',type,' and the data is : ',data);
  const options = {
    chart: {
    type: type,
    height:50
    },
    title:'',
    xAxis: {
      categories: xAxisLabels,
    },
    plotOptions: {
      bar:{
        pointWidth:10,
      },
      column: title.includes('Abort')?
      {
        stacking: 'normal',
        dataLabels: {
          enabled: true
      },
      }
      :
      {
        colorByPoint: true, // Colors bars individually
        colors:[colors.chartBarDark, colors.chartBarLight], // Specify custom colors
      }
    },
    series:data,
    };
  //  console.log('Colors of the chart are : ',chartColors);


    const pieChartOptions ={
      chart: {
        type: type,
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
      colors: ['#eeeefc', '#dddefa', '#8fcbf8', '#63b5f6','#42a5f7','#71baf7','#288de8','#207bcb','#bdbef5','#5a5cca','#7071d3','#7a7ceb'],
      series:[{
        data: [
          ['Expire', 3,true],
          ['Admit to IFR', 2,true],
          ['Admit to LTAC', 2,true],
          ['Admit to SNF', 1,true],
          ['Acute to acute transfer', 2,true],
          ['Admit to custodial nursing home', 3,true],
          ['Not an Emergency Admission', 2,true],
          ['Admit to hospice',1,true],
          ['Not an InPatient Admission', 2,true],
          ['Not TCM candidate by protocol', 2,true],
          ['Re-Admit to Facility', 1,true],
          ['Other', 1,true],
        ],
      }]
    };
    const [pieChartConfig,setpieChartConfig] = useState(pieChartOptions);// state for chart config
    const [enableData,setenableData] = useState(data.map((item)=>{ return item.enable = true}));
    // console.log('Enable data is : ',enableData);
    const handleChartUpdate = (data,colorName,isEnable,indexAt) =>{
      if(pieChartConfig.series[0].data.length>1)
      {
        console.log('Data column is : ',pieChartConfig.series[0].data, 'Data is : ',data)
        console.log(pieChartConfig.series[0].data.filter((item)=>  item[0]=== data.name));
        if((pieChartConfig.series[0].data.filter((item)=>  item[0]=== data.name)).length!==0)
        {
          console.log('Here comes in if filter and index is : ',indexAt)
          let filterData = pieChartConfig.series[0].data.filter((item)=>  item[0]!== data.name);
          let filterColor = pieChartConfig.colors.filter((item)=> item!==colorName);
          let testObj = [{data:filterData}]
          console.log('comes in filter','Data : ',testObj,'Color : ',filterColor);
          setpieChartConfig({...pieChartConfig,series:testObj,colors:filterColor});
        }
        else
        {
         
            let updatedData = Object.values(data).map((item)=> item);
            let updateEnableData = pieChartConfig.series[0].data;
            let updaetdColor = pieChartConfig.colors;
            for(let i=updateEnableData.length; i>indexAt; i--)
            {
              updateEnableData[i] = updateEnableData[i-1]; 
              updaetdColor[i] = updaetdColor[i-1];
            }
            updateEnableData[indexAt] = updatedData;
            updaetdColor[indexAt] = chartColors[indexAt];
            let testObj = [{data:updateEnableData}];
            console.log('Here comes in else for update ')
            console.log('Colors Updated : ',updaetdColor,'Data Updated : ',testObj);
            setpieChartConfig({...pieChartConfig,series:testObj,colors:updaetdColor});
        }
      }
      else
      {
        if((pieChartConfig.series[0].data.filter((item)=>  item[0]=== data.name)).length===0)
        {
          let updatedData = Object.values(data).map((item)=> item);
          let updateEnableData = pieChartConfig.series[0].data;
          let updaetdColor = pieChartConfig.colors;
          for(let i=updateEnableData.length; i>indexAt; i--)
          {
            updateEnableData[i] = updateEnableData[i-1]; 
            updaetdColor[i] = updaetdColor[i-1];
          }
          updateEnableData[indexAt] = updatedData;
          updaetdColor[indexAt] = chartColors[indexAt];
          let testObj = [{data:updateEnableData}];
          console.log('Here comes in else for update ')
          console.log('Colors Updated : ',updaetdColor,'Data Updated : ',testObj);
          setpieChartConfig({...pieChartConfig,series:testObj,colors:updaetdColor});
        }
        else
        {
          Swal.fire({
            title: 'Warning!',
            text: 'Can not deselect all Reasons...',
            icon: 'warning',
            showConfirmButton: false,
            timer: 3000
          })
        }
      }
    
    }
  return (
    <Row className='m-0 p-0 rounded border border-1'>
        <div className='col-12 m-0 p-3 border border-0 rounded' style={{backgroundColor:colors.chartHeaderColor}}>
            <span className='text-dark fw-bold'>
                {title}
            </span>
           {/* Chart header */}
        </div>
         <div className='col-12 mt-2 m-0 p-0 border border-0' style={{minHeight:'350px'}}>
         {
          type==='pie'?
          <div className='row m-0 p-0'>
          <div className='col-12 col-md-5 m-0 p-0 border border-0 border-success'>
             <HighchartsReact highcharts={Highcharts} options={pieChartConfig} />
          </div>
          <div className='col-12 col-md-7 m-0 p-0 border border-0 border-danger'>
          {console.log(pieChartConfig.series)}
          {/* {console.log('Chart Data config state is : ',pieChartConfig)} */}
             <div className='d-flex flex-column border border-0 border-success h-100 flex-wrap align-items-start justify-content-start' style={{maxHeight:'400px'}}>
                 {
                  data.map((item,index)=>{
                    return(
                      <p className='p-2 mb-1 d-flex align-items-center justify-content-start' key={index} style={{cursor:'pointer'}} onClick={()=>{handleChartUpdate(item,chartColors[index],enableData[index],index)}}>
                        <span className='border border-1 mx-2 m-0 p-0' style={{width:'14px',height:'14px',borderRadius:'50%',backgroundColor:chartColors[index]}}></span>
                        <span className='m-0 p-0'>
                        {item.name} 
                        </span>
                      </p>
                    )
                  })
                 }
             </div>
             {/* {console.log('data in case of pie chart : ',chartColors,data)} */}
          </div>
          </div>
         :
         <HighchartsReact highcharts={Highcharts} options={options}/>
         }
           {/* chart body*/}
         </div>
         <div className='col-12 m-0 p-0 border border-0'>
           {/* chart footer */}
         </div>
    </Row>
  )
}

export default customChart
