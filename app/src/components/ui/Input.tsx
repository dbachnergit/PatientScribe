import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text className="text-primary font-semibold mb-2 text-base">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'bg-card border rounded-xl px-4 py-4 text-base text-primary',
          error ? 'border-recording' : 'border-input',
          className
        )}
        placeholderTextColor="#6B6966"
        {...props}
      />
      {error && (
        <Text className="text-recording text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
