// Utility functions for handling JWT tokens and user sessions

export const initializeSession = () => {
    // sessionStorage is automatically cleared when the tab or browser is closed.
    // We use this to detect a 'fresh' opening of the website.
    const sessionActive = sessionStorage.getItem("sessionActive");

    if (!sessionActive) {
        console.log("Fresh session detected. Clearing persistent data...");
        localStorage.clear();
        sessionStorage.setItem("sessionActive", "true");
    }
};

export const setAuthData = (token, role, userId) => {
    // SECURITY: Ensure both are updated, but primarily use localStorage for consistency
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);

    // Also ensure session flag is set if we just logged in
    sessionStorage.setItem("sessionActive", "true");

    console.log(`Auth data set for ${role}.`);
};

export const clearAuthData = () => {
    // Wipe everything on logout
    localStorage.clear();
    sessionStorage.clear();
    console.log("Auth data cleared from all storage.");
};

export const getAuthToken = () => {
    return localStorage.getItem("token");
};

export const getUserRole = () => {
    return localStorage.getItem("role");
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token !== null && token !== undefined && token !== "";
};