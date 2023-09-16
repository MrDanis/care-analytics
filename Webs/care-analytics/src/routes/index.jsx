import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Header from '../components/header'
import Home from '../views/home'
import TcmScreenView from '../views/tcmScreenView'
import UserFeatures from '../views/carePerformance/userFeatures'
import Programe from '../views/programe'
import NewDashboard from '../views/newDashboard/newDashboard'
import Communication from '../views/patientCommunication/communication'
import SpecificProfile from '../views/specificUserProfile/specificProfile'
import Authentication from '../views/authentication'
import {useSelector} from 'react-redux'
import PrivateRoute from './privateRoute'
import { baseClientUrl,clientRoutesEnum } from '../assets/config'
const index = () => {
  const { isLogin } = useSelector((state) => state.authUser);
  console.log('User status is : ',isLogin);
  return (
    <Router>
        {/* <Header/> */}
                 
            <Routes>
            <Route path='/' element={<Authentication/>} />
            <Route path={`/${baseClientUrl}/${clientRoutesEnum?.dashboard}`} element={
            <PrivateRoute isAllowed={isLogin}>
              <NewDashboard/>
            </PrivateRoute>
            }
             />
            <Route path={`/${baseClientUrl}/${clientRoutesEnum?.userFeatures}`} element={
            <PrivateRoute isAllowed={isLogin}>
              <UserFeatures/>
            </PrivateRoute>
            } />
            <Route path={`/${baseClientUrl}/${clientRoutesEnum?.tcmReports}`} element={
             <PrivateRoute isAllowed={isLogin}>
             <TcmScreenView/>
            </PrivateRoute>
            }
            />
            <Route path={`/${baseClientUrl}/${clientRoutesEnum?.programs}`} element={
            <PrivateRoute isAllowed={isLogin}>
             <Programe/>
            </PrivateRoute>
            } />
            <Route path={`/${baseClientUrl}/${clientRoutesEnum?.selectedUserProfile}`} element={
              <PrivateRoute isAllowed={isLogin}>
               <SpecificProfile/>
            </PrivateRoute>               
            }/>
            <Route path={`/${baseClientUrl}/${clientRoutesEnum?.communication}`} element={
            <PrivateRoute isAllowed={isLogin}>
              <Communication/>
            </PrivateRoute>
            } />
            <Route path="*" element={
            <PrivateRoute isAllowed={isLogin}>
             <Authentication/>
            </PrivateRoute>
            } />
            </Routes>
        {/* <Footer/> */}
        </Router>
  )
}

export default index
