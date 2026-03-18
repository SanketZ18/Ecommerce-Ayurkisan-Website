import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaPlus, FaTrash, FaEdit, FaTimes, FaStar, FaCheck, FaBoxOpen, FaTag, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API = 'http://localhost:9090';

// ========== MAIN COMPONENT ==========
const ManageHomepage = () => {
    const [activeTab, setActiveTab] = useState('bestsellers');
    const [allProducts, setAllProducts] = useState([]);

    // Section data from backend
    const [bestSellersSection, setBestSellersSection] = useState(null);
    const [offersSection, setOffersSection] = useState(null);
    const [testimonialsSection, setTestimonialsSection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`${API}/products/all`),
            axios.get(`${API}/api/homepage/sections`)
        ]).then(([prodRes, secRes]) => {
            if (Array.isArray(prodRes.data)) setAllProducts(prodRes.data);

            const sections = secRes.data || [];
            const bs = sections.find(s => s.type === 'bestsellers');
            const off = sections.find(s => s.type === 'special_offers');
            const test = sections.find(s => s.type === 'testimonials');

            setBestSellersSection(bs || {
                type: 'bestsellers',
                title: 'Best Selling Products',
                productIds: []
            });
            setOffersSection(off || {
                type: 'special_offers',
                title: 'Special Summer Offers! 🌿',
                subtitle: 'Get up to 30% off on all organic skin care products this season.',
                imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000',
                ctaText: 'Shop Offers',
                ctaLink: '/shop',
                alignment: 'left'
            });
            setTestimonialsSection(test || {
                type: 'testimonials',
                title: 'What Our Customers Say',
                subtitle: 'Real feedback from people who have experienced the magic of our herbal formulas.',
                items: [
                    { id: 't1', name: 'Anjali Sharma', rating: 5, comment: 'The Neem face wash completely cleared my skin in two weeks. Highly recommended!' },
                    { id: 't2', name: 'Rahul Verma', rating: 5, comment: 'I have tried many herbal brands, but Mahakissan is by far the most authentic. The Tulsi drops are excellent.' },
                    { id: 't3', name: 'Priya Desai', rating: 4, comment: 'Great quality products. Delivery was a bit slow, but totally worth the wait.' }
                ]
            });
        }).catch(err => {
            console.error(err);
            toast.error('Failed to load homepage data');
        }).finally(() => setLoading(false));
    }, []);

    const saveSection = async (section, setter) => {
        try {
            let res;
            if (section.id) {
                res = await axios.put(`${API}/api/homepage/sections/${section.id}`, section);
            } else {
                res = await axios.post(`${API}/api/homepage/sections`, section);
            }
            setter(res.data);
            toast.success('Section saved successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save section');
        }
    };

    const tabs = [
        { key: 'bestsellers', label: 'Best Selling Products', icon: <FaBoxOpen /> },
        { key: 'special_offers', label: 'Special Offers', icon: <FaTag /> },
        { key: 'testimonials', label: 'Customer Reviews', icon: <FaComments /> }
    ];

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--primary-green)', fontSize: '1.2rem' }}>
            Loading homepage configuration...
        </div>
    );

    return (
        <div style={{ padding: '2rem 4%', maxWidth: '1200px' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary-green)', margin: 0, fontSize: '2rem' }}>Manage Homepage Sections</h1>
                <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                    Control what appears in the Best Sellers, Special Offers and Customer Reviews sections on the home page.
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '0.75rem 1.5rem',
                            border: 'none', background: 'none', cursor: 'pointer',
                            fontWeight: activeTab === tab.key ? '700' : '500',
                            color: activeTab === tab.key ? 'var(--primary-green)' : 'var(--text-light)',
                            borderBottom: activeTab === tab.key ? '3px solid var(--primary-green)' : '3px solid transparent',
                            fontSize: '0.95rem', transition: 'all 0.2s',
                            marginBottom: '-2px'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'bestsellers' && bestSellersSection && (
                    <motion.div key="bestsellers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <BestSellersTab
                            section={bestSellersSection}
                            setSection={setBestSellersSection}
                            allProducts={allProducts}
                            onSave={() => saveSection(bestSellersSection, setBestSellersSection)}
                        />
                    </motion.div>
                )}
                {activeTab === 'special_offers' && offersSection && (
                    <motion.div key="offers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <SpecialOffersTab
                            section={offersSection}
                            setSection={setOffersSection}
                            onSave={() => saveSection(offersSection, setOffersSection)}
                        />
                    </motion.div>
                )}
                {activeTab === 'testimonials' && testimonialsSection && (
                    <motion.div key="testimonials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <TestimonialsTab
                            section={testimonialsSection}
                            setSection={setTestimonialsSection}
                            onSave={() => saveSection(testimonialsSection, setTestimonialsSection)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ========== BEST SELLERS TAB ==========
const BestSellersTab = ({ section, setSection, allProducts, onSave }) => {
    // Auto-clean: Remove invalid product IDs from the list if they no longer exist in allProducts
    React.useEffect(() => {
        if (section.productIds && allProducts.length > 0) {
            const currentIds = section.productIds || [];
            const validIds = currentIds.filter(id => allProducts.some(p => p.id === id));
            if (validIds.length !== currentIds.length) {
                setSection({ ...section, productIds: validIds });
            }
        }
    }, [allProducts, section.productIds]);

    const selectedIds = (section.productIds || []).filter(id => allProducts.some(p => p.id === id));

    const toggleProduct = (productId) => {
        const isSelected = selectedIds.includes(productId);
        
        if (isSelected) {
            const newIds = selectedIds.filter(id => id !== productId);
            setSection({ ...section, productIds: newIds });
        } else {
            if (selectedIds.length >= 8) {
                toast.warn('You can select a maximum of 8 best selling products.');
                return;
            }
            setSection({ ...section, productIds: [...selectedIds, productId] });
        }
    };

    const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));
    const unselectedProducts = allProducts.filter(p => !selectedIds.includes(p.id));

    return (
        <div>
            <div style={cardBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={sectionHead}>Best Selling Products</h2>
                        <p style={{ color: 'var(--text-light)', margin: 0 }}>
                            Select which products to feature in the "Best Selling Products" section. Max 8.
                        </p>
                    </div>
                    <button className="btn-primary" onClick={onSave} style={saveBtn}>
                        <FaSave /> Save Changes
                    </button>
                </div>

                {/* Section Title Edit */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelSt}>Section Title</label>
                    <input
                        type="text"
                        style={inputSt}
                        value={section.title || ''}
                        onChange={e => setSection({ ...section, title: e.target.value })}
                        placeholder="Best Selling Products"
                    />
                </div>

                {/* Selected Products */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-green)', marginBottom: '1rem' }}>
                        ✅ Featured Products ({selectedIds.length}/8)
                    </h3>
                    {selectedProducts.length === 0 ? (
                        <div style={emptyBox}>No products selected. Pick from the list below.</div>
                    ) : (
                        <div style={productGrid}>
                            {selectedProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    selected={true}
                                    onToggle={() => toggleProduct(product.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* All Products to pick from */}
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                        📦 All Products — click to add/remove
                    </h3>
                    <div style={productGrid}>
                        {allProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                selected={selectedIds.includes(product.id)}
                                onToggle={() => toggleProduct(product.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product, selected, onToggle }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        style={{
            border: selected ? '2px solid var(--primary-green)' : '2px solid #e5e7eb',
            borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
            background: selected ? '#f0fdf4' : '#fff',
            position: 'relative', transition: 'all 0.2s'
        }}
    >
        {selected && (
            <div style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'var(--primary-green)', color: '#fff',
                borderRadius: '50%', width: '24px', height: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', zIndex: 2
            }}>
                <FaCheck />
            </div>
        )}
        <div style={{ background: '#f9fafb', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
                src={product.productImage1 || 'https://via.placeholder.com/150'}
                alt={product.productName}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
        </div>
        <div style={{ padding: '10px' }}>
            <p style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)', margin: '0 0 4px' }}>
                {product.productName}
            </p>
            <p style={{ color: 'var(--primary-green)', fontWeight: '700', margin: 0, fontSize: '0.9rem' }}>
                ₹{product.finalPrice}
            </p>
        </div>
    </motion.div>
);

// ========== SPECIAL OFFERS TAB ==========
const SpecialOffersTab = ({ section, setSection, onSave }) => {
    const update = (field, value) => setSection({ ...section, [field]: value });

    return (
        <div style={cardBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={sectionHead}>Special Offers Section</h2>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>
                        Edit the promotional banner that appears on the home page.
                    </p>
                </div>
                <button className="btn-primary" onClick={onSave} style={saveBtn}>
                    <FaSave /> Save Changes
                </button>
            </div>

            <div style={formGrid}>
                <div>
                    <label style={labelSt}>Section Title</label>
                    <input type="text" style={inputSt} value={section.title || ''} onChange={e => update('title', e.target.value)} placeholder="Special Summer Offers! 🌿" />
                </div>
                <div>
                    <label style={labelSt}>Alignment</label>
                    <select style={inputSt} value={section.alignment || 'left'} onChange={e => update('alignment', e.target.value)}>
                        <option value="left">Text Left, Image Right</option>
                        <option value="right">Text Right, Image Left</option>
                    </select>
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                    <label style={labelSt}>Subtitle / Description</label>
                    <textarea style={{ ...inputSt, minHeight: '90px', resize: 'vertical' }} value={section.subtitle || ''} onChange={e => update('subtitle', e.target.value)} placeholder="Describe the offer..." />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                    <label style={labelSt}>Image URL</label>
                    <input type="text" style={inputSt} value={section.imageUrl || ''} onChange={e => update('imageUrl', e.target.value)} placeholder="https://example.com/image.jpg" />
                    {section.imageUrl && (
                        <div style={{ marginTop: '0.75rem', borderRadius: '12px', overflow: 'hidden', maxHeight: '200px' }}>
                            <img src={section.imageUrl} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                        </div>
                    )}
                </div>
                <div>
                    <label style={labelSt}>Button Text</label>
                    <input type="text" style={inputSt} value={section.ctaText || ''} onChange={e => update('ctaText', e.target.value)} placeholder="Shop Offers" />
                </div>
                <div>
                    <label style={labelSt}>Button Link</label>
                    <input type="text" style={inputSt} value={section.ctaLink || ''} onChange={e => update('ctaLink', e.target.value)} placeholder="/shop" />
                </div>
            </div>

            {/* Live Preview */}
            <div style={{ marginTop: '2rem', border: '1px dashed #d1d5db', borderRadius: '12px', padding: '1.5rem', background: '#fdf8e9' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: 0, marginBottom: '0.5rem' }}>📌 Preview</p>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', margin: '0 0 0.5rem' }}>{section.title || 'Section Title'}</h2>
                <p style={{ color: 'var(--text-light)', margin: '0 0 1rem' }}>{section.subtitle || 'Section subtitle...'}</p>
                {section.ctaText && (
                    <button style={{ padding: '10px 24px', background: 'var(--primary-green)', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'default' }}>
                        {section.ctaText}
                    </button>
                )}
            </div>
        </div>
    );
};

// ========== TESTIMONIALS TAB ==========
const TestimonialsTab = ({ section, setSection, onSave }) => {
    const [editingItem, setEditingItem] = useState(null); // null = not editing, or testimonial object
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', rating: 5, comment: '' });

    const items = section.items || [];

    const update = (field, value) => setSection({ ...section, [field]: value });

    const handleAddReview = () => {
        if (!newItem.name.trim() || !newItem.comment.trim()) {
            toast.warn('Please fill in all fields.');
            return;
        }
        const item = { ...newItem, id: 't' + Date.now() };
        setSection({ ...section, items: [...items, item] });
        setNewItem({ name: '', rating: 5, comment: '' });
        setIsAdding(false);
        toast.info('Review added. Click "Save Changes" to persist.');
    };

    const handleDeleteReview = (id) => {
        setSection({ ...section, items: items.filter(i => i.id !== id) });
        toast.info('Review removed. Click "Save Changes" to persist.');
    };

    const handleSaveEdit = () => {
        const updated = items.map(i => i.id === editingItem.id ? editingItem : i);
        setSection({ ...section, items: updated });
        setEditingItem(null);
        toast.info('Review updated. Click "Save Changes" to persist.');
    };

    return (
        <div style={cardBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={sectionHead}>Customer Reviews</h2>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>
                        Manage the testimonials shown in "What Our Customers Say" section.
                    </p>
                </div>
                <button className="btn-primary" onClick={onSave} style={saveBtn}>
                    <FaSave /> Save Changes
                </button>
            </div>

            {/* Section title / subtitle edit */}
            <div style={{ ...formGrid, marginBottom: '1.5rem' }}>
                <div>
                    <label style={labelSt}>Section Title</label>
                    <input type="text" style={inputSt} value={section.title || ''} onChange={e => update('title', e.target.value)} />
                </div>
                <div>
                    <label style={labelSt}>Section Subtitle</label>
                    <input type="text" style={inputSt} value={section.subtitle || ''} onChange={e => update('subtitle', e.target.value)} />
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1.5rem 0' }} />

            {/* Add Review Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                    Customer Reviews ({items.length})
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: isAdding ? '#f3f4f6' : 'var(--primary-green)', color: isAdding ? 'var(--text-dark)' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                >
                    {isAdding ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Review</>}
                </button>
            </div>

            {/* Add Review Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
                    >
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 1rem', color: 'var(--primary-green)' }}>Add New Customer Review</h4>
                            <div style={formGrid}>
                                <div>
                                    <label style={labelSt}>Customer Name</label>
                                    <input type="text" style={inputSt} value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Anjali Sharma" />
                                </div>
                                <div>
                                    <label style={labelSt}>Rating (1–5)</label>
                                    <StarSelector rating={newItem.rating} onChange={r => setNewItem({ ...newItem, rating: r })} />
                                </div>
                                <div style={{ gridColumn: '1 / span 2' }}>
                                    <label style={labelSt}>Review Comment</label>
                                    <textarea style={{ ...inputSt, minHeight: '80px', resize: 'vertical' }} value={newItem.comment} onChange={e => setNewItem({ ...newItem, comment: e.target.value })} placeholder="Enter customer review..." />
                                </div>
                            </div>
                            <button onClick={handleAddReview} style={{ ...saveBtn, marginTop: '1rem' }} className="btn-primary">
                                <FaPlus /> Add Review
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Review List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.length === 0 && (
                    <div style={emptyBox}>No customer reviews yet. Add one above.</div>
                )}
                {items.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', background: '#fff' }}
                    >
                        {editingItem && editingItem.id === item.id ? (
                            // Edit Mode
                            <div>
                                <div style={formGrid}>
                                    <div>
                                        <label style={labelSt}>Customer Name</label>
                                        <input type="text" style={inputSt} value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={labelSt}>Rating</label>
                                        <StarSelector rating={editingItem.rating} onChange={r => setEditingItem({ ...editingItem, rating: r })} />
                                    </div>
                                    <div style={{ gridColumn: '1 / span 2' }}>
                                        <label style={labelSt}>Comment</label>
                                        <textarea style={{ ...inputSt, minHeight: '80px', resize: 'vertical' }} value={editingItem.comment} onChange={e => setEditingItem({ ...editingItem, comment: e.target.value })} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button onClick={handleSaveEdit} className="btn-primary" style={saveBtn}><FaCheck /> Update</button>
                                    <button onClick={() => setEditingItem(null)} style={{ ...saveBtn, background: '#f3f4f6', color: 'var(--text-dark)', border: '1px solid #e5e7eb' }}><FaTimes /> Cancel</button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '700', color: 'var(--primary-green)' }}>{item.name}</span>
                                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={12} style={{ opacity: i < item.rating ? 1 : 0.2 }} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-light)', margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                                        "{item.comment}"
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button
                                        onClick={() => setEditingItem({ ...item })}
                                        style={{ padding: '6px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', color: 'var(--primary-green)' }}
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(item.id)}
                                        style={{ padding: '6px 12px', background: 'none', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Star Rating Selector
const StarSelector = ({ rating, onChange }) => (
    <div style={{ display: 'flex', gap: '6px', padding: '0.6rem 0' }}>
        {[1, 2, 3, 4, 5].map(star => (
            <FaStar
                key={star}
                size={22}
                onClick={() => onChange(star)}
                style={{ cursor: 'pointer', color: star <= rating ? '#fbbf24' : '#d1d5db', transition: 'color 0.15s' }}
            />
        ))}
        <span style={{ marginLeft: '8px', color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '22px' }}>{rating}/5</span>
    </div>
);

// ===== Shared Styles =====
const cardBox = {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
    padding: '2rem'
};

const sectionHead = {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    margin: '0 0 0.25rem'
};

const saveBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 22px',
    fontWeight: '600',
    fontSize: '0.95rem',
    borderRadius: '10px',
    cursor: 'pointer',
    border: 'none'
};

const labelSt = {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: '600',
    fontSize: '0.85rem',
    color: 'var(--text-dark)'
};

const inputSt = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none'
};

const formGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem'
};

const productGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
};

const emptyBox = {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-light)',
    background: '#f9fafb',
    borderRadius: '12px',
    border: '1px dashed #e5e7eb'
};

export default ManageHomepage;
