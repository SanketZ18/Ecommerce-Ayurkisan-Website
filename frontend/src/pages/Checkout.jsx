import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTruck, FaMapMarkerAlt, FaCreditCard, FaReceipt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import customerService from '../utils/customerService';
import retailerService from '../utils/retailerService';
import { toast } from 'react-toastify';
import { clearAuthData } from '../utils/auth';
import { resolveProductImage, resolvePackageImage } from '../utils/imageUtils';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderDone, setOrderDone] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [appliedOffer, setAppliedOffer] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'COD'
    });

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return toast.error("Enter a code first");
        try {
            const subtotalAmount = cartData?.totalDiscountedPrice || 0;
            // Changed from GET to POST to match backend and fixed parameter name
            const res = await axios.post(`http://localhost:9090/api/offers/validate`, {
                code: promoCode,
                amount: subtotalAmount
            });
            const offer = res.data;
            
            let disc = 0;
            if (offer.discountType === 'PERCENTAGE') {
                disc = (subtotalAmount * offer.discountValue) / 100;
            } else {
                disc = offer.discountValue;
            }
            
            setAppliedOffer(offer);
            setDiscountAmount(disc);
            toast.success("Promo code applied!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid or expired promo code");
        }
    };

    const handleRemovePromo = () => {
        setAppliedOffer(null);
        setDiscountAmount(0);
        setPromoCode('');
        toast.info("Promo code removed");
    };

    useEffect(() => {
        fetchCheckoutData();
    }, []);

    const fetchCheckoutData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            if (userId) {
                // Fetch Profile based on role
                let profileRes;
                if (role === 'RETAILER') {
                    profileRes = await retailerService.getProfile(userId);
                    if (profileRes.data) {
                        setFormData(prev => ({
                            ...prev,
                            name: profileRes.data.retailerName || profileRes.data.name || '',
                            address: profileRes.data.address || '',
                            phone: profileRes.data.phoneNumber || ''
                        }));
                    }
                } else {
                    profileRes = await customerService.getProfile(userId);
                    if (profileRes.data) {
                        setFormData(prev => ({
                            ...prev,
                            name: profileRes.data.name || '',
                            address: profileRes.data.address || '',
                            phone: profileRes.data.phoneNumber || ''
                        }));
                    }
                }
                
                const cartRes = await customerService.getCart(userId, role);
                setCartData(cartRes.data);
            }
        } catch (error) {
            console.error("Checkout data fetch error:", error);
            // If user is not found (deleted) or unauthorized, logout
            if (error.response && (error.response.status === 401 || 
                (error.response.data && error.response.data.message && error.response.data.message.includes("not found")))) {
                clearAuthData();
                window.location.href = '/';
            }
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await customerService.placeOrder(
                formData.paymentMethod,
                formData.name,
                formData.phone,
                formData.address,
                appliedOffer?.code
            );
            if (res.status === 200 || res.status === 201) {
                setOrderInfo(res.data);
                setOrderDone(true);
                toast.success("Order Placed!");
            }
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const calculateDiscount = (original, discounted) => {
        if (!original || original <= discounted) return null;
        return Math.round(((original - discounted) / original) * 100);
    };

    if (orderDone) {
        return (
            <div style={{ padding: '80px 5%', textAlign: 'center', backgroundColor: '#f3f4f6', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '30px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
                    <FaCheckCircle size={80} color="#10b981" />
                    <h1 style={{ margin: '30px 0', fontSize: '2.5rem', fontWeight: '800', color: '#111827' }}>Order Confirmed!</h1>
                    <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Thank you for your purchase. Your order has been placed successfully. 
                        We'll send you an email confirmation shortly.
                    </p>
                    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '15px', margin: '30px 0', border: '1px dashed #d1d5db' }}>
                        <span style={{ color: '#6b7280', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>ORDER ID</span>
                        <strong style={{ fontSize: '1.4rem', color: '#111827' }}>#{orderInfo?.orderId || orderInfo?.id}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button style={{ ...placeOrderBtnStyle, width: 'auto', padding: '15px 40px', marginTop: 0 }} onClick={() => navigate(localStorage.getItem('role') === 'RETAILER' ? '/retailer/orders' : '/customer/orders')}>Track Order</button>
                        <button style={{ ...placeOrderBtnStyle, width: 'auto', padding: '15px 40px', marginTop: 0, backgroundColor: '#fff', color: '#111827', border: '2px solid #e5e7eb' }} onClick={() => navigate('/')}>Back Home</button>
                    </div>
                </div>
            </div>
        );
    }

    const itemsTotalOriginal = cartData?.totalOriginalPrice || 0;
    const subtotal = cartData?.totalDiscountedPrice || 0;
    const roleDiscountAmount = itemsTotalOriginal - subtotal;
    const subtotalAfterPromo = subtotal - discountAmount;
    
    // Assuming 18% GST is included in the subtotalAfterPromo
    const baseAmount = subtotalAfterPromo / 1.18;
    const gstAmount = subtotalAfterPromo - baseAmount;
    
    const deliveryCharge = 50.0;
    const grandTotal = subtotalAfterPromo + deliveryCharge;

    return (
        <div style={{ padding: '40px 5%', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: '#10b981', color: '#fff', padding: '10px', borderRadius: '12px', display: 'flex' }}><FaReceipt /></div>
                    Checkout Detail
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '40px' }} className="checkout-layout">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Shipping Section */}
                        <div style={cardStyle}>
                            <h3 style={sectionTitleStyle}><FaMapMarkerAlt color="#10b981" /> Shipping Information</h3>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '10px 0 20px 0' }}>Review your delivery address and contact details.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={labelStyle}>Full Name</label>
                                    <input 
                                        style={inputStyle} 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Full Name" 
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={labelStyle}>Phone Number</label>
                                    <input 
                                        style={inputStyle} 
                                        value={formData.phone} 
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        placeholder="Mobile Number" 
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Delivery Address</label>
                                    <textarea 
                                        style={{ ...inputStyle, minHeight: '100px' }} 
                                        value={formData.address} 
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        placeholder="Complete Address" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items Review Section */}
                        <div style={cardStyle}>
                            <h3 style={sectionTitleStyle}><FaTruck color="#10b981" /> 1. Review items and shipping</h3>
                            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {cartData?.items?.map(item => (
                                    <div key={item.id} style={{ display: 'flex', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
                                        <div style={{ width: '100px', height: '100px', backgroundColor: '#f9fafb', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                                            <img 
                                                src={item.itemType === 'PACKAGE' ? resolvePackageImage(item.productImage) : resolveProductImage(item.productImage, item.productId)} 
                                                alt={item.productName} 
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=Product'}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', fontWeight: '700', color: '#111827' }}>{item.productName}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#6b7280', fontSize: '0.9rem', marginBottom: '10px' }}>
                                                <span>Qty: <strong>{localStorage.getItem('role') === 'RETAILER' && item.itemType === 'PRODUCT' ? (item.quantity / 10) : item.quantity}</strong> {localStorage.getItem('role') === 'RETAILER' && item.itemType === 'PRODUCT' ? 'Boxes' : 'Units'}</span>
                                                {calculateDiscount(item.price, item.discountedPrice) && (
                                                    <span style={{ color: '#10b981', fontWeight: '700', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '6px' }}>
                                                        {calculateDiscount(item.price, item.discountedPrice)}% Off
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827' }}>₹{item.discountedPrice * item.quantity}</span>
                                                {item.price > item.discountedPrice && (
                                                    <span style={{ fontSize: '0.9rem', color: '#9ca3af', textDecoration: 'line-through' }}>₹{item.price * item.quantity}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div style={cardStyle}>
                            <h3 style={sectionTitleStyle}><FaCreditCard color="#10b981" /> 2. Payment Method</h3>
                            <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #10b981', borderRadius: '15px', backgroundColor: '#f0fdf4' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ backgroundColor: '#10b981', color: '#fff', padding: '8px', borderRadius: '50%', display: 'flex' }}><FaCheckCircle /></div>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1rem' }}>Cash on Delivery</strong>
                                        <span style={{ color: '#047857', fontSize: '0.85rem' }}>Pay when your package arrives</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside>
                        <div style={{ ...cardStyle, position: 'sticky', top: '20px', border: '2px solid #111827' }}>
                            <h3 style={{ ...sectionTitleStyle, fontSize: '1.3rem' }}>Order Summary</h3>
                            <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={summaryRowStyle}>
                                    <span>Items Subtotal (Original):</span>
                                    <span>₹{itemsTotalOriginal.toFixed(2)}</span>
                                </div>
                                {roleDiscountAmount > 0 && (
                                    <div style={{ ...summaryRowStyle, color: '#2563eb', fontWeight: '700' }}>
                                        <span>User Discount ({localStorage.getItem('role') === 'RETAILER' ? '30%' : '10%'}):</span>
                                        <span>- ₹{roleDiscountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {appliedOffer && (
                                    <div style={{ ...summaryRowStyle, color: '#10b981', fontWeight: '700' }}>
                                        <span>Promo Discount ({appliedOffer.code}):</span>
                                        <span>- ₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div style={{ ...summaryRowStyle, borderTop: '1px dashed #e5e7eb', paddingTop: '10px' }}>
                                    <span>Value After Discounts:</span>
                                    <span>₹{subtotalAfterPromo.toFixed(2)}</span>
                                </div>
                                <div style={{ ...summaryRowStyle, color: '#64748b' }}>
                                    <span>Amount before GST:</span>
                                    <span>₹{baseAmount.toFixed(2)}</span>
                                </div>
                                <div style={{ ...summaryRowStyle, color: '#64748b' }}>
                                    <span>GST (18% Included):</span>
                                    <span>₹{gstAmount.toFixed(2)}</span>
                                </div>
                                <div style={summaryRowStyle}>
                                    <span>Delivery Charge:</span>
                                    <span style={{ color: '#10b981', fontWeight: '700' }}>+ ₹{deliveryCharge.toFixed(2)}</span>
                                </div>
                                <div style={{ ...summaryRowStyle, borderTop: '1px solid #f3f4f6', paddingTop: '15px', marginTop: '10px' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Grand Total</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>₹{grandTotal.toFixed(2)}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', lineHeight: '1.4', margin: '15px 0' }}>
                                    By placing your order, you agree to AyurKisan's privacy notice and conditions of use.
                                </p>
                                <button
                                    style={placeOrderBtnStyle}
                                    disabled={loading}
                                    onClick={handlePlaceOrder}
                                >
                                    {loading ? 'Processing...' : 'Place Your Order'}
                                </button>
                                
                                <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: '700' }}>Apply Promo Code</h4>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            placeholder="Enter Code" 
                                            style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: '0.85rem' }} 
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            disabled={appliedOffer}
                                        />
                                        {appliedOffer ? (
                                            <button 
                                                onClick={handleRemovePromo}
                                                style={{ padding: '8px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleApplyPromo}
                                                style={{ padding: '8px 15px', background: '#111827', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </div>
                                    {appliedOffer && (
                                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}>
                                            <FaCheckCircle size={12} /> {appliedOffer.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .checkout-layout { grid-template-columns: 1fr !important; }
                    aside { order: -1; }
                }
            `}</style>
        </div>
    );
};

const cardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' };
const sectionTitleStyle = { fontSize: '1.15rem', margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', color: '#111827' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#4b5563' };
const inputStyle = { padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem' };
const summaryRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#4b5563' };
const placeOrderBtnStyle = { width: '100%', padding: '18px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '15px', marginTop: '15px', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(17, 24, 39, 0.2)' };

export default Checkout;
