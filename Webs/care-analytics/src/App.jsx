import { useState,Fragment,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Index from './routes';
import socketIO from "socket.io-client";
import { useDispatch } from 'react-redux';
import { getSocket } from './Features/UserClice';
const socket = socketIO.connect("http://localhost:7000")
function App() {
  const dispatch = useDispatch();
  // console.log('Socket is : ',socket);
  const [count, setCount] = useState(0)
  useEffect(()=>{
    dispatch(getSocket({socket:socket}))
  },[])
  return (
    <Index />
  )
}

export default App
