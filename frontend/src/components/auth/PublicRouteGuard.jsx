import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../utils/auth';

const PublicRouteGuard = ({ children }) => {
    // If the user is logged in, redirect them to their respective dashboard
    if (isAuthenticated()) {
        const role = getUserRole();
        if (role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (role === 'RETAILER') {
            return <Navigate to="/retailer/dashboard" replace />;
        } else if (role === 'CUSTOMER') {
            return <Navigate to="/customer/dashboard" replace />;
        }
    }

    // If not authenticated, allow them to view the public page
    return children;
};

export default PublicRouteGuard;
