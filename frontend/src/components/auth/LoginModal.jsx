import React, { useState } from 'react';
import axios from 'axios';
import { setAuthData } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from 'framer-motion';

const LoginModal = ({ onClose, onSwitchToSignUp }) => {

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

    return (
        <motion.div
            className="auth-modal"
            style={modalStyle}
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

            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-green)', textAlign: 'center' }}>
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
                    <label>Login As</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="RETAILER">Retailer</option>
                        <option value="ADMIN">Admin</option>
                    </select>
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
                        style={inputStyle}
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
                        style={inputStyle}
                    />
                    <span
                        onClick={togglePassword}
                        style={eyeIconStyle}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem', borderRadius: '12px' }}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-light)' }}>
                Don't have an account?{' '}
                <span onClick={onSwitchToSignUp} style={{ color: 'var(--primary-green)', cursor: 'pointer', fontWeight: 'bold' }}>
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
    backgroundColor: '#ffffff',
    borderTop: '6px solid var(--primary-green)',
    width: '500px',
    maxWidth: '90vw'
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

export default LoginModal;