import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaBan, FaFilePdf, FaEye, FaTruck, FaUndo } from 'react-icons/fa';
import customerService from '../utils/customerService';
import retailerService from '../utils/retailerService';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userRole = localStorage.getItem('role') || 'CUSTOMER';
    const basePath = userRole === 'RETAILER' ? '/retailer' : '/customer';
    const activeService = userRole === 'RETAILER' ? retailerService : customerService;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await activeService.getMyOrders();
            // Assuming response contains an array of orders. Adapt based on actual API payload.
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            // Ignore error for visual development if API is missing / empty
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await activeService.cancelOrder(orderId);
            toast.success("Order cancelled successfully");
            fetchOrders(); // Refresh list after cancellation
        } catch (error) {
            console.error('Failed to cancel order:', error);
            const errMessage = error.response?.data?.message || "Could not cancel order. It may have already shipped.";
            toast.error(errMessage);
        }
    };

    const handleDownloadInvoice = (order) => {
        // Simple client-side text download generation as fallback/demonstration
        // In real app, this might redirect to a backend PDF generation endpoint
        const invoiceContent = `
            AYURKISAN - INVOICE
            -----------------------
            Order ID: ${order.orderId}
            Date: ${new Date(order.orderDate).toLocaleDateString()}
            Status: ${order.orderStatus}
            Total Amount: Rs. ${order.totalAmount}
            
            Thank you for your business!
        `;
        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${order.orderId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.info("Invoice downloaded!");
    };

    const getStatusStyle = (status) => {
        const baseStyle = { padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' };
        switch (status?.toUpperCase()) {
            case 'PENDING': return { ...baseStyle, backgroundColor: '#fef3c7', color: '#d97706' }; // Yellow
            case 'SHIPPED': return { ...baseStyle, backgroundColor: '#dbeafe', color: '#2563eb' }; // Blue
            case 'DELIVERED': return { ...baseStyle, backgroundColor: '#d1fae5', color: '#059669' }; // Green
            case 'CANCELLED': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#ef4444' }; // Red
            default: return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#4b5563' }; // Gray
        }
    };

    // Dummy data fallback for design demonstration if API is empty
    const displayOrders = orders.length > 0 ? orders : [
        { orderId: 'ORD-10045', orderDate: '2024-05-18T10:30:00Z', totalAmount: 1850.00, orderStatus: 'DELIVERED' },
        { orderId: 'ORD-10299', orderDate: '2024-05-20T14:15:00Z', totalAmount: 950.00, orderStatus: 'SHIPPED' },
        { orderId: 'ORD-10452', orderDate: '2024-05-22T09:00:00Z', totalAmount: 4200.00, orderStatus: 'PENDING' }
    ];

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>;
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: '#1e293b', fontSize: '2rem', marginBottom: '0.5rem' }}>Order History</h1>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>View, track, and manage your recent orders.</p>
            </div>

            {displayOrders.length === 0 ? (
                <div style={emptyStateStyle}>
                    <FaBoxOpen size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#475569', margin: '0 0 0.5rem 0' }}>No Orders Found</h3>
                    <p style={{ color: '#94a3b8', margin: '0 0 1.5rem 0' }}>You haven't placed any orders yet.</p>
                    <Link to="/products" className="btn-primary" style={{ textDecoration: 'none' }}>Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {displayOrders.map((order, idx) => (
                        <motion.div
                            key={order.orderId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={orderCardStyle}
                        >
                            <div style={orderHeaderStyle}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Order ID</span>
                                    <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{order.orderId}</strong>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Date</span>
                                    <strong style={{ color: '#475569' }}>{new Date(order.orderDate).toLocaleDateString()}</strong>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Total</span>
                                    <strong style={{ color: 'var(--primary-green)' }}>₹{order.totalAmount}</strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={getStatusStyle(order.orderStatus)}>{order.orderStatus}</span>
                                </div>
                            </div>

                            <div style={orderActionsStyle}>
                                <button
                                    className="btn-outline"
                                    style={actionBtnStyle}
                                    onClick={() => handleDownloadInvoice(order)}
                                >
                                    <FaFilePdf color="#ef4444" /> Download Invoice
                                </button>

                                {order.orderStatus === 'PENDING' && (
                                    <button
                                        onClick={() => handleCancelOrder(order.orderId)}
                                        style={{ ...actionBtnStyle, backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }}
                                    >
                                        <FaBan /> Cancel Order
                                    </button>
                                )}

                                {(order.orderStatus === 'SHIPPED' || order.orderStatus === 'IN_TRANSIT') && (
                                    <button
                                        onClick={() => navigate(`${basePath}/tracking/${order.orderId}`)}
                                        style={{ ...actionBtnStyle, backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' }}
                                    >
                                        <FaTruck /> Track Package
                                    </button>
                                )}

                                {order.orderStatus === 'DELIVERED' && (
                                    <button
                                        onClick={() => navigate(`${basePath}/returns/request/${order.orderId}`)}
                                        style={{ ...actionBtnStyle, color: '#f59e0b', border: '1px solid #fcd34d' }}
                                    >
                                        <FaUndo /> Return Item
                                    </button>
                                )}

                                <button className="btn-primary" style={{ ...actionBtnStyle, padding: '8px 20px' }}>
                                    <FaEye /> View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Styles
const orderCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden'
};

const orderHeaderStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    alignItems: 'center'
};

const orderActionsStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    backgroundColor: '#fff'
};

const actionBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #cbd5e1',
    backgroundColor: '#fff',
    color: '#334155'
};

const emptyStateStyle = {
    backgroundColor: '#fff',
    padding: '4rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
};

export default MyOrders;
