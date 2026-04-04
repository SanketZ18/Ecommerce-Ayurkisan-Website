import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={spinnerContainer}>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>Loading Ayurkisan...</p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const spinnerContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
  width: '100%',
  gap: '1rem'
};

const spinnerStyle = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderTop: '5px solid var(--primary-green, #059669)',
  borderRadius: '50%',
  animation: 'spin 1.2s linear infinite'
};

const textStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: 'var(--text-light, #6b7280)',
  letterSpacing: '0.5px'
};

export default LoadingSpinner;
