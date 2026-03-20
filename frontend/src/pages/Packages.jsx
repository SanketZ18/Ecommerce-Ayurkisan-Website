import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaBolt, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { isAuthenticated, getUserRole } from "../utils/auth";
import { resolvePackageImage } from "../utils/imageUtils";
import customerService from "../utils/customerService";

const Packages = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch("http://localhost:9090/packages/all");
            setTimeout(async () => {
                const data = await response.json();
                setPackages(data);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    const handleActionClick = async (e, pkg, action) => {
        e.stopPropagation(); // Prevent navigation to details
        if (!isAuthenticated()) {
            toast.warn("Please log in or sign up to add packages to your cart.");
            window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { modalType: 'signupSelect' } }));
            return;
        }

        const userId = localStorage.getItem('userId');
        const role = getUserRole() || 'CUSTOMER';

        try {
            await customerService.addToCart(userId, role, pkg.id, 'PACKAGE', 1);
            if (action === 'BUY_NOW') {
                await customerService.placeOrder('COD');
                toast.success("Order Placed Successfully!");
                window.dispatchEvent(new Event('cartUpdated'));
                navigate(role === 'RETAILER' ? '/retailer/orders' : '/customer/orders');
            } else {
                toast.success(`${pkg.name} added to cart!`);
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (error) {
            console.error("Cart error:", error);
            if (action === 'BUY_NOW') {
                toast.error("Failed to place order.");
            } else {
                toast.error("Failed to add package to cart.");
            }
        }
    };

    const skeletons = Array(4).fill(0);

    return (
        <motion.div
            style={{ padding: "40px 2%", width: "100%", boxSizing: "border-box", margin: "0 auto", minHeight: "80vh" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ color: "var(--primary-green)", fontSize: "2.5rem", marginBottom: "10px" }}>
                    Curated Ayurvedic Packages
                </h1>
                <p style={{ color: "var(--text-light)", fontSize: "1.1rem" }}>
                    Special bundles formulated together for complete wellness.
                </p>
            </div>

            <div className="packages-grid">
                {loading ? (
                    skeletons.map((_, index) => (
                        <div key={index} style={skeletonCardStyle}>
                            <div className="skeleton-image" style={skeletonImageStyle}></div>
                            <div className="skeleton-text" style={{ ...skeletonTextStyle, width: "80%" }}></div>
                            <div className="skeleton-text" style={{ ...skeletonTextStyle, width: "40%", height: "20px" }}></div>
                            <div className="skeleton-button" style={skeletonButtonStyle}></div>
                        </div>
                    ))
                ) : (
                    packages.length > 0 ? packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            style={packageCardStyle}
                            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                            onClick={() => navigate(`/package/${pkg.id}`)}
                        >
                            <div style={packageImageWrapperStyle}>
                                <img 
                                    src={resolvePackageImage(pkg.imageURL)} 
                                    alt={pkg.name} 
                                    style={packageImageStyle} 
                                />
                                {pkg.totalPrice && pkg.packagePrice && pkg.totalPrice > pkg.packagePrice && (
                                    <div style={discountBadgeStyle}>
                                        Save {Math.round(((pkg.totalPrice - pkg.packagePrice) / pkg.totalPrice) * 100)}%
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <Link 
                                    to={`/package/${pkg.id}`} 
                                    style={packageNameLinkStyle}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {pkg.name || 'Ayurvedic Bundle'}
                                </Link>
                                
                                <p style={{ color: "var(--text-light)", marginBottom: "15px", fontSize: "0.9rem", lineHeight: "1.4" }}>
                                    A tailored selection of {pkg.items?.length || 0} premium items carefully paired for better results.
                                </p>

                                <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-green)' }}>
                                            ₹{pkg.packagePrice || 0}
                                        </span>
                                        {pkg.totalPrice > pkg.packagePrice && (
                                            <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9rem' }}>
                                                ₹{pkg.totalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>
                                        <FaInfoCircle size={10} /> 10% EXTRA DISCOUNT AT CHECKOUT
                                    </p>
                                </div>

                                <div style={actionButtonsContainerStyle}>
                                    <motion.button
                                        style={addToCartBtnStyle}
                                        whileHover={{ scale: 1.02, backgroundColor: "var(--primary-light)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => handleActionClick(e, pkg, 'ADD_TO_CART')}
                                    >
                                        <FaShoppingCart size={14} /> Add to Cart
                                    </motion.button>
                                    
                                    <motion.button
                                        style={buyNowBtnStyle}
                                        whileHover={{ scale: 1.02, backgroundColor: "#eab308" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => handleActionClick(e, pkg, 'BUY_NOW')}
                                    >
                                        <FaBolt size={14} /> Buy Now
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
                            <h3>No packages found at the moment. Please check back later.</h3>
                        </div>
                    )
                )}
            </div>

            <style>{`
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
                .packages-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px;
                }
                @media (max-width: 1200px) {
                    .packages-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 900px) {
                    .packages-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .packages-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </motion.div>
    );
};

// Styles
const packageCardStyle = {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #f3f4f6"
};

const packageImageWrapperStyle = {
    width: "100%",
    height: "200px",
    position: "relative",
    overflow: "hidden"
};

const packageImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease"
};

const discountBadgeStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "800",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)"
};

const packageNameLinkStyle = {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "var(--text-dark)",
    textDecoration: "none",
    marginBottom: "10px",
    display: "block",
    transition: "color 0.2s"
};

const actionButtonsContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto'
};

const addToCartBtnStyle = {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "var(--primary-green)",
    color: "white",
    borderRadius: "8px",
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
};

const buyNowBtnStyle = {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "var(--secondary-bg)",
    color: "#000",
    borderRadius: "8px",
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
};

const skeletonCardStyle = {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    height: "300px"
};

const skeletonImageStyle = { height: "100px", width: "100%", borderRadius: "8px" };
const skeletonTextStyle = { height: "14px", borderRadius: "4px" };
const skeletonButtonStyle = { height: "45px", borderRadius: "8px", marginTop: "auto" };

export default Packages;
