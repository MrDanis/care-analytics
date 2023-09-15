import React from 'react'
import {Container,Row,Stack} from 'react-bootstrap'
import Sidebar from '../components/sidebar'
const MainHome = ({children}) => {
  return (
    <Container className='m-0 p-0' fluid>
     <Row className='m-0 p-0 border border-0 border-dark' style={{minHeight:'100vh'}}>
      <Stack className='border border-0 border-danger align-items-start m-0 p-0' direction='horizontal'>
        <div className='h-100 m-0 p-0 border border-0 border-danger' style={{flex:.05}}>
        <Sidebar/>
        </div>
        <div className='h-100 m-0 p-0 border border-0 border-dark' style={{flex:.95,maxHeight:'min-content'}}>
         {children}
        </div>
      </Stack>
        {/* <div className='d-flex flex-wrap m-0 p-0 border border-1 shadow' style={{maxWidth:'70px'}}>
           <div className='w-100 d-flex justify-content-center m-0 p-2 border border-0 border-success'>
              <Sidebar/>
           </div>
        </div>
        <div className='border border-2 border-danger m-0 p-0' style={{flex:.6}}>
            {children}
        </div> */}
        </Row>
    </Container>
  )
}
export default MainHome
