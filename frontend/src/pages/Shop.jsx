import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { isAuthenticated } from "../utils/auth";
import { toast } from 'react-toastify';
import { resolveProductImage } from '../utils/imageUtils';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default");

    // User Role context
    const userRole = localStorage.getItem('role') || 'CUSTOMER';

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:9090/products/all");
            // Add slight artificial delay to demonstrate skeleton if network is too fast
            setTimeout(async () => {
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:9090/categories/all");
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Filter and Sort Logic
    const filteredProducts = products.filter(p =>
        p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        // Category prioritization sorting
        const isACat = a.categoryId === sortBy || a.brand === sortBy; // Assuming sortBy could be ID or Name
        const isBCat = b.categoryId === sortBy || b.brand === sortBy;

        // Find category object if sortBy is a category name
        const selectedCategory = categories.find(c => c.categoryName === sortBy);
        const targetId = selectedCategory ? selectedCategory.id : sortBy;

        const matchesA = a.categoryId === targetId;
        const matchesB = b.categoryId === targetId;

        if (matchesA && !matchesB) return -1;
        if (!matchesA && matchesB) return 1;

        // Default or Price sorting if within same category status
        if (sortBy === "price_low_high") return a.finalPrice - b.finalPrice;
        if (sortBy === "price_high_low") return b.finalPrice - a.finalPrice;
        return 0; // default
    });

    const handleActionClick = (action) => {
        if (!isAuthenticated()) {
            toast.warn(`Please log in or sign up to ${action}.`);
            window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { modalType: 'signupSelect' } }));
            return;
        }
        // Proceed with corresponding action (e.g. Add to Cart logic)
    };

    // Array for exactly 8 skeletons to display 2 rows while loading
    const skeletons = Array(8).fill(0);

    return (
        <motion.div
            style={{ padding: "40px 2%", width: "100%", boxSizing: "border-box", margin: "0 auto" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
                <h1 style={{ color: "var(--primary-green)", fontSize: "2.8rem", fontWeight: "800", marginBottom: "15px" }}>
                    Explore Our <span style={{ color: "#EAB308" }}>Categories</span>
                </h1>
                <p style={{ color: "var(--text-light)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
                    Select a category to discover targeted herbal solutions and premium farm products.
                </p>
            </div>

            {/* Dynamic Categories Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '60px' }}>
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -10, scale: 1.05 }}
                        onClick={() => setSortBy(cat.categoryName)}
                        style={{
                            backgroundColor: sortBy === cat.categoryName ? 'var(--primary-green)' : '#fff',
                            color: sortBy === cat.categoryName ? '#fff' : 'var(--text-dark)',
                            padding: '25px 15px',
                            borderRadius: '16px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            border: '1px solid #f3f4f6',
                            transition: 'background-color 0.3s, color 0.3s'
                        }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏷️</div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{cat.categoryName}</h4>
                    </motion.div>
                ))}
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ flex: '1 1 300px' }}>
                    <input
                        type="text"
                        placeholder="Search products by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '12px 20px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-light)', fontWeight: '600' }}>Filter & Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', cursor: 'pointer', backgroundColor: '#fff', fontWeight: '500' }}
                    >
                        <option value="default">Default Sort</option>
                        <optgroup label="Prices">
                            <option value="price_low_high">Price: Low to High</option>
                            <option value="price_high_low">Price: High to Low</option>
                        </optgroup>
                        <optgroup label="Categories">
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.categoryName}>{cat.categoryName}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>
            </div>

            <div className="shop-grid">
                {loading ? (
                    skeletons.map((_, index) => (
                        <div key={index} className="skeleton-card" style={skeletonCardStyle}>
                            <div className="skeleton-image" style={skeletonImageStyle}></div>
                            <div className="skeleton-text" style={{ ...skeletonTextStyle, width: "80%" }}></div>
                            <div className="skeleton-text" style={{ ...skeletonTextStyle, width: "40%", height: "20px" }}></div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <div className="skeleton-button" style={skeletonButtonStyle}></div>
                                <div className="skeleton-button" style={skeletonButtonStyle}></div>
                            </div>
                        </div>
                    ))
                ) : (
                    sortedProducts.length > 0 ? sortedProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            style={productCardStyle}
                            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                        >
                            <div style={imageContainerStyle}>
                                <img
                                    src={resolveProductImage(product.productImage1, product.id)}
                                    alt={product.productName}
                                    style={imageStyle}
                                />
                            </div>

                            <div style={productInfoStyle}>
                                {/* Open in new window target="_blank" */}
                                <Link
                                    to={`/product/${product.id}`}
                                    style={productNameStyle}
                                >
                                    {product.productName}
                                </Link>

                                {userRole === 'RETAILER' ? (
                                    <div style={{ marginBottom: "15px" }}>
                                        <p style={{ ...priceStyle, margin: 0 }}>
                                            ₹{(product.finalPrice || product.price) * (product.piecesPerBox || 10)}
                                            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}> / Box</span>
                                        </p>
                                    </div>
                                ) : (
                                    <p style={priceStyle}>
                                        ₹{product.finalPrice}
                                    </p>
                                )}

                                <div style={buttonContainerStyle}>
                                    <motion.button
                                        style={addToCartBtnStyle}
                                        whileHover={{ backgroundColor: "var(--primary-light)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleActionClick("add items to your cart")}
                                    >
                                        Add To Cart
                                    </motion.button>

                                    <motion.button
                                        style={buyNowBtnStyle}
                                        whileHover={{ backgroundColor: "#eab308" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleActionClick("buy this product")}
                                    >
                                        Buy Now
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
                            <h3>No products found.</h3>
                        </div>
                    )
                )}
            </div>

            <style>{`
                /* Skeleton Animation */
                @keyframes shimmer {
                    0% { background-position: -468px 0; }
                    100% { background-position: 468px 0; }
                }
                .skeleton-image, .skeleton-text, .skeleton-button {
                    animation: shimmer 1.5s linear infinite;
                    background: #f6f7f8;
                    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
                    background-size: 800px 104px;
                }
                .shop-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px;
                }
                @media (max-width: 1200px) {
                    .shop-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 900px) {
                    .shop-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .shop-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </motion.div>
    );
};

// Styles

const productCardStyle = {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #f3f4f6"
};

const imageContainerStyle = {
    width: "100%",
    height: "220px",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderBottom: "1px solid #f3f4f6"
};

const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "20px"
};

const productInfoStyle = {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
};

const productNameStyle = {
    fontSize: "1.15rem",
    fontWeight: "600",
    color: "var(--text-dark)",
    textDecoration: "none",
    marginBottom: "8px",
    transition: "color 0.2s"
};

const priceStyle = {
    color: "var(--primary-green)",
    fontSize: "1.25rem",
    fontWeight: "bold",
    margin: "0 0 15px 0"
};

const buttonContainerStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "auto"
};

const addToCartBtnStyle = {
    flex: 1,
    background: "var(--primary-green)",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.95rem"
};

const buyNowBtnStyle = {
    flex: 1,
    background: "var(--secondary-bg)",
    color: "#000",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.95rem"
};

// Skeleton Styles

const skeletonCardStyle = {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    height: "380px"
};

const skeletonImageStyle = {
    height: "180px",
    width: "100%",
    borderRadius: "8px"
};

const skeletonTextStyle = {
    height: "14px",
    borderRadius: "4px"
};

const skeletonButtonStyle = {
    height: "40px",
    borderRadius: "8px",
    flex: 1
};

export default Shop;