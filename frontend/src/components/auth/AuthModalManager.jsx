import React from 'react';
import LoginModal from './LoginModal';
import SignUpSelection from './SignUpSelection';
import CustomerRegistration from './CustomerRegistration';
import RetailerRegistration from './RetailerRegistration';
import ForgotPasswordModal from './ForgotPasswordModal';

const AuthModalManager = ({ currentModal, setAuthModal, onClose }) => {

    // Manage which component gets rendered based on state string
    const renderModalContent = () => {
        switch (currentModal) {
            case 'login':
                return (
                    <LoginModal 
                        onClose={onClose} 
                        onSwitchToSignUp={() => setAuthModal('signupSelect')} 
                        onForgotPassword={() => setAuthModal('forgotPassword')}
                    />
                );
            case 'forgotPassword':
                return <ForgotPasswordModal onClose={onClose} onSwitchToLogin={() => setAuthModal('login')} />;
            case 'signupSelect':
                return (
                    <SignUpSelection
                        onClose={onClose}
                        onSelectCustomer={() => setAuthModal('customerSignup')}
                        onSelectRetailer={() => setAuthModal('retailerSignup')}
                        onSwitchToLogin={() => setAuthModal('login')}
                    />
                );
            case 'customerSignup':
                return <CustomerRegistration onClose={onClose} onSwitchToLogin={() => setAuthModal('login')} />;
            case 'retailerSignup':
                return <RetailerRegistration onClose={onClose} onSwitchToLogin={() => setAuthModal('login')} />;
            default:
                return null;
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
            {/* Prevent clicks inside modal from closing the overlay */}
            <div onClick={(e) => e.stopPropagation()}>
                {renderModalContent()}
            </div>
        </div>
    );
};

export default AuthModalManager;
