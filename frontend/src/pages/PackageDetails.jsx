import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaBolt, FaArrowLeft, FaBox, FaLeaf, FaInfoCircle, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { resolveProductImage, resolvePackageImage } from '../utils/imageUtils';
import customerService from "../utils/customerService";

const PackageDetails = () => {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [products, setProducts] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const nextImage = () => {
        // Packages currently only have one image, but we add navigation for consistency
        setActiveImageIndex(0);
    };

    const prevImage = () => {
        setActiveImageIndex(0);
    };

    const userRole = localStorage.getItem('role') || 'CUSTOMER';

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPackageData();
    }, [packageId]);

    const fetchPackageData = async () => {
        setLoading(true);
        try {
            // Fetch package by ID
            const response = await axios.get(`http://localhost:9090/packages/view/id/${packageId}`);
            const packageData = response.data;
            setPkg(packageData);

            // Fetch feedbacks
            const feedbackRes = await axios.get(`http://localhost:9090/feedbacks/product/${packageId}`).catch(() => ({ data: [] }));
            setFeedbacks(feedbackRes.data);

            // Fetch details for each product in the package
            if (packageData.items && packageData.items.length > 0) {
                const productPromises = packageData.items.map(item => 
                    axios.get(`http://localhost:9090/products/id/${item.productId}`).catch(err => {
                        console.error(`Failed to fetch product ${item.productId}`, err);
                        return { data: { id: item.productId, productName: "Unknown Product", productImage1: "https://via.placeholder.com/100" } };
                    })
                );
                const productResults = await Promise.all(productPromises);
                setProducts(productResults.map((res, index) => ({
                    ...res.data,
                    quantity: packageData.items[index].quantity
                })));
            }
        } catch (error) {
            console.error("Error fetching package details:", error);
            toast.error("Failed to load package details");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role') || 'CUSTOMER';
        if (!userId) {
            toast.warning("Please login to add to cart");
            window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { modalType: 'signupSelect' } }));
            return;
        }
        try {
            await customerService.addToCart(userId, role, pkg.id, 'PACKAGE', 1);
            toast.success(`${pkg.name} added to cart!`);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error(error);
            toast.error("Failed to add to cart");
        }
    };

    const handleBuyNow = async () => {
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role') || 'CUSTOMER';
        if (!userId) {
            toast.warning("Please login to place an order");
            window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { modalType: 'signupSelect' } }));
            return;
        }
        
        try {
            await customerService.addToCart(userId, role, pkg.id, 'PACKAGE', 1);
            await customerService.placeOrder('COD');
            toast.success("Order Placed Successfully!");
            window.dispatchEvent(new Event('cartUpdated'));
            navigate(role === 'RETAILER' ? '/retailer/orders' : '/customer/orders');
        } catch (error) {
            console.error(error);
            toast.error("Failed to place order.");
        }
    };

    if (loading) return <PackageDetailsSkeleton />;

    if (!pkg) {
        return (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
                <h2 style={{ color: 'var(--error-color)' }}>Package not found</h2>
                <Link to="/packages" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontWeight: 'bold' }}>
                    <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Packages
                </Link>
            </div>
        );
    }

    const getImageUrl = (imageName) => {
        return resolvePackageImage(imageName);
    };

    const getProductImageUrl = (imageName, productId) => {
        return resolveProductImage(imageName, productId);
    };

    return (
        <motion.div
            style={containerStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link to="/packages" style={backLinkStyle}>
                <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Packages
            </Link>

            <div style={packageLayout}>
                {/* Left: Package Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={imageContainerStyle}>
                        <img 
                            src={getImageUrl(pkg.imageURL)} 
                            alt={pkg.name} 
                            style={imageStyle} 
                        />
                        {/* Adding arrows for consistency with ProductDetails */}
                        <button onClick={(e) => { e.preventDefault(); prevImage(); }} style={leftArrowStyle}>
                            <FaChevronLeft />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); nextImage(); }} style={rightArrowStyle}>
                            <FaChevronRight />
                        </button>
                    </div>
                </motion.div>

                {/* Right: Package Info */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    style={infoContainerStyle}
                >
                    <div style={badgesContainerStyle}>
                        <span style={packageBadgeStyle}>CURATED BUNDLE</span>
                        <span style={stockBadgeStyle}>Premium Value</span>
                    </div>

                    <h1 style={titleStyle}>{pkg.name}</h1>

                    <div style={priceContainerStyle}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                            <h2 style={bundlePriceStyle}>₹ {pkg.packagePrice}</h2>
                            <span style={totalPriceStyle}>₹ {pkg.totalPrice}</span>
                        </div>
                        <div style={saveBadgeStyle}>
                            SAVE {Math.round(((pkg.totalPrice - pkg.packagePrice) / pkg.totalPrice) * 100)}%
                        </div>
                    </div>

                    <div style={offerBoxStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '800', marginBottom: '5px' }}>
                            <FaInfoCircle /> SPECIAL BUNDLE SAVINGS
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534' }}>
                            This package includes {products.length} products carefully selected for maximum health benefits. You save ₹{pkg.totalPrice - pkg.packagePrice} compared to buying them individually!
                        </p>
                    </div>

                    <div style={actionButtonsContainerStyle}>
                        <motion.button
                            onClick={handleAddToCart}
                            style={addToCartBtnStyle}
                            whileHover={{ scale: 1.02, backgroundColor: 'var(--primary-light)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaShoppingCart size={18} /> Add Package
                        </motion.button>

                        <motion.button
                            onClick={handleBuyNow}
                            style={buyNowBtnStyle}
                            whileHover={{ scale: 1.02, backgroundColor: '#eab308' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaBolt size={18} /> Buy Now
                        </motion.button>
                    </div>
                </motion.div>

                {/* Column 3: Package Inclusions */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    style={productInclusionSectionStyle}
                >
                    <h4 style={{ marginBottom: '12px', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                        <FaBox color="var(--primary-green)" size={16} /> What's included?
                    </h4>
                    <div style={productListStyle}>
                        {products.map((product, idx) => (
                            <Link 
                                key={product.id || idx} 
                                to={`/product/${product.id}`}
                                style={productCardLinkStyle}
                            >
                                <div style={productThumbnailStyle}>
                                    <img src={getProductImageUrl(product.productImage1, product.id)} alt={product.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                                    <div style={{ ...productNameStyle, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.productName}</div>
                                    <div style={productQuantityStyle}>Qty: {product.quantity || 1}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* FEEDBACK SECTION */}
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '15px', color: 'var(--text-dark)', fontSize: '1.2rem' }}>Customer Reviews</h4>
                {feedbacks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>No reviews yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                        {feedbacks.map((f, i) => (
                            <div key={i} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', color: '#fbbf24', marginRight: '8px', fontSize: '0.8rem' }}>
                                        {[...Array(f.rating || 5)].map((_, idx) => <FaStar key={idx} />)}
                                    </div>
                                    <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{f.rating || 5}/5</span>
                                </div>
                                <p style={{ color: 'var(--text-dark)', margin: '0 0 10px 0', lineHeight: 1.4, fontSize: '0.85rem' }}>"{f.comments}"</p>
                                {f.suggestions && (
                                    <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '8px', fontSize: '0.8rem', color: '#475569' }}>
                                        <strong style={{ color: '#1e293b' }}>Sug:</strong> {f.suggestions}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Skeleton
const PackageDetailsSkeleton = () => (
    <div style={containerStyle}>
        <div style={packageLayout}>
            <div className="skeleton-image" style={{ width: '100%', height: '500px', borderRadius: '24px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="skeleton-text" style={{ width: '150px', height: '30px', borderRadius: '15px' }}></div>
                <div className="skeleton-text" style={{ width: '80%', height: '50px', borderRadius: '8px' }}></div>
                <div className="skeleton-text" style={{ width: '200px', height: '40px', borderRadius: '8px' }}></div>
                <div className="skeleton-text" style={{ width: '100%', height: '100px', borderRadius: '12px' }}></div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="skeleton-button" style={{ flex: 1, height: '60px', borderRadius: '12px' }}></div>
                    <div className="skeleton-button" style={{ flex: 1, height: '60px', borderRadius: '12px' }}></div>
                </div>
            </div>
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
        `}</style>
    </div>
);

// Styles
const containerStyle = { padding: "15px 2%", maxWidth: "100%", margin: "0 auto" };

const backLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'var(--text-light)',
    textDecoration: 'none',
    marginBottom: '25px',
    fontWeight: '500'
};

const packageLayout = {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr 1fr",
    gap: "25px",
    alignItems: "start",
    '@media (max-width: 1100px)': {
        gridTemplateColumns: "1fr 1fr"
    },
    '@media (max-width: 800px)': {
        gridTemplateColumns: "1fr"
    }
};

const imageContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '350px',
    border: '1px solid #f3f4f6',
    overflow: 'hidden',
    position: 'relative'
};

const leftArrowStyle = {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 10,
    color: 'var(--primary-green)'
};

const rightArrowStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 10,
    color: 'var(--primary-green)'
};

const imageStyle = { width: "100%", maxHeight: "400px", objectFit: "contain" };

const infoContainerStyle = { display: "flex", flexDirection: "column" };

const badgesContainerStyle = { display: 'flex', gap: '10px', marginBottom: '20px' };

const packageBadgeStyle = {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    color: 'var(--primary-green)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.5px'
};

const stockBadgeStyle = {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700'
};

const titleStyle = {
    fontSize: '2rem',
    color: 'var(--text-dark)',
    lineHeight: '1.1',
    marginBottom: '15px',
    fontWeight: '800'
};

const priceContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '25px'
};

const bundlePriceStyle = {
    color: "var(--primary-green)",
    fontSize: "2rem",
    fontWeight: "900",
    margin: 0
};

const totalPriceStyle = {
    color: '#94a3b8',
    textDecoration: 'line-through',
    fontSize: '1.2rem',
    fontWeight: '600'
};

const saveBadgeStyle = {
    backgroundColor: '#ef4444',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: '800'
};

const offerBoxStyle = {
    backgroundColor: '#f0fdf4',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #bbf7d0',
    marginBottom: '25px'
};

const actionButtonsContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px'
};

const addToCartBtnStyle = {
    flex: 1,
    padding: "14px 20px",
    border: "none",
    background: "var(--primary-green)",
    color: "white",
    borderRadius: "10px",
    fontSize: '1rem',
    fontWeight: '700',
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
};

const buyNowBtnStyle = {
    flex: 1,
    padding: "14px 20px",
    border: "none",
    background: "var(--secondary-bg)",
    color: "#000",
    borderRadius: "10px",
    fontSize: '1rem',
    fontWeight: '700',
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(251, 191, 36, 0.3)'
};

const productInclusionSectionStyle = {
    marginTop: '20px'
};

const productListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const productCardLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1.5px solid #f1f5f9',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    hover: {
        borderColor: 'var(--primary-green)',
        transform: 'translateX(5px)'
    }
};

const productThumbnailStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '8px',
    overflow: 'hidden',
    marginRight: '12px',
    flexShrink: 0
};

const productNameStyle = {
    fontWeight: '700',
    color: 'var(--text-dark)',
    fontSize: '1.05rem',
    marginBottom: '2px'
};

const productQuantityStyle = {
    color: 'var(--primary-green)',
    fontSize: '0.85rem',
    fontWeight: '600'
};

const viewLinkStyle = {
    color: 'var(--text-light)',
    fontSize: '0.8rem',
    fontWeight: 'bold'
};

export default PackageDetails;
