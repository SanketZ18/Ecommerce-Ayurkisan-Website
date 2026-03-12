import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaHandshake, FaGlobe, FaCertificate, FaShieldAlt, FaCommentsDollar, FaChartLine, FaUsers, FaPhone, FaWhatsapp, FaBuilding } from 'react-icons/fa';

const About = () => {
    return (
        <div style={{ backgroundColor: "#F9FAFB", fontFamily: "'Inter', sans-serif", color: "var(--text-dark)" }}>

            {/* SECTION 2: STORY & MISSION */}
            <div style={sectionContainer}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>Our <span style={{ color: "#EAB308" }}>Story & Mission</span></h2>
                    <div style={titleUnderline}></div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
                    <div style={{ flex: "1 1 500px" }}>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>From a farmer's passion to a customer's trust.</h3>
                        <p style={{ color: "#4B5563", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                            Ayurkisan Naturals was born out of an implicit ambition—we wanted growing, excellent products, and consumer-getting first. To break the barrier of the local buyer, we decided to bridge the gap with exceptional management, transparent pricing, and reliable execution.
                        </p>
                        <p style={{ color: "#4B5563", lineHeight: 1.7, marginBottom: "3rem" }}>
                            Today, we work like an extension room for both our farmers and buyers—planning plantations, following quality protocols, coordinating packing, orchestrating shipments, and documentation for steady arrangements on Indian agri-commodities.
                        </p>

                        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: "200px" }}>
                                <h4 style={{ color: "var(--primary-green)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>Our Mission</h4>
                                <p style={{ color: "#4B5563", lineHeight: 1.6, fontSize: "0.95rem" }}>To empower farmers and delight buyers by building a dependable, transparent end-to-end natural produce ecosystem.</p>
                            </div>
                            <div style={{ flex: 1, minWidth: "200px" }}>
                                <h4 style={{ color: "var(--primary-green)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>Our Vision</h4>
                                <p style={{ color: "#4B5563", lineHeight: 1.6, fontSize: "0.95rem" }}>To be recognized as a trusted global brand for Indian fresh produce known for quality, consistency, and integrity.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: "1 1 400px" }}>
                        <div style={{ backgroundColor: "#F0FDF4", padding: "2rem", borderRadius: "16px", marginBottom: "2rem" }}>
                            <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>What defines us</h4>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <li style={listItem}><FaCertificate color="#EAB308" /> End-to-end supply chain integration</li>
                                <li style={listItem}><FaChartLine color="#EAB308" /> Proactive compliance and protocols</li>
                                <li style={listItem}><FaCommentsDollar color="#EAB308" /> Fast adaptation for global design</li>
                                <li style={listItem}><FaGlobe color="#EAB308" /> Export quality packing & handling</li>
                            </ul>
                        </div>
                        <div style={{ backgroundColor: "#EAB308", color: "#fff", padding: "1.5rem", borderRadius: "12px", borderLeft: "6px solid var(--primary-green)", fontWeight: 600, fontSize: "1.1rem", fontStyle: "italic", boxShadow: "0 10px 15px rgba(234, 179, 8, 0.2)" }}>
                            "We don't just sell produce; we sell COMMITMENTS."
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: FOUNDER & LEADERSHIP */}
            <div style={{ ...sectionContainer, backgroundColor: "#fff" }}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>Founder & <span style={{ color: "#EAB308" }}>Leadership</span></h2>
                    <div style={titleUnderline}></div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem" }}>
                    <div style={{ flex: "1 1 400px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                            <div style={{ width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#E5E7EB", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {/* Placeholder for Founder Image */}
                                <FaUsers size={40} color="#9CA3AF" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--primary-green)", marginBottom: "4px" }}>Mr. Surendra Kakade.</h3>
                                <p style={{ color: "#6B7280", fontSize: "0.95rem", fontWeight: 500 }}>Founder & Director, Ayurkisan Naturals</p>
                            </div>
                        </div>
                        <p style={{ color: "#4B5563", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                            Coming from an agricultural background, Mr. Surendra Kakade understands both the struggles of farmers and expectations of buyers. He believes in establishing long-term values, quality commitment, and fairness in a viable agritech.
                        </p>
                        <p style={{ color: "#4B5563", lineHeight: 1.7, marginBottom: "2rem", fontSize: "0.95rem" }}>
                            Under his guidance, Ayurkisan Naturals has developed a strong farmer network, reliable protocols, and long-term partnerships with domestic and international markets.
                        </p>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={linkedInBtn} className="hover-scale"><FaUsers /> LinkedIn Profile</a>
                            <a href="mailto:ceo@ayurkisan.com" style={emailBtn} className="hover-scale"><FaLeaf /> CEO Office</a>
                        </div>
                    </div>

                    <div style={{ flex: "1 1 500px", paddingLeft: "1rem", borderLeft: "2px solid #F3F4F6", position: "relative" }}>
                        <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "2rem" }}>Journey at a glance</h4>

                        <div style={timelineItem}>
                            <div style={timelineDot}></div>
                            <h5 style={timelineTitle}>Grassroot Foundation</h5>
                            <p style={timelineText}>Our agricultural domain starts right from the field, mastering plant anatomy and soil mechanics in the region.</p>
                        </div>
                        <div style={timelineItem}>
                            <div style={timelineDot}></div>
                            <h5 style={timelineTitle}>Farmer Network</h5>
                            <p style={timelineText}>Associated with growers over the years establishing end-to-end structures for crops like organic spices and herbs.</p>
                        </div>
                        <div style={timelineItem}>
                            <div style={timelineDot}></div>
                            <h5 style={timelineTitle}>Packhouse & Cold Chain</h5>
                            <p style={timelineText}>State of the art packhouse structure and operations framework in place for sorting, grading and cooling.</p>
                        </div>
                        <div style={{ ...timelineItem, paddingBottom: 0 }}>
                            <div style={{ ...timelineDot, backgroundColor: "#EAB308", borderColor: "#FEF08A" }}></div>
                            <h5 style={timelineTitle}>Global Reach</h5>
                            <p style={timelineText}>Successful export program execution across multiple continents with an ever-growing international presence.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: CORE VALUES */}
            <div style={{ ...sectionContainer, backgroundColor: "#F9FAFB" }}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>Our <span style={{ color: "#EAB308" }}>Core Values</span></h2>
                    <div style={titleUnderline}></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                    <div style={valueCard} className="hover-scale">
                        <div style={valueIcon}><FaShieldAlt color="#EAB308" size={30} /></div>
                        <h4 style={valueTitle}>Integrity</h4>
                        <p style={valueText}>Honest dealing with farmers, buyers and partners. We keep our commitments and own our actions.</p>
                    </div>
                    <div style={valueCard} className="hover-scale">
                        <div style={valueIcon}><FaCertificate color="#EAB308" size={30} /></div>
                        <h4 style={valueTitle}>Quality First</h4>
                        <p style={valueText}>We prioritize uncompromised grade and standard adherence to forge long-term relationships.</p>
                    </div>
                    <div style={valueCard} className="hover-scale">
                        <div style={valueIcon}><FaUsers color="#EAB308" size={30} /></div>
                        <h4 style={valueTitle}>Farmer Centric</h4>
                        <p style={valueText}>We work with farmers, guide them on farming processes, and establish systems for ethical practices.</p>
                    </div>
                    <div style={valueCard} className="hover-scale">
                        <div style={valueIcon}><FaLeaf color="#EAB308" size={30} /></div>
                        <h4 style={valueTitle}>Sustainability</h4>
                        <p style={valueText}>We encourage responsible use of water, soil, and inputs to protect the environment and future yields.</p>
                    </div>
                </div>
            </div>

            {/* SECTION 5: HOW WE WORK */}
            <div style={{ ...sectionContainer, backgroundColor: "#fff" }}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>How <span style={{ color: "#EAB308" }}>We Work</span></h2>
                    <div style={titleUnderline}></div>
                </div>
                <p style={{ textAlign: "center", color: "#6B7280", marginBottom: "3rem", fontSize: "1.05rem" }}>
                    A transparent multi-step field-driven protocol to source the best for global buyer requirements.
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", position: "relative" }}>
                    {/* Background connecting line (hidden on mobile realistically, but simplified here) */}

                    <div style={processStep} className="hover-lift">
                        <div style={processIcon}><FaLeaf color="#fff" size={20} /></div>
                        <h5 style={processTitle}>1. Farm Planning</h5>
                        <p style={processText}>We align production schedules to the buyer's demand, climate, and region-specific factors.</p>
                    </div>
                    <div style={processStep} className="hover-lift">
                        <div style={processIcon}><FaHandshake color="#fff" size={20} /></div>
                        <h5 style={processTitle}>2. Farmer Support</h5>
                        <p style={processText}>Regular visits with partner farmers supplying seeds, advice, handling, and quality supervision.</p>
                    </div>
                    <div style={processStep} className="hover-lift">
                        <div style={processIcon}><FaChartLine color="#fff" size={20} /></div>
                        <h5 style={processTitle}>3. Grading & Packing</h5>
                        <p style={processText}>Standardized sorting, quality audits, custom packaging, and box coding for tracking.</p>
                    </div>
                    <div style={processStep} className="hover-lift">
                        <div style={processIcon}><FaGlobe color="#fff" size={20} /></div>
                        <h5 style={processTitle}>4. Cold Chain</h5>
                        <p style={processText}>Temperature-controlled loading, storage, and transport back to loading ports.</p>
                    </div>
                    <div style={processStep} className="hover-lift">
                        <div style={processIcon}><FaShieldAlt color="#fff" size={20} /></div>
                        <h5 style={processTitle}>5. Port & Documentation</h5>
                        <p style={processText}>Phyto, certification, customs clearance and coordination for zero hassle export/forward logistics.</p>
                    </div>
                </div>
            </div>

            {/* SECTION 6: SOCIAL COMMITMENT */}
            <div style={{ ...sectionContainer, backgroundColor: "#F9FAFB" }}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>Social <span style={{ color: "#EAB308" }}>Commitment</span></h2>
                    <div style={titleUnderline}></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                    <div style={socialCard} className="hover-lift">
                        <h4 style={socialTitle}><FaUsers color="var(--primary-green)" /> Supporting Education</h4>
                        <p style={socialText}>
                            We contribute to government and private schools by distributing books and supporting educational initiatives for children from farmer families.
                        </p>
                        <p style={{ ...socialText, marginBottom: 0 }}>
                            It is our core conviction that next-generation requires valid opportunities while staying connected to their agricultural roots.
                        </p>
                    </div>
                    <div style={socialCard} className="hover-lift">
                        <h4 style={socialTitle}><FaBuilding color="#3B82F6" /> Farm Infrastructure</h4>
                        <p style={socialText}>
                            Investments setting up safe storage sheds, farm tools, pack-house facilities in the Solapur regions to strengthen farmer post-harvest.
                        </p>
                        <p style={{ ...socialText, marginBottom: 0 }}>
                            These initiatives prevent supply chain waste thereby saving farmer revenues and constantly building total resource.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 7: HIGHLIGHTS & ACHIEVEMENTS */}
            <div style={{ ...sectionContainer, backgroundColor: "#fff" }}>
                <div style={sectionHeader}>
                    <h2 style={sectionTitle}>Highlights & <span style={{ color: "#EAB308" }}>Achievements</span></h2>
                    <div style={titleUnderline}></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
                    <div>
                        <h4 style={{ color: "var(--primary-green)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Quality focus</h4>
                        <p style={highlightText}>Award-winning facility for consistent excellence. Best in class transparency in production and tracking.</p>
                    </div>
                    <div>
                        <h4 style={{ color: "var(--primary-green)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Growing farmer network</h4>
                        <p style={highlightText}>An expanding base of associated farmers across multiple states, ensuring year-round supply for standardized fresh product.</p>
                    </div>
                    <div>
                        <h4 style={{ color: "var(--primary-green)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Market reach</h4>
                        <p style={highlightText}>Experience in catering to different markets with their own grading, quality, and documentation policies.</p>
                    </div>
                    <div>
                        <h4 style={{ color: "var(--primary-green)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Infrastructure</h4>
                        <p style={highlightText}>Internal SOPs for pre-cooling, chilling, grading, packing logic rules and loading templates for massive land states.</p>
                    </div>
                </div>
            </div>

            {/* SECTION 8: BOTTOM CTA BANNER */}
            <div style={{ background: "linear-gradient(90deg, #16a34a, #047857)", padding: "4rem 5%", color: "#fff", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "2rem" }}>
                <div style={{ flex: "1 1 500px" }}>
                    <h2 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Let's work together.</h2>
                    <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>Whether you are a buyer, a farmer, or a partner, we would be happy to connect and explore how we can work together.</p>
                </div>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <Link to="/feedback" style={btnYellow} className="btn-hover-bright">
                        <FaPhone /> Talk to our team
                    </Link>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" style={btnOutlineWhite} className="btn-hover-bright">
                        <FaWhatsapp /> WhatsApp Us
                    </a>
                </div>
            </div>

        </div>
    );
};

export default About;

// STYLES



const sectionContainer = {
    padding: "5rem 5%",
    maxWidth: "1200px",
    margin: "0 auto"
};

const sectionHeader = {
    textAlign: "center",
    marginBottom: "4rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const sectionTitle = {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "var(--text-dark)",
    marginBottom: "1rem"
};

const titleUnderline = {
    width: "60px",
    height: "4px",
    backgroundColor: "var(--primary-green)",
    borderRadius: "2px"
};

const listItem = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    fontWeight: 500,
    color: "#374151"
};

const linkedInBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#F0FDF4",
    color: "var(--primary-green)",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: "20px",
    textDecoration: "none",
    fontSize: "0.9rem"
};

const emailBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff",
    color: "#4B5563",
    border: "1px solid #E5E7EB",
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: "20px",
    textDecoration: "none",
    fontSize: "0.9rem"
};

const timelineItem = {
    position: "relative",
    paddingLeft: "2rem",
    paddingBottom: "2rem",
    borderLeft: "2px solid #E5E7EB"
};

const timelineDot = {
    position: "absolute",
    left: "-7px",
    top: "0",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "3px solid var(--primary-green)"
};

const timelineTitle = {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text-dark)",
    marginBottom: "0.5rem",
    marginTop: "-3px"
};

const timelineText = {
    fontSize: "0.95rem",
    color: "#6B7280",
    lineHeight: 1.6
};

const valueCard = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
    border: "1px solid #F3F4F6",
    transition: "transform 0.3s"
};

const valueIcon = {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    backgroundColor: "#FEF9C3", // Light yellow
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1.5rem"
};

const valueTitle = {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "1rem"
};

const valueText = {
    color: "#6B7280",
    fontSize: "0.95rem",
    lineHeight: 1.6
};

const processStep = {
    flex: "1 1 180px",
    backgroundColor: "#F9FAFB",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const processIcon = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#EAB308",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem"
};

const processTitle = {
    fontWeight: 700,
    fontSize: "1rem",
    marginBottom: "0.5rem"
};

const processText = {
    fontSize: "0.85rem",
    color: "#6B7280",
    lineHeight: 1.5
};

const socialCard = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid #F3F4F6",
    boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
};

const socialTitle = {
    fontSize: "1.2rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "1rem"
};

const socialText = {
    color: "#4B5563",
    fontSize: "0.95rem",
    lineHeight: 1.7,
    marginBottom: "1rem"
};

const highlightText = {
    fontSize: "0.95rem",
    color: "#4B5563",
    lineHeight: 1.6
};

const btnYellow = {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#EAB308",
    color: "var(--text-dark)",
    fontWeight: 700,
    padding: "12px 24px",
    borderRadius: "30px",
    textDecoration: "none",
    transition: "transform 0.2s"
};

const btnOutlineWhite = {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "2px solid #fff",
    fontWeight: 600,
    padding: "10px 24px",
    borderRadius: "30px",
    textDecoration: "none",
    transition: "background 0.2s"
};