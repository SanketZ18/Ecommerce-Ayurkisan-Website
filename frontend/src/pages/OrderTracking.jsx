import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTruck, FaBox, FaHome, FaArrowLeft, FaBan, FaUndo, FaInfoCircle } from 'react-icons/fa';
import customerService from '../utils/customerService';
import { toast } from 'react-toastify';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                // Fetch both tracking and order details to ensure we have all info
                const [trackRes, ordersRes] = await Promise.all([
                    customerService.trackShipment(orderId).catch(() => ({ data: null })),
                    customerService.getMyOrders().catch(() => ({ data: [] }))
                ]);

                const orderInfo = ordersRes.data?.find(o => o.orderId === orderId || o.id === orderId);
                const trackData = trackRes.data;

                if (trackData || orderInfo) {
                    const items = orderInfo?.items || [];
                    const firstItemName = items.length > 0 ? items[0].productName : 'Your Order';
                    const productDisplay = items.length > 1 ? `${firstItemName} +${items.length - 1} more` : firstItemName;
                    
                    setTrackingData({
                        ...(trackData || {}),
                        orderId: orderId,
                        status: orderInfo?.orderStatus || trackData?.status || 'PENDING',
                        totalAmount: orderInfo?.totalDiscountedPrice || orderInfo?.totalAmount || 0,
                        orderDate: orderInfo?.orderDate || orderInfo?.createdAt || trackData?.history?.[0]?.date || new Date().toISOString(),
                        productName: productDisplay,
                        // Ensure history exists
                        history: trackData?.history || [
                            { status: 'Order Placed', date: orderInfo?.orderDate || orderInfo?.createdAt || new Date().toISOString(), location: 'Website' }
                        ],
                        trackingNumber: trackData?.trackingNumber || 'Awaiting Shipment',
                        carrier: trackData?.carrier || 'Ayurkisan Express'
                    });
                } else {
                    // Fallback Dummy Data for design demonstration
                    setTrackingData({
                        id: 1,
                        orderId: orderId,
                        productName: 'Herbal Immunity Booster Pack',
                        totalAmount: 1450.00,
                        trackingNumber: `TRK-${Math.floor(Math.random() * 1000000)}`,
                        carrier: 'Bluedart Logistics',
                        status: 'IN_TRANSIT',
                        orderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
                        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
                        history: [
                            { status: 'Order Placed', date: new Date(Date.now() - 86400000 * 2).toISOString(), location: 'Website' },
                            { status: 'Packed', date: new Date(Date.now() - 86400000 * 1.5).toISOString(), location: 'Ayurkisan Fulfillment Center' },
                            { status: 'Shipped', date: new Date(Date.now() - 86400000 * 1).toISOString(), location: 'Logistics Hub' },
                            { status: 'In Transit', date: new Date().toISOString(), location: 'On the way' }
                        ]
                    });
                }
            } catch (error) {
                console.error("Tracking fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchTracking();
        }
    }, [orderId]);

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await customerService.cancelOrder(orderId);
            toast.success("Order cancelled successfully");
            window.location.reload();
        } catch (e) {
            toast.error("Failed to cancel order");
        }
    };

    const handleReturn = async () => {
        // Navigate to return request page
        navigate(`/customer/returns/request/${orderId}`);
    };

    const getProgressLevel = (status) => {
        const s = status?.toUpperCase();
        if (s?.startsWith('RETURN')) {
            switch (s) {
                case 'RETURN_REQUESTED': return 1;
                case 'RETURN_ACCEPTED': return 2;
                case 'RETURN_PICKUP': return 3;
                case 'RETURNED': return 4;
                case 'REFUNDED': return 4;
                default: return 1;
            }
        }
        switch (s) {
            case 'PLACED': return 1;
            case 'PENDING': return 1;
            case 'PACKED': return 2;
            case 'SHIPPED': return 3;
            case 'IN_TRANSIT': return 3;
            case 'OUT_FOR_DELIVERY': return 4;
            case 'DELIVERED': return 5;
            default: return 1;
        }
    };

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Tracking Information...</div>;
    }

    if (!trackingData) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Tracking information not found for {orderId}</h2>
                <Link to="/customer/orders" style={{ color: 'var(--primary-green)' }}>Back to Orders</Link>
            </div>
        );
    }

    const currentLevel = getProgressLevel(trackingData.status);

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '900px', margin: '0 auto', minHeight: '60vh' }}>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link to="/customer/orders" style={{ color: 'var(--text-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaArrowLeft /> Back
                </Link>
                <h1 style={{ color: '#1e293b', fontSize: '2rem', margin: 0 }}>Track Package</h1>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>

                {/* Header Info */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div>
                        <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9rem' }}>Product / Package</p>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>{trackingData.productName}</h3>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9rem' }}>Total Amount</p>
                        <h3 style={{ margin: 0, color: '#10b981', fontWeight: '800' }}>₹{trackingData.totalAmount}</h3>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9rem' }}>Tracking Number</p>
                        <h3 style={{ margin: 0, color: '#475569' }}>{trackingData.trackingNumber}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.9rem' }}>Status</p>
                        <span style={{
                            padding: '6px 15px',
                            borderRadius: '50px',
                            backgroundColor: trackingData.status === 'DELIVERED' ? '#dcfce7' : '#eff6ff',
                            color: trackingData.status === 'DELIVERED' ? '#166534' : '#1e40af',
                            fontWeight: '700',
                            fontSize: '0.85rem'
                        }}>
                            {trackingData.status}
                        </span>
                    </div>
                </div>

                {/* Progress Bar UI */}
                <div style={{ marginBottom: '4rem', position: 'relative', padding: '0 20px' }}>

                    {/* Background Line */}
                    <div style={{ position: 'absolute', top: '20px', left: '40px', right: '40px', height: '4px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>

                    {/* Active Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: trackingData.status?.toUpperCase().startsWith('RETURN') 
                            ? `${((currentLevel - 1) / 3) * 100}%` 
                            : `${((currentLevel - 1) / 4) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ position: 'absolute', top: '20px', left: '40px', height: '4px', backgroundColor: 'var(--primary-green)', zIndex: 1, maxWidth: 'calc(100% - 80px)' }}
                    ></motion.div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                        {trackingData.status?.toUpperCase().startsWith('RETURN') ? (
                            <>
                                <StepIcon icon={<FaUndo />} label="Request Sent" active={currentLevel >= 1} current={currentLevel === 1} />
                                <StepIcon icon={<FaCheckCircle />} label="Accepted" active={currentLevel >= 2} current={currentLevel === 2} />
                                <StepIcon icon={<FaTruck />} label="Pickup" active={currentLevel >= 3} current={currentLevel === 3} />
                                <StepIcon icon={<FaBox />} label="Refunded" active={currentLevel >= 4} current={currentLevel === 4} />
                            </>
                        ) : (
                            <>
                                <StepIcon icon={<FaBox />} label="Ordered" active={currentLevel >= 1} current={currentLevel === 1} />
                                <StepIcon icon={<FaTruck />} label="Shipped" active={currentLevel >= 3} current={currentLevel === 3} />
                                <StepIcon icon={<FaHome />} label="Out for Delivery" active={currentLevel >= 4} current={currentLevel === 4} />
                                <StepIcon icon={<FaCheckCircle />} label="Delivered" active={currentLevel >= 5} current={currentLevel === 5} />
                            </>
                        )}
                    </div>
                </div>

                {/* Detailed History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '20px', marginBottom: '3rem' }}>

                    {/* Vertical Timeline Line */}
                    <div style={{ position: 'absolute', left: '26px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#e2e8f0' }}></div>

                    {[...(trackingData.history || [])].reverse().map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}
                        >
                            <div style={{
                                width: '14px', height: '14px', borderRadius: '50%',
                                backgroundColor: idx === 0 ? '#10b981' : '#cbd5e1',
                                border: '3px solid #fff',
                                marginTop: '5px',
                                boxShadow: idx === 0 ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : 'none'
                            }}></div>

                            <div>
                                <h4 style={{ margin: '0 0 4px 0', color: idx === 0 ? '#1e293b' : '#475569', fontSize: '1.05rem' }}>{event.status}</h4>
                                <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.9rem' }}>{event.location}</p>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Buttons & Info */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        {['PENDING', 'ORDERED', 'PACKED'].includes(trackingData.status?.toUpperCase()) ? (
                            <button
                                style={{ ...actionBtnStyle, backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }}
                                onClick={handleCancel}
                            >
                                <FaBan /> Cancel Order
                            </button>
                        ) : trackingData.status?.toUpperCase() === 'DELIVERED' ? (
                            <button
                                style={{ ...actionBtnStyle, backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' }}
                                onClick={handleReturn}
                                disabled={new Date() - new Date(trackingData.history.find(h => h.status === 'Delivered')?.date) > 5 * 86400000}
                            >
                                <FaUndo /> Return Order
                            </button>
                        ) : (['CANCELLED', 'RETURNED', 'REFUNDED'].includes(trackingData.status?.toUpperCase())) ? (
                            <div style={{ padding: '10px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                                Process Completed
                            </div>
                        ) : (
                            <button style={{ ...actionBtnStyle, opacity: 0.5, cursor: 'not-allowed' }} disabled>
                                <FaTruck /> In Transit
                            </button>
                        )}
                    </div>

                    {trackingData.status?.toUpperCase() === 'DELIVERED' && (
                        <div style={infoBoxStyle}>
                            <FaInfoCircle />
                            <span>Note: Product can only be returned within <strong>5 days</strong> of delivery. After 5 days, the return button will be disabled.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Component for the Progress Steps
const actionBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 30px',
    borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
    transition: 'all 0.2s', border: '1px solid #cbd5e1', backgroundColor: '#fff'
};

const infoBoxStyle = {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
    backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#1e40af', borderRadius: '12px',
    fontSize: '0.9rem', border: '1px solid rgba(59, 130, 246, 0.1)'
};

const StepIcon = ({ icon, label, active, current }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100px' }}>
        <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: current ? 1.1 : 1 }}
            style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: active ? '#10b981' : '#fff',
                border: active ? 'none' : '2px solid #e2e8f0',
                color: active ? '#fff' : '#cbd5e1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: current ? '0 0 0 6px rgba(16, 185, 129, 0.15)' : 'none',
                transition: 'all 0.3s'
            }}
        >
            {React.cloneElement(icon, { size: 20 })}
        </motion.div>
        <span style={{ fontSize: '0.85rem', fontWeight: active ? '700' : '500', color: active ? '#1e293b' : '#94a3b8', textAlign: 'center' }}>
            {label}
        </span>
    </div>
);

export default OrderTracking;
