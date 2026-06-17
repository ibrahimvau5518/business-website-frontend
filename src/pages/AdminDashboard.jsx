import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getProducts, getOrders, updateOrderStatus, createProduct } from '../services/apiService';
import AdminProductManagement from '../components/AdminProductManagement';
import AdminProductPricingFields from '../components/AdminProductPricingFields';
import { DEFAULT_PRODUCT_CATEGORY } from '../constants/productCategories';
import { buildProductPayload, formatOrderLineDetails } from '../utils/productHelpers';
import toast from 'react-hot-toast';

const STATUS_FLOW = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered',
  delivered: null,
};

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
};

const canTransitionTo = (currentStatus, targetStatus) =>
  STATUS_FLOW[currentStatus] === targetStatus;

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase() || 'pending';
  const styles = STATUS_STYLES[normalized] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles}`}>
      {normalized}
    </span>
  );
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

const ACTION_BUTTONS = [
  { label: 'Confirm', target: 'confirmed', active: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { label: 'Ship', target: 'shipped', active: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { label: 'Deliver', target: 'delivered', active: 'bg-green-600 hover:bg-green-700 text-white' },
];

const OrderActions = ({ order, isUpdating, onStatusUpdate }) => (
  <div className="flex flex-wrap gap-2">
    {ACTION_BUTTONS.map(({ label, target, active }) => {
      const isAllowed = canTransitionTo(order.status, target);
      const isDisabled = !isAllowed || isUpdating;

      return (
        <button
          key={target}
          type="button"
          disabled={isDisabled}
          onClick={() => onStatusUpdate(order._id, target)}
          title={
            isAllowed
              ? `Mark as ${target}`
              : `Cannot ${label.toLowerCase()} from "${order.status}" status`
          }
          className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors ${
            isDisabled
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : active
          }`}
        >
          {isUpdating && isAllowed ? '…' : label}
        </button>
      );
    })}
  </div>
);

