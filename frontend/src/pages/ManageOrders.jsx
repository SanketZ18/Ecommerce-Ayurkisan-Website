import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaEye, FaTimes, FaCheckCircle, FaTruck, FaBox, FaTimesCircle, FaFilter, FaCalendarAlt, FaUserFriends, FaStore, FaReply } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../utils/adminService';
import { resolveProductImage, resolvePackageImage } from '../utils/imageUtils';
import ProcessingOverlay from '../components/common/ProcessingOverlay';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');
    const [activeTab, setActiveTab] = useState('Customer'); // 'Customer' or 'Retailer'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [returnDetails, setReturnDetails] = useState(null);

    const location = useLocation();

    useEffect(() => {
        if (location.state?.searchTerm) {
            setSearchTerm(location.state.searchTerm);
        }
        if (location.state?.role) {
            setActiveTab(location.state.role);
        }
        fetchOrders();
    }, [location.state]);

    const fetchOrders = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await adminService.getAllOrders();
            // Sort by Date Descending (Newest first)
            const sortedOrders = (Array.isArray(res.data) ? res.data : []).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
        } catch (err) {
            toast.error("Failed to fetch orders");
        } finally {
            if (!silent) setLoading(false);
        }
    };
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setStatusUpdating(true);
            await adminService.updateOrderStatus(orderId, newStatus, remarks);
            
            // If it's a return status, also update the return request
            if (newStatus.startsWith('RETURN')) {
                await adminService.updateReturnStatus(orderId, newStatus, remarks).catch(e => console.log("Return request not found, skipping."));
            }

            toast.success(`Order status updated to ${newStatus}`);
            // Fetch silently to avoid blank screen
            await fetchOrders(true);
            setShowModal(false);
            setRemarks(''); // Reset remarks after update
            setReturnDetails(null);
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED': return { bg: '#dcfce7', color: '#166534', icon: FaCheckCircle };
            case 'CONFIRMED': return { bg: '#ecfdf5', color: '#059669', icon: FaCheckCircle };
            case 'PROCESSING': case 'PENDING': return { bg: '#fef08a', color: '#854d0e', icon: FaBox };
            case 'SHIPPED': return { bg: '#dbeafe', color: '#1e40af', icon: FaTruck };
            case 'CANCELLED': return { bg: '#fee2e2', color: '#991b1b', icon: FaTimesCircle };
            case 'RETURN_REQUESTED': return { bg: '#ffedd5', color: '#9a3412', icon: FaReply };
            case 'RETURNED': return { bg: '#f1f5f9', color: '#475569', icon: FaReply };
            default: return { bg: '#f3f4f6', color: '#374151', icon: FaBox };
        }
    };

    const handleSelectOrder = async (order) => {
        setSelectedOrder(order);
        setReturnDetails(null);
        setShowModal(true);

        if (order.orderStatus?.startsWith('RETURN')) {
            try {
                const res = await adminService.getAllReturns();
                const returns = Array.isArray(res.data) ? res.data : [];
                const detail = returns.find(r => r.orderId === order.id);
                if (detail) {
                    setReturnDetails(detail);
                }
            } catch (err) {
                console.error("Failed to fetch return details:", err);
            }
        }
    };

    // Calculate totals for summary boxes
    const stats = useMemo(() => {
        const customerOrders = orders.filter(o => o.role?.toLowerCase() === 'customer');
        const retailerOrders = orders.filter(o => o.role?.toLowerCase() === 'retailer');
        
        const activeCustomerOrders = customerOrders.filter(o => 
            o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'RETURNED'
        );
        const activeRetailerOrders = retailerOrders.filter(o => 
            o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'RETURNED'
        );
        
        const customerTotal = activeCustomerOrders.reduce((sum, o) => sum + (o.totalDiscountedPrice || 0), 0);
        const retailerTotal = activeRetailerOrders.reduce((sum, o) => sum + (o.totalDiscountedPrice || 0), 0);

        return {
            customer: { count: customerOrders.length, total: customerTotal },
            retailer: { count: retailerOrders.length, total: retailerTotal }
        };
    }, [orders]);

    // Filtering logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesTab = order.role?.toLowerCase() === activeTab.toLowerCase();
            const matchesSearch = !searchTerm ||
                order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;
            const matchesDate = !dateFilter || new Date(order.createdAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();

            return matchesTab && matchesSearch && matchesStatus && matchesDate;
        });
    }, [orders, activeTab, searchTerm, statusFilter, dateFilter]);

    // Grouping logic (by date)
    const groupedOrders = useMemo(() => {
        const groups = {};
        filteredOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString(undefined, {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const today = new Date().toLocaleDateString(undefined, {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const displayDate = date === today ? "Today" : date;

            if (!groups[displayDate]) groups[displayDate] = [];
            groups[displayDate].push(order);
        });
        return groups;
    }, [filteredOrders]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Order Records...</div>;

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}
            >
                <div>
                    <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaShoppingCart style={{ color: 'var(--primary-green)' }} /> Order Management
                    </h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Track and manage Customer and Retailer orders.</p>
                </div>
            </motion.div>

            {/* Summary Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div
                    whileHover={{ y: -5 }}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '1.5rem', borderRadius: '24px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.9, marginBottom: '0.5rem' }}>
                        <FaUserFriends /> Customer Total Sales ({stats.customer.count})
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{stats.customer.total.toLocaleString()}</div>
                </motion.div>
                <motion.div
                    whileHover={{ y: -5 }}
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '1.5rem', borderRadius: '24px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.9, marginBottom: '0.5rem' }}>
                        <FaStore /> Retailer Total Sales ({stats.retailer.count})
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{stats.retailer.total.toLocaleString()}</div>
                </motion.div>
            </div>

            {/* Tabs & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '14px' }}>
                    {['Customer', 'Retailer'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '8px 24px',
                                borderRadius: '11px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '700',
                                backgroundColor: activeTab === tab ? '#fff' : 'transparent',
                                color: activeTab === tab ? 'var(--primary-green)' : '#64748b',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                        >
                            {tab} Orders
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            style={{ ...inputStyle, paddingLeft: '2.5rem', width: '250px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <FaFilter style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.8rem' }} />
                        <select
                            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <FaCalendarAlt style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="date"
                            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    {(searchTerm || statusFilter !== 'ALL' || dateFilter) && (
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setDateFilter(''); }}
                            style={{ border: 'none', background: 'transparent', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}
                        >
                            Reset Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Orders List (Grouped) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Object.keys(groupedOrders).length > 0 ? Object.entries(groupedOrders).map(([date, items]) => (
                    <div key={date}>
                        <h3 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCalendarAlt /> {date} <span style={{ backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>{items.length} Orders</span>
                        </h3>
                        <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: 'var(--text-dark)' }}>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '800', fontSize: '0.85rem' }}>Order Ref</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '800', fontSize: '0.85rem' }}>Time</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '800', fontSize: '0.85rem' }}>{activeTab}</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '800', fontSize: '0.85rem' }}>Total (₹)</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '800', fontSize: '0.85rem' }}>Status</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '800', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((order) => {
                                        const status = getStatusStyle(order.orderStatus);
                                        return (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: 'var(--primary-green)' }}>#{order.id?.toString().slice(-6).toUpperCase()}</td>
                                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{order.userName || 'Anonymous'}</td>
                                                <td style={{ padding: '1rem 1.5rem', fontWeight: '800' }}>₹{order.totalDiscountedPrice}</td>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <span style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        backgroundColor: status.bg,
                                                        color: status.color,
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '800',
                                                        width: 'fit-content'
                                                    }}>
                                                        <status.icon /> {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => handleSelectOrder(order)}
                                                        style={{ background: 'var(--primary-green)', border: 'none', color: '#fff', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                                    >
                                                        <FaReply /> Process
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="No orders" style={{ width: '200px', marginBottom: '1rem', opacity: 0.5 }} />
                        <h2 style={{ color: '#64748b' }}>No {activeTab} orders found matching your criteria.</h2>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {showModal && selectedOrder && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ position: 'relative', backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '95%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            {statusUpdating && <ProcessingOverlay message="Updating Order Status..." />}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800' }}>Order Details</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FaTimes /></button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={labelStyle}>Order summary</label>
                                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '16px' }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>ID:</strong> #{selectedOrder.id}</p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                        <p style={{ margin: '0', fontSize: '1.2rem', color: 'var(--primary-green)', fontWeight: '800' }}><strong>Total:</strong> ₹{selectedOrder.totalDiscountedPrice}</p>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>{activeTab} Information</label>
                                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '16px' }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>Name:</strong> {selectedOrder.userName}</p>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>Role:</strong> {selectedOrder.role}</p>
                                        <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                                    </div>
                                </div>
                            </div>

                             {/* Status Update */}
                             <div style={{ marginBottom: '2.5rem' }}>
                                 <label style={labelStyle}>Update Order Status</label>
                                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                     {[
                                         { value: 'PENDING', label: 'PENDING' },
                                         { value: 'CONFIRMED', label: 'CONFIRMED' },
                                         { value: 'CANCELLED', label: 'CANCELLED' }
                                     ].map(item => (
                                         <button
                                             key={item.value}
                                             disabled={statusUpdating || selectedOrder.orderStatus === item.value}
                                             onClick={() => handleUpdateStatus(selectedOrder.id, item.value)}
                                             style={{
                                                 padding: '0.6rem 1.25rem',
                                                 borderRadius: '12px',
                                                 border: '1px solid #e2e8f0',
                                                 backgroundColor: selectedOrder.orderStatus === item.value ? 'var(--primary-green)' : '#fff',
                                                 color: selectedOrder.orderStatus === item.value ? '#fff' : 'var(--text-dark)',
                                                 fontWeight: '700',
                                                 fontSize: '0.8rem',
                                                 cursor: 'pointer',
                                                 transition: 'all 0.2s',
                                                 opacity: statusUpdating ? 0.7 : 1
                                             }}
                                         >
                                             {item.label}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                             {/* Return Details */}
                             {returnDetails && (
                                 <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#fff7ed', borderRadius: '16px', border: '1px solid #ffedd5' }}>
                                     <h3 style={{ margin: '0 0 1rem 0', color: '#9a3412', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                         <FaReply /> Return Request Details
                                     </h3>
                                     <div style={{ fontSize: '0.9rem', color: '#431407' }}>
                                         <p style={{ margin: '0 0 5px 0' }}><strong>Reason:</strong> {returnDetails.reason}</p>
                                         <p style={{ margin: '0' }}><strong>Customer Comments:</strong> {returnDetails.comments || 'No comments provided'}</p>
                                     </div>
                                 </div>
                             )}

                            {/* Remarks / Reason */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={labelStyle}>Administrative Remarks / Cancellation Reason</label>
                                <textarea
                                    style={{
                                        width: '100%',
                                        padding: '0.9rem 1.25rem',
                                        borderRadius: '14px',
                                        border: '1px solid #e2e8f0',
                                        minHeight: '80px',
                                        fontSize: '0.9rem',
                                        resize: 'none',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    placeholder="Provide a reason if cancelling, or general notes for this update..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>

                            {/* Order Items */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={labelStyle}>Order Items</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img 
                                                        src={item.itemType === 'PACKAGE' ? resolvePackageImage(item.productImage) : resolveProductImage(item.productImage, item.productId)} 
                                                        alt={item.productName} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.productName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.quantity} x ₹{item.discountedPrice}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: '800', color: 'var(--primary-green)' }}>₹{item.totalItemPrice}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                                Ref: {selectedOrder.id} | AyurKisan Order Ledger
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '0.6rem', fontWeight: '800', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem', backgroundColor: '#fff' };

export default ManageOrders;

