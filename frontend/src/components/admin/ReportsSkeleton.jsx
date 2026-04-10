import React from 'react';
import Skeleton from '../common/Skeleton';

const ReportsSkeleton = () => {
    return (
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header Skeleton */}
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <Skeleton type="title" width="250px" height="1.8rem" />
                    <Skeleton type="text" width="350px" style={{ marginTop: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Skeleton type="rect" width="300px" height="40px" borderRadius="12px" />
                    <Skeleton type="rect" width="200px" height="40px" borderRadius="10px" />
                </div>
            </header>

            {/* Widgets Skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <Skeleton type="rect" width="40px" height="40px" borderRadius="10px" />
                            <Skeleton type="rect" width="60px" height="20px" borderRadius="10px" />
                        </div>
                        <Skeleton type="text" width="50%" />
                        <Skeleton type="text" width="70%" height="1.5rem" />
                    </div>
                ))}
            </div>

            {/* Tabs Skeleton */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} type="rect" width="150px" height="45px" borderRadius="12px 12px 0 0" />
                ))}
            </div>

            {/* Content Area Skeleton */}
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #f3f4f6', minHeight: '400px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Skeleton type="title" width="300px" />
                </div>
                
                {/* Mock Chart Area */}
                <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '20px' }}>
                    {[...Array(12)].map((_, i) => (
                        <Skeleton key={i} type="rect" width="100%" height={`${Math.random() * 80 + 20}%`} borderRadius="4px 4px 0 0" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsSkeleton;
