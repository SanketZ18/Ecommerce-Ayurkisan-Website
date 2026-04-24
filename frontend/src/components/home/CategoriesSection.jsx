import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaLeaf, FaSnowflake, FaBox, FaCheck } from "react-icons/fa";

import bgImage from "../../assets/images/111.jpg";

const CategoriesSection = () => {
    return (
        <section className="categories-section" style={sectionStyle}>
            {/* Dark overlay for better text readability */}
            <div style={overlayStyle}></div>

            <div className="categories-content-wrapper" style={contentWrapper}>
                {/* LEFT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    style={leftContent}
                >
                    <h4 style={subtitleStyle}>AYURKISAN FARMS</h4>
                    <h2 className="categories-title" style={titleStyle}>
                        Heart Of <span style={{ color: "#facc15" }}>Perfect Farming</span><br />
                        From Indian farms to the world.
                    </h2>

                    <p style={descriptionStyle}>
                        Ayurkisan Farms works with a strong network of farmers to
                        grow, grade and export herbal products, fruits and
                        vegetables with consistent quality and professional execution.
                    </p>

                    <div style={tagsContainer}>
                        <span style={tagStyle}><FaLeaf style={{ marginRight: '8px', color: '#facc15' }} /> Farmer-first sourcing</span>
                        <span style={tagStyle}><FaSnowflake style={{ marginRight: '8px', color: '#facc15' }} /> Cold-chain handling</span>
                        <span style={tagStyle}><FaBox style={{ marginRight: '8px', color: '#facc15' }} /> Export-ready packing</span>
                    </div>

                    <div style={actionContainer}>
                        <Link to="/products" style={primaryBtn}>View Products &rarr;</Link>
                        <Link to="/feedback" style={secondaryBtn}>Talk to us</Link>
                    </div>

                    <div className="categories-stats" style={statsContainer}>
                        <div>
                            <h3 style={statValue}>1000+</h3>
                            <p style={statLabel}>Associated farmers</p>
                        </div>
                        <div>
                            <h3 style={statValue}>5+</h3>
                            <p style={statLabel}>Countries served</p>
                        </div>
                        <div>
                            <h3 style={statValue}>2+</h3>
                            <p style={statLabel}>Years of organised journey</p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE (Minimal Views/Cards) */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    style={rightContent}
                >
                    {/* Card 1 */}
                    <div style={darkCard}>
                        <h3 style={cardTitleWhite}>From harvest to container</h3>
                        <p style={cardTextWhite}>
                            We connect farms, pack-houses, cold stores and
                            ports with a clear, process-driven approach.
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, color: '#e5e7eb', fontSize: '0.95rem' }}>
                            <li style={listItem}><FaCheck style={checkIcon} /> Planned plantation seasons</li>
                            <li style={listItem}><FaCheck style={checkIcon} /> Standardised grading & sizing</li>
                            <li style={listItem}><FaCheck style={checkIcon} /> Controlled pre-cooling & loading</li>
                        </ul>
                    </div>

                    {/* Card 2 */}
                    <div style={lightCard}>
                        <h3 style={cardTitleGreen}>Key Products</h3>
                        <p style={cardTextDark}>
                            Herbal Powders, Semi-husked Coconuts, Pomegranate,
                            Grapes & Fresh Vegetables.
                        </p>
                        <Link to="/products" style={exploreLink}>Explore portfolio &rarr;</Link>
                    </div>

                    {/* Card 3 */}
                    <div style={lightCard}>
                        <h3 style={cardTitleBlue}>Farmer Network</h3>
                        <p style={cardTextBlue}>
                            Farmers across Maharashtra and other states,
                            guided on quality & timing.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* ================= STYLES ================= */

const sectionStyle = {
    position: "relative",
    padding: "6rem 5%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden"
};

const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 40, 20, 0.75)",
    zIndex: 1
};

const contentWrapper = {
    position: "relative",
    zIndex: 2,
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4rem",
    alignItems: "center"
};

const leftContent = {
    color: "#fff"
};

const subtitleStyle = {
    fontSize: "1rem",
    letterSpacing: "2px",
    color: "#e5e7eb",
    textTransform: "uppercase",
    marginBottom: "1rem",
    fontWeight: "600"
};

const titleStyle = {
    fontSize: "3.5rem",
    fontWeight: "800",
    lineHeight: "1.2",
    marginBottom: "1.5rem"
};

const descriptionStyle = {
    fontSize: "1.1rem",
    color: "#d1d5db",
    lineHeight: "1.6",
    marginBottom: "2rem",
    maxWidth: "90%"
};

const tagsContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2.5rem"
};

const tagStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)"
};

const actionContainer = {
    display: "flex",
    gap: "1rem",
    marginBottom: "3rem"
};

const primaryBtn = {
    backgroundColor: "#facc15",
    color: "#000",
    padding: "12px 24px",
    borderRadius: "30px",
    fontWeight: "600",
    textDecoration: "none",
    transition: "background 0.3s"
};

const secondaryBtn = {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    padding: "12px 24px",
    borderRadius: "30px",
    fontWeight: "600",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.3s"
};

const statsContainer = {
    display: "flex",
    gap: "3rem"
};

const statValue = {
    fontSize: "2rem",
    fontWeight: "700",
    margin: "0 0 5px 0"
};

const statLabel = {
    fontSize: "0.9rem",
    color: "#9ca3af",
    margin: 0
};

// --- RIGHT SIDE CARDS ---

const rightContent = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
};

const darkCard = {
    backgroundColor: "rgba(20, 40, 30, 0.8)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)"
};

const lightCard = {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
};

const cardTitleWhite = {
    color: "#fff",
    fontSize: "1.3rem",
    marginBottom: "1rem"
};

const cardTextWhite = {
    color: "#d1d5db",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "1.5rem"
};

const cardTitleGreen = {
    color: "var(--primary-green)",
    fontSize: "1.2rem",
    marginBottom: "0.5rem"
};

const cardTextDark = {
    color: "var(--text-light)",
    fontSize: "0.95rem",
    marginBottom: "1rem"
};

const cardTitleBlue = {
    color: "#3b82f6",
    fontSize: "1.2rem",
    marginBottom: "0.5rem"
};

const cardTextBlue = {
    color: "#4b5563",
    fontSize: "0.95rem"
};

const checkIcon = {
    color: "#facc15",
    marginRight: "10px"
};

const listItem = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px"
};

const exploreLink = {
    color: "var(--primary-green)",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "0.95rem"
};

// Add responsive styles using a simple media query in JS could be tricky, but we can rely on standard CSS in main CSS or just accept grid stack on smaller screens if added to global CSS. Here we stick to inline for simplicity or assume standard container handles it.

export default CategoriesSection;
