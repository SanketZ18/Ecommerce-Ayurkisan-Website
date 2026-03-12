import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer" style={footerContainerStyle}>
            <div className="footer-content" style={contentStyle}>

                <div className="footer-brand" style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                        {/* The user provided a fallback logo behavior or path */}
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-bg)' }}>Ayurkisan 🌿</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#c8e6c9' }}>
                        Premium Ayurvedic and Herbal wellness products crafted with purity, authenticity, and care.
                    </p>
                </div>

                <div className="footer-links" style={sectionStyle}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--white)' }}>Quick Links</h4>
                    <Link to="/" style={linkStyle}>Home</Link>
                    <Link to="/products" style={linkStyle}>Shop</Link>
                    <Link to="/about" style={linkStyle}>About Us</Link>
                    <Link to="/feedback" style={linkStyle}>Contact</Link>
                </div>

                <div className="footer-legal" style={sectionStyle}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--white)' }}>Support</h4>
                    <Link to="/policy" style={linkStyle}>Privacy Policy</Link>
                    <Link to="/terms" style={linkStyle}>Terms & Conditions</Link>
                    <Link to="/shipping" style={linkStyle}>Shipping Policy</Link>
                    <Link to="/returns" style={linkStyle}>Return Policy</Link>
                </div>

                <div className="footer-contact" style={sectionStyle}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--white)' }}>Contact</h4>
                    <p style={linkStyle}>Email: support@ayurkisan.com</p>
                    <p style={linkStyle}>Phone: +91 98765 43210</p>
                    <p style={linkStyle}>India IN</p>
                </div>

            </div>

            <div className="footer-bottom" style={bottomStyle}>
                <p>© 2026 Ayurkisan. All rights reserved.</p>
            </div>
        </footer>
    );
};

// Styles
const footerContainerStyle = {
    background: 'linear-gradient(90deg, #16a34a, #047857)',
    color: 'var(--white)',
    paddingTop: '3rem',
    marginTop: '4rem',
};

const contentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '2rem',
    padding: '0 5% 3rem 5%',
};

const sectionStyle = {
    flex: '1',
    minWidth: '200px',
};

const linkStyle = {
    display: 'block',
    color: '#c8e6c9',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'color 0.3s',
};

const bottomStyle = {
    backgroundColor: '#1b4028',
    textAlign: 'center',
    padding: '1.5rem',
    fontSize: '0.8rem',
    color: '#c8e6c9',
};

export default Footer;
