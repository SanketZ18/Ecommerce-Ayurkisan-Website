import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    // Note: This component used mock data in the "Original" but I'll keep the logic if the user wants it connected to real data later.
    // However, for now, I'll just restore the original UI feel.
    const [wishlistItems, setWishlistItems] = useState([
        { id: 1, name: 'Handmade Rose & Oudh Soap', price: 250, image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=300&h=200&fit=crop', inStock: true, piecesPerBox: 10 },
        { id: 2, name: 'Herbal Neem Facewash', price: 180, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop', inStock: true, piecesPerBox: 5 },
        { id: 3, name: 'Premium Jasmine Green Tea', price: 450, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=300&h=200&fit=crop', inStock: true, piecesPerBox: 12 },
    ]);

    const userRole = localStorage.getItem('role') || 'CUSTOMER';

    const removeFromWishlist = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    if (wishlistItems.length === 0) {
        return (
            <div style={{ padding: '4rem 5%', textAlign: 'center', minHeight: '60vh' }}>
                <FaHeart style={{ fontSize: '4rem', color: '#e5e7eb', marginBottom: '1rem' }} />
                <h2 style={{ color: '#111827', marginBottom: '1rem' }}>Your Wishlist is Empty</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Save your favorite items here to buy them later.</p>
                <Link to="/products" className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none' }}>
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '3rem 5%', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                <FaHeart style={{ fontSize: '2rem', color: '#ef4444' }} />
                <h1 style={{ color: '#111827', margin: 0 }}>My Wishlist</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {wishlistItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', position: 'relative' }}
                    >
                        <button
                            onClick={() => removeFromWishlist(item.id)}
                            style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                        >
                            <FaTrash size={12} />
                        </button>

                        <div style={{ height: '180px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>

                        <div style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>{item.name}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{item.price}</span>
                                <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#166534' }}>In Stock</span>
                            </div>
                            <button className="btn-primary" style={{ width: '100%' }}>
                                <FaShoppingCart size={14} style={{ marginRight: '8px' }} /> Move to Cart
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
