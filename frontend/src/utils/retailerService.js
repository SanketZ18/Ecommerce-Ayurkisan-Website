import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const retailerService = {
    // Profile Management
    getProfile: (id) => axios.get(`${API_BASE_URL}/api/retailer/${id}`, { headers: getAuthHeader() }),
    updateProfile: (id, profileData) => axios.put(`${API_BASE_URL}/api/retailer/update/${id}`, profileData, { headers: getAuthHeader() }),
    changePassword: (id, passwordData) => axios.put(`${API_BASE_URL}/api/retailer/change-password/${id}`, passwordData, { headers: getAuthHeader() }),

    // Order Management
    getMyOrders: () => axios.get(`${API_BASE_URL}/orders/my-orders`, { headers: getAuthHeader() }),
    getOrderHistory: (userId) => axios.get(`${API_BASE_URL}/orders/my-orders`, { headers: getAuthHeader() }), // Unified with getMyOrders
    cancelOrder: (orderId) => axios.put(`${API_BASE_URL}/orders/cancel/${orderId}`, {}, { headers: getAuthHeader() }),

    // Product Management
    getAllProducts: () => axios.get(`${API_BASE_URL}/products/all`),
    trackShipment: (orderId) => axios.get(`${API_BASE_URL}/shipments/track/${orderId}`, { headers: getAuthHeader() }),
    initiateReturn: (orderId, reason, comments) => axios.post(`${API_BASE_URL}/returns/request/${orderId}?reason=${reason}&comments=${comments}`, {}, { headers: getAuthHeader() }),
    getMyReturns: () => axios.get(`${API_BASE_URL}/returns/my-returns`, { headers: getAuthHeader() }),
    trackReturn: (orderId) => axios.get(`${API_BASE_URL}/returns/track/${orderId}`, { headers: getAuthHeader() })
};

export default retailerService;
