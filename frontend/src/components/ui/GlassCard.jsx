import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`glass rounded-xl p-6 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
