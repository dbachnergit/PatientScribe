import React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

export function Card({
  children,
  variant = 'default',
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-card',
    bordered: 'bg-card border border-border',
    elevated: 'bg-card shadow-md',
  };

  return (
    <View
      className={cn(
        'rounded-2xl p-4',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
