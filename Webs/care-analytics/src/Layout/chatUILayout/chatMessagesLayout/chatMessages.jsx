import React,{useEffect,useRef} from 'react'
import {Image} from 'react-bootstrap'
import userIcon from '../../../assets/profile.png'
import {RiSendPlaneFill} from 'react-icons/ri'
import { senMessageToUser } from '../../../Features/UserClice'
import { useDispatch } from 'react-redux'
const chatMessages = ({data}) => {
    const dispatch = useDispatch();
    const messageIs = useRef(null);
    const handleSendMessage = ()=>{
      const userMessageIs = messageIs.current.value;
      dispatch(senMessageToUser({message:userMessageIs}));
      console.log('User Message is : ',userMessageIs);
    }
    useEffect(()=>{
      console.log('Data comming from the parent is : ',data);
        handleScrollToTop();
    },[data])
    const handleScrollToTop = () =>{
     const chatContainer = document.querySelector('.myChatBox');
     chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  return (
    <div className='container-fluid m-0 px-3 p-0 border border-0 border-success h-100 bg-white'>
       <div className='row m-0 p-0 h-100'>
          <div className='d-flex flex-column m-0 p-0 border border-0 border-dark '>
            {/* Current Selected user Data card (START)*/}
            <div className='d-flex m-0 p-2 myChatBoxHeader' style={{height:'10vh'}}>
              <Image  src={userIcon} roundedCircle style={{width:'40px',height:'40px'}}/>
              <p className='mx-3 m-0 p-0 border border-0 border-danger'>{data?.contactName}</p>
            </div>
            {/* Current Selected user Data card (END)*/}
            {/* Chat Messaging body (START)*/}
            <div className='d-flex flex-column m-0 p-2 border border-0 border-warning myChatBox'>
              {
                data?.chatHistory?.map((item,index)=>{
                    return(
                        <div className={item?.isIncomming?'senderBox w-50 m-0 p-0':'reciverBox w-50 m-0 p-0'}>
                            <div className='myChat d-flex align-items-end mb-2 border border-0 border-danger m-0 p-0'>
                              <Image  src={userIcon} roundedCircle style={{width:'30px'}}/>
                                <p className='text-wrap py-2 shadow p-2 mx-2 mb-1' key={item}>
                                   <small className=''>
                                     {item?.messageText}
                                   </small> 
                                </p>
                            </div>    
                        </div>

                    )
                })
              }
            </div>
            {/* Chat Messaging body (END)*/}
            {/* Current Selected user Data card (START)*/}
            <div className='d-flex align-items-center m-0 px-4 p-2 myChatBoxFooter' style={{height:'10vh'}}>
                <div className='d-flex align-items-center justify-content-between w-100 rounded-pill m-0 px-3 p-2 chatBoxMesageSend'>
                    <input className='mx-2 m-0 p-0 w-100 border-0 bg-transparent outline-none text-wrap fs-6 textMessage' placeholder='Write something here .....' ref={messageIs}/>
                    <RiSendPlaneFill fill='white' size={30} className='m-0 p-1 d-flex align-items-center justify-content-center bg-primary rounded-pill sendMessageButton' onClick={handleSendMessage}/>
                </div>
            </div>
            {/* Current Selected user Data card (END)*/}
          </div>
          
          
       </div>
    </div>
  )
}

export default chatMessages
