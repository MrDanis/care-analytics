import React,{useState} from 'react'
import CustomChart from '../components/customChart'
import {Container,Row,Dropdown,Form,ToggleButton} from 'react-bootstrap'
import {FaInfoCircle} from 'react-icons/fa'
import {GoDotFill} from 'react-icons/go'
import { colors } from '../assets/colors'
import { chartData,tcmChartData } from '../data/homePageCharts'
import { UpdateMultiSelectData } from '../Features/UserClice'
import { useSelector, useDispatch } from 'react-redux'
import MainHome from '../Layout/MainHome'
const tcmScreenView = () => {
    const { multiSelectData,userRole,loading } = useSelector((state) => state.authUser);
    const dispatch = useDispatch();
    const [selectedIndex,setselectedIndex] = useState(0);
    console.log('Data for the Aco List : ',multiSelectData);
  return (
    <MainHome>
    <div className='w-100 border border-0 border-success m-0 p-0 px-2'>
       {/* Dropdowns (Start) */}
        <Row className='py-3 px-2 d-none'>
          <div className='col-12 m-0 px-2 p-0'>
              {/* 1st select menu for the ACO selection start */}
              <div className='w-50 mt-3 d-flex flex-wrap border border-0 border-success'>
              <div className='p-1 m-0 d-flex flex-column border border-0 border-danger' style={{flex:1}}>
                 <span className='mb-1 fw-bold'>
                     ACO
                 </span>
                 <Dropdown autoClose="outside">
                   <Dropdown.Toggle className='border border-1 w-100' variant="ghost" id="dropdown-basic">
                     {
                      multiSelectData&&multiSelectData[selectedIndex===null?0:selectedIndex]?.parentText
                      // 'Choose ACO'
                     }  
                     {
                      console.log(multiSelectData[0]?.child)
                     }
                   </Dropdown.Toggle>
             
                   <Dropdown.Menu className='border border-1' style={{height:'17vh'}}>
                      <div className='d-flex justify-content-center w-100'>
                      <div className='w-50 d-flex flex-column flex-wrap border border-0 border-danger'>
                      {
                          multiSelectData&&multiSelectData?.map((item,index)=>{
                            return(
                               <Dropdown.Item onClick={(eventkey)=>{
                                  setselectedIndex(index)
                               }} className={`bg-transparent border border-0 px-1 border-success d-flex flex-wrap`} key={item?.parentId} href="#/action-1">
                                  <div className={`rounded w-100 flex-wrap px-1 mb-0 ${selectedIndex === index?'bg-light border border-1':'bg-transparent'}`}>
                                   <ToggleButton
                                     className='text-dark border border-0 border-success m-0 p-0'
                                    name="radioGroup" 
                                    type="radio"
                                    id={item?.parentId}
                                    style={{fontSize:'.65rem'}}
                                    variant='ghost'
                                   >
                                     <p className='border border-0 border-danger text-wrap text-start m-0 p-0'>
                                       {item?.parentText}
                                     </p>
                                     </ToggleButton>
                                   {/* <Form.Check // prettier-ignore
                                    className='text-wrap w-100 shadow-none outline-none'
                                    name="radioGroup" 
                                    type={'radio'}
                                    id={item?.parentId}
                                    
                                    label={`${item?.parentText}`}
                                    style={{fontSize:'.65rem'}}
                                   /> */}
                                    {/* <Form.Check onChange={()=>{ handleRegister(0)}} type="radio" label={`${item?.parentText}`} name="radioGroup" id="radio1" />  */}
                                  </div>
                                  
                               </Dropdown.Item>          
                            )
                          })
                        }
                      </div>
                      <div className='w-50 border border-0 border-success d-flex flex-column'>

                        {
                         selectedIndex===null?null:multiSelectData&&multiSelectData[selectedIndex]?.child?.map((item,index)=>{
                            return(
                               <Dropdown.Item className='p-0' key={index} href="#/action-1">
                                  <div className='border border-0 px-1 border-danger d-flex w-100 flex-wrap'>
                                   <Form.Check // prettier-ignore
                                    onChange={()=>{dispatch(UpdateMultiSelectData({parentId:multiSelectData[selectedIndex]?.parentId,childId:item?.childId}))}}
                                    className='text-wrap w-100'
                                    //   name='radioGroup'
                                    type={'checkbox'}
                                    checked={item?.isChildActive}
                                    id={item?.id}
                                    label={`${item?.childText}`}
                                    style={{fontSize:'.65rem'}}
                                   />

                                  </div>
                               </Dropdown.Item>          
                            )
                          })
                        }
                      </div>
                         
                      </div>

                     {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                     <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                     <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                   </Dropdown.Menu>
                 </Dropdown>
                 {/* <select className='m-0 p-1 border border-1 rounded outline-none box-shadow-none' placeholder='PHO MSSP'>
                  <option>
                    PHO MSSP
                  </option>
                  <option>
                    PHO MSSP
                  </option>
                  <option>
                    PHO MSSP
                  </option>
                  <option>
                    PHO MSSP
                  </option>
                 </select> */}
              </div>
               {/*2nd select menu for program (START)*/}
              <div className='px-3 p-1 m-0 d-flex flex-column border border-0 border-danger'style={{flex:1}}>
                 <span className='mb-1 fw-bold'>
                     Program
                 </span>
                 <select className='m-0 p-2 border border-1 rounded outline-none box-shadow-none' placeholder='PHO MSSP'>
                  <option>
                    PHO MSSP
                  </option>
                  <option>
                    PHO MSSP
                  </option>
                  <option>
                    PHO MSSP
                  </option>
                  <option>
                    PHO MSSP
                  </option>
                 </select>
              </div> 
               {/*2nd select menu for program (END)*/}
               
              </div>
          </div>     
      </Row>
      {/* Dropdowns (End) */}
      {/* Stats (start) */}
      <Row className='my-4 m-0 border border-0 border-danger px-2 d-none'>
          <div className='col-12 col-md-7 m-0 p-0 d-flex align-items-center border border-1'>
             {/* Stats Card Display Here  */}
             <div className='w-100 d-flex align-items-center m-0 p-2 border border-0 '>
                <div className='d-flex flex-column align-items-center justify-content-center border border-0 border-dark' style={{flex:1}}>
                       <span className='fs-4 text-dark fw-bold'>
                          9,503
                       </span>
                       <samll className="text-muted mt-1 m-0 p-0" style={{fontSize:'.85rem'}}>
                      <GoDotFill className='mx-1' fill={`${colors.primaryColor}`} size={15}/>Patients</samll>
                </div>
                <div className='d-flex flex-column align-items-center flex-strech border border-0 border-dark' style={{flex:1}}>
                       <span className='fs-4 text-dark fw-bold'>
                          1,400
                       </span>
                       <samll className="text-muted mt-1 m-0 p-0" style={{fontSize:'.85rem'}}>
                      <GoDotFill className='mx-1' fill={`${colors.primaryColor}`} size={15}/>Eligible</samll>
                </div>
                <div className='d-flex flex-column align-items-center justify-content-center flex-strech border border-0 border-dark' style={{flex:1}}>
                       <span className='fs-4 text-dark fw-bold'>
                          222
                       </span>
                       <samll className="text-muted mt-1 m-0 p-0" style={{fontSize:'.65rem'}}>
                      <GoDotFill className='mx-1' fill={`${colors.primaryColor}`} size={15}/>Enrolled</samll>
                </div>
                <div className='d-flex flex-column align-items-center justify-content-center flex-strech border border-2 border-dark' style={{flex:2}}>
                       <span className='fs-4 text-dark fw-bold'>
                          222
                       </span>
                       <samll className="text-muted mt-1 m-0 p-0" style={{fontSize:'.65rem'}}>
                      <GoDotFill className='mx-1' fill={`${colors.primaryColor}`} size={15}/>Enrolled</samll>
                </div>
             </div>
          </div>
          <div className='col-12 col-md-5 m-0 p-0 d-flex align-items-center justify-content-center border border-0 border-danger'>
             {/* Stats Card Display Here  */}
              <div className='w-100 d-flex flex-wrap m-0 p-2 border border-1'>
                  <div className='d-flex align-items-center justify-content-center flex-wrap m-0 p-0 flex-column' style={{flex:1}}>
                      <span className='m-0 p-0'>
                         <small className=' m-0 px-1 p-0 text-muted'>Readmisison Avoided</small>
                         <FaInfoCircle size={20}/>
                      </span>
                      <span className='text-dark fs-3 fw-bold'>
                          Upto 0%    
                      </span>
                      <small className='text-muted' style={{fontSize:'.65rem'}}>
                         In Last 12 months
                      </small>  
                  </div>
                  <div className='d-flex flex-wrap align-items-center justify-content-center  m-0 p-0 flex-column' style={{flex:1}}>
                      <span className='m-0 p-0'>
                         <small className=' m-0 px-1 p-0 text-muted'>Approx. Cost Savings PMPM </small>
                         <FaInfoCircle size={20}/>
                      </span>
                      <span className='text-dark fs-3 fw-bold'>
                          Upto $708%    
                      </span>
                      <small className='text-muted' style={{fontSize:'.65rem'}}>
                         In Last 12 months
                      </small>  
                  </div>
              </div>
          </div>
      </Row>
      {/* Stats (end) */}
      {/* Chart (start) */}
      <Row className='border border-0 border-success m-0 p-0'>
         {
            tcmChartData&&tcmChartData?.map((item,index)=>{
              return(
                  <div key={item?.id} 
                  className={`col-12 ${item.id===3?'col-md-12 border border-0 border-dark':'col-md-12'} m-0 px-0 p-3`}>
                       <Container className='m-0 p-0 border border-0 border-success px-2' fluid>
                       {
                           item.chartType === 'pie'?
                       <CustomChart
                             title={item?.chartTitle}
                             type={item?.chartType}
                             discription={item?.chartDiscription}
                             data={item?.data}
                             xAxisLabels={item?.labels}
                             chartColors={item?.colors}
                            //  dataLabels={item.labels}
                            />                      
                       :
                       <CustomChart
                             title={item?.chartTitle}
                             type={item?.chartType}
                             discription={item?.chartDiscription}
                             data={item?.data}
                             xAxisLabels={item?.labels}
                            />
                       }
                       </Container>                         
                  </div>
              )
           })
         } 
      </Row>
      {/* Chart (end) */}
  </div>
</MainHome>
  )
}

export default tcmScreenView
