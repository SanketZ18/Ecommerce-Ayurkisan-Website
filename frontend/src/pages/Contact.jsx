import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
    FaPhone, FaEnvelope, FaWhatsapp, FaMapMarkerAlt,
    FaPaperPlane, FaBuilding, FaSeedling, FaClock, FaDownload, FaChevronDown, FaChevronUp
} from "react-icons/fa";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Select",
        subject: "",
        message: ""
    });

    const [faq1Open, setFaq1Open] = useState(false);
    const [faq2Open, setFaq2Open] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalMessage = `Phone: ${form.phone}\nRole: ${form.role}\n\nMessage:\n${form.message}`;
            const payload = {
                name: form.name,
                email: form.email,
                subject: form.subject,
                message: finalMessage
            };
            await axios.post('http://localhost:9090/api/contact/submit', payload);
            toast.success("Message sent successfully! We will get back to you soon.");
            setForm({ name: "", email: "", phone: "", role: "Select", subject: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#F9FAFB", fontFamily: "'Inter', sans-serif" }}>
            {/* HER0 SECTION */}
            <motion.div style={heroContainer} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div style={heroContent}>
                    <div style={{ flex: 1, paddingRight: "40px" }}>
                        <p style={{ color: "var(--primary-green)", fontWeight: 600, letterSpacing: "1px", fontSize: "0.85rem", textTransform: "uppercase" }}>Get In Touch</p>
                        <h1 style={{ fontSize: "3rem", fontWeight: 800, color: "var(--text-dark)", lineHeight: 1.2, margin: "10px 0 20px 0" }}>
                            We are just a call, mail or message away.
                        </h1>
                        <p style={{ color: "#4B5563", fontSize: "1.05rem", marginBottom: "30px", lineHeight: 1.6 }}>
                            Whether you are a buyer, a farmer or a partner, reach out to Ayurkisan for product enquiries, collaborations or general questions.
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px" }}>
                            <span style={pillStyle}>Export & domestic enquiries</span>
                            <span style={pillStyle}>Farmer partnership</span>
                            <span style={pillStyle}>WhatsApp support</span>
                        </div>

                        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={iconCircleOrange}><FaPhone color="#fff" /></div>
                                <div>
                                    <p style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>Call Us</p>
                                    <p style={{ fontWeight: 600, color: "var(--text-dark)" }}>+91 98765 43210</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={iconCircleWhite}><FaEnvelope color="var(--primary-green)" /></div>
                                <div>
                                    <p style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 600, textTransform: "uppercase" }}>Mail Us</p>
                                    <p style={{ fontWeight: 600, color: "var(--text-dark)" }}>support@ayurkisan.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: "0 0 400px", position: "relative" }}>
                        <div style={floatingIcon}><FaPhone /></div>
                        <div style={businessCard}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "5px", color: "var(--text-dark)" }}>Business Hours</h3>
                            <p style={{ color: "#4B5563", fontSize: "0.95rem", marginBottom: "25px" }}>Monday - Saturday<br />10:00 AM - 6:00 PM (IST)</p>

                            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "5px", color: "var(--text-dark)" }}>Head Office</h3>
                            <p style={{ color: "#4B5563", fontSize: "0.95rem", marginBottom: "15px", lineHeight: 1.5 }}>
                                Ayurkisan Naturals,<br />
                                123 Heritage Road, Wellness District,<br />
                                Pune - 411038, Maharashtra, India
                            </p>

                            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                                <span style={tagStyle}><FaMapMarkerAlt /> Registered Exporter</span>
                                <span style={tagStyle}><FaSeedling /> Farmer First</span>
                            </div>
                        </div>
                        <div style={floatingIconBottom}><FaBuilding /></div>
                    </div>
                </div>
            </motion.div>

            <motion.div style={{ padding: "80px 2%", width: "100%", boxSizing: "border-box", margin: "0 auto", textAlign: "center" }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "10px" }}>Contact Channels</h2>
                <div style={{ width: "60px", height: "3px", backgroundColor: "var(--primary-green)", margin: "0 auto 20px auto" }}></div>
                <p style={{ color: "#4B5563", marginBottom: "50px" }}>Choose the contact path that suits you best. Our team will respond as quickly as possible.</p>

                <div style={gridContainer}>
                    <div style={channelCard}>
                        <div style={{ ...channelIcon, backgroundColor: "#3B82F6" }}><FaPhone color="#fff" /></div>
                        <h3 style={channelTitle}>General & Product Enquiries</h3>
                        <p style={channelText}>For information on herbal supplements, seeds, oils, volumes and availability.</p>
                        <a href="tel:+919876543210" style={{ color: "#3B82F6", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>Call: +91 98765 43210</a>
                    </div>

                    <div style={channelCard}>
                        <div style={{ ...channelIcon, backgroundColor: "#F97316" }}><FaPaperPlane color="#fff" /></div>
                        <h3 style={channelTitle}>Export / Import Queries</h3>
                        <p style={channelText}>For export orders, documentation, packing specs and long-term supply programs.</p>
                        <a href="mailto:export@ayurkisan.com" style={{ color: "#3B82F6", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>Email: export@ayurkisan.com</a>
                    </div>

                    <div style={channelCard}>
                        <div style={{ ...channelIcon, backgroundColor: "#22C55E" }}><FaSeedling color="#fff" /></div>
                        <h3 style={channelTitle}>Farmers & Growers</h3>
                        <p style={channelText}>Interested in collaborating with Ayurkisan as a grower? Share your farm details.</p>
                        <a href="#" style={{ color: "#3B82F6", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>Write to us</a>
                    </div>

                    <div style={channelCard}>
                        <div style={{ ...channelIcon, backgroundColor: "#8B5CF6" }}><FaWhatsapp color="#fff" /></div>
                        <h3 style={channelTitle}>WhatsApp Support</h3>
                        <p style={channelText}>Share quick questions, photos or updates regarding products, deliveries and shipments.</p>
                        <a href="https://wa.me/1234567890" style={{ color: "#3B82F6", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>Chat on WhatsApp</a>
                    </div>
                </div>
            </motion.div>

            {/* FORM AND MAP SECTION */}
            <motion.div style={{ backgroundColor: "#F0F4F8", padding: "80px 5%" }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "40px" }}>

                    {/* LEFT FORM */}
                    <div style={{ flex: "1 1 600px", backgroundColor: "#fff", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "10px" }}>Send us a message</h2>
                        <p style={{ color: "#6B7280", marginBottom: "30px", fontSize: "0.95rem" }}>Fill this form and our team will get back to you with the right details.</p>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input type="text" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required style={inputStyle} />
                                </div>
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    <label style={labelStyle}>Email *</label>
                                    <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    <label style={labelStyle}>Phone / WhatsApp *</label>
                                    <input type="text" name="phone" placeholder="+91 ..." value={form.phone} onChange={handleChange} required style={inputStyle} />
                                </div>
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    <label style={labelStyle}>I am a *</label>
                                    <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
                                        <option value="Select">Select</option>
                                        <option value="Customer">Customer</option>
                                        <option value="Retailer">Retailer/Wholesaler</option>
                                        <option value="Farmer">Farmer</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Subject *</label>
                                <input type="text" name="subject" placeholder="Short summary of your enquiry" value={form.subject} onChange={handleChange} required style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Message *</label>
                                <textarea name="message" placeholder="Share details of your requirement, destination, tentative volumes, etc." rows="5" value={form.message} onChange={handleChange} required style={{ ...inputStyle, resize: "vertical" }} />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                                <input type="checkbox" id="updateCheck" style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                                <label htmlFor="updateCheck" style={{ fontSize: "0.85rem", color: "#4B5563", cursor: "pointer" }}>I would like to receive occasional updates about Ayurkisan products.</label>
                            </div>

                            <button type="submit" style={submitBtn} disabled={loading}>
                                {loading ? "Sending..." : "Send Message"} <FaPaperPlane />
                            </button>
                        </form>
                    </div>

                    {/* RIGHT MAP/INFO */}
                    <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ borderRadius: "16px", padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", height: "300px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#E5E7EB" }}>
                            {/* Placeholder for Map */}
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "10px" }}>Locate our office</h2>
                            <p style={{ color: "#6B7280" }}>Pune, Maharashtra, India</p>
                            <div style={{ width: "100%", height: "100%", border: "2px dashed #CBD5E1", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", color: "#94A3B8" }}>Google Map Embed</div>
                        </div>

                        <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "flex", gap: "15px" }}>
                                <FaClock color="#3B82F6" size={20} style={{ marginTop: "3px" }} />
                                <div>
                                    <h4 style={{ fontWeight: 700, color: "var(--text-dark)", marginBottom: "5px" }}>Response Time</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.5 }}>Within 24 working hours for emails and form submissions.</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "15px" }}>
                                <FaDownload color="#3B82F6" size={20} style={{ marginTop: "3px" }} />
                                <div>
                                    <h4 style={{ fontWeight: 700, color: "var(--text-dark)", marginBottom: "5px" }}>Brochure</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.5, marginBottom: "10px" }}>Download full product and process details from our brochure.</p>
                                    <a href="#" style={{ color: "#3B82F6", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>Download brochure</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>



            {/* CALL TO ACTION BANNER */}
            <motion.div style={{ background: "linear-gradient(90deg, #1D4ED8, #16A34A)", padding: "60px 5%", color: "#fff", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "30px" }} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <div style={{ flex: "1 1 500px" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "10px" }}>Let's build a reliable supply chain together.</h2>
                    <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>Talk to us about long-term programs, seasonal loads or trial shipments.</p>
                </div>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <a href="tel:+919876543210" style={btnWhite}>
                        <FaPhone /> Call Now
                    </a>
                    <a href="https://wa.me/1234567890" style={btnOutlineGreen}>
                        <FaWhatsapp /> Chat on WhatsApp
                    </a>
                </div>
            </motion.div>

        </div>
    );
};

