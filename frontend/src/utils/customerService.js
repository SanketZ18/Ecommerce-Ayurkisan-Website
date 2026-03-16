import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const customerService = {
    // Profile Management
    getProfile: (id) => axios.get(`${API_BASE_URL}/api/customer/${id}`, { headers: getAuthHeader() }),
    updateProfile: (id, profileData) => axios.put(`${API_BASE_URL}/api/customer/update/${id}`, profileData, { headers: getAuthHeader() }),
    changePassword: (id, passwordData) => axios.put(`${API_BASE_URL}/api/customer/change-password/${id}`, passwordData, { headers: getAuthHeader() }),

    // Order Management
    getMyOrders: () => axios.get(`${API_BASE_URL}/orders/my-orders`, { headers: getAuthHeader() }),
    getOrderHistory: (userId) => axios.get(`${API_BASE_URL}/orders/my-orders`, { headers: getAuthHeader() }), // Alias for consistency
    placeOrder: (paymentMethod, customName, customPhone, customAddress) => {
        let url = `${API_BASE_URL}/orders/place-order?paymentMethod=${paymentMethod}`;
        if (customName) url += `&customName=${encodeURIComponent(customName)}`;
        if (customPhone) url += `&customPhone=${encodeURIComponent(customPhone)}`;
        if (customAddress) url += `&customAddress=${encodeURIComponent(customAddress)}`;
        return axios.post(url, {}, { headers: getAuthHeader() });
    },
    cancelOrder: (orderId) => axios.put(`${API_BASE_URL}/orders/cancel/${orderId}`, {}, { headers: getAuthHeader() }),

    // Product & Category Management
    getAllProducts: () => axios.get(`${API_BASE_URL}/products/all`),
    getAllPackages: () => axios.get(`${API_BASE_URL}/packages/all`),
    getAllCategories: () => axios.get(`${API_BASE_URL}/categories/all`),

    // Cart Management
    getCart: (userId, role) => axios.get(`${API_BASE_URL}/cart/${userId}?role=${role}`, { headers: getAuthHeader() }),
    addToCart: (userId, role, itemId, itemType, quantity) =>
        axios.post(`${API_BASE_URL}/cart/add?userId=${userId}&role=${role}&itemId=${itemId}&itemType=${itemType}&quantity=${quantity}`, {}, { headers: getAuthHeader() }),
    updateCartQuantity: (userId, role, itemId, itemType, quantity) =>
        axios.put(`${API_BASE_URL}/cart/update?userId=${userId}&role=${role}&itemId=${itemId}&itemType=${itemType}&quantity=${quantity}`, {}, { headers: getAuthHeader() }),
    removeFromCart: (userId, itemId, itemType) =>
        axios.delete(`${API_BASE_URL}/cart/remove/${userId}/${itemId}/${itemType}`, { headers: getAuthHeader() }),
    clearCart: (userId) =>
        axios.delete(`${API_BASE_URL}/cart/clear/${userId}`, { headers: getAuthHeader() }),

    // Tracking & Returns
    trackShipment: (orderId) => axios.get(`${API_BASE_URL}/shipments/track/${orderId}`, { headers: getAuthHeader() }),
    initiateReturn: (orderId, reason, comments) => axios.post(`${API_BASE_URL}/returns/request/${orderId}?reason=${reason}&comments=${comments}`, {}, { headers: getAuthHeader() }),
    getMyReturns: () => axios.get(`${API_BASE_URL}/returns/my-returns`, { headers: getAuthHeader() }),
    trackReturn: (orderId) => axios.get(`${API_BASE_URL}/returns/track/${orderId}`, { headers: getAuthHeader() })
};

export default customerService;
