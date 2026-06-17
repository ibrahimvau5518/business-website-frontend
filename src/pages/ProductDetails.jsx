import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProducts } from '../services/apiService';
import {
  getProductImage,
  isOutOfStock,
  isTarpaulinCategory,
  getProductCategory,
  getCategoryConfig,
  calculateLineTotal,
  getProductUnitPrice,
  formatProductPrice,
  formatTarpaulinBreakdown,
  isValidTarpaulinDimensions,
  getOrderTotal,
} from '../utils/productHelpers';
import OutOfStockBadge from '../components/OutOfStockBadge';
import QuantitySelector from '../components/QuantitySelector';
import TarpaulinSizeInputs from '../components/TarpaulinSizeInputs';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [dimensions, setDimensions] = useState({ length: '', width: '' });

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const found = products?.find((p) => p._id === productId);
        setProduct(found || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDimensionChange = (updates) => {
    setDimensions((prev) => ({ ...prev, ...updates }));
  };

  const handleProceedToCheckout = () => {
    if (!product || isOutOfStock(product)) return;

    const isTarpaulin = isTarpaulinCategory(product);

    if (isTarpaulin && !isValidTarpaulinDimensions(dimensions.length, dimensions.width)) {
      toast.error('Please enter valid length and width greater than 0.');
      return;
    }

    navigate(`/checkout/${product._id}`, {
      state: {
        product,
        quantity: isTarpaulin ? 1 : quantity,
        dimensions: isTarpaulin
          ? { length: Number(dimensions.length), width: Number(dimensions.width) }
          : null,
      },
    });
  };

  if (loading) {
    return (
      <div className="page-shell bg-app-bg flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell bg-app-bg">
        <div className="page-container max-w-2xl text-center">
          <h1 className="text-3xl font-black uppercase text-heading mb-4">Product Not Found</h1>
          <p className="text-slate-600 mb-8">This product does not exist or has been removed.</p>
          <Link
            to="/products"
            className="inline-block bg-brand hover:bg-[#2b9690] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const outOfStock = isOutOfStock(product);
  const isTarpaulin = isTarpaulinCategory(product);
  const category = getProductCategory(product);
  const categoryConfig = getCategoryConfig(product);
  const unitPrice = getProductUnitPrice(product);

  const tarpaulinBreakdown = isTarpaulin
    ? formatTarpaulinBreakdown(product, dimensions.length, dimensions.width)
    : null;

  const totalPrice = getOrderTotal(product, {
    quantity,
    length: dimensions.length,
    width: dimensions.width,
  });

  const canProceed = !outOfStock && (isTarpaulin ? isValidTarpaulinDimensions(dimensions.length, dimensions.width) : true);

  return (
    <div className="page-shell">
      <div className="page-container">
        <nav className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 flex flex-wrap items-center gap-1 sm:gap-0 min-w-0">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <Link to="/products" className="hover:text-brand transition-colors">Products</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-heading font-medium truncate max-w-full">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 min-w-0">
          <div className="form-card min-w-0">
            <div
              className={`relative aspect-square bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-8 border-2 ${categoryConfig.accentClass}`}
            >
              <img
                src={getProductImage(product)}
                alt={product.name}
                className={`max-w-full max-h-full object-contain ${
                  outOfStock ? 'grayscale opacity-60' : ''
                }`}
              />
              {outOfStock && (
                <div className="absolute top-4 left-4">
                  <OutOfStockBadge />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <span
                className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide ${categoryConfig.badgeClass}`}
              >
                {category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-heading uppercase tracking-tight mb-4 break-words">
              {product.name}
            </h1>

            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

            <p className="text-sm text-slate-500 mb-8 border-l-4 border-brand pl-4 italic">
              {categoryConfig.blurb}
            </p>

            <div className="form-card mb-6 sm:mb-8 space-y-5 sm:space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  {isTarpaulin ? 'Rate' : 'Unit Price'}
                </p>
                <p className="text-2xl font-black text-heading">{formatProductPrice(product)}</p>
              </div>

              {!outOfStock && isTarpaulin && (
                <TarpaulinSizeInputs
                  length={dimensions.length}
                  width={dimensions.width}
                  onChange={handleDimensionChange}
                />
              )}

              {!outOfStock && !isTarpaulin && (
                <QuantitySelector quantity={quantity} onChange={setQuantity} />
              )}

              {isTarpaulin && tarpaulinBreakdown && tarpaulinBreakdown.area > 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-sm p-4 space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row justify-between gap-1 text-slate-600">
                    <span>Area</span>
                    <span className="font-semibold text-heading text-right break-words">
                      {dimensions.length}ft × {dimensions.width}ft = {tarpaulinBreakdown.area} sq ft
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 text-slate-600">
                    <span>Rate</span>
                    <span className="font-semibold text-heading text-right">৳{tarpaulinBreakdown.rate.toFixed(2)}/sq ft</span>
                  </div>
                  <div className="flex justify-between gap-2 text-slate-600 border-t border-slate-200 pt-2">
                    <span>Calculation</span>
                    <span className="font-semibold text-heading text-right break-words">
                      {tarpaulinBreakdown.area} × ৳{tarpaulinBreakdown.rate.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Price</p>
                <p className="text-3xl font-black text-brand">
                  {totalPrice > 0 ? `৳${totalPrice.toFixed(2)}` : '—'}
                </p>
                {!isTarpaulin && quantity > 1 && (
                  <p className="text-sm text-slate-500 mt-1">
                    ৳{unitPrice.toFixed(2)} × {quantity}
                  </p>
                )}
                {isTarpaulin && !isValidTarpaulinDimensions(dimensions.length, dimensions.width) && (
                  <p className="text-sm text-slate-400 mt-1">Enter length and width to see total price</p>
                )}
              </div>
            </div>

            {outOfStock ? (
              <button
                type="button"
                disabled
                className="w-full py-4 bg-slate-300 text-slate-500 font-bold uppercase tracking-widest rounded-sm cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={!canProceed}
                className={`w-full py-4 font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md ${
                  canProceed
                    ? 'bg-brand hover:bg-[#2b9690] text-white hover:shadow-brand/30 hover:-translate-y-0.5'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Proceed to Checkout
              </button>
            )}

            <Link
              to="/products"
              className="mt-4 text-center text-sm font-bold uppercase tracking-wide text-slate-500 hover:text-brand transition-colors"
            >
              ← Back to All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;