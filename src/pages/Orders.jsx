import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/apiService';
import { formatOrderLineDetails } from '../utils/productHelpers';

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please log in to view your orders.');
        } else {
          setError(err.response?.data?.message || 'Failed to load your orders.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-app-bg pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase text-heading tracking-tight mb-4">My Orders</h1>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded mb-4" />
          <p className="text-slate-600">
            Hi {user?.name?.split(' ')[0] || 'there'}, here is your order history.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-sm border border-red-100 text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white p-10 rounded-lg shadow-sm border border-slate-100 text-center">
            <p className="text-slate-600 text-lg mb-2">You have not placed any orders yet.</p>
            <p className="text-slate-500 mb-8">Browse products and complete checkout to see orders here.</p>
            <Link
              to="/products"
              className="inline-block bg-brand hover:bg-[#2b9690] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-colors"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = order.status?.toLowerCase() || 'pending';
              const statusStyle = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200';

              return (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-heading">{order.productName}</h2>
                      {formatOrderLineDetails(order) && (
                        <p className="text-sm text-slate-500 mt-1">{formatOrderLineDetails(order)}</p>
                      )}
                      <p className="text-sm text-slate-500 mt-2">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`inline-flex self-start items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusStyle}`}>
                      {status}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
                    <div className="text-sm text-slate-600">
                      <p>Txn: <span className="font-mono text-slate-800">{order.transactionId}</span></p>
                      <p className="mt-1">Deliver to: {order.address}</p>
                    </div>
                    <p className="text-2xl font-black text-heading">৳{Number(order.price).toFixed(2)}</p>
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

export default Orders;