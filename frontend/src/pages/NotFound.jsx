import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaLeaf } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div style={containerStyle}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={cardStyle}
            >
                <div style={iconContainerStyle}>
                    <FaLeaf style={leafIconStyle} />
                    <span style={errorCodeStyle}>404</span>
                </div>
                
                <h1 style={titleStyle}>Oops! Page Not Found</h1>
                <p style={descriptionStyle}>
                    The path you are looking for has been moved or doesn't exist. 
                    Let's get you back to the roots of wellness.
                </p>

                <div style={btnContainerStyle}>
                    <Link to="/" style={homeButtonStyle}>
                        <FaHome /> Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

// Styles
const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    fontFamily: "'Poppins', sans-serif",
    padding: '20px'
};

const cardStyle = {
    background: '#fff',
    padding: '3rem',
    borderRadius: '30px',
    boxShadow: '0 20px 50px rgba(5, 150, 105, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
};

const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '20px'
};

const leafIconStyle = {
    fontSize: '3rem',
    color: '#059669'
};

const errorCodeStyle = {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#059669',
    opacity: 0.8
};

const titleStyle = {
    fontSize: '2rem',
    color: '#1e293b',
    fontWeight: '700',
    marginBottom: '10px'
};

const descriptionStyle = {
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '30px'
};

const btnContainerStyle = {
    display: 'flex',
    justifyContent: 'center'
};

const homeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#059669',
    color: '#fff',
    padding: '0.8rem 2rem',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
};

export default NotFound;
