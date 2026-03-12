import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaStore } from 'react-icons/fa';

const SignUpSelection = ({ onClose, onSelectCustomer, onSelectRetailer, onSwitchToLogin }) => {
    return (
        <motion.div
            className="auth-modal"
            style={modalStyle}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            <span className="close-btn" onClick={onClose} style={closeBtnStyle}>&times;</span>

            <div style={headerStyle}>
                <h2 style={{ margin: 0, color: 'var(--primary-green)' }}>Join Ayurkisan</h2>
                <p style={{ color: 'var(--text-light)', marginTop: '5px' }}>Select your account type to continue</p>
            </div>

            <div style={cardContainerStyle}>
                <motion.div
                    style={cardStyle}
                    onClick={onSelectCustomer}
                    whileHover={{ scale: 1.02, borderColor: 'var(--secondary-bg)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div style={{ ...iconContainerStyle, backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        <FaUserCircle size={32} />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem', color: 'var(--text-dark)' }}>Individual Customer</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>Shop premium herbal products for personal use.</p>
                    </div>
                </motion.div>

                <motion.div
                    style={cardStyle}
                    onClick={onSelectRetailer}
                    whileHover={{ scale: 1.02, borderColor: 'var(--secondary-bg)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div style={{ ...iconContainerStyle, backgroundColor: '#fef3c7', color: '#d97706' }}>
                        <FaStore size={32} />
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem', color: 'var(--text-dark)' }}>Retailer / Bulk Buyer</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>Gain access to bulk pricing and wholesale features.</p>
                    </div>
                </motion.div>
            </div>

            <div style={footerStyle}>
                Already have an account?{' '}
                <span onClick={onSwitchToLogin} style={linkStyle}>
                    Login here
                </span>
            </div>
        </motion.div>
    );
};

const modalStyle = {
    padding: '2.5rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    borderTop: '6px solid var(--secondary-bg)',
    backgroundColor: '#ffffff'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
};

const closeBtnStyle = {
    position: 'absolute',
    top: '20px',
    right: '25px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'color 0.2s',
};

const cardContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
};

const cardStyle = {
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    padding: '1.5rem',
    cursor: 'pointer',
    backgroundColor: 'var(--white)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'border-color 0.3s',
};

const iconContainerStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
};

const footerStyle = {
    marginTop: '2rem',
    fontSize: '0.95rem',
    textAlign: 'center',
    color: 'var(--text-light)'
};

const linkStyle = {
    color: 'var(--primary-green)',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'none',
};

export default SignUpSelection;
