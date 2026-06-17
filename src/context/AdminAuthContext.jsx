import { useAuth } from './AuthContext';

// Backward-compatible wrapper around unified role-based auth.
export const useAdminAuth = () => {
  const { user, login, logout, loading, isAdmin } = useAuth();

  return {
    admin: isAdmin ? user : null,
    adminLogin: login,
    adminLogout: logout,
    loading,
    isAdminAuthenticated: isAdmin,
  };
};

export const AdminAuthProvider = ({ children }) => children;