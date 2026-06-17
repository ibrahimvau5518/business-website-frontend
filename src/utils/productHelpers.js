export const isOutOfStock = (product) => product?.stockStatus === 'out-of-stock';

export const getProductImage = (product) => product?.image || product?.imageUrl || '';

export const CATEGORY_CONFIG = {
  'Crane Parts': {
    badgeClass: 'bg-slate-800 text-white',
    accentClass: 'border-slate-800',
    blurb: 'Heavy-duty lifting and rigging components built for industrial use.',
  },
  Tarpaulin: {
    badgeClass: 'bg-brand text-white',
    accentClass: 'border-brand',
    blurb: 'Weather-resistant covers and protective sheets for outdoor operations.',
  },
  Electronics: {
    badgeClass: 'bg-purple-700 text-white',
    accentClass: 'border-purple-700',
    blurb: 'Control systems and electronic accessories for crane operations.',
  },
  'Industrial Equipment': {
    badgeClass: 'bg-heading text-white',
    accentClass: 'border-heading',
    blurb: 'Professional-grade industrial supplies you can rely on.',
  },
};

const CATEGORY_SLUG_LABELS = {
  'crane-parts': 'Crane Parts',
  tarpaulin: 'Tarpaulin',
};

export const normalizeCategory = (category) =>
  String(category || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

export const isTarpaulinCategory = (product) =>
  normalizeCategory(product?.category) === 'tarpaulin';

export const getProductUnitPrice = (product) => {
  if (isTarpaulinCategory(product) && product?.pricePerSqFt != null) {
    return Number(product.pricePerSqFt);
  }
  return Number(product?.price ?? 0);
};

export const formatProductPrice = (product) => {
  const value = getProductUnitPrice(product);
  if (isTarpaulinCategory(product)) {
    return `৳${value.toFixed(2)}/sq ft`;
  }
  return `৳${value.toFixed(2)}`;
};

export const getProductCategory = (product) => {
  if (product?.category) {
    const slug = normalizeCategory(product.category);
    return CATEGORY_SLUG_LABELS[slug] || product.category;
  }

  const name = product?.name?.toLowerCase() || '';
  if (name.includes('tarp')) return 'Tarpaulin';
  if (
    name.includes('crane') ||
    name.includes('hook') ||
    name.includes('hoist') ||
    name.includes('sling') ||
    name.includes('pulley')
  ) {
    return 'Crane Parts';
  }
  return 'Industrial Equipment';
};

export const getCategoryConfig = (product) => {
  const category = getProductCategory(product);
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Industrial Equipment'];
};

export const calculateLineTotal = (price, quantity) =>
  Number((Number(price) * Number(quantity)).toFixed(2));

export const calculateTarpaulinArea = (length, width) => {
  const l = Number(length);
  const w = Number(width);
  if (!l || !w || l <= 0 || w <= 0) return 0;
  return Number((l * w).toFixed(2));
};

export const calculateTarpaulinPrice = (product, length, width) => {
  const area = calculateTarpaulinArea(length, width);
  const rate = Number(product?.pricePerSqFt ?? product?.price ?? 0);
  return Number((area * rate).toFixed(2));
};

export const isValidTarpaulinDimensions = (length, width) =>
  calculateTarpaulinArea(length, width) > 0;

export const getOrderTotal = (product, { quantity = 1, length, width } = {}) => {
  if (isTarpaulinCategory(product)) {
    return calculateTarpaulinPrice(product, length, width);
  }
  return calculateLineTotal(getProductUnitPrice(product), quantity);
};

export const formatOrderProductName = (product, { quantity = 1, length, width } = {}) => {
  if (isTarpaulinCategory(product) && length && width) {
    return `${product.name} (${length}ft × ${width}ft)`;
  }
  return quantity > 1 ? `${product.name} (x${quantity})` : product.name;
};

export const formatTarpaulinBreakdown = (product, length, width) => {
  const area = calculateTarpaulinArea(length, width);
  const rate = Number(product?.pricePerSqFt ?? product?.price ?? 0);
  return {
    area,
    rate,
    total: calculateTarpaulinPrice(product, length, width),
  };
};

export const buildProductPayload = (form) => {
  const payload = {
    name: form.name,
    description: form.description,
    category: form.category,
  };

  if (form.category === 'tarpaulin') {
    payload.pricePerSqFt = Number(form.pricePerSqFt);
  } else {
    payload.price = Number(form.price);
  }

  return payload;
};

export const buildOrderPayload = (product, formData, { quantity = 1, length, width } = {}) => {
  const isTarpaulin = isTarpaulinCategory(product);
  const orderTotal = getOrderTotal(product, { quantity, length, width });

  const payload = {
    name: formData.name.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    transactionId: formData.transactionId.trim(),
    productId: product._id,
    productName: formatOrderProductName(product, { quantity, length, width }),
    category: isTarpaulin ? 'tarpaulin' : normalizeCategory(product.category) || 'crane-parts',
    price: orderTotal,
  };

  if (isTarpaulin) {
    payload.pricePerSqFt = getProductUnitPrice(product);
    payload.length = Number(length);
    payload.width = Number(width);
    payload.area = calculateTarpaulinArea(length, width);
    payload.quantity = 1;
  } else {
    payload.unitPrice = getProductUnitPrice(product);
    payload.quantity = Math.max(1, Number(quantity));
  }

  return payload;
};

export const formatOrderLineDetails = (order) => {
  if (normalizeCategory(order?.category) === 'tarpaulin' && order.length && order.width) {
    const area = order.area ?? calculateTarpaulinArea(order.length, order.width);
    return `${order.length}ft × ${order.width}ft (${area} sq ft)`;
  }
  if (order?.quantity > 1) {
    return `Qty: ${order.quantity}`;
  }
  return null;
};