import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 active:bg-blue-700',
    secondary:
      'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500 active:bg-gray-700',
    success:
      'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 active:bg-green-700',
    warning:
      'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 active:bg-yellow-700',
    danger:
      'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 active:bg-red-700',
    outline:
      'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500 active:bg-gray-100',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? <LoadingSpinner size="sm" /> : children}
      </div>
    </button>
  );
};
