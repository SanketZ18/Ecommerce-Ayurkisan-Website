import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoCloseOutline, IoSend, IoChatbubbleEllipsesSharp, IoTrashOutline } from "react-icons/io5";
import './ChatBot.css';
import './ChatProductCard.css';
import ChatProductCard from './ChatProductCard';
import { getUserId, getUserRole, isAuthenticated, getDecodedToken } from '../../utils/auth';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../utils/apiConfig';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [userName, setUserName] = useState('Guest');
    const [context, setContext] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const token = getDecodedToken();
            const name = token?.name || token?.sub || 'there';
            setUserName(name);
            setMessages([{ 
                type: 'bot', 
                text: `Hello **${name}**! I am your Ayurkisan Herbal Assistant. How can I help you today?`, 
                products: [], 
                options: ["About Ayurkisan", "Hair Care", "Skin Care", "Contact Us"] 
            }]);
        }
    }, [isOpen]);
    
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e, customMsg = null, isOption = false) => {
        if (e) e.preventDefault();
        const msg = customMsg || input;
        if (!msg.trim()) return;

        const newUserMessage = { type: 'user', text: msg };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const userId = getUserId() || 'guest';
            // Start advisor context if specific keywords found
            let currentContext = context;
            if (isOption) {
                currentContext = msg; // Use option as temporary context for selection
            }

            const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
                message: msg,
                userId: userId,
                userName: userName,
                context: currentContext
            });

            const botResponse = {
                type: 'bot',
                text: response.data.content,
                products: response.data.products || [],
                options: response.data.options || []
            };

            setMessages(prev => [...prev, botResponse]);
            
            // If the bot provides options, we might be starting a flow
            if (response.data.options && response.data.options.length > 0) {
                setContext(msg); // Set context to the concern (e.g., "Hair Fall")
            } else if (!response.data.options || response.data.options.length === 0) {
                // Clear context if flow finishes
                setContext('');
            }

        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I am having trouble connecting to my knowledge base. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        if (!isAuthenticated()) {
            toast.info("Please login to add items to your cart.");
            return;
        }

        try {
            const userId = getUserId();
            const role = getUserRole();
            // Using the existing Cart API structure from the README/Research
            await axios.post(`${API_BASE_URL}/cart/add?userId=${userId}&role=${role}&itemId=${product.id}&itemType=PRODUCT&quantity=1`);
            toast.success(`${product.productName} added to cart!`);
        } catch (error) {
            toast.error("Failed to add product to cart.");
        }
    };

    const handleClearChat = () => {
        const token = getDecodedToken();
        const name = token?.name || token?.sub || 'there';
        setUserName(name);
        setMessages([{ 
            type: 'bot', 
            text: `Hello **${name}**! I have cleared our previous conversation. How else can I help you?`, 
            products: [], 
            options: ["About Ayurkisan", "Hair Care", "Skin Care", "Contact Us"] 
        }]);
        setContext('');
    };

    const handleOptionSelect = (option) => {
        handleSendMessage(null, option, true);
    };

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    <IoChatbubbleEllipsesSharp />
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div>
                            <h3>Ayurkisan AI</h3>
                            <span>Herbal Expert</span>
                        </div>
                        <div className="header-actions">
                            <button className="btn-clear-chat" title="Clear Chat" onClick={handleClearChat}>
                                <IoTrashOutline />
                            </button>
                            <button className="btn-close-chat" onClick={() => setIsOpen(false)}>
                                <IoCloseOutline />
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-group ${msg.type}`}>
                                <div className={`message ${msg.type}`}>
                                    {msg.text.split('\n').map((line, i) => (
                                        <div key={i}>
                                            {line.split('**').map((part, j) => 
                                                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                {msg.products && msg.products.length > 0 && (
                                    <div className="chat-products-list">
                                        {msg.products.map(p => (
                                            <div 
                                                key={p.id} 
                                                className="chat-list-item" 
                                                onClick={() => window.location.href = `/${p.itemType === 'PACKAGE' ? 'package' : 'product'}/${p.id}`}
                                            >
                                                <img src={p.productImage1} alt={p.productName} className="chat-list-img" />
                                                <div className="chat-list-info">
                                                    <span className="chat-list-name">{p.productName}</span>
                                                    <span className="chat-list-price">₹{p.finalPrice || p.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {msg.options && msg.options.length > 0 && (
                                    <div className="options-container">
                                        {msg.options.map((opt, i) => (
                                            <button key={i} className="option-btn" onClick={() => handleOptionSelect(opt)}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && <div className="message bot typing">...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            placeholder="Ask me anything..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="send-btn">
                            <IoSend />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
