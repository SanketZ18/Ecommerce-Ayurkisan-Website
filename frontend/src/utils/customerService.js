import axios from 'axios';
import API_BASE_URL from './apiConfig';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const customerService = {
    // Dashboard & Profile
    getDashboardSummary: (id) => axios.get(`${API_BASE_URL}/api/customer/dashboard-summary/${id}`, { headers: getAuthHeader() }),
    getProfile: (id) => axios.get(`${API_BASE_URL}/api/customer/${id}`, { headers: getAuthHeader() }),
    updateProfile: (id, profileData) => axios.put(`${API_BASE_URL}/api/customer/update/${id}`, profileData, { headers: getAuthHeader() }),
    changePassword: (id, passwordData) => axios.put(`${API_BASE_URL}/api/customer/change-password/${id}`, passwordData, { headers: getAuthHeader() }),

    // Order Management
    getMyOrders: () => axios.get(`${API_BASE_URL}/orders/my-orders`, { headers: getAuthHeader() }),
    getOrderById: (orderId) => axios.get(`${API_BASE_URL}/orders/${orderId}`, { headers: getAuthHeader() }),
    getOrderHistory: (userId) => axios.get(`${API_BASE_URL}/orders/my-orders`, { headers: getAuthHeader() }), // Alias for consistency
    placeOrder: (paymentMethod, customName, customPhone, addressLine1, taluka, district, state, promoCode) => {
        let url = `${API_BASE_URL}/orders/place-order?paymentMethod=${paymentMethod}`;
        if (customName) url += `&customName=${encodeURIComponent(customName)}`;
        if (customPhone) url += `&customPhone=${encodeURIComponent(customPhone)}`;
        if (addressLine1) url += `&addressLine1=${encodeURIComponent(addressLine1)}`;
        if (taluka) url += `&taluka=${encodeURIComponent(taluka)}`;
        if (district) url += `&district=${encodeURIComponent(district)}`;
        if (state) url += `&state=${encodeURIComponent(state)}`;
        if (promoCode) url += `&promoCode=${encodeURIComponent(promoCode)}`;
        return axios.post(url, {}, { headers: getAuthHeader() });
    },
    cancelOrder: (orderId) => axios.put(`${API_BASE_URL}/orders/cancel/${orderId}`, {}, { headers: getAuthHeader() }),

    // Product & Category Management
    getAllProducts: () => axios.get(`${API_BASE_URL}/products/all`, { headers: getAuthHeader() }),
    getAllPackages: () => axios.get(`${API_BASE_URL}/packages/all`, { headers: getAuthHeader() }),
    getAllCategories: () => axios.get(`${API_BASE_URL}/categories/all`, { headers: getAuthHeader() }),

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
