import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFileInvoiceDollar, FaChartLine, FaBox, FaArrowRight, FaBolt, FaWarehouse, FaShoppingCart, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import retailerService from '../utils/retailerService';
import { toast } from 'react-toastify';

// Professional B2B Hero Banners
const businessBanners = [
    { id: 1, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1200&h=400', title: 'Wholesale Herbal Wellness' },
    { id: 2, img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=1200&h=400', title: 'Premium Bulk Skincare Solutions' }
];

const RetailerDashboard = () => {
    const [stats, setStats] = useState({ monthlyOrders: 0, totalSpent: 0, boxesOrdered: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [quickOrderData, setQuickOrderData] = useState({ productId: '', quantity: '' });
    const [retailerName, setRetailerName] = useState('Partner');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const profileRes = await retailerService.getProfile(userId);
                setRetailerName(profileRes.data?.name?.split(' ')[0] || 'Partner');

                const ordersRes = await retailerService.getOrderHistory(userId);
                const orderData = ordersRes.data || [];

                // Calculate stats
                const spent = orderData.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
                const boxes = orderData.length * 10; // Mock calculation based on bulk nature

                setStats({
                    monthlyOrders: orderData.length,
                    totalSpent: spent,
                    boxesOrdered: boxes
                });
                setRecentOrders(orderData.slice(0, 3));
            }

            const prodRes = await retailerService.getAllProducts();
            setProducts(prodRes.data?.slice(0, 8) || []);

        } catch (error) {
            console.error("Retailer Dashboard fetch error:", error);
        }
    };

    const handleQuickOrder = (e) => {
        e.preventDefault();
        toast.info(`Quick order for ${quickOrderData.quantity} boxes added to cart.`);
        setQuickOrderData({ productId: '', quantity: '' });
    };

    return (
        <div style={dashboardWrapperStyle}>

            {/* Business Hero */}
            <div style={heroSectionStyle}>
                <div style={{ ...heroImageStyle, backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.2)), url(${businessBanners[0].img})` }}>
                    <div style={heroOverlayTextStyle}>
                        <h1 style={heroHeadingStyle}>Welcome back, {retailerName}</h1>
                        <p style={heroSubtextStyle}>Optimize your inventory with AyurKisan wholesale solutions.</p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <Link to="/products" style={heroBtnStyle}>Browse Wholesale</Link>
                            <button style={{ ...heroBtnStyle, backgroundColor: 'transparent', border: '1px solid #fff' }}>View Reports</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={mainContentStyle}>

                {/* Stats Overview */}
                <div style={statsGridStyle}>
                    <StatCard
                        title="Bulk Orders (MTD)"
                        value={stats.monthlyOrders}
                        icon={<FaFileInvoiceDollar size={24} />}
                        color="#38bdf8" bg="rgba(56, 189, 248, 0.1)"
                    />
                    <StatCard
                        title="Total Expenditure"
                        value={`₹${stats.totalSpent.toLocaleString()}`}
                        icon={<FaChartLine size={24} />}
                        color="#10b981" bg="rgba(16, 185, 129, 0.1)"
                    />
                    <StatCard
                        title="Stock Capacity"
                        value={`${stats.boxesOrdered} Boxes`}
                        icon={<FaBox size={24} />}
                        color="#f59e0b" bg="rgba(245, 158, 11, 0.1)"
                    />
                </div>

                <div style={twoColumnGridStyle}>

                    {/* Left: Analytics & Quick Order */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Analytics Chart */}
                        <div style={sectionCardStyle}>
                            <h3 style={sectionTitleStyle}>Purchase Analytics</h3>
                            <div style={chartContainerStyle}>
                                <div style={barWrapperStyle}>
                                    <div style={{ ...barStyle, height: '60%' }} /> <span style={barLabelStyle}>Q1</span>
                                </div>
                                <div style={barWrapperStyle}>
                                    <div style={{ ...barStyle, height: '40%' }} /> <span style={barLabelStyle}>Q2</span>
                                </div>
                                <div style={barWrapperStyle}>
                                    <div style={{ ...barStyle, height: '85%', backgroundColor: '#38bdf8' }} /> <span style={barLabelStyle}>Active</span>
                                </div>
                            </div>
                            <p style={chartHelperTextStyle}>Purchasing volume is up 12% from last month.</p>
                        </div>

                        {/* Quick Order Widget */}
                        <div style={{ ...sectionCardStyle, background: '#1e293b', color: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <FaBolt color="#f59e0b" size={20} />
                                <h3 style={{ ...sectionTitleStyle, color: '#fff', margin: 0 }}>Quick Bulk Entry</h3>
                            </div>
                            <form onSubmit={handleQuickOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    type="text"
                                    placeholder="SKU or Product Name"
                                    style={businessInputStyle}
                                    value={quickOrderData.productId}
                                    onChange={(e) => setQuickOrderData({ ...quickOrderData, productId: e.target.value })}
                                    required
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="number"
                                        placeholder="Boxes"
                                        style={{ ...businessInputStyle, flex: 1 }}
                                        value={quickOrderData.quantity}
                                        onChange={(e) => setQuickOrderData({ ...quickOrderData, quantity: e.target.value })}
                                        required
                                    />
                                    <button type="submit" style={quickOrderBtnStyle}>Order</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Recent Activity */}
                    <div style={sectionCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={sectionTitleStyle}>Recent Bulk Consignments</h3>
                            <Link to="/retailer/orders" style={seeAllLinkStyle}>Review all</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                                <div key={i} style={orderRowStyle}>
                                    <div>
                                        <div style={orderIdStyle}>{order.orderId || `BLK-${order.id}`}</div>
                                        <div style={orderDateStyle}>{order.orderDate || 'Recent'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={orderAmountStyle}>₹{(order.totalAmount || 0).toLocaleString()}</div>
                                        <div style={orderStatusStyle(order.orderStatus)}>{order.orderStatus}</div>
                                    </div>
                                </div>
                            )) : <p style={{ color: '#94a3b8' }}>No bulk history available.</p>}
                        </div>
                    </div>

                </div>

                {/* Wholesale Catalog Grid */}
                <div style={{ marginTop: '40px' }}>
                    <h2 style={catalogHeadingStyle}>Wholesale Catalog Overview</h2>
                    <div style={catalogGridStyle}>
                        {products.map(prod => (
                            <motion.div whileHover={{ y: -5 }} key={prod.id} style={productCardStyle}>
                                <div style={{ ...productImageContainerStyle, height: '160px', overflow: 'hidden' }}>
                                    <img
                                        src={prod.productImage1 || prod.imageUrl || 'https://via.placeholder.com/200?text=Herbal+Item'}
                                        alt={prod.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={productInfoStyle}>
                                    <Link to={`/product/${encodeURIComponent(prod.name)}`} style={{ textDecoration: 'none' }}>
                                        <h4 style={productNameStyle}>{prod.name}</h4>
                                    </Link>
                                    <div style={pricingDivStyle}>
                                        <div style={priceLabelStyle}>Wholesale Box (10 pcs)</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={priceValueStyle}>₹{(prod.price * 10 * 0.7).toLocaleString()}</div>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{(prod.price * 10).toLocaleString()}</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>
                                            BUSINESS SAVINGS: 30% OFF
                                        </div>
                                    </div>
                                    <button
                                        style={addToCartBtnStyle}
                                        onClick={() => toast.success(`${prod.name} box added to wholesale cart.`)}
                                    >
                                        Add to Consignment
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Stat Card Helper ---
const StatCard = ({ title, value, icon, color, bg }) => (
    <motion.div whileHover={{ scale: 1.02 }} style={{ ...statCardStyle, borderLeft: `4px solid ${color}` }}>
        <div style={{ ...statIconStyle, color, backgroundColor: bg }}>{icon}</div>
        <div>
            <div style={statTitleStyle}>{title}</div>
            <div style={statValueStyle}>{value}</div>
        </div>
    </motion.div>
);

// --- Styles ---

const dashboardWrapperStyle = {
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    paddingBottom: '60px'
};

const heroSectionStyle = {
    height: '320px',
    backgroundColor: '#0f172a',
    position: 'relative',
    overflow: 'hidden'
};

const heroImageStyle = {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: '0 60px'
};

const heroOverlayTextStyle = {
    maxWidth: '600px',
    color: '#fff',
    zIndex: 1
};

const heroHeadingStyle = {
    fontSize: '2.4rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-1px'
};

const heroSubtextStyle = {
    fontSize: '1.1rem',
    color: '#94a3b8',
    marginTop: '10px'
};

const heroBtnStyle = {
    padding: '12px 24px',
    borderRadius: '6px',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    border: 'none'
};

const mainContentStyle = {
    maxWidth: '1400px',
    margin: '-60px auto 0 auto',
    padding: '0 40px',
    position: 'relative',
    zIndex: 2
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
};

const statCardStyle = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
};

const statIconStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const statTitleStyle = {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '4px'
};

const statValueStyle = {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#0f172a'
};

const twoColumnGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '24px',
    alignItems: 'start'
};

const sectionCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
};

const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 20px 0'
};

const chartContainerStyle = {
    height: '180px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderBottom: '2px solid #f1f5f9',
    marginBottom: '15px'
};

const barWrapperStyle = {
    width: '45px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative'
};

const barStyle = {
    width: '100%',
    backgroundColor: '#cbd5e1',
    borderRadius: '6px 6px 0 0',
};

const barLabelStyle = {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: '8px'
};

const chartHelperTextStyle = {
    fontSize: '0.8rem',
    color: '#64748b',
    margin: 0
};

const businessInputStyle = {
    backgroundColor: '#334155',
    border: '1px solid #475569',
    padding: '12px',
    borderRadius: '8px',
    color: '#fff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
};

const quickOrderBtnStyle = {
    padding: '0 20px',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer'
};

const seeAllLinkStyle = {
    fontSize: '0.85rem',
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '600'
};

const orderRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #f1f5f9'
};

const orderIdStyle = {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#0f172a'
};

const orderDateStyle = {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '2px'
};

const orderAmountStyle = {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a'
};

const orderStatusStyle = (status) => ({
    fontSize: '0.75rem',
    fontWeight: '800',
    color: status === 'DELIVERED' ? '#10b981' : '#38bdf8',
    textTransform: 'uppercase'
});

const catalogHeadingStyle = {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 24px 0'
};

const catalogGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
};

const productCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9'
};

const productImageContainerStyle = {
    height: '180px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const productInfoStyle = {
    padding: '20px'
};

const productNameStyle = {
    margin: '0 0 12px 0',
    fontSize: '1rem',
    color: '#0f172a'
};

const pricingDivStyle = {
    marginBottom: '20px'
};

const priceLabelStyle = {
    fontSize: '0.75rem',
    color: '#64748b',
    marginBottom: '2px'
};

const priceValueStyle = {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0f172a'
};

const addToCartBtnStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
};

export default RetailerDashboard;
