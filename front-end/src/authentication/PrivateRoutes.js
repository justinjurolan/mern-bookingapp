import React from 'react';
import { isAuthenticated } from './Authentication';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
