import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1 mb-4">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <input 
        ref={ref}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
