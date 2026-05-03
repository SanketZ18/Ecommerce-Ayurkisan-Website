import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWarehouse, FaLock, FaSave, FaTimes, FaBuilding, FaPhone } from 'react-icons/fa';
import retailerService from '../../utils/retailerService';
import { toast } from 'react-toastify';
import maharashtraData from '../../utils/maharashtraData.json';

const RetailerProfileModal = ({ onClose }) => {
    const [profile, setProfile] = useState({
        retailerName: '',
        firmName: '',
        registrationId: '',
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
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const loadProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;
            const res = await retailerService.getProfile(userId);
            const data = res.data;
            setProfile({
                retailerName: data.retailerName || '',
                firmName: data.firmName || '',
                registrationId: data.registrationId || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                addressLine1: data.addressLine1 || '',
                state: data.state || 'Maharashtra',
                district: data.district || '',
                taluka: data.taluka || ''
            });
        } catch (error) {
            console.error("Failed to load retailer profile", error);
            toast.error("Could not load business details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const userId = localStorage.getItem('userId');
            await retailerService.updateProfile(userId, {
                retailerName: profile.retailerName,
                firmName: profile.firmName,
                registrationId: profile.registrationId,
                phoneNumber: profile.phoneNumber,
                addressLine1: profile.addressLine1,
                state: profile.state,
                district: profile.district,
                taluka: profile.taluka
            });
            toast.success("Business profile updated!");
            onClose();
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsSaving(true);
        try {
            const userId = localStorage.getItem('userId');
            await retailerService.changePassword(userId, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            toast.success("Password updated successfully!");
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
            const val = value.replace(/\D/g, ''); // Allow only digits
            if (val.length > 0 && !['7', '8', '9'].includes(val[0])) return; // Must start with 7, 8, or 9
            if (val.length > 10) return; // Max 10 digits
            setProfile(prev => ({ ...prev, [name]: val }));
        } else {
            setProfile(prev => ({
                ...prev,
                [name]: value,
                ...(name === 'district' ? { taluka: '' } : {})
            }));
        }
    };

    return (
        <div style={overlayStyle}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaWarehouse color="#38bdf8" size={24} />
                        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>Business Settings</h2>
                    </div>
                    <button onClick={onClose} style={closeButtonStyle}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div style={tabsContainerStyle}>
                    <button
                        style={{ ...tabStyle, borderBottomColor: activeTab === 'profile' ? '#38bdf8' : 'transparent', color: activeTab === 'profile' ? '#0f172a' : '#64748b' }}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaBuilding style={{ marginRight: '8px' }} /> Profile
                    </button>
                    <button
                        style={{ ...tabStyle, borderBottomColor: activeTab === 'security' ? '#38bdf8' : 'transparent', color: activeTab === 'security' ? '#0f172a' : '#64748b' }}
                        onClick={() => setActiveTab('security')}
                    >
                        <FaLock style={{ marginRight: '8px' }} /> Security
                    </button>
                </div>

                <div style={modalBodyStyle}>
                    {isLoading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Refreshing business data...</div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' ? (
                                <motion.form
                                    key="profile"
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                    onSubmit={handleProfileUpdate}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div style={formGroupStyle}>
                                            <label style={labelStyle}>Retailer Name</label>
                                            <input type="text" name="retailerName" value={profile.retailerName} onChange={handleInputChange} required style={inputStyle} />
                                        </div>
                                        <div style={formGroupStyle}>
                                            <label style={labelStyle}>Firm Name</label>
                                            <input type="text" name="firmName" value={profile.firmName} onChange={handleInputChange} required style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Registration ID</label>
                                        <input type="text" name="registrationId" value={profile.registrationId} onChange={handleInputChange} required style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px' }}>
                                        <div style={formGroupStyle}>
                                            <label style={labelStyle}>Business Email</label>
                                            <input type="email" value={profile.email} disabled style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#94a3b8' }} />
                                        </div>
                                        <div style={formGroupStyle}>
                                            <label style={labelStyle}>Phone Number</label>
                                            <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleInputChange} required style={inputStyle} pattern="[789][0-9]{9}" title="Phone number must start with 7, 8 or 9 and contain 10 digits" />
                                        </div>
                                    </div>

                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Warehouse Address Line 1</label>
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
                                        <label style={labelStyle}>Taluka</label>
                                        <select name="taluka" value={profile.taluka} onChange={handleInputChange} required style={inputStyle} disabled={!profile.district}>
                                            <option value="">Select Taluka</option>
                                            {profile.district && maharashtraData["Maharashtra"][profile.district].map(tal => (
                                                <option key={tal} value={tal}>{tal}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" disabled={isSaving} style={saveButtonStyle}>
                                        <FaSave /> {isSaving ? 'Updating...' : 'Update Business Info'}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="security"
                                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
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
                                        <label style={labelStyle}>Confirm Password</label>
                                        <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required minLength="6" style={inputStyle} />
                                    </div>
                                    <button type="submit" disabled={isSaving} style={{ ...saveButtonStyle, backgroundColor: '#0f172a', color: '#fff' }}>
                                        <FaLock /> {isSaving ? 'Changing...' : 'Update Password'}
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

const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
};

const backdropStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dark slate overlay
    backdropFilter: 'blur(3px)',
};

const modalContainerStyle = {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    zIndex: 10000,
};

const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #f1f5f9',
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
};

const tabsContainerStyle = {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 24px',
};

const tabStyle = {
    flex: 1,
    padding: '12px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const modalBodyStyle = {
    padding: '24px',
};

const formGroupStyle = {
    marginBottom: '1rem',
};

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: '#475569',
    fontSize: '0.85rem',
    fontWeight: '600',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
};

const saveButtonStyle = {
    width: '100%',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    fontWeight: '700',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '1rem',
};

export default RetailerProfileModal;
