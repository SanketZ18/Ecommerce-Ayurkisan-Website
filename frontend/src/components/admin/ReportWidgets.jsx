import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Package, DollarSign } from 'lucide-react';

const ReportWidgets = ({ stats }) => {
    const widgets = [
        { label: 'Total Sales Today', value: `₹${stats.salesToday || 0}`, icon: DollarSign, color: '#059669', bg: '#ecfdf5' },
        { label: 'Sales This Week', value: `₹${stats.salesThisWeek || 0}`, icon: TrendingUp, color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Best Product', value: stats.bestSellingProduct || 'N/A', icon: ShoppingBag, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Best Package', value: stats.bestSellingPackage || 'N/A', icon: Package, color: '#8b5cf6', bg: '#f5f3ff' },
    ];

    return (
        <div style={gridStyle}>
            {widgets.map((w, i) => (
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    style={{
                        ...cardStyle,
                        borderLeft: `4px solid ${w.color}`
                    }}
                >
                    <div style={{ ...iconContainerStyle, backgroundColor: w.bg, color: w.color }}>
                        <w.icon size={20} />
                    </div>
                    <div>
                        <p style={labelStyle}>{w.label}</p>
                        <h4 style={valueStyle}>{w.value}</h4>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem'
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '1.25rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    border: '1px solid #f3f4f6'
};

const iconContainerStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const labelStyle = {
    margin: 0,
    fontSize: '0.85rem',
    color: '#6b7280',
    fontWeight: '500'
};

const valueStyle = {
    margin: '0.25rem 0 0 0',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#111827'
};

export default ReportWidgets;
