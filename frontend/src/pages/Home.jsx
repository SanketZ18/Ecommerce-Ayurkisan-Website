import React, { useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import Features from "../components/home/Features";
import BestSellers from "../components/home/BestSellers";
import DynamicSections from "../components/home/DynamicSections";

const Home = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-page" style={{ overflowX: 'hidden' }}>

            {/* Static top part with modernized CSS inside */}
            <HeroSection />
            <CategoriesSection />
            <Features />
            <BestSellers />

            {/* Admin-Managed Dynamic Sections */}
            <DynamicSections />

            {/* ================= HERBAL INFORMATION SECTION ================= */}

            <section style={infoSection}>

                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={sectionTitle}
                >
                    🌿 Why Choose Herbal Products?
                </motion.h2>

                <p style={sectionSubtitle}>
                    Herbal medicine has been trusted for centuries in Ayurveda and natural healing systems.
                    Unlike chemical medicines, herbal remedies work naturally with the body and help improve
                    long-term wellness, immunity, and overall health.
                </p>

                <div style={cardContainer}>

                    {/* CARD 1 */}
                    <motion.div
                        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        style={infoCard}
                    >
                        <div style={iconStyle}>🌱</div>
                        <h3 style={cardTitle}>100% Natural Ingredients</h3>
                        <p style={cardText}>
                            Herbal products are derived from plants like Aloe Vera, Tulsi,
                            Moringa and Ashwagandha which contain powerful natural nutrients
                            that help the body heal naturally.
                        </p>
                    </motion.div>

                    {/* CARD 2 */}
                    <motion.div
                        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        style={infoCard}
                    >
                        <div style={iconStyle}>💊</div>
                        <h3 style={cardTitle}>Minimal Side Effects</h3>
                        <p style={cardText}>
                            Unlike synthetic medicines, herbal remedies are gentle on the body
                            and generally have fewer side effects when used correctly.
                        </p>
                    </motion.div>

                    {/* CARD 3 */}
                    <motion.div
                        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        style={infoCard}
                    >
                        <div style={iconStyle}>🧘</div>
                        <h3 style={cardTitle}>Holistic Healing</h3>
                        <p style={cardText}>
                            Ayurveda focuses on balancing mind, body and lifestyle rather
                            than only treating symptoms of illness.
                        </p>
                    </motion.div>

                    {/* CARD 4 */}
                    <motion.div
                        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        style={infoCard}
                    >
                        <div style={iconStyle}>🌍</div>
                        <h3 style={cardTitle}>Eco Friendly</h3>
                        <p style={cardText}>
                            Herbal products are environmentally friendly because they come
                            from renewable plant resources and sustainable farming practices.
                        </p>
                    </motion.div>

                </div>

            </section>

        </div>
    );
};

export default Home;


/* ================= STYLES ================= */

const infoSection = {
    padding: "6rem 5%",
    background: "linear-gradient(135deg,rgba(5, 150, 105, 0.05),rgba(250, 204, 21, 0.08))",
    textAlign: "center",
    marginTop: "3rem"
};

const sectionTitle = {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    fontWeight: "800",
    color: "var(--text-dark)"
};

const sectionSubtitle = {
    maxWidth: "750px",
    margin: "0 auto 4rem auto",
    color: "var(--text-light)",
    lineHeight: "1.7",
    fontSize: "1.1rem"
};

const cardContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "2.5rem",
    maxWidth: "1400px",
    margin: "0 auto"
};

const infoCard = {
    background: "white",
    padding: "2.5rem 2rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #f3f4f6"
};

const iconStyle = {
    fontSize: "3rem",
    marginBottom: "1rem"
};

const cardTitle = {
    fontSize: "1.25rem",
    color: "var(--primary-green)",
    marginBottom: "1rem",
    fontWeight: "700"
};

const cardText = {
    color: "var(--text-light)",
    lineHeight: "1.6",
    fontSize: "0.95rem"
};