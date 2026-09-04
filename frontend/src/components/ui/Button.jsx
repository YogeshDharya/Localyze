import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-slate-700/40 rounded-xl transition-all duration-200',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variants[variant]} ${variant === 'ghost' ? sizes[size] : ''} 
        inline-flex items-center justify-center gap-2 font-semibold
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
    </button>
  );
}
