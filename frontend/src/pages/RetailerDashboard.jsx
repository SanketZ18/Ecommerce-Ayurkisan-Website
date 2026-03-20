import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaHeart, FaTruck, FaUndo, FaUserCircle, FaMapMarkerAlt, FaShoppingCart, FaSearch, FaChevronDown, FaLeaf, FaBurn, FaSpa, FaMoon, FaSun, FaArrowRight, FaWarehouse } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import i111 from '../assets/images/111.jpg';
import i112 from '../assets/images/112.jpg';
import i113 from '../assets/images/113.jpg';
import i114 from '../assets/images/114.jpg';
import i115 from '../assets/images/115.jpg';
import axios from 'axios';
import customerService from '../utils/customerService';
import retailerService from '../utils/retailerService';
import { getDecodedToken, clearAuthData } from '../utils/auth';
import { toast } from 'react-toastify';
import { resolveProductImage, resolvePackageImage } from '../utils/imageUtils';

const RetailerDashboard = () => {
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
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Default Sort');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categoriesList, setCategoriesList] = useState([]);
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

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            if (userId) {
                const [profileRes, ordersRes, offersRes, productsRes, packagesRes, cartRes, categoriesRes] = await Promise.all([
                    retailerService.getProfile(userId),
                    retailerService.getOrderHistory(userId),
                    axios.get('http://localhost:9090/api/homepage/sections').catch(() => ({ data: [] })),
                    customerService.getAllProducts().catch(() => ({ data: [] })),
                    customerService.getAllPackages().catch(() => ({ data: [] })),
                    customerService.getCart(userId, role).catch(() => ({ data: { items: [] } })),
                    customerService.getAllCategories().catch(() => ({ data: [] }))
                ]);

                setProfile(profileRes.data);
                setCartCount(cartRes.data?.items?.length || 0);
                setCategoriesList(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
                setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
                setPackages(Array.isArray(packagesRes.data) ? packagesRes.data : []);

                const orderData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
                const top5Orders = orderData.slice(0, 5);
                const trackingPromises = top5Orders.map(order => 
                    retailerService.trackShipment(order.id).catch(() => null)
                );
                const trackingResults = await Promise.all(trackingPromises);

                setRecentOrders(top5Orders.map((order, index) => ({
                    ...order,
                    orderId: order.id,
                    orderDate: order.createdAt,
                    displayItems: order.items?.map(item => item.productName).join(', ') || 'Unnamed Items',
                    trackingStatus: trackingResults[index]?.data?.status || order.orderStatus
                })));

                const fetchedOffers = Array.isArray(offersRes.data) ? offersRes.data.filter(s => s.type === 'special_offers') : [];
                setOffers(fetchedOffers.length > 0 ? fetchedOffers : [{
                    id: 'default_off',
                    title: 'Wholesale Savings Available! 🌿',
                    subtitle: 'Exclusive 30% discount for our retail partners on bulk boxes.',
                    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop',
                    ctaText: 'Explore Catalog',
                    ctaLink: '/shop'
                }]);

                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                setWishlistItems(wishlist);
                setWishlistCount(wishlist.length);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
            // If user is not found (deleted) or unauthorized, logout
            if (error.response && (error.response.status === 401 || 
                (error.response.data && error.response.data.message && error.response.data.message.includes("not found")))) {
                clearAuthData();
                window.location.href = '/';
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

    useEffect(() => {
        const handleCartUpdated = () => {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            if (userId) {
                customerService.getCart(userId, role)
                    .then(res => setCartCount(res.data?.items?.length || 0))
                    .catch(() => setCartCount(0));
            }
        };
        window.addEventListener('cartUpdated', handleCartUpdated);
        return () => window.removeEventListener('cartUpdated', handleCartUpdated);
    }, []);

    const handleWishlistToggle = useCallback((item, isPackage, itemName, itemImage, itemId, retailerPrice) => {
        const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const exists = currentWishlist.find(wi => wi.id === itemId);
        let newWishlist;
        if (exists) {
            newWishlist = currentWishlist.filter(wi => wi.id !== itemId);
            toast.info("Removed from wishlist");
        } else {
            newWishlist = [...currentWishlist, {
                id: itemId,
                name: itemName,
                image: isPackage ? resolvePackageImage(itemImage) : resolveProductImage(itemImage, itemId),
                price: retailerPrice,
                type: isPackage ? 'PACKAGE' : 'PRODUCT'
            }];
            toast.success("Added to wishlist");
        }
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        setWishlistItems(newWishlist);
        setWishlistCount(newWishlist.length);
        window.dispatchEvent(new Event('wishlistUpdated'));
    }, []);

    const handleAddToCart = useCallback(async (itemId, isPackage) => {
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            if (!userId) { toast.error("Please login to add to cart"); return; }
            await customerService.addToCart(userId, role, itemId, isPackage ? 'PACKAGE' : 'PRODUCT', 1);
            toast.success("Added to Cart!");
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            toast.error("Failed to add to cart");
        }
    }, []);

    const handleBuyNow = useCallback(async (itemId, isPackage) => {
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');
            if (!userId) { toast.error("Please login to buy now"); return; }
            await customerService.addToCart(userId, role, itemId, isPackage ? 'PACKAGE' : 'PRODUCT', 1);
            window.dispatchEvent(new Event('cartUpdated'));
            setTimeout(() => navigate('/checkout'), 300);
        } catch (err) {
            toast.error("Failed to process order");
        }
    }, [navigate]);

    const filteredItems = useMemo(() => {
        const source = suggestionTab === 'products' ? products : packages;
        return source
            .filter(item => {
                const itemName = (item.productName || item.packageName || item.name || '').toLowerCase();
                const matchesSearch = itemName.includes(searchQuery.toLowerCase());
                if (selectedCategory === 'All') return matchesSearch;
                if (suggestionTab === 'products') {
                    const catObj = categoriesList.find(c => c.categoryName === selectedCategory);
                    return matchesSearch && item.categoryId === catObj?.id;
                }
                return matchesSearch;
            })
            .sort((a, b) => {
                const pA = suggestionTab === 'products' ? (a.finalPrice || a.price) : a.packagePrice;
                const pB = suggestionTab === 'products' ? (b.finalPrice || b.price) : b.packagePrice;
                if (sortBy === 'low-high') return pA - pB;
                if (sortBy === 'high-low') return pB - pA;
                return 0;
            });
    }, [suggestionTab, products, packages, searchQuery, selectedCategory, categoriesList, sortBy]);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Loading wholesale catalog...</div>;
    }

    return (
        <div style={{ ...styles.dashboardWrapperStyle, backgroundColor: isDarkMode ? '#0f172a' : '#f3f4f6' }}>
            {/* Simple Dashboard Header */}
            <div style={{ ...styles.headerSectionStyle, backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderBottomColor: isDarkMode ? '#334155' : '#e5e7eb' }}>
                <div style={styles.headerContentStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <FaUserCircle size={50} color="#10b981" />
                        <div>
                            <h1 style={{ ...styles.welcomeHeadingStyle, color: isDarkMode ? '#f8fafc' : '#111827' }}>Retailer: {profile?.retailerName || 'Partner'}</h1>
                            <p style={{ ...styles.addressSubstyle, color: isDarkMode ? '#94a3b8' : '#6b7280' }}>
                                <FaWarehouse style={{ color: '#38bdf8' }} /> {profile?.firmName || 'Wholesale Business Account'}
                                {profile?.registrationId && <span style={{ marginLeft: '10px', opacity: 0.7 }}>• ID: {profile.registrationId}</span>}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            style={{ ...styles.actionBtnStyle, background: isDarkMode ? '#1e293b' : '#fbbf24', color: isDarkMode ? '#fff' : '#000', border: isDarkMode ? '1px solid #334155' : 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
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
                        .two-col-grid { grid-template-columns: 1fr !important; }
                    }
                `}
            </style>

            <div style={styles.mainContentStyle}>
                <div style={{ ...styles.backgroundWrapperStyle, position: 'relative', overflow: 'hidden', height: '500px', marginBottom: '40px' }}>
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

                    <div style={{ ...styles.twoColGridStyle, alignItems: 'stretch', position: 'relative', zIndex: 1, height: '100%' }} className="two-col-grid">
                        <div style={{ ...styles.cardStyle, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ ...styles.cardTitleStyle, color: isDarkMode ? '#fff' : '#111827' }}>Bulk Consignments</h3>
                                <Link to="/retailer/orders" style={styles.viewAllLinkStyle}>Wholesale History <FaBox size={10} /></Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                                {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                                    <div key={i} style={{ ...styles.orderRowStyle, backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.7)' : 'rgba(255, 255, 255, 0.7)', borderColor: isDarkMode ? '#475569' : '#f1f5f9' }} onClick={() => navigate(`/retailer/tracking/${order.orderId}`)}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', color: '#10b981' }}>
                                                <FaBox size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>{order.displayItems}</div>
                                                <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>{new Date(order.orderDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: '#10b981', fontWeight: '800' }}>₹{order.totalDiscountedPrice}</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: isDarkMode ? '#94a3b8' : '#64748b' }}>{order.trackingStatus || order.orderStatus}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '40px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <FaBox size={40} color="#e2e8f0" style={{ marginBottom: '10px' }} />
                                        <p style={{ color: '#94a3b8' }}>No bulk history found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ ...styles.cardStyle, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ ...styles.cardTitleStyle, color: isDarkMode ? '#fff' : '#111827' }}>Wholesale Perks</h3>
                                <div style={{ fontSize: '1.5rem' }}>🎁</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
                                {offers.map((offer, idx) => (
                                    <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + idx * 0.1 }} style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '350px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                                        <img src={offer.imageUrl} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '24px', color: '#fff' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#fbbf24' }}>{offer.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>{offer.subtitle}</p>
                                            <button onClick={() => document.getElementById('wholesale-catalog')?.scrollIntoView({ behavior: 'smooth' })} style={{ ...styles.actionBtnStyle, marginTop: '10px', border: 'none', cursor: 'pointer' }}>{offer.ctaText || 'Shop Wholesale'} <FaArrowRight /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="wholesale-catalog" style={{ marginTop: '40px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: isDarkMode ? '#f8fafc' : '#1e293b', marginBottom: '10px' }}>Retailer Wholesale Catalog</h2>
                        <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '1.1rem' }}>Bulk Supply - 30% Fixed Discount on Box Orders</p>
                    </div>

                    <div style={{ ...styles.tabContainerStyle, borderBottomColor: isDarkMode ? '#334155' : '#e2e8f0' }}>
                        <button style={{ ...styles.tabButtonStyle, borderBottom: suggestionTab === 'products' ? '3px solid #10b981' : 'none', color: suggestionTab === 'products' ? '#10b981' : (isDarkMode ? '#94a3b8' : '#64748b') }} onClick={() => setSuggestionTab('products')}>Products (Bulk)</button>
                        <button style={{ ...styles.tabButtonStyle, borderBottom: suggestionTab === 'packages' ? '3px solid #10b981' : 'none', color: suggestionTab === 'packages' ? '#10b981' : (isDarkMode ? '#94a3b8' : '#64748b') }} onClick={() => setSuggestionTab('packages')}>Packages (Bulk)</button>
                    </div>

                    <div style={styles.collectionFilterContainerStyle}>
                        <div style={styles.categoryCardsRowStyle}>
                            <div style={{ ...styles.categoryCardItemStyle, border: selectedCategory === 'All' ? `2px solid #10b981` : (isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'), backgroundColor: selectedCategory === 'All' ? `#10b98115` : (isDarkMode ? '#1e293b' : '#fff'), color: isDarkMode ? '#f8fafc' : '#1e293b' }} onClick={() => setSelectedCategory('All')}>
                                <div style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '10px' }}><FaBox /></div>
                                <span style={{ fontWeight: '700' }}>All Categories</span>
                            </div>
                            {categoriesList.map((cat, i) => (
                                <div key={i} style={{ ...styles.categoryCardItemStyle, border: selectedCategory === cat.categoryName ? `2px solid #10b981` : (isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'), backgroundColor: selectedCategory === cat.categoryName ? `#10b98115` : (isDarkMode ? '#1e293b' : '#fff'), color: isDarkMode ? '#f8fafc' : '#1e293b' }} onClick={() => setSelectedCategory(selectedCategory === cat.categoryName ? 'All' : cat.categoryName)}>
                                    <div style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '10px' }}><FaLeaf /></div>
                                    <span style={{ fontWeight: '700' }}>{cat.categoryName}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ ...styles.collectionToolbarStyle, backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#f1f5f9' }}>
                            <div style={styles.collectionSearchWrapperStyle}>
                                <FaSearch style={styles.collectionSearchIconStyle} />
                                <input type="text" placeholder="Search wholesale products..." style={{ ...styles.collectionSearchInputStyle, backgroundColor: isDarkMode ? '#334155' : '#fff', color: isDarkMode ? '#fff' : '#1e293b', borderColor: isDarkMode ? '#475569' : '#e2e8f0' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <div style={styles.collectionSortWrapperStyle}>
                                <span style={{ color: isDarkMode ? '#f8fafc' : '#1e293b', fontWeight: '700', marginRight: '10px' }}>Sort:</span>
                                <div style={styles.sortDropdownContainerStyle}>
                                    <select style={{ ...styles.collectionSortSelectStyle, backgroundColor: isDarkMode ? '#334155' : '#fff', color: isDarkMode ? '#fff' : '#1e293b', borderColor: isDarkMode ? '#475569' : '#e2e8f0' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option>Default Sort</option>
                                        <option value="low-high">Price: Low to High</option>
                                        <option value="high-low">Price: High to Low</option>
                                    </select>
                                    <FaChevronDown style={styles.collectionSortIconStyle} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.suggestionGridStyle} className="suggestion-grid">
                        {filteredItems.map((item, idx) => (
                            <WholesaleCard
                                key={item.id}
                                item={item}
                                isPackage={suggestionTab === 'packages'}
                                isDarkMode={isDarkMode}
                                wishlistItems={wishlistItems}
                                onWishlistToggle={handleWishlistToggle}
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetailerDashboard;

// --- Sub-components (Memoized for performance) ---
const WholesaleCard = memo(({ item, isPackage, isDarkMode, wishlistItems, onWishlistToggle, onAddToCart, onBuyNow, navigate }) => {
    const itemName = isPackage ? (item.name || item.packageName) : item.productName;
    const itemImage = isPackage ? item.imageURL : item.productImage1;
    const itemId = item.id;
    
    const singlePrice = isPackage ? item.packagePrice : (item.finalPrice || item.price);
    const pieces = isPackage ? 10 : (item.piecesPerBox || 10);
    const boxPrice = singlePrice * pieces;
    const retailerPrice = boxPrice * 0.7;
    const isInWishlist = wishlistItems.some(wi => wi.id === itemId);

    return (
        <div style={{ ...styles.productCardSmallStyle, backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#f1f5f9' }} onClick={() => navigate(isPackage ? `/package/${itemId}` : `/product/${itemId}`)}>
            <div style={{ ...styles.productImageWrapperSmall, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
                <div style={styles.discountBadge}>30% OFF</div>
                <button
                    style={{
                        ...styles.wishlistBtn,
                        backgroundColor: isInWishlist ? '#fee2e2' : 'rgba(255,255,255,0.8)',
                        color: isInWishlist ? '#ef4444' : '#94a3b8'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onWishlistToggle(item, isPackage, itemName, itemImage, itemId, retailerPrice);
                    }}
                >
                    <FaHeart color={isInWishlist ? '#ef4444' : '#94a3b8'} />
                </button>
                <img 
                    src={isPackage ? resolvePackageImage(itemImage) : resolveProductImage(itemImage, itemId)} 
                    alt={itemName} 
                    style={styles.productImageSmall} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200?text=Wait...'}
                />
            </div>
            <div style={styles.productInfoSmall}>
                <h4 style={{ ...styles.productNameSmall, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>{itemName}</h4>
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '2px' }}>Wholesale Box ({pieces} units)</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <div style={styles.productPriceValueStyle}>₹{retailerPrice.toLocaleString()}</div>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{boxPrice.toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '800', borderTop: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', paddingTop: '8px' }}>
                    Unit Price: ₹{singlePrice} | SAVE: ₹{(boxPrice * 0.3).toLocaleString()}
                </div>
                <div style={styles.productActionRow}>
                    <button
                        style={styles.cartBtnSmall}
                        onClick={(e) => { e.stopPropagation(); onAddToCart(itemId, isPackage); }}
                    >
                        Add to Cart
                    </button>
                    <button
                        style={{ ...styles.buyBtnSmall, whiteSpace: 'nowrap' }}
                        onClick={(e) => { e.stopPropagation(); onBuyNow(itemId, isPackage); }}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
});

// --- Static Styles ---
const styles = {
    dashboardWrapperStyle: { minHeight: '100vh', paddingBottom: '60px', transition: 'all 0.3s ease' },
    headerSectionStyle: { borderBottom: '1px solid #e5e7eb', padding: '30px 5%', transition: 'all 0.3s ease' },
    headerContentStyle: { maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' },
    welcomeHeadingStyle: { fontSize: '2rem', fontWeight: '800', margin: 0 },
    addressSubstyle: { fontSize: '0.95rem', margin: '5px 0 0 0', display: 'flex', alignItems: 'center', gap: '5px' },
    actionBtnStyle: { backgroundColor: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' },
    mainContentStyle: { maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' },
    twoColGridStyle: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' },
    backgroundWrapperStyle: { backgroundSize: 'cover', backgroundPosition: 'center', padding: '40px', borderRadius: '30px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    cardStyle: { padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
    cardTitleStyle: { fontSize: '1.2rem', fontWeight: '800', margin: 0 },
    orderRowStyle: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' },
    viewAllLinkStyle: { fontSize: '0.9rem', color: '#10b981', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' },
    tabContainerStyle: { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0' },
    tabButtonStyle: { background: 'none', border: 'none', padding: '10px 20px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
    collectionFilterContainerStyle: { marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '30px' },
    categoryCardsRowStyle: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
    categoryCardItemStyle: { borderRadius: '16px', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    collectionToolbarStyle: { padding: '15px 30px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
    collectionSearchWrapperStyle: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
    collectionSearchIconStyle: { position: 'absolute', left: '15px', color: '#94a3b8' },
    collectionSearchInputStyle: { width: '100%', padding: '12px 15px 12px 45px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' },
    collectionSortWrapperStyle: { display: 'flex', alignItems: 'center' },
    sortDropdownContainerStyle: { position: 'relative', display: 'flex', alignItems: 'center' },
    collectionSortSelectStyle: { appearance: 'none', padding: '10px 40px 10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', outline: 'none', cursor: 'pointer', minWidth: '180px' },
    collectionSortIconStyle: { position: 'absolute', right: '15px', color: '#94a3b8', pointerEvents: 'none' },
    suggestionGridStyle: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' },
    productCardSmallStyle: { borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'relative' },
    productImageWrapperSmall: { height: '200px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    productImageSmall: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    productInfoSmall: { padding: '20px' },
    productNameSmall: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productPriceValueStyle: { fontSize: '1.3rem', fontWeight: '800', color: '#10b981' },
    productActionRow: { display: 'flex', gap: '10px', marginTop: '15px' },
    cartBtnSmall: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: '700', cursor: 'pointer' },
    buyBtnSmall: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#fbbf24', color: '#000', fontWeight: '700', cursor: 'pointer' },
    discountBadge: { position: 'absolute', top: '15px', left: '15px', backgroundColor: '#ea580c', color: '#fff', padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', zIndex: 1 },
    wishlistBtn: { position: 'absolute', top: '15px', right: '15px', border: 'none', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
};
