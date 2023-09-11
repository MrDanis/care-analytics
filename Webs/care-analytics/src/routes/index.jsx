import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Header from '../components/header'
import Home from '../views/home'
import TcmScreenView from '../views/tcmScreenView'
import UserFeatures from '../views/userFeatures'
import Programe from '../views/programe'
import NewDashboard from '../views/newDashboard/newDashboard'
import Communication from '../views/patientCommunication/communication'
const index = () => {
  return (
    <Router>
        {/* <Header/> */}
            <Routes>
            <Route path='/' element={<NewDashboard/>} />
            <Route path='/new-dashboard' element={<NewDashboard/>} />
            <Route path='/user-features' element={<UserFeatures/>} />
            <Route path='/tcm-report-view' element={<TcmScreenView/>}/>
            <Route path='/programs' element={<Programe/>} />
            <Route path='/patient-communication' element={<Communication/>} />

            </Routes>
        {/* <Footer/> */}
        </Router>
  )
}

export default index
