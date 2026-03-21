import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaFileContract, FaTruck, FaUndo, FaArrowLeft } from 'react-icons/fa';

const LegalPolicies = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const getContent = () => {
        switch (pathname) {
            case '/policy':
                return {
                    title: "Privacy Policy",
                    icon: <FaShieldAlt />,
                    content: (
                        <>
                            <p>At Ayurkisan, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website.</p>
                            <h3>1. Information We Collect</h3>
                            <p>We collect information you provide directly to us (name, email, shipping address) and automated data (IP address, cookies) to improve your experience.</p>
                            <h3>2. How We Use Your Data</h3>
                            <p>Your data is used to process orders, communicate updates, and personalize your shopping experience. We do not sell your data to third parties.</p>
                            <h3>3. Security</h3>
                            <p>We implement industry-standard security measures to protect your personal information from unauthorized access.</p>
                        </>
                    )
                };
            case '/terms':
                return {
                    title: "Terms & Conditions",
                    icon: <FaFileContract />,
                    content: (
                        <>
                            <p>By using Ayurkisan's website and services, you agree to comply with the following terms and conditions.</p>
                            <h3>1. Account Use</h3>
                            <p>You are responsible for maintaining the confidentiality of your account and password. Activities under your account are your responsibility.</p>
                            <h3>2. Product Information</h3>
                            <p>We strive for accuracy, but we do not warrant that product descriptions or other content are error-free. Ayurvedic results may vary.</p>
                            <h3>3. Intellectual Property</h3>
                            <p>All content on this site is the property of Ayurkisan and protected by copyright laws.</p>
                        </>
                    )
                };
            case '/shipping':
                return {
                    title: "Shipping Policy",
                    icon: <FaTruck />,
                    content: (
                        <>
                            <p>We aim to deliver your wellness products as quickly and safely as possible.</p>
                            <h3>1. Delivery Timelines</h3>
                            <p>Orders are typically processed within 24-48 hours. Standard delivery takes 3-7 business days across India.</p>
                            <h3>2. Shipping Charges</h3>
                            <p>Free shipping on orders above ₹500. A nominal fee of ₹50 applies to orders below this amount.</p>
                            <h3>3. Tracking</h3>
                            <p>Once shipped, you will receive a tracking ID via email/SMS to monitor your package's progress.</p>
                        </>
                    )
                };
            case '/returns':
                return {
                    title: "Return Policy",
                    icon: <FaUndo />,
                    content: (
                        <>
                            <p>Your satisfaction is our priority. If you are not happy with your purchase, we are here to help.</p>
                            <h3>1. Return Window</h3>
                            <p>Items can be returned within 7 days of delivery if they are unused and in original packaging.</p>
                            <h3>2. Non-Returnable Items</h3>
                            <p>For hygiene reasons, opened health supplements or personal care products cannot be returned.</p>
                            <h3>3. Refund Process</h3>
                            <p>Once the return is verified, your refund will be processed to the original payment method within 5-10 business days.</p>
                        </>
                    )
                };
            default:
                return null;
        }
    };

    const data = getContent();

    if (!data) return <div style={{ padding: '100px', textAlign: 'center' }}>Page not found.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={containerStyle}
        >
            <div style={headerStyle}>
                <Link to="/" style={backLinkStyle}><FaArrowLeft /> Back to Home</Link>
                <div style={iconWrapperStyle}>{data.icon}</div>
                <h1 style={titleStyle}>{data.title}</h1>
            </div>

            <div style={contentCardStyle}>
                {data.content}
                <div style={metaStyle}>
                    Last Updated: March 2026
                </div>
            </div>
        </motion.div>
    );
};

const containerStyle = {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    minHeight: '70vh'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
};

const backLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--primary-green)',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.9rem',
    marginBottom: '20px',
    width: 'fit-content'
};

const iconWrapperStyle = {
    fontSize: '3rem',
    color: 'var(--primary-green)',
    marginBottom: '10px'
};

const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    margin: 0
};

const contentCardStyle = {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    lineHeight: '1.6',
    color: '#4b5563'
};

const metaStyle = {
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #f3f4f6',
    fontSize: '0.85rem',
    color: '#9ca3af',
    textAlign: 'center'
};

export default LegalPolicies;
