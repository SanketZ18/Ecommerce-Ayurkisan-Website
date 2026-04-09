import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '../../assets/images/heroimage.jpg';
import i111 from '../../assets/images/111.jpg';
import i112 from '../../assets/images/112.jpg';
import i113 from '../../assets/images/113.jpg';
import i114 from '../../assets/images/114.jpg';
import i115 from '../../assets/images/115.jpg';

const HeroSection = () => {

    const navigate = useNavigate();

    const [heroData] = useState({
        heading: "Nature’s Goodness, Delivered to You.",
        subtext: "Experience the purity of Aloe Vera, Moringa, Tulsi and Ayurvedic blends crafted for complete wellness and vitality."
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const heroImages = [heroImage, i111, i112, i113, i114, i115];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <section style={heroStyle}>
            <div style={contentStyle}>

                <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        color: 'var(--primary-green)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                        fontWeight: 'bold'
                    }}
                >
                    AYURVEDIC HERBAL WELLNESS
                </motion.h4>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{
                        fontSize: '3.8rem',
                        lineHeight: '1.1',
                        marginBottom: '1.5rem',
                        color: 'var(--text-dark)',
                        fontWeight: '800'
                    }}
                >
                    {heroData.heading}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ fontSize: '1.8rem', marginBottom: '1rem' }}
                >
                    🌿
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-light)',
                        marginBottom: '2.5rem',
                        maxWidth: '500px',
                        lineHeight: '1.6'
                    }}
                >
                    {heroData.subtext}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
                >

                    {/* Explore Packages Button */}
                    <button
                        className="btn-primary"
                        style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '30px' }}
                        onClick={() => navigate('/packages')}
                    >
                        Explore Packages
                    </button>

                    {/* Explore Products Button */}
                    <button
                        className="btn-primary"
                        style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '30px' }}
                        onClick={() => navigate('/products')}
                    >
                        Explore Products
                    </button>

                </motion.div>

            </div>

            <div style={imageContainerStyle}>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 'var(--border-radius-lg)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        position: 'relative'
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={heroImages[currentImageIndex]}
                            alt="Herbal Bottles"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </AnimatePresence>
                </motion.div>

                <div style={{
                    position: 'absolute',
                    top: '-15%',
                    right: '-25%',
                    width: '600px',
                    height: '600px',
                    backgroundColor: 'rgba(232, 245, 233, 0.8)',
                    borderRadius: '50%',
                    zIndex: -1
                }} />
            </div>

        </section>
    );
};

const heroStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4rem 5%',
    minHeight: '80vh',
    backgroundColor: '#f4fcf6',
    position: 'relative',
    overflow: 'hidden'
};

const contentStyle = {
    flex: '1',
    maxWidth: '550px',
    zIndex: 1
};

const imageContainerStyle = {
    flex: '1',
    height: '450px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: '600px'
};

export default HeroSection;