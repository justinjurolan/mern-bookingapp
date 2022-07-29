import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './Authentication';

const AdminRoutes = () => {
  return isAuthenticated() && isAuthenticated().user.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/signup" />
  );
};

export default AdminRoutes;
