import api from '../utils/axios';

// Example endpoints that you can use once the backend is ready

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
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