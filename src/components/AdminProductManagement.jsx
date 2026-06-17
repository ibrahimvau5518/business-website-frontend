import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, updateProduct, deleteProduct } from '../services/apiService';
import AdminProductPricingFields from './AdminProductPricingFields';
import { DEFAULT_PRODUCT_CATEGORY, getCategoryLabel } from '../constants/productCategories';
import { buildProductPayload, formatProductPrice } from '../utils/productHelpers';
import toast from 'react-hot-toast';

const StockBadge = ({ status }) => {
  const inStock = status === 'in-stock';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
        inStock
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-red-100 text-red-800 border-red-200'
      }`}
    >
      {inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  );
};

const CategoryBadge = ({ category }) => (
  <span className="inline-flex items-center bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
    {getCategoryLabel(category || DEFAULT_PRODUCT_CATEGORY)}
  </span>
);

const EditProductModal = ({ product, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    category: product.category || DEFAULT_PRODUCT_CATEGORY,
    price: product.category === 'tarpaulin' ? '' : product.price,
    pricePerSqFt: product.category === 'tarpaulin' ? product.pricePerSqFt ?? product.price : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      setForm({
        ...form,
        category: value,
        price: value === 'crane-parts' ? form.price || product.price : '',
        pricePerSqFt: value === 'tarpaulin' ? form.pricePerSqFt || product.pricePerSqFt || product.price : '',
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product._id, buildProductPayload(form));
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-product-title">
      <div className="modal-panel">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center sticky top-0 z-10">
          <h3 id="edit-product-title" className="text-base sm:text-lg font-bold uppercase tracking-wide text-heading">Edit Product</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase mb-2" htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <AdminProductPricingFields form={form} onChange={handleChange} />

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase mb-2" htmlFor="edit-description">
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-sm font-bold uppercase text-sm text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-sm font-bold uppercase text-sm text-white transition-colors ${
                saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand hover:bg-[#2b9690]'
              }`}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductActions = ({ product, isUpdating, onEdit, onDelete, onToggleStock }) => {
  const inStock = product.stockStatus === 'in-stock';

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onEdit(product)}
        className="px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide bg-slate-800 hover:bg-slate-900 text-white transition-colors"
      >
        Edit
      </button>
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => onToggleStock(product)}
        className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors ${
          isUpdating
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : inStock
            ? 'bg-amber-500 hover:bg-amber-600 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isUpdating ? '…' : inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
      </button>
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => onDelete(product)}
        className="px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
};

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveEdit = async (productId, updates) => {
    setSavingEdit(true);
    try {
      const updated = await updateProduct(productId, updates);
      setProducts((prev) => prev.map((p) => (p._id === productId ? updated : p)));
      setEditingProduct(null);
      toast.success('Product updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleStock = async (product) => {
    const newStatus = product.stockStatus === 'in-stock' ? 'out-of-stock' : 'in-stock';
    const previousProducts = products;

    setUpdatingProductId(product._id);
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, stockStatus: newStatus } : p))
    );

    try {
      const updated = await updateProduct(product._id, { stockStatus: newStatus });
      setProducts((prev) => prev.map((p) => (p._id === product._id ? updated : p)));
      toast.success(`Product marked as ${newStatus === 'in-stock' ? 'in stock' : 'out of stock'}`);
    } catch (err) {
      setProducts(previousProducts);
      toast.error(err.response?.data?.message || 'Failed to update stock status');
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setUpdatingProductId(product._id);
    try {
      await deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setUpdatingProductId(null);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide">Product Management</h2>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="text-sm font-bold uppercase tracking-wide text-brand hover:text-[#2b9690] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {loading && (
        <div className="p-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">Loading products…</p>
        </div>
      )}

      {!loading && error && (
        <div className="p-10 text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-sm border border-red-100 max-w-md mx-auto mb-6">
            <p className="font-semibold mb-1">Could not load products</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={fetchProducts}
            className="bg-brand hover:bg-[#2b9690] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="p-16 text-center">
          <p className="text-slate-500 text-lg font-medium">No products found.</p>
          <p className="text-slate-400 text-sm mt-2">Add a product from the sidebar to get started.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="hidden md:block table-scroll">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-xs uppercase text-slate-500">Name</th>
                  <th className="p-4 font-bold text-xs uppercase text-slate-500">Category</th>
                  <th className="p-4 font-bold text-xs uppercase text-slate-500">Price</th>
                  <th className="p-4 font-bold text-xs uppercase text-slate-500">Stock Status</th>
                  <th className="p-4 font-bold text-xs uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.description}</p>
                    </td>
                    <td className="p-4">
                      <CategoryBadge category={product.category} />
                    </td>
                    <td className="p-4 text-brand font-bold whitespace-nowrap">
                      {formatProductPrice(product)}
                    </td>
                    <td className="p-4">
                      <StockBadge status={product.stockStatus || 'in-stock'} />
                    </td>
                    <td className="p-4">
                      <ProductActions
                        product={product}
                        isUpdating={updatingProductId === product._id}
                        onEdit={setEditingProduct}
                        onDelete={handleDelete}
                        onToggleStock={handleToggleStock}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {products.map((product) => (
              <div key={product._id} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-slate-800">{product.name}</p>
                    <div className="mt-2">
                      <CategoryBadge category={product.category} />
                    </div>
                  </div>
                  <StockBadge status={product.stockStatus || 'in-stock'} />
                </div>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.description}</p>
                <p className="text-brand font-bold mb-4">{formatProductPrice(product)}</p>
                <ProductActions
                  product={product}
                  isUpdating={updatingProductId === product._id}
                  onEdit={setEditingProduct}
                  onDelete={handleDelete}
                  onToggleStock={handleToggleStock}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
          saving={savingEdit}
        />
      )}
    </div>
  );
};

export default AdminProductManagement;