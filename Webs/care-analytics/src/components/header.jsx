import React from 'react'
import {Container,Navbar,Image} from 'react-bootstrap'
import {HiMenu} from 'react-icons/hi'
import {FaUserCircle} from 'react-icons/fa'
import { colors } from '../assets/colors'
const header = () => {
  return (
    <Navbar className="w-100 m-0 p-0 border border-2 bg-light" sticky='top'>
           <Container fluid className='m-0 py-3 p-0 border border-0 border-success align-items-center justify-content-between'>
            <Navbar.Brand className='m-0 p-0' href="#home">
             <HiMenu fill={colors.mainTemeColor} size={35} className='p-2 mx-2 headerHumberger' style={{border: `1px solid  ${colors.mainTemeColor}`}}/>
             <Image height={40} className='mx-2' src='https://ddm.wmi360.com/360CareAnalytics/360CareAnalytics/img/360CareAnalytics.svg'/>
            </Navbar.Brand>
            <Navbar.Brand className='m-0 p-0' href="#home">
              <small>
                Demo User
              </small>
             <FaUserCircle fill={colors.mainTemeColor} size={40} className='p-2 mx-2 headerHumberger' style={{}}/>
            </Navbar.Brand>
           </Container>
   </Navbar>
  )
}

export default header
