import React, { useState } from 'react';
import CustomerNavbar from '../customer/CustomerNavbar';
import { AnimatePresence } from 'framer-motion';
// Temporary mock of modal until it is fully rebuilt below
import CustomerProfileModal from '../customer/CustomerProfileModal';

const CustomerLayout = ({ children }) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    return (
        <div style={layoutStyle}>
            {/* Top Navigation Bar */}
            <CustomerNavbar onOpenProfileModal={() => setIsProfileModalOpen(true)} />

            {/* Main Content Area */}
            <main style={contentStyle}>
                {children}
            </main>

            {/* Global Modals for this Layout */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <CustomerProfileModal onClose={() => setIsProfileModalOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#eaeded' // Amazon-like background color
};

const contentStyle = {
    flex: 1,
    padding: '0', // Children will handle their own padding
    width: '100%',
    margin: '0 auto',
};

export default CustomerLayout;
