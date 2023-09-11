import { useState,Fragment } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Index from './routes';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Index />
  )
}

export default App
