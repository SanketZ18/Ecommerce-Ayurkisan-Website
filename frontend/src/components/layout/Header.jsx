import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, clearAuthData } from '../../utils/auth';
import { FaWhatsapp, FaEnvelope, FaShoppingCart, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/Company Logos (1024 × 1024 px).png';
import customerService from '../../utils/customerService';
// To avoid a missing CSS file error, I'll define styles inline and use hover effects via CSS injected into head if needed, or just use NavLink's active feature.

const Header = ({ onLoginClick, onSignUpClick }) => {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated();
    const role = getUserRole();
    const [scrollY, setScrollY] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        const fetchCartCount = async () => {
            if (loggedIn && (role === 'CUSTOMER' || role === 'RETAILER' || role === 'Customer')) {
                try {
                    const userId = localStorage.getItem('userId');
                    const res = await customerService.getCart(userId, role);
                    setCartCount(res.data?.items?.length || 0);
                } catch (e) {
                    console.error('Failed to fetch cart count', e);
                    setCartCount(0);
                }
            }
        };

        fetchCartCount();

        const handleCartUpdated = () => {
            fetchCartCount();
        };

        window.addEventListener('cartUpdated', handleCartUpdated);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdated);
        };
    }, [loggedIn, role]);

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

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMobileMenu = () => setMobileMenuOpen(false);


    const dynamicHeaderStyle = {
        ...headerStyle,
        backgroundColor: scrollY > 50 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: scrollY > 50 ? 'blur(15px)' : 'blur(10px)',
        WebkitBackdropFilter: scrollY > 50 ? 'blur(15px)' : 'blur(10px)',
    };

    return (
        <header className="header" style={dynamicHeaderStyle}>
            <div className="logo">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={closeMobileMenu}>
                    <img src={logo} alt="Ayurkisan Logo" style={logoStyle} />
                </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="nav-links hide-on-mobile" style={navStyle}>
                <NavLink to="/" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`} end>Home</NavLink>
                <NavLink to="/products" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>Products</NavLink>
                <NavLink to="/packages" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>Packages</NavLink>
                <NavLink to="/about" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>About</NavLink>
                <NavLink to="/feedback" className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>Contact</NavLink>
            </nav>

            <div className="header-actions" style={actionsStyle}>
                <div className="hide-on-mobile" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {loggedIn && (role === 'CUSTOMER' || role === 'RETAILER') && (
                        <>
                            <Link to="/wishlist" style={{ color: 'var(--text-dark)', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                <FaHeart size={22} color="#ef4444" />
                            </Link>
                            <Link to="/cart" style={{ color: 'var(--text-dark)', marginRight: '15px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                                <FaShoppingCart size={22} color="var(--primary-green)" />
                                {cartCount > 0 && (
                                    <span style={badgeStyle}>
                                        {cartCount}
                                    </span>
                                )}
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

                {/* Mobile Icons (Always visible on mobile) */}
                <div className="show-on-mobile" style={{ display: 'none', gap: '1rem', alignItems: 'center' }}>
                    {loggedIn && (role === 'CUSTOMER' || role === 'RETAILER') && (
                        <Link to="/cart" style={{ position: 'relative', color: 'var(--primary-green)' }}>
                            <FaShoppingCart size={24} />
                            {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
                        </Link>
                    )}
                    <button onClick={toggleMobileMenu} style={hamburgerButtonStyle}>
                        {mobileMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div style={mobileOverlayStyle}>
                    <nav style={mobileNavStyle}>
                        <NavLink to="/" onClick={closeMobileMenu} style={mobileLinkStyle}>Home</NavLink>
                        <NavLink to="/products" onClick={closeMobileMenu} style={mobileLinkStyle}>Products</NavLink>
                        <NavLink to="/packages" onClick={closeMobileMenu} style={mobileLinkStyle}>Packages</NavLink>
                        <NavLink to="/about" onClick={closeMobileMenu} style={mobileLinkStyle}>About</NavLink>
                        <NavLink to="/feedback" onClick={closeMobileMenu} style={mobileLinkStyle}>Contact</NavLink>
                        
                        <hr style={{ border: '0', borderTop: '1px solid #eee', width: '100%', margin: '1rem 0' }} />
                        
                        {loggedIn ? (
                            <>
                                <Link to={dashboardRoute()} onClick={closeMobileMenu} style={mobileLinkStyle}>Dashboard</Link>
                                <button className="btn-primary" onClick={() => { handleLogout(); closeMobileMenu(); }} style={{ width: '100%', marginTop: '1rem' }}>Logout</button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                                <button className="btn-outline" onClick={() => { onLoginClick(); closeMobileMenu(); }}>Login</button>
                                <button className="btn-primary" onClick={() => { onSignUpClick(); closeMobileMenu(); }}>Sign Up</button>
                            </div>
                        )}
                        
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" style={mobileIconLink}>
                                <FaWhatsapp size={20} />
                            </a>
                            <a href="mailto:info@ayurkisan.com" style={mobileIconLink}>
                                <FaEnvelope size={20} />
                            </a>
                        </div>
                    </nav>
                </div>
            )}
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

const logoStyle = {
    height: '45px',
    objectFit: 'contain'
};

const badgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
};

const hamburgerButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--primary-green)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px'
};

const mobileOverlayStyle = {
    position: 'fixed',
    top: '70px',
    left: 0,
    width: '100%',
    height: 'calc(100vh - 70px)',
    backgroundColor: 'white',
    zIndex: 999,
    padding: '2rem 5%',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 0.3s ease-out'
};

const mobileNavStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
    width: '100%'
};

const mobileLinkStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--text-dark)',
    textDecoration: 'none',
    width: '100%',
    padding: '0.5rem 0'
};

const mobileIconLink = {
    backgroundColor: '#f0fdf4',
    color: 'var(--primary-green)',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s'
};


export default Header;