import React from 'react';

const TarpaulinSizeInputs = ({ length, width, onChange, disabled = false }) => {
  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Custom Size (feet)</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-0">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2" htmlFor="length">
            Length (ft)
          </label>
          <input
            id="length"
            name="length"
            type="number"
            min="0.1"
            step="0.1"
            required
            disabled={disabled}
            value={length}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800 disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2" htmlFor="width">
            Width (ft)
          </label>
          <input
            id="width"
            name="width"
            type="number"
            min="0.1"
            step="0.1"
            required
            disabled={disabled}
            value={width}
            onChange={handleChange}
            placeholder="e.g. 15"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800 disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
};

export default TarpaulinSizeInputs;