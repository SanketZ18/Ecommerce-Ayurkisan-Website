import React from 'react';
import './ChatProductCard.css';

const ChatProductCard = ({ product, onAddToCart }) => {
    // Determine which price to show as main and which as old
    const hasDiscount = product.discount > 0 || (product.finalPrice > 0 && product.finalPrice < product.price);
    const displayPrice = product.finalPrice > 0 ? product.finalPrice : product.price;

    return (
        <div className="chat-product-card">
            {product.type === 'PACKAGE' && <div className="chat-package-badge">Package</div>}
            <div className="chat-product-image">
                <img src={product.productImage1} alt={product.productName} />
            </div>
            <div className="chat-product-info">
                <h4>{product.productName}</h4>
                <div className="chat-product-price">
                    <span className="price">₹{displayPrice}</span>
                    {hasDiscount && (
                        <>
                            <span className="old-price">₹{product.price}</span>
                            {product.discount > 0 && <span className="discount">-{product.discount}%</span>}
                        </>
                    )}
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
