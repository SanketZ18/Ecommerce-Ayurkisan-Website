import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaHeart, FaUser, FaCaretDown, FaBox, FaUndo, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/Company Logos (1024 × 1024 px).png';
import { clearAuthData } from '../../utils/auth';
import customerService from '../../utils/customerService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const CustomerNavbar = ({ onOpenProfileModal }) => {
    const navigate = useNavigate();
    const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
    const [customerName, setCustomerName] = useState('Customer');
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        // Fetch the user's name to display a personalized welcome message
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const res = await customerService.getProfile(userId);
                    if (res.data && res.data.name) {
                        // Get first name for the top bar
                        setCustomerName(res.data.name.split(' ')[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data for navbar", error);
                // If user is not found (deleted) or unauthorized, logout
                if (error.response && (error.response.status === 401 ||
                    (error.response.data && error.response.data.message && error.response.data.message.includes("not found")))) {
                    const role = localStorage.getItem('role') || 'CUSTOMER';
                    if (role === 'CUSTOMER') {
                        handleLogout();
                    } else {
                        console.info("Retailer accessed customer profile; ignoring logout.");
                    }
                }
            }
        };

        const fetchCounts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const role = localStorage.getItem('role') || 'CUSTOMER';

                // Get Wishlist from local storage
                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                setWishlistCount(wishlist.length);

                // Get Cart from API
                if (userId) {
                    const cartRes = await customerService.getCart(userId, role);
                    setCartCount(cartRes.data?.items?.length || 0);
                }
            } catch (error) {
                console.error("Failed to fetch counts for navbar", error);
                // If user is not found (deleted) or unauthorized, logout
                if (error.response && (error.response.status === 401 ||
                    (error.response.data && error.response.data.message && error.response.data.message.includes("not found")))) {
                    const role = localStorage.getItem('role') || 'CUSTOMER';
                    if (role === 'CUSTOMER') {
                        handleLogout();
                    } else {
                        console.info("Retailer on customer page; ignoring logout for counts fetch.");
                    }
                }
            }
        };

        fetchUserData();
        fetchCounts();

        // Listen for custom events to update counts dynamically
        const handleCartUpdate = () => fetchCounts();
        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('wishlistUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('wishlistUpdated', handleCartUpdate);
        };
    }, []);

    const handleLogout = () => {
        clearAuthData();
        window.location.href = '/';
    };

    return (
        <header style={navStyle}>
            {/* Logo Section */}
            <div style={logoSectionStyle} onClick={() => navigate('/customer/dashboard')}>
                <img src={logo} alt="AyurKisan Logo" style={logoImageStyle} />
                {/* <span style={logoTextStyle}>Home</span>*/}
            </div>

            {/* Search Bar (Amazon style centered) */}
            <div style={searchContainerStyle}>
                <div style={searchWrapperStyle}>
                    <input
                        type="text"
                        placeholder="Search for products (e.g. Neem, Tulsi)..."
                        style={searchInputStyle}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                if (e.target.value.trim() === "") {
                                    toast.warning("Please enter something to search!");
                                    return;
                                }
                                navigate(`/products?search=${e.target.value}`);
                            }
                        }}
                    />
                    <button
                        style={searchButtonStyle}
                        onClick={() => {
                            const input = document.querySelector('input[placeholder*="Search for products"]');
                            if (input && input.value.trim() !== "") {
                                navigate(`/products?search=${input.value}`);
                            } else {
                                toast.warning("Please enter something to search!");
                            }
                        }}
                    >
                        <FaSearch size={18} />
                    </button>
                </div>
            </div>

            {/* Right Nav Items */}
            <div style={rightNavStyle}>

                {/* Account Dropdown */}
                <div
                    style={navItemStyle}
                    onMouseEnter={() => setAccountMenuOpen(true)}
                    onMouseLeave={() => setAccountMenuOpen(false)}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={navSubtextStyle}>Hello, {customerName}</span>
                        <span style={navMainTextStyle}>Account <FaCaretDown size={12} style={{ marginLeft: '4px' }} /></span>
                    </div>

                    <AnimatePresence>
                        {isAccountMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                style={dropdownMenuStyle}
                            >
                                <div style={dropdownHeaderStyle}>Your Account</div>

                                <button className="dropdown-item" onClick={onOpenProfileModal} style={dropdownItemStyle}>
                                    <FaUser style={dropdownIconStyle} /> Profile & Settings
                                </button>

                                <Link to="/customer/orders" className="dropdown-item" style={dropdownItemStyle}>
                                    <FaBox style={dropdownIconStyle} /> My Orders
                                </Link>

                                <Link to="/customer/returns" className="dropdown-item" style={dropdownItemStyle}>
                                    <FaUndo style={dropdownIconStyle} /> Returns & Refunds
                                </Link>

                                <Link to="/customer/wishlist" className="dropdown-item" style={dropdownItemStyle}>
                                    <FaHeart style={dropdownIconStyle} /> Wishlist
                                </Link>

                                <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }}></div>

                                <button className="dropdown-item text-red-600" onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                                    <FaSignOutAlt style={dropdownIconStyle} /> Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Wishlist */}
                <Link to="/customer/wishlist" style={{ ...navItemStyle, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ position: 'relative' }}>
                        <FaHeart size={24} color="#fff" />
                        {wishlistCount > 0 && <span style={cartBadgeStyle}>{wishlistCount}</span>}
                    </div>
                    <span style={navMainTextStyle}>Wishlist</span>
                </Link>

                {/* Cart */}
                <Link to="/cart" style={{ ...navItemStyle, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                        <FaShoppingCart size={32} color="#fff" />
                        {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
                    </div>
                    <span style={{ ...navMainTextStyle, marginTop: '10px' }}>Cart</span>
                </Link>

            </div>
        </header>
    );
};

// Styles
const navStyle = {
    backgroundColor: '#131921', // Amazon-like dark blue/black
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    height: '70px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};

const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    padding: '0 10px',
    marginRight: '15px'
};

const logoImageStyle = {
    height: '40px',
    objectFit: 'contain'
};

const logoTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '1px'
};

