import React,{useEffect,useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../Features/UserClice'
import { useNavigate } from 'react-router-dom'
import { baseClientUrl,clientRoutesEnum } from '../assets/config'
import { Image } from 'react-bootstrap'
import Logo from '../assets/undraw_secure_login_pdn4.svg'
import Swal from 'sweetalert2'
const authentication = () => {
    const navigate = useNavigate();
    const userName = useRef(null)
    const { isLogin,role } = useSelector((state) => state.authUser);
    const dispatch = useDispatch();   
    const handleLogin =()=>{
      const userNameIS = userName.current.value;
      console.log('Value is : ',userNameIS==='');
      if(userNameIS==='')
      {
        Swal.fire({
          title: 'Authentication Faild!',
          text: 'Please provide the user name...',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000
        })
      }
      else{
        dispatch(updateUser({isLogin:isLogin?false:true,userName:userNameIS}));
      }
    }
    useEffect(()=>{
      if(isLogin)
      {
        navigate(`/${baseClientUrl}/${clientRoutesEnum?.dashboard}`);
      }
    },[isLogin])
return (

    <div className='container-fluid m-0 p-0 border border-0 border-success' >
        <div className='row m-0 p-0 border-danger' style={{minHeight:'100vh'}}>
              <div className='col-12 col-md-6 m-0 p-0 d-flex flex-column align-items-center justify-content-center leftLoginBox'>
                       <h1 className='text-center mt-3 p-2 text-light'>
                            Wellcome <p className='my-1'> to </p>  Data Q
                       </h1>
                       <input className='bg-transparent outline-none my-3 py-2 p-3 shadow text-light w-50 fs-6 customInput' placeholder='Please enter your name ....' ref={userName} />
                       <button onClick={handleLogin} className='mt-4 w-25 d-flex align-items-center justify-content-center btn btn-primary px-4 rounded-pill m-0 shadow text-light text-wrap'>
                               Login please !
                       </button>
              </div>
              <div className='col-12 col-md-6 m-0 p-0 d-flex align-items-center justify-content-center bg-primary'>
                  <Image className='m-0 p-0' src={Logo} fluid width={320} height={320}/>

                   {/* <image className='img-fluid m-0 p-0 border border-0 border-danger' src={Logo} style={{height:'250px',width:'250px'}} alt='img-not-found'/> */}
              </div>
        </div>      
    </div>
  )
}

export default authentication
