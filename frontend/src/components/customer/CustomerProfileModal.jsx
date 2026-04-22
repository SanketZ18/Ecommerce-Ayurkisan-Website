import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaLock, FaSave, FaTimes } from 'react-icons/fa';
import customerService from '../../utils/customerService';
import { toast } from 'react-toastify';
import maharashtraData from '../../utils/maharashtraData.json';

const CustomerProfileModal = ({ onClose }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        addressLine1: '',
        state: 'Maharashtra',
        district: '',
        taluka: ''
    });

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadProfile();

        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const loadProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;
            const res = await customerService.getProfile(userId);
            const data = res.data;
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                addressLine1: data.addressLine1 || '',
                state: data.state || 'Maharashtra',
                district: data.district || '',
                taluka: data.taluka || ''
            });
        } catch (error) {
            console.error("Failed to load profile", error);
            toast.error("Could not load profile details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const userId = localStorage.getItem('userId');
            await customerService.updateProfile(userId, {
                name: profile.name,
                phoneNumber: profile.phoneNumber,
                addressLine1: profile.addressLine1,
                state: profile.state,
                district: profile.district,
                taluka: profile.taluka
            });
            toast.success("Profile updated successfully!");
            onClose(); // Auto close on success
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        setIsSaving(true);
        try {
            const userId = localStorage.getItem('userId');
            await customerService.changePassword(userId, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            toast.success("Password changed successfully!");
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value,
            // Reset taluka if district changes
            ...(name === 'district' ? { taluka: '' } : {})
        }));
    };

    return (
        <div style={overlayStyle}>
            {/* Click outside to close */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={backdropStyle}
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={modalContainerStyle}
            >
                <div style={modalHeaderStyle}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>Account Settings</h2>
                    <button onClick={onClose} style={closeButtonStyle}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div style={tabsContainerStyle}>
                    <button
                        style={{ ...tabStyle, borderBottomColor: activeTab === 'profile' ? '#131921' : 'transparent', color: activeTab === 'profile' ? '#131921' : '#64748b' }}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUserEdit style={{ marginRight: '8px' }} /> Personal Info
                    </button>
                    <button
                        style={{ ...tabStyle, borderBottomColor: activeTab === 'security' ? '#131921' : 'transparent', color: activeTab === 'security' ? '#131921' : '#64748b' }}
                        onClick={() => setActiveTab('security')}
                    >
                        <FaLock style={{ marginRight: '8px' }} /> Security
                    </button>
                </div>

                <div style={modalBodyStyle}>
                    {isLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading your details...</div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' ? (
                                <motion.form
                                    key="profile"
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleProfileUpdate}
                                >
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Full Name</label>
                                        <input type="text" name="name" value={profile.name} onChange={handleInputChange} required style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Email Address (Cannot be changed)</label>
                                        <input type="email" value={profile.email} disabled style={{ ...inputStyle, backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' }} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Phone Number</label>
                                        <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleInputChange} required style={inputStyle} />
                                    </div>

                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Address Line 1 (H.No, Building, Street, Landmark)</label>
                                        <input type="text" name="addressLine1" value={profile.addressLine1} onChange={handleInputChange} required style={inputStyle} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={formGroupStyle}>
                                            <label style={labelStyle}>State</label>
                                            <select name="state" value={profile.state} onChange={handleInputChange} required style={inputStyle}>
                                                <option value="Maharashtra">Maharashtra</option>
                                            </select>
                                        </div>

                                        <div style={formGroupStyle}>
                                            <label style={labelStyle}>District</label>
                                            <select name="district" value={profile.district} onChange={handleInputChange} required style={inputStyle}>
                                                <option value="">Select District</option>
                                                {Object.keys(maharashtraData["Maharashtra"]).map(dist => (
                                                    <option key={dist} value={dist}>{dist}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Taluka / Sub-District</label>
                                        <select name="taluka" value={profile.taluka} onChange={handleInputChange} required style={inputStyle} disabled={!profile.district}>
                                            <option value="">Select Taluka</option>
                                            {profile.district && maharashtraData["Maharashtra"][profile.district].map(tal => (
                                                <option key={tal} value={tal}>{tal}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" disabled={isSaving} style={saveButtonStyle}>
                                        <FaSave /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handlePasswordUpdate}
                                >
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Current Password</label>
                                        <input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} required style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>New Password</label>
                                        <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength="6" style={inputStyle} />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Confirm New Password</label>
                                        <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required minLength="6" style={inputStyle} />
                                    </div>
                                    <button type="submit" disabled={isSaving} style={saveButtonStyle}>
                                        <FaLock /> {isSaving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Styles
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
};

const backdropStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
};

const modalContainerStyle = {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    zIndex: 10000,
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #f1f5f9',
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s, color 0.2s',
};

// CSS injection for hover effect on close button
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  button:hover svg { color: #ef4444; }
`;
document.head.appendChild(styleSheet);


const tabsContainerStyle = {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 24px',
};

const tabStyle = {
    flex: 1,
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
};

const modalBodyStyle = {
    padding: '24px',
    overflowY: 'auto',
};

const formGroupStyle = {
    marginBottom: '1rem',
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#475569',
    fontSize: '0.9rem',
    fontWeight: '500',
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const saveButtonStyle = {
    width: '100%',
    backgroundColor: '#febd69', // Amazon Yellow
    color: '#131921',
    fontWeight: 'bold',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '1rem',
    marginTop: '1.5rem',
    transition: 'opacity 0.2s',
};

export default CustomerProfileModal;
