/**
 * Central configuration for the API Base URL.
 * 
 * When running locally, if VITE_API_BASE_URL is not set in the environment,
 * it defaults to http://localhost:9090.
 * 
 * In production (e.g., Render), VITE_API_BASE_URL should be set to the 
 * live backend URL.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';

export default API_BASE_URL;
