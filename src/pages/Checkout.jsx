import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, createOrder } from '../services/apiService';
import {
  getProductImage,
  isOutOfStock,
  isTarpaulinCategory,
  getProductCategory,
  formatProductPrice,
  getOrderTotal,
  formatOrderProductName,
  formatTarpaulinBreakdown,
  isValidTarpaulinDimensions,
  buildOrderPayload,
} from '../utils/productHelpers';
import OutOfStockBadge from '../components/OutOfStockBadge';

const BKASH_NUMBER = import.meta.env.VITE_BKASH_NUMBER || '01827195518';

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [dimensions, setDimensions] = useState(location.state?.dimensions || null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    transactionId: '',
  });

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => (prev.name ? prev : { ...prev, name: user.name }));
    }
  }, [user?.name]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const found = products?.find((p) => p._id === productId);
        setProduct(found || null);
      } catch {
        if (!location.state?.product) {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, location.state?.product]);

  useEffect(() => {
    if (location.state?.quantity) {
      setQuantity(Math.max(1, Number(location.state.quantity)));
    }
    if (location.state?.dimensions) {
      setDimensions(location.state.dimensions);
    }
  }, [location.state?.quantity, location.state?.dimensions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product || isOutOfStock(product)) return;

    setSubmitting(true);
    setStatus(null);
    setErrorMessage('');

    const orderData = buildOrderPayload(product, formData, {
      quantity,
      length: dimensions?.length,
      width: dimensions?.width,
    });

    try {
      await createOrder(orderData);
      setPlacedOrder({ customerName: formData.name });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err.response?.status === 401) {
        setErrorMessage('Your session has expired. Please log in again to place your order.');
        return;
      }
      setErrorMessage(
        err.response?.data?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg pt-32 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-app-bg pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-black uppercase text-heading mb-4">Product Not Found</h1>
          <p className="text-slate-600 mb-8">The product you are trying to checkout does not exist.</p>
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

  const isTarpaulin = product && isTarpaulinCategory(product);

  const totalPrice = product
    ? getOrderTotal(product, {
        quantity,
        length: dimensions?.length,
        width: dimensions?.width,
      })
    : 0;

  const tarpaulinBreakdown =
    isTarpaulin && dimensions
      ? formatTarpaulinBreakdown(product, dimensions.length, dimensions.width)
      : null;

  if (isTarpaulin && !isValidTarpaulinDimensions(dimensions?.length, dimensions?.width)) {
    return (
      <div className="min-h-screen bg-app-bg pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-black uppercase text-heading mb-4">Size Required</h1>
          <p className="text-slate-600 mb-8">
            Please enter custom length and width on the product page before checkout.
          </p>
          <Link
            to={`/products/${product._id}`}
            className="inline-block bg-brand hover:bg-[#2b9690] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-colors"
          >
            Configure Size
          </Link>
        </div>
      </div>
    );
  }

  if (isOutOfStock(product)) {
    return (
      <div className="min-h-screen bg-app-bg pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-slate-100">
            <OutOfStockBadge className="mb-6 text-sm px-4 py-2" />
            <h1 className="text-3xl font-black uppercase text-heading mb-4">Product Unavailable</h1>
            <p className="text-slate-600 mb-2">
              <span className="font-semibold text-heading">{product.name}</span> is currently out of stock.
            </p>
            <p className="text-slate-500 mb-8">Checkout is not available for this product right now.</p>
            <Link
              to="/products"
              className="inline-block bg-brand hover:bg-[#2b9690] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-colors"
            >
              Browse Other Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-app-bg pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-black uppercase text-heading mb-4">Order Placed Successfully</h1>
            <p className="text-slate-600 mb-2">
              Thank you, <span className="font-semibold text-heading">{placedOrder?.customerName}</span>!
            </p>
            <p className="text-slate-600 mb-8">
              Your order for{' '}
              <span className="font-semibold text-heading">
                {formatOrderProductName(product, {
                  quantity,
                  length: dimensions?.length,
                  width: dimensions?.width,
                })}
              </span>{' '}
              has been received. We will verify your bKash payment and contact you shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-brand hover:bg-[#2b9690] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => navigate('/')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-heading tracking-tight mb-4">
            Checkout
          </h1>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
            Complete your purchase via bKash manual payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-heading mb-6 uppercase tracking-wide">Order Summary</h2>
              <div className="flex gap-6">
                <div className="w-28 h-28 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-slate-100">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-brand uppercase tracking-wide mb-1">
                    {getProductCategory(product)}
                  </p>
                  <h3 className="text-lg font-bold text-heading mb-2">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="text-sm text-slate-500 mb-3 space-y-1">
                    {isTarpaulin && tarpaulinBreakdown && (
                      <>
                        <p>Size: {dimensions.length}ft × {dimensions.width}ft</p>
                        <p>Area: {tarpaulinBreakdown.area} sq ft</p>
                        <p>
                          {tarpaulinBreakdown.area} sq ft × ৳{tarpaulinBreakdown.rate.toFixed(2)}/sq ft
                        </p>
                      </>
                    )}
                    {!isTarpaulin && (
                      <p>
                        {formatProductPrice(product)}
                        {quantity > 1 ? ` × ${quantity}` : ''}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <div className="text-3xl font-black text-heading">
                      ৳{totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#E2136E] text-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-lg">
                  b
                </div>
                <h2 className="text-xl font-bold uppercase tracking-wide">bKash Payment</h2>
              </div>
              <p className="text-white/90 text-sm mb-6 leading-relaxed">
                Send the exact amount via bKash Send Money, then enter your transaction ID below.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">bKash Number</p>
                <p className="text-3xl font-black tracking-wider">{BKASH_NUMBER}</p>
                <p className="text-white/80 text-sm mt-4">
                  Amount to send: <span className="font-bold text-white">৳{totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <ol className="mt-6 space-y-3 text-sm text-white/90">
                <li className="flex gap-3">
                  <span className="font-bold text-white/60">1.</span>
                  Open your bKash app and go to Send Money
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-white/60">2.</span>
                  Enter the number above and send ৳{totalPrice.toFixed(2)}
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-white/60">3.</span>
                  Copy the Transaction ID and fill in the form
                </li>
              </ol>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-heading mb-6 uppercase tracking-wide">
              Delivery & Payment Details
            </h2>

            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-100 mb-6">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="address">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
                  placeholder="House, road, area, district"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="transactionId">
                  bKash Transaction ID
                </label>
                <input
                  id="transactionId"
                  name="transactionId"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
                  placeholder="e.g. 8N7A2B3C4D"
                  value={formData.transactionId}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 text-white font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md ${
                  submitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-brand hover:bg-[#2b9690] hover:shadow-brand/30 hover:-translate-y-0.5'
                }`}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;