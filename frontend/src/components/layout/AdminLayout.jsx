import React, { useState } from 'react';
import Sidebar from '../admin/Sidebar';
import { clearAuthData } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        clearAuthData();
        window.location.href = '/';
    };

    return (
        <div style={layoutStyle}>
            <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />
            <div style={{ ...mainContentStyle, marginLeft: isSidebarOpen ? '250px' : '0' }}>
                <header style={topbarStyle}>
                    <button onClick={toggleSidebar} style={toggleBtnStyle}>
                        <FaBars size={24} />
                    </button>
                    <h2>Admin Dashboard</h2>
                </header>
                <main style={contentStyle}>
                    {children}
                </main>
            </div>
        </div>
    );
};

const layoutStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6'
};

const mainContentStyle = {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
};

const topbarStyle = {
    height: '60px',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const toggleBtnStyle = {
    background: 'none',
    marginRight: '15px',
    color: '#059669',
    display: 'flex',
    alignItems: 'center'
};

const contentStyle = {
    padding: '20px',
    flex: 1,
    overflowY: 'auto'
};

export default AdminLayout;
