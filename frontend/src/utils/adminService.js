import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const adminService = {
    // Stats & Overview
    getDashboardStats: async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/dashboard-stats`, { headers: getAuthHeader() }),
                axios.get(`${API_BASE_URL}/orders/admin/all`, { headers: getAuthHeader() })
            ]);

            const stats = statsRes.data;
            const orderData = Array.isArray(ordersRes.data) ? ordersRes.data : [];

            // Sort by Date Descending (Newest first)
            const sortedOrders = [...orderData].sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            return {
                ...stats,
                recentOrders: sortedOrders.slice(0, 5)
            };
        } catch (error) {
            console.error("Error in getDashboardStats:", error);
            return {
                customersCount: 0,
                retailersCount: 0,
                productsCount: 0,
                categoriesCount: 0,
                totalOrders: 0,
                totalSales: 0,
                recentOrders: []
            };
        }
    },

    // Admin Management
    getAdmins: () => axios.get(`${API_BASE_URL}/api/admin/admins`, { headers: getAuthHeader() }),
    registerAdmin: (adminData) => axios.post(`${API_BASE_URL}/api/auth/admin/register`, adminData),
    updateAdmin: (id, adminData) => axios.put(`${API_BASE_URL}/api/admin/update/${id}`, adminData, { headers: getAuthHeader() }),
    deleteAdmin: (id) => axios.delete(`${API_BASE_URL}/api/admin/delete/${id}`, { headers: getAuthHeader() }),

    // Category Management
    getCategories: () => axios.get(`${API_BASE_URL}/categories/all`),
    addCategory: (categoryData) => axios.post(`${API_BASE_URL}/categories/admin/add`, categoryData, { headers: getAuthHeader() }),
    updateCategory: (name, categoryData) => axios.put(`${API_BASE_URL}/categories/admin/update/${name}`, categoryData, { headers: getAuthHeader() }),
    deleteCategory: (name) => axios.delete(`${API_BASE_URL}/categories/admin/delete/${name}`, { headers: getAuthHeader() }),

    // Product Management
    getProducts: () => axios.get(`${API_BASE_URL}/products/all`),
    addProduct: (productData) => axios.post(`${API_BASE_URL}/products/admin/add`, productData, { headers: getAuthHeader() }),
    updateProduct: (id, productData) => axios.put(`${API_BASE_URL}/products/admin/update/${id}`, productData, { headers: getAuthHeader() }),
    deleteProduct: (id) => axios.delete(`${API_BASE_URL}/products/admin/delete/${id}`, { headers: getAuthHeader() }),
    getOutOfStockProducts: () => axios.get(`${API_BASE_URL}/products/admin/out-of-stock`, { headers: getAuthHeader() }),

    // Package Management
    getPackages: () => axios.get(`${API_BASE_URL}/packages/all`),
    addPackage: (packageData) => axios.post(`${API_BASE_URL}/packages/admin/add`, packageData, { headers: getAuthHeader() }),
    updatePackage: (name, packageData) => axios.put(`${API_BASE_URL}/packages/admin/update/${name}`, packageData, { headers: getAuthHeader() }),
    deletePackage: (name) => axios.delete(`${API_BASE_URL}/packages/admin/delete/${name}`, { headers: getAuthHeader() }),

    // Order Management
    getAllOrders: () => axios.get(`${API_BASE_URL}/orders/admin/all`, { headers: getAuthHeader() }),
    updateOrderStatus: (orderId, status) => axios.put(`${API_BASE_URL}/orders/admin/status/${orderId}?newStatus=${status}`, {}, { headers: getAuthHeader() }),

    // Shipment Management
    getAllShipments: () => axios.get(`${API_BASE_URL}/shipments/admin/all`, { headers: getAuthHeader() }),
    updateShipmentStatus: (orderId, status, remarks) => axios.put(`${API_BASE_URL}/shipments/admin/status/${orderId}?newStatus=${status}&remarks=${remarks}`, {}, { headers: getAuthHeader() }),

    // Return Management
    getAllReturns: () => axios.get(`${API_BASE_URL}/returns/admin/all`, { headers: getAuthHeader() }),
    updateReturnStatus: (orderId, status, remarks) => axios.put(`${API_BASE_URL}/returns/admin/status/${orderId}?newStatus=${status}&remarks=${remarks}`, {}, { headers: getAuthHeader() }),

    // Support / Contact Management
    getContacts: () => axios.get(`${API_BASE_URL}/api/contact/all`, { headers: getAuthHeader() }),
    deleteContact: (id) => axios.delete(`${API_BASE_URL}/api/contact/${id}`, { headers: getAuthHeader() }),
    replyToContact: (id, message) => axios.post(`${API_BASE_URL}/api/contact/reply/${id}`, { replyMessage: message }, { headers: getAuthHeader() })
};

export default adminService;
