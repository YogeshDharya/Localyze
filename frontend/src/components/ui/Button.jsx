import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', isLoading = false, className = '', disabled, ...props }) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  return (
    <button 
      className={`${baseClass} flex items-center justify-center gap-2 ${className} disabled:opacity-70 disabled:cursor-not-allowed`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
