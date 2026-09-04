import toast from 'react-hot-toast';

const baseStyle = {
  borderRadius: '16px',
  padding: '12px 16px',
  backdropFilter: 'blur(16px)',
  fontSize: '14px',
  fontWeight: '500',
};

export const showToast = {
  success: (message) =>
    toast.success(message, {
      style: {
        ...baseStyle,
        background: 'rgba(34, 197, 94, 0.15)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        color: '#16a34a',
      },
      iconTheme: { primary: '#16a34a', secondary: '#fff' },
    }),

  error: (message) =>
    toast.error(message, {
      style: {
        ...baseStyle,
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#dc2626',
      },
      iconTheme: { primary: '#dc2626', secondary: '#fff' },
    }),

  info: (message) =>
    toast(message, {
      icon: 'ℹ️',
      style: {
        ...baseStyle,
        background: 'rgba(59, 130, 246, 0.15)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: '#2563eb',
      },
    }),

  loading: (message) =>
    toast.loading(message, {
      style: {
        ...baseStyle,
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(200, 200, 200, 0.3)',
        color: '#374151',
      },
    }),
};
