import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/apiService';
import { getProductImage, isOutOfStock, formatProductPrice } from '../utils/productHelpers';
import OutOfStockBadge from './OutOfStockBadge';
import ProductBuyButton from './ProductBuyButton';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load products right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black uppercase text-heading tracking-tight mb-4">Our Featured Products</h2>
        <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          Browse our top-quality selection of crane parts and tarpaulin products.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">{error}</p>
          <Link
            to="/products"
            className="text-brand font-bold uppercase tracking-wide text-sm hover:text-[#2b9690] transition-colors"
          >
            View Products Page
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">No products available yet.</p>
          <Link
            to="/products"
            className="text-brand font-bold uppercase tracking-wide text-sm hover:text-[#2b9690] transition-colors"
          >
            View All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const outOfStock = isOutOfStock(product);
            return (
            <div
              key={product._id}
              className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group ${
                outOfStock ? 'opacity-90' : ''
              }`}
            >
              <div className="relative h-64 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className={`w-full h-full object-contain transition-transform duration-500 ${
                    outOfStock ? 'grayscale opacity-60' : 'transform group-hover:scale-105'
                  }`}
                />
                <div className="absolute top-4 left-4 z-10">
                  {outOfStock && <OutOfStockBadge className="rounded-full" />}
                </div>
                {product.category && (
                  <div className="absolute top-4 right-4 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10">
                    {product.category}
                  </div>
                )}
              </div>
              <div className="p-6">
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-xl font-bold text-heading mb-2 hover:text-brand transition-colors">{product.name}</h3>
                </Link>
                <p className="text-slate-600 mb-4 h-16 overflow-hidden text-sm leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                  <span className="text-2xl font-black text-heading">{formatProductPrice(product)}</span>
                  <ProductBuyButton
                    product={product}
                    className="px-5 py-2 rounded text-sm tracking-wide"
                  />
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      <div className="flex justify-center mt-12">
        <Link to="/products" className="bg-brand hover:bg-[#2b9690] text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default ProductSection;