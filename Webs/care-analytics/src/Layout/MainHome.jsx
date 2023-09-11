import React from 'react'
import {Container,Row} from 'react-bootstrap'
import Sidebar from '../components/sidebar'
const MainHome = ({children}) => {
  return (
    <Container className='m-0 p-0' fluid>
     <Row className='m-0 p-0 border border-0 border-dark' style={{minHeight:'100vh'}}>
        <div className='d-flex flex-wrap m-0 p-0 border border-1 shadow' style={{maxWidth:'70px'}}>
           <div className='w-100 d-flex justify-content-center m-0 p-2 border border-0 border-success'>
              <Sidebar/>
           </div>
        </div>
        <div className='border border-0 border-danger m-0 p-0' style={{flex:1}}>
            {children}
        </div>
        </Row>
    </Container>
  )
}
export default MainHome
