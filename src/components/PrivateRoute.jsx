import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';

function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <h3>loading</h3>;
  }
  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
}

export default PrivateRoute;
