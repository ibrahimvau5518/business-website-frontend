import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/admin" state={{ from: location, adminRequired: true }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" state={{ forbidden: 'admin' }} replace />;
  }

  return children;
};

export default AdminRoute;