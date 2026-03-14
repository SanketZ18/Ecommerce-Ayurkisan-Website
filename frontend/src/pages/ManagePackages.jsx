import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBox, FaMinus, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../utils/adminService';

const ManagePackages = () => {
    const [packages, setPackages] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        items: [],
        packagePrice: 0,
        totalPrice: 0,
        imageURL: '',
        active: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pkgRes, prodRes] = await Promise.all([
                adminService.getPackages(),
                adminService.getProducts()
            ]);
            setPackages(pkgRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (pkg = null) => {
        if (pkg) {
            setEditingPackage(pkg);
            setFormData({
                id: pkg.id,
                name: pkg.name,
                items: pkg.items || [],
                packagePrice: pkg.packagePrice,
                totalPrice: pkg.totalPrice,
                imageURL: pkg.imageURL || '',
                active: pkg.active
            });
        } else {
            setEditingPackage(null);
            setFormData({
                id: `pkg-${Date.now()}`,
                name: '',
                items: [],
                packagePrice: 0,
                totalPrice: 0,
                imageURL: '',
                active: true
            });
        }
        setShowModal(true);
    };

    const calculatePrices = (itemsList) => {
        let totalOriginal = 0;
        itemsList.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                totalOriginal += (product.price * item.quantity);
            }
        });
        const discountedPrice = Math.round(totalOriginal * 0.90); // 10% discount
        return {
            totalPrice: totalOriginal,
            packagePrice: discountedPrice
        };
    };

    const handleAddItem = (productId) => {
        if (!productId) return;
        const product = products.find(p => p.id === productId);
        if (formData.items.some(item => item.productId === productId)) {
            toast.warn("Product already in package");
            return;
        }
        const newItems = [...formData.items, { productId, quantity: 1, productName: product.productName }];
        const newPrices = calculatePrices(newItems);
        setFormData({
            ...formData,
            items: newItems,
            ...newPrices
        });
    };

    const handleRemoveItem = (productId) => {
        const newItems = formData.items.filter(item => item.productId !== productId);
        const newPrices = calculatePrices(newItems);
        setFormData({
            ...formData,
            items: newItems,
            ...newPrices
        });
    };

    const handleQuantityChange = (productId, qty) => {
        const newItems = formData.items.map(item => item.productId === productId ? { ...item, quantity: Math.max(1, qty) } : item);
        const newPrices = calculatePrices(newItems);
        setFormData({
            ...formData,
            items: newItems,
            ...newPrices
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.items.length === 0) return toast.error("Please add at least one product to the package");

        try {
            if (editingPackage) {
                await adminService.updatePackage(editingPackage.id, formData);
                toast.success("Package updated successfully");
            } else {
                await adminService.addPackage(formData);
                toast.success("Package created successfully");
            }
            fetchData();
            setShowModal(false);
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (pkg) => {
        if (window.confirm(`Delete package "${pkg.name}"?`)) {
            try {
                await adminService.deletePackage(pkg.id);
                toast.success("Package deleted");
                fetchData();
            } catch (err) {
                toast.error("Failed to delete package");
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Packages...</div>;

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}
            >
                <div>
                    <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaBox style={{ color: 'var(--primary-green)' }} /> Package Management
                    </h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Create and edit curated wellness packages.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                    style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FaPlus /> Create New Package
                </button>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {packages.map((pkg) => (
                    <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, boxShadow: '0 12px 20px rgba(0,0,0,0.05)' }}
                        style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.25rem', fontWeight: '800' }}>{pkg.name}</h3>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: pkg.active ? '#059669' : '#dc2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{pkg.active ? 'Available' : 'Retired'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleOpenModal(pkg)} style={{ border: 'none', background: '#f3f4f6', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#4b5563' }}><FaEdit /></button>
                                <button onClick={() => handleDelete(pkg)} style={{ border: 'none', background: '#fee2e2', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#ef4444' }}><FaTrash /></button>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-light)', marginBottom: '8px', textTransform: 'uppercase' }}>Package Content</div>
                            {pkg.items?.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px', color: '#4b5563' }}>
                                    <span>{item.productName || 'Product'}</span>
                                    <span style={{ fontWeight: '700' }}>x{item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{pkg.totalPrice}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-green)' }}>₹{pkg.packagePrice}</div>
                            </div>
                            <div style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '800' }}>
                                Save {Math.round(((pkg.totalPrice - pkg.packagePrice) / pkg.totalPrice) * 100)}%
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Package Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '95%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800', fontSize: '1.75rem' }}>{editingPackage ? 'Edit Package' : 'Build Package'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FaTimes /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={labelStyle}>Package Name</label>
                                        <input type="text" required style={inputStyle} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Morning Vitality Pack" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={labelStyle}>Package Price (₹)</label>
                                            <input type="number" readOnly style={{ ...inputStyle, backgroundColor: '#f9fafb' }} value={formData.packagePrice} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Total Products Price (₹)</label>
                                            <input type="number" readOnly style={{ ...inputStyle, backgroundColor: '#f9fafb' }} value={formData.totalPrice} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Package Image URL</label>
                                        <input type="url" style={inputStyle} value={formData.imageURL} onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1rem' }}>
                                        <input type="checkbox" id="pkgActive" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-green)' }} />
                                        <label htmlFor="pkgActive" style={{ fontWeight: '700', fontSize: '0.95rem' }}>Active for Customers</label>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <label style={labelStyle}>Inventory Inclusion</label>
                                    <select
                                        style={{ ...inputStyle, marginBottom: '1rem' }}
                                        onChange={(e) => handleAddItem(e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>Select product to add...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.productName}</option>
                                        ))}
                                    </select>

                                    <div style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: '20px', padding: '1.25rem', border: '2px dashed #e2e8f0', minHeight: '200px' }}>
                                        {formData.items.length === 0 ? (
                                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#9ca3af', textAlign: 'center' }}>
                                                <FaBox style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.3 }} />
                                                <p style={{ fontSize: '0.85rem' }}>Add items from inventory<br />to build this bundle.</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {formData.items.map((item, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                                                        <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>{item.productName}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                                                                style={{ width: '45px', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'center', fontSize: '0.85rem', padding: '2px' }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveItem(item.productId)}
                                                                style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                            >
                                                                <FaMinus />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
                                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)' }}>
                                        {editingPackage ? 'Finalize Updates' : 'Create Package'}
                                        <FaChevronRight fontSize="0.9rem" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '0.6rem', fontWeight: '700', fontSize: '0.9rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '0.9rem 1.25rem', borderRadius: '14px', border: '2px solid #f3f4f6', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', focus: { borderColor: 'var(--primary-green)' } };

export default ManagePackages;
