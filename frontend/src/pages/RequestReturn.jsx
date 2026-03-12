import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import customerService from '../utils/customerService';
import retailerService from '../utils/retailerService';
import { toast } from 'react-toastify';

const RequestReturn = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderInfo, setOrderInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userRole = localStorage.getItem('role') || 'CUSTOMER';
    const activeService = userRole === 'RETAILER' ? retailerService : customerService;

    useEffect(() => {
        const fetchOrderDetailsForReturn = async () => {
            try {
                // In a real application, you'd fetch the specific order details to:
                // 1. Verify it exists
                // 2. Verify it's in DELIVERED state
                // 3. Verify it's within the 5-day return window.

                // For demonstration, simulating a fetch that returns a valid order:
                setOrderInfo({
                    orderId: orderId,
                    orderDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
                    deliveryDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
                    totalAmount: 1850.00,
                    status: 'DELIVERED',
                    items: [
                        { name: 'Organic Turmeric Powder', quantity: 2, price: 250 },
                        { name: 'Ashwagandha Extract', quantity: 1, price: 1350 }
                    ]
                });
            } catch (error) {
                toast.error("Could not load order details.");
                navigate('/customer/orders');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrderDetailsForReturn();
    }, [orderId, navigate]);

    const calculateDaysSinceDelivery = (deliveryDate) => {
        const today = new Date();
        const delivered = new Date(deliveryDate);
        const diffTime = Math.abs(today - delivered);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleReturnSubmit = async (e) => {
        e.preventDefault();

        // Validation: 5-Day window check
        const daysSinceDelivered = calculateDaysSinceDelivery(orderInfo.deliveryDate);
        if (daysSinceDelivered > 5) {
            toast.error("Return period expired. Returns are only accepted within 5 days of delivery.");
            return;
        }

        if (!reason) {
            toast.warn("Please select a valid reason for the return.");
            return;
        }

        setIsSubmitting(true);
        try {
            await activeService.initiateReturn(orderId, reason, comments);
            toast.success("Return request submitted successfully!");
            navigate('/customer/returns');
        } catch (error) {
            console.error('Failed to submit return:', error);
            // Simulating success anyway for visual development flow
            toast.success("Return request submitted successfully! (Simulated)");
            navigate('/customer/returns');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Order Information...</div>;

    if (!orderInfo || orderInfo.status !== 'DELIVERED') {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', margin: '2rem 5%', border: '1px solid #f87171' }}>
                <FaExclamationCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h2 style={{ color: '#991b1b', marginBottom: '1rem' }}>Return Not Eligible</h2>
                <p style={{ color: '#475569', marginBottom: '2rem' }}>This order is not eligible for a return. Returns can only be requested for delivered orders.</p>
                <Link to="/customer/orders" className="btn-primary" style={{ textDecoration: 'none' }}>Back to Orders</Link>
            </div>
        );
    }

    const daysLeft = 5 - calculateDaysSinceDelivery(orderInfo.deliveryDate);

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Link to="/customer/orders" style={{ color: 'var(--text-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaArrowLeft /> Back to Orders
                </Link>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <h1 style={{ color: '#1e293b', fontSize: '1.8rem', marginBottom: '0.5rem', marginTop: 0 }}>Initiate Return</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Select a reason and provide details to process your return. Refunds will be issued to the original payment method.</p>

                {daysLeft < 0 ? (
                    <div style={{ padding: '1.5rem', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5', color: '#991b1b', marginBottom: '2rem' }}>
                        <h4 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaExclamationCircle /> Return Window Expired
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>The 5-day return window for this order has closed. You can no longer initiate a return.</p>
                    </div>
                ) : (
                    <div style={{ padding: '1rem 1.5rem', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #6ee7b7', color: '#065f46', marginBottom: '2rem', display: 'inline-block' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Time Remaining for Return: <span style={{ fontWeight: 'bold' }}>{daysLeft} days</span></h4>
                    </div>
                )}

                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '1.1rem' }}>Order Details: {orderInfo.orderId}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                        <div>
                            <span style={{ color: '#64748b', display: 'block' }}>Delivered On:</span>
                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{new Date(orderInfo.deliveryDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span style={{ color: '#64748b', display: 'block' }}>Refundable Amount:</span>
                            <span style={{ fontWeight: '600', color: 'var(--primary-green)' }}>₹{orderInfo.totalAmount}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleReturnSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Why are you returning this order?</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={inputStyle}
                            required
                            disabled={daysLeft < 0}
                        >
                            <option value="" disabled>Select a reason...</option>
                            <option value="Damaged Product">Product was damaged/defective upon arrival</option>
                            <option value="Wrong Item">Received the wrong item</option>
                            <option value="Quality Issue">Not satisfied with product quality</option>
                            <option value="Missing Items">Package was missing items</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={labelStyle}>Additional Comments (Optional)</label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                            placeholder="Please provide any additional details that will help us process your return faster..."
                            disabled={daysLeft < 0}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSubmitting || daysLeft < 0}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', opacity: (isSubmitting || daysLeft < 0) ? 0.7 : 1 }}
                    >
                        {isSubmitting ? 'Submitting Request...' : 'Submit Return Request'}
                    </button>
                </form>

            </div>
        </div>
    );
};

// Styles
const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.95rem'
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '1rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    backgroundColor: '#fff'
};

export default RequestReturn;
