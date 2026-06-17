import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg pt-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login?redirect=/admin" state={{ from: location, adminRequired: true }} replace />;
  }

  return children;
};

export default AdminRoute;