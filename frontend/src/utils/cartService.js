import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const cartService = {
    getCart: (userId, role) => axios.get(`${API_BASE_URL}/cart/${userId}?role=${role}`, { headers: getAuthHeader() }),

    addToCart: (userId, role, itemId, itemType, quantity) =>
        axios.post(`${API_BASE_URL}/cart/add?userId=${userId}&role=${role}&itemId=${itemId}&itemType=${itemType}&quantity=${quantity}`, {}, { headers: getAuthHeader() }),

    updateQuantity: (userId, itemId, itemType, quantity) =>
        axios.put(`${API_BASE_URL}/cart/update?userId=${userId}&itemId=${itemId}&itemType=${itemType}&quantity=${quantity}`, {}, { headers: getAuthHeader() }),

    removeFromCart: (userId, itemId, itemType) =>
        axios.delete(`${API_BASE_URL}/cart/remove/${userId}/${itemId}/${itemType}`, { headers: getAuthHeader() }),

    clearCart: (userId) => axios.delete(`${API_BASE_URL}/cart/clear/${userId}`, { headers: getAuthHeader() }),

    checkout: (userId) => axios.post(`${API_BASE_URL}/cart/checkout/${userId}`, {}, { headers: getAuthHeader() })
};

export default cartService;
