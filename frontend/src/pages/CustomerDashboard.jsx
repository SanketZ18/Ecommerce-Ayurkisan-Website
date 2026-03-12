import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaHeart, FaTruck, FaUndo, FaUserCircle, FaMapMarkerAlt, FaShoppingCart, FaSearch, FaChevronDown, FaLeaf, FaBurn, FaSpa, FaMoon, FaSun } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import i111 from '../assets/images/111.jpg';
import i112 from '../assets/images/112.jpg';
import i113 from '../assets/images/113.jpg';
import i114 from '../assets/images/114.jpg';
import i115 from '../assets/images/115.jpg';
import axios from 'axios';
import customerService from '../utils/customerService';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ orders: 0, wishlisted: 0, returns: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [packages, setPackages] = useState([]);
    const [suggestionTab, setSuggestionTab] = useState('products');
    const [loading, setLoading] = useState(true);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Default Sort');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const slides = [i111, i112, i113, i114, i115];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            if (userId) {
                const [profileRes, ordersRes, offersRes, productsRes, packagesRes, cartRes] = await Promise.all([
                    customerService.getProfile(userId),
                    customerService.getOrderHistory(userId),
                    axios.get('http://localhost:9090/api/homepage/sections').catch(() => ({ data: [] })),
                    customerService.getAllProducts().catch(() => ({ data: [] })),
                    customerService.getAllPackages().catch(() => ({ data: [] })),
                    customerService.getCart(userId, role).catch(() => ({ data: { items: [] } }))
                ]);

                setProfile(profileRes.data);
                const orderData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
                setRecentOrders(orderData.map(order => ({
                    ...order,
                    orderId: order.id,
                    orderDate: order.createdAt,
                    displayItems: order.items?.map(item => item.productName).join(', ') || 'Unnamed Items'
                })).slice(0, 5));

                // Process offers - filter only promotional types or use fallback if empty
                const fetchedOffers = Array.isArray(offersRes.data) ? offersRes.data.filter(s => s.type === 'promotional') : [];
                setOffers(fetchedOffers.length > 0 ? fetchedOffers : [
                    {
                        id: 1,
                        title: 'Special Summer Offers! 🌿',
                        subtitle: 'Get up to 30% off on all organic skin care products.',
                        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop'
                    }
                ]);

                setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
                setPackages(Array.isArray(packagesRes.data) ? packagesRes.data : []);

                // Real counts
                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                setWishlistCount(wishlist.length);
                setCartCount(cartRes.data?.items?.length || 0);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
    }

    // --- Styles (Moved inside to access isDarkMode) ---
    const dashboardWrapperStyle = { backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6', minHeight: '100vh', paddingBottom: '60px', transition: 'all 0.3s ease' };
    const headerSectionStyle = { backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e5e7eb', padding: '30px 5%', transition: 'all 0.3s ease' };
    const headerContentStyle = { maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' };
    const welcomeHeadingStyle = { fontSize: '2rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#f8fafc' : '#111827' };
    const addressSubstyle = { fontSize: '0.95rem', color: isDarkMode ? '#94a3b8' : '#6b7280', margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '5px' };
    const actionBtnStyle = { backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' };

    const mainContentStyle = { maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' };

    const twoColGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' };
    const backgroundWrapperStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px',
        borderRadius: '30px',
        marginBottom: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    };
    const cardStyle = { padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' };
    const cardTitleStyle = { fontSize: '1.2rem', fontWeight: '800', margin: 0 };

    const orderRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' };
    const viewAllLinkStyle = { fontSize: '0.9rem', color: '#10b981', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' };

    const offerCardStyle = { display: 'flex', gap: '20px', alignItems: 'center', padding: '15px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.05)', transition: 'all 0.3s' };
    const offerImageStyle = { width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' };
    const offerContentStyle = { flex: 1 };
    const offerTitleStyle = { margin: '0 0 5px 0', fontSize: '1rem', fontWeight: '700' };
    const offerSubStyle = { margin: '0 0 10px 0', fontSize: '0.85rem', lineHeight: '1.4' };
    const offerLinkStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#10b981', textDecoration: 'underline' };

    const tabContainerStyle = { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0' };
    const tabButtonStyle = { background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' };

    const collectionFilterContainerStyle = { marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '30px' };
    const categoryCardsRowStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' };
    const categoryCardItemStyle = { borderRadius: '16px', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' };

    const collectionToolbarStyle = { padding: '15px 30px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' };
    const collectionSearchWrapperStyle = { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' };
    const collectionSearchIconStyle = { position: 'absolute', left: '15px', color: '#94a3b8' };
    const collectionSearchInputStyle = { width: '100%', padding: '12px 15px 12px 45px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' };

    const collectionSortWrapperStyle = { display: 'flex', alignItems: 'center' };
    const sortDropdownContainerStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
    const collectionSortSelectStyle = { appearance: 'none', padding: '10px 40px 10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none', cursor: 'pointer', minWidth: '180px' };
    const collectionSortIconStyle = { position: 'absolute', right: '15px', color: '#94a3b8', pointerEvents: 'none' };

    const suggestionGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' };
    const productCardSmallStyle = { borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'relative' };
    const productImageWrapperSmall = { height: '200px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const productImageSmall = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
    const productInfoSmall = { padding: '20px' };
    const productNameSmall = { fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' };
    const productPriceSmall = { fontSize: '1.3rem', fontWeight: '800', color: '#10b981', marginBottom: '15px' };
    const productActionRow = { display: 'flex', gap: '10px' };
    const cartBtnSmall = { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: '700', cursor: 'pointer' };
    const buyBtnSmall = { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#fbbf24', color: '#000', fontWeight: '700', cursor: 'pointer' };

    return (
        <div style={dashboardWrapperStyle}>
            {/* Simple Dashboard Header */}
            <div style={headerSectionStyle}>
                <div style={headerContentStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <FaUserCircle size={50} color="#10b981" />
                        <div>
                            <h1 style={welcomeHeadingStyle}>Welcome back, {profile?.name || 'Customer'}</h1>
                            <p style={addressSubstyle}><FaMapMarkerAlt /> {profile?.address || 'India'}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            style={{ ...actionBtnStyle, background: isDarkMode ? '#1e293b' : '#fbbf24', color: isDarkMode ? '#fff' : '#000', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
                        >
                            {isDarkMode ? <FaSun /> : <FaMoon />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @media (max-width: 1100px) {
                        .suggestion-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                    @media (max-width: 768px) {
                        .suggestion-grid { grid-template-columns: 1fr !important; }
                        .two-col-grid { grid-template-columns: 1fr !important; }
                    }
                `}
            </style>

            <div style={mainContentStyle}>
                {/* Orders and Offers Section Side-by-Side with Sliding Background */}
                <div style={{
                    ...backgroundWrapperStyle,
                    position: 'relative',
                    overflow: 'hidden',
                    height: '500px', // Set a fixed height for consistency
                    marginBottom: '40px'
                }}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, width: '100%', height: '100%',
                                backgroundImage: `linear-gradient(rgba(${isDarkMode ? '0,0,0' : '255,255,255'}, ${isDarkMode ? 0.6 : 0.4}), rgba(${isDarkMode ? '0,0,0' : '255,255,255'}, ${isDarkMode ? 0.6 : 0.4})), url(${slides[currentSlide]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                zIndex: 0
                            }}
                        />
                    </AnimatePresence>

                    <div style={{ ...twoColGridStyle, alignItems: 'stretch', position: 'relative', zIndex: 1, height: '100%' }} className="two-col-grid">
                        {/* Recent Orders */}
                        <div style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ ...cardTitleStyle, color: isDarkMode ? '#fff' : '#111827' }}>Recent Orders</h3>
                                <Link to="/customer/orders" style={viewAllLinkStyle}>View all orders <FaBox size={10} /></Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                                {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                                    <div key={i} style={{ ...orderRowStyle, backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.7)', borderColor: isDarkMode ? '#475569' : '#f1f5f9' }} onClick={() => navigate(`/customer/tracking/${order.orderId}`)}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', color: '#10b981' }}>
                                                <FaBox size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
                                                    {order.displayItems}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: '#10b981', fontWeight: '800' }}>₹{order.totalDiscountedPrice}</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: isDarkMode ? '#94a3b8' : '#64748b' }}>{order.orderStatus}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '40px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <FaBox size={40} color="#e2e8f0" style={{ marginBottom: '10px' }} />
                                        <p style={{ color: '#94a3b8' }}>No recent orders found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Offers Section */}
                        <div style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
                            <h3 style={{ ...cardTitleStyle, color: isDarkMode ? '#fff' : '#111827' }}>Current Offers</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, justifyContent: 'center' }}>
                                {offers.map((offer, idx) => (
                                    <div key={idx} style={{ ...offerCardStyle, backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.7)', borderColor: isDarkMode ? '#475569' : '#f1f5f9' }}>
                                        <img src={offer.imageUrl} alt={offer.title} style={offerImageStyle} />
                                        <div style={offerContentStyle}>
                                            <h4 style={{ ...offerTitleStyle, color: isDarkMode ? '#4ade80' : '#065f46' }}>{offer.title}</h4>
                                            <p style={{ ...offerSubStyle, color: isDarkMode ? '#94a3b8' : '#047857' }}>{offer.subtitle}</p>
                                            <Link to="/products" style={offerLinkStyle}>Claim Now</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explore Our Collection (Suggestions) */}
                <div style={{ marginTop: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: isDarkMode ? '#f8fafc' : '#1e293b', marginBottom: '10px' }}>Explore Our Collection</h2>
                        <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Handpicked natural solutions for your wellness</p>
                    </div>

                    <div style={{ ...tabContainerStyle, borderBottomColor: isDarkMode ? '#334155' : '#e2e8f0' }}>
                        <button
                            style={{ ...tabButtonStyle, borderBottom: suggestionTab === 'products' ? '3px solid #10b981' : 'none', color: suggestionTab === 'products' ? '#10b981' : (isDarkMode ? '#94a3b8' : '#64748b') }}
                            onClick={() => setSuggestionTab('products')}
                        >
                            Products
                        </button>
                        <button
                            style={{ ...tabButtonStyle, borderBottom: suggestionTab === 'packages' ? '3px solid #10b981' : 'none', color: suggestionTab === 'packages' ? '#10b981' : (isDarkMode ? '#94a3b8' : '#64748b') }}
                            onClick={() => setSuggestionTab('packages')}
                        >
                            Packages
                        </button>
                    </div>

                    {/* Improved Collection Filtering UI (as per uploaded image) */}
                    <div style={collectionFilterContainerStyle}>
                        {/* Category Cards Row */}
                        <div style={categoryCardsRowStyle}>
                            {[
                                { name: 'Herbal Supplements', icon: <FaLeaf />, color: '#10b981' },
                                { name: 'Aromatherapy & Essential Oils', icon: <FaSpa />, color: '#6366f1' },
                                { name: 'Therapeutic Skincare', icon: <FaBurn />, color: '#f59e0b' }
                            ].map((cat, i) => (
                                <div
                                    key={i}
                                    style={{
                                        ...categoryCardItemStyle,
                                        border: selectedCategory === cat.name ? `2px solid ${cat.color}` : (isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'),
                                        backgroundColor: selectedCategory === cat.name ? `${cat.color}15` : (isDarkMode ? '#1e293b' : '#fff'),
                                        color: isDarkMode ? '#f8fafc' : '#1e293b'
                                    }}
                                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)}
                                >
                                    <div style={{ color: cat.color, fontSize: '1.5rem', marginBottom: '10px' }}>{cat.icon}</div>
                                    <span style={{ fontWeight: '700', fontSize: '1rem', textAlign: 'center' }}>{cat.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Search and Sort Toolbar */}
                        <div style={{ ...collectionToolbarStyle, backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#f1f5f9' }}>
                            <div style={collectionSearchWrapperStyle}>
                                <FaSearch style={collectionSearchIconStyle} />
                                <input
                                    type="text"
                                    placeholder="Search products by name or description..."
                                    style={{ ...collectionSearchInputStyle, backgroundColor: isDarkMode ? '#334155' : '#fff', color: isDarkMode ? '#fff' : '#1e293b', borderColor: isDarkMode ? '#475569' : '#e2e8f0', paddingRight: '120px' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        if (!searchQuery.trim()) {
                                            toast.info("Please enter a search term");
                                        }
                                    }}
                                    style={{
                                        position: 'absolute',
                                        right: '5px',
                                        padding: '8px 20px',
                                        backgroundColor: 'var(--primary-green)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Search
                                </button>
                            </div>

                            <div style={collectionSortWrapperStyle}>
                                <span style={{ color: isDarkMode ? '#f8fafc' : '#1e293b', fontWeight: '700', marginRight: '10px' }}>Filter & Sort:</span>
                                <div style={sortDropdownContainerStyle}>
                                    <select
                                        style={{ ...collectionSortSelectStyle, backgroundColor: isDarkMode ? '#334155' : '#fff', color: isDarkMode ? '#fff' : '#1e293b', borderColor: isDarkMode ? '#475569' : '#e2e8f0' }}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>Default Sort</option>
                                        <option value="low-high">Price: Low to High</option>
                                        <option value="high-low">Price: High to Low</option>
                                    </select>
                                    <FaChevronDown style={collectionSortIconStyle} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={suggestionGridStyle} className="suggestion-grid">
                        {(suggestionTab === 'products' ? products : packages)
                            .filter(item => {
                                const matchesSearch = (item.productName || item.packageName || item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
                                const matchesCategory = selectedCategory === 'All' || item.categoryName === selectedCategory;
                                return matchesSearch && matchesCategory;
                            })
                            .sort((a, b) => {
                                if (sortBy === 'low-high') return a.price - b.price;
                                if (sortBy === 'high-low') return b.price - a.price;
                                return 0;
                            })
                            .map((item, idx) => {
                                const isPackage = suggestionTab === 'packages';
                                const itemName = isPackage ? (item.name || item.packageName) : item.productName;
                                const itemImage = isPackage ? (item.imageURL || item.productImage || item.imageUrl || 'https://via.placeholder.com/200?text=Package') : (item.productImage1 || item.productImage || 'https://via.placeholder.com/200?text=Product');
                                const itemId = item.id;

                                return (
                                    <div key={idx} style={{ ...productCardSmallStyle, backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#f1f5f9' }} onClick={() => navigate(isPackage ? `/package/${itemName}` : `/product/${itemName}`)}>
                                        <div style={{ ...productImageWrapperSmall, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
                                            <img src={itemImage || 'https://via.placeholder.com/200?text=Ayurkisan'} alt={itemName} style={productImageSmall} />
                                        </div>
                                        <div style={productInfoSmall}>
                                            <h4 style={{ ...productNameSmall, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>{itemName}</h4>
                                            <div style={productPriceSmall}>₹{item.price || item.bundlePrice}</div>
                                            <div style={productActionRow}>
                                                <button
                                                    style={cartBtnSmall}
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            const userId = localStorage.getItem('userId');
                                                            const role = localStorage.getItem('role') || 'CUSTOMER';
                                                            if (!userId) {
                                                                toast.error("Please login to add to cart");
                                                                return;
                                                            }
                                                            await customerService.addToCart(userId, role, itemId, isPackage ? 'PACKAGE' : 'PRODUCT', 1);
                                                            toast.success("Added to cart!");
                                                            // Refresh cart count
                                                            const cartRes = await customerService.getCart(userId, role);
                                                            setCartCount(cartRes.data?.items?.length || 0);
                                                        } catch (err) {
                                                            toast.error("Failed to add to cart");
                                                        }
                                                    }}
                                                >
                                                    Add To Cart
                                                </button>
                                                <button
                                                    style={buyBtnSmall}
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            const userId = localStorage.getItem('userId');
                                                            const role = localStorage.getItem('role') || 'CUSTOMER';
                                                            if (!userId) {
                                                                toast.error("Please login to purchase");
                                                                return;
                                                            }
                                                            await customerService.addToCart(userId, role, itemId, isPackage ? 'PACKAGE' : 'PRODUCT', 1);
                                                            navigate('/checkout');
                                                        } catch (err) {
                                                            toast.error("Failed to process request");
                                                        }
                                                    }}
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, bg, link }) => (
    <Link to={link || "#"} style={{ textDecoration: 'none' }}>
        <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            border: '1px solid #f1f5f9',
            borderBottom: `3px solid ${color}`
        }}>
            <div style={{ padding: '15px', borderRadius: '15px', fontSize: '24px', color, backgroundColor: bg }}>{icon}</div>
            <div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>{title}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' }}>{value}</div>
            </div>
        </div>
    </Link>
);

export default CustomerDashboard;
