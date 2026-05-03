import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import retailerService from '../../utils/retailerService';
import { FaUserTie, FaLock, FaBuilding, FaSave } from 'react-icons/fa';

const RetailerProfile = () => {
    const [profile, setProfile] = useState({
        id: '',
        retailerName: '',
        firmName: '',
        registrationId: '',
        address: '',
        phoneNumber: '',
        email: ''
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
            const res = await retailerService.getProfile(userId);
            setProfile(res.data);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            await retailerService.updateProfile(userId, {
                retailerName: profile.retailerName,
                firmName: profile.firmName,
                registrationId: profile.registrationId,
                address: profile.address,
                phoneNumber: profile.phoneNumber,
                email: profile.email
            });
            toast.success("Business profile updated successfully!");
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
            await retailerService.changePassword(userId, {
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
                <h1 style={{ color: '#1e293b', fontSize: '2rem', marginBottom: '0.5rem' }}>Business Profile</h1>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>Manage your firm details, contact information, and security settings.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                {/* Profile Form */}
                <div style={sectionCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <FaBuilding size={24} color="#1e293b" />
                        <h2 style={sectionTitleStyle}>Firm Details</h2>
                    </div>
                    <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>

                        <div className="form-group">
                            <label>Contact Person (Retailer Name)</label>
                            <input
                                type="text"
                                value={profile.retailerName}
                                onChange={(e) => setProfile({ ...profile, retailerName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Firm Name</label>
                            <input
                                type="text"
                                value={profile.firmName}
                                onChange={(e) => setProfile({ ...profile, firmName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Registration ID</label>
                            <input
                                type="text"
                                value={profile.registrationId}
                                onChange={(e) => setProfile({ ...profile, registrationId: e.target.value })}
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
                                title="Email for business cannot be changed here"
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Business Phone</label>
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
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Business Address</label>
                            <textarea
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                required
                                style={{
                                    width: '100%', padding: '0.75rem', border: '1px solid #ccc',
                                    borderRadius: '8px', minHeight: '80px', resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn-primary" style={{ backgroundColor: '#1e293b', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <FaSave /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Form */}
                <div style={sectionCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <FaLock size={24} color="#0ea5e9" />
                        <h2 style={sectionTitleStyle}>Security</h2>
                    </div>
                    <form onSubmit={handlePasswordUpdate}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 1.5rem' }}>
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
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%', backgroundColor: '#0ea5e9', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                <FaSave /> Update Password
                            </button>
                        </div>
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

export default RetailerProfile;
