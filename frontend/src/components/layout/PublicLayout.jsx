import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PublicLayout = ({ children, onLoginClick, onSignUpClick }) => {
    return (
        <div className="public-layout">
            <Header onLoginClick={onLoginClick} onSignUpClick={onSignUpClick} />
            <main className="main-content" style={{ minHeight: '80vh' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
