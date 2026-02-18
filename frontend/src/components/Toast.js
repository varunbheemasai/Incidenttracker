import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const colorClass =
    type === 'error'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-green-50 border-green-200 text-green-700';

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-3 border rounded-lg shadow ${colorClass}`}>
        <div className="flex items-start justify-between space-x-4">
          <div>{message}</div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
