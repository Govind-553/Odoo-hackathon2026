import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return allowedRoles.includes(user?.role) ? <Outlet /> : <Navigate to="/" />;
};

export default RoleRoute;
