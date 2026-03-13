import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUndo, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import customerService from '../utils/customerService';

const CustomerReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const res = await customerService.getMyReturns();
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

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'REFUNDED': case 'ACCEPTED': return { bg: '#dcfce7', color: '#166534', icon: FaCheckCircle };
            case 'PICKED_UP': return { bg: '#dbeafe', color: '#1e40af', icon: FaClock };
            case 'REJECTED': return { bg: '#fee2e2', color: '#991b1b', icon: FaTimesCircle };
            default: return { bg: '#fef08a', color: '#854d0e', icon: FaClock };
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Return Requests...</div>;

    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FaUndo style={{ color: 'var(--primary-green)' }} /> My Returns
                </h1>
                <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Track your return requests and their statuses.</p>
            </motion.div>

            {returns.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {returns.map(ret => {
                        const status = getStatusStyle(ret.status);
                        return (
                            <motion.div
                                key={ret.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                    border: '1px solid #f1f5f9'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <strong style={{ color: 'var(--primary-green)' }}>Order #{ret.orderId}</strong>
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
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 'bold' }}>{ret.reason}</p>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>"{ret.comments}"</p>
                                {ret.remarks && (
                                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid var(--primary-green)' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Admin Remarks</div>
                                        <div style={{ fontSize: '0.85rem', color: '#334155' }}>{ret.remarks}</div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                    <h2 style={{ color: '#64748b' }}>No return requests found.</h2>
                </div>
            )}
        </div>
    );
};

export default CustomerReturns;
