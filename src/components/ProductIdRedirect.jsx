import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ProductIdRedirect = () => {
  const { productId, id } = useParams();
  const resolvedId = productId || id;

  return <Navigate to={`/products/${resolvedId}`} replace />;
};

export default ProductIdRedirect;