import axios from 'axios';
import { clearAuthData } from './auth';

// Set base URL for API calls
// In development, it falls back to empty string (proxy handled by vite)
// In production, it uses VITE_API_BASE_URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

// Add a response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // We only want to force a global logout if we are DEFINITELY sure the user
        // was deleted from the database (stale session).
        const isUserNotFoundMessage = error.response && error.response.data && 
                                     error.response.data.message && 
                                     (error.response.data.message.includes("Customer not found") || 
                                      error.response.data.message.includes("Retailer not found"));

        // Also check for 401 on profile endpoints which are the primary indicators
        const isProfileEndpoint = error.config && error.config.url && 
                                 (error.config.url.includes('/api/customer/') || 
                                  error.config.url.includes('/api/retailer/')) &&
                                 !error.config.url.includes('/all');

        if (error.response && error.response.status === 401) {
            const role = localStorage.getItem('role') || 'CUSTOMER';
            const isRoleMismatch = (role === 'RETAILER' && error.response.data?.message?.includes("Customer not found")) ||
                                  (role === 'CUSTOMER' && error.response.data?.message?.includes("Retailer not found"));

            if ((isUserNotFoundMessage || isProfileEndpoint) && !isRoleMismatch) {
                console.warn("Deleted user or stale profile session detected. Redirecting...");
                
                // Only redirect if not already on public pages
                if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
                    clearAuthData();
                    window.location.href = '/';
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default axios;
