import React from 'react';
import './ProcessingOverlay.css';

/**
 * A glassmorphic overlay to show processing status.
 * Should be used inside a container with 'position: relative'.
 */
const ProcessingOverlay = ({ message = "Processing..." }) => {
    return (
        <div className="processing-overlay">
            <div className="processing-spinner"></div>
            <p className="processing-text">{message}</p>
        </div>
    );
};

export default ProcessingOverlay;
