import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ label, error, rows = 4, className = '', ...rest }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
          focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-y
          ${error 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        {...rest}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
