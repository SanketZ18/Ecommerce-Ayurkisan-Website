import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTruck, FaMapMarkerAlt, FaCreditCard, FaReceipt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import customerService from '../utils/customerService';
import { toast } from 'react-toastify';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderDone, setOrderDone] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'COD'
    });

    useEffect(() => {
        fetchCheckoutData();
    }, []);

    const fetchCheckoutData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            if (userId) {
                const profileRes = await customerService.getProfile(userId);
                if (profileRes.data) {
                    setFormData(prev => ({
                        ...prev,
                        name: profileRes.data.name || '',
                        address: profileRes.data.address || '',
                        phone: profileRes.data.phoneNumber || ''
                    }));
                }
                const cartRes = await customerService.getCart(userId, role);
                setCartData(cartRes.data);
            }
        } catch (error) {
            console.error("Checkout data fetch error:", error);
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
                formData.address
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

    if (orderDone) {
        return (
            <div style={{ padding: '80px 5%', textAlign: 'center', backgroundColor: '#f9fafb', minHeight: '80vh' }}>
                <FaCheckCircle size={70} color="#10b981" />
                <h1 style={{ margin: '20px 0' }}>Thank You!</h1>
                <p style={{ color: '#64748b' }}>Your order has been placed successfully. Order ID: <strong>#{orderInfo?.id}</strong></p>
                <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button className="btn-primary" onClick={() => navigate('/customer/orders')}>Track Order</button>
                    <button className="btn-outline" onClick={() => navigate('/')}>Back Home</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 5%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
                <div>
                    <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><FaReceipt /> Checkout</h2>

                    <div style={cardStyle}>
                        <h3 style={sectionTitleStyle}><FaMapMarkerAlt /> Shipping Details</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>Confirm or edit your shipping information for this order.</p>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                style={inputStyle} 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Name" 
                            />
                            <input 
                                style={inputStyle} 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="Phone" 
                            />
                            <textarea 
                                style={{ ...inputStyle, minHeight: '80px' }} 
                                value={formData.address} 
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="Address" 
                            />
                        </form>
                    </div>

                    <div style={{ ...cardStyle, marginTop: '20px' }}>
                        <h3 style={sectionTitleStyle}><FaCreditCard /> Payment</h3>
                        <div style={{ marginTop: '15px', padding: '15px', border: '2px solid #10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaTruck color="#10b981" /> <strong>Cash on Delivery (Standard)</strong>
                        </div>
                    </div>
                </div>

                <aside>
                    <div style={cardStyle}>
                        <h3 style={sectionTitleStyle}>Order Summary</h3>
                        <div style={{ marginTop: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                            {cartData?.items?.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                                    <span>{item.productName} x {item.quantity}</span>
                                    <span>₹{item.totalItemPrice}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: '2px solid #111827', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Grand Total</span>
                                <span>₹{cartData?.totalDiscountedPrice || 0}</span>
                            </div>
                        </div>
                        <button
                            style={placeOrderBtnStyle}
                            disabled={loading}
                            onClick={handlePlaceOrder}
                        >
                            {loading ? 'Processing...' : 'Confirm Order'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const cardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const sectionTitleStyle = { fontSize: '1.1rem', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none' };
const placeOrderBtnStyle = { width: '100%', padding: '15px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '25px', fontWeight: '700', cursor: 'pointer' };

export default Checkout;
