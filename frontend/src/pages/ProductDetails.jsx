import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaBolt, FaStar, FaLeaf, FaArrowLeft, FaBox, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import customerService from "../utils/customerService";

const ProductDetails = () => {
    const { productName } = useParams();
    const [product, setProduct] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // User Role context
    const userRole = localStorage.getItem('role') || 'CUSTOMER';

    const handleAddToCart = async () => {
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role') || 'CUSTOMER';
        if (!userId) {
            toast.warning("Please login to add to cart");
            // Optionally open login modal via event if App.jsx listens
            return;
        }
        try {
            await customerService.addToCart(userId, role, product.id, 'PRODUCT', quantity);
            toast.success(`${product.productName || product.name} added to cart!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add to cart. Please try again.");
        }
    };

    const handleBuyNow = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.warning("Please login to place an order");
            return;
        }
        await handleAddToCart();
        window.location.href = '/checkout';
    };

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on load

        // fetch the product by name
        axios.get(`http://localhost:9090/products/${encodeURIComponent(productName)}`)
            .then(res => {
                const fetchedProduct = res.data;
                setProduct(fetchedProduct);

                // Then fetch feedbacks using the product's ID
                if (fetchedProduct && fetchedProduct.id) {
                    return axios.get(`http://localhost:9090/feedback/product/${fetchedProduct.id}`);
                }
                return null;
            })
            .then(res => {
                if (res) setFeedbacks(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [productName]);

    if (loading) {
        return <ProductSkeleton />;
    }

    if (!product) {
        return (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
                <h2 style={{ color: 'var(--error-color)' }}>Product not found</h2>
                <Link to="/products" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontWeight: 'bold' }}>
                    <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Shop
                </Link>
            </div>
        );
    }

    // Attempt to split description into benefits if comma-separated, or use default
    const benefitsList = product.benefits ? product.benefits.split(',') :
        ["100% Organic Ingredients", "Sustainably Harvested", "No Artificial Preservatives", "Lab Tested for Purity"];

    return (
        <motion.div
            style={containerStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link to="/products" style={backLinkStyle}>
                <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Shop
            </Link>

            <div style={productLayout}>
                {/* Left: Image Gallery */}
                <motion.div
                    style={imageContainerWrapperStyle}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={imageContainerStyle}>
                        <motion.img
                            key={activeImageIndex}
                            src={[product.productImage1, product.productImage2, product.productImage3][activeImageIndex] || product.productImage1 || 'https://via.placeholder.com/600x600?text=Agro+Product'}
                            alt={product.productName || product.name}
                            style={imageStyle}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    <div style={thumbnailGalleryStyle}>
                        {[product.productImage1, product.productImage2, product.productImage3].map((img, idx) => img && (
                            <motion.div
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    ...thumbnailStyle,
                                    border: activeImageIndex === idx ? '2px solid var(--primary-green)' : '2px solid transparent',
                                    backgroundImage: `url(${img})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Right: Product Info */}
                <motion.div
                    style={infoContainerStyle}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div style={badgesContainerStyle}>
                        <span style={categoryBadgeStyle}>{product.categoryName || 'Herbal'}</span>
                        <span style={stockBadgeStyle}>In Stock</span>
                    </div>

                    <h1 style={titleStyle}>{product.productName || product.name}</h1>

                    <div style={ratingSummaryStyle}>
                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginLeft: '10px' }}>
                            ({feedbacks.length} customer reviews)
                        </span>
                    </div>

                    {userRole === 'RETAILER' ? (
                        <div style={{ marginBottom: '25px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                <FaBox color="#ea580c" />
                                <span style={{ fontWeight: 'bold', color: '#475569' }}>Retailer Wholesale Price (Box)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                <h2 style={{ color: "var(--primary-green)", fontSize: "2.2rem", fontWeight: "bold", margin: 0 }}>
                                    ₹ {((product.finalPrice || product.price) * (product.piecesPerBox || 10) * 0.7).toLocaleString()}
                                </h2>
                                <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                    ₹ {((product.finalPrice || product.price) * (product.piecesPerBox || 10)).toLocaleString()}
                                </span>
                            </div>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold', marginTop: '5px' }}>
                                <FaInfoCircle /> 30% BUSINESS DISCOUNT APPLIED
                            </p>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                <h2 style={priceStyle}>₹ {product.finalPrice || product.price}</h2>
                                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>+ 10% OFF AT CHECKOUT</span>
                            </div>

                            <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '12px', border: '1px solid #bbf7d0', marginTop: '10px' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#166534', marginBottom: '5px' }}>BUY IN BULK & SAVE 30%</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                                        ₹ {((product.finalPrice || product.price) * (product.piecesPerBox || 10) * 0.7).toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>per Box of {product.piecesPerBox || 10}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: '600' }}>Quantity:</span>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                style={{ padding: '8px 12px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}
                            >-</button>
                            <span style={{ padding: '8px 20px', fontWeight: 'bold' }}>{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                style={{ padding: '8px 12px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}
                            >+</button>
                        </div>
                    </div>

                    <p style={descriptionStyle}>
                        {product.description || "Premium quality herbal product directly from Mahakissan Agro Farms. Packed with natural nutrients and processed maintaining highest safety standards."}
                    </p>

                    <div style={benefitsContainerStyle}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--text-dark)' }}>Health Benefits:</h4>
                        <ul style={benefitsListStyle}>
                            {benefitsList.map((benefit, index) => (
                                <li key={index} style={benefitItemStyle}>
                                    <FaLeaf style={{ color: 'var(--primary-green)', marginRight: '10px', flexShrink: 0 }} />
                                    <span>{benefit.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={actionButtonsContainerStyle}>
                        <motion.button
                            onClick={handleAddToCart}
                            style={addToCartBtnStyle}
                            whileHover={{ scale: 1.02, backgroundColor: 'var(--primary-light)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FaShoppingCart size={18} /> Add To Cart {userRole === 'RETAILER' ? '(1 Box)' : ''}
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
            </div>

            {/* FEEDBACK SECTION */}
            <motion.div
                style={reviewsSectionStyle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <h3 style={sectionDividerTitleStyle}>Customer Reviews</h3>

                {feedbacks.length === 0 ? (
                    <div style={noReviewsStyle}>
                        <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    <div style={reviewsGridStyle}>
                        {feedbacks.map((f, i) => (
                            <div key={i} style={reviewCardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', color: '#fbbf24', marginRight: '10px' }}>
                                        {[...Array(f.rating || 5)].map((_, idx) => <FaStar key={idx} />)}
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{f.rating || 5}/5</span>
                                </div>

                                <p style={{ color: 'var(--text-dark)', marginBottom: '15px', lineHeight: '1.5' }}>
                                    "{f.comments}"
                                </p>

                                {f.suggestions && (
                                    <div style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                        <strong>Suggestion:</strong> {f.suggestions}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

// SKELETON COMPONENT

const ProductSkeleton = () => (
    <div style={{ ...containerStyle, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={productLayout}>
            <div className="skeleton-image" style={{ width: '100%', height: '500px', borderRadius: '16px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="skeleton-text" style={{ width: '20%', height: '30px', borderRadius: '15px' }}></div>
                <div className="skeleton-text" style={{ width: '80%', height: '40px', borderRadius: '8px' }}></div>
                <div className="skeleton-text" style={{ width: '40%', height: '20px', borderRadius: '4px' }}></div>
                <div className="skeleton-text" style={{ width: '30%', height: '35px', borderRadius: '4px', marginTop: '20px' }}></div>
                <div className="skeleton-text" style={{ width: '100%', height: '100px', borderRadius: '8px' }}></div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                    <div className="skeleton-button" style={{ flex: 1, height: '55px', borderRadius: '12px' }}></div>
                    <div className="skeleton-button" style={{ flex: 1, height: '55px', borderRadius: '12px' }}></div>
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

// STYLES

const containerStyle = {
    padding: "40px 5%",
    maxWidth: "1400px",
    margin: "0 auto"
};

const backLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    color: 'var(--text-light)',
    textDecoration: 'none',
    marginBottom: '25px',
    fontWeight: '500',
    transition: 'color 0.2s',
};

const productLayout = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "50px",
    alignItems: "start",
    '@media (max-width: 900px)': {
        gridTemplateColumns: "1fr"
    }
};

const imageContainerWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
};

const imageContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    border: '1px solid #f3f4f6',
    position: 'relative',
    overflow: 'hidden'
};

const thumbnailGalleryStyle = {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '10px'
};

const thumbnailStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease'
};

const imageStyle = {
    width: "100%",
    maxHeight: "500px",
    objectFit: "contain",
};

const infoContainerStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "10px 0"
};

const badgesContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
};

const categoryBadgeStyle = {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    color: 'var(--primary-green)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
};

const stockBadgeStyle = {
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    color: '#b45309',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600'
};

const titleStyle = {
    fontSize: '2.5rem',
    color: 'var(--text-dark)',
    lineHeight: '1.2',
    marginBottom: '10px'
};

const ratingSummaryStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px'
};

const priceStyle = {
    color: "var(--primary-green)",
    fontSize: "2.2rem",
    fontWeight: "bold",
    marginBottom: "25px"
};

const descriptionStyle = {
    color: 'var(--text-light)',
    fontSize: '1.05rem',
    lineHeight: '1.7',
    marginBottom: '30px'
};

const benefitsContainerStyle = {
    backgroundColor: '#fafafa',
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '35px',
    border: '1px solid #f0f0f0'
};

const benefitsListStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
};

const benefitItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '0.95rem',
    color: 'var(--text-dark)'
};

const actionButtonsContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: 'auto'
};

const addToCartBtnStyle = {
    flex: 1,
    padding: "16px 24px",
    border: "none",
    background: "var(--primary-green)",
    color: "white",
    borderRadius: "12px",
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
};

const buyNowBtnStyle = {
    flex: 1,
    padding: "16px 24px",
    border: "none",
    background: "var(--secondary-bg)",
    color: "#000",
    borderRadius: "12px",
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 14px rgba(250, 204, 21, 0.3)'
};

// REVIEW STYLES
const reviewsSectionStyle = {
    marginTop: "80px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "40px"
};

const sectionDividerTitleStyle = {
    fontSize: '1.8rem',
    color: 'var(--text-dark)',
    marginBottom: '30px',
    textAlign: 'center'
};

const noReviewsStyle = {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    color: 'var(--text-light)',
    border: '1px solid #f3f4f6'
};

const reviewsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
};

const reviewCardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #f3f4f6",
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
};

export default ProductDetails;