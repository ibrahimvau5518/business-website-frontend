import React from 'react';

const QuantitySelector = ({ quantity, onChange, min = 1, max = 99, disabled = false }) => {
  const decrease = () => onChange(Math.max(min, quantity - 1));
  const increase = () => onChange(Math.min(max, quantity + 1));

  const handleInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (Number.isNaN(value)) {
      onChange(min);
      return;
    }
    onChange(Math.min(max, Math.max(min, value)));
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Quantity</span>
      <div className="flex items-center border border-slate-200 rounded-sm overflow-hidden bg-white">
        <button
          type="button"
          onClick={decrease}
          disabled={disabled || quantity <= min}
          className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={quantity}
          onChange={handleInput}
          disabled={disabled}
          className="w-14 text-center py-2 font-bold text-slate-800 border-x border-slate-200 focus:outline-none disabled:bg-slate-50"
        />
        <button
          type="button"
          onClick={increase}
          disabled={disabled || quantity >= max}
          className="px-4 py-2 text-lg font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;