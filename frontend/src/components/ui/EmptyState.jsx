import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass rounded-xl w-full h-full min-h-[300px]">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
          <Icon size={32} className="text-primary-500" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary px-6 py-2 rounded-lg font-medium shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
