import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBoxOpen, FaBan, FaCheckCircle, FaMapMarkerAlt, FaEye, FaTruck, FaUndo, FaExclamationTriangle, FaStar, FaCommentDots } from 'react-icons/fa';
import customerService from '../utils/customerService';
import retailerService from '../utils/retailerService';
import { toast } from 'react-toastify';
import { resolveProductImage, resolvePackageImage } from '../utils/imageUtils';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    
    // Feedback states
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [orderForFeedback, setOrderForFeedback] = useState(null);
    const [feedbackItem, setFeedbackItem] = useState(null);
    const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comments: '', suggestions: '' });
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const navigate = useNavigate();

    const userRole = localStorage.getItem('role') || 'CUSTOMER';
    const basePath = userRole === 'RETAILER' ? '/retailer' : '/customer';
    const activeService = userRole === 'RETAILER' ? retailerService : customerService;

    useEffect(() => {
        fetchOrders();
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        const storedName = localStorage.getItem('userName') || localStorage.getItem('name');
        if (!storedName) {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const res = await activeService.getProfile(userId);
                    const name = res.data.name || res.data.retailerName || 'User';
                    localStorage.setItem('userName', name);
                    console.log("Logged in user name fetched and stored:", name);
                } catch (e) {
                    console.error("Failed to fetch user profile for name:", e);
                }
            }
        }
    };

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

    const openCancelModal = (orderId) => {
        setOrderToCancel(orderId);
        setIsCancelModalOpen(true);
    };

    const handleCancelOrder = async () => {
        if (!orderToCancel) return;
        
        setIsCancelling(true);
        try {
            await activeService.cancelOrder(orderToCancel);
            toast.success("Order cancelled successfully");
            setIsCancelModalOpen(false);
            setOrderToCancel(null);
            fetchOrders(); // Refresh list after cancellation
        } catch (error) {
            console.error('Failed to cancel order:', error);
            const errMessage = error.response?.data?.message || "Could not cancel order. It may have already shipped.";
            toast.error(errMessage);
        } finally {
            setIsCancelling(false);
        }
    };

    const openFeedbackModal = (order) => {
        setOrderForFeedback(order);
        setFeedbackItem(null);
        setFeedbackForm({ rating: 5, comments: '', suggestions: '' });
        setIsFeedbackModalOpen(true);
    };

    const submitFeedback = async () => {
        if (!feedbackItem) return;
        setIsSubmittingFeedback(true);
        try {
            const userName = localStorage.getItem('userName') || localStorage.getItem('name') || 'User';
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                toast.error("User session expired. Please login again.");
                return;
            }

            const data = {
                userId: userId,
                userName: userName,
                productId: feedbackItem.productId || feedbackItem.id, // Fallback to id if productId missing
                role: userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase(), // Normalize to "Customer" or "Retailer"
                rating: feedbackForm.rating,
                comments: feedbackForm.comments,
                suggestions: feedbackForm.suggestions
            };

            console.log("Submitting feedback data:", data);

            await axios.post('http://localhost:9090/feedbacks/add', data);
            toast.success('Feedback submitted successfully!');
            setFeedbackItem(null); 
            if (orderForFeedback && orderForFeedback.items && orderForFeedback.items.length === 1) {
                setIsFeedbackModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to submit feedback error object:', error.response?.data);
            
            let msg = 'Failed to submit feedback. Please try again.';
            
            if (error.response?.data) {
                const data = error.response.data;
                if (data.message) {
                    msg = data.message;
                } else if (data.messages) {
                    // Handle validation errors map
                    const errors = Object.values(data.messages).join(', ');
                    msg = `Validation Error: ${errors}`;
                } else if (data.error) {
                    msg = data.error;
                }
            } else {
                msg = error.message;
            }
            
            toast.error(msg);
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const toggleDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    const getStatusStyle = (status) => {
        const baseStyle = { padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' };
        switch (status?.toUpperCase()) {
            case 'PENDING': return { ...baseStyle, backgroundColor: '#fef3c7', color: '#d97706' }; // Yellow
            case 'SHIPPED': return { ...baseStyle, backgroundColor: '#dbeafe', color: '#2563eb' }; // Blue
            case 'OUT_FOR_DELIVERY': return { ...baseStyle, backgroundColor: '#e0e7ff', color: '#4f46e5' }; // Indigo
            case 'DELIVERED': return { ...baseStyle, backgroundColor: '#d1fae5', color: '#059669' }; // Green
            case 'CANCELLED': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#ef4444' }; // Red
            case 'RETURN_REQUESTED': return { ...baseStyle, backgroundColor: '#fff7ed', color: '#ea580c' }; // Orange
            case 'RETURN_ACCEPTED': return { ...baseStyle, backgroundColor: '#ecfdf5', color: '#059669' }; // Emerald
            case 'RETURN_PICKUP': return { ...baseStyle, backgroundColor: '#eff6ff', color: '#2563eb' }; // Blue
            case 'RETURNED': return { ...baseStyle, backgroundColor: '#f0fdf4', color: '#16a34a' }; // Green
            default: return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#4b5563' }; // Gray
        }
    };

    const renderStepper = (status) => {
        const statuses = ['PLACED', 'PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
        
        // Normalize status to fit into our visual stepper map
        let currentStatus = status?.toUpperCase() || 'PLACED';
        if (currentStatus === 'CANCELLED') return <div style={{ color: '#ef4444', fontWeight: 'bold', padding: '15px 0' }}>Order Cancelled</div>;
        if (currentStatus === 'RETURNED') return <div style={{ color: '#f59e0b', fontWeight: 'bold', padding: '15px 0' }}>Order Returned</div>;

        let currentIndex = statuses.indexOf(currentStatus);
        
        // Map some backend states to the stepper logic if they aren't directly in the array
        if (currentIndex === -1) {
            if (currentStatus === 'PLACED') currentIndex = 0;
            else if (currentStatus === 'PENDING') currentIndex = 1;
            else currentIndex = 1; // Default fallback to pending if unknown
        }

        if (currentStatus.startsWith('RETURN')) {
            const returnNodes = [
                { label: 'Requested', icon: <FaUndo /> },
                { label: 'Accepted', icon: <FaCheckCircle /> },
                { label: 'Pickup', icon: <FaTruck /> },
                { label: 'Refunded', icon: <FaBoxOpen /> }
            ];
            
            let returnIdx = 0;
            if (currentStatus === 'RETURNED' || currentStatus === 'REFUNDED') returnIdx = 3;
            else if (currentStatus === 'RETURN_PICKUP') returnIdx = 2;
            else if (currentStatus === 'RETURN_ACCEPTED') returnIdx = 1;
            else returnIdx = 0;

            return (
                <div style={{ padding: '20px 0', width: '100%', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '400px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '4px', backgroundColor: '#e2e8f0', zIndex: 1, borderRadius: '2px' }}></div>
                        <div style={{ position: 'absolute', top: '15px', left: '10%', width: `${(returnIdx / 3) * 80}%`, height: '4px', backgroundColor: '#ea580c', zIndex: 2, borderRadius: '2px', transition: 'width 0.5s ease-in-out' }}></div>
                        {returnNodes.map((node, i) => {
                            const isActive = i <= returnIdx;
                            const isCurrent = i === returnIdx;
                            return (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '25%' }}>
                                    <div style={{ 
                                        width: isCurrent ? '34px' : '30px', height: '34px', borderRadius: '50%', 
                                        backgroundColor: isActive ? '#ea580c' : '#fff', 
                                        border: isActive ? '2px solid #ea580c' : '3px solid #cbd5e1',
                                        color: isActive ? '#fff' : '#cbd5e1',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isCurrent ? '0 0 0 4px rgba(234, 88, 12, 0.2)' : 'none'
                                    }}>
                                        {isActive ? <FaCheckCircle size={16} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />}
                                    </div>
                                    <span style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: isCurrent ? 'bold' : 'normal', color: isActive ? '#ea580c' : '#94a3b8' }}>{node.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        const displayNodes = [
            { label: 'Ordered', icon: <FaBoxOpen /> },
            { label: 'Confirmed', icon: <FaCheckCircle /> },
            { label: 'Shipped', icon: <FaTruck /> },
            { label: 'Delivered', icon: <FaMapMarkerAlt /> }
        ];

        // Map backend 6-state array to our 4-node visual stepper
        let visibleIndex = 0;
        if (currentIndex >= 5) visibleIndex = 3; // Delivered
        else if (currentIndex >= 3) visibleIndex = 2; // Shipped / Out for delivery
        else if (currentIndex >= 2) visibleIndex = 1; // Confirmed
        else visibleIndex = 0; // Placed / Pending

        return (
            <div style={{ padding: '20px 0', width: '100%', overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '400px', position: 'relative' }}>
                    {/* Background tracking line */}
                    <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '4px', backgroundColor: '#e2e8f0', zIndex: 1, borderRadius: '2px' }}></div>
                    {/* Active tracking line */}
                    <div style={{ position: 'absolute', top: '15px', left: '10%', width: `${(visibleIndex / (displayNodes.length - 1)) * 80}%`, height: '4px', backgroundColor: '#10b981', zIndex: 2, borderRadius: '2px', transition: 'width 0.5s ease-in-out' }}></div>

                    {displayNodes.map((node, i) => {
                        const isActive = i <= visibleIndex;
                        const isCurrent = i === visibleIndex;
                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '25%' }}>
                                <div style={{ 
                                    width: isCurrent ? '34px' : '30px', 
                                    height: isCurrent ? '34px' : '30px', 
                                    borderRadius: '50%', 
                                    backgroundColor: isActive ? '#10b981' : '#fff', 
                                    border: isActive ? '2px solid #10b981' : '3px solid #cbd5e1',
                                    color: isActive ? '#fff' : '#cbd5e1',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isCurrent ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none'
                                }}>
                                    {isActive ? <FaCheckCircle size={16} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />}
                                </div>
                                <span style={{ marginTop: '8px', fontSize: '0.85rem', fontWeight: isCurrent ? 'bold' : 'normal', color: isActive ? '#1e293b' : '#94a3b8' }}>{node.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const displayOrders = orders.map(order => ({
        ...order,
        orderId: order.id || order.orderId,
        orderDate: order.createdAt || order.orderDate,
        totalAmount: order.totalDiscountedPrice !== undefined ? order.totalDiscountedPrice : order.totalAmount
    }));

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
                    <Link to={userRole === 'CUSTOMER' ? '/customer/dashboard' : '/products'} className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none' }}>Start Shopping</Link>
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
                                <div style={{ flex: 2, minWidth: '250px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Order for</span>
                                    <strong style={{ 
                                        fontSize: '1rem', 
                                        color: '#1e293b', 
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis' 
                                    }}>
                                        {order.items?.map(i => i.productName).join(', ') || 'N/A'}
                                    </strong>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                                        ID: {order.orderId}
                                    </span>
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
                                {order.orderStatus === 'DELIVERED' && (
                                    <>
                                        <button
                                            onClick={() => navigate(`${basePath}/returns/request/${order.orderId}`)}
                                            style={{ ...actionBtnStyle, color: '#f59e0b', border: '1px solid #fcd34d' }}
                                        >
                                            <FaUndo /> Return Item
                                        </button>
                                        <button
                                            onClick={() => openFeedbackModal(order)}
                                            style={{ ...actionBtnStyle, color: '#059669', border: '1px solid #6ee7b7' }}
                                        >
                                            <FaCommentDots /> Give Feedback
                                        </button>
                                    </>
                                )}

                                {['PLACED', 'PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.orderStatus?.toUpperCase()) && (
                                    <button
                                        onClick={() => openCancelModal(order.orderId)}
                                        style={{ ...actionBtnStyle, color: '#ef4444', border: '1px solid #fecaca' }}
                                    >
                                        <FaBan /> Cancel Order
                                    </button>
                                )}

                                <button 
                                    className="btn-primary" 
                                    style={{ ...actionBtnStyle, padding: '8px 20px', backgroundColor: expandedOrderId === order.orderId ? '#1e293b' : 'var(--primary-green)', color: '#fff' }}
                                    onClick={() => toggleDetails(order.orderId)}
                                >
                                    <FaEye /> {expandedOrderId === order.orderId ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>

                            {/* EXPANEDED DETAILS SECTION */}
                            {expandedOrderId === order.orderId && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    style={{ padding: '0 20px 20px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #e2e8f0' }}
                                >
                                    <div style={{ backgroundColor: '#fff', padding: '10px 20px', margin: '20px 0', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <h4 style={{ margin: '10px 0', color: '#334155' }}>Order Tracking</h4>
                                        {renderStepper(order.orderStatus)}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#334155' }}>Shipping Address</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                                                {order.shippingAddress || 'Stored Profile Address'}
                                            </p>
                                        </div>
                                        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#334155' }}>Payment Details</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                                                Method: <strong>{order.paymentMethod || 'COD'}</strong><br/>
                                                Status: {order.paymentStatus || 'Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Order Items</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {order.items && order.items.length > 0 ? order.items.map((item, idxx) => (
                                            <div key={idxx} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <img 
                                                    src={item.itemType === 'PACKAGE' ? resolvePackageImage(item.productImage) : resolveProductImage(item.productImage, item.productId)} 
                                                    alt={item.productName} 
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <Link to={item.itemType === 'PACKAGE' ? `/package/${item.productId}` : `/product/${item.productId}`} style={{ fontWeight: 'bold', color: 'var(--primary-green)', textDecoration: 'none', fontSize: '1rem', display: 'block', marginBottom: '2px' }}>
                                                        {item.productName || 'Unknown Product'}
                                                    </Link>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Qty: {item.quantity || 1}</div>
                                                </div>
                                                <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
                                                    ₹{item.price * (item.quantity || 1)}
                                                </div>
                                            </div>
                                        )) : (
                                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>No item details available.</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* CUSTOM CONFIRMATION MODAL */}
            <AnimatePresence>
                {isCancelModalOpen && (
                    <div style={modalOverlayStyle}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={modalBackdropStyle}
                            onClick={() => !isCancelling && setIsCancelModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={modalContentStyle}
                        >
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                                <div style={warningIconContainerStyle}>
                                    <FaExclamationTriangle size={32} color="#ef4444" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>Cancel Order?</h3>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
                                    Are you sure you want to cancel order <strong>#{orderToCancel}</strong>? This action cannot be undone and your items will be returned to stock.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button 
                                        onClick={() => setIsCancelModalOpen(false)} 
                                        disabled={isCancelling}
                                        style={{ ...modalBtnStyle, backgroundColor: '#f1f5f9', color: '#475569' }}
                                    >
                                        No, Keep It
                                    </button>
                                    <button 
                                        onClick={handleCancelOrder} 
                                        disabled={isCancelling}
                                        style={{ ...modalBtnStyle, backgroundColor: '#ef4444', color: '#fff' }}
                                    >
                                        {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FEEDBACK MODAL */}
            <AnimatePresence>
                {isFeedbackModalOpen && orderForFeedback && (
                    <div style={modalOverlayStyle}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={modalBackdropStyle}
                            onClick={() => !isSubmittingFeedback && setIsFeedbackModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ ...modalContentStyle, maxWidth: '500px', padding: '24px' }}
                        >
                            {!feedbackItem ? (
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem' }}>Select Product to Review</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Which item from Order #{orderForFeedback.orderId} would you like to review?</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                                        {orderForFeedback.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setFeedbackItem(item)} className="hover-bg-slate-50">
                                                <img 
                                                    src={item.itemType === 'PACKAGE' ? resolvePackageImage(item.productImage) : resolveProductImage(item.productImage, item.productId)} 
                                                    alt={item.productName} 
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                                                />
                                                <span style={{ fontWeight: '500', color: '#334155', flex: 1 }}>{item.productName}</span>
                                                <button style={{ padding: '6px 12px', background: 'var(--primary-green)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Review</button>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsFeedbackModalOpen(false)} style={{ width: '100%', padding: '10px', marginTop: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>Product Feedback</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
                                        <img src={feedbackItem.itemType === 'PACKAGE' ? resolvePackageImage(feedbackItem.productImage) : resolveProductImage(feedbackItem.productImage, feedbackItem.productId)} alt={feedbackItem.productName} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <span style={{ fontWeight: '600', color: '#334155' }}>{feedbackItem.productName}</span>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569', fontSize: '0.9rem' }}>Rating</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <FaStar
                                                    key={star}
                                                    size={24}
                                                    color={star <= feedbackForm.rating ? '#fbbf24' : '#cbd5e1'}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569', fontSize: '0.9rem' }}>Your Review (Optional)</label>
                                        <textarea 
                                            value={feedbackForm.comments}
                                            onChange={e => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                                            placeholder="What did you like or dislike?"
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#475569', fontSize: '0.9rem' }}>Suggestions for improvement (Optional)</label>
                                        <textarea 
                                            value={feedbackForm.suggestions}
                                            onChange={e => setFeedbackForm({ ...feedbackForm, suggestions: e.target.value })}
                                            placeholder="Any ways we can improve?"
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button 
                                            onClick={() => setFeedbackItem(null)} 
                                            disabled={isSubmittingFeedback}
                                            style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: '500', cursor: 'pointer' }}
                                        >
                                            Back
                                        </button>
                                        <button 
                                            onClick={submitFeedback} 
                                            disabled={isSubmittingFeedback}
                                            style={{ flex: 2, padding: '10px', background: 'var(--primary-green)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: isSubmittingFeedback ? 'not-allowed' : 'pointer' }}
                                        >
                                            {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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

// Modal Styles
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
};

const modalBackdropStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    zIndex: 10000
};

const warningIconContainerStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#fee2e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto'
};

const modalBtnStyle = {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default MyOrders;
