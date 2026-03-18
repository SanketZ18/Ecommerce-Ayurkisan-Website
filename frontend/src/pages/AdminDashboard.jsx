import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    FaRupeeSign, FaShoppingCart, FaBoxOpen, FaLayerGroup, 
    FaStore, FaUsers, FaChartLine, FaUserShield, 
    FaEnvelope, FaReply, FaTrash, FaTimes 
} from 'react-icons/fa';
import adminService from '../utils/adminService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        customerRevenue: 0,
        retailerRevenue: 0,
        customerOrdersCount: 0,
        retailerOrdersCount: 0,
        productsCount: 0,
        categoriesCount: 0,
        customersCount: 0,
        retailersCount: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyModal, setReplyModal] = useState({ open: false, contact: null, message: '' });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardStats, contactRes, outOfStockRes] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getContacts().catch(() => ({ data: [] })),
                adminService.getOutOfStockProducts().catch(() => ({ data: [] }))
            ]);

            setStats(dashboardStats);
            setRecentOrders(dashboardStats.recentOrders);
            setContacts(contactRes.data);
            setOutOfStockProducts(outOfStockRes.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
            toast.error("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await adminService.deleteContact(id);
            toast.success("Message deleted");
            const res = await adminService.getContacts();
            setContacts(res.data);
        } catch (err) {
            toast.error("Failed to delete message");
        }
    };

    const handleReplySubmit = async () => {
        if (!replyModal.message.trim()) return toast.error("Reply cannot be empty");
        try {
            await adminService.replyToContact(replyModal.contact.id, replyModal.message);
            toast.success("Reply sent successfully!");
            setReplyModal({ open: false, contact: null, message: '' });
            const res = await adminService.getContacts();
            setContacts(res.data);
        } catch (err) {
            toast.error("Failed to send reply");
        }
    };

    const statCards = [
        { title: 'Customer Sales Amount', value: `₹ ${stats.customerRevenue?.toLocaleString() || 0}`, icon: FaRupeeSign, color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)' },
        { title: 'Retailer Sales Amount', value: `₹ ${stats.retailerRevenue?.toLocaleString() || 0}`, icon: FaRupeeSign, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
        { title: 'Customer Orders', value: stats.customerOrdersCount || 0, icon: FaShoppingCart, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { title: 'Retailer Orders', value: stats.retailerOrdersCount || 0, icon: FaBoxOpen, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        { title: 'Live Products', value: stats.productsCount || 0, icon: FaBoxOpen, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
        { title: 'Total Categories', value: stats.categoriesCount || 0, icon: FaLayerGroup, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
        { title: 'Active Retailers', value: stats.retailersCount || 0, icon: FaStore, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
        { title: 'Total Customers', value: stats.customersCount || 0, icon: FaUsers, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
    ];

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED': case 'DELIVERED': return { bg: '#dcfce7', color: '#166534' };
            case 'PROCESSING': case 'PENDING': return { bg: '#fef08a', color: '#854d0e' };
            case 'SHIPPED': return { bg: '#dbeafe', color: '#1e40af' };
            case 'CANCELLED': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '20px' }}>
                <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid var(--primary-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-light)', fontWeight: '500' }}>Loading Dashboard Analytics...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
            >
                <div>
                    <h1 style={{ color: 'var(--text-dark)', fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>Admin Command Center</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Real-time business intelligence for AyurKisan.</p>
                </div>
                <div style={{ padding: '10px 20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', backgroundColor: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }}></div>
                    <span style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.9rem' }}>Systems Operational</span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                        style={{
                            backgroundColor: '#fff',
                            padding: '1.75rem',
                            borderRadius: '20px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #f3f4f6',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '5rem', opacity: 0.03, color: card.color }}>
                            <card.icon />
                        </div>
                        <div style={{ backgroundColor: card.bg, color: card.color, width: '50px', height: '50px', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
                            <card.icon />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '0.5rem', fontWeight: '500' }}>{card.title}</h3>
                            <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        border: '1px solid #f3f4f6'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaChartLine style={{ color: 'var(--primary-green)' }} /> Recent Activity
                        </h2>
                        <button onClick={() => navigate('/admin/reports')} className="btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', borderRadius: '10px' }}>Global Log</button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '0 1rem', fontWeight: '600' }}>Order Ref</th>
                                    <th style={{ padding: '0 1rem', fontWeight: '600' }}>Merchant/Customer</th>
                                    <th style={{ padding: '0 1rem', fontWeight: '600' }}>Amount</th>
                                    <th style={{ padding: '0 1rem', fontWeight: '600' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No recent orders detected.</td></tr>
                                ) : recentOrders.map((order, idx) => {
                                    const statusStyle = getStatusStyle(order.orderStatus);
                                    return (
                                        <tr key={idx} style={{ backgroundColor: '#fcfdfe', transition: 'all 0.2s' }}>
                                            <td style={{ padding: '1.2rem 1rem', fontWeight: '700', color: 'var(--text-dark)', borderRadius: '12px 0 0 12px' }}>
                                                #{order.id?.toString().slice(-6).toUpperCase()}
                                            </td>
                                            <td style={{ padding: '1.2rem 1rem' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{order.userName || 'Anonymous'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1rem', fontWeight: '700', color: 'var(--primary-green)' }}>₹ {order.totalDiscountedPrice}</td>
                                            <td style={{ padding: '1.2rem 1rem', borderRadius: '0 12px 12px 0' }}>
                                                <span style={{
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {order.orderStatus || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Quick Actions / Team */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        backgroundColor: 'var(--text-dark)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <h2 style={{ fontSize: '1.3rem', margin: '0 0 1.5rem 0', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaUserShield style={{ color: 'var(--primary-green)' }} /> Quick Management
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                            { label: 'Manage Products', path: '/admin/products', icon: FaBoxOpen },
                            { label: 'Category Settings', path: '/admin/categories', icon: FaChartLine },
                            { label: 'Bundles & Packages', path: '/admin/packages', icon: FaShoppingCart },
                            { label: 'Administrator Team', path: '/admin/manage-admins', icon: FaUsers }
                        ].map((btn, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(btn.path)}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    padding: '1.25rem',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '1rem',
                                    fontWeight: '500'
                                }}
                            >
                                <btn.icon style={{ color: 'var(--primary-green)' }} />
                                {btn.label}
                            </motion.button>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>AyurKisan v2.4.0 High-Security Mode</p>
                    </div>
                </motion.div>
            </div>

            {/* Out of Stock Alert Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 }}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid #fee2e2',
                    marginBottom: '3rem'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', color: '#991b1b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
                        <FaBoxOpen style={{ color: '#ef4444' }} /> Inventory Alert: Out of Stock
                    </h2>
                    <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800' }}>
                        {outOfStockProducts.length} Items Depleted
                    </span>
                </div>

                {outOfStockProducts.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                        All products are currently in stock. Good job!
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                        {outOfStockProducts.map(product => (
                            <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '8px', backgroundColor: '#fff', backgroundImage: `url(${product.productImage1})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid #fecaca' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', color: '#991b1b', fontSize: '0.9rem' }}>{product.productName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600' }}>SKU: {product.id}</div>
                                </div>
                                <button onClick={() => navigate('/admin/products')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>Restock</button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Contact Messages Table */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid #f3f4f6'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
                        <FaEnvelope style={{ color: 'var(--primary-green)' }} /> Support Inquiries
                    </h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f3f4f6', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Origin</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Context</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: '600', textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>No active support requests.</td></tr>
                            ) : contacts.map((contact) => (
                                <tr key={contact.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.25rem 0.5rem' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{contact.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{contact.email}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 0.5rem' }}>
                                        <div style={{ fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px' }}>{contact.subject}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={contact.message}>
                                            {contact.message}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 0.5rem' }}>
                                        <span style={{
                                            backgroundColor: contact.status === 'REPLIED' ? '#dcfce7' : '#fef08a',
                                            color: contact.status === 'REPLIED' ? '#166534' : '#854d0e',
                                            padding: '0.3rem 0.75rem',
                                            borderRadius: '8px',
                                            fontSize: '0.7rem',
                                            fontWeight: '800'
                                        }}>
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 0.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => setReplyModal({ open: true, contact, message: '' })}
                                                style={{ border: 'none', background: 'var(--primary-green)', color: '#fff', padding: '10px', borderRadius: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                                <FaReply />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContact(contact.id)}
                                                style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Reply Modal */}
            <AnimatePresence>
                {replyModal.open && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '24px', width: '90%', maxWidth: '550px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            <button
                                style={{ position: 'absolute', top: '25px', right: '25px', background: '#f3f4f6', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#6b7280' }}
                                onClick={() => setReplyModal({ open: false, contact: null, message: '' })}
                            >
                                <FaTimes />
                            </button>
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)', fontSize: '1.5rem', fontWeight: '800' }}>Draft Response</h3>
                            <div style={{ backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #f3f4f6' }}>
                                <div style={{ color: 'var(--text-light)', marginBottom: '8px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Inquiry Details</div>
                                <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>{replyModal.contact?.subject}</div>
                                <div style={{ color: '#4b5563', lineHeight: '1.5' }}>"{replyModal.contact?.message}"</div>
                            </div>
                            <textarea
                                value={replyModal.message}
                                onChange={(e) => setReplyModal({ ...replyModal, message: e.target.value })}
                                placeholder="Write your professional response..."
                                rows={6}
                                style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '2px solid #f3f4f6', marginBottom: '1.5rem', fontFamily: 'inherit', resize: 'none', outline: 'none', transition: 'border-color 0.2s', focus: { borderColor: 'var(--primary-green)' } }}
                            />
                            <button
                                onClick={handleReplySubmit}
                                style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--primary-green)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)' }}>
                                Send Response
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
