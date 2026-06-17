export const PRODUCT_CATEGORIES = [
  { value: 'crane-parts', label: 'Crane Parts' },
  { value: 'tarpaulin', label: 'Tarpaulin' },
];

export const DEFAULT_PRODUCT_CATEGORY = 'crane-parts';

export const getCategoryLabel = (value) =>
  PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value;