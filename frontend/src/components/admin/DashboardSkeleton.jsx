import React from 'react';
import Skeleton from '../common/Skeleton';
import { motion } from 'framer-motion';

const DashboardSkeleton = () => {
    return (
        <div style={{ padding: '2rem 3%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header Skeleton */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Skeleton type="title" width="300px" height="2.5rem" />
                    <Skeleton type="text" width="400px" />
                </div>
                <Skeleton type="rect" width="180px" height="45px" borderRadius="12px" />
            </div>

            {/* Stats Grid Skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[...Array(8)].map((_, idx) => (
                    <div key={idx} style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #f3f4f6' }}>
                        <Skeleton type="rect" width="50px" height="50px" borderRadius="14px" style={{ marginBottom: '1.25rem' }} />
                        <Skeleton type="text" width="60%" height="0.95rem" style={{ marginBottom: '0.5rem' }} />
                        <Skeleton type="text" width="80%" height="1.8rem" />
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Recent Activity Table Skeleton */}
                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', border: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <Skeleton type="title" width="200px" />
                        <Skeleton type="rect" width="100px" height="35px" borderRadius="10px" />
                    </div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '20px', padding: '1.2rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <Skeleton type="rect" width="15%" height="20px" />
                            <Skeleton type="rect" width="40%" height="20px" />
                            <Skeleton type="rect" width="20%" height="20px" />
                            <Skeleton type="rect" width="25%" height="30px" borderRadius="10px" />
                        </div>
                    ))}
                </div>

                {/* Quick Management Skeleton */}
                <div style={{ backgroundColor: '#1E1E1E', borderRadius: '20px', padding: '2rem' }}>
                    <Skeleton type="title" width="200px" style={{ marginBottom: '1.5rem', background: '#333' }} />
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} type="rect" width="100%" height="60px" borderRadius="12px" style={{ background: '#2a2a2a' }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Inventory Alerts Skeleton */}
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', border: '1px solid #f3f4f6', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <Skeleton type="title" width="300px" />
                    <Skeleton type="rect" width="120px" height="25px" borderRadius="20px" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
                            <Skeleton type="rect" width="45px" height="45px" borderRadius="8px" />
                            <div style={{ flex: 1 }}>
                                <Skeleton type="text" width="80%" />
                                <Skeleton type="text" width="50%" height="0.75rem" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
