import React from 'react';
import './ChatProductCard.css';

const ChatProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="chat-product-card">
            <div className="chat-product-image">
                <img src={product.productImage1} alt={product.productName} />
            </div>
            <div className="chat-product-info">
                <h4>{product.productName}</h4>
                <div className="chat-product-price">
                    <span className="price">₹{product.price}</span>
                    {product.discount > 0 && <span className="discount">-{product.discount}%</span>}
                </div>
                <div className="chat-product-actions">
                    <button onClick={() => onAddToCart(product)} className="chat-add-btn">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatProductCard;
