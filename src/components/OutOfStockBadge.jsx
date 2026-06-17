import React from 'react';

const OutOfStockBadge = ({ className = '' }) => (
  <span
    className={`inline-flex items-center bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide ${className}`}
  >
    Out of Stock
  </span>
);

export default OutOfStockBadge;