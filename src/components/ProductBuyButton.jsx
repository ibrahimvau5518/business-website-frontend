import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isOutOfStock } from '../utils/productHelpers';
import { AUTH_REQUIRED_MESSAGE } from '../constants/authMessages';

const ProductBuyButton = ({ product, fullWidth = false, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const outOfStock = isOutOfStock(product);
  const targetPath = `/products/${product._id}`;

  const sharedClasses = `font-bold uppercase tracking-wider transition-colors duration-300 ${className}`;

  const handleProtectedClick = (event) => {
    if (isAuthenticated) return;

    event.preventDefault();
    navigate('/register', {
      state: {
        from: { pathname: targetPath },
        message: AUTH_REQUIRED_MESSAGE,
      },
    });
  };

  if (outOfStock) {
    return (
      <button
        type="button"
        disabled
        className={`${sharedClasses} ${
          fullWidth ? 'block w-full text-center' : ''
        } bg-slate-300 text-slate-500 px-4 py-3 rounded-sm text-xs cursor-not-allowed`}
      >
        Out of Stock
      </button>
    );
  }

  return (
    <Link
      to={targetPath}
      onClick={handleProtectedClick}
      className={`${sharedClasses} ${
        fullWidth ? 'block w-full text-center' : ''
      } bg-slate-900 hover:bg-brand text-white px-4 py-3 rounded-sm text-xs`}
    >
      View Details
    </Link>
  );
};

export default ProductBuyButton;