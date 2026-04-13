import React, { useState } from 'react';
import axios from 'axios';
import { setAuthData } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUsers, FaStore, FaUserShield } from "react-icons/fa";
import { motion } from 'framer-motion';

const LoginModal = ({ onClose, onSwitchToSignUp, onForgotPassword }) => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'CUSTOMER'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                'http://localhost:9090/api/auth/login',
                formData
            );

            if (response.data && response.data.token) {
                const { token, role, userId } = response.data;
                setAuthData(token, role, userId);
                console.log("New JWT Token set for role:", role);

                const dashboard =
                    role === 'ADMIN' ? '/admin/dashboard'
                        : role === 'RETAILER' ? '/retailer/dashboard'
                            : '/customer/dashboard';

                onClose();
                navigate(dashboard);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getRoleTheme = (role) => {
        switch (role) {
            case 'RETAILER':
                return {
                    primary: '#8b5cf6',
                    light: '#f5f3ff',
                    text: '#7c3aed'
                };
            case 'ADMIN':
                return {
                    primary: '#f97316',
                    light: '#fff7ed',
                    text: '#ea580c'
                };
            default: // CUSTOMER
                return {
                    primary: '#059669',
                    light: '#f0fdf4',
                    text: '#059669'
                };
        }
    };

    const theme = getRoleTheme(formData.role);

    return (
        <motion.div
            className="auth-modal"
            style={{
                ...modalStyle,
                borderTop: `6px solid ${theme.primary}`,
                backgroundColor: theme.light
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            <span
                className="close-btn"
                onClick={onClose}
                style={closeBtnStyle}
            >
                &times;
            </span>

            <h2 style={{ marginBottom: '1.5rem', color: theme.primary, textAlign: 'center' }}>
                Welcome Back
            </h2>

            {error && (
                <div style={{
                    color: '#b91c1c',
                    backgroundColor: '#fef2f2',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label style={{ marginBottom: '1rem', display: 'block' }}>Login As</label>
                    <div style={roleContainerStyle}>
                        {[
                            { id: 'CUSTOMER', label: 'Customer', icon: FaUsers },
                            { id: 'RETAILER', label: 'Retailer', icon: FaStore },
                            { id: 'ADMIN', label: 'Admin', icon: FaUserShield },
                        ].map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setFormData({ ...formData, role: role.id })}
                                style={{
                                    ...roleBoxStyle,
                                    border: formData.role === role.id ? `2px solid ${theme.primary}` : '1px solid #e5e7eb',
                                    backgroundColor: formData.role === role.id ? '#ffffff' : 'transparent',
                                    color: formData.role === role.id ? theme.primary : '#4b5563',
                                    boxShadow: formData.role === role.id ? `0 4px 12px ${theme.primary}20` : 'none'
                                }}
                            >
                                <role.icon style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{role.label}</span>
                                {formData.role === role.id && (
                                    <motion.div
                                        layoutId="activeRole"
                                        style={{
                                            position: 'absolute',
                                            top: -2,
                                            left: -2,
                                            right: -2,
                                            bottom: -2,
                                            border: `2px solid ${theme.primary}`,
                                            borderRadius: '16px',
                                            zIndex: -1
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        style={{
                            ...inputStyle,
                            backgroundColor: '#ffffff'
                        }}
                    />
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                    <label>Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        style={{
                            ...inputStyle,
                            backgroundColor: '#ffffff'
                        }}
                    />
                    <span
                        onClick={togglePassword}
                        style={eyeIconStyle}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                        <span 
                            onClick={onForgotPassword} 
                            style={{ 
                                fontSize: '0.8rem', 
                                color: theme.primary, 
                                cursor: 'pointer', 
                                fontWeight: '500' 
                            }}
                        >
                            Forgot Password?
                        </span>
                    </div>
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
                        backgroundColor: theme.primary,
                        border: 'none',
                        boxShadow: `0 4px 14px 0 ${theme.primary}33`
                    }}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-light)' }}>
                Don't have an account?{' '}
                <span onClick={onSwitchToSignUp} style={{ color: theme.primary, cursor: 'pointer', fontWeight: 'bold' }}>
                    Sign up
                </span>
            </div>
        </motion.div>
    );
};

const modalStyle = {
    padding: '2.5rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '500px',
    maxWidth: '90vw',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative'
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

const eyeIconStyle = {
    position: 'absolute',
    right: '15px',
    top: '40px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6b7280'
};

const roleContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1rem'
};

const roleBoxStyle = {
    padding: '1rem 0.5rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    textAlign: 'center'
};

export default LoginModal;