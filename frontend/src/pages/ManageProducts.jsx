import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaFilter, FaCapsules, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../utils/adminService';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formStep, setFormStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const initialFormState = {
        id: '',
        productName: '',
        description: '',
        brand: 'AyurKisan',
        price: 0,
        discount: 0,
        stockQuantity: 0,
        productImage1: '',
        productImage2: '',
        productImage3: '',
        categoryId: '',
        piecesPerBox: 1,
        customerDiscount: 0,
        retailerDiscount: 0,
        discountEnabled: true,
        ingredients: '',
        usageInstructions: '',
        dosage: '',
        sideEffects: 'None known when taken as directed.',
        expiryDate: '',
        manufacturingDate: '',
        weight: '',
        isPrescriptionRequired: false
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                adminService.getProducts(),
                adminService.getCategories()
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) {
            toast.error("Failed to fetch product data");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({ ...initialFormState, id: '' });
        }
        setFormStep(1);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Manual validation for backend @NotBlank / @NotNull to prevent silent HTML5 block on hidden steps
        const requiredFields = {
            id: "Product ID",
            productName: "Product Name",
            categoryId: "Category",
            brand: "Brand Name",
            description: "Description",
            productImage1: "Product Image 1 URL",
            price: "Base Price",
            stockQuantity: "Stock Quantity"
        };

        for (const [key, label] of Object.entries(requiredFields)) {
            if (!formData[key] || formData[key] === '' || formData[key] === 0) {
                toast.error(`${label} is required! (Check previous steps)`);
                return;
            }
        }
        try {
            // Recalculate finalPrice
            const payload = { ...formData, finalPrice: formData.price - (formData.price * (formData.discount / 100)) };

            if (!payload.expiryDate) delete payload.expiryDate;
            if (!payload.manufacturingDate) delete payload.manufacturingDate;

            if (editingProduct) {
                // Corrected: Backend update now uses id
                await adminService.updateProduct(formData.id, payload);
                toast.success("Product updated successfully");
            } else {
                await adminService.addProduct(payload);
                toast.success("Product added to inventory");
            }
            fetchData();
            setShowModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Process failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product from inventory?")) {
            try {
                await adminService.deleteProduct(id);
                toast.success("Product removed");
                fetchData();
            } catch (err) {
                toast.error("Failed to delete product");
            }
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || p.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Synchronizing Inventory...</div>;

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}
            >
                <div>
                    <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaCapsules style={{ color: 'var(--primary-green)' }} /> Product Management
                    </h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Management of individual products and items.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                    style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FaPlus /> Add New Product
                </button>
            </motion.div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Search product name, brand or SKU..."
                        style={{ ...inputStyle, paddingLeft: '3rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <FaFilter style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            ...inputStyle,
                            paddingLeft: '3rem',
                            width: '240px',
                            cursor: 'pointer',
                            appearance: 'none',
                            backgroundColor: '#fff'
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                        ))}
                    </select>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6', overflow: 'hidden' }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: 'var(--text-dark)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Item Details</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Category</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Pricing</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Inventory</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((prod) => (
                                <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f3f4f6', backgroundImage: `url(${prod.productImage1})`, backgroundSize: 'cover' }}></div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{prod.productName}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: '600' }}>ID: {prod.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', padding: '4px 10px', backgroundColor: '#ecfdf5', color: '#047857', borderRadius: '8px' }}>
                                            {categories.find(c => c.id === prod.categoryId)?.categoryName || 'Other'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>₹{prod.price}</div>
                                        {prod.discount > 0 && <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '700' }}>-{prod.discount}% Off</div>}
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem' }}>
                                        <div style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            backgroundColor: prod.stockQuantity < 10 ? '#fee2e2' : '#dcfce7',
                                            color: prod.stockQuantity < 10 ? '#ef4444' : '#16a34a',
                                            fontSize: '0.8rem',
                                            fontWeight: '800',
                                            display: 'inline-block'
                                        }}>
                                            {prod.stockQuantity} in Stock
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => handleOpenModal(prod)} style={{ background: '#f3f4f6', border: 'none', color: '#4b5563', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><FaEdit /></button>
                                            <button onClick={() => handleDelete(prod.id)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Product Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '2.5rem', width: '95%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        {[1, 2, 3].map(s => (
                                            <div key={s} style={{ width: '30px', height: '4px', borderRadius: '2px', backgroundColor: formStep >= s ? 'var(--primary-green)' : '#f3f4f6' }}></div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FaTimes /></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {formStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <h3 style={stepHeaderStyle}>Step 1: Basic Information</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={labelStyle}>Product ID / SKU</label>
                                                <input type="text" required style={inputStyle} value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="e.g., prod-12345" readOnly={!!editingProduct} />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={labelStyle}>Product Name</label>
                                                <input type="text" required style={inputStyle} value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} placeholder="e.g., Brahmi Saraswati Kalpa" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Category</label>
                                                <select required style={inputStyle} value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                                                    <option value="">Select Category...</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Brand Name</label>
                                                <input type="text" required style={inputStyle} value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={labelStyle}>Description</label>
                                                <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={labelStyle}>Product Image 1 URL (Main)</label>
                                                <input type="url" required style={inputStyle} value={formData.productImage1} onChange={(e) => setFormData({ ...formData, productImage1: e.target.value })} placeholder="https://..." />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Product Image 2 URL</label>
                                                <input type="url" style={inputStyle} value={formData.productImage2} onChange={(e) => setFormData({ ...formData, productImage2: e.target.value })} placeholder="https://..." />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Product Image 3 URL</label>
                                                <input type="url" style={inputStyle} value={formData.productImage3} onChange={(e) => setFormData({ ...formData, productImage3: e.target.value })} placeholder="https://..." />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {formStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <h3 style={stepHeaderStyle}>Step 2: Pricing & Inventory</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                            <div>
                                                <label style={labelStyle}>Base Price (₹)</label>
                                                <input type="number" required style={inputStyle} value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Discount (%)</label>
                                                <input type="number" style={inputStyle} value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Customer Discount (%)</label>
                                                <input type="number" style={inputStyle} value={formData.customerDiscount} onChange={(e) => setFormData({ ...formData, customerDiscount: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Retailer Discount (%)</label>
                                                <input type="number" style={inputStyle} value={formData.retailerDiscount} onChange={(e) => setFormData({ ...formData, retailerDiscount: parseFloat(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Final Price (₹)</label>
                                                <input type="number" readOnly style={{ ...inputStyle, backgroundColor: '#f9fafb' }} value={formData.price - (formData.price * (formData.discount / 100))} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Stock Quantity</label>
                                                <input type="number" required style={inputStyle} value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Pieces Per Box</label>
                                                <input type="number" style={inputStyle} value={formData.piecesPerBox} onChange={(e) => setFormData({ ...formData, piecesPerBox: parseInt(e.target.value) })} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {formStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <h3 style={stepHeaderStyle}>Step 3: Additional Details</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div>
                                                <label style={labelStyle}>Ingredients</label>
                                                <textarea rows={2} style={{ ...inputStyle, resize: 'none' }} value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Standard Dosage</label>
                                                <textarea rows={2} style={{ ...inputStyle, resize: 'none' }} value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Usage Instructions</label>
                                                <textarea rows={2} style={{ ...inputStyle, resize: 'none' }} value={formData.usageInstructions} onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Side Effects</label>
                                                <textarea rows={2} style={{ ...inputStyle, resize: 'none' }} value={formData.sideEffects} onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Weight</label>
                                                <input type="text" style={inputStyle} value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g., 200g" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Manufacturing Date</label>
                                                <input type="date" style={inputStyle} value={formData.manufacturingDate} onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Expiry Date</label>
                                                <input type="date" style={inputStyle} value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <input type="checkbox" id="presc" checked={formData.isPrescriptionRequired} onChange={(e) => setFormData({ ...formData, isPrescriptionRequired: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-green)' }} />
                                                    <label htmlFor="presc" style={{ fontSize: '0.9rem', fontWeight: '700' }}>Requires Prescription</label>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <input type="checkbox" id="discEn" checked={formData.discountEnabled} onChange={(e) => setFormData({ ...formData, discountEnabled: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-green)' }} />
                                                    <label htmlFor="discEn" style={{ fontSize: '0.9rem', fontWeight: '700' }}>Active Discount</label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                                    {formStep > 1 ? (
                                        <button key="prev-btn" type="button" onClick={() => setFormStep(formStep - 1)} style={{ ...navBtnStyle, backgroundColor: '#f3f4f6', color: 'var(--text-dark)' }}>
                                            <FaChevronLeft /> Back
                                        </button>
                                    ) : <div />}

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {formStep < 3 ? (
                                            <button
                                                key="next-btn"
                                                type="button"
                                                onClick={() => setFormStep(formStep + 1)}
                                                style={{ ...navBtnStyle, backgroundColor: 'var(--primary-green)', color: '#fff' }}
                                            >
                                                Next Step <FaChevronRight />
                                            </button>
                                        ) : (
                                            <button
                                                key="submit-btn"
                                                type="submit"
                                                style={{ ...navBtnStyle, backgroundColor: '#059669', color: '#fff', width: '200px' }}
                                            >
                                                Save Product
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '0.9rem 1.25rem', borderRadius: '14px', border: '2px solid #f3f4f6', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s', focus: { borderColor: 'var(--primary-green)' } };
const stepHeaderStyle = { fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '1.5rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' };
const navBtnStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 1.5rem', borderRadius: '14px', border: 'none', fontWeight: '800', cursor: 'pointer', transition: 'transform 0.2s' };

export default ManageProducts;
