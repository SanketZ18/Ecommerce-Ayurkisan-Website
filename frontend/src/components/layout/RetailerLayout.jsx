import React, { useState } from 'react';
import RetailerNavbar from '../retailer/RetailerNavbar';
import { AnimatePresence } from 'framer-motion';
import RetailerProfileModal from '../retailer/RetailerProfileModal';

const RetailerLayout = ({ children }) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    return (
        <div style={layoutStyle}>
            {/* Top Navigation Bar */}
            <RetailerNavbar onOpenProfileModal={() => setIsProfileModalOpen(true)} />

            {/* Main Content Area */}
            <main style={contentStyle}>
                {children}
            </main>

            {/* Account Management Modal */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <RetailerProfileModal onClose={() => setIsProfileModalOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9', // Slate tint
};

const contentStyle = {
    flex: 1,
    padding: '0',
    width: '100%',
    margin: '0 auto',
};

export default RetailerLayout;
