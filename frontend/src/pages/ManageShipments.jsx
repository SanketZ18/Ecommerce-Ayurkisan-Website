import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaRegAddressCard, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaEdit, FaTimes, FaSearch, FaFilter, FaCalendarAlt, FaUserFriends, FaStore, FaUndo, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../utils/adminService';

const ManageShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [remarks, setRemarks] = useState('');

    const [activeTab, setActiveTab] = useState('Customer');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllShipments();
            // Sort by Date Descending
            const sorted = (Array.isArray(res.data) ? res.data : []).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setShipments(sorted);
        } catch (err) {
            toast.error("Failed to fetch shipments");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setStatusUpdating(true);
            await adminService.updateShipmentStatus(orderId, newStatus, remarks);
            toast.success(`Shipment status updated to ${newStatus}`);
            fetchShipments();
            setShowModal(false);
        } catch (err) {
            toast.error("Failed to update shipment status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'PLACED': return { bg: '#eff6ff', color: '#1e40af', icon: FaInfoCircle }; // Light Blue
            case 'CONFIRMED': return { bg: '#ecfdf5', color: '#059669', icon: FaCheckCircle }; // Emerald
            case 'SHIPPED': return { bg: '#dbeafe', color: '#1e40af', icon: FaTruck }; // Blue
            case 'OUT_FOR_DELIVERY': return { bg: '#fef3c7', color: '#d97706', icon: FaTruck }; // Amber
            case 'DELIVERED': return { bg: '#dcfce7', color: '#166534', icon: FaCheckCircle }; // Green
            case 'CANCELLED': return { bg: '#fee2e2', color: '#ef4444', icon: FaTimes }; // Red
            case 'RETURN_REQUESTED': return { bg: '#fff7ed', color: '#ea580c', icon: FaUndo }; // Orange
            case 'RETURN_ACCEPTED': return { bg: '#f0fdf4', color: '#16a34a', icon: FaCheckCircle }; // Green
            case 'RETURN_PICKUP': return { bg: '#f5f3ff', color: '#7c3aed', icon: FaTruck }; // Purple
            case 'RETURNED': return { bg: '#f9fafb', color: '#4b5563', icon: FaBoxOpen }; // Gray
            default: return { bg: '#f3f4f6', color: '#374151', icon: FaInfoCircle };
        }
    };

    const filteredShipments = useMemo(() => {
        return shipments.filter(shipment => {
            const matchesTab = shipment.role?.toLowerCase() === activeTab.toLowerCase();
            const matchesSearch = !searchTerm ||
                shipment.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shipment.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || shipment.status === statusFilter;
            const matchesDate = !dateFilter || new Date(shipment.createdAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();

            return matchesTab && matchesSearch && matchesStatus && matchesDate;
        });
    }, [shipments, activeTab, searchTerm, statusFilter, dateFilter]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Shipment Logistics...</div>;

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaTruck style={{ color: 'var(--primary-green)' }} /> Global Logistics
                </h1>
                <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Track and manage real-time shipments across the network.</p>
            </motion.div>

            {/* Tabs & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '14px' }}>
                    {[{ id: 'Customer', icon: FaUserFriends }, { id: 'Retailer', icon: FaStore }].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '8px 24px',
                                borderRadius: '11px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '700',
                                backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                                color: activeTab === tab.id ? 'var(--primary-green)' : '#64748b',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <tab.icon /> {tab.id}s
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search Address or ID..."
                            style={{ ...inputStyle, paddingLeft: '2.5rem', width: '250px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <FaFilter style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.8rem' }} />
                        <select
                            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                             <option value="ALL">All Status</option>
                             <option value="PLACED">Placed</option>
                             <option value="CONFIRMED">Confirmed</option>
                             <option value="SHIPPED">Shipped</option>
                             <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                             <option value="DELIVERED">Delivered</option>
                             <option value="CANCELLED">Cancelled</option>
                             <option value="RETURNED">Returned</option>
                        </select>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <FaCalendarAlt style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="date"
                            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    {(searchTerm || statusFilter !== 'ALL' || dateFilter) && (
                        <button onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setDateFilter(''); }} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}>Reset Clear</button>
                    )}
                </div>
            </div>

            {/* Shipments Table (Horizontal Layout) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6', overflow: 'hidden' }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: 'var(--text-dark)' }}>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Order Ref</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Date Created</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>{activeTab}</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Shipping Address</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Status</th>
                                <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShipments.map((shipment) => {
                                const status = getStatusStyle(shipment.status);
                                return (
                                    <tr key={shipment.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.2rem 1.5rem', fontWeight: '700', color: 'var(--primary-green)' }}>#{shipment.orderId?.toString().slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '1.2rem 1.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1.2rem 1.5rem', fontWeight: '600' }}>{shipment.customerName}</td>
                                        <td style={{ padding: '1.2rem 1.5rem', maxWidth: '300px', fontSize: '0.85rem', color: '#4b5563' }}>{shipment.shippingAddress}</td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                backgroundColor: status.bg,
                                                color: status.color,
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                width: 'fit-content'
                                            }}>
                                                <status.icon /> {shipment.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => { setSelectedShipment(shipment); setRemarks(shipment.remarks || ''); setShowModal(true); }}
                                                style={{ background: '#f3f4f6', border: 'none', color: '#4b5563', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredShipments.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>No matching shipments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Shipment Update Modal */}
            <AnimatePresence>
                {showModal && selectedShipment && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '95%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800' }}>Logistics Override</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FaTimes /></button>
                            </div>

                             <div style={{ marginBottom: '2rem' }}>
                                 <label style={labelStyle}>Update Status</label>
                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                     {['CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(status => (
                                         <button
                                             key={status}
                                             disabled={statusUpdating || selectedShipment.status === status || selectedShipment.status === 'DELIVERED' || selectedShipment.status === 'CANCELLED'}
                                             onClick={() => handleUpdateStatus(selectedShipment.orderId, status)}
                                             style={{
                                                 padding: '0.7rem',
                                                 borderRadius: '12px',
                                                 border: '1px solid #e2e8f0',
                                                 backgroundColor: selectedShipment.status === status ? 'var(--primary-green)' : '#fff',
                                                 color: selectedShipment.status === status ? '#fff' : 'var(--text-dark)',
                                                 fontWeight: '800',
                                                 fontSize: '0.75rem',
                                                 cursor: 'pointer',
                                                 transition: 'all 0.2s',
                                                 opacity: (statusUpdating || selectedShipment.status === 'DELIVERED' || selectedShipment.status === 'CANCELLED') ? 0.7 : 1
                                             }}
                                         >
                                             {status}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                            <div>
                                <label style={labelStyle}>Operational Remarks</label>
                                <textarea
                                    style={{ ...inputAreaStyle, resize: 'none' }}
                                    rows={3}
                                    placeholder="Enter dispatch notes, carrier info, or delay reasons..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>

                            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
                                ID: {selectedShipment.orderId} | AyurKisan Logistics Core
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '0.6rem', fontWeight: '800', fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', transition: 'all 0.2s', fontSize: '0.9rem', backgroundColor: '#fff' };
const inputAreaStyle = { ...inputStyle, width: '100%', padding: '0.9rem 1.25rem' };

export default ManageShipments;

