import React from 'react';
import { Link } from 'react-router-dom';
import { isOutOfStock } from '../utils/productHelpers';

const ProductBuyButton = ({ product, fullWidth = false, className = '' }) => {
  const outOfStock = isOutOfStock(product);

  const sharedClasses = `font-bold uppercase tracking-wider transition-colors duration-300 ${className}`;

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
      to={`/products/${product._id}`}
      className={`${sharedClasses} ${
        fullWidth ? 'block w-full text-center' : ''
      } bg-slate-900 hover:bg-brand text-white px-4 py-3 rounded-sm text-xs`}
    >
      View Details
    </Link>
  );
};

export default ProductBuyButton;