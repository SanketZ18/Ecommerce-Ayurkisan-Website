import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, clearAuthData } from '../../utils/auth';
import { FaWhatsapp, FaEnvelope, FaShoppingCart, FaHeart } from 'react-icons/fa';
import logo from '../../assets/Company Logos (1024 × 1024 px).png';
// To avoid a missing CSS file error, I'll define styles inline and use hover effects via CSS injected into head if needed, or just use NavLink's active feature.

const Header = ({ onLoginClick, onSignUpClick }) => {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated();
    const role = getUserRole();
    const [scrollY, setScrollY] = useState(0);

    const handleLogout = () => {
        clearAuthData();
        window.location.href = '/';
    };

    const dashboardRoute = () => {
        switch (role) {
            case 'ADMIN': return '/admin/dashboard';
            case 'CUSTOMER': return '/customer/dashboard';
            case 'RETAILER': return '/retailer/dashboard';
            default: return '/';
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        // Injecting hover styles since inline hover is hard without Radium/styled-components
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            .nav-item-custom {
                position: relative;
                color: var(--text-dark);
                text-decoration: none;
                padding: 0.5rem 0;
                transition: color 0.3s ease;
                font-weight: 500;
            }
            .nav-item-custom::after {
                content: '';
                position: absolute;
                width: 0%;
                height: 2px;
                bottom: 0;
                left: 0;
                background-color: var(--primary-green);
                transition: width 0.3s ease;
            }
            .nav-item-custom:hover::after, .nav-item-custom.active::after {
                width: 100%;
            }
            .nav-item-custom:hover, .nav-item-custom.active {
                color: var(--primary-green);
            }
        `;
        document.head.appendChild(styleSheet);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.head.removeChild(styleSheet);
        };
    }, []);

    const dynamicHeaderStyle = {
        ...headerStyle,
        backgroundColor: scrollY > 50 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: scrollY > 50 ? 'blur(15px)' : 'blur(10px)',
        WebkitBackdropFilter: scrollY > 50 ? 'blur(15px)' : 'blur(10px)',
    };

    return (
        <header className="header" style={dynamicHeaderStyle}>
            <div className="logo">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={logo} alt="Ayurkisan Logo" style={{ height: '50px', objectFit: 'contain' }} />
                </Link>
            </div>

            <nav className="nav-links" style={navStyle}>
                <NavLink to="/" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`} end>Home</NavLink>
                <NavLink to="/products" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>Products</NavLink>
                <NavLink to="/packages" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>Packages</NavLink>
                <NavLink to="/about" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>About</NavLink>
                <NavLink to="/feedback" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>Contact</NavLink>
            </nav>

            <div className="header-actions" style={actionsStyle}>
                {loggedIn && (role === 'CUSTOMER' || role === 'RETAILER') && (
                    <>
                        <Link to="/wishlist" style={{ color: 'var(--text-dark)', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                            <FaHeart size={22} color="#ef4444" />
                        </Link>
                        <Link to="/cart" style={{ color: 'var(--text-dark)', marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                            <FaShoppingCart size={22} color="var(--primary-green)" />
                        </Link>
                    </>
                )}

                <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="btn-whatsapp">
                    <FaWhatsapp size={16} /> WhatsApp
                </a>
                <a href="mailto:info@ayurkisan.com" className="btn-email">
                    <FaEnvelope size={16} /> Email
                </a>

                {loggedIn ? (
                    <>
                        <Link to={dashboardRoute()} className="btn-outline btn-sm">Dashboard</Link>
                        <button className="btn-primary btn-sm" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="btn-outline btn-sm" onClick={onLoginClick}>Login</button>
                        <button className="btn-primary btn-sm" onClick={onSignUpClick}>Sign Up</button>
                    </>
                )}
            </div>
        </header>
    );
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 5%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
};

const navStyle = {
    display: 'flex',
    gap: '2rem',
};

const actionsStyle = {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
};

export default Header;