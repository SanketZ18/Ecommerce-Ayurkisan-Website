import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaShoppingCart, FaHeart, FaSortAmountDown, FaThLarge, FaList, FaStar } from 'react-icons/fa';
import customerService from '../utils/customerService';
import { toast } from 'react-toastify';
import { useLocation, Link } from 'react-router-dom';

const AllProducts = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    // Filters State
    const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortBy, setSortBy] = useState('popular');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                customerService.getAllProducts(),
                customerService.getAllCategories()
            ]);

            const prodData = Array.isArray(prodRes.data) ? prodRes.data : [];
            setProducts(prodData);
            setCategories(Array.isArray(catRes.data) ? catRes.data : []);

            // Set max price based on data
            const max = Math.max(...prodData.map(p => p.price || 0), 5000);
            setPriceRange([0, max]);

        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...products];

        // Search Filter
        if (searchQuery) {
            result = result.filter(p =>
                p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category?.categoryName === selectedCategory);
        }

        // Price Filter
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sorting
        if (sortBy === 'low-high') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'high-low') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'newest') result.sort((a, b) => b.id - a.id);

        setFilteredProducts(result);
    };

    const handleAddToCart = (product) => {
        // Implementation for cart
        toast.success(`Added ${product.productName} to cart!`);
    };

    const handleAddToWishlist = (product) => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (!wishlist.find(item => item.id === product.id)) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            toast.success("Added to wishlist!");
        } else {
            toast.info("Already in wishlist");
        }
    };

    if (loading) return <div style={loaderStyle}>Culling nature's best for you...</div>;

    return (
        <div style={pageContainerStyle}>
            {/* Header / Breadcrumbs */}
            <div style={pageHeaderStyle}>
                <div style={headerContentStyle}>
                    <h1 style={titleStyle}>Our Collection</h1>
                    <p style={subtitleStyle}>Discover the purest Ayurvedic and organic products</p>
                </div>
            </div>

            <div style={mainLayoutStyle}>
                {/* Sidebar Filters */}
                <aside style={sidebarStyle}>
                    <div style={filterSectionStyle}>
                        <h3 style={filterTitleStyle}><FaFilter size={14} /> Filters</h3>

                        {/* Search in Sidebar */}
                        <div style={sidebarSearchStyle}>
                            <FaSearch style={searchIconStyle} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={sidebarSearchInputStyle}
                            />
                        </div>
                    </div>

                    <div style={filterSectionStyle}>
                        <h4 style={subFilterTitleStyle}>Categories</h4>
                        <div style={categoryListStyle}>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                style={{ ...categoryBtnStyle, fontWeight: selectedCategory === 'All' ? 'bold' : 'normal', color: selectedCategory === 'All' ? '#10b981' : '#64748b' }}
                            >
                                All Products
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.categoryName)}
                                    style={{ ...categoryBtnStyle, fontWeight: selectedCategory === cat.categoryName ? 'bold' : 'normal', color: selectedCategory === cat.categoryName ? '#10b981' : '#64748b' }}
                                >
                                    {cat.categoryName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={filterSectionStyle}>
                        <h4 style={subFilterTitleStyle}>Price Range</h4>
                        <input
                            type="range"
                            min="0"
                            max={Math.max(...products.map(p => p.price || 0), 5000)}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            style={rangeInputStyle}
                        />
                        <div style={priceLabelRowStyle}>
                            <span>₹0</span>
                            <span style={maxPriceBadgeStyle}>Up to ₹{priceRange[1]}</span>
                        </div>
                    </div>

                    <div style={promoCardStyle}>
                        <h4>Loyalty Discount</h4>
                        <p>Get 10% OFF on all orders as a registered member!</p>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main style={contentAreaStyle}>
                    {/* Toolbar */}
                    <div style={toolbarStyle}>
                        <div style={resultsCountStyle}>
                            Showing <strong>{filteredProducts.length}</strong> products
                        </div>
                        <div style={toolbarActionsStyle}>
                            <div style={sortWrapperStyle}>
                                <FaSortAmountDown size={14} color="#64748b" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={selectStyle}
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="low-high">Price: Low to High</option>
                                    <option value="high-low">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>
                            </div>
                            <div style={viewToggleStyle}>
                                <button onClick={() => setViewMode('grid')} style={{ ...toggleBtnStyle, color: viewMode === 'grid' ? '#10b981' : '#cbd5e1' }}><FaThLarge /></button>
                                <button onClick={() => setViewMode('list')} style={{ ...toggleBtnStyle, color: viewMode === 'list' ? '#10b981' : '#cbd5e1' }}><FaList /></button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <AnimatePresence>
                        <motion.div
                            layout
                            style={viewMode === 'grid' ? gridLayoutStyle : listLayoutStyle}
                        >
                            {filteredProducts.map(product => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={product.id}
                                    whileHover={{ y: -8 }}
                                    style={viewMode === 'grid' ? productCardStyle : productListCardStyle}
                                >
                                    <div style={imageWrapperStyle}>
                                        <img
                                            src={product.productImage1 || 'https://via.placeholder.com/250?text=Ayurkisan'}
                                            alt={product.productName}
                                            style={productImageStyle}
                                        />
                                        <div style={actionOverlayStyle}>
                                            <button onClick={() => handleAddToWishlist(product)} style={iconBtnStyle}><FaHeart /></button>
                                            <button onClick={() => handleAddToCart(product)} style={iconBtnStyle}><FaShoppingCart /></button>
                                        </div>
                                    </div>
                                    <div style={productInfoStyle}>
                                        <span style={categoryBadgeStyle}>{product.category?.categoryName || 'General'}</span>
                                        <Link to={`/product/${encodeURIComponent(product.productName)}`} style={{ textDecoration: 'none' }}>
                                            <h3 style={productNameStyle}>{product.productName}</h3>
                                        </Link>
                                        <div style={ratingRowStyle}>
                                            {[1, 2, 3, 4, 5].map(s => <FaStar key={s} size={12} color="#fbbf24" />)}
                                            <span style={ratingTextStyle}>4.9 (120 reviews)</span>
                                        </div>
                                        <div style={priceRowStyle}>
                                            <span style={priceStyle}>₹{product.price}</span>
                                            {product.price > 1000 && <span style={tagStyle}>Free Shipping</span>}
                                        </div>
                                        {viewMode === 'list' && <p style={descStyle}>{product.description?.substring(0, 150)}...</p>}
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            style={mainActionBtnStyle}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredProducts.length === 0 && (
                        <div style={noResultsStyle}>
                            <FaSearch size={48} color="#e2e8f0" />
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                            <button onClick={fetchInitialData} style={resetBtnStyle}>Reset All Filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// --- Styles ---
const pageContainerStyle = { backgroundColor: '#fdfdfd', minHeight: '100vh', fontFamily: "'Inter', sans-serif" };
const pageHeaderStyle = { padding: '60px 0', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', textAlign: 'center', marginBottom: '40px' };
const headerContentStyle = { maxWidth: '800px', margin: '0 auto', padding: '0 20px' };
const titleStyle = { fontSize: '3rem', fontWeight: '800', marginBottom: '10px' };
const subtitleStyle = { fontSize: '1.2rem', opacity: 0.9 };

const mainLayoutStyle = { maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', padding: '0 20px 60px' };

const sidebarStyle = { position: 'sticky', top: '100px', height: 'fit-content' };
const filterSectionStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #f1f5f9' };
const filterTitleStyle = { fontSize: '1.1rem', color: '#1e293b', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' };
const subFilterTitleStyle = { fontSize: '0.9rem', color: '#475569', margin: '20px 0 12px 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' };

const sidebarSearchStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const searchIconStyle = { position: 'absolute', left: '12px', color: '#94a3b8' };
const sidebarSearchInputStyle = { width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' };

const categoryListStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const categoryBtnStyle = { background: 'none', border: 'none', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s', '&:hover': { backgroundColor: '#f8fafc' } };

const rangeInputStyle = { width: '100%', accentColor: '#10b981', cursor: 'pointer' };
const priceLabelRowStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.85rem', color: '#64748b' };
const maxPriceBadgeStyle = { color: '#10b981', fontWeight: '700' };

const promoCardStyle = { background: 'linear-gradient(45deg, #1e293b, #334155)', color: '#fff', padding: '20px', borderRadius: '16px', position: 'relative', overflow: 'hidden' };

const contentAreaStyle = { minHeight: '500px' };
const toolbarStyle = { backgroundColor: '#fff', padding: '16px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' };
const resultsCountStyle = { fontSize: '0.95rem', color: '#64748b' };
const toolbarActionsStyle = { display: 'flex', alignItems: 'center', gap: '20px' };
const sortWrapperStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#475569', outline: 'none' };
const viewToggleStyle = { display: 'flex', gap: '5px', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '8px' };
const toggleBtnStyle = { background: 'none', border: 'none', padding: '6px', cursor: 'pointer', fontSize: '1rem' };

const gridLayoutStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' };
const listLayoutStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };

const productCardStyle = { backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9', transition: 'all 0.3s' };
const productListCardStyle = { backgroundColor: '#fff', borderRadius: '20px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' };

const imageWrapperStyle = { position: 'relative', width: '100%', height: '280px', backgroundColor: '#f8fafc', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const productImageStyle = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
const actionOverlayStyle = { position: 'absolute', bottom: '15px', right: '15px', display: 'flex', flexDirection: 'column', gap: '10px', opacity: 1 };
const iconBtnStyle = { width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'all 0.2s', '&:hover': { color: '#10b981' } };

const productInfoStyle = { padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 };
const categoryBadgeStyle = { display: 'inline-block', padding: '4px 10px', backgroundColor: '#ecfdf5', color: '#047857', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', width: 'fit-content', marginBottom: '12px' };
const productNameStyle = { fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px', height: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const ratingRowStyle = { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' };
const ratingTextStyle = { fontSize: '0.8rem', color: '#94a3b8' };
const priceRowStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' };
const priceStyle = { fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' };
const tagStyle = { fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px' };
const descStyle = { fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' };
const mainActionBtnStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' };

const noResultsStyle = { textAlign: 'center', padding: '80px 20px', color: '#64748b' };
const resetBtnStyle = { marginTop: '20px', padding: '10px 24px', borderRadius: '50px', border: '2px solid #10b981', color: '#10b981', background: 'none', fontWeight: 'bold', cursor: 'pointer' };
const loaderStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', fontSize: '1.2rem', color: '#10b981', fontWeight: 'bold' };

export default AllProducts;
