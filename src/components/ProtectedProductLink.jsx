import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH_REQUIRED_MESSAGE } from '../constants/authMessages';

const ProtectedProductLink = ({ productId, children, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const targetPath = `/products/${productId}`;

  const handleClick = (event) => {
    if (isAuthenticated) return;

    event.preventDefault();
    navigate('/register', {
      state: {
        from: { pathname: targetPath },
        message: AUTH_REQUIRED_MESSAGE,
      },
    });
  };

  return (
    <Link to={targetPath} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default ProtectedProductLink;