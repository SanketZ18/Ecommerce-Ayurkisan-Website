import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Import the video correctly for Vite
import AdvertisementVideo from "../../assets/Advertisement.mp4";

const API = 'http://localhost:9090';

const DynamicSections = () => {
    const [offersSection, setOffersSection] = useState(null);
    const [videoSection] = useState({
        id: 'vid',
        type: 'text_video',
        title: 'Purity You Can Trust',
        subtitle: 'From farm to bottle, we ensure that every product meets the highest Ayurvedic standards. No chemicals, pure nature.',
        videoSrc: AdvertisementVideo,
        ctaText: 'Learn About Us',
        ctaLink: '/about',
        alignment: 'right'
    });
    const [testimonialsSection, setTestimonialsSection] = useState(null);
    const [loading, setLoading] = useState(true);

    // Default fallback data
    const defaultOffers = {
        id: 'offers_default',
        type: 'special_offers',
        title: 'Special Summer Offers! 🌿',
        subtitle: 'Get up to 30% off on all organic skin care products this season.',
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop',
        ctaText: 'Shop Offers',
        ctaLink: '/shop',
        alignment: 'left'
    };

    const defaultTestimonials = {
        id: 'test_default',
        type: 'testimonials',
        title: 'What Our Customers Say',
        subtitle: 'Real feedback from people who have experienced the magic of our herbal formulas.',
        items: [
            { id: 't1', name: 'Anjali Sharma', rating: 5, comment: 'The Neem face wash completely cleared my skin in two weeks. Highly recommended!' },
            { id: 't2', name: 'Rahul Verma', rating: 5, comment: 'I have tried many herbal brands, but Mahakissan is by far the most authentic. The Tulsi drops are excellent.' },
            { id: 't3', name: 'Priya Desai', rating: 4, comment: 'Great quality products. Delivery was a bit slow, but totally worth the wait.' }
        ]
    };

    useEffect(() => {
        axios.get(`${API}/api/homepage/sections`)
            .then(res => {
                const sections = res.data || [];
                const off = sections.find(s => s.type === 'special_offers');
                const test = sections.find(s => s.type === 'testimonials');
                setOffersSection(off || defaultOffers);
                setTestimonialsSection(test || defaultTestimonials);
            })
            .catch(() => {
                setOffersSection(defaultOffers);
                setTestimonialsSection(defaultTestimonials);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-light)' }}>
            Loading dynamic content...
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', margin: '80px 0' }}>
            {/* Special Offers Section */}
            {offersSection && <TextMediaSection section={offersSection} />}

            {/* Static Video Section */}
            <TextMediaSection section={videoSection} />

            {/* Testimonials Section */}
            {testimonialsSection && (
                <TestimonialsSection section={testimonialsSection} />
            )}
        </div>
    );
};

// Component for image and video sections
const TextMediaSection = ({ section }) => {
    const isTextLeft = section.alignment === 'left' || !section.alignment;
    const isVideo = section.type === 'text_video';

    return (
        <section style={{
            ...containerStyle,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '50px',
            alignItems: 'center',
            backgroundColor: (section.type === 'special_offers' || section.type === 'promotional') ? '#fdf8e9' : '#fff',
            padding: (section.type === 'special_offers' || section.type === 'promotional') ? '60px 8%' : '20px 8%',
            borderRadius: (section.type === 'special_offers' || section.type === 'promotional') ? '24px' : '0',
            margin: (section.type === 'special_offers' || section.type === 'promotional') ? '0 5%' : '0'
        }} className="dynamic-section">

            {/* Text Side */}
            <motion.div
                style={{ order: isTextLeft ? 1 : 2, display: 'flex', flexDirection: 'column', gap: '20px' }}
                initial={{ opacity: 0, x: isTextLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <h2 style={{ fontSize: '2.8rem', color: 'var(--text-dark)', lineHeight: '1.2', margin: 0 }}>
                    {section.title}
                </h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-light)', lineHeight: '1.7', margin: 0 }}>
                    {section.subtitle}
                </p>
                {section.promoCode && section.showPromoCode && (
                    <div style={{ 
                        marginTop: '5px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        width: 'fit-content',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600' }}>Use Code:</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--primary-green)', fontWeight: '800' }}>{section.promoCode}</span>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(section.promoCode);
                                toast.success('Code copied!');
                            }}
                            style={{
                                background: 'var(--primary-green)',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                marginLeft: '5px'
                            }}
                        >
                            Copy
                        </button>
                    </div>
                )}
                {section.ctaText && (
                    <Link to={section.ctaLink || '#'} style={{ textDecoration: 'none', marginTop: '10px' }}>
                        <motion.button
                            className="btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '14px 28px',
                                fontSize: '1.05rem',
                                borderRadius: '30px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {section.ctaText} <FaArrowRight />
                        </motion.button>
                    </Link>
                )}
            </motion.div>

            {/* Media Side */}
            <motion.div
                style={{ order: isTextLeft ? 2 : 1, width: '100%', height: '450px', overflow: 'hidden', borderRadius: '24px', position: 'relative' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.03)', zIndex: 1, borderRadius: '24px' }}></div>
                {isVideo ? (
                    <video
                        src={section.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
                    />
                ) : (
                    <img
                        src={section.imageUrl}
                        alt={section.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
                    />
                )}
            </motion.div>
        </section>
    );
};

const TestimonialsSection = ({ section }) => {
    return (
        <section style={{ ...containerStyle, padding: '40px 5%', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '30px' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '15px' }}>{section.title}</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
                    {section.subtitle}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {section.items && section.items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            style={{
                                backgroundColor: '#fff',
                                padding: '30px',
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px'
                            }}
                        >
                            <div style={{ color: 'var(--primary-green)', fontSize: '1.5rem', opacity: 0.5 }}>
                                <FaQuoteLeft />
                            </div>
                            <p style={{ fontSize: '1.05rem', color: 'var(--text-dark)', fontStyle: 'italic', lineHeight: '1.6', flexGrow: 1 }}>
                                "{item.comment}"
                            </p>
                            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>{item.name}</span>
                                <div style={{ display: 'flex', color: '#fbbf24' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} size={14} style={{ opacity: i < item.rating ? 1 : 0.2 }} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
};

// Responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @media (max-width: 900px) {
        .dynamic-section {
            grid-template-columns: 1fr !important;
            text-align: center !important;
        }
        .dynamic-section > div {
            order: 0 !important;
            align-items: center !important;
        }
    }
`;
document.head.appendChild(styleSheet);

export default DynamicSections;