import React from 'react'
import {Container,Row,Stack} from 'react-bootstrap'
import Sidebar from '../components/sidebar'
// For Sidebar = flex:.05 For Body
const MainHome = ({children}) => {
  return (
    <Container className='m-0 p-0' fluid>
     <Row className='m-0 p-0 border border-0 border-dark' style={{minHeight:'100vh'}}>
      <Stack className='border border-0 border-danger align-items-start m-0 p-0' direction='horizontal'>
        <div className='h-100 m-0 p-0 border border-0 border-danger' style={{maxWidth:'150px'}}>
        <Sidebar/>
        </div>
        <div className='h-100 m-0 p-0 border border-0 border-danger' style={{flex:1,maxHeight:'min-content'}}>
         {children}
        </div>
      </Stack>
        </Row>
    </Container>
  )
}
export default MainHome
