import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaLayerGroup, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../utils/adminService';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        categoryName: '',
        description: '',
        active: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await adminService.getCategories();
            setCategories(res.data);
        } catch (err) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                id: category.id,
                categoryName: category.categoryName,
                description: category.description,
                active: category.active
            });
        } else {
            setEditingCategory(null);
            setFormData({
                id: `cat-${Date.now()}`,
                categoryName: '',
                description: '',
                active: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.categoryName, formData);
                toast.success("Category updated successfully");
            } else {
                await adminService.addCategory(formData);
                toast.success("Category added successfully");
            }
            fetchCategories();
            setShowModal(false);
        } catch (err) {
            toast.error(editingCategory ? "Failed to update category" : "Failed to add category");
        }
    };

    const handleDelete = async (name) => {
        if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
            try {
                await adminService.deleteCategory(name);
                toast.success("Category deleted successfully");
                fetchCategories();
            } catch (err) {
                toast.error("Failed to delete category");
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Categories...</div>;
    }

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}
            >
                <div>
                    <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaLayerGroup style={{ color: 'var(--primary-green)' }} /> Category Management
                    </h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Organize and manage your product classifications.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '600' }}
                >
                    <FaPlus /> New Category
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6', overflow: 'hidden' }}
            >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: 'var(--text-dark)' }}>
                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Category Name</th>
                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Description</th>
                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700' }}>Status</th>
                            <th style={{ padding: '1.2rem 1.5rem', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1.2rem 1.5rem', fontWeight: '600', color: 'var(--text-dark)' }}>{cat.categoryName}</td>
                                <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{cat.description}</td>
                                <td style={{ padding: '1.2rem 1.5rem' }}>
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: cat.active ? '#059669' : '#dc2626',
                                        fontSize: '0.85rem',
                                        fontWeight: '700'
                                    }}>
                                        {cat.active ? <FaCheckCircle /> : <FaTimesCircle />}
                                        {cat.active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => handleOpenModal(cat)}
                                            style={{ background: '#f3f4f6', border: 'none', color: '#4b5563', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.categoryName)}
                                            style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Category Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '2.5rem', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800' }}>{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#9ca3af', cursor: 'pointer' }}>
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        style={inputStyle}
                                        value={formData.categoryName}
                                        onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                        placeholder="e.g., Organic Supplements"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        style={{ ...inputStyle, resize: 'none' }}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Briefly describe what this category contains..."
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-green)' }}
                                    />
                                    <label htmlFor="active" style={{ ...labelStyle, marginBottom: 0 }}>Category is Active</label>
                                </div>

                                <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', borderRadius: '12px', marginTop: '1rem', fontWeight: '700' }}>
                                    {editingCategory ? 'Update Category' : 'Add Category'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.6rem',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-dark)'
};

const inputStyle = {
    width: '100%',
    padding: '0.8rem 1.25rem',
    borderRadius: '12px',
    border: '2px solid #f3f4f6',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s',
    '&:focus': {
        borderColor: 'var(--primary-green)'
    }
};

export default ManageCategories;
