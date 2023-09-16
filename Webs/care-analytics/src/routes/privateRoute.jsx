import React,{Fragment} from 'react'
import { Navigate } from 'react-router-dom';
const privateRoute = ({isAllowed,children}) => {
    console.log('is Allowed : ',isAllowed);
    if(isAllowed)
    {
      return children 
    }
    
    return <Navigate to='/' replace />

}
export default privateRoute
