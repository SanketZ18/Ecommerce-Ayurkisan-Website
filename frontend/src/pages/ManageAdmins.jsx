import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaTrash, FaTimes, FaShieldAlt, FaUserEdit, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../utils/adminService';

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: ''
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await adminService.getAdmins();
            setAdmins(res.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
            toast.error("Failed to retrieve administrator security logs");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (admin = null) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                name: admin.name,
                email: admin.email,
                phoneNumber: admin.phoneNumber || '',
                address: admin.address || '',
                password: '' // Don't show password
            });
        } else {
            setEditingAdmin(null);
            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                address: '',
                password: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAdmin) {
                await adminService.updateAdmin(editingAdmin.id, {
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address
                });
                toast.success("Administrator privileges updated");
            } else {
                await adminService.registerAdmin(formData);
                toast.success("New administrator credentialed successfully");
            }
            fetchAdmins();
            setShowModal(false);
        } catch (error) {
            toast.error(editingAdmin ? "Failed to update record" : "Registration rejected by security protocol");
        }
    };

    const handleDeleteAdmin = async (id, role) => {
        if (role === 'SUPER_ADMIN') {
            toast.warn('Root Super Admin protection is active. Deletion prohibited.');
            return;
        }

        if (window.confirm("CRITICAL: Are you sure you want to revoke this administrator's access across all systems?")) {
            try {
                await adminService.deleteAdmin(id);
                toast.success('Access revoked successfully');
                fetchAdmins();
            } catch (error) {
                toast.error('Failed to revoke access');
            }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'var(--text-light)' }}>
            Synchronizing Security Database...
        </div>
    );

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}
            >
                <div>
                    <h1 style={{ color: 'var(--text-dark)', fontSize: '2.4rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <FaShieldAlt style={{ color: 'var(--primary-green)' }} /> Admin Council
                    </h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.6rem', fontSize: '1.1rem' }}>Authorize and maintain system-level access for established team members.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => handleOpenModal()}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 2rem', borderRadius: '15px', fontWeight: '700', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.2)' }}
                >
                    <FaUserPlus /> Commission New Admin
                </button>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {admins.map((admin) => (
                    <motion.div
                        key={admin.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #f3f4f6',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {admin.role === 'ADMIN' && (
                            <button
                                onClick={() => handleDeleteAdmin(admin.id, admin.role)}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <FaTrash />
                            </button>
                        )}

                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '18px',
                                backgroundColor: admin.role === 'SUPER_ADMIN' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                                color: admin.role === 'SUPER_ADMIN' ? '#7c3aed' : 'var(--primary-green)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '1.5rem'
                            }}>
                                <FaShieldAlt />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800', fontSize: '1.15rem' }}>{admin.name}</h3>
                                <div style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    letterSpacing: '0.5px',
                                    color: admin.role === 'SUPER_ADMIN' ? '#7c3aed' : 'var(--primary-green)',
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    backgroundColor: admin.role === 'SUPER_ADMIN' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(5, 150, 105, 0.05)',
                                    borderRadius: '6px',
                                    marginTop: '4px'
                                }}>
                                    {admin.role === 'SUPER_ADMIN' ? 'ROOT PRIVILEGES' : 'SYSTEM ADMIN'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ color: 'var(--primary-green)' }}><FaTimes style={{ fontSize: '0.8rem', transform: 'rotate(45deg)' }} /></div>
                                {admin.email}
                            </div>
                            {admin.phoneNumber && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaPhone style={{ fontSize: '0.8rem' }} /> {admin.phoneNumber}
                                </div>
                            )}
                            {admin.address && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaMapMarkerAlt style={{ fontSize: '0.8rem' }} /> {admin.address}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f9fafb' }}>
                            <button
                                onClick={() => handleOpenModal(admin)}
                                style={{ width: '100%', border: '1px solid #f3f4f6', background: '#fff', color: 'var(--text-dark)', padding: '0.8rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            >
                                <FaUserEdit /> Update Security Profile
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={{ backgroundColor: '#fff', borderRadius: '30px', padding: '2.5rem', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800' }}>{editingAdmin ? 'Refine Records' : 'Authorize Admin'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#9ca3af', cursor: 'pointer' }}>
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <input type="text" required style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                                </div>
                                {!editingAdmin && (
                                    <div>
                                        <label style={labelStyle}>Security Email</label>
                                        <input type="email" required style={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="admin@ayurkisan.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Please enter a valid email address" />
                                    </div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Contact Signal (Phone)</label>
                                        <input type="tel" required pattern="[789][0-9]{9}" style={inputStyle} value={formData.phoneNumber} onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length > 0 && !['7', '8', '9'].includes(val[0])) return;
                                            if (val.length > 10) return;
                                            setFormData({ ...formData, phoneNumber: val });
                                        }} placeholder="9876543210" title="Phone number must start with 7, 8 or 9 and contain 10 digits" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Base Station (Address)</label>
                                        <input type="text" style={inputStyle} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="City, State" />
                                    </div>
                                </div>
                                {!editingAdmin && (
                                    <div>
                                        <label style={labelStyle}>Access Phrase (Password)</label>
                                        <input type="password" required minLength={6} style={inputStyle} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Strong password required" />
                                    </div>
                                )}

                                <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', borderRadius: '15px', marginTop: '1.5rem', fontWeight: '800', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)' }}>
                                    {editingAdmin ? 'COMMIT UPDATES' : 'ENSTATE OFFICIAL'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px' };
const inputStyle = { width: '100%', padding: '1rem', borderRadius: '14px', border: '2px solid #f3f4f6', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', focus: { borderColor: 'var(--primary-green)' } };

export default ManageAdmins;
