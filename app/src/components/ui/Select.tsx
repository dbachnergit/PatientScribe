import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  error?: string;
  containerClassName?: string;
}

export function Select({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onValueChange,
  error,
  containerClassName,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text className="text-primary font-semibold mb-2 text-base">
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={cn(
          'bg-card border rounded-xl px-4 py-4 flex-row items-center justify-between',
          error ? 'border-recording' : 'border-input'
        )}
        activeOpacity={0.7}
      >
        <Text
          className={cn(
            'text-base',
            selectedOption ? 'text-primary' : 'text-muted'
          )}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown size={20} color="#6B6966" />
      </TouchableOpacity>

      {error && (
        <Text className="text-recording text-sm mt-1">{error}</Text>
      )}

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
            <Text className="text-xl font-bold text-primary">
              {label || 'Select'}
            </Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text className="text-accent font-semibold text-base">Done</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onValueChange(item.value);
                  setIsOpen(false);
                }}
                className="flex-row items-center justify-between px-4 py-4 border-b border-input"
                activeOpacity={0.7}
              >
                <Text
                  className={cn(
                    'text-base',
                    item.value === value ? 'text-accent font-semibold' : 'text-primary'
                  )}
                >
                  {item.label}
                </Text>
                {item.value === value && (
                  <Check size={20} color="#5B7FE1" />
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
