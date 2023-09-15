import React from 'react'
import {Stack,Button} from 'react-bootstrap'
import { Link,useHref } from 'react-router-dom'
import { colors } from '../assets/colors'
import {FaUsers,FaPeopleArrows} from 'react-icons/fa'
import {AiOutlineFolderOpen,AiFillHome} from 'react-icons/ai'
import {MdOutlineSettings} from 'react-icons/md'
const sidebar = () => {
     const history = useHref();
  return (
    <div className='customSidebar mt-2 m-0 px-2 p-0 rounded' >
        <Stack className='border border-0 px-1' direction='vertical' gap={4}>
           <Button  variant='ghost' style={{backgroundColor:history.length===1?colors.mainTemeColor:'transparent'}}>
             <Link to='/'>
               <AiOutlineFolderOpen fill={history.length===1?'white':'black'} color='grey' size={20}/>
             </Link>
           </Button>
           <Button  variant='ghost' style={{backgroundColor:history.includes('user-features')?colors.mainTemeColor:'transparent'}}>
           <Link to='/user-features'>
              <FaUsers fill={history.includes('user-features')?'white':'black'} color='white' size={20}/>
           </Link>  
           </Button>
           <Button  variant='ghost' style={{backgroundColor:history.includes('programs')?colors.mainTemeColor:'transparent'}}>
           <Link to='/programs'>
             <MdOutlineSettings fill={history.includes('programs')?'white':'black'} color='white' size={20}/>
           </Link>
           </Button>
           <Button  variant='ghost' style={{backgroundColor:history.includes('tcm-report-view')?colors.mainTemeColor:'transparent'}}>
           <Link to='/tcm-report-view'>
             <AiFillHome fill={history.includes('tcm-report-view')?'white':'black'} color='white' size={20}/>
           </Link>
           </Button>
           <Button  variant='ghost' style={{backgroundColor:history.includes('patient-communication')?colors.mainTemeColor:'transparent'}}>
           <Link to='/patient-communication'>
             <FaPeopleArrows fill={history.includes('patient-communication')?'white':'black'} color='white' size={20}/>
           </Link>
           </Button>
        </Stack>
    </div>
  )
}

export default sidebar
