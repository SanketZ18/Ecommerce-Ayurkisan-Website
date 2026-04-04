import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../../utils/auth";
import { toast } from 'react-toastify';
import { resolveProductImage } from '../../utils/imageUtils';

const API = 'http://localhost:9090';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [sectionTitle, setSectionTitle] = useState('Best Selling Products');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBestSellers = async () => {
            try {
                // Fetch the admin-configured bestsellers section
                const sectionsRes = await axios.get(`${API}/api/homepage/sections`);
                const sections = sectionsRes.data || [];
                const bsSection = sections.find(s => s.type === 'bestsellers');

                if (bsSection) {
                    if (bsSection.title) setSectionTitle(bsSection.title);

                    if (bsSection.productIds && bsSection.productIds.length > 0) {
                        // Fetch all products and filter by admin-chosen IDs
                        const allRes = await axios.get(`${API}/products/all`);
                        const all = Array.isArray(allRes.data) ? allRes.data : [];
                        const featured = bsSection.productIds
                            .map(id => all.find(p => p.id === id))
                            .filter(Boolean);
                        setProducts(featured);
                    } else {
                        // No configured IDs — fall back to first 4
                        const allRes = await axios.get(`${API}/products/all`);
                        const all = Array.isArray(allRes.data) ? allRes.data : [];
                        setProducts(all.slice(0, 4));
                    }
                } else {
                    // No bestsellers section saved yet — fall back to first 4
                    const allRes = await axios.get(`${API}/products/all`);
                    const all = Array.isArray(allRes.data) ? allRes.data : [];
                    setProducts(all.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching best sellers:", error);
                // Last resort fallback
                try {
                    const allRes = await axios.get(`${API}/products/all`);
                    const all = Array.isArray(allRes.data) ? allRes.data : [];
                    setProducts(all.slice(0, 4));
                } catch (_) {}
            } finally {
                setLoading(false);
            }
        };
        loadBestSellers();
    }, []);

    const handleActionClick = () => {
        if (!isAuthenticated()) {
            toast.warn("Please log in or sign up to add items to your cart.");
            window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { modalType: 'signupSelect' } }));
            return;
        }
    };

    if (loading) return null;
    if (products.length === 0) return null;

    return (
        <section style={sectionStyle}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: "center", marginBottom: "3rem", fontSize: "2.5rem", color: "var(--primary-green)" }}
            >
                {sectionTitle}
            </motion.h2>

            <div style={gridStyle}>
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        style={cardStyle}
                        whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                    >
                        <div style={{ padding: "20px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img
                                src={resolveProductImage(product.productImage1, product.id)}
                                alt={product.productName}
                                loading="lazy"
                                style={imageStyle}
                            />
                        </div>

                        <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                <h3 style={{ fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "10px" }}>{product.productName}</h3>
                            </Link>

                            <p style={{ color: "var(--primary-green)", fontWeight: "bold", fontSize: "1.2rem", marginBottom: "15px" }}>
                                ₹{product.finalPrice}
                            </p>

                            <motion.button
                                style={{ marginTop: "auto", padding: "10px", background: "var(--primary-green)", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                                whileHover={{ backgroundColor: "var(--primary-light)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleActionClick}
                            >
                                Add to Cart
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <Link to="/products">
                    <button className="btn-outline" style={{ padding: "10px 30px", fontSize: "1.1rem", borderRadius: "25px" }}>
                        View All Products
                    </button>
                </Link>
            </div>
        </section>
    );
};

const sectionStyle = {
    padding: "6rem 5%",
    backgroundColor: "#ffffff",
    maxWidth: "1400px",
    margin: "0 auto"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem"
};

const cardStyle = {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #f3f4f6"
};

const imageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain"
};

export default BestSellers;