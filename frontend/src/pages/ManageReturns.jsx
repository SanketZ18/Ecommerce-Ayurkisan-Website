import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUndo, FaCheckCircle, FaTimesCircle, FaClock, FaCommentDots, FaReply, FaTimes, FaUser, FaCalendarAlt, FaUserFriends, FaStore, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import adminService from '../utils/adminService';

const ManageReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [remarks, setRemarks] = useState('');

    const [activeTab, setActiveTab] = useState('Customer');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllReturns();
            // Sort by Date Descending
            const sorted = (Array.isArray(res.data) ? res.data : []).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setReturns(sorted);
        } catch (err) {
            toast.error("Failed to fetch returns");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setStatusUpdating(true);
            await adminService.updateReturnStatus(orderId, newStatus, remarks);
            toast.success(`Return status updated to ${newStatus}`);
            fetchReturns();
            setShowModal(false);
        } catch (err) {
            toast.error("Failed to update return status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'REFUNDED': case 'ACCEPTED': return { bg: '#dcfce7', color: '#166534', icon: FaCheckCircle };
            case 'PICKED_UP': return { bg: '#dbeafe', color: '#1e40af', icon: FaClock };
            case 'REJECTED': return { bg: '#fee2e2', color: '#991b1b', icon: FaTimesCircle };
            default: return { bg: '#fef08a', color: '#854d0e', icon: FaClock };
        }
    };

    const filteredReturns = useMemo(() => {
        return returns.filter(ret => {
            const matchesTab = ret.role?.toLowerCase() === activeTab.toLowerCase();
            const matchesSearch = !searchTerm ||
                ret.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                ret.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ret.reason?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [returns, activeTab, searchTerm]);

    const groupedReturns = useMemo(() => {
        const groups = {};
        filteredReturns.forEach(ret => {
            const date = new Date(ret.createdAt).toLocaleDateString(undefined, {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const today = new Date().toLocaleDateString(undefined, {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const displayDate = date === today ? "Today" : date;

            if (!groups[displayDate]) groups[displayDate] = [];
            groups[displayDate].push(ret);
        });
        return groups;
    }, [filteredReturns]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Return Requests...</div>;

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaUndo style={{ color: 'var(--primary-green)' }} /> Reverse Logistics
                </h1>
                <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Approve, reject, and process customer return requests.</p>
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

                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder="Search Return Request..."
                        style={{ ...inputStyle, paddingLeft: '2.5rem', width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grouped Returns List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Object.keys(groupedReturns).length > 0 ? Object.entries(groupedReturns).map(([date, items]) => (
                    <div key={date}>
                        <h3 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCalendarAlt /> {date} <span style={{ backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>{items.length} Requests</span>
                        </h3>
                        <div style={{ backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Request ID</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Customer</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Reason</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800' }}>Status</th>
                                        <th style={{ padding: '1.2rem 1.5rem', fontWeight: '800', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((ret) => {
                                        const status = getStatusStyle(ret.status);
                                        return (
                                            <tr key={ret.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1.2rem 1.5rem', fontWeight: '700', color: 'var(--primary-green)' }}>#{ret.orderId}</td>
                                                <td style={{ padding: '1.2rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <FaUser style={{ color: '#9ca3af', fontSize: '0.8rem' }} />
                                                        <span style={{ fontWeight: '600' }}>{ret.customerName}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.2rem 1.5rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>{ret.reason}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ret.comments}</div>
                                                </td>
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
                                                        fontWeight: '800'
                                                    }}>
                                                        <status.icon /> {ret.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => { setSelectedReturn(ret); setRemarks(ret.remarks || ''); setShowModal(true); }}
                                                        style={{ background: 'var(--primary-green)', border: 'none', color: '#fff', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                                    >
                                                        <FaReply /> Process
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                        <h2 style={{ color: '#64748b' }}>No {activeTab} return requests found.</h2>
                    </div>
                )}
            </div>

            {/* Return Process Modal */}
            <AnimatePresence>
                {showModal && selectedReturn && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '95%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--text-dark)', fontWeight: '800' }}>Process Return</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FaTimes /></button>
                            </div>

                            <div style={{ padding: '1.25rem', backgroundColor: '#f9fafb', borderRadius: '18px', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-green)', fontWeight: '800', marginBottom: '8px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                    <FaCommentDots /> Request Context
                                </div>
                                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{selectedReturn.reason}</div>
                                <div style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>"{selectedReturn.comments}"</div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Decision</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                                    {['ACCEPTED', 'REJECTED', 'PICKED_UP', 'REFUNDED'].map(status => (
                                        <button
                                            key={status}
                                            disabled={statusUpdating || selectedReturn.status === status}
                                            onClick={() => handleUpdateStatus(selectedReturn.orderId, status)}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                backgroundColor: selectedReturn.status === status ? 'var(--primary-green)' : '#fff',
                                                color: selectedReturn.status === status ? '#fff' : 'var(--text-dark)',
                                                fontWeight: '800',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                opacity: statusUpdating ? 0.7 : 1
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Admin Notes / Remarks</label>
                                <textarea
                                    style={{ ...inputAreaStyle, resize: 'none' }}
                                    rows={3}
                                    placeholder="Enter reason for rejection or pickup coordinates..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>

                            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
                                Order ID: {selectedReturn.orderId} | AyurKisan Resolution Center
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

export default ManageReturns;