const AdminDashboard = () => {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: DEFAULT_PRODUCT_CATEGORY,
    price: '',
    pricePerSqFt: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load orders. Please try again.';
      setOrdersError(message);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order || !canTransitionTo(order.status, newStatus)) {
      toast.error(`Cannot change status from "${order?.status}" to "${newStatus}"`);
      return;
    }

    const previousOrders = orders;
    setUpdatingOrderId(orderId);
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      setOrders(previousOrders);
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      setNewProduct({
        ...newProduct,
        category: value,
        price: value === 'crane-parts' ? newProduct.price : '',
        pricePerSqFt: value === 'tarpaulin' ? newProduct.pricePerSqFt : '',
      });
      return;
    }

    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
      throw new Error('Please add your ImgBB API Key to the .env file');
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error('Image upload failed');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image first.');
      return;
    }

    setUploadingImage(true);
    try {
      const image = await uploadToImgBB(imageFile);
      const created = await createProduct({
        ...buildProductPayload(newProduct),
        image,
        stockStatus: 'in-stock',
      });

      toast.success('Product added successfully!');
      setProducts([created, ...products]);
      setNewProduct({
        name: '',
        description: '',
        category: DEFAULT_PRODUCT_CATEGORY,
        price: '',
        pricePerSqFt: '',
      });
      setImageFile(null);

      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';

      setActiveTab('products');
    } catch (err) {
      toast.error(err.message || 'Failed to add product. Check your image upload API key and backend connection.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdminLogout = () => {
    adminLogout();
    navigate('/login?redirect=/admin', { replace: true });
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-heading uppercase tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Logged in as <span className="font-semibold text-heading">{admin?.email}</span>
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          {activeTab === 'orders' && !ordersLoading && !ordersError && (
            <div className="flex gap-3 text-sm">
              <span className="bg-white border border-slate-200 px-4 py-2 rounded-sm font-semibold text-slate-700">
                Total Orders: <span className="text-brand">{orders.length}</span>
              </span>
              {pendingCount > 0 && (
                <span className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-sm font-semibold text-yellow-800">
                  Pending: {pendingCount}
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleAdminLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-sm font-bold uppercase text-sm tracking-wider transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-white rounded-md shadow-sm border border-slate-100 p-4 h-fit">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-sm font-bold uppercase text-sm ${
                  activeTab === 'orders'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Orders ({orders.length || '…'})
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-4 py-3 rounded-sm font-bold uppercase text-sm ${
                  activeTab === 'products'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Products ({products.length})
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('add')}
                className={`w-full text-left px-4 py-3 rounded-sm font-bold uppercase text-sm ${
                  activeTab === 'add'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Add New Product
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'orders' && (
            <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold uppercase tracking-wide">Customer Orders</h2>
                <button
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="text-sm font-bold uppercase tracking-wide text-brand hover:text-[#2b9690] disabled:opacity-50 transition-colors"
                >
                  {ordersLoading ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>

              {ordersLoading && (
                <div className="p-16 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand mx-auto mb-4" />
                  <p className="text-slate-500 text-sm font-medium">Loading orders…</p>
                </div>
              )}

              {!ordersLoading && ordersError && (
                <div className="p-10 text-center">
                  <div className="bg-red-50 text-red-700 p-6 rounded-sm border border-red-100 max-w-md mx-auto mb-6">
                    <p className="font-semibold mb-1">Could not load orders</p>
                    <p className="text-sm text-red-600">{ordersError}</p>
                  </div>
                  <button
                    onClick={fetchOrders}
                    className="bg-brand hover:bg-[#2b9690] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="p-16 text-center">
                  <p className="text-slate-500 text-lg font-medium">No orders yet.</p>
                  <p className="text-slate-400 text-sm mt-2">Orders will appear here once customers complete checkout.</p>
                </div>
              )}

              {!ordersLoading && !ordersError && orders.length > 0 && (
                <>
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Customer Name</th>
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Phone</th>
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Product</th>
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Price</th>
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Transaction ID</th>
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Status</th>
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Date</th>
                          <th className="p-4 font-bold text-xs uppercase text-slate-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-4 font-medium text-slate-800">{order.name}</td>
                            <td className="p-4 text-slate-600 text-sm">{order.phone}</td>
                            <td className="p-4 text-slate-700 text-sm max-w-[220px]">
                              <p className="truncate" title={order.productName}>{order.productName}</p>
                              {formatOrderLineDetails(order) && (
                                <p className="text-xs text-slate-400 mt-0.5">{formatOrderLineDetails(order)}</p>
                              )}
                            </td>
                            <td className="p-4 text-brand font-bold whitespace-nowrap">
                              ৳{Number(order.price).toFixed(2)}
                            </td>
                            <td className="p-4">
                              <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
                                {order.transactionId}
                              </code>
                            </td>
                            <td className="p-4">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="p-4 text-slate-500 text-sm whitespace-nowrap">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="p-4">
                              <OrderActions
                                order={order}
                                isUpdating={updatingOrderId === order._id}
                                onStatusUpdate={handleStatusUpdate}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:hidden divide-y divide-slate-100">
                    {orders.map((order) => (
                      <div key={order._id} className="p-5 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-bold text-slate-800">{order.name}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{order.phone}</p>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-slate-700 mb-1">{order.productName}</p>
                        {formatOrderLineDetails(order) && (
                          <p className="text-xs text-slate-400 mb-2">{formatOrderLineDetails(order)}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span className="font-bold text-brand">৳{Number(order.price).toFixed(2)}</span>
                          <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                            {order.transactionId}
                          </code>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">{formatDate(order.createdAt)}</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <OrderActions
                            order={order}
                            isUpdating={updatingOrderId === order._id}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'products' && <AdminProductManagement />}

          {activeTab === 'add' && (
            <div className="bg-white rounded-md shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold uppercase tracking-wide">Add New Product</h2>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminProductPricingFields form={newProduct} onChange={handleInputChange} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Upload Image</label>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-[#2b9690]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Description</label>
                  <textarea
                    name="description"
                    required
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className={`px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-all shadow-md ${
                      uploadingImage
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-brand hover:bg-[#2b9690] text-white'
                    }`}
                  >
                    {uploadingImage ? 'Uploading Image & Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;