export default Contact;

// STYLES

const heroContainer = {
    padding: "80px 5% 100px 5%",
    background: "radial-gradient(circle at top right, #e0f2fe, #f0fdf4, #f9fafb)",
    position: "relative",
    overflow: "hidden"
};

const heroContent = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "50px"
};

const pillStyle = {
    padding: "5px 15px",
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "20px",
    fontSize: "0.85rem",
    color: "#4B5563",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
};

const iconCircleOrange = {
    width: "40px", height: "40px", borderRadius: "50%",
    backgroundColor: "#F97316", display: "flex", justifyContent: "center", alignItems: "center",
    boxShadow: "0 4px 10px rgba(249, 115, 22, 0.3)"
};

const iconCircleWhite = {
    width: "40px", height: "40px", borderRadius: "50%",
    backgroundColor: "#fff", border: "1px solid #E5E7EB", display: "flex", justifyContent: "center", alignItems: "center"
};

const businessCard = {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    position: "relative",
    zIndex: 2
};

const floatingIcon = {
    position: "absolute",
    top: "-20px",
    right: "-20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#3B82F6",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    zIndex: 3,
    boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)"
};

const floatingIconBottom = {
    position: "absolute",
    bottom: "-20px",
    left: "40%",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--primary-green)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    boxShadow: "0 5px 15px rgba(16, 185, 129, 0.3)"
};

