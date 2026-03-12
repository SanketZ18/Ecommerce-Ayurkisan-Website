import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaArrowRight, FaShoppingBasket } from 'react-icons/fa';
import customerService from '../utils/customerService';
import { toast } from 'react-toastify';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRole = localStorage.getItem('role') || 'CUSTOMER';
    const userId = localStorage.getItem('userId');

    const fetchCart = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const res = await customerService.getCart(userId, userRole);
            setCartData(res.data);
            setCartItems(res.data.items || []);
        } catch (error) {
            toast.error("Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    };

    useState(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, itemType, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await customerService.updateCartQuantity(userId, itemId, itemType, newQuantity);
            fetchCart();
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    const removeItem = async (itemId, itemType) => {
        try {
            await customerService.removeFromCart(userId, itemId, itemType);
            fetchCart();
            toast.success("Item removed");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const BOX_DISCOUNT_PERCENT = 30;
    const CUSTOMER_TOTAL_DISCOUNT_PERCENT = 10;

    const subtotal = cartData?.totalOriginalPrice || 0;
    const total = cartData?.totalDiscountedPrice || 0;
    const shipping = 50;
    const finalTotal = total + shipping;

    if (cartItems.length === 0) {
        return (
            <div style={{ padding: '4rem 5%', textAlign: 'center', minHeight: '60vh' }}>
                <h2 style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products" className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none' }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 5%', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: '2rem' }}>
                <style>{`
                    .cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
                    @media (max-width: 800px) { .cart-layout { grid-template-columns: 1fr; } }
                `}</style>
                <div className="cart-layout">
                    {/* Cart Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {cartItems.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', alignItems: 'center', border: '1px solid #f3f4f6' }}
                            >
                                <Link to={item.itemType === 'PACKAGE' ? `/package/${item.productName}` : `/product/${item.productName}`}>
                                    <img src={item.productImage || 'https://via.placeholder.com/100?text=Ayurkisan'} alt={item.productName} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />
                                </Link>
                                <div style={{ flex: 1 }}>
                                    <Link to={item.itemType === 'PACKAGE' ? `/package/${item.productName}` : `/product/${item.productName}`} style={{ textDecoration: 'none' }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-dark)', cursor: 'pointer' }}>{item.productName}</h3>
                                    </Link>

                                    {item.discountedPrice < item.price ? (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <p style={{ margin: 0, color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    ₹{item.discountedPrice.toLocaleString()}
                                                </p>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                                    ₹{item.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ margin: 0, color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                    )}

                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button onClick={() => updateQuantity(item.productId, item.itemType, item.quantity - 1)} style={qtyBtn}>-</button>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ width: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{item.itemType === 'RETAILER' ? 'Boxes' : 'Items'}</span>
                                    </div>
                                    <button onClick={() => updateQuantity(item.productId, item.itemType, item.quantity + 1)} style={qtyBtn}>+</button>
                                </div>
                                <div style={{ marginLeft: '1rem' }}>
                                    <button onClick={() => removeItem(item.productId, item.itemType)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', alignSelf: 'start', position: 'sticky', top: '100px', border: '1px solid #f3f4f6' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-dark)', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>Order Summary</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-light)' }}>
                            <span>Subtotal</span>
                            <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>₹{subtotal.toLocaleString()}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#10b981' }}>
                            <span>Total Discount</span>
                            <span style={{ fontWeight: '500' }}>- ₹{(subtotal - total).toLocaleString()}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-light)' }}>
                            <span>Shipping estimate</span>
                            <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>₹{shipping}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary-green)' }}>₹{finalTotal.toLocaleString()}</span>
                        </div>

                        <Link to="/checkout" style={{ display: 'block', textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ width: '100%', padding: '1rem', marginTop: '2rem', backgroundColor: 'var(--primary-green)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                            >
                                Proceed to Checkout <FaArrowRight />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const qtyBtn = {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default Cart;
