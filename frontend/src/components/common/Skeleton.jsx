import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, width, height, style, borderRadius, className = '' }) => {
  const classes = `skeleton skeleton-${type} ${className}`;
  
  const customStyle = {
    width: width || undefined,
    height: height || undefined,
    borderRadius: borderRadius || undefined,
    ...style
  };

  return <div className={classes} style={customStyle}></div>;
};

export default Skeleton;
