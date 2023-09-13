import React from 'react'
import MainHome from '../../Layout/MainHome'
import {Row,Dropdown,Stack} from 'react-bootstrap'
import {FaUserCircle,FaStarOfLife} from 'react-icons/fa'
import {Link} from 'react-router-dom'
const specificProfile = () => {

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
                              go back
                            </small>
                           </Link>
                           </small>
                           <span>
                            User Profile
                           </span> 
                           <small className='fw-light fs-6'>
                            User based stats specific to user performance
                           </small> 
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

    </div>
  </MainHome>
  )
}

export default specificProfile
