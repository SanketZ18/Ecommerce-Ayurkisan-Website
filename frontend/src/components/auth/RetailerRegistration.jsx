import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE_URL from '../../utils/apiConfig';

const RetailerRegistration = ({ onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        retailerName: '',
        firmName: '',
        registrationId: '',
        address: '',
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            await axios.post(`${API_BASE_URL}/api/auth/retailer/signup`, formData);
            setStatus({ type: 'success', message: 'Retailer registration successful! You can now login.' });
            setFormData({ retailerName: '', firmName: '', registrationId: '', address: '', phoneNumber: '', email: '', password: '' });
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Registration failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

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
            <h2 style={{ marginBottom: '1.5rem', color: '#8b5cf6', textAlign: 'center' }}>Retailer Sign Up</h2>

            {status.message && (
                <div style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    backgroundColor: status.type === 'success' ? '#f5f3ff' : '#fef2f2',
                    color: status.type === 'success' ? '#7c3aed' : '#b91c1c',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Retailer Name</label>
                    <input type="text" name="retailerName" value={formData.retailerName} onChange={handleChange} required placeholder="Ramesh" style={inputStyle} />
                </div>

                <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Firm/Business Name</label>
                    <input type="text" name="firmName" value={formData.firmName} onChange={handleChange} required placeholder="Ramesh Agro" style={inputStyle} />
                </div>

                <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Registration ID / GST</label>
                    <input type="text" name="registrationId" value={formData.registrationId} onChange={handleChange} required placeholder="REG123" style={inputStyle} />
                </div>

                <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Business Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Mumbai, Maharashtra" style={inputStyle} />
                </div>

                <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="9876543210" style={inputStyle} />
                </div>

                <div className="form-group" style={formGroupStyle}>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="retailer@example.com" style={inputStyle} />
                </div>

                <div className="form-group" style={{ ...formGroupStyle, position: 'relative' }}>
                    <label style={labelStyle}>Password</label>
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" minLength={6} style={inputStyle} />
                    <span onClick={togglePassword} style={eyeIconStyle}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ 
                        width: '100%', 
                        marginTop: '1rem', 
                        padding: '0.85rem', 
                        fontSize: '1rem', 
                        borderRadius: '12px',
                        backgroundColor: '#8b5cf6',
                        border: 'none',
                        boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.2)'
                    }} 
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Sign Up as Retailer'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-light)' }}>
                Already have an account? <span onClick={onSwitchToLogin} style={{ color: '#8b5cf6', cursor: 'pointer', fontWeight: 'bold' }}>Login here</span>
            </div>
        </motion.div>
    );
};

const modalStyle = {
    padding: '2.5rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backgroundColor: '#f5f3ff',
    borderTop: '6px solid #8b5cf6',
    maxHeight: '90vh',
    overflowY: 'auto',
    width: '600px',
    maxWidth: '90vw',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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

const formGroupStyle = {
    marginBottom: '1rem'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    color: 'var(--text-light)',
    marginBottom: '0.5rem'
};

const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    outline: 'none',
    backgroundColor: '#ffffff'
};

const eyeIconStyle = {
    position: 'absolute',
    right: '15px',
    top: '38px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6b7280'
};

export default RetailerRegistration;
