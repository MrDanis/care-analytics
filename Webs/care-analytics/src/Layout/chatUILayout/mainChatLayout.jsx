import React,{useState} from 'react'
import MainHome from '../MainHome'
import ChatMessages from './chatMessagesLayout/chatMessages'
import {Image} from 'react-bootstrap'
import userIcon from '../../assets/profile.png'
import NoData from '../../assets/NoChat.png'
import {HiSearch} from 'react-icons/hi'
import { chatData } from '../../data/ChatData'
const mainChatLayout = () => {
    const [selectedUser,setselectedUser] = useState({});
    const handleSelectedUser = (data)=>{
        console.log('Selected user data is : ',data);
        setselectedUser(data);
    }
  return (
    <MainHome>
    <div className='conatiner-fluid m-0 p-0 border border-0 border-success h-100'>
         <div className='row m-0 px-0 p-0 border border-0 border-danger h-100'>
             <div className='col-md-2 m-0 px-2 p-0 chatBoxLeftSide'>
               
              {/* User Profile Details (START)*/}
                <div className='d-flex align-items-center p-2 m-0 userProfileDataBox'>
                <Image  src={userIcon} roundedCircle style={{width:'40px',height:'40px'}}/>
                <p className='mx-2 mt-3'>My Profile</p>
                </div> 
              {/* User Profile Details (END)*/}
              {/* Search and List box (START) */}
                       <div className='w-100 d-flex align-items-center py-1 p-2 border border-1 rounded-pill bg-white userContactSearchBox'>
                        <HiSearch size={20}/>
                         <input className='w-100 text-wrap m-0 px-2 p-0 border-0 outline-none fs-6' placeholder='search friend...' style={{fontSize:'.5rem'}}/>
                       </div>
                 <div className='m-0 p-0 w-100 d-flex flex-column  userContactBox'>
                    {/* User Contacts Search (START)*/}
                    {/* User Contacts Search (END)*/}
                   {/* User Contacts List (START)*/}
                   {
                    chatData?.userContacts.map((item,index)=>{
                        return(
                          <div key={item} className='mt-3 w-100 d-flex align-items-start justify-content-evenly userContactList border-dnger m-0 p-0' onClick={()=>{handleSelectedUser(item)}}>
                          <Image  src={userIcon} roundedCircle style={{width:'35px',height:'35px'}}/>
                          <p className='px-1 text-wrap d-flex flex-column'>
                             <span className='m-0 p-0' style={{fontSize:'.85rem'}}>{item?.contactName}</span>
                             <small className='text-muted m-0 p-0' style={{fontSize:'.75rem'}}>{item?.contactDiscription}</small>
                           </p>   
                           <p className='d-flex flex-column justify-content-between h-100'>
                              <small className='text-end mt-2' style={{fontSize:'.5rem'}}>10:23 am</small>
                              {/* <small className='text-end' style={{fontSize:'.65rem'}}>1</small> */}
                           </p>
                          </div>

                        )
                    })
                   } 
                   {/* User Contacts List (END)*/}
                      
                 </div>
              {/* Search and List box (END) */}
             </div>
             <div className='col-md-8 m-0 p-0'>
             {console.log('No data to show : ',Object.keys(selectedUser).length===0)}
             {
                (Object.keys(selectedUser).length===0)?
                <div className='m-0 p-0 h-100 border border-0 border-success d-flex flex-column align-items-center justify-content-center'>
                <Image  src={NoData} style={{width:'440px',height:'440px'}} fluid/>
                <p className='text-dark fw-bold'>
                 Please selet any patient to start chat with
                </p>
                </div>:<ChatMessages data={selectedUser}/>
             }
             </div>
             <div className='col-md-2 m-0 p-0 d-flex align-items-start justify-content-center chatBoxRightSide'>
             {
                (Object.keys(selectedUser).length===0)?
                <div className='d-flex h-100 align-items-center justify-content-center'> 
                 <p className='text-center'>No patient is seleted yet</p>
                </div>:
               <div className="d-flex flex-column align-items-center justify-content-center mt-3 border border-0 border-success">
               <Image  src={userIcon} roundedCircle style={{width:'70px',height:'70px'}}/>
                 <p className='mt-2'>
                   {selectedUser?.contactName}
                 </p>
               </div>
             }
             </div>
         </div>      
    </div>
    </MainHome>
  )
}

export default mainChatLayout
