import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import { loginUser, registerUser, googleLoginUser } from '../services/apiService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

const persistAuth = (data) => {
  localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
};

const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setSession = useCallback((authData) => {
    persistAuth(authData);
    setUser(authData.user);
    return authData;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        clearAuth();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      return setSession(data);
    } catch (backendError) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const data = await registerUser({
          name: credential.user.displayName || 'User',
          email,
          password,
        });
        return setSession(data);
      } catch (syncError) {
        if (syncError.response?.status === 400) {
          const data = await loginUser({ email, password });
          return setSession(data);
        }
        throw backendError;
      }
    }
  };

  const register = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });

    try {
      const data = await registerUser({ name, email, password });
      return setSession(data);
    } catch (backendError) {
      await signOut(auth);
      throw backendError;
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    const data = await googleLoginUser(token);
    return setSession(data);
  };

  const logout = async () => {
    clearAuth();
    setUser(null);
    try {
      await signOut(auth);
    } catch {
      // Firebase session may not exist for backend-only logins.
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        googleLogin,
        logout,
        loading,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};