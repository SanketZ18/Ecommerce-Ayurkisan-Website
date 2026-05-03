import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import customerService from '../../utils/customerService';
import { FaUserEdit, FaLock, FaSave } from 'react-icons/fa';

const CustomerProfile = () => {
    const [profile, setProfile] = useState({
        id: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: ''
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;
            const res = await customerService.getProfile(userId);
            setProfile(res.data);
        } catch (error) {
            console.error("Failed to load profile", error);
            // toast.error("Failed to load profile details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            await customerService.updateProfile(userId, {
                name: profile.name,
                phoneNumber: profile.phoneNumber,
                address: profile.address
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        try {
            const userId = localStorage.getItem('userId');
            await customerService.changePassword(userId, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            toast.success("Password changed successfully!");
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data || "Failed to change password.");
        }
    };

    if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: '#047857', fontSize: '2rem', marginBottom: '0.5rem' }}>My Profile</h1>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>Manage your personal information and security settings.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Profile Form */}
                <div style={sectionCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <FaUserEdit size={24} color="#047857" />
                        <h2 style={sectionTitleStyle}>Personal Details</h2>
                    </div>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                                title="Email cannot be changed"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={profile.phoneNumber}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length > 0 && !['7', '8', '9'].includes(val[0])) return;
                                    if (val.length > 10) return;
                                    setProfile({ ...profile, phoneNumber: val });
                                }}
                                required
                                pattern="[789][0-9]{9}"
                                title="Phone number must start with 7, 8 or 9 and contain 10 digits"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                required
                                style={{
                                    width: '100%', padding: '0.75rem', border: '1px solid #ccc',
                                    borderRadius: '8px', minHeight: '100px', resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <FaSave /> Save Changes
                        </button>
                    </form>
                </div>

                {/* Password Form */}
                <div style={sectionCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <FaLock size={24} color="#0ea5e9" />
                        <h2 style={sectionTitleStyle}>Change Password</h2>
                    </div>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwords.oldPassword}
                                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                required
                                minLength="6"
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: '#0ea5e9', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <FaSave /> Update Password
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

const sectionCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)',
    height: 'fit-content'
};

const sectionTitleStyle = {
    fontSize: '1.25rem',
    color: '#1e293b',
    margin: 0,
    fontWeight: 'bold'
};

export default CustomerProfile;
