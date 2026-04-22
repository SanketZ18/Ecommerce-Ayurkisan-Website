import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaLeaf, FaBoxOpen } from 'react-icons/fa';
import customerService from '../../utils/customerService';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardSearch = ({ placeholder = "Search for products, health packages..." }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ products: [], packages: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allItems, setAllItems] = useState({ products: [], packages: [] });
    
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Fetch all items on mount to enable fast local search
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [prodRes, pkgRes] = await Promise.all([
                    customerService.getAllProducts(),
                    customerService.getAllPackages()
                ]);
                setAllItems({
                    products: prodRes.data || [],
                    packages: pkgRes.data || []
                });
            } catch (err) {
                console.error("Search fetch error", err);
            }
        };
        fetchAll();

        // Close suggestions on click outside
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter results as user types
    useEffect(() => {
        if (query.trim().length > 0) {
            const lowerQuery = query.toLowerCase();
            const filteredProducts = (allItems.products || []).filter(p => 
                p.productName?.toLowerCase().includes(lowerQuery) || 
                p.description?.toLowerCase().includes(lowerQuery) ||
                p.brand?.toLowerCase().includes(lowerQuery)
            ).slice(0, 5);

            const filteredPackages = (allItems.packages || []).filter(p => 
                p.packageName?.toLowerCase().includes(lowerQuery) || 
                p.description?.toLowerCase().includes(lowerQuery)
            ).slice(0, 3);

            setResults({ products: filteredProducts, packages: filteredPackages });
            setShowSuggestions(true);
        } else {
            setResults({ products: [], packages: [] });
            setShowSuggestions(false);
        }
    }, [query, allItems]);

    const handleSelect = (id, type) => {
        const path = type === 'product' ? `/product/${id}` : `/package/${id}`;
        navigate(path);
        setQuery('');
        setShowSuggestions(false);
    };

    const highlightMatch = (text, query) => {
        if (!query || !text) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    part.toLowerCase() === query.toLowerCase() 
                        ? <b key={i} style={{ color: '#e67e22', fontWeight: 'bold' }}>{part}</b> 
                        : part
                )}
            </span>
        );
    };

    const handleSearchAction = () => {
        if (results.products.length > 0) {
            handleSelect(results.products[0].id, 'product');
        } else if (results.packages.length > 0) {
            handleSelect(results.packages[0].id, 'package');
        } else if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={searchRef} style={containerStyle}>
            <div className="search-bar-amazon" style={searchBarWrapperStyle}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setShowSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchAction()}
                    placeholder={placeholder}
                    style={inputStyle}
                />
                
                <div style={actionsContainerStyle}>
                    {query && (
                        <FaTimes 
                            style={clearIconStyle} 
                            onClick={() => setQuery('')}
                        />
                    )}
                    <button style={searchButtonStyle} onClick={handleSearchAction}>
                        <FaSearch />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showSuggestions && (results.products.length > 0 || results.packages.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={suggestionsBoxStyle}
                    >
                        {results.products.length > 0 && (
                            <div style={sectionStyle}>
                                <div style={sectionHeaderStyle}>
                                    <FaLeaf style={{ marginRight: '8px', color: '#4caf50' }} />
                                    Products
                                </div>
                                {results.products.map(product => (
                                    <div 
                                        key={product.id} 
                                        className="suggestion-item"
                                        style={suggestionItemStyle}
                                        onClick={() => handleSelect(product.id, 'product')}
                                    >
                                        <img src={product.productImage1} alt="" style={thumbnailStyle} />
                                        <div style={itemContentStyle}>
                                            <div style={itemNameStyle}>{highlightMatch(product.productName, query)}</div>
                                            <div style={itemMetaStyle}>₹{product.price} • {product.brand}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {results.packages.length > 0 && (
                            <div style={sectionStyle}>
                                <div style={sectionHeaderStyle}>
                                    <FaBoxOpen style={{ marginRight: '8px', color: '#ff9800' }} />
                                    Health Packages
                                </div>
                                {results.packages.map(pkg => (
                                    <div 
                                        key={pkg.id} 
                                        className="suggestion-item"
                                        style={suggestionItemStyle}
                                        onClick={() => handleSelect(pkg.id, 'package')}
                                    >
                                        <div style={pkgIconStyle}><FaBoxOpen size={14} /></div>
                                        <div style={itemContentStyle}>
                                            <div style={itemNameStyle}>{highlightMatch(pkg.packageName, query)}</div>
                                            <div style={itemMetaStyle}>₹{pkg.price} • {pkg.packageType}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const containerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '550px',
};

const searchBarWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '6px',
    overflow: 'hidden',
    height: '40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #ddd'
};

const inputStyle = {
    flex: 1,
    padding: '0 12px',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#333',
    height: '100%',
    backgroundColor: 'transparent'
};

const actionsContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
};

const clearIconStyle = {
    color: '#999',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '10px',
};

const searchButtonStyle = {
    backgroundColor: '#febd69', // Amazon Yellow
    border: 'none',
    width: '45px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#333',
    fontSize: '16px',
    transition: 'background-color 0.2s',
};

const suggestionsBoxStyle = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    border: '1px solid #ddd',
    overflow: 'hidden',
    zIndex: 1000,
};

const sectionStyle = {
    padding: '5px 0',
};

const sectionHeaderStyle = {
    padding: '8px 15px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#777',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
};

const suggestionItemStyle = {
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
};

const thumbnailStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    objectFit: 'cover',
    backgroundColor: '#f5f5f5',
};

const pkgIconStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: '#fff3e0',
    color: '#ff9800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const itemContentStyle = {
    flex: 1,
    minWidth: 0,
};

const itemNameStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const itemMetaStyle = {
    fontSize: '12px',
    color: '#666',
};

// CSS Injection for pseudo-classes
if (typeof document !== 'undefined') {
    const styleId = 'dashboard-search-styles-v2';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .search-bar-amazon:focus-within {
                box-shadow: 0 0 0 2px #febd69 !important;
                border-color: #febd69 !important;
            }
            .suggestion-item:hover {
                background-color: #f3f3f3 !important;
            }
            .search-bar-amazon button:hover {
                background-color: #f3a847 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

export default DashboardSearch;
