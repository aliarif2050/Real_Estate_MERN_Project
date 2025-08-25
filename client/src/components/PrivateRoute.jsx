import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom';

const PrivateRoute = () => {
    const { user } = useSelector((state) => state.user);
  return (
    <div>{user ? <Outlet/> : <Navigate to='/sign-in'/>}</div>
  )
}

export default PrivateRoute