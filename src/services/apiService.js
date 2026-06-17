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
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.patch(`/orders/${orderId}`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const adminLogin = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Auth examples (Login/Register)
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const googleLoginUser = async (tokenId) => {
    try {
        const response = await api.post('/auth/google', { token: tokenId });
        return response.data;
    } catch (error) {
        throw error;
    }
};