import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/apiService';
import { getProductImage, isOutOfStock, formatProductPrice } from '../utils/productHelpers';
import OutOfStockBadge from '../components/OutOfStockBadge';
import ProductBuyButton from '../components/ProductBuyButton';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-app-bg pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-heading tracking-tight mb-4 text-center">
            All Products
          </h1>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
            Explore our complete catalog of industrial grade crane parts and premium tarpaulins.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 text-red-700 p-6 rounded-sm border border-red-100 max-w-md mx-auto mb-6">
              <p className="font-semibold mb-1">Could not load products</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand hover:bg-[#2b9690] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg font-medium">No products available yet.</p>
            <p className="text-slate-400 text-sm mt-2">Check back soon for new inventory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
              const outOfStock = isOutOfStock(product);
              return (
              <div
                key={product._id}
                className={`bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group ${
                  outOfStock ? 'opacity-90' : ''
                }`}
              >
                <div className="relative h-56 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-700 ${
                      outOfStock ? 'grayscale opacity-60' : 'transform group-hover:scale-110'
                    }`}
                  />
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {outOfStock && <OutOfStockBadge />}
                  </div>
                  {product.category && (
                    <div className="absolute top-3 right-3 bg-brand/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide z-10">
                      {product.category}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <Link to={`/products/${product._id}`} className="block">
                    <h3 className="text-lg font-bold text-heading mb-2 leading-tight hover:text-brand transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-slate-500 mb-6 text-sm flex-grow line-clamp-3">{product.description}</p>

                  <div className="mt-auto">
                    <div className="text-2xl font-black text-slate-800 mb-4">{formatProductPrice(product)}</div>
                    <ProductBuyButton product={product} fullWidth />
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;