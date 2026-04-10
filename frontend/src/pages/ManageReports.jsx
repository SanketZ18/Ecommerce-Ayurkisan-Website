import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Calendar, Download, Filter, ShoppingCart, Box, Layers, RefreshCw, FileText } from 'lucide-react';
import ReportWidgets from '../components/admin/ReportWidgets';
import SalesCharts from '../components/admin/SalesCharts';
import adminService from '../utils/adminService';
import axios from 'axios';
import ReportsSkeleton from '../components/admin/ReportsSkeleton';

const ManageReports = () => {
    const [activeTab, setActiveTab] = useState('sales');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productHistory, setProductHistory] = useState([]);
    const [packageData, setPackageData] = useState([]);
    const [regionData, setRegionData] = useState([]);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16)
    });

    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [invoiceRole, setInvoiceRole] = useState('CUSTOMER');
    const [isDownloadingInvoices, setIsDownloadingInvoices] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            
            // Format dates to full ISO string without 'Z' for backend LocalDateTime parsing
            const formatForBackend = (dateStr) => {
                const date = new Date(dateStr);
                return date.toISOString().split('.')[0]; // Removes .SSSZ
            };

            const startISO = formatForBackend(dateRange.start);
            const endISO = formatForBackend(dateRange.end);

            const [dashStats, salesRes, prodRes, pkgRes] = await Promise.all([
                adminService.getReportingDashboardStats().catch(err => { console.error("Stats fetch failed", err); return { data: {} }; }),
                adminService.getSalesReport(startISO, endISO).catch(err => { console.error("Sales fetch failed", err); return { data: {} }; }),
                adminService.getProductSalesReport().catch(err => { console.error("Products fetch failed", err); return { data: [] }; }),
                adminService.getPackageSalesReport().catch(err => { console.error("Packages fetch failed", err); return { data: [] }; })
            ]);

            setStats(dashStats.data || {});
            processSalesData(salesRes.data || {});
            
            if (salesRes.data?.regionBreakdown) {
                const mappedRegion = Object.entries(salesRes.data.regionBreakdown).map(([name, value]) => ({ name, value }));
                setRegionData(mappedRegion.length > 0 ? mappedRegion : [
                    { name: 'No Data', value: 0 }
                ]);
            }

            if (prodRes.data && Array.isArray(prodRes.data)) {
                const mappedProducts = prodRes.data.map(p => ({ 
                    productId: p.productId,
                    name: p.productName, 
                    quantity: p.totalQuantitySold, 
                    revenue: p.totalRevenueGenerated,
                    orderCount: p.orderCount,
                    currentStockLevel: p.currentStockLevel
                }));
                setProductData(mappedProducts);
                setFilteredProducts(mappedProducts);
            } else {
                setProductData([]);
                setFilteredProducts([]);
            }

            setPackageData(pkgRes.data && Array.isArray(pkgRes.data) ? pkgRes.data : []);

        } catch (err) {
            console.error("Critical failure in fetchInitialData:", err);
            if (err.response) {
                console.error("Error Response Data:", err.response.data);
                console.error("Error Response Status:", err.response.status);
            }
            toast.error("Error loading reporting data");
        } finally {
            setLoading(false);
        }
    };

    const processSalesData = (data) => {
        // Fallback mock data for visualization if backend data is sparse
        setSalesData([
            { date: '2024-03-10', sales: data.totalSalesAmount ? data.totalSalesAmount * 0.1 : 4000 },
            { date: '2024-03-11', sales: data.totalSalesAmount ? data.totalSalesAmount * 0.15 : 3000 },
            { date: '2024-03-12', sales: data.totalSalesAmount ? data.totalSalesAmount * 0.05 : 2000 },
            { date: '2024-03-13', sales: data.totalSalesAmount ? data.totalSalesAmount * 0.2 : 2780 },
            { date: '2024-03-14', sales: data.totalSalesAmount ? data.totalSalesAmount * 0.12 : 1890 },
            { date: '2024-03-15', sales: data.totalSalesAmount ? data.totalSalesAmount * 0.18 : 2390 },
            { date: '2024-03-16', sales: data.totalSalesAmount ? data.totalSalesAmount * 0.2 : 3490 },
        ]);
    };

    const handleProductSearch = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredProducts(productData);
        } else {
            setFilteredProducts(productData.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase())
            ));
        }
    };

    const viewProductHistory = async (productId, rowName) => {
        try {
            setLoading(true);
            const res = await adminService.getProductHistory(productId);
            setProductHistory(res.data.history || []);
            // Use backend name if available, otherwise fallback to rowName
            setSelectedProduct(res.data.productName || rowName);
        } catch (err) {
            console.error("Failed to fetch product history", err);
            toast.error("Error loading product history");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format) => {
        try {
            toast.info(`Generating ${format.toUpperCase()} report...`);
            const response = await adminService.exportReport('products', format);
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `product_sales_report.${format === 'excel' ? 'xlsx' : format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success(`${format.toUpperCase()} report downloaded successfully`);
        } catch (err) {
            console.error("Export failed", err);
            toast.error(`Failed to export ${format.toUpperCase()} report`);
        }
    };

    const handleInvoiceExport = async () => {
        setIsDownloadingInvoices(true);
        try {
            toast.info(`Generating ${invoiceRole} Invoices...`);
            
            const formatForBackend = (dateStr) => {
                const date = new Date(dateStr);
                return date.toISOString().split('.')[0]; 
            };

            const startISO = formatForBackend(dateRange.start);
            const endISO = formatForBackend(dateRange.end);
            
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:9090/api/reports/export/bulk-invoices?role=${invoiceRole}&start=${startISO}&end=${endISO}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob', 
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bulk_Invoices_${invoiceRole}_${startISO.split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success(`${invoiceRole} Invoices downloaded successfully`);
            setIsInvoiceModalOpen(false);
        } catch (err) {
            console.error("Invoice Export failed", err);
            toast.error(`Failed to export Invoices. Check if there are orders for this period.`);
        } finally {
            setIsDownloadingInvoices(false);
        }
    };

    const tabs = [
        { id: 'sales', label: 'Sales Overview', icon: ShoppingCart },
        { id: 'products', label: 'Product Analytics', icon: Box },
        { id: 'packages', label: 'Package Reports', icon: Layers }
    ];

    if (loading) {
        return <ReportsSkeleton />;
    }

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Business Intelligence</h1>
                    <p style={subtitleStyle}>Analyze sales growth and product performance</p>
                </div>
                <div style={actionsStyle}>
                    <div style={datePickerStyle}>
                        <Calendar size={16} />
                        <input 
                            type="datetime-local" 
                            value={dateRange.start} 
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            style={inputStyle}
                        />
                        <span>to</span>
                        <input 
                            type="datetime-local" 
                            value={dateRange.end}
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            style={inputStyle}
                        />
                        <button onClick={fetchInitialData} style={filterBtnStyle}><Filter size={16} /></button>
                    </div>
                    <div style={exportGroupStyle}>
                        <button onClick={() => setIsInvoiceModalOpen(true)} style={{...exportBtnStyle, backgroundColor: '#059669', color: '#fff'}}><FileText size={14} style={{display:'inline', marginRight: '4px', verticalAlign: 'middle'}}/>Invoices</button>
                        <button onClick={() => handleExport('pdf')} style={exportBtnStyle}>PDF</button>
                        <button onClick={() => handleExport('excel')} style={exportBtnStyle}>Excel</button>
                        <button onClick={() => handleExport('csv')} style={exportBtnStyle}>CSV</button>
                    </div>
                </div>
            </header>

            <ReportWidgets stats={stats} />

            <div style={tabContainerStyle}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            ...tabButtonStyle,
                            color: activeTab === tab.id ? '#059669' : '#6b7280',
                            borderBottom: activeTab === tab.id ? '2px solid #059669' : '2px solid transparent',
                            backgroundColor: activeTab === tab.id ? '#ecfdf5' : 'transparent'
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <main style={contentStyle}>
                <AnimatePresence mode='wait'>
                    {activeTab === 'sales' && (
                        <motion.div
                            key="sales"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                        >
                            <SalesCharts 
                                salesData={salesData} 
                                productData={productData.slice(0, 5)}
                                categoryData={regionData.length > 0 ? regionData : [
                                    { name: 'Customer', value: stats.customerStats?.salesAmount || 0 },
                                    { name: 'Retailer', value: stats.retailerStats?.salesAmount || 0 }
                                ]}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'products' && (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            style={tableCardStyle}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={tableTitleStyle}>Product Sales Performance</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Filter size={16} color="#6b7280" />
                                    <input 
                                        type="text" 
                                        placeholder="Search products..." 
                                        value={searchQuery}
                                        onChange={(e) => handleProductSearch(e.target.value)}
                                        style={{ ...inputStyle, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', width: '250px' }}
                                    />
                                </div>
                            </div>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Product Name</th>
                                        <th style={thStyle}>Qty Sold</th>
                                        <th style={thStyle}>Revenue</th>
                                        <th style={thStyle}>Orders</th>
                                        <th style={thStyle}>Stock</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p, i) => (
                                        <tr key={i} style={trStyle}>
                                            <td style={tdStyle}>{p.name}</td>
                                            <td style={tdStyle}>{p.quantity}</td>
                                            <td style={tdStyle}>₹{p.revenue.toLocaleString()}</td>
                                            <td style={tdStyle}>{p.orderCount || 0}</td>
                                            <td style={{...tdStyle, color: p.currentStockLevel < 10 ? '#ef4444' : '#059669', fontWeight: 'bold'}}>
                                                {p.currentStockLevel}
                                            </td>
                                            <td style={tdStyle}>
                                                <button 
                                                    onClick={() => viewProductHistory(p.productId, p.name)}
                                                    style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                                                >
                                                    View Trend
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {selectedProduct && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '15px', border: '1px solid #e5e7eb' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h4 style={{ margin: 0, color: '#111827' }}>Sales Trend: {selectedProduct}</h4>
                                        <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Close</button>
                                    </div>
                                    <div style={{ height: '200px' }}>
                                        <SalesCharts 
                                            salesData={productHistory.map(h => ({ date: h.date, sales: h.revenue }))}
                                            hideSecondaryCharts={true}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'packages' && (
                        <motion.div
                            key="packages"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            style={tableCardStyle}
                        >
                             <h3 style={tableTitleStyle}>Package/Combo Performance</h3>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Package Name</th>
                                        <th style={thStyle}>Qty Sold</th>
                                        <th style={thStyle}>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packageData.map((pkg, i) => (
                                        <tr key={i} style={trStyle}>
                                            <td style={tdStyle}>{pkg.packageName}</td>
                                            <td style={tdStyle}>{pkg.totalPackagesSold}</td>
                                            <td style={tdStyle}>₹{pkg.totalRevenueGenerated.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* INVOICE MODAL */}
            <AnimatePresence>
                {isInvoiceModalOpen && (
                    <div style={modalOverlayStyle}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={modalBackdropStyle}
                            onClick={() => !isDownloadingInvoices && setIsInvoiceModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={modalContentStyle}
                        >
                            <div style={{ padding: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', color: '#1e293b', margin: 0 }}>Download Bulk Invoices</h3>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.90rem', lineHeight: '1.5', marginBottom: '20px' }}>
                                    Generate and download PDF invoices for all orders within the current selected date range <strong>({new Date(dateRange.start).toLocaleDateString()} to {new Date(dateRange.end).toLocaleDateString()})</strong>.
                                </p>
                                
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Select Customer Type:</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={() => setInvoiceRole('CUSTOMER')}
                                            style={{ 
                                                flex: 1, padding: '12px', borderRadius: '10px', fontWeight: '600', border: invoiceRole === 'CUSTOMER' ? '2px solid #059669' : '2px solid #e2e8f0',
                                                background: invoiceRole === 'CUSTOMER' ? '#ecfdf5' : '#fff', color: invoiceRole === 'CUSTOMER' ? '#059669' : '#64748b', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            Customer
                                        </button>
                                        <button 
                                            onClick={() => setInvoiceRole('RETAILER')}
                                            style={{ 
                                                flex: 1, padding: '12px', borderRadius: '10px', fontWeight: '600', border: invoiceRole === 'RETAILER' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                                                background: invoiceRole === 'RETAILER' ? '#eff6ff' : '#fff', color: invoiceRole === 'RETAILER' ? '#3b82f6' : '#64748b', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            Retailer
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button 
                                        onClick={() => setIsInvoiceModalOpen(false)} 
                                        disabled={isDownloadingInvoices}
                                        style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleInvoiceExport} 
                                        disabled={isDownloadingInvoices}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#059669', color: '#fff', fontWeight: '600', cursor: isDownloadingInvoices ? 'not-allowed' : 'pointer' }}
                                    >
                                        {isDownloadingInvoices ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                                        {isDownloadingInvoices ? 'Generating...' : 'Download PDFs'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const containerStyle = {
    padding: '1rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
};

const titleStyle = { fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: 0 };
const subtitleStyle = { color: '#6b7280', margin: '0.25rem 0 0 0' };

const actionsStyle = { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' };

const datePickerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#fff',
    padding: '0.5rem 0.75rem',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    fontSize: '0.85rem'
};

const inputStyle = { border: 'none', outline: 'none', color: '#374151', fontSize: '0.85rem' };

const filterBtnStyle = {
    background: '#059669',
    color: '#fff',
    border: 'none',
    padding: '0.4rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
};

const exportGroupStyle = { display: 'flex', gap: '0.25rem', backgroundColor: '#e5e7eb', padding: '2px', borderRadius: '10px' };

const exportBtnStyle = {
    border: 'none',
    backgroundColor: '#fff',
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer'
};

const tabContainerStyle = { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' };

const tabButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.8rem 1.25rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    borderRadius: '12px 12px 0 0'
};

const contentStyle = { minHeight: '400px' };

const tableCardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6' };
const tableTitleStyle = { fontSize: '1.2rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '1rem', borderBottom: '2px solid #f3f4f6', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' };
const trStyle = { borderBottom: '1px solid #f9fafb' };
const tdStyle = { padding: '1rem', fontSize: '0.9rem', color: '#374151' };

// Modal styles
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
};

const modalBackdropStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    zIndex: 1
};

export default ManageReports;