const tagStyle = {
    fontSize: "0.8rem",
    padding: "5px 10px",
    backgroundColor: "#F0FDF4",
    color: "var(--primary-green)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: 600
};

const gridContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px"
};

const channelCard = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
    textAlign: "left",
    border: "1px solid #F3F4F6",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    ":hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.08)"
    }
};

const channelIcon = {
    width: "45px", height: "45px", borderRadius: "10px",
    display: "flex", justifyContent: "center", alignItems: "center",
    fontSize: "1.2rem", marginBottom: "20px"
};

const channelTitle = {
    fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "10px"
};

const channelText = {
    fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.5, marginBottom: "20px"
};

const labelStyle = {
    display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "8px"
};

const inputStyle = {
    width: "100%", padding: "12px 15px", borderRadius: "8px", border: "1px solid #D1D5DB",
    fontSize: "0.95rem", color: "var(--text-dark)", outline: "none", transition: "border 0.2s"
};

const submitBtn = {
    padding: "14px 25px", backgroundColor: "var(--primary-green)", color: "#fff",
    border: "none", borderRadius: "30px", fontSize: "1rem", fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    alignSelf: "flex-start", marginTop: "10px", transition: "background 0.2s"
};

const faqItem = {
    backgroundColor: "#fff", borderRadius: "10px", marginBottom: "15px",
    border: "1px solid #E5E7EB", cursor: "pointer", overflow: "hidden"
};

const faqHeader = {
    padding: "20px 25px", display: "flex", justifyContent: "space-between", alignItems: "center"
};

const faqTitle = {
    fontWeight: 600, color: "var(--text-dark)", fontSize: "1.05rem"
};

const faqContent = {
    padding: "0 25px 20px 25px", color: "#6B7280", fontSize: "0.95rem", lineHeight: 1.6, textAlign: "left"
};

const btnWhite = {
    backgroundColor: "#fff", color: "var(--text-dark)", padding: "12px 25px",
    borderRadius: "30px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
    textDecoration: "none", transition: "transform 0.2s"
};

const btnOutlineGreen = {
    backgroundColor: "transparent", color: "#fff", border: "2px solid #fff",
    padding: "10px 25px", borderRadius: "30px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
    textDecoration: "none", transition: "background 0.2s"
};