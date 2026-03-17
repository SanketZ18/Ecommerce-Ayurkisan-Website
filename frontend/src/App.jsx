import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Layout */
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import CustomerLayout from './components/layout/CustomerLayout';
import RetailerLayout from './components/layout/RetailerLayout';

/* Chatbot */
import ChatBot from './components/chatbot/ChatBot';

/* Auth */
import AuthModalManager from './components/auth/AuthModalManager';

import PublicRouteGuard from './components/auth/PublicRouteGuard';

/* Pages */
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';

import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';

import AdminDashboard from './pages/AdminDashboard';
import ManageHomepage from './pages/ManageHomepage';
import ManageAdmins from './pages/ManageAdmins';
import ManageCategories from './pages/ManageCategories';
import ManagePackages from './pages/ManagePackages';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';
import ManageReturns from './pages/ManageReturns';
import ManageShipments from './pages/ManageShipments';
import ManageReports from './pages/ManageReports';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import RetailerDashboard from './pages/RetailerDashboard';
import RetailerProfile from './pages/retailer/RetailerProfile';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import RequestReturn from './pages/RequestReturn';
import CustomerReturns from './pages/CustomerReturns';

import { getUserRole, isAuthenticated } from './utils/auth';

function App() {

    const [authModal, setAuthModal] = useState(null);

    const handleLoginClick = () => {
        setAuthModal('login');
    };

    const handleSignUpClick = () => {
        setAuthModal('signupSelect');
    };

    const handleCloseModal = () => {
        setAuthModal(null);
    };

    const userRole = getUserRole();
    const loggedIn = isAuthenticated();

    // Helper to wrap pages in the correct layout based on dynamic role
    const GlobalLayout = ({ children }) => {
        if (loggedIn) {
            if (userRole === 'CUSTOMER') {
                return <CustomerLayout>{children}</CustomerLayout>;
            }
            if (userRole === 'RETAILER') {
                return <RetailerLayout>{children}</RetailerLayout>;
            }
        }
        return (
            <PublicLayout onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick}>
                {children}
            </PublicLayout>
        );
    };

    useEffect(() => {
        const handleOpenAuth = (e) => {
            setAuthModal(e.detail?.modalType || 'signupSelect');
        };
        window.addEventListener('openAuthModal', handleOpenAuth);
        return () => window.removeEventListener('openAuthModal', handleOpenAuth);
    }, []);

    return (
        <div className="app-container">
            <ToastContainer position="top-center" autoClose={3000} />

            <Routes>
                {/* PUBLIC PAGES (Wrapped in PublicLayout and Guard) */}
                <Route path="/" element={
                    <PublicRouteGuard>
                        <PublicLayout onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick}>
                            <Home />
                        </PublicLayout>
                    </PublicRouteGuard>
                } />
                <Route path="/products" element={
                    <GlobalLayout>
                        <Shop />
                    </GlobalLayout>
                } />
                <Route path="/product/:productId" element={
                    <GlobalLayout>
                        <ProductDetails />
                    </GlobalLayout>
                } />
                <Route path="/packages" element={
                    <GlobalLayout>
                        <Packages />
                    </GlobalLayout>
                } />
                <Route path="/package/:packageId" element={
                    <GlobalLayout>
                        <PackageDetails />
                    </GlobalLayout>
                } />
                <Route path="/cart" element={
                    <GlobalLayout>
                        <Cart />
                    </GlobalLayout>
                } />
                <Route path="/checkout" element={
                    <GlobalLayout>
                        <Checkout />
                    </GlobalLayout>
                } />
                <Route path="/wishlist" element={
                    <GlobalLayout>
                        <Wishlist />
                    </GlobalLayout>
                } />
                <Route path="/about" element={
                    <GlobalLayout>
                        <About />
                    </GlobalLayout>
                } />
                <Route path="/feedback" element={
                    <GlobalLayout>
                        <Contact />
                    </GlobalLayout>
                } />

                {/* DASHBOARDS */}
                {/* Admin wrapped in AdminLayout */}
                <Route path="/admin/*" element={
                    <AdminLayout>
                        <Routes>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="manage-homepage" element={<ManageHomepage />} />
                            <Route path="manage-admins" element={<ManageAdmins />} />
                            <Route path="categories" element={<ManageCategories />} />
                            <Route path="packages" element={<ManagePackages />} />
                            <Route path="products" element={<ManageProducts />} />
                            <Route path="orders" element={<ManageOrders />} />
                            <Route path="shipment" element={<ManageShipments />} />
                            <Route path="returns" element={<ManageReturns />} />
                            <Route path="reports" element={<ManageReports />} />
                            {/* Other admin routes will go here */}
                        </Routes>
                    </AdminLayout>
                } />

                {/* Customer Routes */}
                <Route path="/customer/*" element={
                    <CustomerLayout>
                        <Routes>
                            <Route path="dashboard" element={<CustomerDashboard />} />
                            <Route path="orders" element={<MyOrders />} />
                            <Route path="wishlist" element={<Wishlist />} />
                            <Route path="tracking/:orderId" element={<OrderTracking />} />
                            <Route path="returns" element={<CustomerReturns />} />
                            <Route path="returns/request/:orderId" element={<RequestReturn />} />
                        </Routes>
                    </CustomerLayout>
                } />

                {/* Retailer Routes */}
                <Route path="/retailer/*" element={
                    <RetailerLayout>
                        <Routes>
                            <Route path="dashboard" element={<RetailerDashboard />} />
                            <Route path="orders" element={<MyOrders />} />
                            <Route path="tracking/:orderId" element={<OrderTracking />} />
                            <Route path="returns" element={<ManageReturns />} />
                            <Route path="returns/request/:orderId" element={<RequestReturn />} />
                        </Routes>
                    </RetailerLayout>
                } />

            </Routes>

            {/* AUTH MODAL */}
            {authModal && (
                <AuthModalManager
                    currentModal={authModal}
                    setAuthModal={setAuthModal}
                    onClose={handleCloseModal}
                />
            )}

            {/* CHATBOT */}
            <ChatBot />

        </div>
    );
}

export default App;