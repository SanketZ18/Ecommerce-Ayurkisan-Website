import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaTag, FaPercentage, FaMoneyBillWave, FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API_BASE_URL from '../utils/apiConfig';

const API = `${API_BASE_URL}/api/offers`;

const ManageOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        expiryDate: '',
        active: true
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await axios.get(API);
            setOffers(res.data);
        } catch (err) {
            toast.error('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOffer) {
                await axios.put(`${API}/${editingOffer.id}`, formData);
                toast.success('Offer updated successfully');
            } else {
                await axios.post(API, formData);
                toast.success('Offer created successfully');
            }
            setShowModal(false);
            setEditingOffer(null);
            resetForm();
            fetchOffers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save offer');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                await axios.delete(`${API}/${id}`);
                toast.success('Offer deleted');
                fetchOffers();
            } catch (err) {
                toast.error('Failed to delete offer');
            }
        }
    };

    const openEditModal = (offer) => {
        setEditingOffer(offer);
        setFormData({
            ...offer,
            expiryDate: offer.expiryDate ? new Date(offer.expiryDate).toISOString().split('T')[0] : ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'PERCENTAGE',
            discountValue: '',
            minOrderAmount: '',
            expiryDate: '',
            active: true
        });
    };

    if (loading) return <div style={loaderStyle}>Loading offers...</div>;

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Manage Special Offers</h1>
                    <p style={subtitleStyle}>Create and manage promo codes for your customers</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { resetForm(); setEditingOffer(null); setShowModal(true); }}
                    style={addBtnStyle}
                >
                    <FaPlus /> Create New Offer
                </motion.button>
            </div>

            <div style={gridStyle}>
                {offers.map((offer) => (
                    <motion.div 
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={cardStyle}
                    >
                        <div style={cardHeaderStyle}>
                            <div style={codeBadgeStyle}>{offer.code}</div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => openEditModal(offer)} style={iconBtnStyle} title="Edit"><FaEdit /></button>
                                <button onClick={() => handleDelete(offer.id)} style={{ ...iconBtnStyle, color: '#ef4444' }} title="Delete"><FaTrash /></button>
                            </div>
                        </div>
                        <h3 style={offerTitleStyle}>{offer.description}</h3>
                        <div style={offerDetailsStyle}>
                            <div style={detailItemStyle}>
                                {offer.discountType === 'PERCENTAGE' ? <FaPercentage color="#10b981" /> : <FaMoneyBillWave color="#8b5cf6" />}
                                <span>{offer.discountValue}{offer.discountType === 'PERCENTAGE' ? '%' : ' OFF'}</span>
                            </div>
                            <div style={detailItemStyle}>
                                <FaCalendarAlt color="#6b7280" />
                                <span>Min: ₹{offer.minOrderAmount || 0}</span>
                            </div>
                            {offer.expiryDate && (
                                <div style={detailItemStyle}>
                                    <FaCalendarCheck color="#ef4444" />
                                    <span>Expires: {new Date(offer.expiryDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                        <div style={{ ...statusBadgeStyle, background: offer.active ? '#dcfce7' : '#fee2e2', color: offer.active ? '#166534' : '#991b1b' }}>
                            {offer.active ? 'Active' : 'Inactive'}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlayStyle}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={modalContentStyle}
                        >
                            <div style={modalHeaderStyle}>
                                <h2>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h2>
                                <button onClick={() => setShowModal(false)} style={closeBtnStyle}><FaTimes /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={formStyle}>
                                <div style={formGroupStyle}>
                                    <label>Promo Code</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. SUMMER20" 
                                        required 
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div style={formGroupStyle}>
                                    <label>Description</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 20% off on all products" 
                                        required 
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div style={rowStyle}>
                                    <div style={formGroupStyle}>
                                        <label>Discount Type</label>
                                        <select 
                                            value={formData.discountType}
                                            onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                        >
                                            <option value="PERCENTAGE">Percentage (%)</option>
                                            <option value="FIXED">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label>Discount Value</label>
                                        <input 
                                            type="number" 
                                            required 
                                            value={formData.discountValue}
                                            onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={rowStyle}>
                                    <div style={formGroupStyle}>
                                        <label>Min Order Amount (₹)</label>
                                        <input 
                                            type="number" 
                                            value={formData.minOrderAmount}
                                            onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                        />
                                    </div>
                                    <div style={formGroupStyle}>
                                        <label>Expiry Date</label>
                                        <input 
                                            type="date" 
                                            value={formData.expiryDate}
                                            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <input 
                                        type="checkbox" 
                                        id="active"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                    <label htmlFor="active" style={{ cursor: 'pointer' }}>Active</label>
                                </div>
                                <button type="submit" style={submitBtnStyle}>
                                    <FaSave /> {editingOffer ? 'Update Offer' : 'Create Offer'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Styles
const containerStyle = { padding: '2rem 4%', maxWidth: '1200px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' };
const titleStyle = { color: 'var(--primary-green)', margin: 0, fontSize: '2.2rem', fontWeight: '800' };
const subtitleStyle = { color: '#6b7280', marginTop: '0.5rem', fontSize: '1.1rem' };
const addBtnStyle = { 
    background: 'var(--primary-green)', color: '#fff', border: 'none', 
    padding: '0.8rem 1.5rem', borderRadius: '12px', cursor: 'pointer', 
    fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 15px rgba(5, 150, 69, 0.3)'
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' };
const cardStyle = { 
    background: '#fff', padding: '1.5rem', borderRadius: '20px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6',
    position: 'relative', overflow: 'hidden'
};

const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' };
const codeBadgeStyle = { 
    background: '#f0fdf4', color: 'var(--primary-green)', padding: '0.4rem 0.8rem', 
    borderRadius: '8px', fontWeight: '800', border: '1px dashed var(--primary-green)',
    letterSpacing: '1px'
};

const iconBtnStyle = { 
    background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', 
    fontSize: '1.2rem', padding: '5px', transition: 'color 0.2s' 
};

const offerTitleStyle = { fontSize: '1.25rem', color: '#1f2937', marginBottom: '1rem', fontWeight: '700' };
const offerDetailsStyle = { display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' };
const detailItemStyle = { display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563', fontSize: '0.95rem' };
const statusBadgeStyle = { 
    display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '20px', 
    fontSize: '0.85rem', fontWeight: '600' 
};

const modalOverlayStyle = { 
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
    backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', zIndex: 1000 
};

const modalContentStyle = { 
    background: '#fff', padding: '2.5rem', borderRadius: '24px', 
    width: '100%', maxWidth: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
};

const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 };
const rowStyle = { display: 'flex', gap: '1rem' };

const inputStyles = `
    input, select {
        padding: 0.8rem 1rem;
        border: 1.5px solid #e5e7eb;
        borderRadius: 12px;
        fontSize: 1rem;
        transition: border-color 0.2s;
        outline: none;
    }
    input:focus, select:focus {
        border-color: var(--primary-green);
    }
    label {
        font-weight: 600;
        font-size: 0.9rem;
        color: #374151;
    }
`;

const submitBtnStyle = { 
    background: 'var(--primary-green)', color: '#fff', border: 'none', 
    padding: '1rem', borderRadius: '12px', cursor: 'pointer', 
    fontWeight: '700', fontSize: '1.1rem', marginTop: '1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
};

const loaderStyle = { padding: '4rem', textAlign: 'center', color: 'var(--primary-green)', fontSize: '1.2rem' };

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = inputStyles;
document.head.appendChild(styleSheet);

export default ManageOffers;
