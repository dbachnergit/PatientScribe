import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles = 'flex-row items-center justify-center rounded-xl';

  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-accent',
    outline: 'bg-transparent border-2 border-primary',
    ghost: 'bg-transparent',
    destructive: 'bg-recording',
  };

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-5',
  };

  const textVariantStyles = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary',
    ghost: 'text-primary',
    destructive: 'text-white',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className
      )}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#2D3A6E' : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            className={cn(
              'font-semibold',
              textVariantStyles[variant],
              textSizeStyles[size],
              icon && 'ml-2'
            )}
          >
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
