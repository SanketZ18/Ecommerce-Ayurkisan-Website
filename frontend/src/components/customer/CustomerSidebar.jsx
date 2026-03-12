import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaBox, FaUndo, FaHeart, FaSignOutAlt, FaStore } from 'react-icons/fa';
import logo from '../../assets/Company Logos (1024 × 1024 px).png';

const CustomerSidebar = ({ isOpen, onLogout }) => {
    return (
        <div style={{ ...sidebarStyle, transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
            <div style={logoContainerStyle}>
                <img src={logo} alt="Logo" style={logoStyle} />
                <h3 style={brandStyle}>My Account</h3>
            </div>

            <nav style={navStyle}>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        style={({ isActive }) => ({
                            ...linkStyle,
                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            borderLeft: isActive ? '4px solid #facc15' : '4px solid transparent'
                        })}
                    >
                        <item.icon style={{ marginRight: '15px' }} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div style={footerStyle}>
                <button onClick={onLogout} style={logoutBtnStyle}>
                    <FaSignOutAlt style={{ marginRight: '10px' }} /> Logout
                </button>
            </div>
        </div>
    );
};

const menuItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: FaTachometerAlt },
    { name: 'My Profile', path: '/customer/profile', icon: FaUser },
    { name: 'My Orders', path: '/customer/orders', icon: FaBox },
    { name: 'My Returns', path: '/customer/returns', icon: FaUndo },
    { name: 'Wishlist', path: '/wishlist', icon: FaHeart },
    { name: 'Back to Shop', path: '/products', icon: FaStore },
];

const sidebarStyle = {
    width: '250px',
    backgroundColor: '#047857', // Slightly different shade of green for customer
    color: '#fff',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 1000
};

const logoContainerStyle = {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const logoStyle = {
    height: '40px',
    objectFit: 'contain'
};

const brandStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#facc15'
};

const navStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    overflowY: 'auto'
};

const linkStyle = {
    padding: '12px 20px',
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    transition: 'all 0.2s ease',
};


const footerStyle = {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
};

const logoutBtnStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    transition: 'background-color 0.2s',
};

export default CustomerSidebar;
