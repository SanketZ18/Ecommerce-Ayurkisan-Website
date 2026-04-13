import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaKey, FaLock, FaCheckCircle, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPasswordModal = ({ onClose, onSwitchToLogin }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:9090/api/auth/forgot-password', { email, role });
            setMessage(response.data);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post('http://localhost:9090/api/auth/verify-otp', { email, otp });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.post('http://localhost:9090/api/auth/reset-password', { email, newPassword, role });
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const themeColor = role === 'ADMIN' ? '#f97316' : role === 'RETAILER' ? '#8b5cf6' : '#059669';

    return (
        <motion.div
            className="auth-modal"
            style={{
                ...modalStyle,
                borderTop: `6px solid ${themeColor}`,
                backgroundColor: '#ffffff'
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
            <span className="close-btn" onClick={onClose} style={closeBtnStyle}>&times;</span>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: themeColor }}>Reset Password</h2>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    {step === 1 && "Enter your registered email to receive an OTP"}
                    {step === 2 && "Enter the 6-digit code sent to your email"}
                    {step === 3 && "Create a new strong password"}
                    {step === 4 && "Password reset successful!"}
                </p>
            </div>

            {error && (
                <div style={errorStyle}>{error}</div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.form key="step1" onSubmit={handleSendOtp} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="form-group">
                            <label>Login Role</label>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="RETAILER">Retailer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={iconStyle} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="yourname@example.com"
                                    style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} style={{ ...buttonStyle, backgroundColor: themeColor }}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </motion.form>
                )}

                {step === 2 && (
                    <motion.form key="step2" onSubmit={handleVerifyOtp} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="form-group">
                            <label>Verification Code</label>
                            <div style={{ position: 'relative' }}>
                                <FaKey style={iconStyle} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength="6"
                                    placeholder="Enter 6-digit OTP"
                                    style={{ ...inputStyle, paddingLeft: '2.5rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold' }}
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} style={{ ...buttonStyle, backgroundColor: themeColor }}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                            Didn't receive code? <span style={{ color: themeColor, cursor: 'pointer' }} onClick={handleSendOtp}>Resend</span>
                        </p>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.form key="step3" onSubmit={handleResetPassword} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="form-group">
                            <label>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={iconStyle} />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Min 6 characters"
                                    style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                />
                                <span 
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={eyeIconStyle}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={iconStyle} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Repeat new password"
                                    style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                />
                                <span 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={eyeIconStyle}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} style={{ ...buttonStyle, backgroundColor: themeColor }}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </motion.form>
                )}

                {step === 4 && (
                    <motion.div key="step4" style={{ textAlign: 'center' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <FaCheckCircle style={{ fontSize: '4rem', color: '#059669', marginBottom: '1rem' }} />
                        <h3>Successfully Reset!</h3>
                        <p style={{ margin: '1rem 0' }}>Your password has been updated. You can now login with your new credentials.</p>
                        <button onClick={onSwitchToLogin} style={{ ...buttonStyle, backgroundColor: '#059669' }}>
                            Go to Login
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {step < 4 && (
                <div 
                    onClick={onSwitchToLogin} 
                    style={{ 
                        marginTop: '1.5rem', 
                        fontSize: '0.9rem', 
                        textAlign: 'center', 
                        color: themeColor, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <FaArrowLeft /> Back to Login
                </div>
            )}
        </motion.div>
    );
};

const modalStyle = {
    padding: '2.5rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '450px',
    maxWidth: '90vw',
    position: 'relative'
};

const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontSize: '1rem'
};

const buttonStyle = {
    width: '100%',
    padding: '0.85rem',
    fontSize: '1rem',
    borderRadius: '12px',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '1rem',
    transition: 'all 0.2s'
};

const closeBtnStyle = {
    position: 'absolute',
    top: '20px',
    right: '25px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#9ca3af'
};

const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
};

const eyeIconStyle = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6b7280'
};

const errorStyle = {
    color: '#b91c1c',
    backgroundColor: '#fef2f2',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
    fontSize: '0.85rem'
};

export default ForgotPasswordModal;
