import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaStore, FaSearch, FaChevronRight, FaShoppingCart, FaUserTag } from 'react-icons/fa';
import adminService from '../../utils/adminService';
import { toast } from 'react-toastify';

const ManageUsers = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('customers');
    const [users, setUsers] = useState({ customers: [], retailers: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUserStats();
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching user stats:", error);
            toast.error("Failed to load user information");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users[activeTab]?.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
    ) || [];

    const handleViewOrders = (userName, role) => {
        // Redirection to manage orders with the user's name as a filter
        navigate('/admin/orders', { 
            state: { 
                searchTerm: userName,
                role: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() // Normalize to 'Customer' or 'Retailer'
            } 
        });
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                <div className="spinner" style={{ margin: 'auto', marginBottom: '1rem' }}></div>
                Loading User Intelligence...
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem' }}
            >
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>User Management</h1>
                <p style={{ color: 'var(--text-light)' }}>Detailed demographics and activity metrics for all platform participants.</p>
            </motion.div>

            {/* Quick Stats Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '0.5rem', fontWeight: '600' }}>
                        <FaUsers /> Total Customers
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)' }}>{users.customers.length}</div>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', marginBottom: '0.5rem', fontWeight: '600' }}>
                        <FaStore /> Total Retailers
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)' }}>{users.retailers.length}</div>
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 10px 35px rgba(0,0,10,0.03)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                {/* Tabs & Search */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', backgroundColor: '#f3f4f6', padding: '5px', borderRadius: '12px' }}>
                        <button 
                            onClick={() => setActiveTab('customers')}
                            style={{ 
                                padding: '0.6rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                backgroundColor: activeTab === 'customers' ? '#fff' : 'transparent',
                                color: activeTab === 'customers' ? 'var(--primary-green)' : '#6b7280',
                                fontWeight: '700', transition: 'all 0.2s', boxShadow: activeTab === 'customers' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            Customers
                        </button>
                        <button 
                            onClick={() => setActiveTab('retailers')}
                            style={{ 
                                padding: '0.6rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                backgroundColor: activeTab === 'retailers' ? '#fff' : 'transparent',
                                color: activeTab === 'retailers' ? 'var(--primary-green)' : '#6b7280',
                                fontWeight: '700', transition: 'all 0.2s', boxShadow: activeTab === 'retailers' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            Retailers
                        </button>
                    </div>

                    <div style={{ position: 'relative', width: '300px' }}>
                        <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input 
                            type="text" 
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 40px', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', focus: { borderColor: 'var(--primary-green)' } }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>User Information</th>
                                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Contact Details</th>
                                <th style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>Account Type</th>
                                <th style={{ padding: '1.25rem 2rem', fontWeight: '700', textAlign: 'center' }}>Total Orders</th>
                                <th style={{ padding: '1.25rem 2rem', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map((user, idx) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fff', transition: 'background 0.2s' }}
                                        whileHover={{ backgroundColor: '#fafbfc' }}
                                    >
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: activeTab === 'customers' ? '#dcfce7' : '#dbeafe', color: activeTab === 'customers' ? '#166534' : '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '1rem' }}>{user.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600' }}>UID: {user.id.slice(-8).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ color: 'var(--text-dark)', fontWeight: '500', marginBottom: '2px' }}>{user.email}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{user.phone || 'No phone provided'}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: activeTab === 'customers' ? '#10b981' : '#3b82f6' }}>
                                                <FaUserTag /> {user.role}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'center' }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: user.orderCount > 0 ? 'var(--primary-green)' : '#9ca3af' }}>
                                                {user.orderCount}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                            <button 
                                                onClick={() => handleViewOrders(user.name, user.role)}
                                                style={{ border: 'none', background: 'transparent', color: 'var(--primary-green)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', transition: 'gap 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.gap = '10px'}
                                                onMouseLeave={(e) => e.currentTarget.style.gap = '6px'}
                                            >
                                                View Orders <FaChevronRight fontSize="0.8rem" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6b7280' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}><FaUsers /></div>
                        <h3>No users found matching "{searchQuery}"</h3>
                        <p>Try adjusting your search criteria or switching tabs.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
