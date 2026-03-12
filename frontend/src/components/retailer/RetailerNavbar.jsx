import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaCaretDown, FaBox, FaUndo, FaSignOutAlt, FaChartBar, FaWarehouse } from 'react-icons/fa';
import logo from '../../assets/Company Logos (1024 × 1024 px).png';
import { clearAuthData } from '../../utils/auth';
import retailerService from '../../utils/retailerService';
import { motion, AnimatePresence } from 'framer-motion';

const RetailerNavbar = ({ onOpenProfileModal }) => {
    const navigate = useNavigate();
    const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
    const [retailerName, setRetailerName] = useState('Retailer');

    useEffect(() => {
        const fetchRetailerData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const res = await retailerService.getProfile(userId);
                    if (res.data && res.data.name) {
                        setRetailerName(res.data.name.split(' ')[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch retailer data for navbar", error);
            }
        };

        fetchRetailerData();
    }, []);

    const handleLogout = () => {
        clearAuthData();
        window.location.href = '/';
    };

    return (
        <header style={navStyle}>
            <div style={logoSectionStyle} onClick={() => navigate('/retailer/dashboard')}>
                <img src={logo} alt="AyurKisan Logo" style={logoImageStyle} />
                <div style={logoTextContainerStyle}>
                    <span style={logoTextStyle}>AyurKisan</span>
                    <span style={retailerTagStyle}>Business Hub</span>
                </div>
            </div>

            <div style={searchContainerStyle}>
                <div style={searchWrapperStyle}>
                    <input
                        type="text"
                        placeholder="Search Wholesale Catalog (SKU, Name)..."
                        style={searchInputStyle}
                    />
                    <button style={searchButtonStyle}>
                        <FaSearch size={18} />
                    </button>
                </div>
            </div>

            <div style={rightNavStyle}>

                <div
                    style={navItemStyle}
                    onMouseEnter={() => setAccountMenuOpen(true)}
                    onMouseLeave={() => setAccountMenuOpen(false)}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={navSubtextStyle}>Retailer</span>
                        <span style={navMainTextStyle}>{retailerName} <FaCaretDown size={12} style={{ marginLeft: '4px' }} /></span>
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
                                <div style={dropdownHeaderStyle}>Business Account</div>

                                <button className="dropdown-item" onClick={onOpenProfileModal} style={dropdownItemStyle}>
                                    <FaWarehouse style={dropdownIconStyle} /> Company Profile
                                </button>

                                <Link to="/retailer/orders" className="dropdown-item" style={dropdownItemStyle}>
                                    <FaBox style={dropdownIconStyle} /> Bulk Orders
                                </Link>

                                <Link to="/retailer/dashboard" className="dropdown-item" style={dropdownItemStyle}>
                                    <FaChartBar style={dropdownIconStyle} /> Analytics Dashboard
                                </Link>

                                <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }}></div>

                                <button className="dropdown-item text-red-600" onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                                    <FaSignOutAlt style={dropdownIconStyle} /> Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Link to="/retailer/orders" style={{ ...navItemStyle, textDecoration: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={navSubtextStyle}>Manage</span>
                        <span style={navMainTextStyle}>Shipments</span>
                    </div>
                </Link>

                <Link to="/cart" style={{ ...navItemStyle, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative' }}>
                        <FaShoppingCart size={28} color="#fff" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={navSubtextStyle}>Wholesale</span>
                        <span style={navMainTextStyle}>Cart</span>
                    </div>
                </Link>

            </div>
        </header>
    );
};

const navStyle = {
    backgroundColor: '#0f172a', // Sleek Navy/Slate for Business feel
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '10px 24px',
    height: '70px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
};

const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer'
};

const logoImageStyle = {
    height: '42px',
    objectFit: 'contain'
};

const logoTextContainerStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const logoTextStyle = {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: '1.1'
};

const retailerTagStyle = {
    fontSize: '0.7rem',
    color: '#38bdf8', // Light blue tint for business
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '700'
};

const searchContainerStyle = {
    flex: 1,
    padding: '0 40px',
    maxWidth: '700px'
};

const searchWrapperStyle = {
    display: 'flex',
    height: '42px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    border: '2px solid #334155'
};

const searchInputStyle = {
    flex: 1,
    border: 'none',
    padding: '0 15px',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#1e293b'
};

const searchButtonStyle = {
    backgroundColor: '#38bdf8',
    border: 'none',
    width: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#0f172a'
};

const rightNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
};

const navItemStyle = {
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#fff',
    position: 'relative',
    transition: 'background-color 0.2s',
    border: '1px solid transparent'
};

const navSubtextStyle = {
    fontSize: '11px',
    color: '#94a3b8',
    display: 'block'
};

const navMainTextStyle = {
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap'
};

const dropdownMenuStyle = {
    position: 'absolute',
    top: '110%',
    right: '0',
    backgroundColor: '#fff',
    color: '#334155',
    width: '260px',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    padding: '12px 0',
    border: '1px solid #e2e8f0',
    zIndex: 1001
};

const dropdownHeaderStyle = {
    padding: '0 20px 10px 20px',
    fontWeight: 'bold',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '8px',
    fontSize: '1rem',
    color: '#0f172a'
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
    fontSize: '0.9rem',
    transition: 'background-color 0.2s'
};

const dropdownIconStyle = {
    marginRight: '12px',
    fontSize: '16px',
    color: '#38bdf8'
};

// Injection for hover
const style = document.createElement('style');
style.innerHTML = `
    .nav-item:hover { background-color: rgba(255,255,255,0.05); }
    .dropdown-item:hover { background-color: #f8fafc; color: #38bdf8; }
`;
document.head.appendChild(style);

export default RetailerNavbar;
