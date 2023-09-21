import React from 'react'
import {Stack,Button} from 'react-bootstrap'
import { Link,useHref,useNavigate } from 'react-router-dom'
import { colors } from '../assets/colors'
import {FaUsers,FaPeopleArrows} from 'react-icons/fa'
import {AiOutlineFolderOpen,AiFillHome} from 'react-icons/ai'
import {BiLogOutCircle} from 'react-icons/bi'
import {MdOutlineSettings} from 'react-icons/md'
import { baseClientUrl,clientRoutesEnum } from '../assets/config'
import { updateUser } from '../Features/UserClice'
import { useSelector, useDispatch } from 'react-redux'
const sidebar = () => {
     const navigate = useNavigate();
     const { isLogin,role } = useSelector((state) => state.authUser);
     const dispatch = useDispatch();  
     const history = useHref();
     const handleLogOut =()=>{
      dispatch(updateUser({isLogin:isLogin?false:true}))
  }
  const handleCreateChatRoomAndNavigate =  ()=>{

    navigate(`/${baseClientUrl}/${clientRoutesEnum?.communication}`,{ replace: true });
  }
  return (
    <div className='customSidebar mt-2 m-0 px-2 p-0 rounded' >
        <Stack className='border border-0 px-1' direction='vertical' gap={4}>
           <Button  variant='ghost' style={{backgroundColor:history.includes('new-dashboard')?colors.mainTemeColor:'transparent'}}>
             <Link to={`/${baseClientUrl}/${clientRoutesEnum?.dashboard}`}>
               <AiOutlineFolderOpen fill={history.includes('new-dashboard')?'white':'black'} color='grey' size={20}/>
             </Link>
           </Button>
           <Button  variant='ghost' style={{backgroundColor:(history.includes('user-features')||history.includes('user-profile'))?colors.mainTemeColor:'transparent'}}>
           <Link to={`/${baseClientUrl}/${clientRoutesEnum?.userFeatures}`}>
              <FaUsers fill={(history.includes('user-features')||history.includes('user-profile'))?'white':'black'} color='white' size={20}/>
           </Link>  
           </Button>
           <Button  variant='ghost' style={{backgroundColor:history.includes('programs')?colors.mainTemeColor:'transparent'}}>
           <Link to={`/${baseClientUrl}/${clientRoutesEnum?.programs}`}>
             <MdOutlineSettings fill={history.includes('programs')?'white':'black'} color='white' size={20}/>
           </Link>
           </Button>
           <Button  variant='ghost' style={{backgroundColor:history.includes('tcm-report-view')?colors.mainTemeColor:'transparent'}}>
           <Link to={`/${baseClientUrl}/${clientRoutesEnum?.tcmReports}`}>
             <AiFillHome fill={history.includes('tcm-report-view')?'white':'black'} color='white' size={20}/>
           </Link>
           </Button>
           <Button  variant='ghost' style={{backgroundColor:history.includes('patient-communication')?colors.mainTemeColor:'transparent'}}>
           <Link to={`/${baseClientUrl}/${clientRoutesEnum?.communication}`}>
             <FaPeopleArrows fill={history.includes('patient-communication')?'white':'black'} color='white' size={20}/>
           </Link>
           </Button>
           <Button onClick={handleLogOut} variant='ghost' style={{backgroundColor:history.includes('patient-communication')?colors.mainTemeColor:'transparent'}}>      
             <BiLogOutCircle fill='black' color='white' size={20}/>
           </Button>
        </Stack>
    </div>
  )
}

export default sidebar
