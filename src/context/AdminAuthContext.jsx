import React, { createContext, useState, useEffect, useContext } from 'react';
import { adminLogin as adminLoginApi } from '../services/apiService';

const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_USER_KEY = 'adminUser';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const storedAdmin = localStorage.getItem(ADMIN_USER_KEY);

    if (token && storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    const data = await adminLoginApi({ email, password });
    const adminUser = { _id: data._id, email: data.email };

    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUser));
    setAdmin(adminUser);

    return adminUser;
  };

  const adminLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, adminLogin, adminLogout, loading, isAdminAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};