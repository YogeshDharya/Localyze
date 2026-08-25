import React, { forwardRef } from 'react';

const Select = forwardRef(({ label, options = [], error, className = '', ...rest }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white 
          focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all
          ${error 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
