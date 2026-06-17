import api from '../utils/axios';

// API Endpoints using VITE_API_BASE_URL from .env

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createProduct = async (data) => {
    try {
        const response = await api.post('/products', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (productId, data) => {
    try {
        const response = await api.patch(`/products/${productId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createContactMessage = async (data) => {
    try {
        const response = await api.post('/contacts', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createOrder = async (data) => {
    try {
        const response = await api.post('/orders', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const getUserOrders = async () => {
    const response = await api.get('/orders/user');
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/orders/${orderId}`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const googleLoginUser = async (tokenId) => {
    const response = await api.post('/auth/google', { token: tokenId });
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
};