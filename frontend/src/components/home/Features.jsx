import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Features = () => {
    // Dynamic Mock Data (To be fetched from Admin settings API)
    const [features, setFeatures] = useState([
        { id: 1, title: '100% Natural', desc: 'No chemicals, no preservatives. Pure Ayurvedic goodness.', icon: '🌿' },
        { id: 2, title: 'Authentic Ingredients', desc: 'Sourced directly from trusted organic farms.', icon: '🌾' },
        { id: 3, title: 'Lab Tested', desc: 'Strict quality checks to ensure premium standards.', icon: '🔬' }
    ]);

    return (
        <section style={sectionStyle}>
            <div style={gridStyle}>
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        style={cardStyle}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-green)' }}>{feature.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const sectionStyle = {
    padding: '4rem 5%',
    backgroundColor: 'var(--white)',
    marginTop: '-4rem', // overlapping the hero section slightly
    position: 'relative',
    zIndex: 10
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
};

const cardStyle = {
    backgroundColor: 'var(--white)',
    padding: '2rem',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-md)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'default'
};

export default Features;