const searchContainerStyle = {
    flex: 1,
    padding: '0 20px',
    maxWidth: '800px',
    display: 'flex'
};

const searchWrapperStyle = {
    display: 'flex',
    flex: 1,
    height: '40px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#fff'
};

const categorySelectStyle = {
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRight: '1px solid #cbd5e1',
    padding: '0 10px',
    color: '#334155',
    cursor: 'pointer',
    outline: 'none',
    fontSize: '0.9rem'
};

const searchInputStyle = {
    flex: 1,
    border: 'none',
    padding: '0 15px',
    fontSize: '1rem',
    outline: 'none'
};

const searchButtonStyle = {
    backgroundColor: '#febd69', // Amazon yellow/orange
    border: 'none',
    width: '45px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#333'
};

const rightNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
};

const navItemStyle = {
    padding: '8px 10px',
    border: '1px solid transparent',
    borderRadius: '3px',
    cursor: 'pointer',
    color: '#fff',
    position: 'relative'
};

// CSS trick to add hover effect without styled-components
const createHoverStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        ${Object.keys(navItemStyle).map(k => `.${k}`).join(', ')}:hover { border: 1px solid #fff; }
        .dropdown-item:hover { background-color: #f1f5f9; color: var(--primary-green); }
    `;
    document.head.appendChild(style);
};
createHoverStyle();

const navSubtextStyle = {
    fontSize: '12px',
    lineHeight: '14px',
    color: '#ccc',
    display: 'block'
};

const navMainTextStyle = {
    fontSize: '14px',
    lineHeight: '15px',
    fontWeight: '700',
    display: 'block',
    whiteSpace: 'nowrap'
};

const cartBadgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold'
};

const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#fff',
    color: '#334155',
    width: '240px',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '10px 0',
    marginTop: '5px',
    border: '1px solid #e2e8f0',
    zIndex: 1001
};

const dropdownHeaderStyle = {
    padding: '10px 20px',
    fontWeight: 'bold',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '5px',
    fontSize: '1.1rem'
};

const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    color: '#475569',
    textDecoration: 'none',
    width: '100%',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.95rem'
};

const dropdownIconStyle = {
    marginRight: '12px',
    fontSize: '16px',
    color: '#94a3b8'
};

export default CustomerNavbar;
