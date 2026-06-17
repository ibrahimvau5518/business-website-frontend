import React from 'react';
import { PRODUCT_CATEGORIES } from '../constants/productCategories';

const AdminProductPricingFields = ({ form, onChange }) => {
  const isTarpaulin = form.category === 'tarpaulin';

  return (
    <>
      <div>
        <label className="block text-sm font-bold text-slate-700 uppercase mb-2" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          value={form.category}
          onChange={onChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {PRODUCT_CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isTarpaulin ? (
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase mb-2" htmlFor="pricePerSqFt">
            Price Per Sq Ft (৳)
          </label>
          <input
            id="pricePerSqFt"
            name="pricePerSqFt"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.pricePerSqFt}
            onChange={onChange}
            placeholder="e.g. 45.00"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="text-xs text-slate-500 mt-2">Tarpaulin products are priced per square foot.</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase mb-2" htmlFor="price">
            Price (৳)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={onChange}
            placeholder="e.g. 2500.00"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      )}
    </>
  );
};

export default AdminProductPricingFields;