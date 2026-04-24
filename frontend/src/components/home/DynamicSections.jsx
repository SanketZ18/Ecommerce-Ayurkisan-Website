import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../utils/apiConfig';

// Import the video correctly for Vite
import AdvertisementVideo from "../../assets/Advertisement.mp4";

const API = API_BASE_URL;

// ─── DEFAULT FALLBACK DATA (shown immediately, no waiting) ───────────────────
const defaultOffers = {
    id: 'offers_default',
    type: 'special_offers',
    title: 'Cool & Calm Herbal Offers 👩‍🦰🌿',
    subtitle: 'Refresh your skin and body with soothing herbal products at amazing discounts. Get up to 30% off this season!',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop',
    ctaText: 'Shop Offers',
    ctaLink: '/shop',
    alignment: 'left'
};

const defaultVideoSection = {
    id: 'vid',
    type: 'text_video',
    title: 'Purity You Can Trust',
    subtitle: 'From farm to bottle, we ensure that every product meets the highest Ayurvedic standards. No chemicals, pure nature.',
    videoSrc: AdvertisementVideo,
    ctaText: 'Learn About Us',
    ctaLink: '/about',
    alignment: 'right'
};

const defaultTestimonials = {
    id: 'test_default',
    type: 'testimonials',
    title: 'What Our Customers Say',
    subtitle: 'Real feedback from people who have experienced the magic of our herbal formulas.',
    items: [
        { id: 't1', name: 'Anjali Sharma', rating: 5, comment: 'The Neem face wash completely cleared my skin in two weeks. Highly recommended!' },
        { id: 't2', name: 'Rahul Verma', rating: 5, comment: 'I have tried many herbal brands, but Ayurkisan is by far the most authentic. The Tulsi drops are excellent.' },
        { id: 't3', name: 'Priya Desai', rating: 4, comment: 'Great quality products. Delivery was a bit slow, but totally worth the wait.' }
    ]
};

const DynamicSections = () => {
    // ✅ FIX 1: Initialize with defaults — content shows INSTANTLY, no loading spinner
    const [offersSection, setOffersSection] = useState(defaultOffers);
    const [videoSection] = useState(defaultVideoSection);
    const [testimonialsSection, setTestimonialsSection] = useState(defaultTestimonials);

    useEffect(() => {
        // Fetch from backend silently in background — updates if API responds
        // If backend is cold-starting on Render, user already sees the default content
        axios.get(`${API}/api/homepage/sections`, { timeout: 30000 })
            .then(res => {
                const sections = res.data || [];
                const off = sections.find(s => s.type === 'special_offers');
                const test = sections.find(s => s.type === 'testimonials');
                // Only update if we got real data from the server
                if (off) setOffersSection(off);
                if (test) setTestimonialsSection(test);
            })
            .catch(() => {
                // Silently keep defaults — no error shown to user
            });
    }, []);

    // ✅ No loading spinner — removed entirely
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
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

// ─── TEXT + MEDIA SECTION (full-width, no left/right whitespace) ─────────────
const TextMediaSection = ({ section }) => {
    const isTextLeft = section.alignment === 'left' || !section.alignment;
    const isVideo = section.type === 'text_video';
    const isOffer = section.type === 'special_offers' || section.type === 'promotional';

    const bgStyle = isOffer
        ? { background: 'linear-gradient(135deg, #fdf8e9 0%, #fef3c7 50%, #ecfdf5 100%)' }
        : { background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%)' };

    return (
        <section
            className="dynamic-section"
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                width: '100%',
                minHeight: '520px',
                ...bgStyle,
                padding: '70px 6%',
            }}
        >
            {/* Text Side */}
            <motion.div
                style={{
                    order: isTextLeft ? 1 : 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '22px',
                    padding: isTextLeft ? '0 50px 0 0' : '0 0 0 50px'
                }}
                initial={{ opacity: 0, x: isTextLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <h2 style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                    color: 'var(--text-dark)',
                    lineHeight: '1.2',
                    margin: 0,
                    fontWeight: '800'
                }}>
                    {section.title}
                </h2>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-light)',
                    lineHeight: '1.7',
                    margin: 0
                }}>
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
                style={{
                    order: isTextLeft ? 2 : 1,
                    width: '100%',
                    height: '460px',
                    overflow: 'hidden',
                    borderRadius: '24px',
                    position: 'relative'
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
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

// ─── TESTIMONIALS SECTION (full-width) ───────────────────────────────────────
const TestimonialsSection = ({ section }) => {
    return (
        <section style={{
            width: '100%',
            padding: '80px 6%',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                    color: 'var(--primary-green)',
                    marginBottom: '15px'
                }}>
                    {section.title}
                </h2>
                <p style={{
                    color: 'var(--text-light)',
                    fontSize: '1.1rem',
                    maxWidth: '600px',
                    margin: '0 auto 50px auto'
                }}>
                    {section.subtitle}
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
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

// ─── Responsive CSS (injected once) ──────────────────────────────────────────
if (!document.getElementById('dynamic-sections-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'dynamic-sections-styles';
    styleSheet.textContent = `
        @media (max-width: 900px) {
            .dynamic-section {
                grid-template-columns: 1fr !important;
                padding: 50px 5% !important;
                gap: 30px !important;
            }
            .dynamic-section > div {
                order: 0 !important;
                padding: 0 !important;
                height: 300px !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default DynamicSections;