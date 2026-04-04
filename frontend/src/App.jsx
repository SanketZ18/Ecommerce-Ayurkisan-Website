import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './components/common/LoadingSpinner';

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

/* Pages - LAZY LOADED for performance */
const Home = lazy(() => import('./pages/Home'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Packages = lazy(() => import('./pages/Packages'));
const PackageDetails = lazy(() => import('./pages/PackageDetails'));

const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManageHomepage = lazy(() => import('./pages/ManageHomepage'));
const ManageAdmins = lazy(() => import('./pages/ManageAdmins'));
const ManageCategories = lazy(() => import('./pages/ManageCategories'));
const ManagePackages = lazy(() => import('./pages/ManagePackages'));
const ManageProducts = lazy(() => import('./pages/ManageProducts'));
const ManageOrders = lazy(() => import('./pages/ManageOrders'));
const ManageReturns = lazy(() => import('./pages/ManageReturns'));
const ManageShipments = lazy(() => import('./pages/ManageShipments'));
const ManageReports = lazy(() => import('./pages/ManageReports'));
const ManageOffers = lazy(() => import('./pages/ManageOffers'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const CustomerProfile = lazy(() => import('./pages/customer/CustomerProfile'));
const RetailerDashboard = lazy(() => import('./pages/RetailerDashboard'));
const RetailerProfile = lazy(() => import('./pages/retailer/RetailerProfile'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const RequestReturn = lazy(() => import('./pages/RequestReturn'));
const CustomerReturns = lazy(() => import('./pages/CustomerReturns'));
const LegalPolicies = lazy(() => import('./pages/LegalPolicies'));

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

            <Suspense fallback={<LoadingSpinner />}>
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

                    {/* LEGAL POLICIES */}
                    <Route path="/policy" element={<GlobalLayout><LegalPolicies /></GlobalLayout>} />
                    <Route path="/terms" element={<GlobalLayout><LegalPolicies /></GlobalLayout>} />
                    <Route path="/shipping" element={<GlobalLayout><LegalPolicies /></GlobalLayout>} />
                    <Route path="/returns" element={<GlobalLayout><LegalPolicies /></GlobalLayout>} />

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
                                <Route path="offers" element={<ManageOffers />} />
                                <Route path="users" element={<ManageUsers />} />
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
                                <Route path="returns" element={<CustomerReturns />} />
                                <Route path="returns/request/:orderId" element={<RequestReturn />} />
                            </Routes>
                        </RetailerLayout>
                    } />
                </Routes>
            </Suspense>

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